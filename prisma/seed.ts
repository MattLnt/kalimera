import { config as loadEnv } from "dotenv";

import { statSync } from "node:fs";

import { PrismaPg } from "@prisma/adapter-pg";

// Même ordre de priorité que la CLI Prisma : .env.local puis .env.
loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });
import { hash } from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";
import { COVER_SIZE, covers } from "./seed-data/covers";
import { landings } from "./seed-data/landings";
import { obsolete } from "./seed-data/obsolete";
import { posts } from "./seed-data/posts";
import { projects } from "./seed-data/projects";
import { serviceExtras } from "./seed-data/services-extra";
import { services } from "./seed-data/services";
import { Locale } from "../src/generated/prisma/enums";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL manquant : renseignez .env.local avant de lancer le seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

// --------------------------------------------------------------------- seed

async function main() {
  console.log("→ Seed Kalimera");

  // ----- compte administrateur
  const email = (process.env.SEED_ADMIN_EMAIL ?? "hello@kalimera.agency").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password) {
    console.warn(
      "  ! SEED_ADMIN_PASSWORD absent : le compte administrateur n'est pas créé.",
    );
  } else {
    const passwordHash = await hash(password, 12);
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash, name: process.env.SEED_ADMIN_NAME ?? "Kalimera" },
      create: {
        email,
        name: process.env.SEED_ADMIN_NAME ?? "Kalimera",
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log(`  ✓ administrateur : ${email}`);
  }

  // ----- purge des contenus de démonstration
  //
  // Avant d'écrire les vraies réalisations : sinon les deux cohabitent, le
  // seed ne faisant que des `upsert`. Voir prisma/seed-data/obsolete.ts.
  const purged = await Promise.all([
    prisma.project.deleteMany({ where: { key: { in: obsolete.projectKeys } } }),
    prisma.post.deleteMany({ where: { key: { in: obsolete.postKeys } } }),
    prisma.service.deleteMany({ where: { key: { in: obsolete.serviceKeys } } }),
    prisma.testimonial.deleteMany({
      where: { author: { in: obsolete.testimonialAuthors } },
    }),
  ]);
  const removed = purged.reduce((total, result) => total + result.count, 0);
  if (removed > 0) console.log(`  ✓ ${removed} contenus de démonstration supprimés`);

  // ----- services
  for (const [index, service] of services.entries()) {
    const record = await prisma.service.upsert({
      where: { key: service.key },
      update: {
        icon: service.icon,
        stack: [...service.stack],
        position: index,
        published: true,
      },
      create: {
        key: service.key,
        icon: service.icon,
        stack: [...service.stack],
        position: index,
        published: true,
      },
    });

    for (const locale of [Locale.FR, Locale.EN, Locale.ES]) {
      const key = locale.toLowerCase() as "fr" | "en" | "es";
      // Le corps publié combine la description de l'offre et les sections qui
      // répondent aux objections : c'est ce qui donne à la page la longueur
      // utile pour se positionner.
      const body = service.body[key] + (serviceExtras[service.key]?.[key] ?? "");
      await prisma.serviceTranslation.upsert({
        where: { serviceId_locale: { serviceId: record.id, locale } },
        update: {
          slug: service.slug[key],
          title: service.title[key],
          summary: service.summary[key],
          body,
        },
        create: {
          serviceId: record.id,
          locale,
          slug: service.slug[key],
          title: service.title[key],
          summary: service.summary[key],
          body,
        },
      });
    }
  }
  console.log(`  ✓ ${services.length} services`);

  // ----- projets
  for (const [index, project] of projects.entries()) {
    const serviceIds = await prisma.service.findMany({
      where: { key: { in: project.serviceKeys } },
      select: { id: true },
    });

    const record = await prisma.project.upsert({
      where: { key: project.key },
      update: {
        kind: project.kind,
        client: project.client,
        year: project.year,
        liveUrl: project.liveUrl,
        stack: [...project.stack],
        accent: project.accent,
        featured: project.featured,
        position: index,
        published: true,
        services: { set: serviceIds.map((s) => ({ id: s.id })) },
      },
      create: {
        key: project.key,
        kind: project.kind,
        client: project.client,
        year: project.year,
        liveUrl: project.liveUrl,
        stack: [...project.stack],
        accent: project.accent,
        featured: project.featured,
        position: index,
        published: true,
        services: { connect: serviceIds.map((s) => ({ id: s.id })) },
      },
    });

    for (const locale of [Locale.FR, Locale.EN, Locale.ES]) {
      const key = locale.toLowerCase() as "fr" | "en" | "es";
      await prisma.projectTranslation.upsert({
        where: { projectId_locale: { projectId: record.id, locale } },
        update: {
          slug: project.slug[key],
          title: project.title[key],
          category: project.category[key],
          summary: project.summary[key],
          challenge: project.challenge[key],
          solution: project.solution[key],
          outcome: project.outcome[key],
        },
        create: {
          projectId: record.id,
          locale,
          slug: project.slug[key],
          title: project.title[key],
          category: project.category[key],
          summary: project.summary[key],
          challenge: project.challenge[key],
          solution: project.solution[key],
          outcome: project.outcome[key],
        },
      });
    }

    await prisma.projectMetric.deleteMany({ where: { projectId: record.id } });
    await prisma.projectMetric.createMany({
      data: project.metrics.map((metric, position) => ({
        projectId: record.id,
        value: metric.value,
        labelFr: metric.label.fr,
        labelEn: metric.label.en,
        labelEs: metric.label.es,
        position,
      })),
    });
  }
  console.log(`  ✓ ${projects.length} projets`);

  // ----- captures d'écran des réalisations
  //
  // Les fichiers vivent dans public/work : on crée une ligne Media par
  // capture, puis on la rattache au projet. Le poids est lu sur le disque
  // plutôt que codé en dur, pour qu'il reste juste si une image est reprise.
  for (const cover of covers) {
    const project = await prisma.project.findUnique({
      where: { key: cover.projectKey },
      select: { id: true },
    });
    if (!project) continue;

    const url = `/work/${cover.file}`;
    const publicId = `local:work/${cover.file}`;
    const bytes = statSync(`public/work/${cover.file}`).size;

    const data = {
      url,
      width: COVER_SIZE.width,
      height: COVER_SIZE.height,
      format: "jpg",
      bytes,
      altFr: cover.altFr,
      altEn: cover.altEn,
      altEs: cover.altEs,
    };

    const media = await prisma.media.upsert({
      where: { publicId },
      update: data,
      create: { publicId, ...data },
    });

    await prisma.project.update({
      where: { id: project.id },
      data: { coverImageId: media.id },
    });
  }
  console.log(`  ✓ ${covers.length} captures d'écran`);

  // ----- journal
  for (const post of posts) {
    const record = await prisma.post.upsert({
      where: { key: post.key },
      update: {
        category: post.category,
        published: true,
        publishedAt: post.publishedAt,
      },
      create: {
        key: post.key,
        category: post.category,
        published: true,
        publishedAt: post.publishedAt,
      },
    });

    for (const locale of [Locale.FR, Locale.EN, Locale.ES]) {
      const key = locale.toLowerCase() as "fr" | "en" | "es";
      await prisma.postTranslation.upsert({
        where: { postId_locale: { postId: record.id, locale } },
        update: {
          slug: post.slug[key],
          title: post.title[key],
          excerpt: post.excerpt[key],
          body: post.body[key],
          categoryLabel: post.categoryLabel[key],
        },
        create: {
          postId: record.id,
          locale,
          slug: post.slug[key],
          title: post.title[key],
          excerpt: post.excerpt[key],
          body: post.body[key],
          categoryLabel: post.categoryLabel[key],
        },
      });
    }
  }
  console.log(`  ✓ ${posts.length} articles`);

  // ----- pages d'atterrissage
  //
  // Elles sont écrites après les services et les projets : chaque page relie
  // les deux par clé, et la liaison échouerait si les cibles n'existaient pas.
  for (const [index, landing] of landings.entries()) {
    const [serviceIds, projectIds] = await Promise.all([
      prisma.service.findMany({
        where: { key: { in: landing.serviceKeys } },
        select: { id: true },
      }),
      prisma.project.findMany({
        where: { key: { in: landing.projectKeys } },
        select: { id: true },
      }),
    ]);

    const serviceRefs = serviceIds.map((item) => ({ id: item.id }));
    const projectRefs = projectIds.map((item) => ({ id: item.id }));

    const record = await prisma.landing.upsert({
      where: { key: landing.key },
      update: {
        kind: landing.kind,
        icon: landing.icon,
        highlights: [...landing.highlights],
        position: index,
        published: true,
        // `set` remplace la liste existante ; `connect` ne saurait pas retirer
        // une liaison devenue obsolète.
        services: { set: serviceRefs },
        projects: { set: projectRefs },
      },
      create: {
        key: landing.key,
        kind: landing.kind,
        icon: landing.icon,
        highlights: [...landing.highlights],
        position: index,
        published: true,
        services: { connect: serviceRefs },
        projects: { connect: projectRefs },
      },
    });

    for (const locale of [Locale.FR, Locale.EN, Locale.ES]) {
      const key = locale.toLowerCase() as "fr" | "en" | "es";
      await prisma.landingTranslation.upsert({
        where: { landingId_locale: { landingId: record.id, locale } },
        update: {
          slug: landing.slug[key],
          title: landing.title[key],
          lead: landing.lead[key],
          body: landing.body[key],
        },
        create: {
          landingId: record.id,
          locale,
          slug: landing.slug[key],
          title: landing.title[key],
          lead: landing.lead[key],
          body: landing.body[key],
        },
      });
    }

    // Les FAQ sont réécrites en bloc : plus simple et plus sûr qu'un
    // rapprochement par position, qui dérive dès que l'ordre change.
    await prisma.landingFaq.deleteMany({ where: { landingId: record.id } });
    await prisma.landingFaq.createMany({
      data: landing.faqs.map((faq, position) => ({
        landingId: record.id,
        position,
        questionFr: faq.question.fr,
        questionEn: faq.question.en,
        questionEs: faq.question.es,
        answerFr: faq.answer.fr,
        answerEn: faq.answer.en,
        answerEs: faq.answer.es,
      })),
    });
  }
  console.log(`  ✓ ${landings.length} pages d'atterrissage`);

  // ----- témoignages
  //
  // Volontairement vide. Un témoignage inventé est le pire contenu possible
  // sur un site de studio : il est invérifiable, et un prospect qui cherche le
  // client cité ne trouve rien. Les témoignages s'ajoutent depuis
  // l'administration, une fois obtenus par écrit auprès des vrais clients.
  // La section d'accueil ne s'affiche pas tant qu'il n'y en a aucun.

  console.log("→ Terminé.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
