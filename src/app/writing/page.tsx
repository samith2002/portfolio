import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { posts, formatDate } from "@/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on building AI agents: harnesses, MCP, tool calling, memory and context engineering.",
};

export default function WritingIndex() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1120px] px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
        <h1
          className="rise max-w-[820px] font-serif text-[clamp(2.6rem,6.5vw,5rem)] leading-[1.02] tracking-[-0.02em]"
          style={{ "--delay": "100ms" } as React.CSSProperties}
        >
          Field notes on building agents <span className="italic text-muted">that hold up in production.</span>
        </h1>
        <p
          className="rise mt-8 max-w-[560px] text-[16.5px] leading-[1.7] text-muted"
          style={{ "--delay": "200ms" } as React.CSSProperties}
        >
          What I&apos;ve learned shipping LLM systems for enterprise data teams, explained with diagrams rather
          than jargon.
        </p>

        <ol className="mt-20 border-b border-line">
          {posts.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 40}>
              <Link
                href={`/writing/${p.slug}`}
                className="group grid gap-3 border-t border-line py-8 sm:grid-cols-[140px_1fr_auto] sm:items-baseline sm:gap-10"
              >
                <span className="font-mono text-[12px] text-faint">{formatDate(p.date)}</span>
                <span>
                  <span className="block font-serif text-[26px] leading-[1.3] tracking-[-0.01em] transition-colors group-hover:text-accent sm:text-[30px]">
                    {p.title}
                  </span>
                  <span className="mt-2.5 block max-w-[620px] text-[15px] leading-[1.65] text-muted">
                    {p.description}
                  </span>
                </span>
                <span className="flex gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-faint sm:flex-col sm:items-end sm:gap-1">
                  <span className="text-accent">{p.topic}</span>
                  <span>{p.readingTime}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </main>
      <Footer />
    </>
  );
}
