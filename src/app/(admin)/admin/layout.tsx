import type { Metadata } from "next";

import "@/styles/globals.css";

import { inter, manrope } from "@/lib/fonts";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s — Kalimera" },
  // L'administration ne doit jamais apparaître dans un moteur de recherche.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 90 % de la taille de base : tout ce qui est en rem (texte, marges, champs)
    // se resserre d'un même cran, sans rien déséquilibrer.
    <html lang="fr" className={`${manrope.variable} ${inter.variable}`} style={{ fontSize: "90%" }}>
      <body className="min-h-dvh bg-canvas">{children}</body>
    </html>
  );
}
