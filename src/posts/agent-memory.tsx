import { Figure, Node, Tag, Callout, Code, Compare } from "@/components/blog";

/* ————— Figures ————— */

function MemoryShelves() {
  const rows = [
    {
      type: "Working",
      q: "What am I doing right now?",
      store: "Context window",
      detail: "messages, tool results, scratchpad",
      life: "one run",
    },
    {
      type: "Episodic",
      q: "What happened before?",
      store: "Checkpoints + event log",
      detail: "past threads, outcomes, decisions",
      life: "weeks",
    },
    {
      type: "Semantic",
      q: "What do I know?",
      store: "Vector DB + KV profile",
      detail: "facts about users, entities, domain",
      life: "until superseded",
    },
    {
      type: "Procedural",
      q: "How do I do this?",
      store: "Instructions + files",
      detail: "system prompt, playbooks, skills",
      life: "versioned",
    },
  ];
  return (
    <div className="px-4 pb-6 pt-12 sm:px-8">
      <div className="hidden grid-cols-[1fr_28px_1.1fr_80px] gap-3 px-1 pb-2 sm:grid">
        <Tag>Memory type</Tag>
        <span />
        <Tag>Where it lives</Tag>
        <Tag className="text-right">Lifetime</Tag>
      </div>
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div
            key={r.type}
            className="grid items-center gap-2 rounded-xl border border-line bg-surface p-3 sm:grid-cols-[1fr_28px_1.1fr_80px] sm:gap-3"
          >
            <div>
              <p className="text-[13.5px] font-medium">{r.type}</p>
              <p className="font-serif text-[14px] italic text-muted">{r.q}</p>
            </div>
            <svg viewBox="0 0 28 10" className="hidden w-full text-accent sm:block" aria-hidden>
              <path
                d="M1 5h24"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                className="flow-slow"
                style={{ animationDelay: `${i * 200}ms` }}
              />
              <path d="M22 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
            <div className="rounded-lg border border-accent/30 bg-accent-soft px-3 py-2">
              <p className="text-[12.5px] font-medium">{r.store}</p>
              <p className="text-[12px] text-muted">{r.detail}</p>
            </div>
            <p className="font-mono text-[12px] text-faint sm:text-right">{r.life}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RetrievalRanking() {
  const items = [
    { text: "Prefers survivorship rules that keep the Salesforce address", sim: 0.91, rec: 0.8, imp: 0.9, score: 0.88 },
    { text: "Approved merge of ACME Corp / Acme Inc. on Jun 12", sim: 0.84, rec: 0.95, imp: 0.6, score: 0.81 },
    { text: "Asked about Reltio match tuning last month", sim: 0.72, rec: 0.4, imp: 0.5, score: 0.58 },
    { text: "Timezone is America/Chicago", sim: 0.31, rec: 0.2, imp: 0.4, score: 0.3, cut: true },
  ];
  return (
    <div className="px-4 pb-6 pt-12 sm:px-8">
      <div className="rounded-xl border border-line bg-surface p-3">
        <p className="font-mono text-[12px] text-faint">query</p>
        <p className="mt-1 text-[13.5px]">
          &ldquo;Should we merge these two customer records?&rdquo;
          <span className="caret ml-0.5 inline-block h-[14px] w-[1.5px] translate-y-[2px] bg-accent" />
        </p>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((m, i) => (
          <div
            key={m.text}
            className={`step-in rounded-xl border p-3 ${m.cut ? "border-dashed border-line opacity-60" : "border-line bg-surface"}`}
            style={{ "--i": i, "--cycle": "9s", "--gap": "0.5s" } as React.CSSProperties}
          >
            <div className="flex items-start justify-between gap-3">
              <p className={`text-[12.5px] leading-snug ${m.cut ? "text-muted line-through decoration-faint" : ""}`}>{m.text}</p>
              <span className={`font-mono text-[12px] ${m.cut ? "text-faint" : "text-accent"}`}>{m.score.toFixed(2)}</span>
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {[
                ["sim", m.sim],
                ["recency", m.rec],
                ["importance", m.imp],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <div className="h-1 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-accent/70" style={{ width: `${(v as number) * 100}%` }} />
                  </div>
                  <p className="mt-1 font-mono text-[12px] text-faint">{k as string}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 font-mono text-[12px] text-faint">
        <span className="h-px flex-1 bg-line" />
        threshold 0.5 · top-k 3
        <span className="h-px flex-1 bg-line" />
      </div>
    </div>
  );
}

function SupersedeFigure() {
  return (
    <div className="grid gap-4 px-4 pb-6 pt-12 sm:grid-cols-2 sm:px-8">
      <div>
        <Tag>Append-only</Tag>
        <div className="mt-2 space-y-2">
          <Node>
            <span className="text-muted">Mar 03 ·</span> Steward is Priya
          </Node>
          <Node>
            <span className="text-muted">May 21 ·</span> Steward is Marco
          </Node>
          <div className="rounded-lg border border-[#d4574a]/40 px-3 py-2 text-[12px] text-bad">
            Retrieval returns both. The model picks one.
          </div>
        </div>
      </div>
      <div>
        <Tag className="text-accent">Supersede</Tag>
        <div className="mt-2 space-y-2">
          <Node tone="ghost">
            <span className="line-through decoration-faint">Steward is Priya</span>
            <span className="ml-2 font-mono text-[12px]">valid_to May 21</span>
          </Node>
          <Node tone="accent" className="breathe">
            Steward is Marco
            <span className="ml-2 font-mono text-[12px] text-muted">supersedes #412</span>
          </Node>
          <div className="rounded-lg border border-[#22a05e]/40 px-3 py-2 text-[12px] text-ok">
            One current fact, history kept for audit.
          </div>
        </div>
      </div>
    </div>
  );
}

function LangGraphMemory() {
  return (
    <div className="px-4 pb-6 pt-12 sm:px-8">
      <svg viewBox="0 0 560 220" className="w-full" aria-hidden>
        {/* thread lanes */}
        {[0, 1].map((t) => (
          <g key={t} transform={`translate(0 ${t * 70})`}>
            <text x="0" y="36" className="fill-[var(--muted)] font-mono" fontSize="11">
              thread {t === 0 ? "A" : "B"}
            </text>
            <line x1="70" y1="32" x2="540" y2="32" stroke="var(--line)" strokeWidth="1.5" />
            {[0, 1, 2, 3].map((c) => (
              <g key={c}>
                <circle
                  cx={110 + c * 120}
                  cy="32"
                  r="7"
                  fill="var(--surface)"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  className="breathe"
                  style={{ "--delay": `${c * 300 + t * 150}ms` } as React.CSSProperties}
                />
                <text x={110 + c * 120} y="56" textAnchor="middle" fontSize="11" className="fill-[var(--faint)] font-mono">
                  ckpt {c + 1}
                </text>
              </g>
            ))}
          </g>
        ))}
        {/* shared store */}
        <rect x="150" y="160" width="260" height="46" rx="10" fill="var(--accent-soft)" stroke="var(--accent)" strokeOpacity="0.4" />
        <text x="280" y="180" textAnchor="middle" fontSize="12.5" className="fill-[var(--fg)]">
          Store · namespace (&quot;user&quot;, id)
        </text>
        <text x="280" y="196" textAnchor="middle" fontSize="11" className="fill-[var(--muted)]">
          long-term, shared across threads
        </text>
        <path d="M230 102 C 230 130, 240 140, 250 160" stroke="var(--accent)" strokeWidth="1.2" fill="none" strokeDasharray="4 4" className="flow" />
        <path d="M470 102 C 470 140, 420 150, 380 160" stroke="var(--accent)" strokeWidth="1.2" fill="none" strokeDasharray="4 4" className="flow" />
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-muted">
        <span>
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full border border-accent" />
          Checkpointer: short-term, per thread
        </span>
        <span>
          <span className="mr-1.5 inline-block h-2 w-2 rounded-sm bg-accent/60" />
          Store: long-term, per user or entity
        </span>
      </div>
    </div>
  );
}

/* ————— Body ————— */

export default function Post() {
  return (
    <>
      <p>
        A model with no memory is a very good stranger. It answers each request well, then forgets you exist.
        That is fine for a single question. It stops being fine once you build an agent that works with the same
        data stewards every day, reviews the same entities week after week, and is expected to learn that one team
        always trusts the Salesforce address over the ERP one.
      </p>
      <p>
        At Data Color AI I build agents that sit inside master data management workflows. Memory is the part of
        those systems I have rewritten the most. The first version saved everything and retrieved too much. The
        second saved almost nothing. What works is less about the vector database and more about three policies:
        what gets written, what gets retrieved, and what gets forgotten.
      </p>

      <h2>Four kinds of memory</h2>
      <p>
        The cognitive science terms map onto agents better than I expected, and they are useful because each type
        wants a different storage layer and a different lifetime.
      </p>
      <ul>
        <li>
          <strong>Working memory</strong> is what the model can see on this turn: the system prompt, the
          conversation, tool results, any scratchpad. It lives in the context window and dies when the run ends.
        </li>
        <li>
          <strong>Episodic memory</strong> is a record of what happened. &ldquo;On June 12 the steward approved
          merging ACME Corp and Acme Inc.&rdquo; It is useful for continuity and for learning from past outcomes.
        </li>
        <li>
          <strong>Semantic memory</strong> is distilled facts. &ldquo;This steward prefers the Salesforce
          address.&rdquo; &ldquo;Customer 4471 is a subsidiary of 1022.&rdquo; No timestamp story, just what is true
          now.
        </li>
        <li>
          <strong>Procedural memory</strong> is how to do things: the system prompt, playbooks, tool descriptions,
          skill files. It changes rarely and should be versioned like code.
        </li>
      </ul>

      <Figure
        label="Memory types → storage"
        caption="Each kind of memory has a natural home. Most bugs I have seen come from putting one kind in another's store, such as facts in the prompt or procedures in a vector DB."
      >
        <MemoryShelves />
      </Figure>

      <p>
        The mistake I made early was treating all four as &ldquo;stuff to embed and search.&rdquo; Procedures do not
        belong in a similarity search. If the agent needs to know how to run a merge review, that belongs in its
        instructions every time, not in a store that retrieves it only when the query happens to be phrased the right way.
      </p>

      <h2>Where each one lives</h2>
      <p>
        In practice I end up with four storage layers, and a clear rule for which memory goes where.
      </p>
      <ol>
        <li>
          <strong>The context window</strong> for working memory. It is the most expensive and the least durable
          layer, so nothing should be there by default.
        </li>
        <li>
          <strong>A checkpoint store</strong> for the state of a thread: messages, intermediate state, which node the
          graph was on. This is what lets a conversation resume after a human approval that took two days.
        </li>
        <li>
          <strong>A key-value profile</strong> for small, structured facts about a user or entity. Preferences,
          role, the systems they own. Read by key, not by similarity. Cheap and exact.
        </li>
        <li>
          <strong>A vector index</strong> for free-form semantic and episodic memories where you do not know the
          key in advance. &ldquo;Anything relevant about how this team handles duplicate suppliers?&rdquo;
        </li>
      </ol>
      <p>
        The profile is underrated. A large share of what agents &ldquo;remember&rdquo; in production is structured:
        a name, a preferred source system, a region. Putting that in a vector store means paying for embeddings and
        getting fuzzy retrieval for something that has an exact answer.
      </p>

      <h2>Short-term and long-term in LangGraph</h2>
      <p>
        LangGraph makes this split explicit, which is one reason I use it. A <code>checkpointer</code> saves graph
        state after every step, keyed by <code>thread_id</code>. That is short-term memory: everything about one
        conversation or one job, including the ability to pause for a human and resume later. A{" "}
        <code>Store</code> is separate. It holds JSON documents under namespaces such as{" "}
        <code>(&quot;user&quot;, user_id)</code> or <code>(&quot;entity&quot;, entity_id)</code>, optionally with a
        vector index, and every thread can read from it.
      </p>

      <Figure
        label="LangGraph"
        caption="Checkpoints belong to one thread. The store is shared, so a fact learned in thread A is available in thread B."
        wide
      >
        <LangGraphMemory />
      </Figure>

      <p>
        Keeping these apart matters. Checkpoints grow with every step and are mostly noise after the thread ends.
        The store should only contain things you would be comfortable showing the agent in any future conversation.
      </p>

      <h2>Write policy: what is worth remembering</h2>
      <p>
        This is the hard part, and it is a product decision more than an engineering one. My current rule is that a
        memory has to pass three tests:
      </p>
      <ul>
        <li>
          <strong>Will it change a future decision?</strong> &ldquo;The user said thanks&rdquo; will not.
          &ldquo;The user rejects merges when tax IDs differ, even if names match&rdquo; will.
        </li>
        <li>
          <strong>Is it stable?</strong> A preference or a relationship is. The status of a ticket is not; read that
          from the source system instead.
        </li>
        <li>
          <strong>Is the agent allowed to keep it?</strong> More on privacy below.
        </li>
      </ul>
      <p>
        Then there is the question of who decides. There are two approaches, and I use both.
      </p>
      <Compare
        leftTitle="Agent writes (hot path)"
        left={
          <>
            The agent gets a <code>save_memory</code> tool and decides mid-conversation. Memories are available
            immediately, and the user can see it happen. It adds latency and the agent sometimes saves trivia.
          </>
        }
        rightTitle="Background extraction (cold path)"
        right={
          <>
            After a thread ends, a separate job reads the transcript and extracts facts with a focused prompt. It is
            more consistent and can deduplicate against existing memories. The downside is that memories arrive late.
          </>
        }
      />
      <p>
        For the AI Data Steward, the agent saves explicit instructions immediately (&ldquo;always keep the D&amp;B
        DUNS number&rdquo;), and a background job extracts softer patterns from approval history overnight.
      </p>

      <Code lang="python" title="memory_tool.py">{`
from pydantic import BaseModel, Field
from langchain_core.tools import tool

class Memory(BaseModel):
    subject: str = Field(description="Who or what this is about, e.g. 'user:priya' or 'entity:4471'")
    fact: str = Field(description="One self-contained statement, written so it makes sense out of context")
    kind: str = Field(description="'preference' | 'relationship' | 'instruction' | 'outcome'")
    importance: float = Field(ge=0, le=1, description="How much this should change future decisions")
    supersedes: str | None = Field(default=None, description="ID of a memory this one replaces")

@tool(args_schema=Memory)
def save_memory(subject, fact, kind, importance, supersedes=None):
    """Save a durable fact that will change how you act in future sessions.
    Do not save small talk, transient status, or anything readable from a source system."""
    ns = tuple(subject.split(":", 1))
    if supersedes:
        store.put(ns, supersedes, {**store.get(ns, supersedes).value, "valid_to": now()})
    store.put(ns, new_id(), {"fact": fact, "kind": kind, "importance": importance, "valid_from": now()})
    return "saved"
`}</Code>
      <p>
        Two details in that tool description do most of the work: the fact must be self-contained, and the
        description tells the model what <em>not</em> to save. Without the second one, agents save everything.
      </p>

      <h2>Retrieval: similarity is not enough</h2>
      <p>
        Pure vector similarity has a known problem. It returns things that sound related, not things that matter.
        I score candidates on three signals, an approach popularized by the generative agents paper and still a
        good default:
      </p>
      <ul>
        <li>
          <strong>Similarity</strong> to the current query.
        </li>
        <li>
          <strong>Recency</strong>, with exponential decay since the memory was last used.
        </li>
        <li>
          <strong>Importance</strong>, assigned at write time.
        </li>
      </ul>

      <Figure
        label="Retrieval"
        caption="Candidates are scored on similarity, recency and importance. Anything below the threshold is dropped, even if there is room for it."
      >
        <RetrievalRanking />
      </Figure>

      <Code lang="python" title="score.py">{`
import math

def score(mem, sim, now, half_life_days=30, w=(0.6, 0.2, 0.2)):
    age_days = (now - mem["last_used"]).total_seconds() / 86400
    recency = math.exp(-math.log(2) * age_days / half_life_days)
    return w[0] * sim + w[1] * recency + w[2] * mem["importance"]

def recall(query, ns, k=3, threshold=0.5):
    hits = store.search(ns, query=query, limit=20, filter={"valid_to": None})
    ranked = sorted(hits, key=lambda h: score(h.value, h.score, now()), reverse=True)
    return [h for h in ranked if score(h.value, h.score, now()) >= threshold][:k]
`}</Code>
      <p>
        Two things in that code matter more than the weights. The metadata filter{" "}
        <code>valid_to: None</code> excludes superseded facts before ranking. And the threshold means the agent can
        retrieve nothing. An empty result is much better than three weak memories that pull the model off course.
      </p>

      <h2>Updates: supersede, don&apos;t append</h2>
      <p>
        Facts change. The steward for a region moves teams, and a customer gets acquired. If memory is append-only,
        retrieval eventually returns both the old and new fact, and the model picks one, often the wrong one because
        the old fact has more supporting memories around it.
      </p>

      <Figure
        label="Conflicts"
        caption="Superseding keeps one current fact and moves the old one out of retrieval while preserving it for audit."
      >
        <SupersedeFigure />
      </Figure>

      <p>
        On every write, I search for existing memories about the same subject and ask a small model a narrow
        question: does the new fact duplicate, update, or contradict any of these? Duplicates are dropped. Updates
        and contradictions close the old record with a <code>valid_to</code> timestamp. In an MDM context this is
        familiar ground, because it is the same bitemporal thinking data teams already apply to golden records.
      </p>

      <h2>Forgetting on purpose</h2>
      <p>
        Memory that only grows gets worse over time. Retrieval gets noisier, costs go up, and stale facts
        accumulate. I use three forgetting mechanisms:
      </p>
      <ul>
        <li>
          <strong>Decay.</strong> Recency weighting already pushes unused memories down. Memories that have not been
          retrieved in a long time and have low importance get archived.
        </li>
        <li>
          <strong>TTL by kind.</strong> Outcomes (&ldquo;merge approved on June 12&rdquo;) expire after a few months.
          Instructions do not expire until someone changes them.
        </li>
        <li>
          <strong>User control.</strong> People can see and delete what the agent remembers about them. This matters
          for trust, and it is a legal requirement in many places.
        </li>
      </ul>
      <Callout title="Privacy">
        Decide what the agent must <strong>never</strong> store before you decide what it should. For us that means no
        credentials, no personal data copied out of governed source systems, and namespaces scoped per tenant so one
        customer&apos;s memories can never be retrieved in another&apos;s session. Enforce this in the tool, not in the
        prompt.
      </Callout>

      <h2>Failure modes I have hit</h2>
      <h3>Stale facts</h3>
      <p>
        The agent confidently uses a preference from six months ago. The fix is supersession plus decay, and for
        anything that has a source system, reading the source instead of remembering it.
      </p>
      <h3>Memory poisoning</h3>
      <p>
        If an agent saves content from documents or tool outputs, then a malicious or simply wrong document can
        plant a &ldquo;fact&rdquo; that shapes every future session. I only allow durable memories that come from the
        user or from verified outcomes. I never save text that came from a retrieved document, and every memory
        records its provenance.
      </p>
      <h3>Over-retrieval</h3>
      <p>
        Retrieving ten memories &ldquo;just in case&rdquo; fills the context with loosely related facts, and the model
        treats everything in context as relevant. It will try to use them. A threshold and a small <code>k</code> fix
        most of this.
      </p>

      <blockquote>A good memory system is judged by what it leaves out.</blockquote>

      <p>
        Start with the profile and the checkpointer. They cover most of what users experience as &ldquo;it
        remembers me.&rdquo; Add a vector store for episodic and semantic memory only when you have a clear write
        policy, a supersession rule and a way to forget. Without those three, memory makes the agent worse the
        longer it runs.
      </p>
    </>
  );
}
