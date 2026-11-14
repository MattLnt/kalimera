"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertAdmin, readOptional, readString } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export type IssuerState = { error?: string; saved?: boolean };

export async function saveIssuer(_prev: IssuerState, formData: FormData): Promise<IssuerState> {
  await assertAdmin();
  const id = readString(formData, "id");
  const label = readString(formData, "label");
  const name = readString(formData, "name");
  if (!label || !name) return { error: "Le nom affiché et le nom imprimé sont obligatoires." };

  const deposit = Number(readString(formData, "depositPercent"));
  const validity = Number(readString(formData, "quoteValidityDays"));
  const currency = readString(formData, "currency");

  const data = {
    label,
    name,
    headerLines: readString(formData, "headerLines"),
    footer: readString(formData, "footer"),
    email: readOptional(formData, "email"),
    phone: readOptional(formData, "phone"),
    website: readOptional(formData, "website"),
    vatMention: readOptional(formData, "vatMention"),
    paymentTerms: readOptional(formData, "paymentTerms"),
    latePenalty: readOptional(formData, "latePenalty"),
    recoveryFee: readOptional(formData, "recoveryFee"),
    currency: currency === "USD" ? "USD" : "EUR",
    bankHolder: readOptional(formData, "bankHolder"),
    bankName: readOptional(formData, "bankName"),
    iban: readOptional(formData, "iban")?.toUpperCase() ?? null,
    bic: readOptional(formData, "bic")?.toUpperCase() ?? null,
    depositPercent: Number.isFinite(deposit) ? Math.min(100, Math.max(0, Math.round(deposit))) : 50,
    quoteValidityDays: Number.isFinite(validity) && validity > 0 ? Math.round(validity) : 30,
    invoicePrefix: (readOptional(formData, "invoicePrefix") ?? "FAC").toUpperCase().replace(/[^A-Z]/g, "") || "FAC",
    quotePrefix: (readOptional(formData, "quotePrefix") ?? "DEV").toUpperCase().replace(/[^A-Z]/g, "") || "DEV",
  };

  if (id) await prisma.issuer.update({ where: { id }, data });
  else {
    const count = await prisma.issuer.count();
    await prisma.issuer.create({ data: { ...data, position: count } });
  }
  revalidatePath("/admin/settings/issuers");
  redirect("/admin/settings/issuers");
}

export async function toggleIssuerArchive(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const issuer = await prisma.issuer.findUnique({ where: { id } });
  if (!issuer) return;
  await prisma.issuer.update({ where: { id }, data: { archived: !issuer.archived } });
  revalidatePath("/admin/settings/issuers");
}
