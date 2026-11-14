"use server";

import { revalidatePath } from "next/cache";

import type { ClientStatus, DealStage, TaskPriority, TaskStatus } from "@/generated/prisma/enums";
import { assertAdmin } from "@/lib/admin";
import { logActivity } from "@/lib/crm/activity";
import { fromDateInput } from "@/lib/crm/format";
import { clientStatusOptions, dealStageOptions, taskPriorityOptions, taskStatusOptions } from "@/lib/crm/vivid";
import { prisma } from "@/lib/prisma";

/**
 * Modifications faites directement dans les tableaux du CRM. Chaque champ
 * modifiable est listé et sa valeur contrôlée : rien d'autre ne passe.
 */

type Result = { ok: true } | { ok: false; error: string };

const values = (options: { value: string }[]) => options.map((option) => option.value);

function text(value: unknown, max = 300) {
  const clean = String(value ?? "").trim().slice(0, max);
  return clean.length ? clean : null;
}

function cents(value: unknown) {
  if (value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : null;
}

function refreshCrm() {
  revalidatePath("/admin", "layout");
}

// ------------------------------------------------------------------ projets

export async function updateDealField(id: string, field: string, value: unknown): Promise<Result> {
  await assertAdmin();
  const deal = await prisma.deal.findUnique({ where: { id } });
  if (!deal) return { ok: false, error: "Projet introuvable." };

  let data: Record<string, unknown>;
  switch (field) {
    case "title": {
      const title = text(value);
      if (!title) return { ok: false, error: "Le nom ne peut pas être vide." };
      data = { title };
      break;
    }
    case "stage": {
      if (!values(dealStageOptions).includes(String(value))) return { ok: false, error: "Étape inconnue." };
      data = { stage: value as DealStage, deliveredAt: value === "DELIVERED" ? (deal.deliveredAt ?? new Date()) : deal.deliveredAt };
      break;
    }
    case "amountCents":
      data = { amountCents: cents(value) };
      break;
    case "probability": {
      const p = cents(value);
      data = { probability: p === null ? null : Math.min(100, Math.max(0, p)) };
      break;
    }
    case "startDate":
    case "dueDate":
      data = { [field]: fromDateInput(text(value)) };
      break;
    default:
      return { ok: false, error: "Champ non modifiable." };
  }

  await prisma.deal.update({ where: { id }, data });
  if (field === "stage" && value !== deal.stage) {
    const label = dealStageOptions.find((option) => option.value === value)?.label ?? String(value);
    await logActivity("deal.stage", `« ${deal.title} » : ${label}`, { clientId: deal.clientId, dealId: id });
    if (["WON", "IN_PROGRESS", "REVIEW"].includes(String(value))) {
      await prisma.client.updateMany({ where: { id: deal.clientId, status: { in: ["LEAD", "PROSPECT", "PAST"] } }, data: { status: "ACTIVE" } });
    }
  }
  refreshCrm();
  return { ok: true };
}

export async function createDealQuick(title: string, stage: string, clientId: string): Promise<Result & { id?: string }> {
  await assertAdmin();
  const name = text(title);
  if (!name) return { ok: false, error: "Donnez un nom au projet." };
  if (!clientId) return { ok: false, error: "Choisissez le client." };
  if (!values(dealStageOptions).includes(stage)) return { ok: false, error: "Étape inconnue." };
  const deal = await prisma.deal.create({ data: { title: name, stage: stage as DealStage, clientId } });
  await logActivity("deal.created", `Projet créé : « ${name} »`, { clientId, dealId: deal.id });
  refreshCrm();
  return { ok: true, id: deal.id };
}

// ------------------------------------------------------------------ tâches

export async function updateTaskField(id: string, field: string, value: unknown): Promise<Result> {
  await assertAdmin();
  let data: Record<string, unknown>;
  switch (field) {
    case "title": {
      const title = text(value);
      if (!title) return { ok: false, error: "Le titre ne peut pas être vide." };
      data = { title };
      break;
    }
    case "status":
      if (!values(taskStatusOptions).includes(String(value))) return { ok: false, error: "Statut inconnu." };
      data = { status: value as TaskStatus, completedAt: value === "DONE" ? new Date() : null };
      break;
    case "priority":
      if (!values(taskPriorityOptions).includes(String(value))) return { ok: false, error: "Priorité inconnue." };
      data = { priority: value as TaskPriority };
      break;
    case "dueAt":
      data = { dueAt: fromDateInput(text(value)) };
      break;
    case "clientId":
      data = { clientId: text(value) };
      break;
    default:
      return { ok: false, error: "Champ non modifiable." };
  }
  await prisma.task.update({ where: { id }, data });
  refreshCrm();
  return { ok: true };
}

export async function createTaskQuick(title: string, status: string): Promise<Result & { id?: string }> {
  await assertAdmin();
  const name = text(title);
  if (!name) return { ok: false, error: "Donnez un titre à la tâche." };
  if (!values(taskStatusOptions).includes(status)) return { ok: false, error: "Statut inconnu." };
  const task = await prisma.task.create({ data: { title: name, status: status as TaskStatus } });
  refreshCrm();
  return { ok: true, id: task.id };
}

export async function deleteTaskQuick(id: string): Promise<Result> {
  await assertAdmin();
  await prisma.task.delete({ where: { id } }).catch(() => null);
  refreshCrm();
  return { ok: true };
}

// ------------------------------------------------------------------ clients

export async function updateClientField(id: string, field: string, value: unknown): Promise<Result> {
  await assertAdmin();
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) return { ok: false, error: "Client introuvable." };
  let data: Record<string, unknown>;
  switch (field) {
    case "name": {
      const name = text(value);
      if (!name) return { ok: false, error: "Le nom ne peut pas être vide." };
      data = { name };
      break;
    }
    case "status":
      if (!values(clientStatusOptions).includes(String(value))) return { ok: false, error: "Statut inconnu." };
      data = { status: value as ClientStatus };
      break;
    case "email":
      data = { email: text(value, 180)?.toLowerCase() ?? null };
      break;
    case "phone":
    case "city":
    case "source":
      data = { [field]: text(value, 120) };
      break;
    default:
      return { ok: false, error: "Champ non modifiable." };
  }
  await prisma.client.update({ where: { id }, data });
  if (field === "status" && value !== client.status) {
    const label = clientStatusOptions.find((option) => option.value === value)?.label ?? String(value);
    await logActivity("client.status", `Statut : ${label}`, { clientId: id });
  }
  refreshCrm();
  return { ok: true };
}

export async function createClientQuick(name: string, status: string): Promise<Result & { id?: string }> {
  await assertAdmin();
  const clean = text(name);
  if (!clean) return { ok: false, error: "Donnez un nom au client." };
  if (!values(clientStatusOptions).includes(status)) return { ok: false, error: "Statut inconnu." };
  const client = await prisma.client.create({ data: { name: clean, status: status as ClientStatus } });
  await logActivity("client.created", "Fiche client créée", { clientId: client.id });
  refreshCrm();
  return { ok: true, id: client.id };
}

// ------------------------------------------------------------------ recherche

export type SearchHit = { kind: "client" | "deal" | "quote" | "invoice" | "task"; id: string; title: string; subtitle: string; href: string };

/** Recherche globale (Ctrl + K) : clients, projets, devis, factures, tâches. */
export async function searchCrm(query: string): Promise<SearchHit[]> {
  await assertAdmin();
  const q = query.trim();
  if (q.length < 2) return [];
  const contains = { contains: q, mode: "insensitive" as const };
  const [clients, deals, quotes, invoices, tasks] = await Promise.all([
    prisma.client.findMany({
      where: { OR: [{ name: contains }, { legalName: contains }, { email: contains }, { contacts: { some: { OR: [{ firstName: contains }, { lastName: contains }, { email: contains }] } } }] },
      take: 6,
      select: { id: true, name: true, city: true },
    }),
    prisma.deal.findMany({ where: { title: contains }, take: 6, select: { id: true, title: true, client: { select: { name: true } } } }),
    prisma.quote.findMany({ where: { OR: [{ number: contains }, { title: contains }] }, take: 6, select: { id: true, number: true, title: true, client: { select: { name: true } } } }),
    prisma.invoice.findMany({ where: { OR: [{ number: contains }, { title: contains }] }, take: 6, select: { id: true, number: true, title: true, client: { select: { name: true } } } }),
    prisma.task.findMany({ where: { title: contains, status: { not: "DONE" } }, take: 5, select: { id: true, title: true, client: { select: { name: true } } } }),
  ]);
  return [
    ...clients.map((c) => ({ kind: "client" as const, id: c.id, title: c.name, subtitle: c.city ?? "Client", href: `/admin/clients/${c.id}` })),
    ...deals.map((d) => ({ kind: "deal" as const, id: d.id, title: d.title, subtitle: d.client.name, href: `/admin/deals/${d.id}` })),
    ...quotes.map((d) => ({ kind: "quote" as const, id: d.id, title: d.number ?? d.title, subtitle: `${d.client.name} · ${d.title}`, href: `/admin/quotes/${d.id}` })),
    ...invoices.map((d) => ({ kind: "invoice" as const, id: d.id, title: d.number ?? d.title, subtitle: `${d.client.name} · ${d.title}`, href: `/admin/invoices/${d.id}` })),
    ...tasks.map((t) => ({ kind: "task" as const, id: t.id, title: t.title, subtitle: t.client?.name ?? "Tâche", href: "/admin/tasks" })),
  ];
}
