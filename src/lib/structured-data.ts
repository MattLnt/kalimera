/**
 * Données structurées schema.org.
 *
 * Trois entités distinctes, volontairement :
 * - `Organization` porte l'identité de marque et les profils sociaux ;
 * - `ProfessionalService` porte l'établissement d'Aix et les zones servies,
 *   c'est l'entité que Google rapproche de la fiche Business Profile ;
 * - `WebSite` déclare la recherche interne et la langue.
 *
 * L'identifiant `@id` est stable et partagé : il permet à Google de relier les
 * entités entre elles plutôt que d'en déduire plusieurs organisations.
 */

import { siteConfig } from "@/lib/site";

type Json = Record<string, unknown>;

export const organizationId = (base: string) => `${base}/#organization`;
export const websiteId = (base: string) => `${base}/#website`;

/** Marché servi, au format attendu par schema.org. */
const areaServed = siteConfig.markets.map((market) => ({
  "@type": "Country",
  name: market.label,
}));

export function organizationSchema(base: string, description: string): Json {
  return {
    "@type": "Organization",
    "@id": organizationId(base),
    name: siteConfig.name,
    url: base,
    description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    logo: `${base}/icon.png`,
    image: `${base}/opengraph-image.png`,
    areaServed,
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.instagram,
    ],
  };
}

/**
 * L'établissement physique. `ProfessionalService` est un sous-type de
 * `LocalBusiness` : il est mieux adapté qu'un commerce de détail et reste
 * reconnu pour le référencement local.
 */
export function localBusinessSchema(base: string, description: string): Json {
  const { address, openingHours } = siteConfig;

  return {
    "@type": "ProfessionalService",
    "@id": `${base}/#localbusiness`,
    name: siteConfig.name,
    url: base,
    description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    image: `${base}/opengraph-image.png`,
    parentOrganization: { "@id": organizationId(base) },
    address: {
      "@type": "PostalAddress",
      ...(address.street ? { streetAddress: address.street } : {}),
      postalCode: address.postalCode,
      addressLocality: address.city,
      addressRegion: address.region,
      addressCountry: address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: address.latitude,
      longitude: address.longitude,
    },
    areaServed,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: openingHours.days,
        opens: openingHours.opens,
        closes: openingHours.closes,
      },
    ],
    priceRange: "€€€",
  };
}

export function websiteSchema(base: string, locale: string, name: string): Json {
  return {
    "@type": "WebSite",
    "@id": websiteId(base),
    url: base,
    name,
    inLanguage: locale,
    publisher: { "@id": organizationId(base) },
  };
}

/** Fil d'Ariane. Google l'affiche à la place de l'URL dans les résultats. */
export function breadcrumbSchema(items: { name: string; url: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serviceSchema(
  base: string,
  service: { name: string; description: string; url: string },
): Json {
  return {
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: service.url,
    serviceType: service.name,
    provider: { "@id": organizationId(base) },
    areaServed,
  };
}

/** Questions fréquentes. Éligible au bloc déroulant dans les résultats Google. */
export function faqSchema(items: { question: string; answer: string }[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function creativeWorkSchema(
  base: string,
  project: {
    name: string;
    description: string;
    url: string;
    liveUrl?: string | null;
    year: number;
    client: string;
  },
): Json {
  return {
    "@type": "CreativeWork",
    name: project.name,
    description: project.description,
    url: project.url,
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
    dateCreated: String(project.year),
    creator: { "@id": organizationId(base) },
    about: { "@type": "Organization", name: project.client },
  };
}

/**
 * Regroupe plusieurs entités dans un seul `@graph`. Un graphe unique est
 * préférable à plusieurs balises : les `@id` y résolvent correctement.
 */
export function graph(...entities: Json[]): Json {
  return { "@context": "https://schema.org", "@graph": entities };
}
