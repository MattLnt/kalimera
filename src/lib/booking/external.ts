import "server-only";

import ical from "node-ical";

import { bookingConfig } from "@/lib/booking/config";
import type { Busy } from "@/lib/booking/slots";
import { zonedTimeToUtc } from "@/lib/booking/slots";

export type ExternalEvent = Busy & { title: string; allDay: boolean };

/** Lecture mémorisée quelques minutes : l'agenda n'est pas relu à chaque visite. */
const memo = new Map<string, { at: number; events: ExternalEvent[]; error: string | null }>();
const TTL = 5 * 60_000;

function dateOnly(date: Date) {
  // Une date sans heure arrive à minuit dans le fuseau du serveur : on en
  // reprend le jour, puis on le place dans le fuseau du studio.
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Évènements d'un agenda externe (adresse iCal secrète de Google Agenda,
 * Outlook, iCloud…) entre deux dates, récurrences dépliées. Les évènements
 * marqués « disponible » et les évènements annulés sont ignorés.
 */
export async function readExternalCalendar(url: string, from: Date, to: Date): Promise<{ events: ExternalEvent[]; error: string | null }> {
  const key = `${url}|${from.toISOString().slice(0, 10)}|${to.toISOString().slice(0, 10)}`;
  const cached = memo.get(key);
  if (cached && Date.now() - cached.at < TTL) return cached;

  let result: { events: ExternalEvent[]; error: string | null };
  try {
    const response = await fetch(url.replace(/^webcal:/i, "https:"), { signal: AbortSignal.timeout(6000), cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    if (!text.includes("BEGIN:VCALENDAR")) throw new Error("Ce lien ne renvoie pas un agenda iCal.");
    const data = ical.sync.parseICS(text);

    const events: ExternalEvent[] = [];
    for (const item of Object.values(data)) {
      if (!item || item.type !== "VEVENT") continue;
      if (item.transparency === "TRANSPARENT" || item.status === "CANCELLED") continue;
      for (const instance of ical.expandRecurringEvent(item, { from, to, expandOngoing: true })) {
        const title = typeof instance.summary === "string" ? instance.summary : String((instance.summary as { val?: string })?.val ?? "Occupé");
        if (instance.isFullDay) {
          events.push({
            startsAt: zonedTimeToUtc(dateOnly(instance.start), "00:00", bookingConfig.timeZone),
            endsAt: zonedTimeToUtc(dateOnly(instance.end), "00:00", bookingConfig.timeZone),
            title,
            allDay: true,
            counts: false,
          });
        } else {
          events.push({ startsAt: new Date(instance.start), endsAt: new Date(instance.end), title, allDay: false, counts: false });
        }
      }
    }
    result = { events, error: null };
  } catch (error) {
    console.error("[booking] agenda externe illisible", error);
    result = { events: [], error: error instanceof Error ? error.message : "Agenda illisible" };
  }

  memo.set(key, { at: Date.now(), ...result });
  return result;
}

/** Vide la mémoire : après un changement d'adresse dans les réglages. */
export function forgetExternalCalendar() {
  memo.clear();
}
