import { CalendarX2, Phone, PhoneCall, Video } from "lucide-react";
import Link from "next/link";

import { cancelBookingAsAdmin } from "./actions";
import { createNote } from "../notes/actions";

import { AdminHeader, EmptyState, Panel } from "@/components/admin/ui";
import { bookingConfig } from "@/lib/booking/config";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const metadata = { title: "Agenda" };
export const dynamic = "force-dynamic";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const showPast = filter === "past";
  const now = new Date();

  const bookings = await prisma.booking.findMany({
    where: showPast
      ? { OR: [{ startsAt: { lt: now } }, { status: "CANCELLED" }] }
      : { startsAt: { gte: now }, status: "CONFIRMED" },
    orderBy: { startsAt: showPast ? "desc" : "asc" },
    take: 100,
  });

  // Le serveur tourne en UTC : on affiche explicitement l'heure du studio.
  const day = new Intl.DateTimeFormat("fr-FR", {
    timeZone: bookingConfig.timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const time = new Intl.DateTimeFormat("fr-FR", {
    timeZone: bookingConfig.timeZone,
    hour: "2-digit",
    minute: "2-digit",
  });

  const tab = (active: boolean) =>
    cn(
      "rounded-full px-4 py-2 font-display text-sm font-bold transition-colors",
      active ? "bg-white text-aegean-700 shadow-soft" : "text-[var(--ink-45)]",
    );

  return (
    <>
      <AdminHeader
        title="Agenda"
        subtitle={`Appels réservés depuis la page Rendez-vous. Horaires : heure de Paris, créneaux de ${bookingConfig.durationMinutes} min.`}
      />

      <div className="mb-5 inline-flex gap-1 rounded-full bg-black/5 p-1">
        <Link href="/admin/bookings" className={tab(!showPast)}>
          À venir
        </Link>
        <Link href="/admin/bookings?filter=past" className={tab(showPast)}>
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
