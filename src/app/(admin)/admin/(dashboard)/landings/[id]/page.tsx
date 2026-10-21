import { notFound } from "next/navigation";

import { LandingForm } from "../landing-form";

import { AdminHeader } from "@/components/admin/ui";
import type { Locale as DbLocale } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Modifier la page" };

const emptyTranslation = {
  slug: "",
  title: "",
  lead: "",
  body: "",
  seoTitle: "",
  seoDescription: "",
};

export default async function EditLandingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [landing, services, projects] = await Promise.all([
    prisma.landing.findUnique({
      where: { id },
      include: {
        translations: true,
        faqs: { orderBy: { position: "asc" } },
        services: { select: { id: true } },
        projects: { select: { id: true } },
      },
    }),
    prisma.service.findMany({
      orderBy: { position: "asc" },
      include: { translations: { where: { locale: "FR" }, take: 1 } },
    }),
    prisma.project.findMany({
      orderBy: { position: "asc" },
      include: { translations: { where: { locale: "FR" }, take: 1 } },
    }),
  ]);

  if (!landing) notFound();

  const translationFor = (locale: DbLocale) => {
    const found = landing.translations.find((item) => item.locale === locale);
    if (!found) return { ...emptyTranslation };
    return {
      slug: found.slug,
      title: found.title,
      lead: found.lead,
      body: found.body,
      seoTitle: found.seoTitle ?? "",
      seoDescription: found.seoDescription ?? "",
    };
  };

  const frTitle =
    landing.translations.find((item) => item.locale === "FR")?.title ?? landing.key;

  return (
    <>
      <AdminHeader
        title={frTitle}
        back={{ href: "/admin/landings", label: "Secteurs & villes" }}
      />
      <LandingForm
        services={services.map((service) => ({
          id: service.id,
          title: service.translations[0]?.title ?? service.key,
        }))}
        projects={projects.map((project) => ({
          id: project.id,
          title: project.translations[0]?.title ?? project.key,
        }))}
        landing={{
          id: landing.id,
          kind: landing.kind,
          key: landing.key,
          icon: landing.icon,
          highlights: landing.highlights,
          position: landing.position,
          published: landing.published,
          serviceIds: landing.services.map((service) => service.id),
          projectIds: landing.projects.map((project) => project.id),
          faqs: landing.faqs.map((faq) => ({
            questionFr: faq.questionFr,
            answerFr: faq.answerFr,
            questionEn: faq.questionEn,
            answerEn: faq.answerEn,
            questionEs: faq.questionEs,
            answerEs: faq.answerEs,
          })),
          translations: {
            FR: translationFor("FR"),
            EN: translationFor("EN"),
            ES: translationFor("ES"),
          },
        }}
      />
    </>
  );
}
