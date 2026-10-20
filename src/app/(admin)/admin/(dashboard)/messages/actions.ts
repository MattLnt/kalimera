"use server";

import { revalidatePath } from "next/cache";

import { assertAdmin, readString } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function markMessageRead(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;

  await prisma.contactMessage.update({
    where: { id },
    data: { status: "READ" },
  });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function archiveMessage(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;

  await prisma.contactMessage.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
