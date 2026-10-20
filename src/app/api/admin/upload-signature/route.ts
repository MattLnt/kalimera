import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { CLOUDINARY_FOLDER, cloudinaryConfigured, signUpload } from "@/lib/cloudinary";

export const runtime = "nodejs";

/**
 * Renvoie une signature à usage unique permettant au navigateur d'envoyer
 * un fichier directement à Cloudinary. Réservé aux administrateurs connectés.
 */
export async function POST() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!cloudinaryConfigured) {
    return NextResponse.json(
      { error: "Cloudinary n'est pas configuré sur ce déploiement." },
      { status: 503 },
    );
  }

  const { signature, timestamp, apiKey, cloudName } = signUpload({
    folder: CLOUDINARY_FOLDER,
  });

  return NextResponse.json({
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder: CLOUDINARY_FOLDER,
  });
}
