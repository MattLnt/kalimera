import { Check, FileSignature, Pencil, PhoneCall, Receipt, StickyNote, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { addDefaultMilestones, addMilestone, deleteMilestone, setDealStage, toggleMilestone } from "../actions";
import { createNote } from "../../notes/actions";

import { Pill as VividPill, readableOn } from "@/components/admin/board/pill";
import { QuickTaskForm, TaskList } from "@/components/admin/crm/task-list";
import { AdminHeader, Panel, Pill } from "@/components/admin/ui";
import { DatePicker } from "@/components/ui/date-picker";
import { formatDate, formatDateTime, formatMoney, formatRelative } from "@/lib/crm/format";
import { dealStages, noteKind, toneClasses } from "@/lib/crm/labels";
import { dealStageOptions, invoiceStateOptions, optionOf, quoteStatusOptions } from "@/lib/crm/vivid";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deal = await prisma.deal.findUnique({ where: { id }, select: { title: true } });
  return { title: deal?.title ?? "Projet" };
}

/** Le chemin principal d'un projet ; « Perdu » et « Maintenance » sont à part. */
const track = dealStages.filter((stage) => !["LOST", "MAINTENANCE"].includes(stage.value));

export default async function DealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true } },
      milestones: { orderBy: { position: "asc" } },
      tasks: { orderBy: [{ status: "asc" }, { dueAt: "asc" }] },
      notes: { orderBy: { occurredAt: "desc" }, take: 20 },
      quotes: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { createdAt: "asc" }, include: { payments: { select: { amountCents: true } } } },
      activities: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!deal) notFound();

  const currentIndex = track.findIndex((item) => item.value === deal.stage);
  const done = deal.milestones.filter((milestone) => milestone.doneAt).length;
  const progress = deal.milestones.length ? Math.round((done / deal.milestones.length) * 100) : 0;
  const liveInvoices = deal.invoices.filter((invoice) => invoice.status !== "DRAFT" && invoice.status !== "CANCELLED");
  const billing = {
    signed: deal.quotes.filter((quote) => quote.status === "SIGNED").reduce((sum, quote) => sum + quote.totalCents, 0),
    billed: liveInvoices.reduce((sum, invoice) => sum + (invoice.kind === "CREDIT_NOTE" ? -invoice.totalCents : invoice.totalCents), 0),
    paid: liveInvoices.reduce((sum, invoice) => sum + invoice.payments.reduce((total, payment) => total + payment.amountCents, 0), 0),
    base: 1,
  };
  billing.base = Math.max(billing.signed, billing.billed, 1);

  const quickAction =
    "inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 font-display text-[0.8125rem] font-bold shadow-soft transition-colors hover:bg-aegean-50 cursor-pointer";

  return (
    <>
      <AdminHeader
        title={deal.title}
        subtitle={undefined}
        back={{ href: "/admin/deals", label: "Projets" }}
        action={
          <Link href={`/admin/deals/${deal.id}/edit`} className={quickAction}>
            <Pencil className="size-4" />
            Modifier
          </Link>
        }
      />
      <p className="-mt-5 mb-5 flex flex-wrap items-center gap-2 text-[0.9375rem] text-[var(--ink-65)]">
        <Link href={`/admin/clients/${deal.client.id}`} className="font-display font-bold text-aegean-700 hover:underline">
          {deal.client.name}
        </Link>
        <VividPill option={optionOf(dealStageOptions, deal.stage)} />
        {deal.amountCents ? <span>· {formatMoney(deal.amountCents)} HT</span> : null}
      </p>

      {/* ---------------------------------------------------- étapes */}
      <div className="surface-card mb-4 overflow-x-auto p-2 [scrollbar-width:none]">
        <ol className="flex min-w-max gap-1">
          {track.map((item, index) => {
            const reached = currentIndex >= index && deal.stage !== "LOST";
            const isCurrent = item.value === deal.stage;
            const color = optionOf(dealStageOptions, item.value).color;
            return (
              <li key={item.value} className="flex-1">
                <form action={setDealStage}>
                  <input type="hidden" name="id" value={deal.id} />
                  <input type="hidden" name="stage" value={item.value} />
                  <button
                    type="submit"
                    style={isCurrent ? { background: color, color: readableOn(color) } : undefined}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[12px] px-3 py-2.5 font-display text-[0.8125rem] font-bold whitespace-nowrap transition-colors",
                      isCurrent
                        ? "shadow-[0_8px_16px_-10px_rgba(7,33,63,0.6)]"
                        : reached
                          ? "bg-aegean-50 text-aegean-700 hover:bg-aegean-100"
                          : "text-[var(--ink-45)] hover:bg-black/5",
                    )}
                  >
                    {reached && !isCurrent ? <Check className="size-3.5" style={{ color }} /> : null}
                    {item.label}
                  </button>
                </form>
              </li>
            );
          })}
          <li>
            <form action={setDealStage}>
              <input type="hidden" name="id" value={deal.id} />
              <input type="hidden" name="stage" value={deal.stage === "LOST" ? "LEAD" : "LOST"} />
              <button
                type="submit"
                className={cn(
                  "cursor-pointer rounded-[12px] px-3 py-2.5 font-display text-[0.8125rem] font-bold whitespace-nowrap",
                  deal.stage === "LOST" ? "bg-[#64748B] text-white" : "text-[#0B3A75] hover:bg-[#EEF3FA]",
                )}
              >
                {deal.stage === "LOST" ? "Perdu · rouvrir" : "Perdu"}
              </button>
            </form>
          </li>
        </ol>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <form action={createNote}>
          <input type="hidden" name="clientId" value={deal.client.id} />
          <input type="hidden" name="dealId" value={deal.id} />
          <input type="hidden" name="kind" value="CALL" />
          <button type="submit" className={`${quickAction} bg-aegean-600! text-white! hover:bg-aegean-700!`}>
            <PhoneCall className="size-4" />
            Démarrer un appel
          </button>
        </form>
        <form action={createNote}>
          <input type="hidden" name="clientId" value={deal.client.id} />
          <input type="hidden" name="dealId" value={deal.id} />
          <input type="hidden" name="kind" value="NOTE" />
          <button type="submit" className={quickAction}>
            <StickyNote className="size-4" />
            Note
          </button>
        </form>
        <Link href={`/admin/quotes/new?clientId=${deal.client.id}&dealId=${deal.id}`} className={quickAction}>
          <FileSignature className="size-4" />
          Nouveau devis
        </Link>
      </div>

      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          {/* ---------------------------------------------------- jalons */}
          <Panel title="Étapes de production">
            {deal.milestones.length > 0 ? (
              <div className="mb-4">
                <div className="mb-1.5 flex justify-between text-xs font-bold text-[var(--ink-45)]">
                  <span>
                    {done} / {deal.milestones.length} terminées
                  </span>
                  <span>{progress} %</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-aegean-400 to-aegean-600 transition-[width]" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : null}

            <ol className="grid gap-1">
              {deal.milestones.map((milestone) => (
                <li key={milestone.id} className="group flex items-center gap-3 rounded-field px-2 py-2 hover:bg-black/[0.02]">
                  <form action={toggleMilestone}>
                    <input type="hidden" name="id" value={milestone.id} />
                    <button
                      type="submit"
                      aria-label={milestone.doneAt ? "Rouvrir l'étape" : "Terminer l'étape"}
                      className={cn(
                        "grid size-6 cursor-pointer place-items-center rounded-full border-2 transition-colors",
                        milestone.doneAt ? "border-green-600 bg-green-600 text-white" : "border-black/20 hover:border-aegean-500",
                      )}
                    >
                      {milestone.doneAt ? <Check className="size-3.5" strokeWidth={3} /> : null}
                    </button>
                  </form>
                  <span className={cn("flex-1 font-display text-[0.9375rem] font-semibold", milestone.doneAt && "text-[var(--ink-45)] line-through")}>
                    {milestone.title}
                  </span>
                  <span className="text-xs text-[var(--ink-45)]">
                    {milestone.doneAt ? `Fait le ${formatDate(milestone.doneAt)}` : milestone.dueDate ? `Prévu le ${formatDate(milestone.dueDate)}` : ""}
                  </span>
                  <form action={deleteMilestone} className="opacity-0 transition-opacity group-hover:opacity-100">
                    <input type="hidden" name="id" value={milestone.id} />
                    <button type="submit" aria-label="Supprimer l'étape" className="grid size-7 cursor-pointer place-items-center rounded-full text-[var(--ink-45)] hover:bg-[#EEF3FA] hover:text-[#0B3A75]">
                      <Trash2 className="size-3.5" />
                    </button>
                  </form>
                </li>
              ))}
            </ol>

            {deal.milestones.length === 0 ? (
              <form action={addDefaultMilestones} className="mb-3">
                <input type="hidden" name="dealId" value={deal.id} />
                <button type="submit" className="cursor-pointer rounded-full bg-aegean-50 px-4 py-2 font-display text-sm font-bold text-aegean-700 hover:bg-aegean-100">
                  Ajouter les étapes types : cadrage, design, développement, recette, mise en ligne
                </button>
              </form>
            ) : null}

            <form action={addMilestone} className="mt-2 flex flex-wrap gap-2">
              <input type="hidden" name="dealId" value={deal.id} />
              <input name="title" required placeholder="Nouvelle étape…" className="field-input min-w-0 flex-1 py-2.5" aria-label="Nouvelle étape" />
              <DatePicker name="dueDate" placeholder="Date prévue" className="w-52" aria-label="Date prévue" />
              <button type="submit" className="cursor-pointer rounded-full bg-aegean-600 px-4 font-display text-sm font-bold text-white">
                Ajouter
              </button>
            </form>
          </Panel>

          <Panel title="Notes & comptes rendus" className="flex-1">
            {deal.notes.length === 0 ? (
              <p className="text-[0.875rem] text-[var(--ink-45)]">Aucune note rattachée à ce projet.</p>
            ) : (
              <ul className="grid gap-1.5">
                {deal.notes.map((note) => (
                  <li key={note.id}>
                    <Link href={`/admin/notes/${note.id}`} className="flex items-center gap-2 rounded-field px-2 py-2 hover:bg-aegean-50">
                      <Pill className={toneClasses[noteKind[note.kind].tone]}>{noteKind[note.kind].label}</Pill>
                      <span className="min-w-0 flex-1 truncate font-display text-[0.9375rem] font-bold">{note.title || "Sans titre"}</span>
                      <span className="text-xs text-[var(--ink-45)]">{formatDateTime(note.occurredAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-4">
          <Panel title="Informations">
            <dl className="grid grid-cols-2 gap-3 text-[0.875rem]">
              <div>
                <dt className="text-xs text-[var(--ink-45)]">Montant</dt>
                <dd className="font-display font-bold">{deal.amountCents ? formatMoney(deal.amountCents) : "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--ink-45)]">Probabilité</dt>
                <dd className="font-display font-bold">{deal.probability !== null ? `${deal.probability} %` : "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--ink-45)]">Démarrage</dt>
                <dd className="font-display font-bold">{formatDate(deal.startDate)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--ink-45)]">Livraison</dt>
                <dd className={cn("font-display font-bold", deal.dueDate && deal.dueDate < new Date() && !deal.deliveredAt && "text-[#0B3A75]")}>
                  {formatDate(deal.deliveredAt ?? deal.dueDate)}
                </dd>
              </div>
            </dl>
            {deal.description ? (
              <p className="mt-4 border-t border-black/5 pt-4 text-[0.875rem] leading-relaxed whitespace-pre-wrap text-[var(--ink-65)]">
                {deal.description}
              </p>
            ) : null}
            {deal.lostReason ? <p className="mt-3 text-[0.875rem] text-[#0B3A75]">Perdu : {deal.lostReason}</p> : null}
          </Panel>

          <Panel
            title="Facturation"
            description="Devis, acomptes, solde : autant qu'il en faut."
            action={
              <div className="flex gap-1">
                <Link href={`/admin/quotes/new?clientId=${deal.client.id}&dealId=${deal.id}`} className="rounded-full bg-aegean-50 px-3 py-1.5 font-display text-[0.75rem] font-bold text-aegean-700 hover:bg-aegean-100">
                  + Devis
                </Link>
                <Link href={`/admin/invoices/new?clientId=${deal.client.id}&dealId=${deal.id}`} className="rounded-full bg-aegean-50 px-3 py-1.5 font-display text-[0.75rem] font-bold text-aegean-700 hover:bg-aegean-100">
                  + Facture
                </Link>
              </div>
            }
          >
            <div className="mb-4 grid gap-3">
              <div className="grid grid-cols-3 gap-2">
                <BillingFigure label="Signé" value={formatMoney(billing.signed)} />
                <BillingFigure label="Facturé" value={formatMoney(billing.billed)} />
                <BillingFigure label="Encaissé" value={formatMoney(billing.paid)} tone="text-emerald-700" />
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-black/[0.06]" title="Facturé et encaissé, sur le montant signé">
                <div className="absolute inset-y-0 left-0 rounded-full bg-aegean-300" style={{ width: `${Math.min(100, (billing.billed / billing.base) * 100)}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-emerald-500" style={{ width: `${Math.min(100, (billing.paid / billing.base) * 100)}%` }} />
              </div>
              {billing.signed > billing.billed ? (
                <p className="text-[0.8125rem] text-[var(--ink-65)]">
                  Reste à facturer : <span className="font-display font-bold text-ink">{formatMoney(billing.signed - billing.billed)}</span>
                </p>
              ) : null}
            </div>

            {deal.quotes.length ? <p className="mb-1.5 font-display text-[0.6875rem] font-bold tracking-[0.06em] text-[var(--ink-45)] uppercase">Devis ({deal.quotes.length})</p> : null}
            <ul className="mb-3 grid grid-cols-[minmax(0,1fr)] gap-1">
              {deal.quotes.map((quote) => (
                <li key={quote.id}>
                  <Link href={`/admin/quotes/${quote.id}`} className="flex items-center gap-2 rounded-[12px] px-2 py-2 hover:bg-aegean-50">
                    <FileSignature className="size-4 shrink-0 text-[var(--ink-45)]" />
                    <span className="min-w-0 flex-1 truncate text-[0.875rem]">
                      <span className="font-display font-bold">{quote.number ?? "Brouillon"}</span> · {formatMoney(quote.totalCents)}
                    </span>
                    <VividPill option={optionOf(quoteStatusOptions, quote.status)} />
                  </Link>
                </li>
              ))}
            </ul>

            {deal.invoices.length ? <p className="mb-1.5 font-display text-[0.6875rem] font-bold tracking-[0.06em] text-[var(--ink-45)] uppercase">Factures ({deal.invoices.length})</p> : null}
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-1">
              {deal.invoices.map((invoice) => (
                <li key={invoice.id}>
                  <Link href={`/admin/invoices/${invoice.id}`} className="flex items-center gap-2 rounded-[12px] px-2 py-2 hover:bg-aegean-50">
                    <Receipt className="size-4 shrink-0 text-[var(--ink-45)]" />
                    <span className="min-w-0 flex-1 truncate text-[0.875rem]">
                      <span className="font-display font-bold">{shortKind[invoice.kind]}</span>
                      <span className="text-[var(--ink-45)]">{invoice.number ? ` ${invoice.number}` : ""}</span> · {formatMoney(invoice.kind === "CREDIT_NOTE" ? -invoice.totalCents : invoice.totalCents)}
                    </span>
                    <VividPill option={optionOf(invoiceStateOptions, invoiceState(invoice))} />
                  </Link>
                </li>
              ))}
            </ul>
            {deal.quotes.length + deal.invoices.length === 0 ? <p className="text-[0.875rem] text-[var(--ink-45)]">Aucun document. Créez un devis, ou une facture hors devis.</p> : null}
          </Panel>

          <Panel title="Tâches">
            <TaskList tasks={deal.tasks} />
            <QuickTaskForm dealId={deal.id} clientId={deal.client.id} />
          </Panel>

          <Panel title="Activité" className="flex-1">
            <ul className="grid gap-2 text-[0.8125rem]">
              {deal.activities.map((activity) => (
                <li key={activity.id} className="flex gap-2 text-[var(--ink-65)]">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-aegean-400" />
                  <span className="flex-1">{activity.message}</span>
                  <span className="shrink-0 text-[var(--ink-45)]">{formatRelative(activity.createdAt)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}

function invoiceState(invoice: { status: string; dueDate: Date | null; payments: { amountCents: number }[] }) {
  const paid = invoice.payments.reduce((sum, payment) => sum + payment.amountCents, 0);
  if (invoice.status === "ISSUED" && invoice.dueDate && invoice.dueDate < new Date()) return "OVERDUE";
  if (invoice.status === "ISSUED" && paid > 0) return "PARTIAL";
  return invoice.status;
}

function BillingFigure({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-[14px] bg-[#F5F8FC] px-3 py-2.5">
      <p className="font-display text-[0.625rem] font-bold tracking-[0.06em] text-[var(--ink-45)] uppercase">{label}</p>
      <p className={cn("font-display text-[1rem] font-extrabold", tone)}>{value}</p>
    </div>
  );
}

const shortKind: Record<string, string> = { DEPOSIT: "Acompte", BALANCE: "Solde", STANDARD: "Facture", CREDIT_NOTE: "Avoir" };
