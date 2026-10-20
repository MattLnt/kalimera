import "server-only";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { locales } from "@/i18n/routing";

/** Toute action d'administration commence par là. */
export async function assertAdmin() {
  const user = await requireUser();
  if (!user) throw new Error("Non autorisé.");
  return user;
}

/**
 * Invalide les pages publiques après une écriture. On passe par `layout`
 * pour emporter les sous-routes (listes et fiches) de chaque langue.
 */
export function revalidateSite() {
  for (const locale of locales) {
    revalidatePath(`/${locale}`, "layout");
  }
  revalidatePath("/sitemap.xml");
}

/** Lit une liste sérialisée en JSON depuis un champ caché du formulaire. */
export function readTagList(formData: FormData, field: string): string[] {
  const raw = formData.get(field);
  if (typeof raw !== "string" || raw.length === 0) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 20);
  } catch {
    return [];
  }
}

export function readString(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

export function readOptional(formData: FormData, field: string): string | null {
  const value = readString(formData, field);
  return value.length > 0 ? value : null;
}

export function readBoolean(formData: FormData, field: string): boolean {
  return formData.get(field) === "on" || formData.get(field) === "true";
}

export function readNumber(formData: FormData, field: string, fallback = 0): number {
  const value = Number(readString(formData, field));
  return Number.isFinite(value) ? value : fallback;
}

export const dbLocaleList = ["FR", "EN", "ES"] as const;
export type DbLocaleCode = (typeof dbLocaleList)[number];
