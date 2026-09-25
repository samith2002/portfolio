// Illustrative covers drawn in markup, so they stay sharp and match the theme.

export function PromptWeaverCover() {
  return (
    <div className="relative flex h-full items-center justify-center gap-3 p-6 sm:gap-5 sm:p-8" aria-hidden>
      {/* Napkin sketch */}
      <div className="relative h-[150px] w-[42%] max-w-[190px] -rotate-2 rounded-md border border-dashed border-faint bg-surface p-3 shadow-[0_1px_0_var(--line)]">
        <div className="h-2 w-10 rounded-full bg-faint/60" />
        <div className="mt-4 h-3 w-[80%] rounded-sm border border-faint" />
        <div className="mt-2 h-3 w-[55%] rounded-sm border border-faint" />
        <div className="mt-4 flex gap-2">
          <div className="h-5 w-12 rounded-full border border-faint" />
          <div className="h-5 w-10 rounded-full border border-dashed border-faint" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          <div className="h-6 rounded-sm border border-faint" />
          <div className="h-6 rounded-sm border border-faint" />
          <div className="h-6 rounded-sm border border-faint" />
        </div>
        <span className="absolute -bottom-5 left-1 font-serif text-[13px] italic text-muted">sketch</span>
      </div>

      <svg width="34" height="14" viewBox="0 0 34 14" fill="none" className="shrink-0 text-accent">
        <path d="M1 7h30m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Structured prompt */}
      <div className="relative w-[48%] max-w-[220px] rotate-1">
        <div className="h-[150px] overflow-hidden whitespace-nowrap rounded-md border border-line bg-fg p-3 font-mono text-[11px] leading-[1.65] text-bg/80 sm:text-[11px]">
          <div className="mb-2 flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-bg/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-bg/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-bg/30" />
          </div>
          <p>
            <span className="text-bg/45">## </span>
            <span className="text-bg">Hero section</span>
          </p>
          <p className="text-bg/55">- 2-line heading</p>
          <p className="text-bg/55">- CTA: solid, ghost</p>
          <p className="text-bg/55">- grid: 3 features</p>
          <p className="mt-1">
            <span className="text-bg/45">mode:</span> <span className="text-[#9fb4ff] dark:text-[#2346d8]">cursor</span>
          </p>
        </div>
        <span className="absolute -bottom-5 right-1 font-serif text-[13px] italic text-muted">prompt</span>
      </div>
    </div>
  );
}

const bars = [8, 14, 22, 12, 30, 18, 38, 24, 16, 34, 20, 42, 28, 14, 26, 36, 18, 10, 22, 30, 16, 8];

export function MediCallCover() {
  return (
    <div className="mx-auto flex h-full max-w-[480px] flex-col justify-center gap-4 p-6 sm:p-8" aria-hidden>
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
        <span className="status-dot h-1.5 w-1.5 rounded-full bg-[#22a05e]" />
        Live call · 00:42
      </div>

      <div className="flex h-12 items-center gap-[3px]">
        {bars.map((h, i) => (
          <span
            key={i}
            className="wave-bar w-[3px] rounded-full bg-accent"
            style={{ height: h, animationDelay: `${(i % 7) * 110}ms` }}
          />
        ))}
      </div>

      <div className="space-y-2 text-[12.5px] leading-snug">
        <p className="max-w-[85%] rounded-lg rounded-bl-sm bg-surface px-3 py-2 text-muted shadow-[0_0_0_1px_var(--line)]">
          Can I move my appointment to Thursday afternoon?
        </p>
        <p className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-accent-soft px-3 py-2 text-fg shadow-[0_0_0_1px_var(--line)]">
          Sure. Thursday at 2:30 PM is open. I've moved it and you'll get a confirmation.
        </p>
      </div>
    </div>
  );
}
