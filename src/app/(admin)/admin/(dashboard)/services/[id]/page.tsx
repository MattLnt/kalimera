import { notFound } from "next/navigation";

import { ServiceForm, type ServiceFormData } from "../service-form";

import { AdminHeader } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Modifier un service" };

const emptyTranslation = {
  slug: "",
  title: "",
  summary: "",
  body: "",
  seoTitle: "",
  seoDescription: "",
};

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({
    where: { id },
    include: { translations: true },
  });
  if (!service) notFound();

  const translations: ServiceFormData["translations"] = {
    FR: { ...emptyTranslation },
    EN: { ...emptyTranslation },
    ES: { ...emptyTranslation },
  };

  for (const translation of service.translations) {
    translations[translation.locale] = {
      slug: translation.slug,
      title: translation.title,
      summary: translation.summary,
      body: translation.body,
      seoTitle: translation.seoTitle ?? "",
      seoDescription: translation.seoDescription ?? "",
    };
  }

  return (
    <>
      <AdminHeader
        title={translations.FR.title || service.key}
        subtitle="Modifier le contenu et les réglages de ce service."
        back={{ href: "/admin/services", label: "Services" }}
      />
      <ServiceForm
        service={{
          id: service.id,
          key: service.key,
          icon: service.icon,
          stack: service.stack,
          position: service.position,
          published: service.published,
          translations,
        }}
      />
    </>
  );
}
