"use client";

import Image from "next/image";
import { useRef } from "react";
import { profile } from "@/content";

export function Portrait() {
  const card = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent) {
    const el = card.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  }
  function onLeave() {
    if (card.current) card.current.style.transform = "";
  }

  return (
    <div className="relative mx-auto w-full max-w-[380px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      {/* offset frame */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[28px] border border-line" aria-hidden />

      <div
        ref={card}
        className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line bg-surface transition-transform duration-300 ease-out will-change-transform"
      >
        <Image
          src="/samith.jpg"
          alt={`Portrait of ${profile.name}`}
          fill
          priority
          sizes="(min-width: 1024px) 380px, 80vw"
          className="object-cover object-[50%_20%]"
        />
        {/* soft light that follows the cursor */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60 mix-blend-soft-light"
          style={{ background: "radial-gradient(circle at var(--gx,50%) var(--gy,30%), rgba(255,255,255,0.5), transparent 55%)" }}
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-4 pb-4 pt-14 text-white sm:px-5 sm:pb-5 sm:pt-16">
          <p className="font-serif text-[17px] leading-none sm:text-[22px]">{profile.name}</p>
          <p className="mt-1.5 text-[12px] text-white/75 sm:text-[13px]">
            {profile.role}
            <span className="hidden sm:inline"> · {profile.location}</span>
          </p>
        </div>
      </div>

    </div>
  );
}
