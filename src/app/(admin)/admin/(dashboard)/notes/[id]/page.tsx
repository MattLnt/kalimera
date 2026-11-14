import { Mail, Phone, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteNote } from "../actions";
import { NoteEditor } from "./note-editor";

import { AdminHeader, Panel } from "@/components/admin/ui";
import { formatDate } from "@/lib/crm/format";
import { noteKind } from "@/lib/crm/labels";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Note" };
export const dynamic = "force-dynamic";

export default async function NotePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ live?: string }>;
}) {
  const { id } = await params;
  const { live } = await searchParams;

  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      client: {
        include: {
          contacts: { orderBy: { isPrimary: "desc" }, take: 3 },
          deals: { where: { stage: { not: "LOST" } }, select: { id: true, title: true }, orderBy: { updatedAt: "desc" } },
          notes: {
            where: { id: { not: id } },
            orderBy: { occurredAt: "desc" },
            take: 4,
            select: { id: true, title: true, kind: true, occurredAt: true },
          },
        },
      },
      booking: true,
    },
  });
  if (!note) notFound();
  const { client } = note;

  return (
    <>
      <AdminHeader
        title={note.kind === "CALL" ? "Notes d'appel" : noteKind[note.kind].label}
        back={{ href: `/admin/clients/${client.id}`, label: client.name }}
      />

      {/* L'éditeur et le rappel du client, à la même hauteur. */}
      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_300px]">
        <NoteEditor
          live={live === "1"}
          deals={client.deals}
          initial={{
            id: note.id,
            title: note.title ?? "",
            kind: note.kind,
            body: note.body,
            occurredAt: note.occurredAt.toISOString(),
            durationMin: note.durationMin,
            dealId: note.dealId,
            pinned: note.pinned,
          }}
        />

        <div className="flex flex-col gap-4">
          <Panel title={client.name}>
            {client.summary ? (
              <p className="mb-4 rounded-field bg-amber-50 px-3.5 py-3 text-[0.875rem] leading-relaxed whitespace-pre-wrap text-amber-900">
                {client.summary}
              </p>
            ) : null}
            <ul className="grid gap-3">
              {client.contacts.map((contact) => (
                <li key={contact.id} className="text-[0.875rem]">
                  <p className="font-display font-bold">
                    {contact.firstName} {contact.lastName}
                    {contact.role ? <span className="font-normal text-[var(--ink-45)]"> · {contact.role}</span> : null}
                  </p>
                  {contact.phone ? (
                    <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 text-aegean-700 hover:underline">
                      <Phone className="size-3.5" />
                      {contact.phone}
                    </a>
                  ) : null}
                  {contact.email ? (
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 truncate text-aegean-700 hover:underline">
                      <Mail className="size-3.5" />
                      {contact.email}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </Panel>

          {note.booking?.message ? (
            <Panel title="Message laissé à la réservation">
              <p className="text-[0.875rem] leading-relaxed whitespace-pre-wrap text-[var(--ink-65)]">
                {note.booking.message}
              </p>
            </Panel>
          ) : null}

          {client.notes.length > 0 ? (
            <Panel title="Échanges précédents" className="flex-1">
              <ul className="grid gap-2">
                {client.notes.map((item) => (
                  <li key={item.id}>
                    <Link href={`/admin/notes/${item.id}`} className="block rounded-field px-3 py-2 hover:bg-aegean-50">
                      <span className="block truncate font-display text-[0.875rem] font-bold">
                        {item.title || noteKind[item.kind].label}
                      </span>
                      <span className="text-xs text-[var(--ink-45)]">
                        {noteKind[item.kind].label} · {formatDate(item.occurredAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : (
            <div className="flex-1" />
          )}

          <form action={deleteNote}>
            <input type="hidden" name="id" value={note.id} />
            <button
              type="submit"
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 font-display text-sm font-bold text-red-700 transition-colors hover:bg-red-50"
            >
              <Trash2 className="size-4" />
              Supprimer la note
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
