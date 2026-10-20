import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const cloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export const CLOUDINARY_FOLDER = "kalimera";

/**
 * Les fichiers sont envoyés directement du navigateur vers Cloudinary : le
 * serveur ne fait que signer la requête, ce qui évite de faire transiter les
 * images par une fonction Vercel (limite de taille et temps d'exécution).
 */
export function signUpload(params: Record<string, string | number>) {
  if (!cloudinaryConfigured) {
    throw new Error("Cloudinary n'est pas configuré (variables manquantes).");
  }
  const timestamp = Math.round(Date.now() / 1000);
  const toSign = { ...params, timestamp };
  const signature = cloudinary.utils.api_sign_request(
    toSign,
    apiSecret as string,
  );
  return { signature, timestamp, apiKey: apiKey as string, cloudName: cloudName as string };
}

export async function deleteAsset(publicId: string) {
  if (!cloudinaryConfigured) return;
  await cloudinary.uploader.destroy(publicId, { invalidate: true });
}

/** URL optimisée : format et qualité choisis automatiquement par Cloudinary. */
export function optimized(
  url: string,
  opts: { width?: number; height?: number } = {},
) {
  if (!url.includes("/upload/")) return url;
  const parts = ["f_auto", "q_auto"];
  if (opts.width) parts.push(`w_${opts.width}`);
  if (opts.height) parts.push(`h_${opts.height}`, "c_fill");
  return url.replace("/upload/", `/upload/${parts.join(",")}/`);
}
