import { ServiceForm } from "../service-form";

import { AdminHeader } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Nouveau service" };

const emptyTranslation = {
  slug: "",
  title: "",
  summary: "",
  body: "",
  seoTitle: "",
  seoDescription: "",
};

export default async function NewServicePage() {
  // Le nouveau service se place à la fin de la liste.
  const count = await prisma.service.count();

  return (
    <>
      <AdminHeader
        title="Nouveau service"
        back={{ href: "/admin/services", label: "Services" }}
      />
      <ServiceForm
        service={{
          key: "",
          icon: "Layers",
          stack: [],
          position: count,
          published: false,
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
