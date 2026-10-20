"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { Locale as DbLocale, ProjectKind } from "@/generated/prisma/enums";
import {
  assertAdmin,
  dbLocaleList,
  readBoolean,
  readNumber,
  readOptional,
  readString,
  readTagList,
  revalidateSite,
} from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export type ActionState = { error?: string };

const kinds = ["WEBSITE", "ECOMMERCE", "WEBAPP", "MOBILE", "DESIGN"] as const;

type MetricInput = {
  value: string;
  labelFr: string;
  labelEn: string;
  labelEs: string;
};

function readMetrics(formData: FormData): MetricInput[] {
  const raw = formData.get("metrics");
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is MetricInput =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as MetricInput).value === "string",
      )
      .map((item) => ({
        value: item.value.trim().slice(0, 20),
        labelFr: (item.labelFr ?? "").trim().slice(0, 80),
        labelEn: (item.labelEn ?? "").trim().slice(0, 80),
        labelEs: (item.labelEs ?? "").trim().slice(0, 80),
      }))
      .filter((item) => item.value.length > 0)
      .slice(0, 6);
  } catch {
    return [];
  }
}

function readIdList(formData: FormData, field: string): string[] {
  const raw = formData.get(field);
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export async function saveProject(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();

  const id = readString(formData, "id");
  const titleFr = readString(formData, "FR_title");
  const client = readString(formData, "client");

  if (!titleFr) return { error: "Le titre en français est obligatoire." };
  if (!client) return { error: "Le nom du client est obligatoire." };

  const kindRaw = readString(formData, "kind");
  const kind = (kinds as readonly string[]).includes(kindRaw)
    ? (kindRaw as ProjectKind)
    : ("WEBSITE" as ProjectKind);

  const translations = dbLocaleList.map((locale) => {
    const title = readString(formData, `${locale}_title`);
    return {
      locale: locale as DbLocale,
      title,
      slug: readString(formData, `${locale}_slug`) || slugify(title || titleFr),
      category: readString(formData, `${locale}_category`),
      summary: readString(formData, `${locale}_summary`),
      challenge: readString(formData, `${locale}_challenge`),
      solution: readString(formData, `${locale}_solution`),
      outcome: readString(formData, `${locale}_outcome`),
      seoTitle: readString(formData, `${locale}_seoTitle`) || null,
      seoDescription: readString(formData, `${locale}_seoDescription`) || null,
    };
  });

  for (const translation of translations) {
    if (!translation.title) continue;
    const clash = await prisma.projectTranslation.findUnique({
      where: { locale_slug: { locale: translation.locale, slug: translation.slug } },
      select: { projectId: true },
    });
    if (clash && clash.projectId !== id) {
      return {
        error: `Le lien « ${translation.slug} » est déjà utilisé par un autre projet en ${translation.locale}.`,
      };
    }
  }

  const coverImageId = readOptional(formData, "coverImageId");
  const galleryIds = readIdList(formData, "gallery");
  const serviceIds = readIdList(formData, "services");

  const data = {
    key: readString(formData, "key") || slugify(titleFr),
    kind,
    client,
    year: readNumber(formData, "year", new Date().getFullYear()),
    liveUrl: readOptional(formData, "liveUrl"),
    stack: readTagList(formData, "stack"),
    accent: readString(formData, "accent") || "g1",
    featured: readBoolean(formData, "featured"),
    position: readNumber(formData, "position"),
    published: readBoolean(formData, "published"),
    coverImageId,
    gallery: { set: galleryIds.map((mediaId) => ({ id: mediaId })) },
    services: { set: serviceIds.map((serviceId) => ({ id: serviceId })) },
  };

  const project = id
    ? await prisma.project.update({ where: { id }, data })
    : await prisma.project.create({
        data: {
          ...data,
          gallery: { connect: galleryIds.map((mediaId) => ({ id: mediaId })) },
          services: { connect: serviceIds.map((serviceId) => ({ id: serviceId })) },
        },
      });

  for (const translation of translations) {
    if (!translation.title) continue;
    const { locale, ...rest } = translation;
    await prisma.projectTranslation.upsert({
      where: { projectId_locale: { projectId: project.id, locale } },
      update: rest,
      create: { projectId: project.id, locale, ...rest },
    });
  }

  // Les chiffres clés sont réécrits en bloc : plus simple et plus sûr que
  // de diffuser les ajouts, modifications et suppressions une par une.
  const metrics = readMetrics(formData);
  await prisma.projectMetric.deleteMany({ where: { projectId: project.id } });
  if (metrics.length > 0) {
    await prisma.projectMetric.createMany({
      data: metrics.map((metric, position) => ({
        projectId: project.id,
        ...metric,
        position,
      })),
    });
  }

  revalidatePath("/admin/projects");
  revalidateSite();
  redirect("/admin/projects");
}

export async function toggleProjectPublished(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return;

  await prisma.project.update({
    where: { id },
    data: { published: !project.published },
  });

  revalidatePath("/admin/projects");
  revalidateSite();
}

export async function moveProject(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const direction = readString(formData, "direction");
  if (!id || (direction !== "up" && direction !== "down")) return;

  const all = await prisma.project.findMany({ orderBy: { position: "asc" } });
  const index = all.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= all.length) return;

  [all[index], all[target]] = [all[target], all[index]];
  await prisma.$transaction(
    all.map((item, position) =>
      prisma.project.update({ where: { id: item.id }, data: { position } }),
    ),
  );

  revalidatePath("/admin/projects");
  revalidateSite();
}

export async function deleteProject(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;

  await prisma.project.delete({ where: { id } });

  revalidatePath("/admin/projects");
  revalidateSite();
  redirect("/admin/projects");
}
