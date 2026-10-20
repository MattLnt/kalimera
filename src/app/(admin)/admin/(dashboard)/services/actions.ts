"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { Locale as DbLocale } from "@/generated/prisma/enums";
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

/**
 * Crée ou met à jour un service avec ses trois traductions.
 * Le français est obligatoire : il sert de repli quand une langue manque.
 */
export async function saveService(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();

  const id = readString(formData, "id");
  const titleFr = readString(formData, "FR_title");
  if (!titleFr) {
    return { error: "Le titre en français est obligatoire." };
  }

  const key = readString(formData, "key") || slugify(titleFr);
  const icon = readString(formData, "icon") || "Layers";
  const stack = readTagList(formData, "stack");
  const position = readNumber(formData, "position");
  const published = readBoolean(formData, "published");

  // Vérifie les slugs avant d'écrire : la contrainte d'unicité est par langue.
  const translations = dbLocaleList.map((locale) => {
    const title = readString(formData, `${locale}_title`);
    return {
      locale: locale as DbLocale,
      title,
      slug: readString(formData, `${locale}_slug`) || slugify(title || titleFr),
      summary: readString(formData, `${locale}_summary`),
      body: readString(formData, `${locale}_body`),
      seoTitle: readString(formData, `${locale}_seoTitle`) || null,
      seoDescription: readString(formData, `${locale}_seoDescription`) || null,
    };
  });

  for (const translation of translations) {
    if (!translation.title) continue;
    const clash = await prisma.serviceTranslation.findUnique({
      where: { locale_slug: { locale: translation.locale, slug: translation.slug } },
      select: { serviceId: true },
    });
    if (clash && clash.serviceId !== id) {
      return {
        error: `Le lien « ${translation.slug} » est déjà utilisé par un autre service en ${translation.locale}.`,
      };
    }
  }

  const service = id
    ? await prisma.service.update({
        where: { id },
        data: { key, icon, stack, position, published },
      })
    : await prisma.service.create({
        data: { key, icon, stack, position, published },
      });

  for (const translation of translations) {
    // Une langue laissée vide n'est pas enregistrée : le site repliera sur le FR.
    if (!translation.title) continue;
    const { locale, ...rest } = translation;
    await prisma.serviceTranslation.upsert({
      where: { serviceId_locale: { serviceId: service.id, locale } },
      update: rest,
      create: { serviceId: service.id, locale, ...rest },
    });
  }

  revalidatePath("/admin/services");
  revalidateSite();
  redirect("/admin/services");
}

export async function toggleServicePublished(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;

  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return;

  await prisma.service.update({
    where: { id },
    data: { published: !service.published },
  });

  revalidatePath("/admin/services");
  revalidateSite();
}

export async function moveService(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const direction = readString(formData, "direction");
  if (!id || (direction !== "up" && direction !== "down")) return;

  const all = await prisma.service.findMany({ orderBy: { position: "asc" } });
  const index = all.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= all.length) return;

  // Échange les deux positions, puis renumérote tout pour rester compact.
  [all[index], all[target]] = [all[target], all[index]];
  await prisma.$transaction(
    all.map((item, position) =>
      prisma.service.update({ where: { id: item.id }, data: { position } }),
    ),
  );

  revalidatePath("/admin/services");
  revalidateSite();
}

export async function deleteService(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;

  // Les traductions partent en cascade (onDelete: Cascade dans le schéma).
  await prisma.service.delete({ where: { id } });

  revalidatePath("/admin/services");
  revalidateSite();
  redirect("/admin/services");
}
