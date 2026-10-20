"use server";

import { compare, hash } from "bcryptjs";

import { assertAdmin, readString } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export type SettingsState = { error?: string; success?: string };

export async function changePassword(
  _previous: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const session = await assertAdmin();

  const current = readString(formData, "currentPassword");
  const next = readString(formData, "newPassword");
  const confirm = readString(formData, "confirmPassword");

  if (next.length < 12) {
    return { error: "Le nouveau mot de passe doit faire au moins 12 caractères." };
  }
  if (next !== confirm) {
    return { error: "Les deux nouveaux mots de passe ne correspondent pas." };
  }

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return { error: "Compte introuvable." };

  const valid = await compare(current, user.passwordHash);
  if (!valid) return { error: "Le mot de passe actuel est incorrect." };

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hash(next, 12) },
  });

  return { success: "Mot de passe modifié." };
}

export async function updateProfile(
  _previous: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const session = await assertAdmin();

  const name = readString(formData, "name");
  const email = readString(formData, "email").toLowerCase();

  if (!name) return { error: "Le nom est obligatoire." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: "L'adresse email n'est pas valide." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== session.id) {
    return { error: "Cette adresse est déjà utilisée par un autre compte." };
  }

  await prisma.user.update({
    where: { id: session.id },
    data: { name, email },
  });

  return {
    success:
      "Profil mis à jour. Reconnectez-vous si vous avez changé d'adresse email.",
  };
}
