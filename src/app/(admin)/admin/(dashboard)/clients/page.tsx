import { Plus, Search, Sparkles, UserCheck, Users, Wallet } from "lucide-react";

import { ClientsBoard, type BoardClientRow } from "./clients-board";

import { ActionLink, AdminHeader, StatCard } from "@/components/admin/ui";
import type { Prisma } from "@/generated/prisma/client";
import { formatMoneyShort, formatRelative } from "@/lib/crm/format";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Clients" };
export const dynamic = "force-dynamic";

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const where: Prisma.ClientWhereInput = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { legalName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { contacts: { some: { OR: [{ firstName: { contains: query, mode: "insensitive" } }, { lastName: { contains: query, mode: "insensitive" } }] } } },
        ],
      }
    : {};

  const clients = await prisma.client.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 500,
    include: {
      contacts: { where: { isPrimary: true }, take: 1 },
      deals: { where: { stage: { notIn: ["LOST", "DELIVERED", "MAINTENANCE"] } }, select: { amountCents: true } },
      quotes: { select: { id: true } },
      invoices: { where: { status: { in: ["ISSUED", "PAID"] } }, select: { payments: { select: { amountCents: true } } } },
    },
  });

  const rows: BoardClientRow[] = clients.map((client) => {
    const contact = client.contacts[0];
    return {
      id: client.id,
      name: client.name,
      status: client.status,
      contact: contact ? `${contact.firstName} ${contact.lastName ?? ""}`.trim() : "",
      email: client.email ?? contact?.email ?? "",
      phone: client.phone ?? contact?.phone ?? "",
      city: client.city ?? "",
      source: client.source ?? "",
      openDeals: client.deals.length,
      pipelineCents: client.deals.reduce((sum, deal) => sum + (deal.amountCents ?? 0), 0),
      quotes: client.quotes.length,
      paidCents: client.invoices.reduce((sum, invoice) => sum + invoice.payments.reduce((total, payment) => total + payment.amountCents, 0), 0),
      updated: formatRelative(client.updatedAt),
    };
  });

  const active = rows.filter((row) => row.status === "ACTIVE");
  const leads = rows.filter((row) => row.status === "LEAD" || row.status === "PROSPECT");

  return (
    <>
      <AdminHeader
        eyebrow="Relation client"
        title="Clients"
        subtitle="Pistes, prospects et clients. Changez un statut ou une coordonnée d'un clic ; ouvrez la fiche pour l'historique complet."
        action={
          <ActionLink href="/admin/clients/new">
            <Plus className="size-4" />
            Nouveau client
          </ActionLink>
        }
      >
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard color="slate" icon={<Users className="size-4" />} label="Fiches" value={String(rows.length)} />
          <StatCard color="blue" icon={<Sparkles className="size-4" />} label="Pistes & prospects" value={String(leads.length)} />
          <StatCard color="blue" icon={<UserCheck className="size-4" />} label="Clients actifs" value={String(active.length)} />
          <StatCard color="green" icon={<Wallet className="size-4" />} label="Encaissé (total)" value={formatMoneyShort(rows.reduce((s, r) => s + r.paidCents, 0))} />
        </div>
      </AdminHeader>

      <form className="relative mb-5 w-full sm:w-80">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--ink-45)]" />
        <input name="q" defaultValue={query} placeholder="Rechercher : nom, ville, contact…" className="field-input pl-10" aria-label="Rechercher un client" />
      </form>

      <ClientsBoard clients={rows} />
    </>
  );
}
