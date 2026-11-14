import { Building2, Mail, Phone, Plus, Search } from "lucide-react";

import { ActionLink, AdminHeader, Avatar, DataTable, EmptyState, FilterTabs, Pill, RowLink } from "@/components/admin/ui";
import type { ClientStatus, Prisma } from "@/generated/prisma/client";
import { formatMoneyShort, formatRelative } from "@/lib/crm/format";
import { clientStatus, toneClasses, toneDots } from "@/lib/crm/labels";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Clients" };
export const dynamic = "force-dynamic";

const tabs: { key: string; label: string; statuses?: ClientStatus[] }[] = [
  { key: "all", label: "Tous", statuses: ["LEAD", "PROSPECT", "ACTIVE", "PAST"] },
  { key: "leads", label: "Pistes & prospects", statuses: ["LEAD", "PROSPECT"] },
  { key: "active", label: "Actifs", statuses: ["ACTIVE"] },
  { key: "past", label: "Anciens", statuses: ["PAST"] },
  { key: "archived", label: "Archivés", statuses: ["ARCHIVED"] },
];

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const { filter = "all", q = "" } = await searchParams;
  const tab = tabs.find((item) => item.key === filter) ?? tabs[0];
  const query = q.trim();

  const where: Prisma.ClientWhereInput = {
    status: { in: tab.statuses },
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { legalName: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
            { contacts: { some: { OR: [{ firstName: { contains: query, mode: "insensitive" } }, { lastName: { contains: query, mode: "insensitive" } }] } } },
          ],
        }
      : {}),
  };

  const [clients, counts] = await Promise.all([
    prisma.client.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 200,
      include: {
        contacts: { where: { isPrimary: true }, take: 1 },
        deals: { where: { stage: { notIn: ["LOST", "DELIVERED"] } }, select: { amountCents: true } },
        invoices: { where: { status: "PAID" }, select: { totalCents: true } },
      },
    }),
    prisma.client.groupBy({ by: ["status"], _count: true }),
  ]);

  const countFor = (statuses?: ClientStatus[]) =>
    counts.filter((row) => statuses?.includes(row.status)).reduce((sum, row) => sum + row._count, 0);

  return (
    <>
      <AdminHeader
        title="Clients"
        subtitle="Pistes, prospects et clients : coordonnées, échanges, projets et documents."
        action={
          <ActionLink href="/admin/clients/new">
            <Plus className="size-4" />
            Nouveau client
          </ActionLink>
        }
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <FilterTabs
          tabs={tabs.map((item) => ({
            href: `/admin/clients?filter=${item.key}${query ? `&q=${encodeURIComponent(query)}` : ""}`,
            label: item.label,
            active: item.key === tab.key,
            count: countFor(item.statuses),
          }))}
        />
        <form className="relative mb-5 w-full sm:w-72">
          <input type="hidden" name="filter" value={tab.key} />
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--ink-45)]" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Nom, ville, contact…"
            className="field-input pl-10"
            aria-label="Rechercher un client"
          />
        </form>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          title={query ? "Aucun résultat" : "Aucun client ici"}
          description={
            query
              ? "Essayez un autre nom, une ville ou le prénom d'un contact."
              : "Créez une fiche à la main, ou elle se créera toute seule à la prochaine demande de contact ou réservation d'appel."
          }
          action={<ActionLink href="/admin/clients/new">Créer une fiche</ActionLink>}
        />
      ) : (
        <DataTable
          head={
            <tr>
              <th>Client</th>
              <th>Statut</th>
              <th>Interlocuteur</th>
              <th>Origine</th>
              <th className="num">Projets en cours</th>
              <th className="num">Encaissé</th>
              <th className="num">Activité</th>
            </tr>
          }
        >
          {clients.map((client) => {
            const status = clientStatus[client.status];
            const contact = client.contacts[0];
            const pipeline = client.deals.reduce((sum, deal) => sum + (deal.amountCents ?? 0), 0);
            const paid = client.invoices.reduce((sum, invoice) => sum + invoice.totalCents, 0);
            return (
              <tr key={client.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name={client.name} />
                    <div className="min-w-0">
                      <RowLink href={`/admin/clients/${client.id}`} className="block truncate font-display text-[0.9375rem] font-bold tracking-[-0.01em] text-ink">
                        {client.name}
                      </RowLink>
                      <span className="flex items-center gap-1 truncate text-[0.75rem] text-[var(--ink-45)]">
                        <Building2 className="size-3 shrink-0" />
                        {[client.city, client.country !== "FR" ? client.country : null].filter(Boolean).join(", ") || "—"}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <Pill className={toneClasses[status.tone]} dot={toneDots[status.tone]}>
                    {status.label}
                  </Pill>
                </td>
                <td>
                  {contact ? (
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="flex items-center gap-1 truncate text-[0.75rem] text-[var(--ink-45)]">
                        {contact.email ? <Mail className="size-3 shrink-0" /> : contact.phone ? <Phone className="size-3 shrink-0" /> : null}
                        {contact.email ?? contact.phone ?? contact.role ?? ""}
                      </p>
                    </div>
                  ) : (
                    <span className="text-[var(--ink-45)]">{client.email ?? "—"}</span>
                  )}
                </td>
                <td className="text-[var(--ink-65)]">{client.source ?? "—"}</td>
                <td className="num">
                  {client.deals.length ? (
                    <>
                      <span className="font-display font-bold">{formatMoneyShort(pipeline)}</span>
                      <span className="block text-[0.75rem] text-[var(--ink-45)]">
                        {client.deals.length} projet{client.deals.length > 1 ? "s" : ""}
                      </span>
                    </>
                  ) : (
                    <span className="text-[var(--ink-45)]">—</span>
                  )}
                </td>
                <td className="num font-display font-bold">{paid ? formatMoneyShort(paid) : <span className="font-normal text-[var(--ink-45)]">—</span>}</td>
                <td className="num text-[0.8125rem] text-[var(--ink-45)]">{formatRelative(client.updatedAt)}</td>
              </tr>
            );
          })}
        </DataTable>
      )}
    </>
  );
}
