"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

const locales = [
  { code: "FR", label: "Français" },
  { code: "EN", label: "English" },
  { code: "ES", label: "Español" },
] as const;

/**
 * Onglets de langue. Tous les panneaux restent montés et sont simplement
 * masqués : le formulaire soumet les trois langues en une seule fois, même
 * si l'on n'a ouvert qu'un onglet.
 */
export function LocaleTabs({
  render,
}: {
  render: (locale: "FR" | "EN" | "ES") => React.ReactNode;
}) {
  const [active, setActive] = useState<"FR" | "EN" | "ES">("FR");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Langue du contenu"
        className="mb-6 inline-flex gap-1 rounded-full bg-black/5 p-1"
      >
        {locales.map((locale) => (
          <button
            key={locale.code}
            type="button"
            role="tab"
            aria-selected={active === locale.code}
            onClick={() => setActive(locale.code)}
            className={cn(
              "cursor-pointer rounded-full px-4 py-2 font-display text-sm font-bold transition-colors",
              active === locale.code
                ? "bg-white text-aegean-700 shadow-soft"
                : "text-[var(--ink-45)] hover:text-ink",
            )}
          >
            {locale.label}
          </button>
        ))}
      </div>

      {locales.map((locale) => (
        <div
          key={locale.code}
          role="tabpanel"
          hidden={active !== locale.code}
          className="grid gap-5"
        >
          {render(locale.code)}
        </div>
      ))}
    </div>
  );
}
