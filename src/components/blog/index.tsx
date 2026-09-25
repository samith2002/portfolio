// Building blocks for articles in src/posts. Illustrations are plain markup + SVG
// that use the theme tokens (bg, surface, fg, muted, faint, line, accent, accent-soft)
// and the motion kit in globals.css (flow, travel, breathe, float, caret, scan, step-in).

type Children = { children: React.ReactNode };

/** A framed illustration. `wide` lets it break out of the text column on desktop. */
export function Figure({
  children,
  caption,
  label,
  wide = false,
  height,
}: Children & { caption?: React.ReactNode; label?: string; wide?: boolean; height?: number }) {
  return (
    <figure className={`not-prose my-12 ${wide ? "lg:-mx-24" : ""}`}>
      <div
        className="canvas-dots relative overflow-hidden rounded-2xl"
        style={height ? { minHeight: height } : undefined}
      >
        {label && (
          <span className="absolute left-4 top-3.5 z-10 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
            {label}
          </span>
        )}
        {children}
      </div>
      {caption && (
        <figcaption className="mt-3.5 max-w-[68ch] px-1 text-[13.5px] leading-relaxed text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}

/** Small rounded node used inside diagrams. */
export function Node({
  children,
  tone = "default",
  className = "",
  style,
}: Children & {
  tone?: "default" | "accent" | "solid" | "ghost";
  className?: string;
  style?: React.CSSProperties;
}) {
  const tones = {
    default: "border-line bg-surface text-fg shadow-[0_1px_0_var(--line)]",
    accent: "border-accent/40 bg-accent-soft text-fg",
    solid: "border-fg bg-fg text-bg",
    ghost: "border-dashed border-faint bg-transparent text-muted",
  };
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-[12.5px] leading-snug ${tones[tone]} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/** Mono micro-label. */
export function Tag({ children, className = "" }: Children & { className?: string }) {
  // Long labels stay in sentence case; all-caps is only for short tags
  const long = typeof children === "string" && children.length > 24;
  return (
    <span
      className={`font-mono text-[11px] text-faint ${long ? "tracking-normal" : "uppercase tracking-[0.1em]"} ${className}`}
    >
      {children}
    </span>
  );
}

export function Callout({ children, title = "Note" }: Children & { title?: string }) {
  return (
    <aside className="not-prose my-10 rounded-xl border border-line bg-surface/60 px-5 py-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">{title}</p>
      <div className="mt-2 max-w-[68ch] text-[15px] leading-[1.7] text-muted [&_strong]:font-medium [&_strong]:text-fg">
        {children}
      </div>
    </aside>
  );
}

/** Code block. Pass the code as a template string. */
export function Code({ children, lang, title }: { children: string; lang?: string; title?: string }) {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-line bg-[#111214] text-[#e6e5e1]">
      {(title || lang) && (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-white/45">
          <span>{title}</span>
          <span>{lang}</span>
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.75]">
        <code>{children.replace(/^\n/, "").replace(/\s+$/, "")}</code>
      </pre>
    </div>
  );
}

/** Side-by-side comparison, e.g. "without" vs "with". */
export function Compare({
  left,
  right,
  leftTitle,
  rightTitle,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  leftTitle: string;
  rightTitle: string;
}) {
  return (
    <div className="not-prose my-10 grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-line p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{leftTitle}</p>
        <div className="mt-3 text-[14.5px] leading-[1.7] text-muted">{left}</div>
      </div>
      <div className="rounded-xl border border-accent/35 bg-accent-soft p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">{rightTitle}</p>
        <div className="mt-3 text-[14.5px] leading-[1.7] text-fg/85">{right}</div>
      </div>
    </div>
  );
}
