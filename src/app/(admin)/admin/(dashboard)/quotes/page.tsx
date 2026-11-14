import { BadgeCheck, Hourglass, Percent, Plus } from "lucide-react";

import { DocumentsBoard, type DocumentRow } from "@/components/admin/board/documents-board";
import { ActionLink, AdminHeader, EmptyState, StatCard } from "@/components/admin/ui";
import { formatDate, formatMoneyShort } from "@/lib/crm/format";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Devis" };
export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  const now = new Date();
  // Un devis envoyé dont la validité est dépassée passe en « Expiré ».
  await prisma.quote.updateMany({ where: { status: { in: ["SENT", "VIEWED"] }, validUntil: { lt: now } }, data: { status: "EXPIRED" } });

  const quotes = await prisma.quote.findMany({
    orderBy: { updatedAt: "desc" },
    include: { client: { select: { id: true, name: true } }, deal: { select: { id: true, title: true } }, issuer: { select: { label: true } } },
    take: 500,
  });

  const rows: DocumentRow[] = quotes.map((quote) => ({
    id: quote.id,
    href: `/admin/quotes/${quote.id}`,
    number: quote.number ?? "Brouillon",
    title: quote.title,
    client: quote.client,
    deal: quote.deal,
    issuer: quote.issuer?.label ?? "—",
    state: quote.status,
    date: formatDate(quote.issueDate ?? quote.createdAt),
    due: quote.validUntil ? formatDate(quote.validUntil) : "—",
    late: false,
    totalCents: quote.totalCents,
    paidCents: null,
    currency: quote.currency,
  }));

  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const pending = quotes.filter((quote) => quote.status === "SENT" || quote.status === "VIEWED");
  const signed = quotes.filter((quote) => quote.status === "SIGNED" && quote.signedAt && quote.signedAt >= yearStart);
  const decided = quotes.filter((quote) => ["SIGNED", "DECLINED", "EXPIRED"].includes(quote.status));
  const eur = (list: typeof quotes) => list.filter((q) => q.currency === "EUR").reduce((s, q) => s + q.totalCents, 0);

  return (
    <>
      <AdminHeader
        eyebrow="Ventes"
        title="Devis"
        subtitle="Rédigés ici, envoyés par e-mail, signés en ligne ou acceptés de vive voix. Un projet peut en porter plusieurs."
        action={
          <ActionLink href="/admin/quotes/new">
            <Plus className="size-4" />
            Nouveau devis
          </ActionLink>
        }
      >
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatCard color="teal" icon={<Hourglass className="size-4" />} label="En attente de réponse" value={formatMoneyShort(eur(pending))} hint={`${pending.length} devis envoyé${pending.length > 1 ? "s" : ""}`} />
          <StatCard color="green" icon={<BadgeCheck className="size-4" />} label={`Acceptés en ${now.getFullYear()}`} value={formatMoneyShort(eur(signed))} hint={`${signed.length} devis`} />
          <StatCard color="green"
            icon={<Percent className="size-4" />}
            label="Taux d'acceptation"
            value={decided.length ? `${Math.round((decided.filter((q) => q.status === "SIGNED").length / decided.length) * 100)} %` : "—"}
            hint="Sur les devis tranchés"
          />
        </div>
      </AdminHeader>

      {rows.length === 0 ? (
        <EmptyState
          title="Aucun devis pour l'instant"
          description="Créez un devis, rédigez-le vous-même ou laissez l'IA le préparer à partir d'un descriptif et d'un tarif."
          action={<ActionLink href="/admin/quotes/new">Nouveau devis</ActionLink>}
        />
      ) : (
        <DocumentsBoard kind="quote" rows={rows} order={["DRAFT", "SENT", "VIEWED", "SIGNED", "EXPIRED", "DECLINED", "CANCELLED"]} />
      )}
    </>
  );
}
