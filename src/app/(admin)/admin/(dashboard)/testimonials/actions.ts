"use server";

import { revalidatePath } from "next/cache";

import type { Locale as DbLocale } from "@/generated/prisma/enums";
import {
  assertAdmin,
  dbLocaleList,
  readNumber,
  readString,
  revalidateSite,
} from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function saveTestimonial(formData: FormData) {
  await assertAdmin();

  const id = readString(formData, "id");
  const author = readString(formData, "author");
  if (!author) return;

  const position = readNumber(formData, "position");

  const testimonial = id
    ? await prisma.testimonial.update({ where: { id }, data: { author, position } })
    : await prisma.testimonial.create({
        data: { author, position, published: false },
      });

  for (const locale of dbLocaleList) {
    const quote = readString(formData, `${locale}_quote`);
    const role = readString(formData, `${locale}_role`);

    if (!quote) {
      // Une citation vidée supprime la traduction : le site repliera sur le FR.
      await prisma.testimonialTranslation.deleteMany({
        where: { testimonialId: testimonial.id, locale: locale as DbLocale },
      });
      continue;
    }

    await prisma.testimonialTranslation.upsert({
      where: {
        testimonialId_locale: {
          testimonialId: testimonial.id,
          locale: locale as DbLocale,
        },
      },
      update: { quote, role },
      create: {
        testimonialId: testimonial.id,
        locale: locale as DbLocale,
        quote,
        role,
      },
    });
  }

  revalidatePath("/admin/testimonials");
  revalidateSite();
}

export async function toggleTestimonialPublished(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;

  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) return;

  await prisma.testimonial.update({
    where: { id },
    data: { published: !testimonial.published },
  });

  revalidatePath("/admin/testimonials");
  revalidateSite();
}

export async function deleteTestimonial(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;

  await prisma.testimonial.delete({ where: { id } });

  revalidatePath("/admin/testimonials");
  revalidateSite();
}
