import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReadingProgress } from "@/components/ReadingProgress";
import { posts, getPost, formatDate } from "@/posts";
import { profile } from "@/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.date },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const idx = posts.findIndex((p) => p.slug === slug);
  const next = posts[(idx + 1) % posts.length];
  const { Body } = post;

  return (
    <>
      <ReadingProgress />
      <Header />
      <main className="mx-auto max-w-[1120px] px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <article className="mx-auto max-w-[680px]">
          <Link
            href="/writing"
            className="rise inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-fg"
          >
            ← Writing
          </Link>
          <div
            className="rise mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11.5px] uppercase tracking-[0.1em] text-faint"
            style={{ "--delay": "60ms" } as React.CSSProperties}
          >
            <span className="text-accent">{post.topic}</span>
            <span>·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingTime} read</span>
          </div>
          <h1
            className="rise mt-5 font-serif text-[clamp(2.3rem,5.6vw,3.9rem)] leading-[1.04] tracking-[-0.02em]"
            style={{ "--delay": "120ms" } as React.CSSProperties}
          >
            {post.title}
          </h1>
          <p
            className="rise mt-6 text-[18px] leading-[1.65] text-muted"
            style={{ "--delay": "180ms" } as React.CSSProperties}
          >
            {post.description}
          </p>
          <div
            className="rise mt-8 flex items-center gap-3 border-y border-line py-4"
            style={{ "--delay": "240ms" } as React.CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/samith.jpg" alt="" className="h-9 w-9 rounded-full object-cover object-top" />
            <div className="text-[13.5px] leading-tight">
              <p className="font-medium">{profile.name}</p>
              <p className="text-muted">Forward Deployed AI Engineer, Data Color AI</p>
            </div>
          </div>

          <div className="prose-post mt-12">
            <Body />
          </div>
        </article>

        {next && next.slug !== slug && (
          <div className="mx-auto mt-24 max-w-[680px] border-t border-line pt-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">Read next</p>
            <Link href={`/writing/${next.slug}`} className="group mt-3 block">
              <span className="font-serif text-[30px] leading-[1.3] tracking-[-0.01em] transition-colors group-hover:text-accent">
                {next.title} →
              </span>
              <span className="mt-2 block text-[15px] leading-[1.65] text-muted">{next.description}</span>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
