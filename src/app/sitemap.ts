import type { MetadataRoute } from "next";

import { getPathname } from "@/i18n/navigation";
import { locales, type AppLocale, type AppPathnames } from "@/i18n/routing";
import {
  getLandingSlugs,
  getPostSlugs,
  getProjectSlugs,
  getServiceSlugs,
} from "@/lib/content";
import { LandingKind } from "@/generated/prisma/enums";
import { toAppLocale } from "@/lib/locale";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

const staticPages: { path: AppPathnames; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/services", priority: 0.9 },
  // Les pages d'intention : ce sont elles qui captent les requêtes.
  { path: "/sectors", priority: 0.9 },
  { path: "/locations", priority: 0.9 },
  { path: "/work", priority: 0.9 },
  { path: "/studio", priority: 0.7 },
  { path: "/journal", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [services, projects, posts, sectors, locations] = await Promise.all([
    getServiceSlugs(),
    getProjectSlugs(),
    getPostSlugs(),
    getLandingSlugs(LandingKind.SECTOR),
    getLandingSlugs(LandingKind.LOCATION),
  ]);

  /** Chaque entrée déclare ses variantes de langue, slugs traduits compris. */
  const entry = (
    path: AppPathnames,
    slugsByLocale: Partial<Record<AppLocale, string>> | null,
    priority: number,
  ): MetadataRoute.Sitemap => {
    const available = locales.filter(
      (locale) => !slugsByLocale || slugsByLocale[locale],
    );

    const languages = Object.fromEntries(
      available.map((locale) => [
        locale,
        `${base}${getPathname({
          locale,
          // @ts-expect-error — les paramètres dépendent de la route visée.
          href: slugsByLocale
            ? { pathname: path, params: { slug: slugsByLocale[locale] } }
            : path,
        })}`,
      ]),
    );

    return available.map((locale) => ({
      url: languages[locale],
      lastModified: new Date(),
      priority,
      alternates: { languages },
    }));
  };

  /** Regroupe les traductions d'un même contenu par l'identifiant du parent. */
  const group = <T extends { locale: "FR" | "EN" | "ES"; slug: string }>(
    items: T[],
    parentId: (item: T) => string,
  ) => {
    const byParent = new Map<string, Partial<Record<AppLocale, string>>>();
    for (const item of items) {
      const key = parentId(item);
      const bucket = byParent.get(key) ?? {};
      bucket[toAppLocale(item.locale)] = item.slug;
      byParent.set(key, bucket);
    }
    return [...byParent.values()];
  };

  return [
    ...staticPages.flatMap((page) => entry(page.path, null, page.priority)),
    ...group(services, (item) => item.serviceId).flatMap((slugs) =>
      entry("/services/[slug]", slugs, 0.8),
    ),
    ...group(projects, (item) => item.projectId).flatMap((slugs) =>
      entry("/work/[slug]", slugs, 0.8),
    ),
    ...group(sectors, (item) => item.landingId).flatMap((slugs) =>
      entry("/sectors/[slug]", slugs, 0.85),
    ),
    ...group(locations, (item) => item.landingId).flatMap((slugs) =>
      entry("/locations/[slug]", slugs, 0.85),
    ),
    ...group(posts, (item) => item.postId).flatMap((slugs) =>
      entry("/journal/[slug]", slugs, 0.6),
    ),
  ];
}
