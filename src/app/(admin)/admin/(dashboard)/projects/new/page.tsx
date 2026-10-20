import { ProjectForm } from "../project-form";

import { AdminHeader } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Nouveau projet" };

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

export default async function NewProjectPage() {
  const [count, services] = await Promise.all([
    prisma.project.count(),
    prisma.service.findMany({
      orderBy: { position: "asc" },
      include: { translations: { where: { locale: "FR" }, take: 1 } },
    }),
  ]);

  return (
    <>
      <AdminHeader
        title="Nouveau projet"
        back={{ href: "/admin/projects", label: "Projets" }}
      />
      <ProjectForm
        services={services.map((service) => ({
          id: service.id,
          title: service.translations[0]?.title ?? service.key,
        }))}
        project={{
          key: "",
          kind: "WEBSITE",
          client: "",
          year: new Date().getFullYear(),
          liveUrl: "",
          stack: [],
          accent: "g1",
          featured: false,
          position: count,
          published: false,
          coverImage: null,
          gallery: [],
          serviceIds: [],
          metrics: [],
          translations: {
            FR: { ...emptyTranslation },
            EN: { ...emptyTranslation },
            ES: { ...emptyTranslation },
          },
        }}
      />
    </>
  );
}
