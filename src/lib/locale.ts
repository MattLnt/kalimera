import { Locale as DbLocale } from "@/generated/prisma/enums";
import { notFound } from "next/navigation";

import type { AppLocale } from "@/i18n/routing";

/**
 * Le site parle en "fr" / "en" / "es", la base en FR / EN / ES. Une langue
 * inconnue (une adresse comme /favicon.ico ou /logo.png prise pour une
 * langue) donne une page introuvable plutôt qu'une erreur serveur.
 */
export function toDbLocale(locale: AppLocale): DbLocale {
  const db = String(locale).toUpperCase();
  if (db !== "FR" && db !== "EN" && db !== "ES") notFound();
  return db as DbLocale;
}

export function toAppLocale(locale: DbLocale): AppLocale {
  return locale.toLowerCase() as AppLocale;
}

export const dbLocales: DbLocale[] = [DbLocale.FR, DbLocale.EN, DbLocale.ES];

/** Libellés affichés dans l'administration. */
export const localeLabels: Record<DbLocale, string> = {
  FR: "Français",
  EN: "English",
  ES: "Español",
};

/** Codes de langue complets, pour les balises hreflang et Open Graph. */
export const htmlLocales: Record<AppLocale, string> = {
  fr: "fr_FR",
  en: "en_GB",
  es: "es_ES",
};

/**
 * Récupère la traduction d'une langue donnée, avec repli sur le français
 * puis sur la première disponible : une page ne doit jamais casser parce
 * qu'une traduction n'a pas encore été saisie.
 */
export function pickTranslation<T extends { locale: DbLocale }>(
  translations: T[],
  locale: DbLocale,
): T | undefined {
  return (
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === DbLocale.FR) ??
    translations[0]
  );
}
