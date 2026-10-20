import { ImageResponse } from "next/og";

/**
 * Favicon généré à la construction : reprend l'arche du logo, pour que
 * l'onglet et les favoris portent la marque plutôt que l'icône par défaut.
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
        {/* L'arche : la colonne grecque réduite à son geste. */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M10 23V15a6 6 0 0 1 12 0v8"
            stroke="#fff"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
