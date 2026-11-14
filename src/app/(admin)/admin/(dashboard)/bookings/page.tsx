import { CalendarX2, ChevronLeft, ChevronRight, Phone, PhoneCall, Trash2, Video } from "lucide-react";
import Link from "next/link";

import { cancelBookingAsAdmin, deleteBlock } from "./actions";
import { AvailabilityEditor } from "./availability-editor";
import { BlockForm } from "./block-form";
import { createNote } from "../notes/actions";

import { AdminHeader, EmptyState, Panel } from "@/components/admin/ui";
import { bookingConfig } from "@/lib/booking/config";
import { readExternalCalendar } from "@/lib/booking/external";
import { getBookingConfig } from "@/lib/booking/service";
import { localDate, zonedTimeToUtc } from "@/lib/booking/slots";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const metadata = { title: "Agenda" };
export const dynamic = "force-dynamic";

const TZ = bookingConfig.timeZone;
const FIRST_HOUR = 7;
const LAST_HOUR = 21;
const HOUR_PX = 52;

const views = [
  { key: "week", label: "Semaine" },
  { key: "list", label: "Liste" },
  { key: "availability", label: "Disponibilités" },
] as const;
type View = (typeof views)[number]["key"];

function addDays(date: string, days: number) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}
function mondayOf(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return addDays(date, -((weekday + 6) % 7));
}
/** Minutes écoulées depuis minuit, heure de Paris. */
function minutesOf(instant: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(instant);
  return Number(parts.find((p) => p.type === "hour")?.value) * 60 + Number(parts.find((p) => p.type === "minute")?.value);
}
const toMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
const top = (minutes: number) => ((Math.min(Math.max(minutes, FIRST_HOUR * 60), LAST_HOUR * 60) - FIRST_HOUR * 60) / 60) * HOUR_PX;
const height = (from: number, to: number) => Math.max(20, top(to) - top(from));

const timeFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
const headFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", weekday: "short" });
const monthFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", day: "numeric", month: "long" });
const upcomingFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

type CalendarEvent = { id: string; kind: "video" | "phone" | "block" | "external"; title: string; detail: string; start: number; end: number; href?: string };
type Rules = Awaited<ReturnType<typeof getBookingConfig>>;

export default async function AgendaPage({ searchParams }: { searchParams: Promise<{ view?: string; week?: string; filter?: string }> }) {
  const params = await searchParams;
  const view: View = views.some((v) => v.key === params.view) ? (params.view as View) : "week";
  const now = new Date();
  const config = await getBookingConfig();

  return (
    <>
      <AdminHeader
        eyebrow="Pilotage"
        title="Agenda"
        subtitle={`Appels réservés depuis la page Rendez-vous, créneaux bloqués et horaires d'ouverture. Heure de Paris, appels de ${config.durationMinutes} min.`}
      />

      <nav aria-label="Vues" className="mb-6 inline-flex gap-1 rounded-full bg-white p-1 shadow-[0_0_0_1px_#DFE6EF]">
        {views.map((item) => (
          <Link
            key={item.key}
            href={item.key === "week" ? "/admin/bookings" : `/admin/bookings?view=${item.key}`}
            aria-current={view === item.key ? "page" : undefined}
            className={cn(
              "rounded-full px-4 py-2 font-display text-[0.8125rem] font-bold transition-colors",
              view === item.key ? "bg-aegean-600 text-white shadow-[0_8px_16px_-10px_rgba(21,98,184,0.9)]" : "text-[var(--ink-65)] hover:text-ink",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {view === "availability" ? (
        <AvailabilityEditor
          initial={{
            durationMinutes: config.durationMinutes,
            stepMinutes: config.stepMinutes,
            bufferMinutes: config.bufferMinutes,
            minNoticeHours: config.minNoticeHours,
            horizonDays: config.horizonDays,
            maxPerDay: config.maxPerDay,
            weekly: Object.fromEntries(Object.entries(config.weekly)),
            blackoutDates: config.blackoutDates,
            busyCalendarUrl: config.busyCalendarUrl ?? "",
          }}
        />
      ) : view === "list" ? (
        <ListView showPast={params.filter === "past"} now={now} />
      ) : (
        <WeekView week={params.week} now={now} config={config} />
      )}
    </>
  );
}

const eventStyles: Record<CalendarEvent["kind"], string> = {
  video: "bg-[#E3EFFC] text-[#155399] shadow-[inset_3px_0_0_#1F7AE0]",
  phone: "bg-[#E3EFFC] text-[#155399] shadow-[inset_3px_0_0_#1F7AE0]",
  block: "bg-[repeating-linear-gradient(135deg,#EEF1F5_0_6px,#E3E8EF_6px_12px)] text-[#475569] shadow-[inset_3px_0_0_#64748B]",
  external: "bg-white text-[#475569] shadow-[inset_0_0_0_1px_#CBD5E1,inset_3px_0_0_#64748B]",
};

async function WeekView({ week, now, config }: { week?: string; now: Date; config: Rules }) {
  const today = localDate(now, TZ);
  const monday = mondayOf(week && /^\d{4}-\d{2}-\d{2}$/.test(week) ? week : today);
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const from = zonedTimeToUtc(monday, "00:00", TZ);
  const to = zonedTimeToUtc(addDays(monday, 7), "00:00", TZ);

  const [bookings, blocks, external, upcoming] = await Promise.all([
    prisma.booking.findMany({ where: { status: "CONFIRMED", startsAt: { lt: to }, endsAt: { gt: from } }, orderBy: { startsAt: "asc" } }),
    prisma.bookingBlock.findMany({ where: { startsAt: { lt: to }, endsAt: { gt: from } }, orderBy: { startsAt: "asc" } }),
    config.busyCalendarUrl ? readExternalCalendar(config.busyCalendarUrl, from, to) : Promise.resolve({ events: [], error: null }),
    prisma.booking.findMany({ where: { status: "CONFIRMED", startsAt: { gte: now } }, orderBy: { startsAt: "asc" }, take: 5 }),
  ]);

  // Chaque évènement, découpé par jour (un blocage peut couvrir plusieurs jours).
  const byDay = new Map<string, CalendarEvent[]>(days.map((d) => [d, []]));
  const place = (event: Omit<CalendarEvent, "start" | "end">, startsAt: Date, endsAt: Date) => {
    for (const day of days) {
      const dayStart = zonedTimeToUtc(day, "00:00", TZ).getTime();
      const dayEnd = zonedTimeToUtc(addDays(day, 1), "00:00", TZ).getTime();
      if (startsAt.getTime() >= dayEnd || endsAt.getTime() <= dayStart) continue;
      const start = startsAt.getTime() <= dayStart ? 0 : minutesOf(startsAt);
      const end = endsAt.getTime() >= dayEnd ? 24 * 60 : minutesOf(endsAt);
      byDay.get(day)?.push({ ...event, start, end });
    }
  };
  for (const booking of bookings) {
    place(
      {
        id: booking.id,
        kind: booking.mode === "VIDEO" ? "video" : "phone",
        title: booking.company ? `${booking.name} · ${booking.company}` : booking.name,
        detail: `${timeFmt.format(booking.startsAt)} · ${booking.mode === "VIDEO" ? "Visio" : "Téléphone"}`,
        href: booking.clientId ? `/admin/clients/${booking.clientId}` : "/admin/bookings?view=list",
      },
      booking.startsAt,
      booking.endsAt,
    );
  }
  for (const block of blocks) {
    place({ id: block.id, kind: "block", title: block.label ?? "Indisponible", detail: `${timeFmt.format(block.startsAt)} – ${timeFmt.format(block.endsAt)}` }, block.startsAt, block.endsAt);
  }
  external.events.forEach((event, index) => {
    place(
      { id: `ext-${index}`, kind: "external", title: event.title, detail: event.allDay ? "Toute la journée" : `${timeFmt.format(event.startsAt)} – ${timeFmt.format(event.endsAt)}` },
      event.startsAt,
      event.endsAt,
    );
  });

  const hours = Array.from({ length: LAST_HOUR - FIRST_HOUR }, (_, i) => FIRST_HOUR + i);
  const nowMinutes = minutesOf(now);
  const weekLabel = `${monthFmt.format(new Date(`${days[0]}T00:00:00Z`))} – ${monthFmt.format(new Date(`${days[6]}T00:00:00Z`))}`;

  return (
    <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="overflow-hidden rounded-[22px] bg-white shadow-[0_0_0_1px_#DFE6EF,0_16px_32px_-22px_rgba(7,33,63,0.28)]">
        <header className="flex flex-wrap items-center gap-3 border-b border-[#EDF1F6] px-5 py-4">
          <div className="flex items-center gap-1">
            <Link href={`/admin/bookings?week=${addDays(monday, -7)}`} aria-label="Semaine précédente" className="grid size-9 place-items-center rounded-full hover:bg-black/5">
              <ChevronLeft className="size-4" />
            </Link>
            <Link href={`/admin/bookings?week=${addDays(monday, 7)}`} aria-label="Semaine suivante" className="grid size-9 place-items-center rounded-full hover:bg-black/5">
              <ChevronRight className="size-4" />
            </Link>
          </div>
          <h2 className="font-display text-[1.125rem] font-extrabold tracking-[-0.02em]">{weekLabel}</h2>
          {monday !== mondayOf(today) ? (
            <Link href="/admin/bookings" className="rounded-full bg-[#F1F4F8] px-3 py-1.5 font-display text-[0.75rem] font-bold hover:bg-[#E6EBF2]">
              Aujourd&apos;hui
            </Link>
          ) : null}
          <span className="ml-auto text-[0.8125rem] text-[var(--ink-65)]">
            {bookings.length} appel{bookings.length > 1 ? "s" : ""} cette semaine
          </span>
        </header>

        {external.error ? (
          <p className="border-b border-[#EDF1F6] bg-[#FFF4E5] px-5 py-2 text-[0.8125rem] font-semibold text-[#8A4204]">
            Votre agenda externe n&apos;a pas pu être lu ({external.error}). Vérifiez l&apos;adresse dans Disponibilités.
          </p>
        ) : null}

        <div className="overflow-x-auto">
          <div className="grid min-w-[760px] grid-cols-[52px_repeat(7,minmax(0,1fr))]">
            <span className="border-b border-[#EDF1F6]" />
            {days.map((day) => {
              const closed = config.blackoutDates.includes(day);
              return (
                <div key={day} className="border-b border-l border-[#EDF1F6] px-2 py-2.5 text-center">
                  <p className="font-display text-[0.6875rem] font-bold tracking-[0.06em] text-[var(--ink-45)] uppercase">{headFmt.format(new Date(`${day}T00:00:00Z`))}</p>
                  <p className={cn("mx-auto mt-0.5 grid size-8 place-items-center rounded-full font-display text-[1rem] font-extrabold", day === today && "bg-aegean-600 text-white")}>
                    {Number(day.slice(8))}
                  </p>
                  {closed ? <p className="mt-0.5 font-display text-[0.625rem] font-bold text-[#A31919] uppercase">Fermé</p> : null}
                </div>
              );
            })}

            <div className="relative" style={{ height: hours.length * HOUR_PX }}>
              {hours.map((hour) =>
                hour === FIRST_HOUR ? null : (
                  <span key={hour} className="absolute right-2 -translate-y-1/2 text-[0.6875rem] text-[var(--ink-45)] tabular-nums" style={{ top: (hour - FIRST_HOUR) * HOUR_PX }}>
                    {hour} h
                  </span>
                ),
              )}
            </div>

            {days.map((day) => {
              const [y, m, d] = day.split("-").map(Number);
              const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
              const closed = config.blackoutDates.includes(day);
              const windows = closed ? [] : (config.weekly[weekday] ?? []);
              const events = byDay.get(day) ?? [];
              return (
                <div
                  key={day}
                  className={cn("relative border-l border-[#EDF1F6]", closed && "bg-[repeating-linear-gradient(135deg,transparent_0_8px,#FBEFEF_8px_16px)]")}
                  style={{ height: hours.length * HOUR_PX }}
                >
                  {hours.map((hour) => (
                    <span key={hour} className="absolute inset-x-0 border-t border-[#F1F4F8]" style={{ top: (hour - FIRST_HOUR) * HOUR_PX }} />
                  ))}
                  {windows.map(([start, end]) => (
                    <span
                      key={start}
                      title={`Ouvert ${start} – ${end}`}
                      className="absolute inset-x-0 bg-[#EEF6FF]"
                      style={{ top: top(toMinutes(start)), height: top(toMinutes(end)) - top(toMinutes(start)) }}
                    />
                  ))}
                  {day === today && nowMinutes >= FIRST_HOUR * 60 && nowMinutes <= LAST_HOUR * 60 ? (
                    <span className="absolute inset-x-0 z-10 h-0.5 bg-red-500" style={{ top: top(nowMinutes) }}>
                      <span className="absolute -top-1 -left-1 size-2.5 rounded-full bg-red-500" />
                    </span>
                  ) : null}
                  {events.map((event) => {
                    const body = (
                      <>
                        <span className="block truncate font-display text-[0.75rem] font-bold">{event.title}</span>
                        <span className="block truncate text-[0.6875rem] opacity-80">{event.detail}</span>
                      </>
                    );
                    const style = { top: top(event.start), height: height(event.start, event.end) };
                    const className = cn("absolute inset-x-1 z-[5] overflow-hidden rounded-[10px] px-2 py-1 leading-tight", eventStyles[event.kind]);
                    if (event.kind === "block") {
                      return (
                        <form key={event.id} action={deleteBlock} className={cn(className, "group")} style={style}>
                          <input type="hidden" name="id" value={event.id} />
                          {body}
                          <button
                            type="submit"
                            aria-label="Débloquer ce créneau"
                            title="Débloquer"
                            className="absolute top-1 right-1 hidden size-6 cursor-pointer place-items-center rounded-full bg-white/90 text-red-600 group-hover:grid"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </form>
                      );
                    }
                    return event.href ? (
                      <Link key={event.id} href={event.href} className={cn(className, "transition-[filter] hover:brightness-95")} style={style}>
                        {body}
                      </Link>
                    ) : (
                      <div key={event.id} className={className} style={style}>
                        {body}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <footer className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[#EDF1F6] px-5 py-3 text-[0.75rem] font-semibold text-[var(--ink-65)]">
          <Legend className="bg-[#EEF6FF] ring-1 ring-[#CFE2F8]" label="Ouvert à la réservation" />
          <Legend className="bg-[#1F7AE0]" label="Appel réservé" />
          <Legend className="bg-[#64748B]" label="Bloqué à la main" />
          <Legend className="bg-white ring-1 ring-[#94A3B8]" label="Mon agenda" />
        </footer>
      </section>

      <div className="grid content-start gap-5 md:grid-cols-2 2xl:grid-cols-1">
        <Panel title="Prochains appels" description="Les cinq prochains rendez-vous.">
          {upcoming.length === 0 ? (
            <p className="text-[0.875rem] text-[var(--ink-45)]">Aucun appel prévu.</p>
          ) : (
            <ul className="grid gap-2">
              {upcoming.map((booking) => (
                <li key={booking.id} className="flex items-center gap-3 rounded-[14px] bg-[#F5F8FC] p-3">
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-[11px] text-white", "bg-[#1F7AE0]")}>
                    {booking.mode === "VIDEO" ? <Video className="size-4" /> : <Phone className="size-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[0.875rem] font-bold">{booking.name}</span>
                    <span className="block text-[0.75rem] text-[var(--ink-65)] first-letter:uppercase">{upcomingFmt.format(booking.startsAt)}</span>
                  </span>
                  {booking.meetingUrl && booking.mode === "VIDEO" ? (
                    <a href={booking.meetingUrl} target="_blank" rel="noreferrer noopener" className="rounded-full bg-aegean-600 px-3 py-1.5 font-display text-[0.6875rem] font-bold text-white">
                      Rejoindre
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Bloquer un créneau" description="Il disparaît aussitôt de la page Rendez-vous.">
          <BlockForm defaultDate={today} />
        </Panel>
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-full", className)} />
      {label}
    </span>
  );
}

async function ListView({ showPast, now }: { showPast: boolean; now: Date }) {
  const bookings = await prisma.booking.findMany({
    where: showPast ? { OR: [{ startsAt: { lt: now } }, { status: "CANCELLED" }] } : { startsAt: { gte: now }, status: "CONFIRMED" },
    orderBy: { startsAt: showPast ? "desc" : "asc" },
    take: 100,
  });
  const day = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });
  const time = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <div className="mb-5 flex gap-1.5">
        <Link href="/admin/bookings?view=list" className={cn("rounded-full px-3 py-1.5 font-display text-[0.75rem] font-bold", !showPast ? "bg-ink text-white" : "bg-[#F1F4F8] text-[var(--ink-65)]")}>
          À venir
        </Link>
        <Link
          href="/admin/bookings?view=list&filter=past"
          className={cn("rounded-full px-3 py-1.5 font-display text-[0.75rem] font-bold", showPast ? "bg-ink text-white" : "bg-[#F1F4F8] text-[var(--ink-65)]")}
        >
          Passés & annulés
        </Link>
      </div>
      {bookings.length === 0 ? (
        <EmptyState
          title={showPast ? "Rien ici pour l'instant" : "Aucun rendez-vous à venir"}
          description="Les appels réservés depuis le site s'affichent ici, et vous recevez aussi un e-mail avec l'invitation calendrier."
        />
      ) : (
        <div className="grid gap-3">
          {bookings.map((booking) => (
            <Panel key={booking.id} className={booking.status === "CANCELLED" ? "opacity-60" : ""}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="grid w-24 shrink-0 place-items-center rounded-field bg-aegean-50 px-2 py-3 text-center">
                    <span className="font-display text-xl font-bold text-aegean-700">
                      {time.format(booking.startsAt)}
                    </span>
                    <span className="text-[0.6875rem] text-[var(--ink-45)] first-letter:uppercase">
                      {day.format(booking.startsAt)}
                    </span>
                  </div>
                  <div>
                    <p className="font-display text-base font-bold tracking-[-0.02em]">
                      {booking.name}
                      {booking.company ? (
                        <span className="font-normal text-[var(--ink-45)]"> · {booking.company}</span>
                      ) : null}
                    </p>
                    <p className="text-sm text-[var(--ink-65)]">
                      <a href={`mailto:${booking.email}`} className="hover:underline">
                        {booking.email}
                      </a>
                      {booking.phone ? (
                        <>
                          {" · "}
                          <a href={`tel:${booking.phone}`} className="hover:underline">
                            {booking.phone}
                          </a>
                        </>
                      ) : null}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--ink-45)]">
                      {booking.mode === "VIDEO" ? <Video className="size-3.5" /> : <Phone className="size-3.5" />}
                      {booking.mode === "VIDEO" ? "Visio" : "Téléphone"} · {booking.locale}
                      {booking.topic ? ` · ${booking.topic}` : ""}
                      {booking.status === "CANCELLED" ? " · Annulé" : ""}
                    </p>
                    {booking.message ? (
                      <p className="mt-3 max-w-[70ch] rounded-field bg-black/[0.03] px-4 py-3 text-sm whitespace-pre-wrap">
                        {booking.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                {booking.status === "CONFIRMED" && booking.startsAt >= now ? (
                  <div className="flex flex-wrap items-center gap-1">
                    {booking.clientId ? (
                    <Link
                      href={`/admin/clients/${booking.clientId}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-aegean-50 px-3 py-2 font-display text-xs font-bold text-aegean-700 transition-colors hover:bg-aegean-100"
                    >
                      Fiche client
                    </Link>
                  ) : null}
                    {booking.clientId ? (
                      <form action={createNote}>
                        <input type="hidden" name="clientId" value={booking.clientId} />
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <input type="hidden" name="kind" value="CALL" />
                        <button type="submit" className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-black/5 px-3 py-2 font-display text-xs font-bold hover:bg-aegean-100">
                          <PhoneCall className="size-3.5" />
                          Notes d&apos;appel
                        </button>
                      </form>
                    ) : null}
                    {booking.meetingUrl && booking.mode === "VIDEO" ? (
                      <a
                        href={booking.meetingUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 rounded-full bg-aegean-600 px-3 py-2 font-display text-xs font-bold text-white"
                      >
                        <Video className="size-3.5" />
                        Rejoindre
                      </a>
                    ) : null}
                    <form action={cancelBookingAsAdmin}>
                      <input type="hidden" name="id" value={booking.id} />
                      <button
                        type="submit"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 font-display text-xs font-bold text-red-700 transition-colors hover:bg-red-50"
                      >
                        <CalendarX2 className="size-3.5" />
                        Annuler et prévenir
                      </button>
                    </form>
                  </div>
                ) : null}
              </div>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
