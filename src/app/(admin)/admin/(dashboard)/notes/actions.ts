"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { NoteKind } from "@/generated/prisma/enums";
import { assertAdmin, readOptional, readString } from "@/lib/admin";
import { logActivity } from "@/lib/crm/activity";
import { noteKind } from "@/lib/crm/labels";
import { prisma } from "@/lib/prisma";

const kinds = Object.keys(noteKind) as NoteKind[];

/** Trame d'un appel de découverte : on la remplit pendant qu'on écoute. */
const templates: Record<NoteKind, string> = {
  CALL: [
    "## Contexte",
    "",
    "## Besoin exprimé",
    "",
    "## Ce qui existe aujourd'hui",
    "",
    "## Budget",
    "",
    "## Délai",
    "",
    "## Décideurs",
    "",
    "## Points de vigilance",
    "",
    "## Prochaines étapes",
    "- [ ] ",
  ].join("\n"),
  MEETING: ["## Participants", "", "## Points abordés", "", "## Décisions", "", "## Actions", "- [ ] "].join("\n"),
  EMAIL: "",
  NOTE: "",
};

/** Crée la note tout de suite, puis ouvre l'éditeur : rien ne se perd. */
export async function createNote(formData: FormData) {
  await assertAdmin();
  const clientId = readString(formData, "clientId");
  if (!clientId) return;
  const kindValue = readString(formData, "kind") as NoteKind;
  const kind = kinds.includes(kindValue) ? kindValue : "NOTE";

  const bookingId = readOptional(formData, "bookingId");
  const booking = bookingId ? await prisma.booking.findUnique({ where: { id: bookingId } }) : null;

  const note = await prisma.note.create({
    data: {
      clientId,
      kind,
      dealId: readOptional(formData, "dealId"),
      bookingId: booking?.id ?? null,
      title: kind === "CALL" ? (booking ? "Appel de découverte" : "Appel") : kind === "MEETING" ? "Réunion" : null,
      body: templates[kind],
      occurredAt: booking?.startsAt ?? new Date(),
    },
  });
  await logActivity("note.created", `${noteKind[kind].label} ajouté${kind === "NOTE" ? "e" : ""}`, {
    clientId,
    dealId: note.dealId,
  });
  redirect(`/admin/notes/${note.id}${kind === "CALL" ? "?live=1" : ""}`);
}

export type NoteDraft = {
  id: string;
  title: string;
  kind: NoteKind;
  body: string;
  occurredAt: string;
  durationMin: number | null;
  dealId: string | null;
  pinned: boolean;
};

/** Enregistrement automatique depuis l'éditeur. */
export async function saveNote(draft: NoteDraft) {
  await assertAdmin();
  const occurredAt = new Date(draft.occurredAt);
  const note = await prisma.note.update({
    where: { id: draft.id },
    data: {
      title: draft.title.trim() || null,
      kind: kinds.includes(draft.kind) ? draft.kind : "NOTE",
      body: draft.body.slice(0, 100_000),
      occurredAt: Number.isNaN(occurredAt.getTime()) ? undefined : occurredAt,
      durationMin: draft.durationMin && draft.durationMin > 0 ? Math.round(draft.durationMin) : null,
      dealId: draft.dealId || null,
      pinned: draft.pinned,
    },
  });
  revalidatePath(`/admin/clients/${note.clientId}`);
  return { savedAt: new Date().toISOString() };
}

export async function deleteNote(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const note = await prisma.note.delete({ where: { id } }).catch(() => null);
  if (!note) return;
  revalidatePath(`/admin/clients/${note.clientId}`);
  redirect(`/admin/clients/${note.clientId}`);
}

export async function toggleNotePin(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) return;
  await prisma.note.update({ where: { id }, data: { pinned: !note.pinned } });
  revalidatePath(`/admin/clients/${note.clientId}`);
}
