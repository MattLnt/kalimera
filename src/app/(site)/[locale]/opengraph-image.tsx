import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

/**
 * Image de partage, une par langue. Générée à la construction : aucune image
 * à maintenir dans `public/`, et le texte suit les traductions.
 */
export const alt = "Kalimera — plateformes web et SaaS B2B";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #07213F 0%, #0B3161 55%, #1562B8 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              background: "linear-gradient(135deg, #2A86E8 0%, #07213F 100%)",
            }}
          >
            <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
              <path
                d="M10 23V15a6 6 0 0 1 12 0v8"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={{ fontSize: 38, fontWeight: 700, color: "#fff", letterSpacing: -1 }}>
            {siteConfig.name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: -2.5,
              lineHeight: 1.08,
              maxWidth: 940,
            }}
          >
            {t("ogHeadline")}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.68)",
              maxWidth: 880,
              lineHeight: 1.4,
            }}
          >
            {t("ogSubline")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            color: "rgba(255,255,255,0.52)",
          }}
        >
          <span>{siteConfig.domain}</span>
          <span>·</span>
          <span>{siteConfig.markets.map((market) => market.label).join(" · ")}</span>
        </div>
      </div>
    ),
    size,
  );
}
