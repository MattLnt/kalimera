import { bookingConfig, type BookingConfig } from "./config";

/**
 * Calcul des créneaux libres, sans dépendance : les conversions de fuseau
 * passent par `Intl`, qui connaît les changements d'heure.
 */

export type AvailableDay = {
  /** Date locale du studio, AAAA-MM-JJ. */
  date: string;
  /** Débuts de créneau, en ISO UTC. */
  slots: string[];
};

/** Une occupation. `counts: false` : bloque le créneau sans compter dans le maximum du jour. */
export type Busy = { startsAt: Date; endsAt: Date; counts?: boolean };

const MINUTE = 60_000;

/** Décalage du fuseau par rapport à UTC à cet instant, en millisecondes. */
function zoneOffset(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );
  return asUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

/** « 2026-11-16 » + « 09:30 » à Paris → l'instant UTC correspondant. */
export function zonedTimeToUtc(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  // Deux passes : la première estimation peut tomber de l'autre côté d'un
  // changement d'heure.
  const first = zoneOffset(new Date(guess), timeZone);
  const second = zoneOffset(new Date(guess - first), timeZone);
  return new Date(guess - second);
}

/** La date locale (AAAA-MM-JJ) d'un instant dans un fuseau. */
export function localDate(instant: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

function addDays(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function weekday(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function overlaps(start: number, end: number, busy: Busy[], bufferMs: number) {
  return busy.some(
    (item) =>
      start < item.endsAt.getTime() + bufferMs && end > item.startsAt.getTime() - bufferMs,
  );
}

/**
 * Les jours de l'horizon, chacun avec ses créneaux libres. Les jours sans
 * créneau sont conservés : le calendrier les affiche grisés plutôt que de
 * laisser des trous.
 */
export function computeAvailability(
  busy: Busy[],
  now = new Date(),
  config: BookingConfig = bookingConfig,
): AvailableDay[] {
  const earliest = now.getTime() + config.minNoticeHours * 60 * MINUTE;
  const duration = config.durationMinutes * MINUTE;
  const bufferMs = config.bufferMinutes * MINUTE;
  const today = localDate(now, config.timeZone);
  const days: AvailableDay[] = [];

  for (let offset = 0; offset < config.horizonDays; offset += 1) {
    const date = addDays(today, offset);
    const windows = config.blackoutDates.includes(date) ? [] : (config.weekly[weekday(date)] ?? []);

    const bookedThatDay = busy.filter(
      (item) => item.counts !== false && localDate(item.startsAt, config.timeZone) === date,
    ).length;
    const full = bookedThatDay >= config.maxPerDay;

    const slots: string[] = [];
    if (!full) {
      for (const [from, to] of windows) {
        const windowStart = zonedTimeToUtc(date, from, config.timeZone).getTime();
        const windowEnd = zonedTimeToUtc(date, to, config.timeZone).getTime();
        for (
          let start = windowStart;
          start + duration <= windowEnd;
          start += config.stepMinutes * MINUTE
        ) {
          if (start < earliest) continue;
          if (overlaps(start, start + duration, busy, bufferMs)) continue;
          slots.push(new Date(start).toISOString());
        }
      }
    }

    days.push({ date, slots });
  }

  return days;
}

/** Vrai si l'instant proposé est un créneau libre au moment de l'appel. */
export function isSlotAvailable(slot: string, busy: Busy[], now = new Date(), config: BookingConfig = bookingConfig) {
  return computeAvailability(busy, now, config).some((day) => day.slots.includes(slot));
}
