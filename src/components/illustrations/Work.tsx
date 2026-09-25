// Illustrations for the Data Color AI projects. Pure markup + SVG, themed by tokens.
// SVG dots use SMIL <animateMotion> so they follow paths at any scale.

const OK = "#22a05e";

function Check({ className = "" }: { className?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className={className} aria-hidden>
      <path d="m2.5 6.2 2.2 2.2 4.8-4.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MovingDot({ path, dur = 2.6, delay = 0, r = 3.2 }: { path: string; dur?: number; delay?: number; r?: number }) {
  return (
    <circle r={r} className="motion-dot fill-accent">
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.55 1" />
    </circle>
  );
}

/* ———————————————————————— Atlas Co-Pilot ———————————————————————— */

export function AtlasIllustration() {
  const servers = [
    { y: 46, name: "Salesforce", tools: "12 tools" },
    { y: 130, name: "Informatica MDM", tools: "18 tools" },
    { y: 214, name: "Knowledge base", tools: "4 resources" },
  ];
  const paths = servers.map((s) => `M118 130 C 170 130, 170 ${s.y}, 222 ${s.y}`);

  return (
    <div className="grid h-full grid-cols-1 items-center gap-8 p-5 sm:p-8 md:grid-cols-[1.05fr_1fr] md:gap-6 [&>*]:min-w-0" aria-hidden>
      {/* Chat panel */}
      <div className="float rounded-xl border border-line bg-surface p-4">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-fg font-serif text-[12px] italic text-bg">A</span>
            <span className="text-[12.5px] font-medium">Atlas Co-Pilot</span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            <span className="status-dot h-1.5 w-1.5 rounded-full" style={{ background: OK }} />3 servers
          </span>
        </div>

        <p className="ml-auto mt-3 w-fit max-w-[88%] rounded-lg rounded-br-sm bg-fg px-3 py-2 text-[12px] leading-snug text-bg">
          Why was the Globex account flagged as a duplicate?
        </p>

        <ul className="mt-3 space-y-1.5 font-mono text-[11px]" style={{ "--cycle": "9s", "--gap": "0.55s" } as React.CSSProperties}>
          {[
            ["salesforce", "get_account", "142ms"],
            ["mdm", "search_matches", "388ms"],
            ["mdm", "explain_match_rule", "95ms"],
          ].map(([srv, fn, ms], i) => (
            <li
              key={fn}
              className="step-in flex items-center justify-between gap-2 rounded-md border border-line bg-bg/60 px-2.5 py-1.5"
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="truncate">
                <span className="text-faint">{srv}.</span>
                <span className="text-fg">{fn}</span>
                <span className="text-faint">()</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-muted">
                {ms}
                <Check className="text-ok" />
              </span>
            </li>
          ))}
        </ul>

        <div
          className="step-in mt-3 rounded-lg rounded-bl-sm bg-accent-soft px-3 py-2 text-[12px] leading-[1.55] text-fg"
          style={{ "--i": 3, "--cycle": "9s", "--gap": "0.55s" } as React.CSSProperties}
        >
          It has the same DUNS number and billing address as <b className="font-medium">Globex Corporation</b>.
          Rule R-12 scored the pair 0.93, so I&apos;d send it for merge review.
          <span className="caret ml-0.5 inline-block h-3 w-[1.5px] translate-y-0.5 bg-fg" />
        </div>
      </div>

      {/* MCP wiring */}
      <svg viewBox="0 0 356 260" className="w-full max-w-[440px] justify-self-center overflow-visible">
        {paths.map((d, i) => (
          <g key={i}>
            <path d={d} className="stroke-line" strokeWidth="1.5" fill="none" />
            <path d={d} className="flow-slow stroke-accent" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="3 7" fill="none" />
            <MovingDot path={d} dur={2.4 + i * 0.35} delay={i * 0.7} />
          </g>
        ))}

        {/* client node */}
        <circle cx="72" cy="130" r="52" className="fill-accent-soft stroke-accent" strokeOpacity="0.35" />
        <circle cx="72" cy="130" r="38" className="breathe fill-none stroke-accent" strokeOpacity="0.25" strokeDasharray="2 4" />
        <circle cx="72" cy="130" r="26" className="fill-fg" />
        <text x="72" y="134" textAnchor="middle" className="fill-bg font-serif" fontSize="15" fontStyle="italic">Atlas</text>
        <text x="72" y="202" textAnchor="middle" className="fill-muted font-mono" fontSize="11" letterSpacing="1">MCP CLIENT</text>

        {servers.map((s) => (
          <g key={s.name} transform={`translate(222 ${s.y - 22})`}>
            <rect width="132" height="44" rx="9" className="fill-surface stroke-line" />
            <circle cx="15" cy="22" r="3.5" fill={OK} />
            <text x="26" y="19" className="fill-fg" fontSize="11.5" fontWeight="500">{s.name}</text>
            <text x="26" y="33" className="fill-muted font-mono" fontSize="11">{s.tools}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ———————————————————————— AI Data Steward ———————————————————————— */

const recordA = [
  ["Name", "Acme Corp"],
  ["Address", "12 Elm St, Dallas"],
  ["DUNS", "08-146-2297"],
  ["Phone", "(214) 555-0182"],
];
const recordB = [
  ["Name", "ACME Corporation"],
  ["Address", "12 Elm Street, Dallas"],
  ["DUNS", "08-146-2297"],
  ["Phone", "(214) 555-0199"],
];
const fieldMatch = ["~", "~", "=", "≠"];

function Record({ title, source, rows, side }: { title: string; source: string; rows: string[][]; side: "a" | "b" }) {
  return (
    <div className="min-w-0 rounded-lg border border-line bg-surface p-3 shadow-[0_1px_0_var(--line)]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="truncate text-[12px] font-medium">{title}</span>
        <span className="shrink-0 rounded-full border border-line px-1.5 py-px font-mono text-[11px] uppercase text-faint">{source}</span>
      </div>
      <dl className="space-y-1">
        {rows.map(([k, v], i) => (
          <div key={k} className="flex items-baseline justify-between gap-2 text-[12px]">
            <dt className="shrink-0 text-faint">{k}</dt>
            <dd
              className={`truncate text-right ${
                fieldMatch[i] === "≠" ? "text-bad" : fieldMatch[i] === "=" ? "text-fg" : "text-muted"
              } ${side === "b" && fieldMatch[i] === "≠" ? "line-through decoration-bad/50" : ""}`}
            >
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function StewardIllustration() {
  const score = 0.94;
  const c = 2 * Math.PI * 22;
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5 sm:p-7" aria-hidden>
      <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-3">
        <Record title="Acme Corp" source="SFDC" rows={recordA} side="a" />
        <div className="flex items-center justify-center gap-2 sm:flex-col sm:gap-1">
          <div className="relative h-14 w-14">
            <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
              <circle cx="28" cy="28" r="22" className="fill-none stroke-line" strokeWidth="4" />
              <circle cx="28" cy="28" r="22" className="fill-none stroke-accent" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${c * score} ${c}`} />
            </svg>
            <span className="absolute inset-0 grid place-items-center font-mono text-[12px] font-medium">.94</span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-faint">match</span>
        </div>
        <Record title="ACME Corporation" source="ERP" rows={recordB} side="b" />
      </div>

      <div className="flex flex-wrap gap-1.5" style={{ "--cycle": "8s", "--gap": "0.4s" } as React.CSSProperties}>
        {["Survivorship rules", "Cross-source consent", "Hierarchy intact"].map((g, i) => (
          <span
            key={g}
            className="step-in inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-0.5 text-[12px] text-muted"
            style={{ "--i": i } as React.CSSProperties}
          >
            <Check className="text-ok" />
            {g}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-accent/35 bg-accent-soft px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-fg text-[12px] font-medium text-bg">DS</span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[12px] font-medium">Merge into golden record?</p>
            <p className="truncate text-[12px] text-muted">Phone conflict · keep ERP value</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <span className="rounded-md border border-line bg-surface px-2 py-1 text-[12px] text-muted">Reject</span>
          <span className="breathe rounded-md bg-fg px-2 py-1 text-[12px] font-medium text-bg">Approve</span>
        </div>
      </div>
    </div>
  );
}

/* ———————————————————————— DocuAssist ———————————————————————— */

export function DocuAssistIllustration() {
  const fields = [
    ["vendor", "Northwind Supply", "0.99"],
    ["invoice_no", "INV-20931", "0.98"],
    ["total", "$18,420.00", "0.97"],
    ["due_date", "2026-10-15", "0.95"],
    ["po_ref", "PO-7713", "0.88"],
  ];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-5 min-[440px]:flex-row sm:gap-5 sm:p-7" aria-hidden>
      {/* Page */}
      <div className="relative w-[58%] max-w-[170px] shrink-0 min-[440px]:w-[40%] -rotate-2 overflow-hidden rounded-md border border-line bg-surface p-3">
        <div className="flex items-start justify-between">
          <div className="h-2.5 w-12 rounded-sm bg-fg/80" />
          <div className="space-y-1">
            <div className="ml-auto h-1 w-8 rounded bg-faint/60" />
            <div className="ml-auto h-1 w-6 rounded bg-faint/60" />
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          {[90, 70, 80, 55].map((w, i) => (
            <div key={i} className="h-1 rounded bg-faint/50" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mt-4 space-y-1.5 border-t border-line pt-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-1 w-[55%] rounded bg-faint/50" />
              <div className="h-1 w-[18%] rounded bg-faint/70" />
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <div className="h-2 w-[35%] rounded-sm bg-accent/60" />
        </div>
        <div className="mt-4 space-y-1.5">
          {[65, 45].map((w, i) => (
            <div key={i} className="h-1 rounded bg-faint/40" style={{ width: `${w}%` }} />
          ))}
        </div>
        {/* scanning beam */}
        <div className="scan pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-accent/15 to-transparent">
          <div className="absolute inset-x-0 bottom-1/2 h-px bg-accent/60" />
        </div>
      </div>

      <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="shrink-0 rotate-90 text-accent min-[440px]:rotate-0">
        <path d="M1 8h36" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" className="flow" />
        <path d="m32 3 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Extracted fields */}
      <div className="w-full min-w-0 max-w-[250px] flex-1 rounded-lg border border-line bg-surface p-3 font-mono text-[11px]">
        <div className="mb-2 flex items-center justify-between text-[12px] uppercase tracking-[0.08em] text-faint">
          <span>extracted</span>
          <span className="text-accent">schema v3</span>
        </div>
        <ul className="space-y-1" style={{ "--cycle": "8s", "--gap": "0.45s" } as React.CSSProperties}>
          {fields.map(([k, v, conf], i) => (
            <li
              key={k}
              className="step-in grid grid-cols-[1fr_auto] items-center gap-2 border-t border-line pt-1 first:border-0 first:pt-0"
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="min-w-0 truncate">
                <span className="text-faint">{k}: </span>
                <span className="text-fg">{v}</span>
              </span>
              <span className={`rounded px-1 text-[12px] ${Number(conf) < 0.9 ? "bg-[#d4a24a]/15 text-warn" : "bg-[#22a05e]/12 text-ok"}`}>
                {conf}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2.5 border-t border-line pt-2 text-[12px] text-muted">→ governed source: finance.invoices</p>
      </div>
    </div>
  );
}

/* ———————————————————————— Smart Mapping (hybrid RAG) ———————————————————————— */

function Lane({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="min-w-0 flex-1 rounded-md border border-line bg-surface px-2.5 py-1.5 text-center">
      <p className="truncate font-mono text-[11px] text-fg">{label}</p>
      <p className="truncate font-mono text-[11px] text-faint">{sub}</p>
    </div>
  );
}

export function MappingIllustration() {
  const candidates = [
    { code: "MNT-2104", name: "HVAC preventive maintenance", score: "0.93", top: true },
    { code: "SRV-0381", name: "AC repair, labor only", score: "0.71" },
    { code: "INS-1190", name: "HVAC system inspection", score: "0.64" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 p-5 sm:p-7" aria-hidden>
      {/* Source code from the acquired brand */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 shadow-[0_1px_0_var(--line)]">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-faint">Acquired brand · ERP</p>
          <p className="mt-0.5 truncate text-[12px]">
            <span className="font-mono text-muted">SVC-HVAC-07</span> &ldquo;qtrly AC tune up + filter&rdquo;
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-muted">brand 14 of 20</span>
      </div>

      {/* Two retrieval lanes merge */}
      <div className="relative">
        <svg viewBox="0 0 300 18" preserveAspectRatio="none" className="absolute inset-x-0 -top-2.5 h-3 w-full">
          <path d="M150 0 L75 18 M150 0 L225 18" className="flow stroke-accent" strokeOpacity="0.6" strokeWidth="1.2" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" fill="none" />
        </svg>
        <div className="flex gap-2 pt-1.5">
          <Lane label="vector search" sub="BigQuery embeddings" />
          <Lane label="keyword match" sub="TF-IDF" />
        </div>
      </div>

      {/* Candidates, re-ranked */}
      <div className="rounded-lg border border-line bg-surface p-2.5">
        <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.08em]">
          <span className="text-faint"><span className="hidden sm:inline">parent catalog · </span>candidates</span>
          <span className="flex items-center gap-1 text-accent">
            <span className="breathe h-1.5 w-1.5 rounded-full bg-accent" /> gemini decides
          </span>
        </div>
        <ul className="space-y-1" style={{ "--cycle": "8s", "--gap": "0.45s" } as React.CSSProperties}>
          {candidates.map((c, i) => (
            <li
              key={c.code}
              className={`step-in flex items-center justify-between gap-2 rounded-md px-2 py-1 text-[12px] ${
                c.top ? "bg-accent-soft ring-1 ring-accent/30" : ""
              }`}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="min-w-0 truncate">
                <span className="font-mono text-faint">{c.code} </span>
                <span className={c.top ? "text-fg" : "text-muted"}>{c.name}</span>
              </span>
              <span className={`shrink-0 font-mono ${c.top ? "text-accent" : "text-faint"}`}>{c.score}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 border-t border-line pt-2 text-[12px] leading-snug text-muted">
          <span className="font-medium text-accent">Gemini:</span> &ldquo;A quarterly tune-up with a filter change is
          preventive HVAC maintenance, not a repair.&rdquo;
        </p>
      </div>

      {/* Confidence gate */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
        <div className="relative h-1.5 min-w-[90px] flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full w-[70%] rounded-full" style={{ background: OK }} />
          <div className="absolute inset-y-0 left-[70%] w-[30%] bg-[#d4a24a]/70" />
        </div>
        <span className="text-ok">~70% auto-accept</span>
        <span className="text-warn">~30% → analyst</span>
      </div>
    </div>
  );
}

/* ———————————————————————— AI-native data pipelines ———————————————————————— */

function Cylinder({ label, sub, tone }: { label: string; sub: string; tone: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="46" height="52" viewBox="0 0 46 52">
        <path d="M3 9v34c0 4.4 9 8 20 8s20-3.6 20-8V9" className="fill-surface stroke-line" />
        <ellipse cx="23" cy="9" rx="20" ry="7.5" className="stroke-line" fill={tone} fillOpacity="0.9" />
        <path d="M3 26c0 4.4 9 8 20 8s20-3.6 20-8" className="fill-none stroke-line" />
      </svg>
      <span className="text-[12px] font-medium">{label}</span>
      <span className="-mt-1 font-mono text-[11px] text-faint">{sub}</span>
    </div>
  );
}

function Pipe() {
  return (
    <svg viewBox="0 0 60 10" className="mb-10 h-2.5 min-w-4 flex-1 overflow-visible" preserveAspectRatio="none">
      <line x1="0" y1="5" x2="60" y2="5" className="stroke-line" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1="5" x2="60" y2="5" className="flow stroke-accent" strokeWidth="1.5" strokeDasharray="3 6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function PipelinesIllustration() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-5 sm:p-7" aria-hidden>
      <div className="flex items-end justify-between gap-1 px-1">
        <Cylinder label="Bronze" sub="raw" tone="#c08a5b" />
        <Pipe />
        <div className="relative">
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-fg px-2 py-0.5 font-mono text-[11px] text-bg">
            LLM step
          </span>
          <Cylinder label="Silver" sub="validated" tone="#a9adb5" />
        </div>
        <Pipe />
        <Cylinder label="Gold" sub="trusted" tone="#d2b04c" />
      </div>

      <div className="rounded-lg border border-line bg-surface p-3">
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em]" style={{ "--cycle": "8s", "--gap": "0.7s" } as React.CSSProperties}>
          {["proposed by LLM", "reviewed", "running on spark"].map((s, i) => (
            <span key={s} className="step-in flex items-center gap-1.5" style={{ "--i": i } as React.CSSProperties}>
              {i > 0 && <span className="text-faint">→</span>}
              <span className={`rounded-full px-2 py-0.5 ${i === 2 ? "bg-accent-soft text-accent" : "border border-line text-muted"}`}>{s}</span>
            </span>
          ))}
        </div>
        <pre className="mt-2.5 overflow-hidden whitespace-pre-wrap break-words font-mono text-[11px] leading-[1.6] text-muted">
          <span className="text-faint"># rule dq_142 · customers.email</span>
          {"\n"}
          <span className="text-fg">expect</span>(col(<span className="text-accent">&quot;email&quot;</span>)).to_match(RFC5322)
        </pre>
        <div className="mt-2.5 flex items-center gap-2 font-mono text-[11px]">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <div className="h-full w-[97%] rounded-full" style={{ background: OK }} />
          </div>
          <span className="text-muted">97.3% pass</span>
          <span className="text-bad">412 → review</span>
        </div>
      </div>
    </div>
  );
}

export const workIllustrations = {
  atlas: AtlasIllustration,
  steward: StewardIllustration,
  docuassist: DocuAssistIllustration,
  mapping: MappingIllustration,
  pipelines: PipelinesIllustration,
};
