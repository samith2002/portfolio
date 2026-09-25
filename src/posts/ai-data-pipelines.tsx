import { Figure, Node, Tag, Callout, Code, Compare } from "@/components/blog";

/* ————— Figures ————— */

function Medallion() {
  return (
    <div className="px-4 pb-6 pt-12 sm:px-8">
      <svg viewBox="0 0 640 250" className="w-full" aria-hidden>
        <defs>
          <marker id="adp-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 8 4 0 8z" fill="var(--faint)" />
          </marker>
        </defs>

        {/* stages */}
        {[
          { x: 10, label: "Bronze", sub: "raw ingest" },
          { x: 170, label: "Silver", sub: "clean + conform" },
          { x: 490, label: "Gold", sub: "curated" },
        ].map((s) => (
          <g key={s.label}>
            <rect x={s.x} y="40" width="130" height="64" rx="12" fill="var(--surface)" stroke="var(--line)" />
            <text x={s.x + 65} y="68" textAnchor="middle" fontSize="14" className="fill-[var(--fg)]">
              {s.label}
            </text>
            <text x={s.x + 65} y="87" textAnchor="middle" fontSize="11" className="fill-[var(--muted)] font-mono">
              {s.sub}
            </text>
          </g>
        ))}

        {/* LLM stage */}
        <rect x="330" y="34" width="130" height="76" rx="12" fill="var(--accent-soft)" stroke="var(--accent)" strokeOpacity="0.5" />
        <text x="395" y="64" textAnchor="middle" fontSize="14" className="fill-[var(--fg)]">
          LLM enrich
        </text>
        <text x="395" y="82" textAnchor="middle" fontSize="11" className="fill-[var(--muted)] font-mono">
          classify · extract
        </text>
        <text x="395" y="97" textAnchor="middle" fontSize="11" className="fill-[var(--muted)] font-mono">
          schema-validated
        </text>

        {/* main flow */}
        <path d="M140 72 H168" stroke="var(--faint)" strokeWidth="1.3" markerEnd="url(#adp-arrow)" />
        <path d="M300 72 H328" stroke="var(--accent)" strokeWidth="1.3" strokeDasharray="4 4" className="flow" />
        <path d="M460 72 H488" stroke="var(--accent)" strokeWidth="1.3" strokeDasharray="4 4" className="flow" markerEnd="url(#adp-arrow)" />

        {/* branch to review */}
        <path d="M395 110 C 395 150, 395 150, 395 170" stroke="#d4574a" strokeOpacity="0.7" strokeWidth="1.3" strokeDasharray="4 4" className="flow-slow" />
        <rect x="320" y="172" width="150" height="54" rx="12" fill="var(--bg)" stroke="#d4574a" strokeOpacity="0.5" strokeDasharray="4 3" />
        <text x="395" y="195" textAnchor="middle" fontSize="12.5" className="fill-[var(--fg)]">
          Review queue
        </text>
        <text x="395" y="212" textAnchor="middle" fontSize="11" className="fill-[var(--muted)] font-mono">
          confidence &lt; 0.8
        </text>

        {/* return path */}
        <path d="M470 199 C 540 199, 555 160, 555 106" stroke="var(--faint)" strokeWidth="1.2" strokeDasharray="3 4" fill="none" markerEnd="url(#adp-arrow)" />
        <text x="560" y="165" fontSize="11" className="fill-[var(--faint)] font-mono">
          approved
        </text>

        {/* cache */}
        <rect x="330" y="0" width="130" height="22" rx="6" fill="none" stroke="var(--line)" />
        <text x="395" y="15" textAnchor="middle" fontSize="11" className="fill-[var(--muted)] font-mono">
          cache by input hash
        </text>
      </svg>
    </div>
  );
}

function ClassifyTable() {
  const rows = [
    { text: "Invoice #88213 – 40 cartons nitrile gloves", label: "Medical supplies", conf: 0.97 },
    { text: "Svc agreement, annual HVAC maint.", label: "Facilities", conf: 0.92 },
    { text: "Misc – see attached", label: "Unknown", conf: 0.41 },
    { text: "AWS mkt. subscription Q3", label: "Software", conf: 0.88 },
    { text: "Reimb. – J. Ortiz travel Dallas", label: "Travel", conf: 0.73 },
  ];
  return (
    <div className="px-4 pb-6 pt-12 sm:px-8">
      <div className="relative overflow-hidden rounded-xl border border-line bg-surface">
        <div className="scan pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-accent/10 to-transparent" />
        <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-line px-3 py-2 sm:grid-cols-[1.6fr_1fr_110px]">
          <Tag>description</Tag>
          <Tag className="hidden sm:block">category</Tag>
          <Tag className="text-right">confidence</Tag>
        </div>
        {rows.map((r) => {
          const low = r.conf < 0.8;
          return (
            <div
              key={r.text}
              className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-line px-3 py-2.5 last:border-b-0 sm:grid-cols-[1.6fr_1fr_110px]"
            >
              <div className="min-w-0">
                <p className="truncate text-[12.5px]">{r.text}</p>
                <p className="text-[12px] text-muted sm:hidden">{r.label}</p>
              </div>
              <p className="hidden text-[12.5px] text-muted sm:block">{r.label}</p>
              <div className="flex items-center justify-end gap-2">
                <div className="h-1.5 w-12 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${r.conf * 100}%`, background: low ? "#d4574a" : "var(--accent)" }}
                  />
                </div>
                <span className="w-9 text-right font-mono text-[12px]" style={{ color: low ? "var(--bad)" : "var(--muted)" }}>
                  {r.conf.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-muted">
        <span>
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-accent" />
          written to Silver
        </span>
        <span>
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#d4574a]" />
          routed to review queue
        </span>
      </div>
    </div>
  );
}

function RuleLifecycle() {
  return (
    <div className="px-4 pb-6 pt-12 sm:px-8">
      <div className="grid gap-3 md:grid-cols-3">
        {/* generated */}
        <div className="step-in rounded-xl border border-line bg-surface p-3" style={{ "--i": 0, "--cycle": "8s", "--gap": "0.9s" } as React.CSSProperties}>
          <div className="flex items-center justify-between">
            <Tag>1 · proposed</Tag>
            <span className="font-mono text-[12px] text-accent">LLM</span>
          </div>
          <p className="mt-2 font-mono text-[12px] leading-relaxed">
            <span className="text-muted">column</span> tax_id
            <br />
            <span className="text-muted">rule</span> matches ^\d{"{"}2{"}"}-\d{"{"}7{"}"}$
            <br />
            <span className="text-muted">when</span> country = &apos;US&apos;
          </p>
          <p className="mt-2 text-[12px] leading-snug text-muted">
            &ldquo;98.6% of US rows match the EIN pattern; the rest look like typos.&rdquo;
          </p>
        </div>
        {/* approved */}
        <div className="step-in rounded-xl border border-line bg-surface p-3" style={{ "--i": 1, "--cycle": "8s", "--gap": "0.9s" } as React.CSSProperties}>
          <Tag>2 · reviewed</Tag>
          <div className="mt-2 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-fg text-[12px] text-bg">DS</span>
            <p className="text-[12.5px]">Data steward</p>
          </div>
          <div className="mt-3 flex gap-2">
            <span className="rounded-full bg-[#22a05e]/15 px-2.5 py-1 text-[12px] text-ok">Approved</span>
            <span className="rounded-full border border-line px-2.5 py-1 text-[12px] text-muted">severity: warn</span>
          </div>
          <p className="mt-2 font-mono text-[12px] text-faint">rule v3 · prompt v12</p>
        </div>
        {/* executed */}
        <div className="step-in rounded-xl border border-accent/40 bg-accent-soft p-3" style={{ "--i": 2, "--cycle": "8s", "--gap": "0.9s" } as React.CSSProperties}>
          <div className="flex items-center justify-between">
            <Tag>3 · executed</Tag>
            <span className="font-mono text-[12px] text-muted">Spark</span>
          </div>
          <p className="mt-2 font-mono text-[20px] leading-none">
            4,912,007 <span className="text-[12px] text-muted">rows</span>
          </p>
          <div className="mt-2.5 flex h-1.5 overflow-hidden rounded-full">
            <div className="h-full bg-[#22a05e]" style={{ width: "99%" }} />
            <div className="h-full bg-[#d4574a]" style={{ width: "1%" }} />
          </div>
          <p className="mt-1.5 text-[12px] text-muted">No LLM calls at run time</p>
        </div>
      </div>
    </div>
  );
}

function Fit() {
  const good = ["Classify free-text descriptions", "Extract fields from PDFs and emails", "Suggest schema mappings", "Propose data quality rules", "Explain an anomaly in plain English", "Pre-score candidate entity matches"];
  const bad = ["Joins and aggregations", "Type casting and date parsing", "Deduplication by exact keys", "Currency conversion", "Anything with a known formula", "Row counts and reconciliations"];
  return (
    <div className="grid gap-4 px-4 pb-6 pt-12 sm:grid-cols-2 sm:px-8">
      <div>
        <Tag className="text-accent">Good fit: judgment on messy input</Tag>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {good.map((g, i) => (
            <Node key={g} tone="accent" className="float" style={{ "--delay": `${i * 400}ms` } as React.CSSProperties}>
              {g}
            </Node>
          ))}
        </div>
      </div>
      <div>
        <Tag>Poor fit: already deterministic</Tag>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {bad.map((b) => (
            <Node key={b} tone="ghost">
              {b}
            </Node>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ————— Body ————— */

export default function Post() {
  return (
    <>
      <p>
        Data pipelines are built on a promise: the same input produces the same output, every time. LLMs break that
        promise by design. The same prompt can return a different answer tomorrow, and a model upgrade can shift
        every answer at once.
      </p>
      <p>
        Even so, some of the most useful LLM work I have done has been inside data pipelines rather than in chat
        interfaces. At Data Color AI I built a data quality framework on Databricks where an LLM writes validation
        rules, Spark runs them, and MLflow tracks how both behave over time. Getting there meant learning where a
        probabilistic step belongs in a deterministic system, and how to fence it in.
      </p>

      <h2>Where LLMs belong</h2>
      <p>
        The test I use is simple. If a competent engineer could write the logic as code, write it as code. Use an LLM
        when the logic depends on reading and interpreting messy human input.
      </p>

      <Figure label="Fit" caption="LLMs are good at judgment on unstructured input. They are expensive and unreliable replacements for logic you can already write down.">
        <Fit />
      </Figure>

      <p>
        Every item on the right can be done by an LLM, and teams do try it, usually because it works in a notebook
        demo with twenty rows. At twenty million rows it becomes slow, expensive, and wrong in ways that are hard to
        find.
      </p>

      <h2>The pattern: generate once, execute deterministically</h2>
      <p>
        The most valuable pattern I have found is to keep the LLM out of the per-row path entirely. Instead of asking
        a model to judge each row, ask it once to produce an artifact such as a rule, a mapping or a SQL expression.
        A person reviews that artifact, and the engine runs it at scale.
      </p>
      <p>
        For data quality this works very well. The model gets a profile of a column: its type, null rate, distinct
        count, a sample of values, the most common patterns and what the column means in the business glossary. It
        proposes expectations. A steward approves, edits or rejects each one. Approved rules become versioned code
        that Spark evaluates on every run, with no model call at run time.
      </p>

      <Figure
        label="DQ rule lifecycle"
        caption="The model proposes, a person approves, and Spark executes. The expensive, probabilistic step happens once per rule instead of once per row."
        wide
      >
        <RuleLifecycle />
      </Figure>

      <Code lang="json" title="generated_rule.json">{`
{
  "rule_id": "dq.customer.tax_id.us_ein_format",
  "column": "tax_id",
  "check": "regex_match",
  "params": { "pattern": "^\\\\d{2}-\\\\d{7}$" },
  "filter": "country = 'US'",
  "severity": "warn",
  "rationale": "98.6% of US rows match the EIN format; non-matching values appear to be typos or SSNs.",
  "provenance": {
    "model": "anthropic.claude-sonnet-5",
    "prompt_version": "dq-proposer@12",
    "profile_run_id": "a41f0c2e",
    "approved_by": "steward:mkim"
  }
}
`}</Code>
      <p>
        The <code>provenance</code> block is not decoration. When a rule starts failing six months later, the first
        question is why it exists. The answer should be one lookup away: which model proposed it, from which prompt
        version, based on which profile, and who approved it.
      </p>
      <p>
        This pattern turns an LLM problem into an ordinary software problem. Rules can be unit tested, diffed and
        rolled back, and the pipeline stays reproducible because the thing that runs is plain code.
      </p>

      <h2>When you do need per-row inference</h2>
      <p>
        Sometimes the value is in the row itself: classifying a free-text expense description, pulling fields out
        of an attached contract, or normalizing a supplier name that appears in forty spellings. Then the LLM has to
        run per row, and five things matter.
      </p>

      <h3>1. Batch, and cache by input hash</h3>
      <p>
        Real datasets repeat themselves. The same product description appears thousands of times. Hash the normalized
        input together with the prompt version and model ID, and check a cache table before calling the model. On
        reference data, that often removes most of the calls. Send what remains in batches to reduce per-request
        overhead, and use the provider&apos;s batch API when latency does not matter.
      </p>

      <h3>2. Structured output, validated</h3>
      <p>
        Never parse free text. Give the model a JSON schema and use the provider&apos;s structured output or tool
        calling mode, whether that is Bedrock, Vertex AI or Azure OpenAI. Then validate the result again on your side,
        because a valid shape can still contain a category that does not exist in your taxonomy. Rows that fail
        validation go to a quarantine table, not into Silver.
      </p>

      <h3>3. Confidence thresholds and a review queue</h3>
      <p>
        Every prediction carries a confidence, either from the model or from a secondary check such as agreement
        between two prompts. Above the threshold, the row moves on. Below it, the row goes to a review queue where a
        person decides, and their decisions become labeled data for evaluation.
      </p>

      <Figure
        label="Per-row classification"
        caption="Confident predictions continue to Silver. Uncertain ones go to a person, which keeps quality high without reviewing everything."
      >
        <ClassifyTable />
      </Figure>

      <Code lang="python" title="classify.py (PySpark)">{`
import json, hashlib
import pandas as pd
from pydantic import BaseModel, ValidationError

PROMPT_VERSION = "expense-classifier@7"
MODEL_ID = "anthropic.claude-haiku-4-5"          # pinned, never "latest"
CATEGORIES = {"Medical supplies", "Facilities", "Software", "Travel", "Unknown"}

class Label(BaseModel):
    category: str
    confidence: float

def key(text: str) -> str:
    norm = " ".join(text.lower().split())
    return hashlib.sha256(f"{MODEL_ID}|{PROMPT_VERSION}|{norm}".encode()).hexdigest()

def classify_batches(batches):
    for pdf in batches:
        out = []
        for chunk in (pdf[i:i + 25] for i in range(0, len(pdf), 25)):
            raw = llm_json(MODEL_ID, PROMPT_VERSION, chunk["description"].tolist())  # one call per 25 rows
            for row, item in zip(chunk.itertuples(), raw):
                try:
                    lbl = Label(**item)
                    ok = lbl.category in CATEGORIES
                except ValidationError:
                    lbl, ok = Label(category="Unknown", confidence=0.0), False
                out.append((row.id, row.cache_key, lbl.category, lbl.confidence, ok,
                            MODEL_ID, PROMPT_VERSION, json.dumps(item)))
        yield pd.DataFrame(out, columns=["id", "cache_key", "category", "confidence", "valid",
                                         "model_id", "prompt_version", "raw_output"])

todo = (df.withColumn("cache_key", key_udf("description"))
          .join(cache, "cache_key", "left_anti"))          # only uncached inputs hit the model

labeled = todo.repartition(32).mapInPandas(classify_batches, schema=OUT_SCHEMA)
labeled.filter("valid AND confidence >= 0.8").write.mode("append").saveAsTable("silver.expenses_labeled")
labeled.filter("NOT valid OR confidence < 0.8").write.mode("append").saveAsTable("ops.review_queue")
`}</Code>
      <p>
        A few choices in there are deliberate. The <code>repartition</code> controls concurrency, and with it how hard
        you hit rate limits. The model output is stored raw next to the parsed value, so a parsing bug can be fixed
        without paying for inference again. Every row records the model and prompt version that produced it.
      </p>

      <h3>4. Idempotency and reproducibility</h3>
      <p>
        A rerun of yesterday&apos;s job should produce yesterday&apos;s output. With LLMs that only holds if you
        pin the model version, version your prompts like code, set temperature to zero, and read from the cache
        before calling the model. When you do change the model or prompt, treat it as a migration: run the new
        version on a sample, compare, then backfill on purpose.
      </p>
      <Compare
        leftTitle="Fragile"
        left={
          <>
            Model alias like <code>latest</code>, prompt inlined in a notebook, output overwritten in place, no record
            of which run produced which label.
          </>
        }
        rightTitle="Reproducible"
        right={
          <>
            Pinned model ID, prompt in a registry with a version, cache keyed on both, append-only output with{" "}
            <code>model_id</code> and <code>prompt_version</code> columns.
          </>
        }
      />

      <h3>5. Evaluate continuously</h3>
      <p>
        A golden set of a few hundred labeled rows, drawn partly from the review queue, is the most useful asset in
        the project. Every prompt or model change runs against it before deployment. I log those runs to MLflow with
        the prompt version as a parameter and accuracy, per-class precision, validity rate and cost per thousand rows
        as metrics. In production, the same metrics are computed on each batch, along with the share of rows sent to
        review. A sudden jump in review volume is usually the first sign that the input data has changed.
      </p>

      <Figure label="Medallion + LLM" caption="The LLM step sits between Silver and Gold with a cache in front and a review queue beside it. Approved reviews flow back into the curated layer." wide>
        <Medallion />
      </Figure>

      <h2>Lineage</h2>
      <p>
        Data teams already care about lineage, and LLM steps have to join that graph. For every derived value, you
        should be able to answer three questions: which input rows produced it, which model and prompt version were
        used, and whether a person reviewed it. On Databricks, storing those as columns and registering the prompt as
        an MLflow artifact gets you most of the way. If a downstream dashboard looks wrong, you can trace a number
        back to a specific prompt revision.
      </p>

      <Callout title="Rule of thumb">
        If you cannot say which prompt version produced a value in your Gold table, the pipeline is not ready for
        production. That is true however good the model is.
      </Callout>

      <h2>What I would tell a team starting out</h2>
      <ul>
        <li>Look for places where people currently read text and make a judgment. That is where LLMs pay off.</li>
        <li>Prefer generating rules and mappings over per-row inference. Execution stays cheap and testable.</li>
        <li>When you do run per row, cache, batch, validate, and route low-confidence output to people.</li>
        <li>Pin everything, version prompts, and store raw outputs.</li>
        <li>Build the golden set before you build the pipeline.</li>
      </ul>
      <p>
        None of this is exotic. It is the same discipline data engineering has always applied to external dependencies,
        applied to a dependency that happens to be a language model.
      </p>
    </>
  );
}
