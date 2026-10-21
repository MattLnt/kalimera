import "server-only";

import type { Locale as DbLocale, LandingKind } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

/**
 * Toutes les lectures du site public passent par ce fichier. Les pages qui
 * les consomment déclarent `export const revalidate`, et les actions
 * d'administration invalident les chemins concernés après écriture.
 */

const translationForLocale = (locale: DbLocale) => ({
  where: { locale },
  take: 1,
});

// ------------------------------------------------------------------ services

export async function getServices(locale: DbLocale) {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { position: "asc" },
    include: { translations: translationForLocale(locale) },
  });
  return services.filter((service) => service.translations.length > 0);
}

export async function getServiceBySlug(locale: DbLocale, slug: string) {
  const translation = await prisma.serviceTranslation.findUnique({
    where: { locale_slug: { locale, slug } },
    include: {
      service: {
        include: {
          translations: true,
          projects: {
            where: { published: true },
            orderBy: { position: "asc" },
            take: 3,
            include: {
              coverImage: true,
              metrics: { orderBy: { position: "asc" } },
              translations: translationForLocale(locale),
            },
          },
        },
      },
    },
  });

  if (!translation || !translation.service.published) return null;
  return translation;
}

export async function getServiceSlugs() {
  return prisma.serviceTranslation.findMany({
    where: { service: { published: true } },
    select: { locale: true, slug: true, serviceId: true },
  });
}

// ------------------------------------------------------------------ projets

export async function getProjects(locale: DbLocale, limit?: number) {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ position: "asc" }, { year: "desc" }],
    take: limit,
    include: {
      coverImage: true,
      metrics: { orderBy: { position: "asc" } },
      translations: translationForLocale(locale),
    },
  });
  return projects.filter((project) => project.translations.length > 0);
}

export async function getFeaturedProjects(locale: DbLocale, limit = 4) {
  const featured = await prisma.project.findMany({
    where: { published: true, featured: true },
    orderBy: { position: "asc" },
    take: limit,
    include: {
      coverImage: true,
      metrics: { orderBy: { position: "asc" } },
      translations: translationForLocale(locale),
    },
  });

  if (featured.length >= limit) {
    return featured.filter((project) => project.translations.length > 0);
  }
  // Pas assez de projets mis en avant : on complète avec les plus récents.
  const extra = await prisma.project.findMany({
    where: { published: true, id: { notIn: featured.map((p) => p.id) } },
    orderBy: { position: "asc" },
    take: limit - featured.length,
    include: {
      coverImage: true,
      metrics: { orderBy: { position: "asc" } },
      translations: translationForLocale(locale),
    },
  });
  return [...featured, ...extra].filter((p) => p.translations.length > 0);
}

export async function getProjectBySlug(locale: DbLocale, slug: string) {
  const translation = await prisma.projectTranslation.findUnique({
    where: { locale_slug: { locale, slug } },
    include: {
      project: {
        include: {
          coverImage: true,
          gallery: true,
          metrics: { orderBy: { position: "asc" } },
          services: { include: { translations: translationForLocale(locale) } },
          translations: true,
        },
      },
    },
  });

  if (!translation || !translation.project.published) return null;
  return translation;
}

export async function getNextProject(
  locale: DbLocale,
  currentId: string,
  currentPosition: number,
) {
  const next = await prisma.project.findFirst({
    where: { published: true, position: { gt: currentPosition } },
    orderBy: { position: "asc" },
    include: {
      coverImage: true,
      translations: translationForLocale(locale),
    },
  });
  if (next) return next;

  // On boucle sur le premier projet quand on est au bout de la liste.
  return prisma.project.findFirst({
    where: { published: true, id: { not: currentId } },
    orderBy: { position: "asc" },
    include: {
      coverImage: true,
      translations: translationForLocale(locale),
    },
  });
}

export async function getProjectSlugs() {
  return prisma.projectTranslation.findMany({
    where: { project: { published: true } },
    select: { locale: true, slug: true, projectId: true },
  });
}

// ------------------------------------------------------------------ journal

export async function getPosts(locale: DbLocale, limit?: number) {
  const posts = await prisma.post.findMany({
    where: { published: true, publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: {
      coverImage: true,
      translations: translationForLocale(locale),
    },
  });
  return posts.filter((post) => post.translations.length > 0);
}

export async function getPostBySlug(locale: DbLocale, slug: string) {
  const translation = await prisma.postTranslation.findUnique({
    where: { locale_slug: { locale, slug } },
    include: {
      post: { include: { coverImage: true, translations: true } },
    },
  });

  if (!translation || !translation.post.published) return null;
  return translation;
}

export async function getRelatedPosts(
  locale: DbLocale,
  currentId: string,
  limit = 2,
) {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      publishedAt: { lte: new Date() },
      id: { not: currentId },
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: {
      coverImage: true,
      translations: translationForLocale(locale),
    },
  });
  return posts.filter((post) => post.translations.length > 0);
}

export async function getPostSlugs() {
  return prisma.postTranslation.findMany({
    where: { post: { published: true } },
    select: { locale: true, slug: true, postId: true },
  });
}

// ------------------------------------------------------------------ divers

export async function getTestimonial(locale: DbLocale) {
  const testimonial = await prisma.testimonial.findFirst({
    where: { published: true },
    orderBy: { position: "asc" },
    include: {
      avatar: true,
      translations: translationForLocale(locale),
    },
  });
  if (!testimonial || testimonial.translations.length === 0) return null;
  return testimonial;
}

/**
 * Toutes les traductions d'un contenu, pour construire les liens hreflang
 * d'une page de détail (chaque langue ayant son propre slug).
 */
export async function getAlternateSlugs(
  kind: "service" | "project" | "post",
  id: string,
) {
  if (kind === "service") {
    return prisma.serviceTranslation.findMany({
      where: { serviceId: id },
      select: { locale: true, slug: true },
    });
  }
  if (kind === "project") {
    return prisma.projectTranslation.findMany({
      where: { projectId: id },
      select: { locale: true, slug: true },
    });
  }
  return prisma.postTranslation.findMany({
    where: { postId: id },
    select: { locale: true, slug: true },
  });
}

// ------------------------------------------------------- pages d'atterrissage


/**
 * Les pages sectorielles et géographiques. Elles portent les requêtes que les
 * prospects tapent réellement, là où les pages services décrivent une offre.
 */
export async function getLandings(locale: DbLocale, kind: LandingKind) {
  const landings = await prisma.landing.findMany({
    where: { published: true, kind },
    orderBy: { position: "asc" },
    include: {
      translations: translationForLocale(locale),
      // Le nombre de réalisations citées s'affiche sur la carte : c'est le
      // signal de crédibilité qui fait cliquer, plus que le titre.
      _count: { select: { projects: { where: { published: true } } } },
    },
  });
  return landings.filter((landing) => landing.translations.length > 0);
}

export async function getLandingBySlug(
  locale: DbLocale,
  kind: LandingKind,
  slug: string,
) {
  const translation = await prisma.landingTranslation.findUnique({
    where: { locale_slug: { locale, slug } },
    include: {
      landing: {
        include: {
          translations: true,
          faqs: { orderBy: { position: "asc" } },
          services: {
            where: { published: true },
            orderBy: { position: "asc" },
            include: { translations: translationForLocale(locale) },
          },
          projects: {
            where: { published: true },
            orderBy: { position: "asc" },
            include: {
              coverImage: true,
              metrics: { orderBy: { position: "asc" } },
              translations: translationForLocale(locale),
            },
          },
        },
      },
    },
  });

  // Le slug est unique par langue toutes familles confondues : on vérifie le
  // type, sinon /secteurs/aix-en-provence répondrait au lieu de renvoyer 404.
  if (!translation || !translation.landing.published) return null;
  if (translation.landing.kind !== kind) return null;
  return translation;
}

export async function getLandingSlugs(kind?: LandingKind) {
  return prisma.landingTranslation.findMany({
    where: {
      landing: { published: true, ...(kind ? { kind } : {}) },
    },
    select: { locale: true, slug: true, landingId: true },
  });
}
