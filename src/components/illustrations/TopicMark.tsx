// Small animated marks for article cards. viewBox 300×150, themed by tokens.

function Dot({ path, dur = 3, delay = 0 }: { path: string; dur?: number; delay?: number }) {
  return (
    <circle r="3" className="motion-dot fill-accent">
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
}

const marks: Record<string, React.ReactNode> = {
  "agent-harness": (
    <>
      {[54, 40, 26].map((r, i) => (
        <circle key={r} cx="150" cy="75" r={r} className={i === 2 ? "fill-fg" : "fill-none stroke-line"} strokeDasharray={i === 0 ? "3 5" : undefined} />
      ))}
      <text x="150" y="79" textAnchor="middle" fontSize="11" className="fill-bg font-mono">LLM</text>
      {["tools", "context", "permissions", "memory"].map((t, i) => {
        const a = (i / 4) * Math.PI * 2 - Math.PI / 4;
        const x = 150 + Math.cos(a) * 95;
        const y = 75 + Math.sin(a) * 52;
        return (
          <text key={t} x={x} y={y} textAnchor="middle" fontSize="11" className="fill-muted font-mono">
            {t}
          </text>
        );
      })}
      <Dot path="M150 21 A54 54 0 1 1 149.9 21" dur={5} />
    </>
  ),
  "tool-calling": (
    <>
      <rect x="40" y="52" width="92" height="46" rx="9" className="fill-surface stroke-line" />
      <text x="86" y="72" textAnchor="middle" fontSize="11" className="fill-muted font-mono">tool_use</text>
      <text x="86" y="87" textAnchor="middle" fontSize="11" className="fill-fg font-mono">{"{ id: 42 }"}</text>
      <rect x="168" y="52" width="92" height="46" rx="9" className="fill-fg" />
      <text x="214" y="72" textAnchor="middle" fontSize="11" className="fill-bg font-mono" opacity="0.6">tool_result</text>
      <text x="214" y="87" textAnchor="middle" fontSize="11" className="fill-bg font-mono">ok ✓</text>
      <path d="M134 75 H166" className="flow stroke-accent" strokeWidth="1.5" strokeDasharray="3 5" />
      <path d="M160 70 l6 5 -6 5" className="fill-none stroke-accent" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  mcp: (
    <>
      {[30, 75, 120].map((y, i) => {
        const d = `M126 75 C 170 75, 170 ${y}, 206 ${y}`;
        return (
          <g key={y}>
            <path d={d} className="fill-none stroke-line" strokeWidth="1.5" />
            <Dot path={d} dur={2.2 + i * 0.4} delay={i * 0.5} />
            <rect x="206" y={y - 12} width="62" height="24" rx="6" className="fill-surface stroke-line" />
            <text x="237" y={y + 4} textAnchor="middle" fontSize="11" className="fill-muted font-mono">
              server
            </text>
          </g>
        );
      })}
      <rect x="54" y="55" width="72" height="40" rx="10" className="fill-fg" />
      <text x="90" y="79" textAnchor="middle" fontSize="11" className="fill-bg font-mono">client</text>
    </>
  ),
  "agent-memory": (
    <>
      {[
        ["working", 0.9],
        ["episodic", 0.65],
        ["semantic", 0.8],
        ["procedural", 0.45],
      ].map(([label, w], i) => (
        <g key={label as string} transform={`translate(70 ${22 + i * 28})`}>
          <text x="0" y="13" fontSize="11" className="fill-muted font-mono">{label}</text>
          <rect x="78" y="4" width="92" height="12" rx="6" className="fill-line" />
          <rect x="78" y="4" width={92 * (w as number)} height="12" rx="6" className={i === 0 ? "fill-accent" : "fill-faint"} opacity={i === 0 ? 1 : 0.6}>
            <animate attributeName="width" values={`${92 * (w as number)};${92 * (w as number) * 0.7};${92 * (w as number)}`} dur={`${4 + i}s`} repeatCount="indefinite" />
          </rect>
        </g>
      ))}
    </>
  ),
  "context-management": (
    <>
      <rect x="40" y="58" width="220" height="30" rx="7" className="fill-surface stroke-line" />
      {[
        [40, 34, "fill-fg"],
        [74, 40, "fill-faint"],
        [114, 58, "fill-accent"],
        [172, 44, "fill-muted"],
      ].map(([x, w, c], i) => (
        <rect key={i} x={(x as number) + 3} y="61" width={(w as number) - 3} height="24" rx="4" className={c as string} opacity={i === 2 ? 0.85 : 0.55} />
      ))}
      <line x1="232" y1="46" x2="232" y2="100" className="stroke-[#d4574a]" strokeDasharray="3 3" strokeWidth="1.5" />
      <text x="232" y="40" textAnchor="middle" fontSize="11" className="fill-muted font-mono">budget</text>
      <text x="40" y="110" fontSize="11" className="fill-faint font-mono">system · tools · retrieved · history</text>
    </>
  ),
  "context-offloading": (
    <>
      <rect x="44" y="40" width="96" height="70" rx="9" className="fill-surface stroke-line" />
      <text x="92" y="58" textAnchor="middle" fontSize="11" className="fill-faint font-mono">window</text>
      <rect x="58" y="68" width="68" height="8" rx="4" className="fill-accent" opacity="0.8" />
      <rect x="58" y="82" width="46" height="8" rx="4" className="fill-faint" opacity="0.6" />
      <path d="M142 75 H196" className="flow stroke-accent" strokeWidth="1.5" strokeDasharray="3 5" />
      <path d="M190 70 l6 5 -6 5" className="fill-none stroke-accent" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M204 44 h34 l14 14 v50 h-48 z" className="fill-surface stroke-line" />
      <path d="M238 44 v14 h14" className="fill-none stroke-line" />
      {[70, 80, 90].map((y) => (
        <rect key={y} x="212" y={y} width="30" height="3" rx="1.5" className="fill-faint" opacity="0.6" />
      ))}
      <text x="228" y="122" textAnchor="middle" fontSize="11" className="fill-muted font-mono">notes.md</text>
    </>
  ),
  "ai-data-pipelines": (
    <>
      {[70, 150, 230].map((x, i) => (
        <g key={x}>
          <path d={`M${x - 22} 58 v34 c0 5 10 9 22 9 s22-4 22-9 v-34`} className="fill-surface stroke-line" />
          <ellipse cx={x} cy="58" rx="22" ry="8" className={i === 1 ? "fill-accent" : "fill-bg stroke-line"} opacity={i === 1 ? 0.85 : 1} />
        </g>
      ))}
      <path d="M94 76 H126 M174 76 H206" className="flow stroke-accent" strokeWidth="1.5" strokeDasharray="3 5" />
      <text x="150" y="36" textAnchor="middle" fontSize="11" className="fill-muted font-mono">LLM step</text>
    </>
  ),
};

export function TopicMark({ slug }: { slug: string }) {
  return (
    <svg viewBox="0 0 300 150" className="absolute inset-0 h-full w-full" aria-hidden>
      {marks[slug]}
    </svg>
  );
}
