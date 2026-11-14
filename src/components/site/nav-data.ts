import "server-only";

import {
  LandingKind,
  ProjectKind,
  type Locale as DbLocale,
} from "@/generated/prisma/enums";
import {
  groupByKeys,
  sectorGroups,
  sectorLabels,
  serviceGroups,
  serviceHints,
  workGroupHeadings,
  type NavLocale,
} from "@/components/site/nav-labels";
import { optimized } from "@/lib/cloudinary";
import { getLandings, getProjects, getServices } from "@/lib/content";

export type NavDetailPath = "/services/[slug]" | "/sectors/[slug]" | "/work/[slug]";

export type NavEntry = {
  slug: string;
  pathname: NavDetailPath;
  title: string;
  /** Une ligne sous le libellé : ce qu'on obtient, ou le métier du client. */
  hint?: string;
  icon: string;
  /** Pastille de preuve, par exemple le nombre de réalisations du secteur. */
  badge?: string;
};

export type NavGroup = { heading: string; entries: NavEntry[] };

/** Réalisation mise en avant dans le panneau, avec sa capture. */
export type NavFeature = {
  slug: string;
  title: string;
  category: string;
  image: { url: string; alt: string } | null;
};

export type NavData = {
  services: NavGroup[];
  sectors: NavGroup[];
  work: NavGroup[];
  feature: NavFeature | null;
};

/** Référence e-commerce mise en avant dans le panneau Services. */
const FEATURED_PROJECT = "coteburo";

const badgeLabel: Record<NavLocale, (count: number) => string> = {
  fr: (count) => `${count} réal.`,
  en: (count) => `${count} ${count > 1 ? "projects" : "project"}`,
  es: (count) => `${count} ${count > 1 ? "proyectos" : "proyecto"}`,
};

/**
 * Contenu du menu déroulant, lu une seule fois par rendu de page.
 *
 * Le menu est un composant client — il gère l'ouverture et le focus — donc il
 * ne peut pas interroger la base lui-même. Les données sont chargées ici,
 * côté serveur, puis passées en props.
 *
 * Accessoirement, ce menu est aussi du maillage interne : chaque page
 * d'intention reçoit un lien depuis toutes les pages du site. Les villes n'y
 * figurent plus — elles restent liées depuis le pied de page.
 */
export async function getNavData(locale: DbLocale): Promise<NavData> {
  const lang = locale.toLowerCase() as NavLocale;

  const [services, sectors, projects] = await Promise.all([
    getServices(locale),
    getLandings(locale, LandingKind.SECTOR),
    getProjects(locale),
  ]);

  const serviceItems = services.map((service) => ({
    key: service.key,
    entry: {
      slug: service.translations[0].slug,
      pathname: "/services/[slug]" as const,
      title: service.translations[0].title,
      hint: serviceHints[service.key]?.[lang],
      icon: service.icon,
    },
  }));

  const sectorItems = sectors.map((sector) => ({
    key: sector.key,
    entry: {
      slug: sector.translations[0].slug,
      pathname: "/sectors/[slug]" as const,
      title: sectorLabels[sector.key]?.[lang] ?? sector.translations[0].title,
      icon: sector.icon,
      badge: sector._count.projects > 0 ? badgeLabel[lang](sector._count.projects) : undefined,
    },
  }));

  const toWorkEntry = (project: (typeof projects)[number]): NavEntry => ({
    slug: project.translations[0].slug,
    pathname: "/work/[slug]",
    title: project.translations[0].title,
    // La catégorie s'écrit « Marketplace B2B · Fiduciaires » : le métier
    // seul suffit dans le menu.
    hint: project.translations[0].category.split("·").pop()?.trim(),
    icon: project.kind === ProjectKind.WEBAPP ? "LayoutDashboard" : "Globe",
  });

  const platforms = projects.filter((project) => project.kind === ProjectKind.WEBAPP);
  const sites = projects.filter((project) => project.kind !== ProjectKind.WEBAPP);

  const featured = projects.find((project) => project.key === FEATURED_PROJECT);

  return {
    services: groupByKeys(serviceItems, serviceGroups).map((group) => ({
      heading: group.heading[lang],
      entries: group.items.map((item) => item.entry),
    })),
    sectors: groupByKeys(sectorItems, sectorGroups).map((group) => ({
      heading: group.heading[lang],
      entries: group.items.map((item) => item.entry),
    })),
    work: [
      { heading: workGroupHeadings.sites[lang], entries: sites.map(toWorkEntry) },
      { heading: workGroupHeadings.platforms[lang], entries: platforms.map(toWorkEntry) },
    ].filter((group) => group.entries.length > 0),
    feature: featured
      ? {
          slug: featured.translations[0].slug,
          title: featured.translations[0].title,
          category: featured.translations[0].category,
          image: featured.coverImage
            ? {
                // Calculée ici : le SDK Cloudinary ne doit pas partir côté client.
                url: optimized(featured.coverImage.url, { width: 560 }),
                alt:
                  (lang === "fr"
                    ? featured.coverImage.altFr
                    : lang === "en"
                      ? featured.coverImage.altEn
                      : featured.coverImage.altEs) ?? featured.translations[0].title,
              }
            : null,
        }
      : null,
  };
}
