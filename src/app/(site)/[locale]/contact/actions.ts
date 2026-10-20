"use server";

import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { Locale as DbLocale } from "@/generated/prisma/enums";
import { sendEnquiryConfirmation, sendEnquiryNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export type ContactState = {
  status: "idle" | "success" | "error";
  errors?: Partial<Record<"name" | "email" | "subject" | "message" | "consent" | "form", string>>;
};

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().min(1).max(80),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(20).max(5000),
  consent: z.literal("on"),
  locale: z.enum(["fr", "en", "es"]),
  // Champ piège, invisible pour un humain : s'il est rempli, c'est un robot.
  website: z.string().max(0).optional().or(z.literal("")),
});

/**
 * Limitation simple par adresse IP. Le compteur vit en mémoire de l'instance :
 * il freine les envois répétés sans dépendre d'un service externe. Pour une
 * protection stricte multi-instances, il faudrait un store partagé (Redis).
 */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function submitEnquiry(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const locale = (["fr", "en", "es"].includes(raw.locale) ? raw.locale : "fr") as
    | "fr"
    | "en"
    | "es";
  const t = await getTranslations({ locale, namespace: "contact.errors" });

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "name") errors.name = t("name");
      else if (field === "email") errors.email = t("email");
      else if (field === "subject") errors.subject = t("subject");
      else if (field === "message") errors.message = t("message");
      else if (field === "consent") errors.consent = t("consent");
    }
    // Le piège à robots est rempli : on répond "succès" sans rien enregistrer.
    if (parsed.error.issues.some((issue) => issue.path[0] === "website")) {
      return { status: "success" };
    }
    return { status: "error", errors };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return { status: "error", errors: { form: t("rateLimit") } };
  }

  const data = parsed.data;

  try {
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        company: data.company || null,
        phone: data.phone || null,
        subject: data.subject,
        budget: data.budget || null,
        message: data.message,
        locale: locale.toUpperCase() as DbLocale,
      },
    });
  } catch (error) {
    console.error("[contact] enregistrement impossible", error);
    return { status: "error", errors: { form: t("rateLimit") } };
  }

  // La demande est enregistrée : même si un email échoue, elle n'est pas perdue.
  const payload = {
    name: data.name,
    email: data.email,
    company: data.company || null,
    phone: data.phone || null,
    subject: data.subject,
    budget: data.budget || null,
    message: data.message,
    locale,
  };

  await Promise.allSettled([
    sendEnquiryNotification(payload),
    sendEnquiryConfirmation(payload),
  ]);

  return { status: "success" };
}
