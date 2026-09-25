import { Figure, Callout, Code, Compare } from "@/components/blog";
import { HarnessLayers, AgentLoop, PermissionGate, TraceWaterfall } from "./_figures/agent-harness-figures";

export default function Post() {
  return (
    <>
      <p>
        When people demo an agent, they show the model. When an agent fails in production, the model is rarely
        the cause. The usual culprits are a tool that returned 40 KB of JSON, a retry loop with no exit, a prompt
        that silently lost the one fact that mattered, or a write that should have waited for a person.
      </p>
      <p>
        Most of my time as a forward deployed AI engineer goes into the code around the model call. That code has a name
        now: the <strong>harness</strong>. I&apos;ve come to think the harness is the actual product, and the model
        is a component you can swap out.
      </p>

      <h2>The model is a function</h2>
      <p>
        Strip away the branding and an LLM call is a pure function. You send a list of messages and a list of tool
        schemas. You get back one message. Nothing persists between calls. The model has no memory of the last
        request, no clock and no way to touch the world.
      </p>
      <p>
        Everything that makes an agent feel like an agent lives outside that function. Something has to decide what
        goes into the messages. Something has to notice that the reply contains a tool call, run it, and send the
        result back. Something has to decide that the agent is finished, or stuck, or about to do something it
        shouldn&apos;t.
      </p>

      <Figure
        label="Fig. 1"
        caption="The model sits at the center and is the smallest part of the system. Each layer around it is code you write and own."
      >
        <HarnessLayers />
      </Figure>

      <p>
        When I scope a new agent, I go through these layers from the inside out. What does the model need to see?
        Which tools does it need, and which ones are dangerous? Where does a person need to approve an action? What
        happens when the process dies halfway through? How will I know it&apos;s working a month from now?
      </p>

      <h2>The loop</h2>
      <p>
        At its core every agent runs the same loop. It assembles context, calls the model, runs any tools the
        model asked for, appends the results and checks whether it should stop. Here is the smallest version I
        would put in front of real data:
      </p>

      <Code lang="python" title="agent.py">{`
def run_agent(task: str, tools: ToolRegistry, max_steps: int = 25, budget_usd: float = 2.0):
    messages = [{"role": "user", "content": task}]
    spent = 0.0

    for step in range(max_steps):
        response = model.invoke(
            system=SYSTEM_PROMPT,
            tools=tools.schemas(),
            messages=messages,
        )
        spent += cost_of(response.usage)
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason != "tool_use":
            return response.text                      # the model says it's done

        results = []
        for call in response.tool_calls:
            if tools.needs_approval(call) and not ask_human(call):
                results.append(tool_error(call, "Rejected by reviewer. Do not retry."))
                continue
            results.append(tools.dispatch(call))      # never raises

        messages.append({"role": "user", "content": results})

        if spent > budget_usd:
            return escalate("Budget exhausted", messages)

    return escalate("Hit max_steps without finishing", messages)
`}</Code>

      <p>A few lines in there do more work than they look like they do.</p>
      <ul>
        <li>
          <strong>The stop condition belongs to the model, with limits set by you.</strong> The loop ends when the
          model replies without asking for a tool. But you also cap the number of steps and the spend, because a
          confused model will keep calling tools politely for as long as you let it.
        </li>
        <li>
          <strong>
            <code>dispatch</code> never raises.
          </strong>{" "}
          A timeout, a 404 or a validation failure becomes a tool result the model can read. If the harness crashes
          instead, the model never gets the chance to change course.
        </li>
        <li>
          <strong>Escalation is a real exit.</strong> When the agent can&apos;t finish, it hands the transcript to a
          person with a reason attached. It doesn&apos;t guess, and it doesn&apos;t return a confident summary of
          work it never did.
        </li>
      </ul>

      <Figure
        label="Fig. 2"
        caption="One turn of the loop per lap. A healthy run exits through the green path. The others are guardrails you add before the first real user, not after the first incident."
      >
        <AgentLoop />
      </Figure>

      <h3>Budgets and failure</h3>
      <p>
        I treat failure as a normal code path, not an exception. Transient errors like rate limits and flaky
        upstream APIs get retries with exponential backoff inside the tool, where the model never sees them.
        Permanent errors go back to the model as clear text, so it can change its plan. Everything is bounded:
        step count, wall-clock time, tokens and dollars.
      </p>
      <p>
        One cheap check has saved me more than any prompt change: <strong>loop detection</strong>. If the model
        makes the same tool call with the same arguments three times, it&apos;s stuck. Stop the run and escalate. A
        fourth identical attempt won&apos;t turn up anything new.
      </p>

      <h2>What the loop depends on</h2>

      <h3>Tools: registry and dispatch</h3>
      <p>
        The registry is the harness&apos;s list of what the agent can do. Each entry has a name, a JSON schema for
        its arguments, a function to run it and some metadata the model never sees: timeout, side-effect tier, and
        whether a person must approve it. Dispatch looks up the tool, validates the arguments against the schema,
        runs it with a timeout and turns whatever happens into a compact result.
      </p>
      <p>
        Tool design deserves its own post, and it has one:{" "}
        <a href="/writing/tool-calling">tool calling is structured output with consequences</a>. The short version
        is that a few sharp tools beat many vague ones.
      </p>

      <h3>Context assembly</h3>
      <p>
        Before every model call, the harness builds the full input from scratch: the system prompt, tool schemas,
        conversation history, retrieved documents and any state the agent is tracking. This is the step that most
        affects answer quality, and the one that gets the least design attention.
      </p>
      <p>
        My rules of thumb: put stable content first (system prompt, then tools) so the provider can cache that
        prefix. Keep tool outputs small, and summarize or drop old ones once they&apos;ve been used. Retrieve
        narrowly: five relevant records beat fifty possibly relevant ones. I go deeper on this in{" "}
        <a href="/writing/context-management">context is a budget</a>.
      </p>

      <h3>Permissions and people</h3>
      <p>
        Not every action is equal. Searching a customer master is harmless. Merging two customer records is not.
        Most MDM platforms can technically unmerge, but by then downstream systems have already picked up the
        survivor record, and cleaning that up takes someone&apos;s afternoon.
      </p>
      <p>
        So the harness classifies every tool by side effect and puts a gate in front of the dangerous ones. Reads
        run automatically. Reversible writes run and get logged. Irreversible or external writes stop and wait for
        a person, who sees exactly what the agent wants to do and why.
      </p>

      <Figure
        label="Fig. 3"
        caption="An approval gate from a data stewardship flow. The agent did the research on its own. A person makes the one call that is expensive to undo, with the evidence in front of them."
      >
        <PermissionGate />
      </Figure>

      <Compare
        leftTitle="Gate in the prompt"
        rightTitle="Gate in the harness"
        left={
          <>
            &quot;Always ask the user before merging records.&quot; This works until the model decides this case is
            obvious enough to skip the check.
          </>
        }
        right={
          <>
            <code>merge_entities</code> is registered with <code>approval=&quot;required&quot;</code>. The model can
            propose a merge but has no way to run one without a person.
          </>
        }
      />

      <p>
        Instructions in the prompt are suggestions. Checks in the harness are guarantees. Anything that matters for
        safety or compliance goes in code.
      </p>

      <h2>Running it for real</h2>

      <h3>State and checkpoints</h3>
      <p>
        An approval gate creates a practical problem: the reviewer might click Approve in four seconds or four
        hours. You can&apos;t keep a process and its whole conversation in memory that long. The agent&apos;s state
        has to be saved outside the process and restored when the reviewer responds.
      </p>
      <p>
        This is where LangGraph earns its place in my stack. The graph checkpoints its state after every node, keyed
        by a thread ID. An <code>interrupt()</code> pauses the run, and resuming later picks up at exactly that node
        with the same state:
      </p>

      <Code lang="python" title="resume after approval">{`
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.types import Command

with PostgresSaver.from_conn_string(DB_URL) as saver:
    graph = builder.compile(checkpointer=saver)
    config = {"configurable": {"thread_id": "steward-run-8f2c"}}

    graph.invoke({"task": task}, config)   # runs until the approval node calls interrupt()

    # ...hours later, the reviewer clicks Approve in the UI
    graph.invoke(Command(resume={"approved": True}), config)
`}</Code>

      <p>
        Checkpoints give you two more things. Crash recovery: a deploy or an OOM mid-run no longer loses the work.
        And replay: you can load the state from step 6 of a bad run and see exactly what the model saw.
      </p>

      <h3>Observability</h3>
      <p>
        Every model call and tool call should be a span in a trace, with inputs, outputs, token counts, latency and
        cost attached. Without traces, debugging an agent means reading a 30-step transcript and guessing. With
        them, you can see where the time and money actually went.
      </p>

      <Figure
        label="Fig. 4"
        caption="A trace of one run. The model calls are fast and cheap. Most of the wall-clock time is a person reading the evidence, which tells you to improve the review screen rather than the prompt."
      >
        <TraceWaterfall />
      </Figure>

      <h3>Evals</h3>
      <p>
        The last layer is the one that lets you change the other layers safely. I keep a set of real tasks with
        known correct outcomes: these two records should merge, these two shouldn&apos;t, this one needs a person.
        Every change to the prompt, a tool description or the model version runs against that set before it ships.
      </p>
      <p>
        Grade with checks wherever you can. Did the agent call <code>merge_entities</code> on the right pair? Did it
        stay under budget? Did it escalate the ambiguous case? An LLM grader is fine for judging tone. For
        correctness I want an assertion.
      </p>

      <Callout title="Where I'd start">
        If you&apos;re building your first production agent, add these in order: <strong>step and cost limits</strong>,{" "}
        <strong>dispatch that never throws</strong>, <strong>tracing</strong>, <strong>an approval gate</strong> on
        anything irreversible, then <strong>a small eval set</strong>. Each one is less than a day of work, and each
        one heads off a type of incident I&apos;ve either seen or narrowly avoided.
      </Callout>

      <h2>The part you control</h2>
      <p>
        Models will keep getting better, and every upgrade will make a well-built harness look smarter for free.
        The reverse doesn&apos;t hold. A better model inside a sloppy harness is still an agent that loops, leaks
        context and merges the wrong records, just with nicer wording.
      </p>
      <p>
        So I spend my effort where it compounds: the loop, the tools, the context, the gates, the state, the
        traces and the evals. The model is the easy part to change, so I let it change.
      </p>
    </>
  );
}
