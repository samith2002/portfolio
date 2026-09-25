import type { CSSProperties, ReactNode } from "react";

const GREEN = "#22a05e";
const RED = "#d4574a";

/* ————— 1. What goes over the wire ————— */

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-line bg-surface shadow-[0_1px_0_var(--line)]">
      <div className="border-b border-line px-3.5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-faint">
        {title}
      </div>
      <pre className="overflow-x-auto px-3.5 py-3 font-mono text-[12px] leading-[1.7] text-muted">{children}</pre>
    </div>
  );
}

const k = (s: string) => <span className="text-fg">{s}</span>;
const a = (s: string) => <span className="text-accent">{s}</span>;

export function WireFigure() {
  return (
    <div className="px-4 pb-8 pt-12 sm:px-8">
      <div className="grid items-center gap-3 md:grid-cols-[1fr_56px_1fr]">
        <Card title="Request">
          {k("system")}: &quot;You are a data steward…&quot;{"\n"}
          {k("tools")}: [{"\n"}
          {"  "}
          {a("find_customer")}
          {"\n"}
          {"  "}match_score{"\n"}
          {"  "}merge_customers{"\n"}]{"\n"}
          {k("messages")}: [user]
        </Card>

        <div className="flex justify-center" aria-hidden>
          <svg viewBox="0 0 56 24" className="h-6 w-14 rotate-90 md:rotate-0">
            <path d="M2 12h46" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 5" className="flow" />
            <path d="m44 7 6 5-6 5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <Card title="Response">
          {k("stop_reason")}: {a('"tool_use"')}
          {"\n"}
          {k("content")}: [{"\n"}
          {"  "}tool_use {"{"}
          {"\n"}
          {"    "}id: &quot;toolu_01&quot;{"\n"}
          {"    "}name: {a('"find_customer"')}
          {"\n"}
          {"    "}input: {"{"} name: &quot;Acme Corp&quot; {"}"}
          {"\n"}
          {"  "}
          {"}"}
          {"\n"}]
        </Card>
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-accent/40 bg-accent-soft px-4 py-3">
        <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-accent">Your code, not the model</p>
        <ol className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[12.5px]">
          {["validate input", "run find_customer()", "append tool_result", "call the model again"].map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className="rounded-md border border-line bg-surface px-2 py-0.5">{s}</span>
              {i < 3 && <span className="text-faint">→</span>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ————— 2. A message trace with two parallel calls ————— */

type Row = { role: string; tone: "user" | "call" | "result" | "final"; body: ReactNode };

const rows: Row[] = [
  {
    role: "user",
    tone: "user",
    body: <>Are &quot;Acme Corp&quot; and &quot;ACME Corporation GmbH&quot; the same customer?</>,
  },
  {
    role: "assistant",
    tone: "call",
    body: (
      <div className="space-y-1.5 font-mono text-[12px]">
        <p>
          <span className="text-accent">tool_use</span> find_customer {"{"}name: &quot;Acme Corp&quot;{"}"}
        </p>
        <p>
          <span className="text-accent">tool_use</span> find_customer {"{"}name: &quot;ACME Corporation GmbH&quot;
          {"}"}
        </p>
      </div>
    ),
  },
  {
    role: "tool_result",
    tone: "result",
    body: (
      <div className="space-y-1.5 font-mono text-[12px]">
        <p>C-10482 · Acme Corp · DE · tax DE811…07</p>
        <p>C-20931 · ACME Corporation GmbH · DE · tax DE811…07</p>
      </div>
    ),
  },
  {
    role: "assistant",
    tone: "final",
    body: (
      <>
        Very likely the same company. Both records share tax ID DE811…07 and a billing address. Want me to open a
        merge request?
      </>
    ),
  },
];

const bubble: Record<Row["tone"], string> = {
  user: "border-line bg-surface text-fg",
  call: "border-accent/40 bg-accent-soft text-fg",
  result: "border-dashed border-faint bg-transparent text-muted",
  final: "border-line bg-surface text-fg",
};

export function MessageTrace() {
  return (
    <div className="px-4 pb-8 pt-12 sm:px-10">
      <ol className="relative mx-auto max-w-[520px] space-y-3 before:absolute before:bottom-3 before:left-[5px] before:top-3 before:w-px before:bg-line">
        {rows.map((r, i) => (
          <li
            key={i}
            className="step-in relative pl-6"
            style={
              { "--i": i, "--cycle": "10s", "--gap": "1s", animationFillMode: "backwards" } as CSSProperties
            }
          >
            <span
              className={`absolute left-0 top-3 h-[11px] w-[11px] rounded-full border-2 border-bg ${
                r.tone === "call" ? "bg-accent" : r.tone === "result" ? "bg-faint" : "bg-fg"
              }`}
            />
            <p className="mb-1 font-mono text-[12px] uppercase tracking-[0.1em] text-faint">
              {r.role}
              {r.tone === "call" && <span className="ml-2 normal-case tracking-normal text-accent">2 calls, parallel</span>}
            </p>
            <div className={`rounded-lg border px-3.5 py-2.5 text-[13px] leading-snug ${bubble[r.tone]}`}>{r.body}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ————— 3. A bad tool vs a good tool ————— */

function Issue({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <li className="flex gap-2 text-[12.5px] leading-snug text-muted">
      <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ok ? GREEN : RED }} />
      <span>{children}</span>
    </li>
  );
}

function ToolCard({
  title,
  sig,
  desc,
  returns,
  error,
  notes,
  ok,
}: {
  title: string;
  sig: ReactNode;
  desc: string;
  returns: string;
  error: string;
  notes: string[];
  ok: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border p-4 ${ok ? "border-accent/40 bg-surface" : "border-line bg-surface/60"}`}
    >
      <p className={`font-mono text-[12px] uppercase tracking-[0.1em] ${ok ? "text-accent" : "text-faint"}`}>{title}</p>
      <p className="mt-3 break-words font-mono text-[12px] leading-relaxed text-fg">{sig}</p>
      <p className="mt-2 text-[12.5px] leading-snug text-muted">{desc}</p>
      <div className="mt-3 grid grid-cols-[62px_1fr] gap-x-2 gap-y-1.5 font-mono text-[12px] leading-snug">
        <span className="text-faint">returns</span>
        <span className="text-muted">{returns}</span>
        <span className="text-faint">on error</span>
        <span className={ok ? "text-fg" : ""} style={ok ? undefined : { color: RED }}>
          {error}
        </span>
      </div>
      <ul className="mt-4 space-y-1.5 border-t border-line pt-3">
        {notes.map((n) => (
          <Issue key={n} ok={ok}>
            {n}
          </Issue>
        ))}
      </ul>
    </div>
  );
}

export function ToolDesign() {
  return (
    <div className="grid gap-3 px-4 pb-8 pt-12 sm:px-8 md:grid-cols-2">
      <ToolCard
        ok={false}
        title="Before"
        sig={<>call_crm(endpoint: str, payload: str)</>}
        desc="Calls the CRM API."
        returns="raw response · 212 fields · ~38 KB"
        error="HTTP 500"
        notes={[
          "The model has to guess endpoints and payload shape",
          "One call can take up a large share of the context",
          "The error gives the model nothing to act on",
        ]}
      />
      <ToolCard
        ok
        title="After"
        sig={
          <>
            find_customer(name: str, country?: <span className="text-accent">&quot;US&quot;|&quot;DE&quot;|&quot;IN&quot;</span>
            , limit: int = 5)
          </>
        }
        desc="Search customers by legal name. Use before any tool that needs a customer_id."
        returns="≤5 rows · id, name, country, tax_id · ~0.6 KB"
        error="No match in DE. 2 matches in AT. Retry with country='AT' or search by tax_id."
        notes={[
          "One job, typed arguments, an enum instead of free text",
          "Output sized for a context window",
          "The error tells the model what to try next",
        ]}
      />
    </div>
  );
}

/* ————— 4. Side-effect tiers ————— */

const tiers = [
  {
    level: 1,
    name: "Read",
    examples: "find_customer · get_record · list_matches",
    policy: "Run automatically. Safe to retry and cache.",
    chip: "auto",
    chipStyle: { color: GREEN, borderColor: "rgba(34,160,94,0.4)" },
  },
  {
    level: 2,
    name: "Reversible write",
    examples: "add_note · tag_record · create_task",
    policy: "Run automatically with an idempotency key. Log and allow undo.",
    chip: "auto + log",
    chipStyle: { color: "var(--accent)", borderColor: "color-mix(in oklab, var(--accent) 40%, transparent)" },
  },
  {
    level: 3,
    name: "Irreversible or external",
    examples: "merge_customers · delete_record · send_email",
    policy: "Stop. Show a person the exact call and the evidence.",
    chip: "approval",
    chipStyle: { color: "var(--bg)", background: "var(--fg)", borderColor: "var(--fg)" },
  },
];

export function SideEffectTiers() {
  return (
    <div className="px-4 pb-8 pt-12 sm:px-8">
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        {tiers.map((t) => (
          <li key={t.name} className="grid gap-3 px-4 py-4 sm:grid-cols-[44px_1fr_auto] sm:items-center sm:gap-5">
            <div className="flex gap-1" aria-label={`risk ${t.level} of 3`}>
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`h-4 w-2 rounded-[2px] ${n <= t.level ? "bg-fg" : "bg-line"}`}
                  style={n <= t.level ? { opacity: 0.35 + n * 0.2 } : undefined}
                />
              ))}
            </div>
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium">{t.name}</p>
              <p className="mt-0.5 break-words font-mono text-[12px] text-faint">{t.examples}</p>
              <p className="mt-1.5 text-[12.5px] leading-snug text-muted">{t.policy}</p>
            </div>
            <span
              className={`w-fit rounded-full border px-2.5 py-1 font-mono text-[12px] ${t.level === 3 ? "breathe" : ""}`}
              style={t.chipStyle}
            >
              {t.chip}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
