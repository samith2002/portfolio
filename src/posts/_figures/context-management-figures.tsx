import { Figure } from "@/components/blog";

function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`font-mono text-[12px] text-faint ${
        typeof children === "string" && children.length > 24 ? "" : "uppercase tracking-[0.1em]"
      } ${className}`}
    >
      {children}
    </span>
  );
}

/* ————— 1. The context window as a stacked meter ————— */

type Seg = { label: string; k: number; cls: string; hot?: boolean };

const WINDOW_K = 128;
const BUDGET_K = 64;

const unmanaged: Seg[] = [
  { label: "System prompt", k: 3, cls: "bg-fg" },
  { label: "Tool definitions", k: 14, cls: "bg-fg/45" },
  { label: "Retrieved docs", k: 24, cls: "bg-accent" },
  { label: "History", k: 36, cls: "bg-accent/45" },
  { label: "Tool results", k: 43, cls: "bg-[#d4574a]/75", hot: true },
];

const managed: Seg[] = [
  { label: "System prompt", k: 3, cls: "bg-fg" },
  { label: "Tool definitions", k: 5, cls: "bg-fg/45" },
  { label: "Retrieved docs", k: 8, cls: "bg-accent" },
  { label: "History", k: 12, cls: "bg-accent/45" },
  { label: "Tool results", k: 6, cls: "bg-[#d4574a]/75" },
];

function Meter({ title, segs, note }: { title: string; segs: Seg[]; note: string }) {
  const used = segs.reduce((a, s) => a + s.k, 0);
  const over = used > BUDGET_K;
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-[13px] font-medium">{title}</p>
        <p className="font-mono text-[12px] text-muted">
          <span className={over ? "text-bad" : "text-ok"}>{used}k</span> / {WINDOW_K}k tokens
        </p>
      </div>
      <div className="relative">
        <div className="flex h-8 overflow-hidden rounded-md border border-line bg-bg">
          {segs.map((s) => (
            <div
              key={s.label}
              title={`${s.label}: ${s.k}k`}
              className={`h-full border-r border-bg/70 last:border-r-0 ${s.cls} ${s.hot ? "breathe" : ""}`}
              style={{ width: `${(s.k / WINDOW_K) * 100}%` }}
            />
          ))}
        </div>
        {/* working budget marker */}
        <div
          className="pointer-events-none absolute -bottom-1.5 -top-1.5 border-l border-dashed border-fg/70"
          style={{ left: `${(BUDGET_K / WINDOW_K) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-[12px] text-muted">{note}</p>
    </div>
  );
}

export function ContextMeterFigure() {
  return (
    <Figure
      label="Anatomy of one request"
      wide
      caption="The same task at turn 38, before and after managing the window. Illustrative numbers, but the shape is what I see in real traces: tool results and history crowd out everything else, well past the point where quality starts to slip."
    >
      <div className="space-y-8 px-5 pb-7 pt-12 sm:px-8">
        <div className="flex justify-end">
          <span className="flex items-center gap-2 font-mono text-[12px] text-muted">
            <span className="inline-block h-3 border-l border-dashed border-fg/70" />
            working budget (half the window)
          </span>
        </div>
        <Meter
          title="Unmanaged"
          segs={unmanaged}
          note="Every tool result kept verbatim, every tool definition loaded, the full chat replayed."
        />
        <Meter
          title="Managed"
          segs={managed}
          note="Relevant tools only, results trimmed at the source, older turns compacted into a summary."
        />
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5">
          {unmanaged.map((s) => (
            <span key={s.label} className="flex items-center gap-2 text-[12px] text-muted">
              <span className={`h-2.5 w-2.5 rounded-[3px] ${s.cls}`} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </Figure>
  );
}

/* ————— 2. Lost in the middle ————— */

const CURVE = "M 40 44 C 150 50, 200 176, 320 184 S 490 56, 600 38";
const W = 640;
const H = 250;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function AttentionFigure() {
  const tokens = Array.from({ length: 40 }, (_, i) => i);
  return (
    <Figure
      label="Where the model looks"
      caption={
        <>
          How reliably a model uses a fact, by where it sits in the context. Long-context evaluations (the
          &ldquo;lost in the middle&rdquo; results) keep finding this U shape: the beginning and the end get
          used, and the middle gets skimmed. Schematic, not measured.
        </>
      }
    >
      <div className="px-4 pb-6 pt-12 sm:px-8">
        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
            <rect x="210" y="20" width="220" height="200" className="fill-[#d4574a]" opacity="0.06" />
            <line x1="40" y1="220" x2="600" y2="220" className="stroke-line" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="220" className="stroke-line" strokeWidth="1" />
            <path d={`${CURVE} L 600 220 L 40 220 Z`} className="fill-accent" opacity="0.08" />
            <path d={CURVE} fill="none" className="stroke-accent" strokeWidth="2.2" strokeLinecap="round" />
            <path
              d={CURVE}
              fill="none"
              className="flow-slow stroke-bg"
              strokeWidth="2.4"
              strokeDasharray="2 18"
              opacity="0.8"
            />
            <circle r="4.5" className="fill-accent">
              <animateMotion dur="6s" repeatCount="indefinite" path={CURVE} />
            </circle>
            {tokens.map((i) => (
              <rect
                key={i}
                x={42 + i * 14}
                y="230"
                width="9"
                height="10"
                rx="2"
                className={i === 20 ? "fill-[#d4574a]" : "fill-faint"}
                opacity={i === 20 ? 1 : 0.35}
              />
            ))}
          </svg>
          <span
            className="absolute font-mono text-[12px] text-muted"
            style={{ left: pct(48, W), top: pct(0, H) }}
          >
            recall ↑
          </span>
          <span
            className="absolute -translate-x-1/2 text-center text-[12px] leading-tight text-bad"
            style={{ left: "50%", top: pct(70, H) }}
          >
            the middle
            <br className="sm:hidden" /> gets skimmed
          </span>
        </div>
        <div className="mt-2 flex justify-between gap-3 font-mono text-[12px] text-faint">
          <span>start of context</span>
          <span className="hidden text-bad sm:inline">↑ the one clause that mattered</span>
          <span>latest turn</span>
        </div>
      </div>
    </Figure>
  );
}

/* ————— 3. Stable prefixes and the prompt cache ————— */

type Block = { w: number; cls: string };

const sys: Block = { w: 12, cls: "bg-fg" };
const tools: Block = { w: 18, cls: "bg-fg/45" };
const hist = (w: number): Block => ({ w, cls: "bg-accent/45" });
const msg: Block = { w: 8, cls: "bg-accent" };
const stamp: Block = { w: 8, cls: "bg-[#d4574a]" };

function CacheRow({ turn, blocks, cached, miss }: { turn: number; blocks: Block[]; cached: number; miss?: boolean }) {
  return (
    <div className="grid grid-cols-[44px_1fr] items-center gap-3">
      <span className="font-mono text-[12px] text-faint">turn {turn}</span>
      <div>
        <div className="flex h-6 gap-[3px]">
          {blocks.map((b, i) => (
            <div key={i} className={`h-full rounded-[4px] ${b.cls}`} style={{ width: `${b.w}%` }} />
          ))}
        </div>
        <div className="mt-1.5 flex h-4 items-center gap-2">
          {cached > 0 ? (
            <>
              <div className="h-[3px] rounded-full bg-[#22a05e]" style={{ width: `${cached}%` }} />
              <span className="whitespace-nowrap font-mono text-[12px] text-ok">cached</span>
            </>
          ) : (
            <span className={`font-mono text-[12px] ${miss ? "text-bad" : "text-faint"}`}>
              {miss ? "cache miss: prefix changed" : "first call writes the cache"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function CachePrefixFigure() {
  return (
    <Figure
      label="Prompt caching"
      wide
      caption="Providers cache a request's prefix and bill the cached part at a discount on the next call. Append-only context keeps the prefix identical turn after turn. One timestamp at the top of the system prompt changes the first bytes and invalidates everything behind it."
    >
      <div className="grid gap-10 px-5 pb-7 pt-12 sm:px-8 md:grid-cols-2 md:gap-12">
        <div className="space-y-3">
          <Tag className="!text-accent">Stable prefix, append-only</Tag>
          <div className="space-y-3 pt-2">
            <CacheRow turn={1} blocks={[sys, tools, hist(10), msg]} cached={0} />
            <CacheRow turn={2} blocks={[sys, tools, hist(22), msg]} cached={52} />
            <CacheRow turn={3} blocks={[sys, tools, hist(34), msg]} cached={66} />
          </div>
        </div>
        <div className="space-y-3">
          <Tag className="!text-bad">Timestamp in the system prompt</Tag>
          <div className="space-y-3 pt-2">
            <CacheRow turn={1} blocks={[stamp, sys, tools, hist(10), msg]} cached={0} />
            <CacheRow turn={2} blocks={[stamp, sys, tools, hist(22), msg]} cached={0} miss />
            <CacheRow turn={3} blocks={[stamp, sys, tools, hist(34), msg]} cached={0} miss />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5 md:col-span-2">
          {[
            ["System", sys.cls],
            ["Tools", tools.cls],
            ["History", "bg-accent/45"],
            ["New message", msg.cls],
            ["Changing value", stamp.cls],
          ].map(([l, c]) => (
            <span key={l} className="flex items-center gap-2 text-[12px] text-muted">
              <span className={`h-2.5 w-2.5 rounded-[3px] ${c}`} />
              {l}
            </span>
          ))}
        </div>
      </div>
    </Figure>
  );
}

/* ————— 4. Compaction ————— */

type Line = { who: "user" | "tool" | "agent"; text: string; keep?: boolean };

const transcript: Line[] = [
  { who: "user", text: "Merge candidates for Acme Holdings look off", keep: true },
  { who: "tool", text: "search_matches(ent_7Qx2) → 48 candidates" },
  { who: "tool", text: "get_entity(ent_7Qx2) → 312 attributes" },
  { who: "tool", text: "get_entity(ent_9Lm4) → 298 attributes" },
  { who: "agent", text: "Two candidates share DUNS 04-812-3321…" },
  { who: "user", text: "Don't merge anything owned by the EU entity", keep: true },
  { who: "tool", text: "simulate_merge(…) → 1,204-line diff" },
  { who: "agent", text: "Proposed: merge ent_7Qx2 + ent_9Lm4", keep: true },
  { who: "user", text: "OK. Hold ent_3Pz8 for review", keep: true },
];

const summary = [
  { k: "Goal", v: "Resolve merge candidates for Acme Holdings" },
  { k: "Constraint", v: "“Don't merge anything owned by the EU entity”", verbatim: true },
  { k: "Decision", v: "Merge ent_7Qx2 + ent_9Lm4 (shared DUNS). Awaiting approval", verbatim: true },
  { k: "Open", v: "ent_3Pz8 held for human review", verbatim: true },
  { k: "Dropped", v: "Raw attribute dumps and diff. Re-fetch by ID" },
];

export function CompactionFigure() {
  return (
    <Figure
      label="Compaction"
      wide
      caption="Compaction replaces old turns with a structured note. Constraints, decisions and IDs are copied verbatim. Anything bulky that can be fetched again is dropped and replaced with how to get it back."
    >
      <div className="grid items-center gap-6 px-5 pb-7 pt-12 sm:px-8 md:grid-cols-[1fr_40px_1fr]">
        <div className="rounded-xl border border-line bg-surface p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <Tag>Transcript</Tag>
            <span className="font-mono text-[12px] text-bad">~61k tokens</span>
          </div>
          <ul className="space-y-1.5">
            {transcript.map((l, i) => (
              <li
                key={i}
                className={`flex gap-2 rounded-md px-2 py-1 font-mono text-[12px] leading-snug ${
                  l.keep ? "bg-accent-soft text-fg" : "text-muted opacity-60"
                }`}
              >
                <span className={`w-10 shrink-0 ${l.who === "tool" ? "text-faint" : "text-accent"}`}>{l.who}</span>
                <span className="min-w-0 break-words">{l.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center text-accent" aria-hidden>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="rotate-90 md:rotate-0">
            <path d="M3 14h20m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="float rounded-xl border border-accent/40 bg-surface p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <Tag className="!text-accent">Compacted note</Tag>
            <span className="font-mono text-[12px] text-ok">~0.6k tokens</span>
          </div>
          <dl className="space-y-2.5">
            {summary.map((s, i) => (
              <div
                key={s.k}
                className="step-in grid grid-cols-[76px_1fr] gap-2 text-[12px] leading-snug"
                style={{ "--i": i, "--cycle": "9s", "--gap": "0.5s" } as React.CSSProperties}
              >
                <dt className="font-mono text-[12px] uppercase tracking-[0.06em] text-faint">{s.k}</dt>
                <dd className={s.verbatim ? "text-fg" : "text-muted"}>
                  {s.v}
                  {s.verbatim && (
                    <span className="ml-1.5 rounded bg-accent-soft px-1 font-mono text-[12px] text-accent">verbatim</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Figure>
  );
}
