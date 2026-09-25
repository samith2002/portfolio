import { profile, socials } from "@/content";
import { LocalTime } from "./LocalTime";

export function Footer() {
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-5 py-8 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="font-mono text-[12px]">
            {profile.location} · <LocalTime timezone={profile.timezone} />
          </span>
          <a href="/writing" className="link hover:text-fg">
            Writing
          </a>
          {socials.map((l) => (
            <a key={l.label} href={l.href} {...external} className="link hover:text-fg">
              {l.label}
            </a>
          ))}
          <a href={profile.resume} target="_blank" rel="noopener" className="link hover:text-fg">
            Resume
          </a>
        </div>
      </div>
    </footer>
  );
}
