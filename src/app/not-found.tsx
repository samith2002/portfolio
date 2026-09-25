import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1120px] flex-col justify-center px-5 sm:px-8">
      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted">404</p>
      <h1 className="mt-4 font-serif text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.02em]">
        This page doesn't exist <span className="italic text-muted">(yet).</span>
      </h1>
      <Link href="/" className="link mt-8 w-fit text-[15px] text-accent">
        ← Back home
      </Link>
    </main>
  );
}
