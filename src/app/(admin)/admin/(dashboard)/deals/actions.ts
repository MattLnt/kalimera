"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { DealStage } from "@/generated/prisma/enums";
import { assertAdmin, readOptional, readString } from "@/lib/admin";
import { logActivity } from "@/lib/crm/activity";
import { fromDateInput, parseMoney } from "@/lib/crm/format";
import { dealStage, dealStages } from "@/lib/crm/labels";
import { prisma } from "@/lib/prisma";

export type FormState = { error?: string };

const stages = dealStages.map((stage) => stage.value);

function refresh(deal: { id: string; clientId: string }) {
  revalidatePath("/admin/deals");
  revalidatePath(`/admin/deals/${deal.id}`);
  revalidatePath(`/admin/clients/${deal.clientId}`);
  revalidatePath("/admin");
}

/** Un projet signé fait passer son client en « client actif ». */
async function promoteClient(clientId: string, stage: DealStage) {
  if (dealStage[stage].phase === "production") {
    await prisma.client.updateMany({
      where: { id: clientId, status: { in: ["LEAD", "PROSPECT", "PAST"] } },
      data: { status: "ACTIVE" },
    });
  } else if (stage === "DISCOVERY" || stage === "PROPOSAL" || stage === "NEGOTIATION") {
    await prisma.client.updateMany({ where: { id: clientId, status: "LEAD" }, data: { status: "PROSPECT" } });
  }
}

export async function saveDeal(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const id = readString(formData, "id");
  const clientId = readString(formData, "clientId");
  const title = readString(formData, "title");
  const stageValue = readString(formData, "stage") as DealStage;
  if (!clientId) return { error: "Choisissez un client." };
  if (title.length < 2) return { error: "Donnez un nom au projet." };

  const probability = Number(readString(formData, "probability"));
  const data = {
    clientId,
    title,
    stage: stages.includes(stageValue) ? stageValue : "LEAD",
    amountCents: parseMoney(readString(formData, "amount")),
    probability: Number.isFinite(probability) && readString(formData, "probability") !== "" ? Math.min(100, Math.max(0, probability)) : null,
    description: readOptional(formData, "description"),
    startDate: fromDateInput(readOptional(formData, "startDate")),
    dueDate: fromDateInput(readOptional(formData, "dueDate")),
    lostReason: readOptional(formData, "lostReason"),
  };

  let dealId = id;
  if (id) {
    const before = await prisma.deal.findUnique({ where: { id }, select: { stage: true } });
    await prisma.deal.update({ where: { id }, data });
    if (before && before.stage !== data.stage) {
      await logActivity("deal.stage", `« ${title} » : ${dealStage[data.stage].label}`, { clientId, dealId: id });
    }
  } else {
    const deal = await prisma.deal.create({ data });
    dealId = deal.id;
    await logActivity("deal.created", `Projet créé : « ${title} »`, { clientId, dealId });
  }
  await promoteClient(clientId, data.stage);
  refresh({ id: dealId, clientId });
  redirect(`/admin/deals/${dealId}`);
}

/** Déplacement sur le tableau, par glisser-déposer ou par le sélecteur. */
export async function moveDeal(dealId: string, stage: DealStage, position: number) {
  await assertAdmin();
  if (!stages.includes(stage)) return;
  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) return;

  // Recalcule l'ordre de la colonne d'arrivée autour de la carte déposée.
  const column = await prisma.deal.findMany({
    where: { stage, id: { not: dealId } },
    orderBy: [{ position: "asc" }, { updatedAt: "desc" }],
    select: { id: true },
  });
  const ordered = [...column.map((item) => item.id)];
  ordered.splice(Math.max(0, Math.min(position, ordered.length)), 0, dealId);

  await prisma.$transaction([
    ...ordered.map((id, index) =>
      prisma.deal.update({
        where: { id },
        data:
          id === dealId
            ? { stage, position: index, deliveredAt: stage === "DELIVERED" ? (deal.deliveredAt ?? new Date()) : deal.deliveredAt }
            : { position: index },
      }),
    ),
  ]);

  if (deal.stage !== stage) {
    await logActivity("deal.stage", `« ${deal.title} » : ${dealStage[stage].label}`, { clientId: deal.clientId, dealId });
    await promoteClient(deal.clientId, stage);
  }
  refresh(deal);
}

export async function setDealStage(formData: FormData) {
  const id = readString(formData, "id");
  const stage = readString(formData, "stage") as DealStage;
  await moveDeal(id, stage, 0);
}

export async function deleteDeal(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const deal = await prisma.deal.findUnique({ where: { id } });
  if (!deal) return;
  await prisma.deal.delete({ where: { id } });
  revalidatePath("/admin/deals");
  revalidatePath(`/admin/clients/${deal.clientId}`);
  redirect(`/admin/clients/${deal.clientId}`);
}

// ------------------------------------------------------------ jalons

/** Les étapes habituelles d'un projet du studio, ajoutées d'un clic. */
const defaultMilestones = ["Cadrage", "Maquettes & design", "Développement", "Recette", "Mise en ligne"];

export async function addDefaultMilestones(formData: FormData) {
  await assertAdmin();
  const dealId = readString(formData, "dealId");
  const deal = await prisma.deal.findUnique({ where: { id: dealId }, include: { milestones: true } });
  if (!deal) return;
  const offset = deal.milestones.length;
  await prisma.milestone.createMany({
    data: defaultMilestones.map((title, index) => ({ dealId, title, position: offset + index })),
  });
  refresh(deal);
}

export async function addMilestone(formData: FormData) {
  await assertAdmin();
  const dealId = readString(formData, "dealId");
  const title = readString(formData, "title");
  if (!dealId || !title) return;
  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) return;
  const count = await prisma.milestone.count({ where: { dealId } });
  await prisma.milestone.create({
    data: { dealId, title, dueDate: fromDateInput(readOptional(formData, "dueDate")), position: count },
  });
  refresh(deal);
}

export async function toggleMilestone(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const milestone = await prisma.milestone.findUnique({ where: { id }, include: { deal: true } });
  if (!milestone) return;
  const done = !milestone.doneAt;
  await prisma.milestone.update({ where: { id }, data: { doneAt: done ? new Date() : null } });
  if (done) {
    await logActivity("milestone.done", `Étape terminée : ${milestone.title}`, {
      clientId: milestone.deal.clientId,
      dealId: milestone.dealId,
    });
  }
  refresh(milestone.deal);
}

export async function deleteMilestone(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const milestone = await prisma.milestone.delete({ where: { id }, include: { deal: true } }).catch(() => null);
  if (milestone) refresh(milestone.deal);
}
