import { ArrowLeft, BriefcaseBusiness, CalendarPlus, Inbox, Mail, Phone, Reply, Search, UserPlus, UserRound } from "lucide-react";
import Link from "next/link";

import { createClientFromMessage } from "./actions";
import { MessageStatus } from "./message-status";

import { Pill } from "@/components/admin/board/pill";
import { Avatar } from "@/components/admin/ui";
import type { Prisma } from "@/generated/prisma/client";
import { dealStageOptions, messageStatusOptions, optionOf } from "@/lib/crm/vivid";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const metadata = { title: "Demandes" };
export const dynamic = "force-dynamic";

const filters = [
  { key: "inbox", label: "Toutes" },
  { key: "new", label: "Nouvelles" },
  { key: "read", label: "Lues" },
  { key: "archived", label: "Archivées" },
] as const;
type FilterKey = (typeof filters)[number]["key"];

const timeFmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
const dayFmt = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "Europe/Paris" });
const fullFmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Paris" });

function bucket(date: Date, now: Date) {
  const day = (d: Date) => Math.floor((d.getTime() + 3600_000) / 86_400_000);
  const diff = day(now) - day(date);
  if (diff <= 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  if (diff < 7) return "Cette semaine";
  if (diff < 31) return "Ce mois-ci";
  return "Plus ancien";
}

function href(params: { filter?: FilterKey; q?: string; id?: string }) {
  const search = new URLSearchParams();
  if (params.filter && params.filter !== "inbox") search.set("filter", params.filter);
  if (params.q) search.set("q", params.q);
  if (params.id) search.set("id", params.id);
  const query = search.toString();
  return `/admin/messages${query ? `?${query}` : ""}`;
}

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ filter?: string; q?: string; id?: string }> }) {
  const params = await searchParams;
  const filter: FilterKey = filters.some((f) => f.key === params.filter) ? (params.filter as FilterKey) : "inbox";
  const q = (params.q ?? "").trim();
  const now = new Date();

  const statusWhere: Prisma.ContactMessageWhereInput =
    filter === "new" ? { status: "NEW" } : filter === "read" ? { status: "READ" } : filter === "archived" ? { status: "ARCHIVED" } : { status: { not: "ARCHIVED" } };
  const searchWhere: Prisma.ContactMessageWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { company: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { message: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [messages, counts] = await Promise.all([
    prisma.contactMessage.findMany({ where: { AND: [statusWhere, searchWhere] }, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.contactMessage.groupBy({ by: ["status"], _count: true }),
  ]);
  const count = (status: string) => counts.find((c) => c.status === status)?._count ?? 0;
  const filterCount: Record<FilterKey, number> = { inbox: count("NEW") + count("READ"), new: count("NEW"), read: count("READ"), archived: count("ARCHIVED") };

  // Ouvrir une nouvelle demande la marque comme lue.
  let selected = params.id ? await prisma.contactMessage.findUnique({ where: { id: params.id } }) : (messages[0] ?? null);
  if (selected && params.id && selected.status === "NEW") {
    selected = await prisma.contactMessage.update({ where: { id: selected.id }, data: { status: "READ" } });
  }

  const [client, previous, bookings] = selected
    ? await Promise.all([
        selected.clientId
          ? prisma.client.findUnique({
              where: { id: selected.clientId },
              select: { id: true, name: true, status: true, deals: { orderBy: { updatedAt: "desc" }, take: 4, select: { id: true, title: true, stage: true } } },
            })
          : null,
        prisma.contactMessage.findMany({ where: { email: selected.email, id: { not: selected.id } }, orderBy: { createdAt: "desc" }, take: 5 }),
        prisma.booking.findMany({ where: { email: selected.email }, orderBy: { startsAt: "desc" }, take: 3 }),
      ])
    : [null, [], []];

  const groups: { label: string; items: typeof messages }[] = [];
  for (const message of messages) {
    const label = bucket(message.createdAt, now);
    const last = groups.at(-1);
    if (last?.label === label) last.items.push(message);
    else groups.push({ label, items: [message] });
  }

  const bookingUrl = "https://kalimera.agency/fr/rendez-vous";

  const context = selected ? (
    <>
      <h3 className="font-display text-[0.9375rem] font-extrabold">Coordonnées</h3>
      <div className="mt-3 grid gap-2.5 text-[0.875rem]">
        <ContactLine href={`mailto:${selected.email}`} icon={<Mail className="size-3.5" />} text={selected.email} />
        {selected.phone ? <ContactLine href={`tel:${selected.phone.replace(/\s+/g, "")}`} icon={<Phone className="size-3.5" />} text={selected.phone} /> : null}
      </div>

      <div className="my-5 h-px bg-[#EDF1F6]" />
      <h3 className="font-display text-[0.9375rem] font-extrabold">Fiche client</h3>
      {client ? (
        <div className="mt-3 grid gap-2">
          <Link href={`/admin/clients/${client.id}`} className="flex items-center gap-3 rounded-[14px] bg-[#F5F7FB] p-3 hover:bg-aegean-50">
            <Avatar name={client.name} size="sm" />
            <span className="min-w-0 flex-1 truncate font-display text-[0.875rem] font-bold">{client.name}</span>
          </Link>
          {client.deals.map((deal) => (
            <Link key={deal.id} href={`/admin/deals/${deal.id}`} className="flex items-center gap-2 rounded-[12px] px-2 py-1.5 text-[0.8125rem] hover:bg-[#F5F7FB]">
              <span className="min-w-0 flex-1 truncate font-semibold">{deal.title}</span>
              <Pill option={optionOf(dealStageOptions, deal.stage)} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-[14px] border-[1.5px] border-dashed border-[#C9D4E3] p-3.5 text-[0.8125rem] leading-[1.55] text-[var(--ink-65)]">
          Pas encore de fiche. « Créer le client » reprend le nom, la société, l&apos;e-mail et le téléphone.
        </p>
      )}

      <div className="my-5 h-px bg-[#EDF1F6]" />
      <h3 className="font-display text-[0.9375rem] font-extrabold">Historique</h3>
      <ol className="mt-3 grid gap-3 text-[0.8125rem]">
        <TimelineItem color="var(--color-aegean-500)" title="Cette demande" date={dayFmt.format(selected.createdAt)} />
        {bookings.map((booking) => (
          <TimelineItem key={booking.id} color="var(--color-aegean-500)" title={booking.cancelledAt ? "Appel annulé" : "Appel réservé"} date={dayFmt.format(booking.startsAt)} />
        ))}
        {previous.map((message) => (
          <li key={message.id}>
            <Link href={href({ filter: "inbox", id: message.id })} className="flex gap-2.5 hover:underline">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#C9D4E3]" />
              <span>
                <span className="font-semibold">Demande « {message.subject} »</span>
                <span className="block text-[var(--ink-45)]">{dayFmt.format(message.createdAt)}</span>
              </span>
            </Link>
          </li>
        ))}
        {previous.length === 0 && bookings.length === 0 ? <li className="text-[var(--ink-45)]">Premier contact de cette adresse.</li> : null}
      </ol>
    </>
  ) : null;

  return (
    <div className="grid gap-4 lg:h-[calc(100dvh-7rem)] lg:grid-cols-[minmax(300px,360px)_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)_300px]">
      {/* ------------------------------------------------ liste */}
      <section
        aria-label="Liste des demandes"
        className={cn("flex min-h-0 flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_0_0_1px_#DFE6EF,0_16px_32px_-22px_rgba(7,33,63,0.28)]", params.id && "hidden lg:flex")}
      >
        <div className="grid gap-3.5 border-b border-[#EDF1F6] p-5">
          <div className="flex items-baseline gap-2">
            <h1 className="flex-1 font-display text-[1.625rem] font-extrabold tracking-[-0.035em]">Demandes</h1>
            {filterCount.new ? (
              <span className="font-display text-[0.8125rem] font-bold text-aegean-700">
                {filterCount.new} nouvelle{filterCount.new > 1 ? "s" : ""}
              </span>
            ) : null}
          </div>
          <form className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--ink-45)]" />
            {filter !== "inbox" ? <input type="hidden" name="filter" value={filter} /> : null}
            <input
              name="q"
              defaultValue={q}
              placeholder="Nom, société, e-mail, mot du message…"
              aria-label="Rechercher une demande"
              className="h-10 w-full rounded-[12px] bg-[#F3F6FB] pr-3 pl-10 text-[0.875rem] outline-none focus:shadow-[0_0_0_2px_var(--color-aegean-400)]"
            />
          </form>
          <nav aria-label="Filtres" className="flex flex-wrap gap-1.5">
            {filters.map((item) => (
              <Link
                key={item.key}
                href={href({ filter: item.key, q })}
                aria-current={filter === item.key ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 font-display text-[0.75rem] font-bold transition-colors",
                  filter === item.key ? "bg-ink text-white" : "bg-[#F1F4F8] text-[var(--ink-65)] hover:bg-[#E6EBF2] hover:text-ink",
                )}
              >
                {item.label}
                <span className={cn("ml-1.5", filter === item.key ? "text-white/60" : "text-[var(--ink-45)]")}>{filterCount[item.key]}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
          {messages.length === 0 ? (
            <div className="grid place-items-center gap-2 px-6 py-16 text-center">
              <span className="grid size-12 place-items-center rounded-[16px] bg-aegean-50 text-aegean-700">
                <Inbox className="size-5" />
              </span>
              <p className="font-display font-bold">{q ? "Aucun résultat" : "Rien ici"}</p>
              <p className="text-[0.8125rem] text-[var(--ink-45)]">{q ? "Essayez un autre mot." : "Les demandes du formulaire de contact arrivent ici, avec un e-mail."}</p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label} className="mb-2">
                <p className="px-3 pt-2 pb-1.5 font-display text-[0.6875rem] font-bold tracking-[0.08em] text-[var(--ink-45)] uppercase">{group.label}</p>
                <ul className="grid grid-cols-[minmax(0,1fr)] gap-1">
                  {group.items.map((message) => {
                    const active = selected?.id === message.id;
                    const unread = message.status === "NEW";
                    return (
                      <li key={message.id}>
                        <Link
                          href={href({ filter, q, id: message.id })}
                          aria-current={active ? "true" : undefined}
                          className={cn("flex gap-3 rounded-[16px] p-3 transition-colors", active ? "bg-aegean-50 shadow-[inset_0_0_0_1.5px_var(--color-aegean-400)]" : "hover:bg-[#F5F7FB]")}
                        >
                          <Avatar name={message.name} />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className={cn("min-w-0 flex-1 truncate font-display text-[0.9375rem]", unread ? "font-extrabold" : "font-semibold text-ink/80")}>{message.name}</span>
                              <span className="shrink-0 text-[0.6875rem] text-[var(--ink-45)] tabular-nums">
                                {bucket(message.createdAt, now) === "Aujourd'hui" ? timeFmt.format(message.createdAt) : dayFmt.format(message.createdAt)}
                              </span>
                            </span>
                            <span className="mt-0.5 block truncate text-[0.8125rem] font-semibold text-ink/75">
                              {message.subject}
                              {message.budget ? <span className="font-normal text-[var(--ink-45)]"> · {message.budget}</span> : null}
                            </span>
                            <span className="mt-0.5 block truncate text-[0.8125rem] text-[var(--ink-45)]">{message.message}</span>
                            {message.clientId || message.status === "ARCHIVED" ? (
                              <span className="mt-1.5 flex gap-1.5">
                                {message.clientId ? <Pill option={{ label: "Fiche client", color: "#64748B" }} /> : null}
                                {message.status === "ARCHIVED" ? <Pill option={optionOf(messageStatusOptions, "ARCHIVED")} /> : null}
                              </span>
                            ) : null}
                          </span>
                          {unread ? <span aria-label="Non lue" className="mt-1.5 size-2.5 shrink-0 rounded-full bg-aegean-500" /> : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ------------------------------------------------ lecture */}
      {selected ? (
        <section aria-label="Demande ouverte" className={cn("flex min-h-0 flex-col gap-4 overflow-y-auto", !params.id && "hidden lg:flex")}>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={href({ filter, q })}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-display text-[0.8125rem] font-bold shadow-[0_0_0_1px_#DFE6EF] lg:hidden"
            >
              <ArrowLeft className="size-4" />
              Demandes
            </Link>
            <MessageStatus key={`${selected.id}-${selected.status}`} id={selected.id} status={selected.status} />
            <span className="text-[0.8125rem] text-[var(--ink-65)] first-letter:uppercase">
              {fullFmt.format(selected.createdAt)} · formulaire du site ({selected.locale})
            </span>
          </div>

          <article className="rounded-[22px] bg-white p-6 shadow-[0_0_0_1px_#DFE6EF,0_16px_32px_-22px_rgba(7,33,63,0.28)] sm:p-7">
            <header className="flex items-center gap-4">
              <Avatar name={selected.name} size="lg" />
              <div className="min-w-0">
                <h2 className="truncate font-display text-[1.5rem] font-extrabold tracking-[-0.03em]">{selected.name}</h2>
                <p className="truncate text-[0.875rem] text-[var(--ink-65)]">{selected.company ?? selected.email}</p>
              </div>
            </header>

            <dl className="mt-5 grid gap-2.5 sm:grid-cols-3">
              <Fact label="Projet" value={selected.subject} />
              <Fact label="Budget" value={selected.budget ?? "Non précisé"} muted={!selected.budget} />
              <Fact label="Société" value={selected.company ?? "—"} muted={!selected.company} />
            </dl>

            <p className="mt-6 text-[0.9375rem] leading-[1.7] whitespace-pre-wrap text-ink/85">{selected.message}</p>
          </article>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <a
              href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re : ${selected.subject}`)}`}
              className="group flex flex-col gap-2 rounded-[18px] bg-aegean-600 p-4 text-white shadow-[0_14px_26px_-16px_rgba(21,98,184,0.9)] transition-transform hover:-translate-y-0.5"
            >
              <Reply className="size-5" />
              <span className="font-display text-[0.9375rem] font-extrabold">Répondre</span>
              <span className="text-[0.75rem] text-white/75">Dans votre messagerie</span>
            </a>
            {client ? (
              <ActionCard href={`/admin/clients/${client.id}`} icon={<UserRound className="size-5 text-aegean-600" />} title="Voir la fiche" hint={client.name} />
            ) : (
              <form action={createClientFromMessage} className="contents">
                <input type="hidden" name="id" value={selected.id} />
                <button type="submit" className="flex cursor-pointer flex-col gap-2 rounded-[18px] bg-white p-4 text-left shadow-[0_0_0_1px_#DFE6EF] transition-transform hover:-translate-y-0.5">
                  <UserPlus className="size-5 text-aegean-600" />
                  <span className="font-display text-[0.9375rem] font-extrabold">Créer le client</span>
                  <span className="text-[0.75rem] text-[var(--ink-45)]">Fiche pré-remplie</span>
                </button>
              </form>
            )}
            <ActionCard
              href={`mailto:${selected.email}?subject=${encodeURIComponent("Prenons rendez-vous")}&body=${encodeURIComponent(`Bonjour ${selected.name.split(/\s+/)[0]},\n\nMerci pour votre message. Choisissez le créneau qui vous convient pour en parler :\n${bookingUrl}\n\nÀ très vite,\nMatiaz — Kalimera`)}`}
              icon={<CalendarPlus className="size-5 text-aegean-600" />}
              title="Proposer un appel"
              hint="E-mail avec le lien de réservation"
            />
            <ActionCard
              href={client ? `/admin/deals/new?clientId=${client.id}` : "#"}
              disabled={!client}
              icon={<BriefcaseBusiness className="size-5 text-aegean-600" />}
              title="Ouvrir un projet"
              hint={client ? "Puis un devis" : "Créez d'abord la fiche"}
            />
          </div>

          <div className="rounded-[22px] bg-white p-5 shadow-[0_0_0_1px_#DFE6EF] 2xl:hidden">{context}</div>
        </section>
      ) : (
        <section className="hidden place-items-center rounded-[22px] border-2 border-dashed border-[#D5DEEA] lg:grid">
          <p className="text-[0.875rem] text-[var(--ink-45)]">Sélectionnez une demande.</p>
        </section>
      )}

      {/* ------------------------------------------------ contexte (grand écran) */}
      {selected ? (
        <aside aria-label="Contact" className="hidden min-h-0 overflow-y-auto rounded-[22px] bg-white p-5 shadow-[0_0_0_1px_#DFE6EF] 2xl:block">
          {context}
        </aside>
      ) : null}
    </div>
  );
}

function Fact({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="rounded-[14px] bg-[#F5F7FB] px-4 py-3">
      <dt className="font-display text-[0.6875rem] font-bold tracking-[0.06em] text-[var(--ink-45)] uppercase">{label}</dt>
      <dd className={cn("mt-1 truncate font-display text-[0.9375rem] font-extrabold", muted && "font-semibold text-[var(--ink-45)]")}>{value}</dd>
    </div>
  );
}

function ActionCard({ href, icon, title, hint, disabled }: { href: string; icon: React.ReactNode; title: string; hint: string; disabled?: boolean }) {
  const className = "flex flex-col gap-2 rounded-[18px] bg-white p-4 shadow-[0_0_0_1px_#DFE6EF] transition-transform";
  if (disabled) {
    return (
      <span aria-disabled className={cn(className, "opacity-55")}>
        {icon}
        <span className="font-display text-[0.9375rem] font-extrabold">{title}</span>
        <span className="text-[0.75rem] text-[var(--ink-45)]">{hint}</span>
      </span>
    );
  }
  const external = href.startsWith("mailto:");
  const inner = (
    <>
      {icon}
      <span className="font-display text-[0.9375rem] font-extrabold">{title}</span>
      <span className="text-[0.75rem] text-[var(--ink-45)]">{hint}</span>
    </>
  );
  return external ? (
    <a href={href} className={cn(className, "hover:-translate-y-0.5")}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cn(className, "hover:-translate-y-0.5")}>
      {inner}
    </Link>
  );
}

function ContactLine({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <a href={href} className="flex min-w-0 items-center gap-2.5 font-semibold text-aegean-700 hover:underline">
      <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-aegean-50">{icon}</span>
      <span className="truncate">{text}</span>
    </a>
  );
}

function TimelineItem({ color, title, date }: { color: string; title: string; date: string }) {
  return (
    <li className="flex gap-2.5">
      <span className="mt-1.5 size-2 shrink-0 rounded-full" style={{ background: color }} />
      <span>
        <span className="font-semibold">{title}</span>
        <span className="block text-[var(--ink-45)]">{date}</span>
      </span>
    </li>
  );
}
