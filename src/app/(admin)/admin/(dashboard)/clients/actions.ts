"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ClientStatus } from "@/generated/prisma/enums";
import { assertAdmin, readOptional, readString } from "@/lib/admin";
import { logActivity } from "@/lib/crm/activity";
import { clientStatus } from "@/lib/crm/labels";
import { prisma } from "@/lib/prisma";

export type FormState = { error?: string };

const statuses = Object.keys(clientStatus) as ClientStatus[];

function readClient(formData: FormData) {
  const status = readString(formData, "status") as ClientStatus;
  return {
    name: readString(formData, "name"),
    legalName: readOptional(formData, "legalName"),
    siren: readOptional(formData, "siren"),
    vatNumber: readOptional(formData, "vatNumber"),
    email: readOptional(formData, "email")?.toLowerCase() ?? null,
    phone: readOptional(formData, "phone"),
    website: readOptional(formData, "website"),
    addressLine1: readOptional(formData, "addressLine1"),
    addressLine2: readOptional(formData, "addressLine2"),
    postalCode: readOptional(formData, "postalCode"),
    city: readOptional(formData, "city"),
    country: readOptional(formData, "country") ?? "FR",
    source: readOptional(formData, "source"),
    status: statuses.includes(status) ? status : "LEAD",
    summary: readOptional(formData, "summary"),
    defaultIssuerId: readOptional(formData, "defaultIssuerId"),
    printAddress: formData.get("printAddress") === "on",
  };
}

export async function saveClient(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const id = readString(formData, "id");
  const data = readClient(formData);
  if (data.name.length < 2) return { error: "Indiquez au moins le nom du client." };

  let clientId = id;
  if (id) {
    await prisma.client.update({ where: { id }, data });
    await logActivity("client.updated", "Fiche mise à jour", { clientId: id });
  } else {
    const contactFirst = readOptional(formData, "contactFirstName");
    const client = await prisma.client.create({
      data: {
        ...data,
        contacts: contactFirst
          ? {
              create: {
                firstName: contactFirst,
                lastName: readOptional(formData, "contactLastName"),
                role: readOptional(formData, "contactRole"),
                email: readOptional(formData, "contactEmail")?.toLowerCase() ?? data.email,
                phone: readOptional(formData, "contactPhone") ?? data.phone,
                isPrimary: true,
              },
            }
          : undefined,
      },
    });
    clientId = client.id;
    await logActivity("client.created", "Fiche client créée", { clientId });
  }

  revalidatePath("/admin/clients");
  redirect(`/admin/clients/${clientId}`);
}

export async function setClientStatus(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const status = readString(formData, "status") as ClientStatus;
  if (!id || !statuses.includes(status)) return;
  await prisma.client.update({ where: { id }, data: { status } });
  await logActivity("client.status", `Statut : ${clientStatus[status].label}`, { clientId: id });
  revalidatePath(`/admin/clients/${id}`);
  revalidatePath("/admin/clients");
}

export async function deleteClient(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;
  // Un client avec des devis ou factures émis ne se supprime pas : ces
  // documents doivent rester consultables. On l'archive à la place.
  const documents = await prisma.client.findUnique({
    where: { id },
    select: { _count: { select: { quotes: { where: { number: { not: null } } }, invoices: { where: { number: { not: null } } } } } },
  });
  if (documents && documents._count.quotes + documents._count.invoices > 0) {
    await prisma.client.update({ where: { id }, data: { status: "ARCHIVED" } });
    revalidatePath(`/admin/clients/${id}`);
    return;
  }
  await prisma.$transaction([
    prisma.quote.deleteMany({ where: { clientId: id } }),
    prisma.invoice.deleteMany({ where: { clientId: id } }),
    prisma.client.delete({ where: { id } }),
  ]);
  revalidatePath("/admin/clients");
  redirect("/admin/clients");
}

// ------------------------------------------------------------ contacts

export async function addContact(formData: FormData) {
  await assertAdmin();
  const clientId = readString(formData, "clientId");
  const firstName = readString(formData, "firstName");
  if (!clientId || !firstName) return;
  const isPrimary = (await prisma.clientContact.count({ where: { clientId } })) === 0;
  await prisma.clientContact.create({
    data: {
      clientId,
      firstName,
      lastName: readOptional(formData, "lastName"),
      role: readOptional(formData, "role"),
      email: readOptional(formData, "email")?.toLowerCase() ?? null,
      phone: readOptional(formData, "phone"),
      isPrimary,
    },
  });
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function makePrimaryContact(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const contact = await prisma.clientContact.findUnique({ where: { id } });
  if (!contact) return;
  await prisma.$transaction([
    prisma.clientContact.updateMany({ where: { clientId: contact.clientId }, data: { isPrimary: false } }),
    prisma.clientContact.update({ where: { id }, data: { isPrimary: true } }),
  ]);
  revalidatePath(`/admin/clients/${contact.clientId}`);
}

export async function deleteContact(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const contact = await prisma.clientContact.delete({ where: { id } }).catch(() => null);
  if (contact) revalidatePath(`/admin/clients/${contact.clientId}`);
}
