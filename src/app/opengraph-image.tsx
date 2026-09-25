import { ImageResponse } from "next/og";
import { profile } from "@/content";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f6f5f1",
          color: "#16161a",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#6c6b67" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#22a05e" }} />
          {profile.status}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.05, letterSpacing: -1.5 }}>
          <span>Find where AI earns its place,</span>
          <span style={{ fontStyle: "italic", color: "#6c6b67" }}>then ship it to production.</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #e3e1da",
            paddingTop: 28,
            fontSize: 26,
          }}
        >
          <span>{profile.name}</span>
          <span style={{ color: "#2346d8" }}>
            {profile.role} · {profile.location}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
