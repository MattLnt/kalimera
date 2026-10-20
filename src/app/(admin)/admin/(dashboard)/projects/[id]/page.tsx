import { notFound } from "next/navigation";

import { ProjectForm, type ProjectFormData } from "../project-form";

import { AdminHeader } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Modifier un projet" };

const emptyTranslation = {
  slug: "",
  title: "",
  category: "",
  summary: "",
  challenge: "",
  solution: "",
  outcome: "",
  seoTitle: "",
  seoDescription: "",
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, services] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        translations: true,
        metrics: { orderBy: { position: "asc" } },
        coverImage: true,
        gallery: true,
        services: { select: { id: true } },
      },
    }),
    prisma.service.findMany({
      orderBy: { position: "asc" },
      include: { translations: { where: { locale: "FR" }, take: 1 } },
    }),
  ]);

  if (!project) notFound();

  const translations: ProjectFormData["translations"] = {
    FR: { ...emptyTranslation },
    EN: { ...emptyTranslation },
    ES: { ...emptyTranslation },
  };

  for (const translation of project.translations) {
    translations[translation.locale] = {
      slug: translation.slug,
      title: translation.title,
      category: translation.category,
      summary: translation.summary,
      challenge: translation.challenge,
      solution: translation.solution,
      outcome: translation.outcome,
      seoTitle: translation.seoTitle ?? "",
      seoDescription: translation.seoDescription ?? "",
    };
  }

  return (
    <>
      <AdminHeader
        title={translations.FR.title || project.key}
        subtitle={`${project.client} · ${project.year}`}
        back={{ href: "/admin/projects", label: "Projets" }}
      />
      <ProjectForm
        services={services.map((service) => ({
          id: service.id,
          title: service.translations[0]?.title ?? service.key,
        }))}
        project={{
          id: project.id,
          key: project.key,
          kind: project.kind,
          client: project.client,
          year: project.year,
          liveUrl: project.liveUrl ?? "",
          stack: project.stack,
          accent: project.accent,
          featured: project.featured,
          position: project.position,
          published: project.published,
          coverImage: project.coverImage
            ? {
                id: project.coverImage.id,
                url: project.coverImage.url,
                width: project.coverImage.width,
                height: project.coverImage.height,
              }
            : null,
          gallery: project.gallery.map((media) => ({
            id: media.id,
            url: media.url,
            width: media.width,
            height: media.height,
          })),
          serviceIds: project.services.map((service) => service.id),
          metrics: project.metrics.map((metric) => ({
            value: metric.value,
            labelFr: metric.labelFr,
            labelEn: metric.labelEn,
            labelEs: metric.labelEs,
          })),
          translations,
        }}
      />
    </>
  );
}
