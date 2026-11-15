import { ImageResponse } from "next/og";

/** Icône d'écran d'accueil (iPhone, iPad) : l'œil du logo sur le dégradé bleu. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2A86E8 0%, #07213F 100%)",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 32 32" fill="none">
          <path d="M5.5 16c2.8-4.3 6.3-6.5 10.5-6.5s7.7 2.2 10.5 6.5c-2.8 4.3-6.3 6.5-10.5 6.5S8.3 20.3 5.5 16Z" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round" />
          <circle cx="16" cy="16" r="3.2" fill="#7DD3FC" />
        </svg>
      </div>
    ),
    size,
  );
}
