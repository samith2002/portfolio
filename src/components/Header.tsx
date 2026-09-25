"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? "border-b border-line bg-bg/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-5 sm:px-8">
        <a href="/" className="flex items-center gap-2.5" aria-label="Home">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-fg font-serif text-[15px] italic leading-none text-bg">
            S
          </span>
          <span className="text-[14px] font-medium tracking-tight">{profile.shortName}</span>
        </a>

        <nav className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 sm:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-[13.5px] text-muted transition-colors hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener"
            className="ml-1 rounded-full border border-line px-3.5 py-1.5 text-[13px] font-medium transition-colors hover:border-fg"
          >
            Resume
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
