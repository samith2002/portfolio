import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { profile } from "@/content";
import "./globals.css";

const sans = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-sans-face", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-display",
  display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap" });

const description =
  "Samith Deshai Siddo, Forward Deployed AI Engineer at Data Color AI in Dallas. I work with teams to find where AI fits, then build and ship the agents, MCP integrations and retrieval systems that do the work.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.shortName}`,
  },
  description,
  authors: [{ name: profile.name }],
  keywords: ["Forward Deployed AI Engineer", "AI Engineer", "LangGraph", "MCP", "RAG", "Agentic AI", "Dallas", "Samith Siddo"],
  openGraph: {
    type: "website",
    url: "/",
    title: `${profile.name} — ${profile.role}`,
    description,
    siteName: profile.shortName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f5f1",
};

// Runs before paint: light by default, or the visitor's saved choice, without a flash
const themeScript = `(function(){var t='light';try{t=localStorage.getItem('theme')||'light'}catch(e){}document.documentElement.dataset.theme=t})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="relative min-h-screen font-sans text-fg antialiased">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
