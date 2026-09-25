import { Callout, Code, Compare } from "@/components/blog";
import {
  AttentionFigure,
  CachePrefixFigure,
  CompactionFigure,
  ContextMeterFigure,
} from "./_figures/context-management-figures";

export default function Post() {
  return (
    <>
      <p>
        Every call to a language model is one document. Whatever the agent knows at that moment, including
        its instructions, its tools, what the user said forty turns ago and the JSON a tool returned a second
        ago, has to fit in that document. The model keeps nothing between calls. The context window is the
        only working memory it has.
      </p>
      <p>
        That makes the window a budget. The agents I build at Data Color AI are LangGraph workflows on AWS
        Bedrock. They investigate entity conflicts in master data, pull records, simulate merges and ask a
        person to approve. A normal session runs thirty to fifty turns. The failures I see most often in those
        sessions don&apos;t come from the model being unable to reason. They come from the agent spending its
        budget badly: it fills the window with things it no longer needs, then misses the one thing it does.
      </p>
      <p>
        This post covers how I think about that budget: what goes in, what it costs, and how to keep the
        window lean. The companion post on{" "}
        <a href="/writing/context-offloading">context offloading</a> covers where everything else should live.
      </p>

      <h2>What&apos;s actually in a request</h2>
      <p>
        Open the raw payload of an agent call and count tokens by section. You&apos;ll almost always find six
        parts:
      </p>
      <ul>
        <li>
          <strong>System prompt.</strong> Role, rules, output format. Usually small and stable.
        </li>
        <li>
          <strong>Tool definitions.</strong> Every tool&apos;s name, description and JSON schema. This is easy
          to forget because you never see it in the chat, but twenty tools with detailed schemas can run to
          thousands of tokens on every single call.
        </li>
        <li>
          <strong>Retrieved documents.</strong> RAG chunks, policy text, reference records.
        </li>
        <li>
          <strong>Conversation history.</strong> Every user and assistant turn so far.
        </li>
        <li>
          <strong>Tool results.</strong> The output of every call the agent has made. This is the section that
          grows fastest and the one nobody designs.
        </li>
        <li>
          <strong>Reasoning.</strong> Scratch work from models that think before answering. It takes up room
          while it is being generated and, depending on how you replay history, can stay around afterwards.
        </li>
      </ul>

      <ContextMeterFigure />

      <p>
        The first time I did this accounting for one of our stewardship agents, tool results were bigger than
        everything else combined. A single <code>get_entity</code> call against an MDM hub returns hundreds of
        attributes, crosswalks and audit fields. The agent needed about a dozen of them. We were paying to send
        the rest back to the model on every turn after that, and it was making the answers worse.
      </p>

      <h2>More tokens, worse answers</h2>
      <p>
        It&apos;s tempting to treat a large context window as permission to include everything. A million
        tokens sounds like room for the whole database. In practice, quality drops long before you reach the
        limit, for three reasons.
      </p>
      <p>
        <strong>Position matters.</strong> Models use information at the start and end of their context much
        more reliably than information in the middle. The &ldquo;lost in the middle&rdquo; research showed
        this clearly for retrieval tasks, and I see the same pattern in agent traces. A constraint the user
        gave in turn six is buried by turn thirty under twenty tool results.
      </p>

      <AttentionFigure />

      <p>
        <strong>Distractors compete.</strong> Every irrelevant record that looks relevant is a chance for the
        model to anchor on the wrong thing. In entity resolution this is especially bad: forty near-duplicate
        candidates are, by definition, forty plausible distractors.
      </p>
      <p>
        <strong>Instructions get diluted.</strong> The system prompt is a fixed number of tokens. As the rest
        of the window grows, it becomes a smaller share of what the model is attending to. Rules that held
        firmly at turn three start slipping at turn forty.
      </p>
      <blockquote>The goal isn&apos;t the most context. It&apos;s the smallest context that contains what the next step needs.</blockquote>

      <h2>Give every section a budget</h2>
      <p>
        Once you think of the window as a budget, the obvious next step is to allocate it. I set a working
        budget well below the model&apos;s hard limit, usually around half, and divide it between sections.
        Each section has a ceiling, and each has a defined way to shrink when it goes over.
      </p>
      <Code lang="python" title="budget.py">{`
from dataclasses import dataclass

@dataclass
class Section:
    name: str
    tokens: int
    ceiling: int      # max tokens this section may use
    shrink: str       # how to reduce it: "drop_tools", "rerank", "compact", "truncate"

def plan(sections: list[Section], working_budget: int) -> list[tuple[str, str]]:
    """Return the shrink actions needed to fit, largest overrun first."""
    actions = []
    for s in sorted(sections, key=lambda s: s.tokens - s.ceiling, reverse=True):
        if s.tokens > s.ceiling:
            actions.append((s.name, s.shrink))
    total = sum(min(s.tokens, s.ceiling) for s in sections)
    if total > working_budget:
        actions.append(("history", "compact"))   # last resort: summarize older turns
    return actions

sections = [
    Section("system",       2_800,  4_000, "none"),
    Section("tools",       14_200,  6_000, "drop_tools"),
    Section("retrieved",   23_500, 10_000, "rerank"),
    Section("history",     35_900, 20_000, "compact"),
    Section("tool_results", 43_100, 12_000, "truncate"),
]
print(plan(sections, working_budget=64_000))
`}</Code>
      <p>
        The exact numbers matter less than having them at all. Without ceilings, the section that grows
        fastest wins by default, and that is almost always tool results. With ceilings, overruns get handled
        where they happen instead of piling up in the transcript.
      </p>
      <p>
        <strong>Tools</strong> are the easiest win. If an agent has thirty tools but a given phase of the task
        uses five, load five. In LangGraph I bind a different tool set per node: the investigation node gets
        search and read tools, and the resolution node gets simulate and route-for-approval tools. The model
        makes fewer wrong tool choices because it sees fewer options.
      </p>

      <h2>Order the window for the cache</h2>
      <p>
        Budgeting decides what goes into the window. Ordering decides what that costs. Anthropic models on
        Bedrock, like most major providers, support prompt caching: if the beginning of a request is
        byte-for-byte identical to a recent request, the provider reuses the work and bills those tokens at a
        fraction of the normal price. They also come back faster.
      </p>
      <p>
        That rewards a specific shape: stable content first, changing content last, and history that only
        grows at the end.
      </p>

      <CachePrefixFigure />

      <ul>
        <li>
          <strong>Keep the prefix frozen.</strong> System prompt, then tool definitions, then any long-lived
          reference material. Don&apos;t template the current time, a request ID or the user&apos;s name into
          the system prompt. Put those in the latest message.
        </li>
        <li>
          <strong>Keep tool order deterministic.</strong> If tools come from a dict or an MCP server&apos;s
          list response, sort them. A reordered tool list is a different prefix.
        </li>
        <li>
          <strong>Append, don&apos;t edit.</strong> Rewriting an early message invalidates everything after
          it. When you do need to rewrite history, as with compaction below, do it rarely and in one step, so
          you pay for a cache miss once instead of on every turn.
        </li>
      </ul>

      <h2>Trim at the source</h2>
      <p>
        The cheapest token is the one a tool never returns. Most of the context savings I&apos;ve made came
        from redesigning tool outputs, not from clever summarization afterwards.
      </p>
      <Compare
        leftTitle="Tool returns everything"
        rightTitle="Tool returns what decides the next step"
        left={
          <>
            <code>get_entity</code> returns the full record: 312 attributes, every crosswalk, full audit
            history. The model has to find the twelve fields that matter, on every turn, for the rest of the
            session.
          </>
        }
        right={
          <>
            <code>get_entity</code> takes a <code>fields</code> argument with a sensible default: name, IDs,
            address, ownership and match score. It says how many attributes were left out and how to ask for
            them.
          </>
        }
      />
      <p>
        The same idea applies everywhere. Paginate search results and return a total count. Return diffs
        instead of both full versions. Cap string fields. Remove nulls and internal metadata. If a result is
        still large after all that, don&apos;t put it in the window at all. Write it somewhere and return a
        handle, which is the main pattern in the <a href="/writing/context-offloading">offloading post</a>.
      </p>
      <Callout title="Rule of thumb">
        Read a raw tool result the way the model will. If <strong>you</strong> have to scroll to find the
        answer, the model is paying for that scroll on every later turn.
      </Callout>

      <h2>Compact when you get close to the line</h2>
      <p>
        Even with tight tools, long sessions grow. At some point the history has to shrink. Compaction takes
        the older part of the transcript and replaces it with a structured note, while the recent turns stay
        as they are.
      </p>
      <p>
        The hard part is deciding what survives. A generic &ldquo;summarize the conversation so far&rdquo;
        prompt produces something that reads well and loses exactly the details the agent needs. I use a fixed
        schema instead:
      </p>
      <ul>
        <li>
          <strong>Kept verbatim:</strong> user constraints, decisions already made, open tasks, and every
          identifier: entity IDs, file paths, ticket numbers. Paraphrasing an ID is how an agent ends up acting
          on the wrong record.
        </li>
        <li>
          <strong>Summarized:</strong> reasoning that led to decisions, dead ends worth not repeating, and the
          gist of what tools returned.
        </li>
        <li>
          <strong>Dropped, with a pointer:</strong> raw payloads that can be fetched again. The note records
          how to get them back, not their contents.
        </li>
      </ul>

      <CompactionFigure />

      <Code lang="python" title="compaction trigger">{`
KEEP_RECENT = 8            # always keep the latest turns untouched
COMPACT_AT = 0.75          # fraction of the working budget

def maybe_compact(state, count_tokens, summarize):
    used = count_tokens(state["messages"])
    if used < COMPACT_AT * state["working_budget"]:
        return state

    old, recent = state["messages"][:-KEEP_RECENT], state["messages"][-KEEP_RECENT:]
    note = summarize(
        old,
        schema=["goal", "constraints_verbatim", "decisions_verbatim",
                "open_tasks", "ids_verbatim", "dropped_and_how_to_refetch"],
    )
    # One rewrite, one cache miss. The new prefix stays stable afterwards.
    state["messages"] = [note_as_message(note)] + recent
    state["compactions"] += 1
    return state
`}</Code>
      <p>
        Two details matter here. First, compact before you&apos;re in trouble. Summarizing when the window is
        already overflowing means the summarizer is working from a degraded context too. Second, split on a
        clean boundary. Never separate a tool call from its result, or the model sees an answer to a question
        it no longer remembers asking.
      </p>

      <h2>Retrieve just in time</h2>
      <p>
        The other half of keeping the window small is not loading things before you need them. Early RAG
        designs retrieved once, up front, and stuffed the top-k chunks into the prompt. For agents I prefer to
        give the model a search tool and let it pull what it needs at the step where it needs it.
      </p>
      <p>
        Preloading still makes sense for a small amount of material that every step needs, such as a
        governance policy the agent must never violate. That belongs in the stable prefix, where it is cached
        and sits in the high-attention region at the start. Everything else is cheaper on demand. The cost is
        an extra tool call, but it saves carrying irrelevant chunks for thirty turns.
      </p>

      <h2>Measure it every turn</h2>
      <p>
        You can&apos;t manage a budget you don&apos;t track. Every agent I ship logs a token breakdown per
        turn, by section, alongside the trace:
      </p>
      <Code lang="json" title="one turn in the trace">{`
{
  "turn": 23,
  "tokens": {
    "system": 2810, "tools": 5120, "retrieved": 6400,
    "history": 11850, "tool_results": 7300
  },
  "cached_prefix": 7930,
  "compactions": 1,
  "largest_result": { "tool": "search_matches", "tokens": 3100 }
}
`}</Code>
      <p>
        Charted over a session, that tells you almost everything. A steadily rising line is healthy. A step
        change means one tool returned something enormous. A falling cache ratio means something is changing
        your prefix. When an answer comes back wrong, the first thing I check is how full the window was and
        where the relevant fact sat in it. More often than I&apos;d like, it was in the middle of a very full
        window.
      </p>

      <hr />
      <p>
        Context management decides what earns a place in the window. It only works if everything that
        doesn&apos;t earn one has somewhere else to go: files, graph state, sub-agents or a memory store,
        where the agent can reach it by reference. That&apos;s the subject of the next post,{" "}
        <a href="/writing/context-offloading">context offloading</a>.
      </p>
    </>
  );
}
