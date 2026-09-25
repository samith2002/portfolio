import Link from "next/link";
import {
  profile,
  intro,
  work,
  projects,
  experience,
  recognition,
  education,
  toolkit,
  certifications,
  approach,
  socials,
} from "@/content";
import { posts, formatDate } from "@/posts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { CopyEmail } from "@/components/CopyEmail";
import { Portrait } from "@/components/Portrait";
import { PromptWeaverTheater } from "@/components/PromptWeaverTheater";
import { LectureForgeGallery } from "@/components/LectureForgeGallery";
import { MediCallCover } from "@/components/ProjectCovers";
import { workIllustrations } from "@/components/illustrations/Work";
import { TopicMark } from "@/components/illustrations/TopicMark";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} aria-hidden>
      <path d="M3 9 9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionHeader({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Reveal className="mb-12 grid gap-6 sm:mb-16 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
      <div>
        <h2 className="font-serif text-[clamp(2.1rem,4.6vw,3.5rem)] leading-[1.04] tracking-[-0.02em]">{title}</h2>
      </div>
      {children && <div className="max-w-[480px] text-[16px] leading-[1.7] text-muted">{children}</div>}
    </Reveal>
  );
}

function Tags({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {items.map((t) => (
        <li key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[12px] text-muted">
          {t}
        </li>
      ))}
    </ul>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((h) => (
        <li key={h} className="flex gap-3 text-[14.5px] leading-[1.6]">
          <span className="mt-[11px] h-px w-3 shrink-0 bg-faint" />
          <span>{h}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const [featured, ...restWork] = work;
  const FeaturedArt = workIllustrations[featured.id];
  const promptWeaver = projects.find((p) => p.name === "Prompt Weaver")!;
  const mediCall = projects.find((p) => p.name === "MediCall")!;
  const lectureForge = projects.find((p) => p.name === "LectureForge")!;

  return (
    <>
      <Header />

      <main id="top" className="mx-auto max-w-[1120px] px-5 sm:px-8">
        {/* ——— Hero ——— */}
        <section className="grid min-h-[94svh] items-center gap-14 pb-16 pt-28 sm:pt-32 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div>

            <h1 className="max-w-[640px] font-serif text-[clamp(2.5rem,5.4vw,4.35rem)] font-normal leading-[1.04] tracking-[-0.02em]">
              {intro.headline.map((line, i) => (
                <span
                  key={line}
                  className={`rise inline ${i === intro.headline.length - 1 ? "italic text-muted" : ""}`}
                  style={{ "--delay": `${120 + i * 110}ms` } as React.CSSProperties}
                >
                  {line}{" "}
                </span>
              ))}
            </h1>

            <p
              className="rise mt-9 max-w-[560px] text-[16.5px] leading-[1.7] text-muted"
              style={{ "--delay": "480ms" } as React.CSSProperties}
            >
              {intro.body}
            </p>

            <div className="rise mt-9 flex flex-wrap items-center gap-2.5" style={{ "--delay": "560ms" } as React.CSSProperties}>
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-[14px] font-medium text-bg transition-transform hover:-translate-y-px"
              >
                Get in touch
                <Arrow className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
              </a>
              <a href="#work" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[14px] font-medium transition-colors hover:border-fg">
                See my work
              </a>
            </div>

            <ul className="rise mt-7 flex flex-wrap items-center gap-x-5 gap-y-2" style={{ "--delay": "640ms" } as React.CSSProperties}>
              {socials.map((l) => (
                <li key={l.label}>
                  <a href={l.href} {...external} className="group inline-flex items-center gap-1.5 text-[13.5px] text-muted transition-colors hover:text-fg">
                    <span className="link">{l.label}</span>
                    <Arrow className="opacity-50 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rise order-first lg:order-none" style={{ "--delay": "200ms" } as React.CSSProperties}>
            <div className="mx-auto w-[62%] max-w-[380px] sm:w-[48%] lg:w-full">
              <Portrait />
            </div>
          </div>
        </section>

        {/* ——— How I work ——— */}
        <section id="approach" className="border-t border-line py-24 sm:py-32">
          <SectionHeader
            index="01"
            label="How I work"
            title={
              <>
                Forward deployed: <span className="italic text-muted">close to the problem.</span>
              </>
            }
          >
            I don&apos;t start from a model. I start with the people doing the work, learn their systems and data, and
            find the places where AI changes the outcome. Then I build it with them and stay until it runs on its own.
          </SectionHeader>

          <div className="relative">
            {/* track with a travelling signal (desktop) */}
            <div className="absolute inset-x-0 top-[22px] hidden h-px bg-line lg:block" aria-hidden>
              <div className="approach-signal absolute -top-[3px] h-[7px] w-24 rounded-full bg-gradient-to-r from-transparent via-accent to-transparent" />
            </div>
            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {approach.map((a, i) => (
                <Reveal as="li" key={a.step} delay={i * 90}>
                  <div className="relative">
                    <span className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-line bg-bg font-mono text-[12px] text-muted shadow-[0_0_0_6px_var(--bg)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">{a.step}</p>
                    <h3 className="mt-2 font-serif text-[26px] leading-tight tracking-[-0.01em]">{a.title}</h3>
                    <p className="mt-2.5 max-w-[300px] text-[14.5px] leading-[1.65] text-muted">{a.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ——— Selected work ——— */}
        <section id="work" className="border-t border-line py-24 sm:py-32">
          <SectionHeader
            index="02"
            label="Selected work · Data Color AI"
            title={
              <>
                Agents that work inside <span className="italic text-muted">enterprise data.</span>
              </>
            }
          >
            Production systems I&apos;ve built alongside customer teams. They connect to MDM platforms, ERPs, CRMs and
            data pipelines, and they bring in a person for the decisions that need one.
          </SectionHeader>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-2 [&>*]:min-w-0">
            {/* Featured */}
            <Reveal as="article" className="lg:col-span-2">
              <div className="group grid grid-cols-1 bg-bg lg:grid-cols-[1.7fr_1fr] [&>*]:min-w-0">
                <div className="canvas-dots relative min-h-[340px]">
                  <FeaturedArt />
                </div>
                <WorkText w={featured} index={1} large />
              </div>
            </Reveal>

            {restWork.map((w, i) => {
              const Art = workIllustrations[w.id];
              return (
                <Reveal as="article" key={w.id} delay={(i % 2) * 100} className="h-full">
                  <div className="group flex h-full flex-col bg-bg">
                    <div className="canvas-dots relative min-h-[300px]">
                      <Art />
                    </div>
                    <WorkText w={w} index={i + 2} />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ——— Projects ——— */}
        <section id="projects" className="border-t border-line py-24 sm:py-32">
          <SectionHeader
            index="03"
            label="Projects"
            title={
              <>
                Built on my own time, <span className="italic text-muted">shipped to real users.</span>
              </>
            }
          >
            A prompt engineering product with paying subscribers, a voice agent that won a hackathon, and a desktop app
            that turns lectures into fact-checked courses.
          </SectionHeader>

          {/* Prompt Weaver */}
          <Reveal as="article">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.9fr] lg:gap-12 [&>*]:min-w-0">
              <div className="flex flex-col">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-[40px] leading-none tracking-[-0.015em]">{promptWeaver.name}</h3>
                  <span className="font-mono text-[11px] text-faint">{promptWeaver.year}</span>
                </div>
                <p className="mt-3 font-serif text-[19px] italic text-muted">{promptWeaver.tagline}</p>
                <p className="mt-5 text-[15px] leading-[1.7] text-muted">{promptWeaver.description}</p>
                <div className="mt-6">
                  <Bullets items={promptWeaver.highlights} />
                </div>
                <Tags items={promptWeaver.stack} className="mt-7" />
                <a
                  href={promptWeaver.href}
                  {...external}
                  className="group mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-[14px] font-medium text-bg transition-transform hover:-translate-y-px"
                >
                  Visit Prompt Weaver
                  <Arrow className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
                </a>
              </div>
              <PromptWeaverTheater />
            </div>
          </Reveal>

          {/* MediCall */}
          <Reveal as="article" className="mt-16">
            <a
              href={mediCall.href}
              {...external}
              className="group grid grid-cols-1 border-y border-line lg:grid-cols-[1fr_1fr] [&>*]:min-w-0"
            >
              <div className="canvas-dots relative min-h-[300px]">
                <MediCallCover />
                {mediCall.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-fg px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-bg">
                    {mediCall.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-col py-8 sm:p-9">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-[36px] leading-none tracking-[-0.015em]">{mediCall.name}</h3>
                  <span className="font-mono text-[11px] text-faint">{mediCall.year}</span>
                </div>
                <p className="mt-3 font-serif text-[19px] italic text-muted">{mediCall.tagline}</p>
                <p className="mt-4 text-[15px] leading-[1.7] text-muted">{mediCall.description}</p>
                <div className="mt-5">
                  <Bullets items={mediCall.highlights} />
                </div>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
                  <Tags items={mediCall.stack} />
                  <span className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-accent">
                    {mediCall.linkLabel}
                    <Arrow className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </a>
          </Reveal>

          {/* LectureForge */}
          <Reveal as="article" className="mt-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.9fr_1fr] lg:gap-12 [&>*]:min-w-0">
              <LectureForgeGallery />
              <div className="order-first flex flex-col lg:order-none">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-[40px] leading-none tracking-[-0.015em]">{lectureForge.name}</h3>
                  <span className="font-mono text-[11px] text-faint">{lectureForge.year}</span>
                </div>
                <p className="mt-3 font-serif text-[19px] italic text-muted">{lectureForge.tagline}</p>
                <p className="mt-5 text-[15px] leading-[1.7] text-muted">{lectureForge.description}</p>
                <div className="mt-6">
                  <Bullets items={lectureForge.highlights} />
                </div>
                <Tags items={lectureForge.stack} className="mt-7" />
              </div>
            </div>
          </Reveal>
        </section>

        {/* ——— Writing ——— */}
        <section id="writing" className="border-t border-line py-24 sm:py-32">
          <SectionHeader
            index="04"
            label="Writing"
            title={
              <>
                How agents actually work, <span className="italic text-muted">drawn out.</span>
              </>
            }
          >
            Illustrated explainers on the parts of AI engineering that tutorials skip: harnesses, MCP, tool calling, memory
            and context.
          </SectionHeader>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 6).map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 80} className="h-full">
                <Link
                  href={`/writing/${p.slug}`}
                  className="group flex h-full flex-col bg-bg transition-colors hover:bg-surface"
                >
                  <div className="canvas-dots relative h-[150px]">
                    <TopicMark slug={p.slug} />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em]">
                      <span className="text-accent">{p.topic}</span>
                      <span className="text-faint">{p.readingTime}</span>
                    </div>
                    <h3 className="mt-3 font-serif text-[23px] leading-[1.3] tracking-[-0.01em] transition-colors group-hover:text-accent">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 line-clamp-3 text-[13.5px] leading-[1.6] text-muted">{p.description}</p>
                    <p className="mt-auto pt-5 font-mono text-[11px] text-faint">{formatDate(p.date)}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <Link href="/writing" className="link inline-flex items-center gap-2 text-[14.5px] font-medium text-accent">
                All writing →
              </Link>
              <a href={profile.medium} {...external} className="group inline-flex items-center gap-1.5 text-[14.5px] text-muted transition-colors hover:text-fg">
                <span className="link">More on Medium</span> <Arrow />
              </a>
            </div>
          </Reveal>
        </section>

        {/* ——— Experience ——— */}
        <section id="experience" className="border-t border-line py-24 sm:py-32">
          <SectionHeader index="05" label="Experience" title="Where I've worked" />
          <div className="border-b border-line">
            {experience.map((e, i) => (
              <Reveal key={e.company} delay={i * 60}>
                <div className="grid gap-4 border-t border-line py-10 md:grid-cols-[220px_1fr] md:gap-12">
                  <div>
                    <p className="text-[19px] font-medium tracking-[-0.01em]">{e.company}</p>
                    <p className="mt-1 font-serif text-[18px] italic text-muted">{e.role}</p>
                    <p className="mt-3 font-mono text-[11.5px] leading-6 text-faint">
                      {e.period} · {e.location}
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {e.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-[15px] leading-[1.7] text-muted">
                        <span className="mt-[12px] h-px w-3 shrink-0 bg-faint" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ——— Recognition ——— */}
        <section id="recognition" className="border-t border-line py-24 sm:py-32">
          <SectionHeader index="06" label="Recognition" title="Wins, papers and launches" />
          <ul className="border-b border-line">
            {recognition.map((r, i) => {
              const inner = (
                <>
                  <span className="font-mono text-[12px] text-faint">{r.year}</span>
                  <span className="text-[16.5px] font-medium tracking-[-0.005em]">{r.title}</span>
                  <span className="flex items-center justify-between gap-3 text-[14px] text-muted">
                    {r.detail}
                    {r.href && <Arrow className="shrink-0 text-accent" />}
                  </span>
                </>
              );
              const cls = "grid gap-1 border-t border-line py-5 sm:grid-cols-[90px_1fr_1fr] sm:items-baseline sm:gap-6";
              return (
                <Reveal as="li" key={r.title} delay={i * 50}>
                  {r.href ? (
                    <a href={r.href} {...external} className={`${cls} transition-colors hover:text-accent`}>
                      {inner}
                    </a>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </ul>
        </section>

        {/* ——— Toolkit ——— */}
        <section id="toolkit" className="border-t border-line py-24 sm:py-32">
          <SectionHeader
            index="07"
            label="Toolkit"
            title={
              <>
                What I build with, <span className="italic text-muted">end to end.</span>
              </>
            }
          >
            From the model call to the queue it runs on. The highlighted tools are what I use every week. The rest I&apos;ve
            shipped with.
          </SectionHeader>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {toolkit.map((t, i) => (
              <Reveal key={t.group} delay={(i % 3) * 70} className="h-full">
                <div className="group h-full bg-bg p-6 transition-colors hover:bg-surface sm:p-7">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-[26px] leading-none tracking-[-0.01em]">{t.group}</h3>
                    <span className="font-mono text-[11px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-2 text-[13px] text-muted">{t.blurb}</p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {t.core.map((c) => (
                      <li key={c} className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-[12px] font-medium text-fg">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[12.5px] leading-[1.7] text-muted">{t.also.join(" · ")}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ——— Background ——— */}
        <section id="about" className="border-t border-line py-24 sm:py-32">
          <SectionHeader index="08" label="Background" title="Education & certifications" />
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="space-y-8">
                {education.map((ed) => (
                  <div key={ed.school}>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-[17px] font-medium tracking-[-0.01em]">{ed.school}</p>
                      <span className="font-mono text-[12px] text-faint">{ed.year}</span>
                    </div>
                    <p className="mt-1 font-serif text-[18px] italic text-muted">{ed.degree}</p>
                    <p className="mt-1.5 text-[14px] text-muted">{ed.detail}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <ul className="divide-y divide-line border-y border-line">
                {certifications.map((c) => (
                  <li key={c} className="py-4 text-[14.5px] leading-snug text-muted">
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ——— Contact ——— */}
        <section id="contact" className="border-t border-line py-24 sm:py-36">
          <Reveal>
            <h2 className="max-w-[900px] font-serif text-[clamp(2.4rem,6.5vw,5rem)] font-normal leading-[1.04] tracking-[-0.02em]">
              Working on something hard with AI? <span className="italic text-muted">Let&apos;s talk.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <a href={`mailto:${profile.email}`} className="link w-fit break-all text-[clamp(1.25rem,3vw,1.9rem)] tracking-[-0.01em] text-accent">
                {profile.email}
              </a>
              <CopyEmail email={profile.email} />
            </div>
            <ul className="mt-10 flex flex-wrap gap-2">
              {socials.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...external}
                    className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[13.5px] text-muted transition-colors hover:border-fg hover:text-fg"
                  >
                    {l.label}
                    <span className="font-mono text-[11px] text-faint">{l.handle}</span>
                    <Arrow className="opacity-50 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}

function WorkText({ w, index, large = false }: { w: (typeof work)[number]; index: number; large?: boolean }) {
  return (
    <div className={`flex flex-1 flex-col ${large ? "p-6 sm:p-9 lg:justify-center" : "p-6 sm:p-8"}`}>
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em]">
        <span className="text-faint">{String(index).padStart(2, "0")}</span>
        <span className="text-accent">{w.kind}</span>
      </div>
      <h3 className={`mt-3 font-serif leading-[1.05] tracking-[-0.015em] ${large ? "text-[40px]" : "text-[30px]"}`}>{w.title}</h3>
      <p className="mt-3 text-[14.5px] leading-[1.7] text-muted">{w.summary}</p>
      <div className="mt-auto pt-6">
        {w.outcome && (
          <p className="mb-4 flex gap-2 text-[14px] font-medium leading-snug">
            <span className="text-accent">↳</span>
            {w.outcome}
          </p>
        )}
        <Tags items={w.stack} />
      </div>
    </div>
  );
}
