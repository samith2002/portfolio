import { Tag } from "@/components/blog";

// Local keyframes for figures whose motion depends on a fluid width (packets on connectors).
export function McpStyles() {
  return (
    <style>{`
@keyframes mcp-right { 0% { left: 0; opacity: 0 } 12% { opacity: 1 } 88% { opacity: 1 } 100% { left: calc(100% - 6px); opacity: 0 } }
@keyframes mcp-left { 0% { left: calc(100% - 6px); opacity: 0 } 12% { opacity: 1 } 88% { opacity: 1 } 100% { left: 0; opacity: 0 } }
.mcp-req { animation: mcp-right var(--dur, 2.6s) cubic-bezier(.45,0,.55,1) infinite; animation-delay: var(--delay, 0ms); }
.mcp-res { animation: mcp-left var(--dur, 2.6s) cubic-bezier(.45,0,.55,1) infinite; animation-delay: var(--delay, 0ms); }
@media (prefers-reduced-motion: reduce) { .mcp-req, .mcp-res { animation: none } .mcp-req, .mcp-res { display: none } }
`}</style>
  );
}

/* ——— Figure 1: N×M vs N+M ——— */

const apps = [
  { y: 50, label: "Chat app" },
  { y: 110, label: "IDE agent" },
  { y: 170, label: "Co-Pilot" },
];
const systems = [
  { y: 35, label: "Salesforce" },
  { y: 85, label: "Informatica" },
  { y: 135, label: "Reltio" },
  { y: 185, label: "Postgres" },
];

function Box({ x, y, label, tone = "default" }: { x: number; y: number; label: string; tone?: "default" | "solid" }) {
  return (
    <g>
      <rect
        x={x}
        y={y - 13}
        width={70}
        height={26}
        rx={6}
        className={tone === "solid" ? "fill-fg stroke-fg" : "fill-surface stroke-line"}
        strokeWidth={1}
      />
      <text
        x={x + 35}
        y={y + 4}
        textAnchor="middle"
        fontSize={11}
        className={tone === "solid" ? "fill-bg" : "fill-fg"}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {label}
      </text>
    </g>
  );
}

export function WiringFigure() {
  return (
    <div className="grid gap-8 px-5 pb-6 pt-12 sm:grid-cols-2 sm:gap-6 sm:px-6">
      <div>
        <div className="flex items-baseline justify-between">
          <Tag>Without MCP</Tag>
          <span className="font-mono text-[12px] text-muted">3 × 4 = 12</span>
        </div>
        <svg viewBox="0 0 300 220" className="mt-3 w-full" role="img" aria-label="Every app wired to every system">
          {apps.map((a) =>
            systems.map((s) => (
              <line
                key={a.label + s.label}
                x1={80}
                y1={a.y}
                x2={220}
                y2={s.y}
                className="stroke-faint"
                strokeWidth={1}
                opacity={0.7}
              />
            )),
          )}
          {apps.map((a) => (
            <Box key={a.label} x={10} y={a.y} label={a.label} tone="solid" />
          ))}
          {systems.map((s) => (
            <Box key={s.label} x={220} y={s.y} label={s.label} />
          ))}
        </svg>
        <p className="mt-2 text-[12.5px] leading-snug text-muted">
          Each app writes a custom connector for each system. Every pair is its own auth, schema and maintenance
          problem.
        </p>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <Tag className="text-accent!">With MCP</Tag>
          <span className="font-mono text-[12px] text-accent">3 + 4 = 7</span>
        </div>
        <svg viewBox="0 0 300 220" className="mt-3 w-full" role="img" aria-label="Apps and systems meet at one protocol">
          {apps.map((a) => (
            <line
              key={a.label}
              x1={80}
              y1={a.y}
              x2={140}
              y2={a.y}
              className="flow stroke-accent"
              strokeWidth={1.3}
              strokeDasharray="4 4"
            />
          ))}
          {systems.map((s) => (
            <line
              key={s.label}
              x1={160}
              y1={s.y}
              x2={220}
              y2={s.y}
              className="flow stroke-accent"
              strokeWidth={1.3}
              strokeDasharray="4 4"
            />
          ))}
          <rect x={140} y={16} width={20} height={188} rx={7} className="fill-accent-soft stroke-accent" strokeWidth={1} />
          <text
            x={150}
            y={110}
            textAnchor="middle"
            fontSize={11}
            className="fill-accent"
            transform="rotate(-90 150 110)"
            dy={4}
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}
          >
            MCP
          </text>
          {apps.map((a) => (
            <Box key={a.label} x={10} y={a.y} label={a.label} tone="solid" />
          ))}
          {systems.map((s) => (
            <Box key={s.label} x={220} y={s.y} label={s.label} />
          ))}
        </svg>
        <p className="mt-2 text-[12.5px] leading-snug text-muted">
          Each app implements a client once. Each system ships a server once. Anything can talk to anything.
        </p>
      </div>
    </div>
  );
}

/* ——— Figure 2: host, clients, servers ——— */

const links = [
  { client: "salesforce", server: "Salesforce", transport: "Streamable HTTP", method: "tools/call", d: 0 },
  { client: "informatica", server: "Informatica MDM", transport: "Streamable HTTP", method: "resources/read", d: 900 },
  { client: "reltio", server: "Reltio AgentFlow", transport: "Streamable HTTP", method: "tools/list", d: 1700 },
];

export function HostFigure() {
  return (
    <div className="px-3 pb-6 pt-12 sm:px-8">
      <div className="grid grid-cols-[42%_1fr_36%] sm:grid-cols-[38%_1fr_34%]">
        {/* Host */}
        <div className="rounded-xl border border-dashed border-faint bg-bg/60 p-3">
          <div className="flex h-8 items-center justify-between gap-2">
            <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted">Host</span>
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-2 py-0.5 text-[12px] text-fg">
              <span className="breathe h-1.5 w-1.5 rounded-full bg-accent" />
              LLM
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {links.map((l) => (
              <div
                key={l.client}
                className="flex h-14 flex-col justify-center rounded-lg border border-accent/40 bg-accent-soft px-2.5"
              >
                <span className="text-[12.5px] font-medium leading-tight text-fg">Client</span>
                <span className="truncate font-mono text-[12px] text-muted">{l.client}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wires */}
        <div className="space-y-3 pt-[57px]">
          {links.map((l) => (
            <div key={l.client} className="relative h-14">
              <span className="absolute left-0 right-0 top-1/2 hidden -translate-y-[18px] text-center font-mono text-[12px] text-faint sm:block">
                {l.method}
              </span>
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-faint" />
              <span
                className="mcp-req absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent"
                style={{ "--delay": `${l.d}ms` } as React.CSSProperties}
              />
              <span
                className="mcp-res absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-fg/50"
                style={{ "--delay": `${l.d + 1300}ms` } as React.CSSProperties}
              />
            </div>
          ))}
        </div>

        {/* Servers */}
        <div className="space-y-3 pt-[57px]">
          {links.map((l) => (
            <div
              key={l.server}
              className="flex h-14 flex-col justify-center rounded-lg border border-line bg-surface px-2.5 shadow-[0_1px_0_var(--line)]"
            >
              <span className="text-[12.5px] font-medium leading-tight text-fg">{l.server}</span>
              <span className="truncate font-mono text-[12px] text-faint">server</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> request
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-fg/50" /> response
        </span>
        <span>One client per server connection, all inside one host.</span>
      </div>
    </div>
  );
}

/* ——— Figure 3: lifecycle sequence ——— */

type Msg = {
  dir: "cs" | "sc";
  method: string;
  detail: string;
  kind: "request" | "response" | "notification";
};

const phases: { title: string; msgs: Msg[] }[] = [
  {
    title: "Initialization",
    msgs: [
      { dir: "cs", method: "initialize", detail: "protocolVersion · capabilities · clientInfo", kind: "request" },
      { dir: "sc", method: "result", detail: "protocolVersion · capabilities · serverInfo", kind: "response" },
      { dir: "cs", method: "notifications/initialized", detail: "no id, no reply", kind: "notification" },
    ],
  },
  {
    title: "Operation",
    msgs: [
      { dir: "cs", method: "tools/list", detail: "maybe paginated with a cursor", kind: "request" },
      { dir: "sc", method: "result", detail: "tools[] with inputSchema", kind: "response" },
      { dir: "cs", method: "tools/call", detail: "name · arguments", kind: "request" },
      { dir: "sc", method: "result", detail: "content[] · isError", kind: "response" },
      { dir: "sc", method: "notifications/tools/list_changed", detail: "client re-lists", kind: "notification" },
    ],
  },
];

function Arrow({ msg }: { msg: Msg }) {
  const right = msg.dir === "cs";
  const line =
    msg.kind === "notification"
      ? "border-t border-dashed border-faint"
      : msg.kind === "request"
        ? "border-t border-accent"
        : "border-t border-fg/40";
  const head = msg.kind === "request" ? "text-accent" : msg.kind === "response" ? "text-fg/40" : "text-faint";
  return (
    <div className="relative h-[54px]">
      <div className="absolute inset-x-[4%] top-[6px] text-center leading-tight">
        <span
          className={`font-mono text-[12px] ${msg.kind === "request" ? "text-accent" : "text-fg"} break-all`}
        >
          {msg.method}
        </span>
        <span className="mt-0.5 block text-[12px] text-faint">{msg.detail}</span>
      </div>
      <div className={`absolute left-[16%] right-[16%] bottom-[8px] h-0 ${line}`} />
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        className={`absolute bottom-[4.5px] ${head} ${right ? "right-[16%]" : "left-[16%] rotate-180"}`}
        aria-hidden
      >
        <path d="M0 0 8 4 0 8Z" fill="currentColor" />
      </svg>
    </div>
  );
}

export function LifecycleFigure() {
  let i = 0;
  return (
    <div
      className="relative px-3 pb-6 pt-12 sm:px-8"
      style={{ "--cycle": "14s", "--gap": "0.6s" } as React.CSSProperties}
    >
      <div className="relative">
        {/* Lifelines */}
        <div className="absolute bottom-0 left-[16%] top-8 w-px bg-line" />
        <div className="absolute bottom-0 right-[16%] top-8 w-px bg-line" />

        {/* Participants */}
        <div className="relative h-8">
          <div className="absolute left-[16%] -translate-x-1/2 rounded-md bg-fg px-3 py-1 text-[12px] font-medium text-bg">
            Client
          </div>
          <div className="absolute right-[16%] translate-x-1/2 rounded-md border border-line bg-surface px-3 py-1 text-[12px] font-medium text-fg">
            Server
          </div>
        </div>

        {phases.map((phase) => (
          <div key={phase.title} className="relative">
            <div className="relative mt-4 flex justify-center">
              <span className="rounded-full border border-line bg-surface px-2.5 py-0.5 font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
                {phase.title}
              </span>
            </div>
            {phase.msgs.map((m) => {
              const idx = i++;
              return (
                <div
                  key={m.method + idx}
                  className="step-in"
                  style={{ "--i": idx, animationFillMode: "backwards" } as React.CSSProperties}
                >
                  <Arrow msg={m} />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-muted">
        <span className="flex items-center gap-2">
          <span className="w-5 border-t border-accent" /> request (has an id)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-5 border-t border-fg/40" /> response (same id)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-5 border-t border-dashed border-faint" /> notification
        </span>
      </div>
    </div>
  );
}

/* ——— Figure 4: human approval for a write tool ——— */

const fields = [
  { k: "Name", a: "Acme Corporation", b: "ACME Corp.", same: false },
  { k: "DUNS", a: "04-812-3321", b: "04-812-3321", same: true },
  { k: "Address", a: "1200 Main St, Dallas", b: "1200 Main Street, Dallas", same: false },
  { k: "Tax ID", a: "75-1234567", b: "75-1234567", same: true },
];

const checks = ["Survivorship rules resolve every attribute", "No open data quality exceptions", "Caller holds the data steward role"];

function Tick() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" className="mt-[3px] shrink-0 text-ok" aria-hidden>
      <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ApprovalFigure() {
  return (
    <div className="px-3 pb-8 pt-12 sm:px-8">
      <div className="float mx-auto max-w-[480px] overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <span className="text-[13px] font-medium text-fg">AI Data Steward</span>
          <span className="flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-0.5 text-[12px] text-accent">
            <span className="breathe h-1.5 w-1.5 rounded-full bg-accent" />
            Awaiting approval
          </span>
        </div>

        <div className="space-y-4 px-4 py-4">
          <p className="text-[13px] leading-relaxed text-muted">
            These two records share a DUNS number and tax ID. I&apos;d like to merge them. This can&apos;t be undone
            automatically.
          </p>

          <div className="rounded-lg border border-line bg-bg/60 px-3 py-2.5 font-mono text-[12px] leading-[1.7]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-fg">reltio__merge_entities</span>
              <span className="rounded border border-[#d4574a]/40 px-1.5 text-[12px] text-bad">destructive</span>
            </div>
            <div className="text-muted">
              winner: <span className="text-accent">entities/1a2B3c</span>
            </div>
            <div className="text-muted">
              loser: <span className="text-accent">entities/9xY8zW</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-line text-[12px]">
            <div className="grid grid-cols-[62px_1fr_1fr] bg-bg/60 font-mono text-[12px] uppercase tracking-[0.08em] text-faint">
              <span className="px-2 py-1.5" />
              <span className="px-2 py-1.5">Winner</span>
              <span className="px-2 py-1.5">Loser</span>
            </div>
            {fields.map((f) => (
              <div key={f.k} className="grid grid-cols-[62px_1fr_1fr] border-t border-line">
                <span className="px-2 py-1.5 text-faint">{f.k}</span>
                <span className="px-2 py-1.5 text-fg">{f.a}</span>
                <span className={`px-2 py-1.5 ${f.same ? "text-ok" : "text-muted"}`}>{f.b}</span>
              </div>
            ))}
          </div>

          <ul className="space-y-1">
            {checks.map((c) => (
              <li key={c} className="flex gap-2 text-[12px] leading-snug text-muted">
                <Tick />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-4 py-3">
          <span className="rounded-full border border-line px-3.5 py-1.5 text-[12px] text-muted">Reject</span>
          <span className="rounded-full bg-fg px-3.5 py-1.5 text-[12px] font-medium text-bg">Approve merge</span>
        </div>
      </div>
    </div>
  );
}
