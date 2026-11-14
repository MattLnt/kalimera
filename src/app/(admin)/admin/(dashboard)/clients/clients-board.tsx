"use client";

import { useMemo } from "react";

import { createClientQuick, updateClientField } from "../board-actions";

import { Board, BoardError, StatusCell, TextCell, useOptimisticItems, type BoardColumn } from "@/components/admin/board/board";
import { Avatar } from "@/components/admin/ui";
import { clientStatusOptions } from "@/lib/crm/vivid";

export type BoardClientRow = {
  id: string;
  name: string;
  status: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  source: string;
  openDeals: number;
  pipelineCents: number;
  quotes: number;
  paidCents: number;
  updated: string;
};

const euro = (cents: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(cents / 100).replace(/ /g, " ");

export function ClientsBoard({ clients }: { clients: BoardClientRow[] }) {
  const { items, patch, error } = useOptimisticItems(clients);
  const update = (id: string, field: keyof BoardClientRow, value: unknown) =>
    patch(id, { [field]: value } as Partial<BoardClientRow>, () => updateClientField(id, field, value));

  const groups = useMemo(
    () =>
      clientStatusOptions
        .map((status) => ({ key: status.value, label: status.label, color: status.color, items: items.filter((item) => item.status === status.value) }))
        .filter((group) => group.key !== "ARCHIVED" || group.items.length > 0),
    [items],
  );

  const columns: BoardColumn<BoardClientRow>[] = [
    {
      key: "name",
      label: "Client",
      width: "minmax(220px,1.5fr)",
      render: (client) => (
        <div className="flex w-full min-w-0 items-center pl-3">
          <Avatar name={client.name} size="sm" />
          <TextCell value={client.name} onChange={(value) => update(client.id, "name", value)} href={`/admin/clients/${client.id}`} className="font-display text-[0.9375rem] font-bold" />
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      width: "140px",
      align: "center",
      render: (client) => <StatusCell value={client.status} options={clientStatusOptions} onChange={(value) => update(client.id, "status", value)} />,
    },
    { key: "contact", label: "Interlocuteur", width: "minmax(120px,1fr)", render: (client) => <span className="truncate px-3 text-[0.875rem] font-semibold">{client.contact || "—"}</span> },
    { key: "email", label: "E-mail", width: "minmax(160px,1.1fr)", render: (client) => <TextCell value={client.email} placeholder="Ajouter" onChange={(value) => update(client.id, "email", value)} /> },
    { key: "phone", label: "Téléphone", width: "130px", render: (client) => <TextCell value={client.phone} placeholder="Ajouter" onChange={(value) => update(client.id, "phone", value)} /> },
    { key: "city", label: "Ville", width: "110px", render: (client) => <TextCell value={client.city} placeholder="Ajouter" onChange={(value) => update(client.id, "city", value)} /> },
    {
      key: "deals",
      label: "Projets en cours",
      width: "140px",
      align: "right",
      render: (client) =>
        client.openDeals ? (
          <div className="px-3 text-right leading-tight">
            <span className="block font-display text-[0.875rem] font-bold tabular-nums">{euro(client.pipelineCents)}</span>
            <span className="block text-[0.6875rem] text-[var(--ink-45)]">
              {client.openDeals} projet{client.openDeals > 1 ? "s" : ""}
            </span>
          </div>
        ) : (
          <span className="px-3 text-[var(--ink-45)]">—</span>
        ),
      summary: (rows) => euro(rows.reduce((sum, row) => sum + row.pipelineCents, 0)),
    },
    {
      key: "paid",
      label: "Encaissé",
      width: "120px",
      align: "right",
      render: (client) => <span className="px-3 font-display text-[0.875rem] font-bold tabular-nums">{client.paidCents ? euro(client.paidCents) : <span className="font-normal text-[var(--ink-45)]">—</span>}</span>,
      summary: (rows) => euro(rows.reduce((sum, row) => sum + row.paidCents, 0)),
    },
  ];

  return (
    <>
      <Board
        groups={groups}
        columns={columns}
        quickAdd={{
          placeholder: "Ajouter un client (nom, Entrée)",
          onAdd: async (status, name) => {
            const result = await createClientQuick(name, status);
            return result.ok ? null : result.error;
          },
        }}
      />
      <BoardError message={error} />
    </>
  );
}
