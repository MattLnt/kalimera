"use server";

import { revalidatePath } from "next/cache";

import { assertAdmin, readString, revalidateSite } from "@/lib/admin";
import { deleteAsset } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

/** Enregistre en base un fichier déjà envoyé à Cloudinary par le navigateur. */
export async function registerMedia(asset: {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}) {
  await assertAdmin();

  const media = await prisma.media.upsert({
    where: { publicId: asset.publicId },
    update: { url: asset.url, width: asset.width, height: asset.height },
    create: asset,
  });

  revalidatePath("/admin/media");
  return {
    id: media.id,
    url: media.url,
    width: media.width,
    height: media.height,
  };
}

export async function updateMediaAlt(formData: FormData) {
  await assertAdmin();

  const id = readString(formData, "id");
  if (!id) return;

  await prisma.media.update({
    where: { id },
    data: {
      altFr: readString(formData, "altFr"),
      altEn: readString(formData, "altEn"),
      altEs: readString(formData, "altEs"),
    },
  });

  revalidatePath("/admin/media");
  revalidateSite();
}

export async function deleteMedia(formData: FormData) {
  await assertAdmin();

  const id = readString(formData, "id");
  if (!id) return;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return;

  // La base d'abord : si Cloudinary échoue, on ne garde pas une référence morte.
  await prisma.media.delete({ where: { id } });
  try {
    await deleteAsset(media.publicId);
  } catch (error) {
    console.error("[media] suppression Cloudinary échouée", error);
  }

  revalidatePath("/admin/media");
  revalidateSite();
}
