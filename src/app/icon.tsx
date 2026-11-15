import { ImageResponse } from "next/og";

/**
 * Favicon généré à la construction : l'œil du logo, au trait plus épais
 * pour rester net à 16 et 32 pixels.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          background: "linear-gradient(135deg, #2A86E8 0%, #07213F 100%)",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M3.8 16c3-4.8 7.1-7.3 12.2-7.3s9.2 2.5 12.2 7.3c-3 4.8-7.1 7.3-12.2 7.3S6.8 20.8 3.8 16Z" stroke="#fff" strokeWidth="2.7" strokeLinejoin="round" />
          <circle cx="16" cy="16" r="4.2" fill="#7DD3FC" />
        </svg>
      </div>
    ),
    size,
  );
}
