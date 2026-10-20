"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { Locale as DbLocale } from "@/generated/prisma/enums";
import {
  assertAdmin,
  dbLocaleList,
  readBoolean,
  readOptional,
  readString,
  revalidateSite,
} from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export type ActionState = { error?: string };

export async function savePost(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();

  const id = readString(formData, "id");
  const titleFr = readString(formData, "FR_title");
  if (!titleFr) return { error: "Le titre en français est obligatoire." };

  const translations = dbLocaleList.map((locale) => {
    const title = readString(formData, `${locale}_title`);
    return {
      locale: locale as DbLocale,
      title,
      slug: readString(formData, `${locale}_slug`) || slugify(title || titleFr),
      excerpt: readString(formData, `${locale}_excerpt`),
      body: readString(formData, `${locale}_body`),
      categoryLabel: readString(formData, `${locale}_categoryLabel`),
      seoTitle: readString(formData, `${locale}_seoTitle`) || null,
      seoDescription: readString(formData, `${locale}_seoDescription`) || null,
    };
  });

  for (const translation of translations) {
    if (!translation.title) continue;
    const clash = await prisma.postTranslation.findUnique({
      where: { locale_slug: { locale: translation.locale, slug: translation.slug } },
      select: { postId: true },
    });
    if (clash && clash.postId !== id) {
      return {
        error: `Le lien « ${translation.slug} » est déjà utilisé par un autre article en ${translation.locale}.`,
      };
    }
  }

  const publishedAtRaw = readString(formData, "publishedAt");
  const published = readBoolean(formData, "published");

  const data = {
    key: readString(formData, "key") || slugify(titleFr),
    category: readString(formData, "category") || "engineering",
    published,
    // Un article publié sans date prend la date du jour.
    publishedAt: publishedAtRaw
      ? new Date(publishedAtRaw)
      : published
        ? new Date()
        : null,
    coverImageId: readOptional(formData, "coverImageId"),
  };

  const post = id
    ? await prisma.post.update({ where: { id }, data })
    : await prisma.post.create({ data });

  for (const translation of translations) {
    if (!translation.title) continue;
    const { locale, ...rest } = translation;
    await prisma.postTranslation.upsert({
      where: { postId_locale: { postId: post.id, locale } },
      update: rest,
      create: { postId: post.id, locale, ...rest },
    });
  }

  revalidatePath("/admin/posts");
  revalidateSite();
  redirect("/admin/posts");
}

export async function togglePostPublished(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return;

  const published = !post.published;
  await prisma.post.update({
    where: { id },
    data: {
      published,
      publishedAt: published && !post.publishedAt ? new Date() : post.publishedAt,
    },
  });

  revalidatePath("/admin/posts");
  revalidateSite();
}

export async function deletePost(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;

  await prisma.post.delete({ where: { id } });

  revalidatePath("/admin/posts");
  revalidateSite();
  redirect("/admin/posts");
}
