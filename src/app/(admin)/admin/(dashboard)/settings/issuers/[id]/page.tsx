import { notFound } from "next/navigation";

import { IssuerForm, type IssuerDraft } from "../issuer-form";

import { AdminHeader } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Identité de facturation" };
export const dynamic = "force-dynamic";

const blank: IssuerDraft = {
  label: "",
  name: "",
  headerLines: "",
  footer: "",
  email: "",
  phone: "",
  website: "",
  vatMention: "",
  paymentTerms: "",
  latePenalty: "",
  recoveryFee: "",
  currency: "EUR",
  bankHolder: "",
  bankName: "",
  iban: "",
  bic: "",
  depositPercent: 50,
  quoteValidityDays: 30,
  invoicePrefix: "FAC",
  quotePrefix: "DEV",
};

export default async function IssuerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let draft = blank;
  if (id !== "new") {
    const issuer = await prisma.issuer.findUnique({ where: { id } });
    if (!issuer) notFound();
    draft = {
      id: issuer.id,
      label: issuer.label,
      name: issuer.name,
      headerLines: issuer.headerLines,
      footer: issuer.footer,
      email: issuer.email ?? "",
      phone: issuer.phone ?? "",
      website: issuer.website ?? "",
      vatMention: issuer.vatMention ?? "",
      paymentTerms: issuer.paymentTerms ?? "",
      latePenalty: issuer.latePenalty ?? "",
      recoveryFee: issuer.recoveryFee ?? "",
      currency: issuer.currency,
      bankHolder: issuer.bankHolder ?? "",
      bankName: issuer.bankName ?? "",
      iban: issuer.iban ?? "",
      bic: issuer.bic ?? "",
      depositPercent: issuer.depositPercent,
      quoteValidityDays: issuer.quoteValidityDays,
      invoicePrefix: issuer.invoicePrefix,
      quotePrefix: issuer.quotePrefix,
    };
  }

  return (
    <>
      <AdminHeader
        title={draft.id ? draft.label : "Nouvelle identité"}
        back={{ href: "/admin/settings/issuers", label: "Identités de facturation" }}
      />
      <IssuerForm issuer={draft} />
    </>
  );
}
