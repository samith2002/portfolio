import { Callout, Code } from "@/components/blog";
import {
  OffloadFlowFigure,
  ScratchpadFigure,
  SubAgentsFigure,
  TiersFigure,
} from "./_figures/context-offloading-figures";

export default function Post() {
  return (
    <>
      <p>
        In the <a href="/writing/context-management">previous post</a> I argued that the context window is a
        budget and that most agents overspend it. Trimming, compaction and per-section ceilings keep the
        spending in check. They don&apos;t fix the underlying tension, though. Real tasks produce far more
        state than any window should hold. An agent that resolves duplicates across a master data hub will
        touch thousands of records, produce long diffs, and make decisions it has to remember an hour later.
      </p>
      <p>
        Offloading is how you do big work with a small window. The agent keeps its state outside the context,
        in files, graph state, sub-agents and memory stores, and brings back only the slice it needs for the
        current step. This post covers the patterns I use, with code, and when I choose not to use them.
      </p>
      <p>The rule underneath all of it is short:</p>
      <blockquote>The window holds what the model needs to decide the next step. Everything else gets an address.</blockquote>

      <h2>Pattern 1: Big results become handles</h2>
      <p>
        The largest source of context bloat is tool output. The fix is to stop sending large output to the
        model at all. When a result is over a threshold, the tool writes it to storage and returns a handle
        instead: where the data lives, what shape it has, and a preview small enough to reason about.
      </p>

      <OffloadFlowFigure />

      <p>
        The model can still work with the data. It knows there are 2,314 rows, it knows the fields, and it has
        the top candidates. If it needs more, it asks for more, specifically. I implement this as a wrapper so
        individual tools don&apos;t have to know about it:
      </p>
      <Code lang="python" title="offload.py">{`
import json, uuid
from pathlib import Path

SCRATCH = Path("/scratch")          # or an S3 prefix per session
MAX_INLINE_TOKENS = 2_000

def offloaded(tool_fn, count_tokens, preview_rows=3):
    """Wrap a tool so large results are written to storage and replaced with a handle."""
    def wrapper(**kwargs):
        result = tool_fn(**kwargs)
        text = json.dumps(result, default=str)
        if count_tokens(text) <= MAX_INLINE_TOKENS:
            return result

        path = SCRATCH / f"{tool_fn.__name__}_{uuid.uuid4().hex[:6]}.jsonl"
        rows = result if isinstance(result, list) else [result]
        path.write_text("\\n".join(json.dumps(r, default=str) for r in rows))

        return {
            "saved_to": str(path),
            "rows": len(rows),
            "fields": sorted(rows[0].keys()) if rows and isinstance(rows[0], dict) else None,
            "preview": rows[:preview_rows],
            "hint": "Use read_slice(path, offset, limit) or grep_file(path, pattern) to inspect.",
        }
    wrapper.__name__ = tool_fn.__name__
    wrapper.__doc__ = tool_fn.__doc__
    return wrapper
`}</Code>
      <p>
        Three details make this work in practice. The <strong>preview is chosen</strong>, not arbitrary: for
        search results it&apos;s the top rows by score, and for a diff it&apos;s the conflicting fields. The{" "}
        <strong>hint names the tools</strong> the agent should use next, so it doesn&apos;t guess. And the
        handle is <strong>stable</strong>: the path is still valid after compaction, which is when the agent
        is most likely to need it.
      </p>

      <h3>Reading it back in slices</h3>
      <p>
        A handle only helps if the agent has good ways to read part of what it points to. I give agents a
        small set of read tools, modeled on how a developer uses a terminal:
      </p>
      <ul>
        <li>
          <code>read_slice(path, offset, limit)</code>: a page of rows, like <code>head</code> and{" "}
          <code>tail</code>.
        </li>
        <li>
          <code>grep_file(path, pattern)</code>: matching lines with line numbers, capped.
        </li>
        <li>
          <code>query_file(path, where, fields)</code>: filter structured rows by field and return only
          chosen columns.
        </li>
        <li>
          <code>get_by_id(path, id)</code>: one record, when the agent already knows which one it wants.
        </li>
      </ul>
      <p>
        Every one of these has an output cap of its own. A read tool that can return an entire file brings
        back the problem you offloaded to avoid.
      </p>

      <h2>Pattern 2: A scratchpad the agent re-reads</h2>
      <p>
        Long tasks drift. By turn forty the model has seen so many intermediate results that the original plan
        is a distant memory, sitting in the low-attention middle of the context, or compacted away entirely.
        The fix is to give the plan an address as well.
      </p>

      <ScratchpadFigure />

      <p>
        The agent writes a <code>todo.md</code> at the start with the goal, the steps and notes. It updates
        the file as it goes and re-reads it before each step. The file costs a few hundred tokens to reload.
        In exchange, the plan always sits at the end of the context, where the model pays the most attention,
        and it survives every compaction unchanged because it was never part of the transcript.
      </p>
      <p>
        This is the same move coding agents make when they keep a task list. It is also the cheapest pattern
        in this post to adopt: two tools (<code>write_file</code> and <code>read_file</code>) and one line in
        the system prompt.
      </p>

      <h2>Pattern 3: State belongs in the graph, not in the chat</h2>
      <p>
        A lot of what agents keep in conversation history is really program state: which entity is being
        worked on, which candidates were rejected, whether approval has been requested. Keeping it as prose
        in the transcript means the model has to re-read and re-interpret it on every turn, and it can get it
        wrong.
      </p>
      <p>
        In LangGraph that state has a proper home. Graph state is a typed object that persists across nodes
        and checkpoints. Nodes read and write fields directly, and each node decides which fields to show the
        model.
      </p>
      <Code lang="python" title="state.py">{`
from typing import Annotated, TypedDict
import operator

class StewardState(TypedDict):
    entity_id: str
    candidate_ids: list[str]
    rejected: Annotated[list[str], operator.add]    # append-only across nodes
    decisions: Annotated[list[dict], operator.add]
    artifacts: dict[str, str]                        # name -> offloaded path
    awaiting_approval: bool
    messages: list                                   # kept short; compacted

def simulate_node(state: StewardState):
    # The model sees only what this step needs, rendered fresh from state.
    brief = (
        f"Entity {state['entity_id']}. "
        f"Candidates: {', '.join(state['candidate_ids'])}. "
        f"Already rejected: {', '.join(state['rejected']) or 'none'}."
    )
    ...
`}</Code>
      <p>
        The difference is subtle but large. Instead of the model rebuilding the situation from a transcript,
        the node gives it a fresh, exact brief built from state. The transcript can then be short, because it
        no longer doubles as the database.
      </p>

      <h2>Pattern 4: Sub-agents with clean windows</h2>
      <p>
        Some sub-tasks are expensive to do and cheap to report. &ldquo;Analyze these 48 candidates and tell me
        which are true matches&rdquo; might take thirty tool calls and a full window of records. The answer is
        one sentence. If the main agent does that work itself, it carries all thirty calls around for the rest
        of the session.
      </p>

      <SubAgentsFigure />

      <p>
        Delegating to a sub-agent moves that cost somewhere it can be thrown away. The sub-agent starts with
        an empty window, a narrow instruction and only the tools it needs. It does the messy work and returns
        a condensed result. Its context is then discarded. The orchestrator only grows by the result.
      </p>
      <Code lang="python" title="delegate.py">{`
def delegate(task: str, tools: list, inputs: dict, max_result_tokens: int = 300) -> dict:
    """Run a sub-agent in a fresh context and return only its condensed result."""
    sub = create_agent(
        model=SUBAGENT_MODEL,
        tools=tools,
        system=(
            "You are a focused sub-agent. Complete the task using the tools. "
            f"Reply with JSON: {{'result': str, 'evidence_ids': list[str], 'artifacts': list[str]}}. "
            f"Keep 'result' under {max_result_tokens} tokens. Put detail in files, not in the reply."
        ),
    )
    out = sub.invoke({"messages": [{"role": "user", "content": f"{task}\\n\\nInputs: {inputs}"}]})
    return parse_json(out["messages"][-1].content)    # the sub-agent's transcript is dropped here

# In the orchestrator
matches = delegate(
    task="Decide which candidates are true matches for the entity. Flag conflicts.",
    tools=[read_slice, get_by_id, compare_entities],
    inputs={"entity_id": state["entity_id"], "candidates": state["artifacts"]["matches"]},
)
`}</Code>
      <p>
        Two rules keep this reliable. <strong>Ask for evidence, not only conclusions:</strong> the sub-agent
        returns the IDs it based its answer on, so the orchestrator or a person can check them.{" "}
        <strong>Send detail to files:</strong> if the sub-agent produces something long, such as a merge plan,
        it writes it to storage and returns the path, which is Pattern 1 again.
      </p>

      <h2>Pattern 5: Durable facts go to memory</h2>
      <p>
        Some state outlives the task: a data steward&apos;s preference for how conflicts are presented, a
        known-bad source system, a policy exception that was approved last week. That belongs in a memory
        store, retrieved by query when it becomes relevant, rather than loaded into every session. I cover
        memory in its own post on <a href="/writing/agent-memory">agent memory</a>. From the context
        window&apos;s point of view it&apos;s the coldest tier: it costs nothing until you look something up.
      </p>

      <h2>Choosing where things live</h2>

      <TiersFigure />

      <p>
        Put together, the patterns form a hierarchy. Each piece of state goes in the coldest place that still
        lets the agent get it back when it needs it. The current goal and the result the model is reasoning
        about stay in the window. Structured facts about the run go in graph state. Bulk data and plans go in
        files. Anything that should outlive the session goes in memory.
      </p>

      <h2>What it costs</h2>
      <p>Offloading isn&apos;t free, and it&apos;s worth being honest about the tradeoffs.</p>
      <ul>
        <li>
          <strong>More tool calls.</strong> Every slice the agent reads back is a round trip. On a short task,
          it can be slower than just including the data.
        </li>
        <li>
          <strong>Lost nuance.</strong> A preview or a sub-agent summary is a lossy view. If the model needed a
          detail the summary dropped, it has to know to go looking, and sometimes it doesn&apos;t.
        </li>
        <li>
          <strong>Stale handles.</strong> Files get cleaned up, sessions expire, and object stores have
          lifecycle rules. A handle that points nowhere is worse than no handle. Scope storage to the session
          and clean up when the session ends, not before.
        </li>
        <li>
          <strong>Governance.</strong> Offloaded data is still data. In enterprise MDM work, records carry PII
          and access rules. Scratch storage needs the same encryption, access controls and retention policy as
          the source system. It is not a side channel.
        </li>
      </ul>

      <Callout title="When I don't offload">
        When the task is short enough to finish comfortably within the working budget. When the model has to
        reason <strong>across the whole thing at once</strong>, such as comparing every field of two records,
        where slicing would hide the comparison. And when the preview would remove the detail that actually
        decides the answer. In those cases I trim at the source and keep the data inline.
      </Callout>

      <hr />
      <p>
        Context management and context offloading are the same discipline seen from two sides. One decides
        what earns a place in the window. The other gives everything else an address. Agents that do both can
        run for hours on a window that stays small, and they stay focused because the model only ever sees
        what the next step needs.
      </p>
    </>
  );
}
