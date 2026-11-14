"use client";

import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type OptionalSection = {
  key: string;
  icon: LucideIcon;
  title: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
};

/**
 * Sections facultatives d'un document, en liste compacte : une ligne par
 * section avec son icône et son état (remplie ou non) ; un clic l'ouvre.
 * Ouvertes d'office quand elles ont déjà du contenu.
 */
export function OptionalSections({ sections }: { sections: OptionalSection[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((section) => [section.key, section.value.trim().length > 0])),
  );

  return (
    <ul className="divide-y divide-black/[0.05] overflow-hidden rounded-[16px] ring-1 ring-black/[0.06]">
      {sections.map((section) => {
        const filled = section.value.trim().length > 0;
        const isOpen = open[section.key];
        return (
          <li key={section.key} className={cn("bg-white transition-colors", isOpen && "bg-aegean-50/30")}>
            <button
              type="button"
              onClick={() => setOpen((current) => ({ ...current, [section.key]: !current[section.key] }))}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left"
            >
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-[10px] transition-colors",
                  filled ? "bg-aegean-600 text-white" : "bg-black/[0.04] text-[var(--ink-45)]",
                )}
              >
                <section.icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[0.875rem] font-bold text-ink">{section.title}</span>
                <span className="block truncate text-[0.75rem] text-[var(--ink-45)]">
                  {filled ? section.value.split("\n")[0] : section.hint}
                </span>
              </span>
              {filled ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 font-display text-[0.625rem] font-bold text-green-800">
                  <Check className="size-3" />
                  Imprimée
                </span>
              ) : (
                <span className="rounded-full bg-black/[0.04] px-2 py-0.5 font-display text-[0.625rem] font-bold text-[var(--ink-45)]">Masquée</span>
              )}
              <ChevronDown className={cn("size-4 shrink-0 text-[var(--ink-45)] transition-transform duration-300", isOpen && "rotate-180")} />
            </button>
            {isOpen ? (
              <div className="px-4 pb-4 pl-[60px]">
                <textarea
                  value={section.value}
                  onChange={(event) => section.onChange(event.target.value)}
                  rows={section.rows ?? 3}
                  placeholder={section.placeholder}
                  aria-label={section.title}
                  className="field-input resize-y text-[0.875rem]"
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
