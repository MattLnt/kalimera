"use client";

import { registerMedia } from "@/app/(admin)/admin/(dashboard)/media/actions";

export type UploadedMedia = {
  id: string;
  url: string;
  width: number;
  height: number;
};

/**
 * Envoi d'un fichier vers Cloudinary depuis le navigateur, avec une signature
 * éphémère fournie par le serveur, puis enregistrement de la référence en base.
 */
export async function uploadToCloudinary(file: File): Promise<UploadedMedia> {
  const signatureResponse = await fetch("/api/admin/upload-signature", {
    method: "POST",
  });
  if (!signatureResponse.ok) {
    throw new Error("Signature refusée. Vérifiez la configuration Cloudinary.");
  }

  const { signature, timestamp, apiKey, cloudName, folder } =
    await signatureResponse.json();

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  body.append("folder", folder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body },
  );
  if (!uploadResponse.ok) throw new Error("L'envoi à Cloudinary a échoué.");

  const asset = await uploadResponse.json();

  return registerMedia({
    publicId: asset.public_id,
    url: asset.secure_url,
    width: asset.width,
    height: asset.height,
    format: asset.format,
    bytes: asset.bytes,
  });
}

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
