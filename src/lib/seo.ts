import type { Metadata } from "next";

import { getPathname } from "@/i18n/navigation";
import { locales, type AppPathnames } from "@/i18n/routing";

type Params = Record<string, string>;

/**
 * Construit les liens canonique et hreflang d'une page. Les slugs étant
 * traduits, chaque langue peut avoir un paramètre différent : `paramsByLocale`
 * permet de les passer un par un.
 */
export function buildAlternates(
  pathname: AppPathnames,
  paramsByLocale?: Partial<Record<(typeof locales)[number], Params>>,
  currentLocale?: (typeof locales)[number],
): Metadata["alternates"] {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    const params = paramsByLocale?.[locale];
    if (paramsByLocale && !params) continue; // Traduction absente : pas de hreflang.
    languages[locale] = getPathname({
      locale,
      // @ts-expect-error — les paramètres dépendent de la route visée.
      href: params ? { pathname, params } : pathname,
    });
  }

  const canonicalLocale = currentLocale ?? "fr";
  const canonical = languages[canonicalLocale] ?? languages.fr;

  return {
    canonical,
    languages: { ...languages, "x-default": languages.fr ?? canonical },
  };
}
