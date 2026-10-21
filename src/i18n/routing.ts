import { defineRouting } from "next-intl/routing";

export const locales = ["fr", "en", "es"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "fr";

/**
 * Chaque route interne porte un chemin différent par marché : c'est ce qui
 * permet à /fr/projets, /en/work et /es/proyectos de désigner la même page
 * tout en étant indexées séparément.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
  pathnames: {
    "/": "/",
    "/studio": { fr: "/studio", en: "/studio", es: "/estudio" },
    "/services": { fr: "/services", en: "/services", es: "/servicios" },
    "/services/[slug]": {
      fr: "/services/[slug]",
      en: "/services/[slug]",
      es: "/servicios/[slug]",
    },
    "/work": { fr: "/projets", en: "/work", es: "/proyectos" },
    "/work/[slug]": {
      fr: "/projets/[slug]",
      en: "/work/[slug]",
      es: "/proyectos/[slug]",
    },
    /**
     * Pages sectorielles. Le segment porte le mot-clé métier, pas un terme
     * interne : /fr/secteurs/courtage-assurance se lit et s'indexe.
     */
    "/sectors": { fr: "/secteurs", en: "/sectors", es: "/sectores" },
    "/sectors/[slug]": {
      fr: "/secteurs/[slug]",
      en: "/sectors/[slug]",
      es: "/sectores/[slug]",
    },
    /**
     * Pages géographiques. Le segment contient la requête elle-même :
     * /fr/developpement-web/aix-en-provence.
     */
    "/locations": {
      fr: "/developpement-web",
      en: "/web-development",
      es: "/desarrollo-web",
    },
    "/locations/[slug]": {
      fr: "/developpement-web/[slug]",
      en: "/web-development/[slug]",
      es: "/desarrollo-web/[slug]",
    },
    "/journal": { fr: "/journal", en: "/journal", es: "/diario" },
    "/journal/[slug]": {
      fr: "/journal/[slug]",
      en: "/journal/[slug]",
      es: "/diario/[slug]",
    },
    "/contact": { fr: "/contact", en: "/contact", es: "/contacto" },
    "/legal": {
      fr: "/mentions-legales",
      en: "/legal-notice",
      es: "/aviso-legal",
    },
    "/privacy": {
      fr: "/confidentialite",
      en: "/privacy-policy",
      es: "/privacidad",
    },
  },
});

export type AppPathnames = keyof typeof routing.pathnames;
