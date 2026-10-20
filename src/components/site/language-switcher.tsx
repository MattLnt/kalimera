"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Bascule de langue. Conserve la page courante : les slugs étant traduits,
 * les paramètres de route sont repassés tels quels à next-intl, qui résout
 * le chemin cible de la langue demandée.
 */
export function LanguageSwitcher({ tone = "light" }: { tone?: "light" | "dark" }) {
  const t = useTranslations("nav");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: AppLocale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error — les paramètres dynamiques varient selon la route.
        { pathname, params },
        { locale: next },
      );
    });
  }

  return (
    <div
      role="group"
      aria-label={t("language")}
      data-pending={pending}
      className={cn(
        "flex gap-0.5 rounded-full p-[3px]",
        tone === "light" ? "bg-black/5" : "bg-white/10",
      )}
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "cursor-pointer rounded-full px-2.5 py-1.5 font-display text-xs font-bold uppercase transition-all duration-300",
              active
                ? "bg-white text-aegean-700 shadow-soft"
                : tone === "light"
                  ? "text-[var(--ink-45)] hover:text-ink"
                  : "text-white/55 hover:text-white",
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
