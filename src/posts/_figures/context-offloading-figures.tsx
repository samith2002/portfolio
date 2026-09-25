import { Figure } from "@/components/blog";

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[12px] uppercase tracking-[0.1em] text-faint ${className}`}>{children}</span>
  );
}

function FileIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none" className={className} aria-hidden>
      <path d="M3 1.5h10l6 6V23a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 2 23V3a1.5 1.5 0 0 1 1-1.5Z" className="fill-surface stroke-faint" strokeWidth="1.2" />
      <path d="M13 1.5V7.5h6" className="stroke-faint" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6 13h10M6 16.5h10M6 20h6" className="stroke-faint" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function MiniMeter({ pct, tone = "accent" }: { pct: number; tone?: "accent" | "hot" }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-line">
      <div
        className={`h-full rounded-full ${tone === "hot" ? "bg-[#d4574a]/80" : "bg-accent"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ————— 1. A big tool result becomes a handle ————— */

const rows = [
  '{"id":"ent_7Qx2","name":"Acme Holdings GmbH",',
  ' "duns":"04-812-3321","country":"DE",',
  ' "crosswalks":[{"src":"SAP","key":"10044…"},',
  '{"id":"ent_9Lm4","name":"ACME Holdings",',
  ' "duns":"04-812-3321","country":"DE",',
  ' "audit":[{"ts":"2025-11-02T…","user":"…"},',
  '{"id":"ent_3Pz8","name":"Acme Hldgs Ltd",',
  ' "duns":null,"country":"GB","addr":{…},',
];

export function OffloadFlowFigure() {
  return (
    <Figure
      label="Offload a large result"
      wide
      caption="The tool writes the full result to storage and returns a handle: where it lives, its shape, and a short preview. The model can reason about it and read slices later. The 48k-token payload never enters the window."
    >
      <div className="grid gap-4 px-5 pb-7 pt-12 sm:px-8 md:grid-cols-[1fr_72px_1fr] md:gap-0">
        {/* Raw result */}
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="truncate font-mono text-[12px] text-fg">search_matches(&quot;Acme&quot;)</span>
            <span className="shrink-0 font-mono text-[12px] text-bad">48,210 tok</span>
          </div>
          <div className="relative h-[188px] overflow-hidden px-4 py-3">
            {rows.concat(rows).map((r, i) => (
              <p key={i} className="truncate font-mono text-[12px] leading-[1.7] text-muted">
                {r}
              </p>
            ))}
            <div className="scan pointer-events-none absolute inset-x-0 top-0 h-12 bg-accent-soft" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />
          </div>
          <div className="border-t border-line px-4 py-2 font-mono text-[12px] text-faint">2,314 rows · 41 fields</div>
        </div>

        {/* Connectors */}
        <div className="relative hidden md:block" aria-hidden>
          <svg viewBox="0 0 72 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d="M0 100 C 36 100, 36 40, 72 40" fill="none" className="stroke-accent flow" strokeWidth="1.5" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
            <path d="M0 100 C 36 100, 36 160, 72 160" fill="none" className="stroke-faint flow-slow" strokeWidth="3" strokeDasharray="8 5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="flex justify-center text-faint md:hidden" aria-hidden>
          <svg width="16" height="26" viewBox="0 0 16 26" fill="none">
            <path d="M8 2v20m0 0-5-5m5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Destinations */}
        <div className="flex flex-col justify-between gap-4">
          <div className="rounded-xl border border-accent/40 bg-surface p-4">
            <div className="mb-2.5 flex items-center justify-between">
              <Label className="!text-accent">Into the context window</Label>
              <span className="font-mono text-[12px] text-ok">~410 tok</span>
            </div>
            <div className="space-y-1 font-mono text-[12px] leading-[1.6]">
              <p className="text-fg">
                saved → <span className="text-accent">/scratch/matches_8f2a.jsonl</span>
              </p>
              <p className="text-muted">2,314 rows · fields: id, name, duns, country…</p>
              <p className="text-muted">top 3 by score: ent_7Qx2, ent_9Lm4, ent_3Pz8</p>
              <p className="text-faint">use read_slice / grep_file to inspect</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-faint px-4 py-3">
            <FileIcon className="float shrink-0" />
            <div className="min-w-0">
              <p className="truncate font-mono text-[12px] text-fg">matches_8f2a.jsonl</p>
              <p className="font-mono text-[12px] text-faint">48,210 tok · outside the window</p>
            </div>
          </div>
        </div>
      </div>
    </Figure>
  );
}

/* ————— 2. The scratchpad the agent re-reads ————— */

const todos = [
  { t: "Pull match candidates for Acme Holdings", done: true },
  { t: "Fetch top 5 records → /scratch/acme_top5.json", done: true },
  { t: "Check ownership against the EU constraint", done: false },
  { t: "Simulate merge ent_7Qx2 + ent_9Lm4", done: false },
  { t: "Route to a steward for approval", done: false },
];

function Tick() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M2 5.2 4.2 7.3 8 3" className="stroke-bg" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check({ done, animate, i = 0 }: { done: boolean; animate?: boolean; i?: number }) {
  return (
    <span
      className={`relative mt-[1px] grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border ${
        done ? "border-accent bg-accent" : "border-faint"
      }`}
    >
      {done && <Tick />}
      {animate && !done && (
        <span
          className="step-in absolute -inset-px grid place-items-center rounded-[4px] bg-accent"
          style={{ "--i": i, "--cycle": "8s", "--gap": "1.6s" } as React.CSSProperties}
        >
          <Tick />
        </span>
      )}
    </span>
  );
}

export function ScratchpadFigure() {
  return (
    <Figure
      label="Scratchpad"
      caption="A plan the agent writes to a file and re-reads at the start of each step. The plan survives compaction, costs a few hundred tokens to reload, and puts the current goal at the end of the context, where the model pays most attention."
    >
      <div className="px-5 pb-7 pt-12 sm:px-8">
        <div className="mx-auto max-w-[440px] overflow-hidden rounded-xl border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-line" />
                <span className="h-2 w-2 rounded-full bg-line" />
                <span className="h-2 w-2 rounded-full bg-line" />
              </span>
              <span className="font-mono text-[12px] text-muted">todo.md</span>
            </div>
            <span className="breathe font-mono text-[12px] text-accent">re-read each step</span>
          </div>
          <div className="space-y-4 px-4 py-4">
            <p className="font-mono text-[12px] text-fg"># Resolve Acme Holdings duplicates</p>
            <ul className="space-y-2.5">
              {todos.map((td, i) => (
                <li key={td.t} className="flex gap-2.5 text-[12.5px] leading-snug">
                  <Check done={td.done} animate={i === 2 || i === 3} i={i - 2} />
                  <span className={td.done ? "text-muted line-through decoration-faint" : "text-fg"}>
                    {td.t}
                    {i === 2 && <span className="caret ml-0.5 inline-block h-3 w-[2px] translate-y-[2px] bg-accent" />}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-line pt-3">
              <p className="font-mono text-[12px] text-fg">## Notes</p>
              <p className="mt-1.5 font-mono text-[12px] leading-[1.7] text-muted">- ent_7Qx2 and ent_9Lm4 share DUNS 04-812-3321</p>
              <p className="font-mono text-[12px] leading-[1.7] text-muted">- ent_3Pz8: address conflict, user said hold</p>
            </div>
          </div>
        </div>
      </div>
    </Figure>
  );
}

/* ————— 3. Sub-agents with clean windows ————— */

const subs = [
  { name: "Match analysis", used: 78, ret: "2 true matches, 1 conflict (ent_3Pz8)" },
  { name: "Policy check", used: 64, ret: "EU ownership rule: ent_9Lm4 is clear" },
  { name: "Merge simulation", used: 86, ret: "14 field conflicts, 3 need a person" },
];

export function SubAgentsFigure() {
  return (
    <Figure
      label="Delegation"
      wide
      caption="Each sub-agent starts with an empty window, spends as much as its task needs, and returns one short result. The orchestrator's window only grows by those results, so it stays small enough to keep the whole plan in view."
    >
      <div className="px-5 pb-7 pt-12 sm:px-8">
        <div className="mx-auto max-w-[300px] rounded-xl border border-fg/80 bg-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-medium">Orchestrator</span>
            <span className="font-mono text-[12px] text-ok">22%</span>
          </div>
          <MiniMeter pct={22} />
          <p className="mt-2 font-mono text-[12px] text-faint">plan + 3 one-line results</p>
        </div>

        <div className="relative hidden h-14 sm:block" aria-hidden>
          <svg viewBox="0 0 600 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {[100, 300, 500].map((x, i) => (
              <path
                key={x}
                d={`M ${x} 56 C ${x} 28, 300 28, 300 0`}
                fill="none"
                className="flow stroke-accent"
                strokeWidth="1.4"
                strokeDasharray="4 5"
                vectorEffect="non-scaling-stroke"
                style={{ animationDirection: "reverse", animationDelay: `${i * 200}ms` }}
              />
            ))}
          </svg>
        </div>
        <div className="h-5 sm:hidden" />

        <div className="grid gap-3 sm:grid-cols-3">
          {subs.map((s, i) => (
            <div key={s.name} className="flex flex-col rounded-xl border border-line bg-surface p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[12.5px] font-medium">{s.name}</span>
                <span className="font-mono text-[12px] text-muted">{s.used}%</span>
              </div>
              <MiniMeter pct={s.used} tone="hot" />
              <p className="mt-2 font-mono text-[12px] text-faint">own window, discarded after</p>
              <div
                className="step-in mt-4 rounded-lg border border-accent/40 bg-accent-soft px-3 py-2 text-[12px] leading-snug text-fg"
                style={{ "--i": i, "--cycle": "7s", "--gap": "0.7s" } as React.CSSProperties}
              >
                <span className="text-accent">↑ </span>
                {s.ret}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Figure>
  );
}

/* ————— 4. Where state lives ————— */

const tiers = [
  {
    name: "Context window",
    heat: "Hot",
    holds: "The current step: goal, constraints, latest results",
    read: "Free. It's already there",
    life: "One call",
  },
  {
    name: "Graph state",
    heat: "Warm",
    holds: "Typed fields: candidate IDs, decisions, flags, counters",
    read: "Injected by the node that needs it",
    life: "One run",
  },
  {
    name: "Files / object store",
    heat: "Cool",
    holds: "Large results, drafts, plans, logs",
    read: "A tool call, by slice or search",
    life: "Task or longer",
  },
  {
    name: "Memory store",
    heat: "Cold",
    holds: "Durable facts and preferences across sessions",
    read: "Retrieval by query",
    life: "Indefinite, with decay",
  },
];

export function TiersFigure() {
  return (
    <Figure
      label="Where state lives"
      wide
      caption="Four places to keep state, from most expensive to hold to most expensive to read. Offloading means putting each piece in the coldest tier that still lets the agent get it back in time."
    >
      <div className="px-5 pb-7 pt-12 sm:px-8">
        <div className="mb-5 flex items-center gap-3 font-mono text-[12px] text-faint">
          <span>in view, costs tokens</span>
          <span className="h-px flex-1 bg-gradient-to-r from-accent to-line" />
          <span>out of view, costs a lookup</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t, i) => (
            <div
              key={t.name}
              className="rounded-xl border border-line bg-surface p-4"
            >
              <span
                className="mb-3 block h-1 w-10 rounded-full"
                style={{ background: `color-mix(in oklab, var(--accent) ${100 - i * 28}%, var(--line))` }}
              />
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[13px] font-medium">{t.name}</p>
                <Label>{t.heat}</Label>
              </div>
              <dl className="mt-3 space-y-2.5 text-[12px] leading-snug">
                <div>
                  <dt className="font-mono text-[12px] text-faint">holds</dt>
                  <dd className="text-muted">{t.holds}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[12px] text-faint">read cost</dt>
                  <dd className="text-muted">{t.read}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[12px] text-faint">lifetime</dt>
                  <dd className="text-muted">{t.life}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </Figure>
  );
}
