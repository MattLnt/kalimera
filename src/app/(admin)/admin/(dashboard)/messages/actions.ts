"use server";

import { revalidatePath } from "next/cache";

import { assertAdmin } from "@/lib/admin";
import { linkInboundClient } from "@/lib/crm/intake";
import { prisma } from "@/lib/prisma";

const statuses = ["NEW", "READ", "ARCHIVED"] as const;

function refresh() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin", "layout");
}

/** Change le statut d'une demande (pastille de la boîte de réception). */
export async function setMessageStatus(id: string, status: string) {
  await assertAdmin();
  if (!statuses.includes(status as (typeof statuses)[number])) return;
  await prisma.contactMessage.update({ where: { id }, data: { status: status as (typeof statuses)[number] } });
  refresh();
}

/** Crée (ou retrouve par l'e-mail) la fiche client d'une demande, et l'y rattache. */
export async function createClientFromMessage(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) return;
  const clientId = await linkInboundClient({
    name: message.name,
    email: message.email,
    company: message.company,
    phone: message.phone,
    source: "Formulaire de contact",
    activity: `Demande « ${message.subject} »`,
  });
  if (clientId) {
    await prisma.contactMessage.update({ where: { id }, data: { clientId, status: message.status === "NEW" ? "READ" : message.status } });
  }
  refresh();
}
