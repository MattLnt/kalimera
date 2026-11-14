import type { Metadata } from "next";

import "@/styles/globals.css";

import { inter, manrope } from "@/lib/fonts";

export const metadata: Metadata = {
  title: { default: "Document", template: "%s" },
  // Documents personnels, atteints par un lien secret : jamais indexés.
  robots: { index: false, follow: false, nocache: true },
};

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-[#f2f2f2]">{children}</body>
    </html>
  );
}
