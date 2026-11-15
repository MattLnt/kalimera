import { ImageResponse } from "next/og";

/**
 * Icône d'écran d'accueil (iPhone, iPad). iOS impose un fond : blanc, avec
 * l'œil du logo au centre.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF" }}>
        <svg width="136" height="136" viewBox="0 0 32 32" fill="none">
          <path d="M2 16c3.5-5.7 8.2-8.5 14-8.5s10.5 2.8 14 8.5c-3.5 5.7-8.2 8.5-14 8.5S5.5 21.7 2 16Z" fill="#1F7AE0" />
          <circle cx="16" cy="16" r="5.3" fill="#fff" />
          <circle cx="16" cy="16" r="2.5" fill="#0B3A75" />
        </svg>
      </div>
    ),
    size,
  );
}
