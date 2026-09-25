"use client";

import Image from "next/image";
import { useState } from "react";
import { lectureForgeShots } from "@/content";

export function LectureForgeGallery() {
  const [i, setI] = useState(0);
  const shot = lectureForgeShots[i];

  return (
    <div className="self-start">
      <div className="overflow-hidden rounded-2xl border border-line bg-[#0b0b0d]">
        <div className="relative aspect-[1.6/1] w-full">
          {lectureForgeShots.map((s, n) => (
            <Image
              key={s.src}
              src={s.src}
              alt={`LectureForge: ${s.title}`}
              fill
              sizes="(min-width: 1120px) 700px, 100vw"
              className={`object-cover object-top transition-opacity duration-500 ${n === i ? "opacity-100" : "opacity-0"}`}
              priority={n === 0}
            />
          ))}
        </div>
      </div>

      <p className="mt-4 min-h-[3.2em] max-w-[68ch] text-[14px] leading-[1.6] text-muted" aria-live="polite">
        {shot.caption}
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5" role="tablist" aria-label="LectureForge screenshots">
        {lectureForgeShots.map((s, n) => {
          const on = n === i;
          return (
            <button
              key={s.src}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setI(n)}
              className={`group text-left transition-opacity ${on ? "" : "opacity-60 hover:opacity-100"}`}
            >
              <span
                className={`relative block aspect-[1.6/1] overflow-hidden rounded-lg border ${on ? "border-accent" : "border-line"}`}
              >
                <Image src={s.src} alt="" fill sizes="180px" className="object-cover object-top" />
              </span>
              <span className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-[11px] text-faint">{String(n + 1).padStart(2, "0")}</span>
                <span className={`text-[13px] ${on ? "font-medium text-fg" : "text-muted"}`}>{s.title}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
