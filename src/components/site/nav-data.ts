import "server-only";

import { LandingKind, type Locale as DbLocale } from "@/generated/prisma/enums";
import { getLandings, getServices } from "@/lib/content";

export type NavEntry = {
  slug: string;
  title: string;
  summary: string;
  icon: string;
};

export type NavData = {
  services: NavEntry[];
  sectors: NavEntry[];
  locations: NavEntry[];
};

/**
 * Contenu du menu déroulant, lu une seule fois par rendu de page.
 *
 * Le menu est un composant client — il gère l'ouverture et le focus — donc il
 * ne peut pas interroger la base lui-même. Les données sont chargées ici,
 * côté serveur, puis passées en props.
 *
 * Accessoirement, ce menu est aussi du maillage interne : chaque page
 * d'intention reçoit un lien depuis toutes les pages du site.
 */
export async function getNavData(locale: DbLocale): Promise<NavData> {
  const [services, sectors, locations] = await Promise.all([
    getServices(locale),
    getLandings(locale, LandingKind.SECTOR),
    getLandings(locale, LandingKind.LOCATION),
  ]);

  return {
    services: services.map((service) => ({
      slug: service.translations[0].slug,
      title: service.translations[0].title,
      summary: service.translations[0].summary,
      icon: service.icon,
    })),
    sectors: sectors.map((sector) => ({
      slug: sector.translations[0].slug,
      title: sector.translations[0].title,
      summary: sector.translations[0].lead,
      icon: sector.icon,
    })),
    locations: locations.map((location) => ({
      slug: location.translations[0].slug,
      title: location.translations[0].title,
      summary: location.translations[0].lead,
      icon: location.icon,
    })),
  };
}
