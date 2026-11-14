import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  FileSignature,
  Hammer,
  Mail,
  PhoneCall,
  Plus,
  Receipt,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { createNote } from "./notes/actions";

import { PipelineFunnel, RevenueBars } from "@/components/admin/crm/charts";
import { TaskList } from "@/components/admin/crm/task-list";
import { ActionLink, AdminHeader, Panel, Pill, StatCard } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { formatDate, formatDateTime, formatMoneyShort, formatRelative, formatTime } from "@/lib/crm/format";
import { dealStage, quoteStatus, toneClasses } from "@/lib/crm/labels";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Tableau de bord" };
export const dynamic = "force-dynamic";

function greeting() {
  const hour = Number(new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "numeric" }).format(new Date()));
  return hour < 5 || hour >= 18 ? "Bonsoir" : "Bonjour";
}

export default async function AdminHomePage() {
  const user = await requireUser();
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const endOfToday = new Date(now);
  endOfToday.setUTCHours(23, 59, 59, 999);

  const [salesDeals, productionDeals, pendingQuotes, openInvoices, paymentsThisMonth, tasks, bookings, messages, activities] =
    await Promise.all([
      prisma.deal.findMany({
        where: { stage: { in: ["LEAD", "DISCOVERY", "PROPOSAL", "NEGOTIATION"] } },
        select: { amountCents: true, probability: true },
      }),
      prisma.deal.findMany({
        where: { stage: { in: ["WON", "IN_PROGRESS", "REVIEW"] } },
        orderBy: { dueDate: { sort: "asc", nulls: "last" } },
        include: { client: { select: { name: true } }, milestones: { select: { doneAt: true } } },
        take: 6,
      }),
      prisma.quote.findMany({
        where: { status: { in: ["SENT", "VIEWED"] } },
        orderBy: { sentAt: "desc" },
        include: { client: { select: { name: true } } },
      }),
      prisma.invoice.findMany({
        where: { status: "ISSUED" },
        include: { payments: { select: { amountCents: true } }, client: { select: { name: true } } },
      }),
      prisma.payment.aggregate({ where: { receivedAt: { gte: monthStart } }, _sum: { amountCents: true } }),
      prisma.task.findMany({
        where: { status: { not: "DONE" }, dueAt: { lte: endOfToday } },
        orderBy: [{ dueAt: "asc" }, { priority: "desc" }],
        include: { client: { select: { id: true, name: true } }, deal: { select: { id: true, title: true } } },
        take: 8,
      }),
      prisma.booking.findMany({
        where: { status: "CONFIRMED", startsAt: { gte: new Date(now.getTime() - 3600000) } },
        orderBy: { startsAt: "asc" },
        take: 5,
      }),
      prisma.contactMessage.findMany({ where: { status: "NEW" }, orderBy: { createdAt: "desc" }, take: 4 }),
      prisma.activity.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { client: { select: { id: true, name: true } } },
      }),
    ]);

  const pipeline = salesDeals.reduce((sum, deal) => sum + (deal.amountCents ?? 0), 0);
  const weighted = salesDeals.reduce((sum, deal) => sum + ((deal.amountCents ?? 0) * (deal.probability ?? 50)) / 100, 0);
  const pendingTotal = pendingQuotes.reduce((sum, quote) => sum + quote.totalCents, 0);
  const due = openInvoices.reduce(
    (sum, invoice) => sum + invoice.totalCents - invoice.payments.reduce((total, payment) => total + payment.amountCents, 0),
    0,
  );
  const overdue = openInvoices.filter((invoice) => invoice.dueDate && invoice.dueDate < now);

  // Encaissements des 12 derniers mois (en euros), mois de Paris.
  const yearAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
  const [payments, stageTotals] = await Promise.all([
    prisma.payment.findMany({
      where: { receivedAt: { gte: yearAgo }, invoice: { currency: "EUR" } },
      select: { amountCents: true, receivedAt: true },
    }),
    prisma.deal.groupBy({
      by: ["stage"],
      where: { stage: { in: ["LEAD", "DISCOVERY", "PROPOSAL", "NEGOTIATION", "WON"] } },
      _count: true,
      _sum: { amountCents: true },
    }),
  ]);
  const monthKey = (date: Date) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit" }).format(date).slice(0, 7);
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11 + index, 15));
    const key = monthKey(date);
    return {
      key,
      label: new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", month: "long", year: "numeric" }).format(date),
      cents: payments.filter((payment) => monthKey(payment.receivedAt) === key).reduce((sum, payment) => sum + payment.amountCents, 0),
    };
  });
  const funnel = (["LEAD", "DISCOVERY", "PROPOSAL", "NEGOTIATION", "WON"] as const).map((stage) => {
    const row = stageTotals.find((item) => item.stage === stage);
    return { key: stage, label: dealStage[stage].label, count: row?._count ?? 0, cents: row?._sum.amountCents ?? 0 };
  });

  const firstName = (user?.name ?? "").split(" ")[0];

  return (
    <>
      <AdminHeader
        title={`${greeting()}${firstName ? ` ${firstName}` : ""}.`}
        subtitle={new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "long", day: "numeric", month: "long" }).format(now)}
        action={
          <div className="flex flex-wrap gap-2">
            <ActionLink href="/admin/clients/new" variant="secondary">
              <Plus className="size-4" />
              Client
            </ActionLink>
            <ActionLink href="/admin/quotes/new">
              <FileSignature className="size-4" />
              Nouveau devis
            </ActionLink>
          </div>
        }
        eyebrow="Tableau de bord"
      >
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard color="blue"
            label="En négociation"
            value={formatMoneyShort(pipeline)}
            hint={`Pondéré : ${formatMoneyShort(weighted)}`}
            icon={<BriefcaseBusiness className="size-4" />}
            href="/admin/deals"
          />
          <StatCard color="teal"
            label="Devis en attente"
            value={formatMoneyShort(pendingTotal)}
            chip={`${pendingQuotes.length} devis`}
            hint="à signer"
            icon={<FileSignature className="size-4" />}
            href="/admin/quotes"
          />
          <StatCard color="teal"
            label="À encaisser"
            value={formatMoneyShort(due)}
            chip={overdue.length ? `${overdue.length} en retard` : undefined}
            hint={overdue.length ? undefined : "Aucun retard"}
            icon={<Receipt className="size-4" />}
            href="/admin/invoices"
          />
          <StatCard color="green"
            label="Encaissé ce mois"
            value={formatMoneyShort(paymentsThisMonth._sum.amountCents ?? 0)}
            icon={<Wallet className="size-4" />}
            href="/admin/invoices?filter=paid"
          />
        </div>

      </AdminHeader>

      <div className="mb-4 grid items-stretch gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Encaissements" description="Virements reçus, 12 derniers mois (EUR)" icon={<Wallet className="size-4" />} action={<Link href="/admin/invoices?filter=paid" className="font-display text-xs font-bold text-aegean-700 hover:underline">Factures payées</Link>}>
          <RevenueBars months={months} />
        </Panel>
        <Panel title="Prospection" description="Projets et montants par étape" icon={<BriefcaseBusiness className="size-4" />} action={<Link href="/admin/deals" className="font-display text-xs font-bold text-aegean-700 hover:underline">Tableau</Link>}>
          <PipelineFunnel stages={funnel} />
        </Panel>
      </div>

      <div className="grid items-stretch gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-4">
          <Panel title="À faire aujourd'hui" icon={<CheckSquare className="size-4" />}>
            <TaskList tasks={tasks} showContext emptyLabel="Rien d'urgent. Profitez-en pour relancer un devis." />
            <Link href="/admin/tasks" className="mt-3 inline-flex items-center gap-1 font-display text-sm font-bold text-aegean-700 hover:underline">
              Toutes les tâches <ArrowRight className="size-3.5" />
            </Link>
          </Panel>

          <Panel title="En production" icon={<Hammer className="size-4" />} className="flex-1">
            {productionDeals.length === 0 ? (
              <p className="text-[0.875rem] text-[var(--ink-45)]">Aucun projet en cours de production.</p>
            ) : (
              <ul className="grid gap-2">
                {productionDeals.map((deal) => {
                  const done = deal.milestones.filter((m) => m.doneAt).length;
                  const progress = deal.milestones.length ? Math.round((done / deal.milestones.length) * 100) : 0;
                  return (
                    <li key={deal.id}>
                      <Link href={`/admin/deals/${deal.id}`} className="block rounded-[14px] px-3 py-2.5 hover:bg-aegean-50">
                        <div className="flex items-center gap-2">
                          <span className="min-w-0 flex-1 truncate font-display text-[0.9375rem] font-bold">{deal.title}</span>
                          <Pill className={toneClasses[dealStage[deal.stage].tone]}>{dealStage[deal.stage].label}</Pill>
                        </div>
                        <div className="mt-1.5 flex items-center gap-3 text-xs text-[var(--ink-45)]">
                          <span className="truncate">{deal.client.name}</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/5">
                            <div className="h-full rounded-full bg-aegean-500" style={{ width: `${progress}%` }} />
                          </div>
                          <span>{deal.dueDate ? formatDate(deal.dueDate) : "—"}</span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-4">
          <Panel title="Prochains appels" icon={<CalendarDays className="size-4" />}>
            {bookings.length === 0 ? (
              <p className="text-[0.875rem] text-[var(--ink-45)]">Aucun rendez-vous à venir.</p>
            ) : (
              <ul className="grid gap-2">
                {bookings.map((booking) => (
                  <li key={booking.id} className="flex items-center gap-3 rounded-[14px] bg-aegean-50/60 px-3 py-2.5">
                    <span className="grid w-14 shrink-0 text-center">
                      <span className="font-display text-[0.9375rem] font-extrabold text-aegean-700">{formatTime(booking.startsAt)}</span>
                      <span className="text-[0.625rem] text-[var(--ink-45)]">{formatDate(booking.startsAt)}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-[0.875rem] font-bold">{booking.name}</span>
                      <span className="block truncate text-xs text-[var(--ink-45)]">{booking.company ?? booking.topic ?? booking.email}</span>
                    </span>
                    {booking.clientId ? (
                      <form action={createNote}>
                        <input type="hidden" name="clientId" value={booking.clientId} />
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <input type="hidden" name="kind" value="CALL" />
                        <button type="submit" title="Prendre des notes" className="grid size-9 cursor-pointer place-items-center rounded-full bg-aegean-600 text-white">
                          <PhoneCall className="size-4" />
                        </button>
                      </form>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            <Link href="/admin/bookings" className="mt-3 inline-flex items-center gap-1 font-display text-sm font-bold text-aegean-700 hover:underline">
              <CalendarDays className="size-3.5" /> Agenda
            </Link>
          </Panel>

          {pendingQuotes.length > 0 ? (
            <Panel title="Devis à suivre" icon={<FileSignature className="size-4" />}>
              <ul className="grid gap-1.5">
                {pendingQuotes.slice(0, 5).map((quote) => (
                  <li key={quote.id}>
                    <Link href={`/admin/quotes/${quote.id}`} className="flex items-center gap-2 rounded-field px-2 py-2 hover:bg-aegean-50">
                      <span className="min-w-0 flex-1 truncate text-[0.875rem]">
                        <span className="font-display font-bold">{quote.client.name}</span> · {formatMoneyShort(quote.totalCents)}
                      </span>
                      <Pill className={toneClasses[quoteStatus[quote.status].tone]}>{quoteStatus[quote.status].label}</Pill>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}

          {messages.length > 0 ? (
            <Panel title="Nouvelles demandes" icon={<Mail className="size-4" />}>
              <ul className="grid gap-1.5">
                {messages.map((message) => (
                  <li key={message.id}>
                    <Link href="/admin/messages" className="flex items-center gap-2 rounded-field px-2 py-2 hover:bg-aegean-50">
                      <Mail className="size-4 shrink-0 text-aegean-600" />
                      <span className="min-w-0 flex-1 truncate text-[0.875rem]">
                        <span className="font-display font-bold">{message.name}</span> · {message.subject}
                      </span>
                      <span className="text-xs text-[var(--ink-45)]">{formatRelative(message.createdAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}

          <Panel title="Activité récente" icon={<Activity className="size-4" />} className="flex-1">
            {activities.length === 0 ? (
              <p className="text-[0.875rem] text-[var(--ink-45)]">Rien pour l&apos;instant.</p>
            ) : (
              <ul className="grid gap-2 text-[0.8125rem]">
                {activities.map((activity) => (
                  <li key={activity.id} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-aegean-400" />
                    <span className="min-w-0 flex-1 text-[var(--ink-65)]">
                      {activity.client ? (
                        <Link href={`/admin/clients/${activity.client.id}`} className="font-bold text-ink hover:underline">
                          {activity.client.name}
                        </Link>
                      ) : null}
                      {activity.client ? " — " : ""}
                      {activity.message}
                    </span>
                    <span className="shrink-0 text-[var(--ink-45)]" title={formatDateTime(activity.createdAt)}>
                      {formatRelative(activity.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
