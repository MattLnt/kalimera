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
    <html lang="fr" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-canvas">{children}</body>
    </html>
  );
}
