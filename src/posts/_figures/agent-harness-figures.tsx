import type { CSSProperties, ReactNode } from "react";

const GREEN = "#22a05e";
const RED = "#d4574a";

/* ————— 1. The harness as layers around a small model core ————— */

const layers = [
  { name: "Observability & evals", note: "traces, cost, regressions" },
  { name: "State & checkpoints", note: "pause, resume, replay" },
  { name: "Permissions", note: "who may do what" },
  { name: "Tools", note: "registry, schemas, dispatch" },
  { name: "Context assembly", note: "what the model sees" },
];

function Layer({ i }: { i: number }): ReactNode {
  if (i === layers.length) {
    return (
      <div className="float grid place-items-center rounded-xl bg-fg px-4 py-6 text-center text-bg sm:py-8">
        <span className="font-serif text-[24px] italic leading-none">the model</span>
        <span className="mt-2 font-mono text-[12px] tracking-[0.04em] opacity-60">messages in → message out</span>
      </div>
    );
  }
  const l = layers[i];
  const inner = i === layers.length - 1;
  return (
    <div
      className={`relative rounded-2xl border p-2 pt-8 sm:p-3 sm:pt-9 ${
        inner ? "border-accent/40 bg-accent-soft" : "border-line bg-surface/60"
      }`}
    >
      <div className="absolute inset-x-3 top-2.5 flex items-baseline justify-between gap-3">
        <span className={`text-[12px] font-medium ${inner ? "text-accent" : "text-fg"}`}>{l.name}</span>
        <span className="hidden font-mono text-[12px] text-faint sm:inline">{l.note}</span>
      </div>
      <Layer i={i + 1} />
    </div>
  );
}

export function HarnessLayers() {
  return (
    <div className="mx-auto max-w-[560px] px-4 pb-6 pt-10 sm:px-8 sm:pb-8 sm:pt-12">
      <Layer i={0} />
    </div>
  );
}

/* ————— 2. The agent loop with a token travelling around it ————— */

const R = 110;
const C = 130;
const ring = `path('M ${C} ${C - R} A ${R} ${R} 0 1 1 ${C - 0.01} ${C - R} Z')`;

const stations: { label: string; sub: string; style: CSSProperties }[] = [
  { label: "Assemble", sub: "context", style: { left: C, top: C - R } },
  { label: "Call model", sub: "think", style: { left: C + R, top: C } },
  { label: "Run tools", sub: "act", style: { left: C, top: C + R } },
  { label: "Check", sub: "stop?", style: { left: C - R, top: C } },
];

const stops = [
  { text: "Model returns a final answer", color: GREEN },
  { text: "max_steps reached", color: "var(--faint)" },
  { text: "Token or dollar budget spent", color: "var(--faint)" },
  { text: "Reviewer rejects an action", color: "var(--faint)" },
  { text: "Same call repeated 3×", color: RED },
];

export function AgentLoop() {
  return (
    <div className="flex flex-col items-center gap-8 px-4 pb-8 pt-12 sm:flex-row sm:justify-center sm:gap-12 sm:px-8">
      <div className="relative h-[260px] w-[260px] shrink-0">
        <svg viewBox="0 0 260 260" className="absolute inset-0 h-full w-full" aria-hidden>
          <circle cx={C} cy={C} r={R} fill="none" stroke="var(--line)" strokeWidth="1.5" />
          <circle
            cx={C}
            cy={C}
            r={R}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity="0.45"
            strokeWidth="1.5"
            strokeDasharray="2 8"
            className="flow-slow"
          />
        </svg>

        <span
          className="travel absolute left-0 top-0 h-3 w-3 rounded-full bg-accent shadow-[0_0_0_4px_var(--accent-soft)]"
          style={{ offsetPath: ring, "--dur": "6s" } as CSSProperties}
        />

        {stations.map((s) => (
          <div
            key={s.label}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-center shadow-[0_1px_0_var(--line)]"
            style={s.style}
          >
            <p className="whitespace-nowrap text-[12px] font-medium leading-tight">{s.label}</p>
            <p className="font-mono text-[12px] leading-tight text-faint">{s.sub}</p>
          </div>
        ))}

        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-faint">step</p>
            <p className="font-serif text-[40px] leading-none">
              7<span className="text-faint">/25</span>
            </p>
            <p className="mt-1.5 font-mono text-[12px] text-muted">
              $0.18 of $2.00<span className="caret">▍</span>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[250px]">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-faint">Exits the loop when</p>
        <ul className="mt-3 space-y-2.5">
          {stops.map((s) => (
            <li key={s.text} className="flex items-center gap-2.5 text-[13px] text-muted">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: s.color }} />
              {s.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ————— 3. A permission gate on an irreversible write ————— */

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0" aria-hidden>
      <circle cx="7" cy="7" r="6.25" stroke={GREEN} strokeOpacity="0.5" />
      <path d="m4.3 7.2 1.8 1.8 3.6-3.8" stroke={GREEN} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PermissionGate() {
  return (
    <div className="px-4 pb-8 pt-12 sm:px-10">
      <div className="mx-auto max-w-[480px] overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <span className="text-[12.5px] font-medium">Data steward agent</span>
          <span className="flex items-center gap-2 font-mono text-[12px] text-accent">
            <span className="breathe h-1.5 w-1.5 rounded-full bg-accent" />
            waiting on you
          </span>
        </div>

        <ul className="divide-y divide-line text-[12.5px]">
          <li className="flex items-center gap-3 px-4 py-2.5">
            <Check />
            <span className="min-w-0 flex-1 truncate font-mono text-[12px]">search_entities(&quot;Acme Corp&quot;)</span>
            <span className="shrink-0 font-mono text-[12px] text-faint">read · auto</span>
          </li>
          <li className="flex items-center gap-3 px-4 py-2.5">
            <Check />
            <span className="min-w-0 flex-1 truncate font-mono text-[12px]">match_score(C-10482, C-20931)</span>
            <span className="shrink-0 font-mono text-[12px] text-faint">0.94</span>
          </li>
          <li className="bg-accent-soft px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[12px] font-medium">merge_entities(C-10482 → C-20931)</span>
              <span className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[12px] text-accent">
                write · irreversible
              </span>
            </div>
            <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[12px] leading-relaxed">
              <span className="text-faint">survivor</span>
              <span>C-20931 ACME Corporation GmbH</span>
              <span className="text-faint">evidence</span>
              <span>same tax_id, same billing address</span>
              <span className="text-faint">affects</span>
              <span>14 open orders, 2 contracts</span>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-fg px-3.5 py-1.5 text-[12px] font-medium text-bg">Approve</span>
              <span className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12px] text-muted">
                Reject
              </span>
              <span className="rounded-full px-2 py-1.5 text-[12px] text-muted">Edit…</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ————— 4. A trace waterfall for one agent run ————— */

type Span = { name: string; start: number; width: number; kind: "run" | "llm" | "tool" | "gate"; ms: string };

const spans: Span[] = [
  { name: "agent.run", start: 0, width: 100, kind: "run", ms: "41.2s" },
  { name: "llm.call #1", start: 0, width: 9, kind: "llm", ms: "3.6s" },
  { name: "tool.search_entities", start: 9.5, width: 4, kind: "tool", ms: "1.4s" },
  { name: "llm.call #2", start: 14, width: 8, kind: "llm", ms: "3.1s" },
  { name: "tool.match_score", start: 22.5, width: 3, kind: "tool", ms: "0.9s" },
  { name: "llm.call #3", start: 26, width: 7, kind: "llm", ms: "2.8s" },
  { name: "gate.human_approval", start: 33.5, width: 54, kind: "gate", ms: "22.4s" },
  { name: "tool.merge_entities", start: 88, width: 4, kind: "tool", ms: "1.7s" },
  { name: "llm.call #4", start: 92.5, width: 7.5, kind: "llm", ms: "2.9s" },
];

const barStyle: Record<Span["kind"], string> = {
  run: "bg-fg/80",
  llm: "bg-accent",
  tool: "bg-muted/70",
  gate: "breathe border border-dashed border-accent/60 bg-accent-soft",
};

export function TraceWaterfall() {
  return (
    <div className="px-4 pb-6 pt-12 sm:px-8">
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[12px] text-muted">
        <span>4 model calls</span>
        <span>3 tool calls</span>
        <span>11.2k tokens</span>
        <span>$0.06</span>
        <span className="text-accent">54% waiting on a human</span>
      </div>

      <div className="mt-5 space-y-2">
        {spans.map((s) => (
          <div key={s.name} className="grid gap-1 sm:grid-cols-[170px_1fr_52px] sm:items-center sm:gap-3">
            <span className="truncate font-mono text-[12px] text-muted">{s.name}</span>
            <div className="relative h-3.5 rounded-sm bg-line/40">
              <div
                className={`absolute inset-y-0 rounded-sm ${barStyle[s.kind]}`}
                style={{ left: `${s.start}%`, width: `${s.width}%` }}
              />
            </div>
            <span className="hidden text-right font-mono text-[12px] text-faint sm:block">{s.ms}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[12px] text-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-sm bg-accent" /> model
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-sm bg-muted/70" /> tool
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-sm border border-dashed border-accent/60 bg-accent-soft" /> approval
        </span>
      </div>
    </div>
  );
}
