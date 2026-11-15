import { ImageResponse } from "next/og";

/**
 * Favicon généré à la construction : l'œil du logo, sans fond (PNG
 * transparent), lisible sur les onglets clairs comme sombres.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M1 16c3.7-6.2 8.7-9.3 15-9.3s11.3 3.1 15 9.3c-3.7 6.2-8.7 9.3-15 9.3S4.7 22.2 1 16Z" fill="#1F7AE0" />
          <circle cx="16" cy="16" r="5.8" fill="#fff" />
          <circle cx="16" cy="16" r="2.9" fill="#0B3A75" />
        </svg>
      </div>
    ),
    size,
  );
}
