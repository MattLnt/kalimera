import { FileSignature, Plus } from "lucide-react";
import Link from "next/link";

import { ActionLink, AdminHeader, EmptyState, FilterTabs, Pill, StatCard } from "@/components/admin/ui";
import type { Prisma, QuoteStatus } from "@/generated/prisma/client";
import { money } from "@/lib/crm/documents/render";
import { formatDate, formatMoneyShort } from "@/lib/crm/format";
import { quoteStatus, toneClasses } from "@/lib/crm/labels";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Devis" };
export const dynamic = "force-dynamic";

const tabs: { key: string; label: string; statuses: QuoteStatus[] }[] = [
  { key: "open", label: "En cours", statuses: ["DRAFT", "SENT", "VIEWED"] },
  { key: "signed", label: "Acceptés", statuses: ["SIGNED"] },
  { key: "closed", label: "Refusés & expirés", statuses: ["DECLINED", "EXPIRED", "CANCELLED"] },
  { key: "all", label: "Tous", statuses: ["DRAFT", "SENT", "VIEWED", "SIGNED", "DECLINED", "EXPIRED", "CANCELLED"] },
];

export default async function QuotesPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter = "open" } = await searchParams;
  const tab = tabs.find((item) => item.key === filter) ?? tabs[0];

  // Un devis envoyé dont la validité est dépassée passe en « Expiré ».
  await prisma.quote.updateMany({ where: { status: { in: ["SENT", "VIEWED"] }, validUntil: { lt: new Date() } }, data: { status: "EXPIRED" } });

  const where: Prisma.QuoteWhereInput = { status: { in: tab.statuses } };
  const [quotes, pending, signedThisYear] = await Promise.all([
    prisma.quote.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: { client: { select: { name: true } }, issuer: { select: { label: true } } },
      take: 200,
    }),
    prisma.quote.findMany({ where: { status: { in: ["SENT", "VIEWED"] } }, select: { totalCents: true, currency: true } }),
    prisma.quote.findMany({
      where: { status: "SIGNED", signedAt: { gte: new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1)) } },
      select: { totalCents: true, currency: true },
    }),
  ]);

  const sumEur = (rows: { totalCents: number; currency: string }[]) => rows.filter((row) => row.currency === "EUR").reduce((s, r) => s + r.totalCents, 0);

  return (
    <>
      <AdminHeader
        eyebrow="Ventes"
        title="Devis"
        subtitle="Rédigés ici, envoyés par e-mail, signés en ligne ou acceptés de vive voix."
        action={
          <ActionLink href="/admin/quotes/new">
            <Plus className="size-4" />
            Nouveau devis
          </ActionLink>
        }
      >
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatCard label="En attente de réponse" value={formatMoneyShort(sumEur(pending))} hint={`${pending.length} devis envoyé${pending.length > 1 ? "s" : ""}`} />
          <StatCard label={`Acceptés en ${new Date().getFullYear()}`} value={formatMoneyShort(sumEur(signedThisYear))} hint={`${signedThisYear.length} devis`} />
          <StatCard label="Taux d'acceptation" value={pending.length + signedThisYear.length ? `${Math.round((signedThisYear.length / (pending.length + signedThisYear.length)) * 100)} %` : "—"} hint="Sur les devis en cours et acceptés" />
        </div>
      </AdminHeader>

      <FilterTabs tabs={tabs.map((item) => ({ href: `/admin/quotes?filter=${item.key}`, label: item.label, active: item.key === tab.key }))} />

      {quotes.length === 0 ? (
        <EmptyState
          title="Aucun devis ici"
          description="Créez un devis, rédigez-le vous-même ou laissez l'IA le préparer à partir d'un descriptif et d'un tarif."
          action={<ActionLink href="/admin/quotes/new">Nouveau devis</ActionLink>}
        />
      ) : (
        <ul className="grid gap-2">
          {quotes.map((quote) => {
            const status = quoteStatus[quote.status];
            return (
              <li key={quote.id}>
                <Link href={`/admin/quotes/${quote.id}`} className="surface-card surface-card-hover flex flex-wrap items-center gap-4 px-5 py-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-aegean-50 text-aegean-700">
                    <FileSignature className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[0.9375rem] font-bold">
                      {quote.number ?? "Brouillon"} · {quote.title}
                    </span>
                    <span className="block truncate text-[0.8125rem] text-[var(--ink-45)]">
                      {quote.client.name} · {quote.issuer?.label ?? "identité à choisir"} · {formatDate(quote.issueDate ?? quote.createdAt)}
                    </span>
                  </span>
                  <span className="font-display text-[1rem] font-extrabold tracking-[-0.02em]">{money(quote.totalCents, quote.currency)}</span>
                  <Pill className={toneClasses[status.tone]}>{status.label}</Pill>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
