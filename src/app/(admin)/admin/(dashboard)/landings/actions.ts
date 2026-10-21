"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { LandingKind, type Locale as DbLocale } from "@/generated/prisma/enums";
import {
  assertAdmin,
  dbLocaleList,
  readBoolean,
  readNumber,
  readString,
  readTagList,
  revalidateSite,
} from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export type ActionState = { error?: string };

type FaqInput = {
  questionFr: string;
  answerFr: string;
  questionEn: string;
  answerEn: string;
  questionEs: string;
  answerEs: string;
};

/** Les questions arrivent en JSON depuis l'éditeur client. */
function readFaqs(formData: FormData): FaqInput[] {
  const raw = formData.get("faqs");
  if (typeof raw !== "string" || !raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is FaqInput =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as FaqInput).questionFr === "string" &&
          typeof (item as FaqInput).answerFr === "string",
      )
      .map((item) => ({
        questionFr: item.questionFr.trim().slice(0, 300),
        answerFr: item.answerFr.trim().slice(0, 2000),
        questionEn: (item.questionEn ?? "").trim().slice(0, 300),
        answerEn: (item.answerEn ?? "").trim().slice(0, 2000),
        questionEs: (item.questionEs ?? "").trim().slice(0, 300),
        answerEs: (item.answerEs ?? "").trim().slice(0, 2000),
      }))
      .filter((item) => item.questionFr && item.answerFr);
  } catch {
    return [];
  }
}

/** Liste d'identifiants transmise en JSON par les cases à cocher. */
function readIdList(formData: FormData, field: string): string[] {
  const raw = formData.get(field);
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

/**
 * Crée ou met à jour une page sectorielle ou géographique.
 * Le français est obligatoire : il sert de repli quand une langue manque.
 */
export async function saveLanding(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();

  const id = readString(formData, "id");
  const titleFr = readString(formData, "FR_title");
  if (!titleFr) {
    return { error: "Le titre en français est obligatoire." };
  }

  const kindRaw = readString(formData, "kind");
  const kind =
    kindRaw === LandingKind.LOCATION ? LandingKind.LOCATION : LandingKind.SECTOR;

  const key = readString(formData, "key") || slugify(titleFr);
  const icon = readString(formData, "icon") || "Layers";
  const highlights = readTagList(formData, "highlights");
  const position = readNumber(formData, "position");
  const published = readBoolean(formData, "published");
  const serviceIds = readIdList(formData, "services");
  const projectIds = readIdList(formData, "projects");
  const faqs = readFaqs(formData);

  const translations = dbLocaleList.map((locale) => {
    const title = readString(formData, `${locale}_title`);
    return {
      locale: locale as DbLocale,
      title,
      slug: readString(formData, `${locale}_slug`) || slugify(title || titleFr),
      lead: readString(formData, `${locale}_lead`),
      body: readString(formData, `${locale}_body`),
      seoTitle: readString(formData, `${locale}_seoTitle`) || null,
      seoDescription: readString(formData, `${locale}_seoDescription`) || null,
    };
  });

  // Le slug est unique par langue, toutes familles confondues : une page
  // sectorielle et une page ville ne peuvent pas partager le même lien.
  for (const translation of translations) {
    if (!translation.title) continue;
    const clash = await prisma.landingTranslation.findUnique({
      where: { locale_slug: { locale: translation.locale, slug: translation.slug } },
      select: { landingId: true },
    });
    if (clash && clash.landingId !== id) {
      return {
        error: `Le lien « ${translation.slug} » est déjà utilisé par une autre page en ${translation.locale}.`,
      };
    }
  }

  const serviceRefs = serviceIds.map((serviceId) => ({ id: serviceId }));
  const projectRefs = projectIds.map((projectId) => ({ id: projectId }));

  const landing = id
    ? await prisma.landing.update({
        where: { id },
        data: {
          kind,
          key,
          icon,
          highlights,
          position,
          published,
          services: { set: serviceRefs },
          projects: { set: projectRefs },
        },
      })
    : await prisma.landing.create({
        data: {
          kind,
          key,
          icon,
          highlights,
          position,
          published,
          services: { connect: serviceRefs },
          projects: { connect: projectRefs },
        },
      });

  for (const translation of translations) {
    // Une langue laissée vide n'est pas enregistrée : le site repliera sur le FR.
    if (!translation.title) continue;
    const { locale, ...rest } = translation;
    await prisma.landingTranslation.upsert({
      where: { landingId_locale: { landingId: landing.id, locale } },
      update: rest,
      create: { landingId: landing.id, locale, ...rest },
    });
  }

  // Réécriture en bloc : plus sûr qu'un rapprochement par position, qui
  // dérive dès qu'une question est insérée au milieu.
  await prisma.landingFaq.deleteMany({ where: { landingId: landing.id } });
  if (faqs.length > 0) {
    await prisma.landingFaq.createMany({
      data: faqs.map((faq, position) => ({ landingId: landing.id, position, ...faq })),
    });
  }

  revalidatePath("/admin/landings");
  revalidateSite();
  redirect("/admin/landings");
}

export async function toggleLandingPublished(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;

  const landing = await prisma.landing.findUnique({ where: { id } });
  if (!landing) return;

  await prisma.landing.update({
    where: { id },
    data: { published: !landing.published },
  });

  revalidatePath("/admin/landings");
  revalidateSite();
}

export async function moveLanding(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const direction = readString(formData, "direction");
  if (!id || (direction !== "up" && direction !== "down")) return;

  const current = await prisma.landing.findUnique({ where: { id } });
  if (!current) return;

  // Le classement est propre à chaque famille : on ne mélange pas les
  // secteurs et les villes dans un même ordre.
  const all = await prisma.landing.findMany({
    where: { kind: current.kind },
    orderBy: { position: "asc" },
  });
  const index = all.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= all.length) return;

  [all[index], all[target]] = [all[target], all[index]];
  await prisma.$transaction(
    all.map((item, position) =>
      prisma.landing.update({ where: { id: item.id }, data: { position } }),
    ),
  );

  revalidatePath("/admin/landings");
  revalidateSite();
}

export async function deleteLanding(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;

  // Traductions et questions partent en cascade (onDelete: Cascade).
  await prisma.landing.delete({ where: { id } });

  revalidatePath("/admin/landings");
  revalidateSite();
  redirect("/admin/landings");
}
