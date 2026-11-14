import { notFound, redirect } from "next/navigation";

import { InvoiceEditor } from "../../invoice-editor";

import { centsToAmount, newLotKey } from "@/lib/crm/lots";
import { AdminHeader } from "@/components/admin/ui";
import { loadEditorData } from "@/lib/crm/documents/editor-data";
import { lineTotalCents } from "@/lib/crm/totals";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Modifier la facture" };
export const dynamic = "force-dynamic";

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [invoice, data] = await Promise.all([
    prisma.invoice.findUnique({ where: { id }, include: { lines: { orderBy: { position: "asc" } } } }),
    loadEditorData(),
  ]);
  if (!invoice) notFound();
  if (invoice.status !== "DRAFT") redirect(`/admin/invoices/${id}`);

  return (
    <>
      <AdminHeader title={`Modifier « ${invoice.title} »`} back={{ href: `/admin/invoices/${id}`, label: "Facture" }} />
      <InvoiceEditor
        {...data}
        initialDraft={{
          id: invoice.id,
          kind: invoice.kind,
          clientId: invoice.clientId,
          dealId: invoice.dealId ?? "",
          issuerId: invoice.issuerId ?? "",
          currency: invoice.currency,
          title: invoice.title,
          contextLine: invoice.contextLine ?? "",
          notes: invoice.notes ?? "",
          lots: invoice.lines
            .filter((line) => line.kind === "ITEM")
            .map((line) => ({ key: newLotKey(), title: line.title, description: line.description ?? "", amount: centsToAmount(lineTotalCents(line)) })),
        }}
      />
    </>
  );
}
