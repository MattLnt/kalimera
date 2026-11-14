/**
 * Libellés courts du menu, distincts des titres de page.
 *
 * Les titres des pages sectorielles sont écrits pour Google (« Plateformes
 * pour fiduciaires et cabinets comptables ») : affichés tels quels dans un
 * menu, ils étaient tronqués et se ressemblaient tous. Le menu dit donc le
 * métier en deux ou trois mots, et la page garde son titre complet.
 *
 * Une page créée depuis l'administration et absente d'ici s'affiche avec son
 * titre, dans le dernier groupe : rien ne disparaît du menu par oubli.
 */

type Text = { fr: string; en: string; es: string };
export type NavLocale = keyof Text;

const t = (fr: string, en: string, es: string): Text => ({ fr, en, es });

type Group = { heading: Text; keys: string[] };

/** Services, rangés par ce que le client veut obtenir. */
export const serviceGroups: Group[] = [
  {
    heading: t("Sites & e-commerce", "Websites & e-commerce", "Webs y e-commerce"),
    keys: ["sites-sur-mesure", "e-commerce-sur-mesure", "design-ux-ui", "maintenance-performance"],
  },
  {
    heading: t("Applications & plateformes", "Apps & platforms", "Aplicaciones y plataformas"),
    keys: ["applications-web", "applications-mobiles", "plateformes-metier", "saas-abonnement"],
  },
];

/** Une ligne d'explication sous chaque service : ce qu'on obtient, concrètement. */
export const serviceHints: Record<string, Text> = {
  "sites-sur-mesure": t(
    "Vitrine codée, back-office, multilingue",
    "Coded site, back office, multilingual",
    "Web programada, panel, multilingüe",
  ),
  "e-commerce-sur-mesure": t(
    "Boutique, devis, tarifs pro",
    "Store, quotes, trade pricing",
    "Tienda, presupuestos, tarifas pro",
  ),
  "design-ux-ui": t(
    "Maquettes, parcours, design system",
    "Mockups, user flows, design system",
    "Maquetas, recorridos, design system",
  ),
  "maintenance-performance": t(
    "Hébergement, suivi, évolutions",
    "Hosting, monitoring, updates",
    "Alojamiento, supervisión, evoluciones",
  ),
  "applications-web": t(
    "Outils métier, espaces clients",
    "Business tools, client portals",
    "Herramientas de gestión, áreas de cliente",
  ),
  "applications-mobiles": t(
    "iOS & Android, une seule base",
    "iOS & Android, one codebase",
    "iOS y Android, un solo código",
  ),
  "plateformes-metier": t(
    "Marketplaces, mises en relation",
    "Marketplaces, matchmaking",
    "Marketplaces, intermediación",
  ),
  "saas-abonnement": t(
    "Comptes, abonnements, paiements",
    "Accounts, subscriptions, payments",
    "Cuentas, suscripciones, pagos",
  ),
};

/** Secteurs : professions réglementées et B2B d'un côté, proximité de l'autre. */
export const sectorGroups: Group[] = [
  {
    heading: t("Professions & B2B", "Professions & B2B", "Profesiones y B2B"),
    keys: [
      "courtage-assurance",
      "fiduciaires-comptabilite",
      "avocats-droit",
      "immobilier",
      "recrutement-rh",
      "commerce-b2b",
    ],
  },
  {
    heading: t("Commerces & services", "Local businesses", "Comercios y servicios"),
    keys: [
      "hotellerie-restauration",
      "gestion-locative",
      "sante",
      "coaching-sportif",
      "automobile",
      "services-locaux",
    ],
  },
];

export const sectorLabels: Record<string, Text> = {
  "courtage-assurance": t("Courtage en assurance", "Insurance broking", "Corretaje de seguros"),
  "fiduciaires-comptabilite": t("Fiduciaires & comptables", "Accountancy firms", "Asesorías contables"),
  "avocats-droit": t("Cabinets d'avocats", "Law firms", "Despachos de abogados"),
  immobilier: t("Immobilier & promotion", "Real estate", "Inmobiliaria"),
  "recrutement-rh": t("Recrutement & RH", "Recruitment & HR", "Selección y RR. HH."),
  "commerce-b2b": t("Commerce B2B & négoce", "B2B commerce", "Comercio B2B"),
  "hotellerie-restauration": t("Hôtellerie & restauration", "Hotels & restaurants", "Hostelería y restauración"),
  "gestion-locative": t("Location & conciergerie", "Rentals & concierge", "Alquileres y conserjería"),
  sante: t("Santé & cabinets", "Healthcare", "Salud"),
  "coaching-sportif": t("Sport & coaching", "Fitness & coaching", "Deporte y coaching"),
  automobile: t("Automobile", "Automotive", "Automoción"),
  "services-locaux": t("Artisans & services locaux", "Trades & local services", "Oficios y servicios locales"),
};

/** Réalisations : plateformes d'un côté, sites et boutiques de l'autre. */
export const workGroupHeadings = {
  sites: t("Sites & e-commerce", "Websites & e-commerce", "Webs y e-commerce"),
  platforms: t("Plateformes & SaaS", "Platforms & SaaS", "Plataformas y SaaS"),
};

/**
 * Range des entrées selon des groupes, dans l'ordre des groupes. Les clés
 * inconnues des groupes rejoignent le dernier, dans l'ordre d'origine.
 */
export function groupByKeys<T extends { key: string }>(items: T[], groups: Group[]) {
  const known = new Set(groups.flatMap((group) => group.keys));
  return groups.map((group, index) => {
    const listed = group.keys
      .map((key) => items.find((item) => item.key === key))
      .filter((item): item is T => item !== undefined);
    const extra =
      index === groups.length - 1 ? items.filter((item) => !known.has(item.key)) : [];
    return { heading: group.heading, items: [...listed, ...extra] };
  });
}
