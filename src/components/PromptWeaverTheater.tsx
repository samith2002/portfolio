"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { promptWeaverDemos, promptWeaverPlaylist } from "@/content";

export function PromptWeaverTheater() {
  const [active, setActive] = useState<string | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const current = promptWeaverDemos.find((d) => d.id === active);

  function scrollRail(dir: 1 | -1) {
    rail.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  return (
    <div className="self-start overflow-hidden rounded-2xl border border-line bg-[#0b0b0d] text-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <div className="mx-auto flex min-w-0 max-w-[360px] flex-1 items-center justify-center gap-2 rounded-md bg-white/[0.06] px-3 py-1 font-mono text-[11px] text-white/55">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
            <rect x="2.5" y="5.5" width="7" height="5" rx="1" stroke="currentColor" />
            <path d="M4 5.5V4a2 2 0 1 1 4 0v1.5" stroke="currentColor" />
          </svg>
          <span className="truncate">{current ? `Prompt Weaver · ${current.title} mode` : "promptweaver.netlify.app"}</span>
        </div>
        <span className="hidden w-[42px] sm:block" />
      </div>

      {/* Stage */}
      <div className="relative aspect-video w-full bg-black">
        {current ? (
          <iframe
            key={current.id}
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={`Prompt Weaver: ${current.title} mode`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(promptWeaverDemos[0].id)}
            className="group absolute inset-0 block h-full w-full text-left"
            aria-label="Play the Prompt Weaver demo"
          >
            <Image
              src="/pw/hero.jpg"
              alt="Prompt Weaver landing page"
              fill
              sizes="(min-width: 1120px) 880px, 100vw"
              className="object-cover object-top"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <span className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-white/60">
                  9 short demos
                </span>
                <span className="mt-1 block font-serif text-[22px] leading-tight sm:text-[28px]">
                  See every mode in action
                </span>
              </span>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                  <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.3-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" fill="currentColor" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>

      {/* Chapters */}
      <div className="relative border-t border-white/10">
        <div ref={rail} className="no-scrollbar flex snap-x gap-2 overflow-x-auto scroll-smooth p-3">
          {promptWeaverDemos.map((d, i) => {
            const on = d.id === active;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setActive(d.id)}
                className={`group flex w-[200px] shrink-0 snap-start items-center gap-3 rounded-xl p-2 text-left transition-colors ${
                  on ? "bg-white/[0.1] ring-1 ring-white/25" : "hover:bg-white/[0.05]"
                }`}
              >
                <span className="relative h-[60px] w-[34px] shrink-0 overflow-hidden rounded-md bg-white/5 ring-1 ring-white/10">
                  <Image src={`/pw/${d.id}.jpg`} alt="" fill sizes="120px" className="object-cover" />
                  {on && (
                    <span className="absolute inset-0 grid place-items-center bg-black/50">
                      <span className="flex h-3 items-end gap-[2px]">
                        {[0, 1, 2].map((b) => (
                          <span key={b} className="wave-bar w-[2px] rounded-full bg-white" style={{ height: 12, animationDelay: `${b * 150}ms` }} />
                        ))}
                      </span>
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 font-mono text-[11px] text-white/40">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span>{d.length}</span>
                  </span>
                  <span className="block truncate text-[13px] font-medium text-white/90">{d.title}</span>
                  <span className="block truncate text-[12px] text-white/45">{d.blurb}</span>
                </span>
              </button>
            );
          })}
          <a
            href={promptWeaverPlaylist}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-[150px] shrink-0 snap-start items-center justify-center rounded-xl border border-dashed border-white/15 p-2 text-center text-[12px] text-white/55 transition-colors hover:border-white/35 hover:text-white"
          >
            Open playlist on YouTube ↗
          </a>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-[#0b0b0d] to-transparent sm:block" />
        <div className="absolute right-3 top-1/2 hidden -translate-y-1/2 gap-1 sm:flex">
          <button type="button" onClick={() => scrollRail(-1)} aria-label="Scroll demos left" className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 backdrop-blur transition-colors hover:bg-white/20">
            ‹
          </button>
          <button type="button" onClick={() => scrollRail(1)} aria-label="Scroll demos right" className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 backdrop-blur transition-colors hover:bg-white/20">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
