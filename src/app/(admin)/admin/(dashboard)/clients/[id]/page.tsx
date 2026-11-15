import { Pill as VividPill } from "@/components/admin/board/pill";
import {
  BriefcaseBusiness,
  CalendarDays,
  FileSignature,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  PhoneCall,
  Pin,
  Receipt,
  StickyNote,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { addContact, deleteContact, makePrimaryContact, setClientStatus } from "../actions";
import { createNote } from "../../notes/actions";

import { QuickTaskForm, TaskList } from "@/components/admin/crm/task-list";
import { AdminHeader, Panel, Pill } from "@/components/admin/ui";
import { Select } from "@/components/ui/select";
import { daysAgo, formatDate, formatDateTime, formatMoney, formatMoneyShort, formatRelative, initials } from "@/lib/crm/format";
import {
  clientStatus,
  invoiceKind,
  invoiceStatus,
  noteKind,
  quoteStatus,
  toneClasses,
  toneDots,
} from "@/lib/crm/labels";
import { dealStageOptions, optionOf } from "@/lib/crm/vivid";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id }, select: { name: true } });
  return { title: client?.name ?? "Client" };
}

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] },
      deals: { orderBy: { updatedAt: "desc" } },
      notes: { orderBy: [{ pinned: "desc" }, { occurredAt: "desc" }], take: 60 },
      quotes: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { createdAt: "desc" }, include: { payments: { select: { amountCents: true } } } },
      tasks: {
        where: { OR: [{ status: { not: "DONE" } }, { completedAt: { gte: daysAgo(7) } }] },
        orderBy: [{ status: "asc" }, { dueAt: "asc" }],
        take: 30,
      },
      activities: { orderBy: { createdAt: "desc" }, take: 40 },
      bookings: { orderBy: { startsAt: "desc" }, take: 10 },
      messages: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!client) notFound();

  const status = clientStatus[client.status];
  const openDeals = client.deals.filter((deal) => !["LOST", "DELIVERED"].includes(deal.stage));
  const pendingQuotes = client.quotes.filter((quote) => ["SENT", "VIEWED"].includes(quote.status));
  const issued = client.invoices.filter((invoice) => invoice.status !== "DRAFT" && invoice.status !== "CANCELLED");
  const invoiced = issued.reduce((sum, invoice) => sum + (invoice.kind === "CREDIT_NOTE" ? -invoice.totalCents : invoice.totalCents), 0);
  const collected = issued.reduce(
    (sum, invoice) => sum + invoice.payments.reduce((total, payment) => total + payment.amountCents, 0),
    0,
  );
  const pinned = client.notes.filter((note) => note.pinned);

  // Un seul fil : notes, rendez-vous, demandes et évènements, du plus récent
  // au plus ancien.
  type Entry = { id: string; at: Date; node: React.ReactNode };
  const timeline: Entry[] = [
    ...client.notes.map((note) => ({
      id: `n-${note.id}`,
      at: note.occurredAt,
      node: (
        <Link href={`/admin/notes/${note.id}`} className="block rounded-[16px] border border-black/5 bg-white p-4 transition-colors hover:border-aegean-200">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Pill className={toneClasses[noteKind[note.kind].tone]}>{noteKind[note.kind].label}</Pill>
            <span className="font-display text-[0.9375rem] font-bold">{note.title || "Sans titre"}</span>
            {note.pinned ? <Pin className="size-3.5 text-aegean-600" /> : null}
            <span className="ml-auto text-xs text-[var(--ink-45)]">
              {formatDateTime(note.occurredAt)}
              {note.durationMin ? ` · ${note.durationMin} min` : ""}
            </span>
          </div>
          {note.body.trim() ? (
            <div className="prose-admin line-clamp-6 text-[0.875rem] text-[var(--ink-65)]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.body}</ReactMarkdown>
            </div>
          ) : null}
        </Link>
      ),
    })),
    ...client.bookings.map((booking) => ({
      id: `b-${booking.id}`,
      at: booking.startsAt,
      node: (
        <div className="flex items-center gap-3 rounded-[16px] bg-aegean-50/70 px-4 py-3 text-[0.875rem]">
          <CalendarDays className="size-4 text-aegean-700" />
          <span>
            Appel réservé en ligne — <strong>{formatDateTime(booking.startsAt)}</strong>
            {booking.status === "CANCELLED" ? " (annulé)" : ""}
          </span>
          {booking.status === "CONFIRMED" ? (
            <form action={createNote} className="ml-auto">
              <input type="hidden" name="clientId" value={client.id} />
              <input type="hidden" name="bookingId" value={booking.id} />
              <input type="hidden" name="kind" value="CALL" />
              <button type="submit" className="cursor-pointer rounded-full bg-white px-3 py-1.5 font-display text-xs font-bold text-aegean-700 shadow-soft">
                Prendre des notes
              </button>
            </form>
          ) : null}
        </div>
      ),
    })),
    ...client.messages.map((message) => ({
      id: `m-${message.id}`,
      at: message.createdAt,
      node: (
        <div className="rounded-[16px] border border-black/5 bg-white p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Pill className={toneClasses.amber}>Demande</Pill>
            <span className="font-display text-[0.9375rem] font-bold">{message.subject}</span>
            <span className="ml-auto text-xs text-[var(--ink-45)]">{formatDateTime(message.createdAt)}</span>
          </div>
          <p className="line-clamp-4 text-[0.875rem] whitespace-pre-wrap text-[var(--ink-65)]">{message.message}</p>
          {message.budget ? <p className="mt-2 text-xs text-[var(--ink-45)]">Budget indiqué : {message.budget}</p> : null}
        </div>
      ),
    })),
    ...client.activities
      .filter((activity) => !activity.type.startsWith("note."))
      .map((activity) => ({
        id: `a-${activity.id}`,
        at: activity.createdAt,
        node: (
          <p className="flex items-center gap-2 px-1 text-[0.8125rem] text-[var(--ink-45)]">
            <span className="size-1.5 rounded-full bg-black/20" />
            {activity.message}
            <span className="ml-auto">{formatRelative(activity.createdAt)}</span>
          </p>
        ),
      })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());

  const address = [client.addressLine1, client.addressLine2, [client.postalCode, client.city].filter(Boolean).join(" "), client.country !== "FR" ? client.country : null]
    .filter(Boolean)
    .join(", ");

  const quickAction =
    "inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 font-display text-[0.8125rem] font-bold text-ink shadow-soft transition-colors hover:bg-aegean-50 cursor-pointer";

  return (
    <>
      <AdminHeader title="" back={{ href: "/admin/clients", label: "Clients" }} />

      {/* ---------------------------------------------------- en-tête */}
      <div className="-mt-6 mb-6 flex flex-wrap items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-[18px] bg-gradient-to-br from-aegean-500 to-aegean-800 font-display text-lg font-bold text-white">
          {initials(client.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="display-3 truncate">{client.name}</h1>
            <Pill className={toneClasses[status.tone]} dot={toneDots[status.tone]}>
              {status.label}
            </Pill>
          </div>
          <p className="mt-0.5 text-[0.875rem] text-[var(--ink-45)]">
            {client.legalName ? `${client.legalName} · ` : ""}
            {client.source ? `Origine : ${client.source} · ` : ""}
            Fiche créée le {formatDate(client.createdAt)}
          </p>
        </div>
        <Link href={`/admin/clients/${client.id}/edit`} className={quickAction}>
          <Pencil className="size-4" />
          Modifier
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <form action={createNote}>
          <input type="hidden" name="clientId" value={client.id} />
          <input type="hidden" name="kind" value="CALL" />
          <button type="submit" className={`${quickAction} bg-aegean-600! text-white! hover:bg-aegean-700!`}>
            <PhoneCall className="size-4" />
            Démarrer un appel
          </button>
        </form>
        <form action={createNote}>
          <input type="hidden" name="clientId" value={client.id} />
          <input type="hidden" name="kind" value="NOTE" />
          <button type="submit" className={quickAction}>
            <StickyNote className="size-4" />
            Note
          </button>
        </form>
        <form action={createNote}>
          <input type="hidden" name="clientId" value={client.id} />
          <input type="hidden" name="kind" value="MEETING" />
          <button type="submit" className={quickAction}>
            <Users className="size-4" />
            Réunion
          </button>
        </form>
        <Link href={`/admin/deals/new?clientId=${client.id}`} className={quickAction}>
          <BriefcaseBusiness className="size-4" />
          Nouveau projet
        </Link>
        <Link href={`/admin/quotes/new?clientId=${client.id}`} className={quickAction}>
          <FileSignature className="size-4" />
          Nouveau devis
        </Link>
      </div>

      {/* ---------------------------------------------------- chiffres */}
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Projets en cours", value: String(openDeals.length) },
          { label: "Devis en attente", value: pendingQuotes.length ? formatMoneyShort(pendingQuotes.reduce((s, q) => s + q.totalCents, 0)) : "0" },
          { label: "Facturé", value: formatMoneyShort(invoiced) },
          { label: "Encaissé", value: formatMoneyShort(collected) },
        ].map((stat) => (
          <div key={stat.label} className="surface-card p-4">
            <p className="font-display text-xs font-bold text-[var(--ink-45)]">{stat.label}</p>
            <p className="mt-1 font-display text-xl font-extrabold tracking-[-0.03em]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_340px]">
        {/* ---------------------------------------------------- fil */}
        <div className="flex flex-col gap-4">
          {client.summary ? (
            <div className="rounded-[20px] bg-[#E9F6F7] px-5 py-4 text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-[#0A4B52]">
              {client.summary}
            </div>
          ) : null}

          {pinned.length > 0 ? (
            <Panel title="Épinglé">
              <ul className="grid gap-2">
                {pinned.map((note) => (
                  <li key={note.id}>
                    <Link href={`/admin/notes/${note.id}`} className="flex items-center gap-2 rounded-field px-3 py-2 hover:bg-aegean-50">
                      <Pin className="size-3.5 text-aegean-600" />
                      <span className="font-display text-[0.9375rem] font-bold">{note.title || noteKind[note.kind].label}</span>
                      <span className="ml-auto text-xs text-[var(--ink-45)]">{formatDate(note.occurredAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}

          <Panel title="Historique" className="flex-1">
            {timeline.length === 0 ? (
              <p className="text-[0.9375rem] text-[var(--ink-45)]">
                Aucun échange pour l&apos;instant. Démarrez un appel ou ajoutez une note : tout s&apos;affichera ici.
              </p>
            ) : (
              <ol className="relative grid gap-3 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-black/10">
                {timeline.map((entry) => (
                  <li key={entry.id} className="relative pl-6">
                    <span className="absolute top-4 left-0 size-[11px] rounded-full border-2 border-white bg-aegean-400 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]" />
                    {entry.node}
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>

        {/* ---------------------------------------------------- colonne */}
        <div className="flex flex-col gap-4">
          <Panel title="Statut">
            <form action={setClientStatus} className="flex gap-2">
              <input type="hidden" name="id" value={client.id} />
              <Select
                name="status"
                className="flex-1"
                defaultValue={client.status}
                options={Object.entries(clientStatus).map(([value, item]) => ({ value, label: item.label }))}
              />
              <button type="submit" className="cursor-pointer rounded-full bg-black/5 px-4 font-display text-sm font-bold hover:bg-aegean-100">
                OK
              </button>
            </form>
          </Panel>

          <Panel title="Coordonnées">
            <ul className="grid gap-2.5 text-[0.875rem]">
              {client.email ? (
                <li className="flex items-center gap-2.5">
                  <Mail className="size-4 shrink-0 text-[var(--ink-45)]" />
                  <a href={`mailto:${client.email}`} className="truncate text-aegean-700 hover:underline">{client.email}</a>
                </li>
              ) : null}
              {client.phone ? (
                <li className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-[var(--ink-45)]" />
                  <a href={`tel:${client.phone}`} className="text-aegean-700 hover:underline">{client.phone}</a>
                </li>
              ) : null}
              {client.website ? (
                <li className="flex items-center gap-2.5">
                  <Globe className="size-4 shrink-0 text-[var(--ink-45)]" />
                  <a href={client.website} target="_blank" rel="noreferrer" className="truncate text-aegean-700 hover:underline">
                    {client.website.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              ) : null}
              {address ? (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--ink-45)]" />
                  {address}
                </li>
              ) : null}
              {client.siren || client.vatNumber ? (
                <li className="text-xs text-[var(--ink-45)]">
                  {client.siren ? `SIREN ${client.siren}` : ""}
                  {client.siren && client.vatNumber ? " · " : ""}
                  {client.vatNumber ? `TVA ${client.vatNumber}` : ""}
                </li>
              ) : null}
              {!client.email && !client.phone && !address ? (
                <li className="text-[var(--ink-45)]">
                  <Link href={`/admin/clients/${client.id}/edit`} className="text-aegean-700 hover:underline">Compléter la fiche</Link>
                </li>
              ) : null}
            </ul>
          </Panel>

          <Panel title="Interlocuteurs">
            <ul className="grid gap-3">
              {client.contacts.map((contact) => (
                <li key={contact.id} className="group text-[0.875rem]">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold">
                      {contact.firstName} {contact.lastName}
                    </span>
                    {contact.isPrimary ? <Pill className={toneClasses.blue}>Principal</Pill> : null}
                    <div className="ml-auto flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {!contact.isPrimary ? (
                        <form action={makePrimaryContact}>
                          <input type="hidden" name="id" value={contact.id} />
                          <button type="submit" className="cursor-pointer text-xs text-aegean-700 hover:underline">Principal</button>
                        </form>
                      ) : null}
                      <form action={deleteContact}>
                        <input type="hidden" name="id" value={contact.id} />
                        <button type="submit" className="cursor-pointer text-xs text-[#0B3A75] hover:underline">Retirer</button>
                      </form>
                    </div>
                  </div>
                  {contact.role ? <p className="text-xs text-[var(--ink-45)]">{contact.role}</p> : null}
                  <p className="flex flex-wrap gap-x-3 text-aegean-700">
                    {contact.email ? <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a> : null}
                    {contact.phone ? <a href={`tel:${contact.phone}`} className="hover:underline">{contact.phone}</a> : null}
                  </p>
                </li>
              ))}
            </ul>
            <details className="mt-3">
              <summary className="cursor-pointer font-display text-sm font-bold text-aegean-700">+ Ajouter un interlocuteur</summary>
              <form action={addContact} className="mt-3 grid gap-2">
                <input type="hidden" name="clientId" value={client.id} />
                <div className="grid grid-cols-2 gap-2">
                  <input name="firstName" required placeholder="Prénom" className="field-input py-2.5" />
                  <input name="lastName" placeholder="Nom" className="field-input py-2.5" />
                </div>
                <input name="role" placeholder="Fonction" className="field-input py-2.5" />
                <input name="email" type="email" placeholder="E-mail" className="field-input py-2.5" />
                <input name="phone" type="tel" placeholder="Téléphone" className="field-input py-2.5" />
                <button type="submit" className="cursor-pointer rounded-full bg-aegean-600 py-2.5 font-display text-sm font-bold text-white">Ajouter</button>
              </form>
            </details>
          </Panel>

          <Panel title="Projets">
            {client.deals.length === 0 ? (
              <p className="text-[0.875rem] text-[var(--ink-45)]">Aucun projet.</p>
            ) : (
              <ul className="grid gap-1.5">
                {client.deals.map((deal) => {
                  return (
                    <li key={deal.id}>
                      <Link href={`/admin/deals/${deal.id}`} className="flex items-center gap-2 rounded-field px-2 py-2 hover:bg-aegean-50">
                        <span className="min-w-0 flex-1 truncate font-display text-[0.875rem] font-bold">{deal.title}</span>
                        <VividPill option={optionOf(dealStageOptions, deal.stage)} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            <Link href={`/admin/deals/new?clientId=${client.id}`} className="mt-2 inline-block font-display text-sm font-bold text-aegean-700 hover:underline">
              + Nouveau projet
            </Link>
          </Panel>

          <Panel title="Devis & factures">
            <ul className="grid gap-1.5">
              {client.quotes.map((quote) => (
                <li key={quote.id}>
                  <Link href={`/admin/quotes/${quote.id}`} className="flex items-center gap-2 rounded-field px-2 py-2 hover:bg-aegean-50">
                    <FileSignature className="size-4 shrink-0 text-[var(--ink-45)]" />
                    <span className="min-w-0 flex-1 truncate text-[0.875rem]">
                      <span className="font-display font-bold">{quote.number ?? "Brouillon"}</span> · {formatMoney(quote.totalCents)}
                    </span>
                    <Pill className={toneClasses[quoteStatus[quote.status].tone]}>{quoteStatus[quote.status].label}</Pill>
                  </Link>
                </li>
              ))}
              {client.invoices.map((invoice) => {
                const paid = invoice.payments.reduce((s, p) => s + p.amountCents, 0);
                const state =
                  invoice.status === "ISSUED" && invoice.dueDate && invoice.dueDate < new Date()
                    ? "OVERDUE"
                    : invoice.status === "ISSUED" && paid > 0
                      ? "PARTIAL"
                      : invoice.status;
                return (
                  <li key={invoice.id}>
                    <Link href={`/admin/invoices/${invoice.id}`} className="flex items-center gap-2 rounded-field px-2 py-2 hover:bg-aegean-50">
                      <Receipt className="size-4 shrink-0 text-[var(--ink-45)]" />
                      <span className="min-w-0 flex-1 truncate text-[0.875rem]">
                        <span className="font-display font-bold">{invoice.number ?? invoiceKind[invoice.kind]}</span> · {formatMoney(invoice.totalCents)}
                      </span>
                      <Pill className={toneClasses[invoiceStatus[state].tone]}>{invoiceStatus[state].label}</Pill>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {client.quotes.length + client.invoices.length === 0 ? (
              <p className="text-[0.875rem] text-[var(--ink-45)]">Aucun document.</p>
            ) : null}
            <Link href={`/admin/quotes/new?clientId=${client.id}`} className="mt-2 inline-block font-display text-sm font-bold text-aegean-700 hover:underline">
              + Nouveau devis
            </Link>
          </Panel>

          <Panel title="Tâches" className="flex-1">
            <TaskList tasks={client.tasks} />
            <QuickTaskForm clientId={client.id} />
          </Panel>
        </div>
      </div>
    </>
  );
}
