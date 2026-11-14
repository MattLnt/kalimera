"use server";

import { revalidatePath } from "next/cache";

import type { TaskPriority } from "@/generated/prisma/enums";
import { assertAdmin, readOptional, readString } from "@/lib/admin";
import { fromDateInput } from "@/lib/crm/format";
import { prisma } from "@/lib/prisma";

const priorities: TaskPriority[] = ["LOW", "NORMAL", "HIGH"];

function refresh(task: { clientId: string | null; dealId: string | null }) {
  revalidatePath("/admin/tasks");
  revalidatePath("/admin");
  if (task.clientId) revalidatePath(`/admin/clients/${task.clientId}`);
  if (task.dealId) revalidatePath(`/admin/deals/${task.dealId}`);
}

export async function createTask(formData: FormData) {
  await assertAdmin();
  const title = readString(formData, "title");
  if (!title) return;
  const priority = readString(formData, "priority") as TaskPriority;
  let clientId = readOptional(formData, "clientId");
  const dealId = readOptional(formData, "dealId");
  // Une tâche de projet appartient aussi au client du projet.
  if (dealId && !clientId) {
    clientId = (await prisma.deal.findUnique({ where: { id: dealId }, select: { clientId: true } }))?.clientId ?? null;
  }
  const task = await prisma.task.create({
    data: {
      title: title.slice(0, 300),
      details: readOptional(formData, "details"),
      dueAt: fromDateInput(readOptional(formData, "dueAt")),
      priority: priorities.includes(priority) ? priority : "NORMAL",
      clientId,
      dealId,
    },
  });
  refresh(task);
}

export async function toggleTask(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return;
  const done = task.status !== "DONE";
  await prisma.task.update({
    where: { id },
    data: { status: done ? "DONE" : "TODO", completedAt: done ? new Date() : null },
  });
  refresh(task);
}

export async function setTaskStatus(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const status = readString(formData, "status");
  if (status !== "TODO" && status !== "DOING" && status !== "DONE") return;
  const task = await prisma.task.update({
    where: { id },
    data: { status, completedAt: status === "DONE" ? new Date() : null },
  });
  refresh(task);
}

export async function deleteTask(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const task = await prisma.task.delete({ where: { id } }).catch(() => null);
  if (task) refresh(task);
}
