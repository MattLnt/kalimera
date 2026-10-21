import { LandingForm } from "../landing-form";

import { AdminHeader } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Nouvelle page" };

const emptyTranslation = {
  slug: "",
  title: "",
  lead: "",
  body: "",
  seoTitle: "",
  seoDescription: "",
};

export default async function NewLandingPage() {
  const [count, services, projects] = await Promise.all([
    prisma.landing.count(),
    prisma.service.findMany({
      orderBy: { position: "asc" },
      include: { translations: { where: { locale: "FR" }, take: 1 } },
    }),
    prisma.project.findMany({
      orderBy: { position: "asc" },
      include: { translations: { where: { locale: "FR" }, take: 1 } },
    }),
  ]);

  return (
    <>
      <AdminHeader
        title="Nouvelle page"
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
          kind: "SECTOR",
          key: "",
          icon: "Layers",
          highlights: [],
          // La nouvelle page se place à la fin de sa famille.
          position: count,
          published: false,
          serviceIds: [],
          projectIds: [],
          faqs: [],
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
