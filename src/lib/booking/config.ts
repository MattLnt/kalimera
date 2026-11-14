/**
 * Règles de prise de rendez-vous PAR DÉFAUT.
 *
 * Les réglages réels se font dans l'admin (Agenda › Disponibilités) et sont
 * enregistrés en base ; ces valeurs servent tant que rien n'y est
 * enregistré. Le fuseau, lui, reste fixe. Les heures sont
 * exprimées dans le fuseau du studio, et c'est dans ce fuseau que le visiteur
 * les voit — avec la correspondance dans son propre fuseau s'il est ailleurs.
 */
export const bookingConfig = {
  timeZone: "Europe/Paris",
  /** Durée d'un appel. */
  durationMinutes: 30,
  /** Écart entre deux débuts de créneau. */
  stepMinutes: 30,
  /** Temps libre imposé entre deux rendez-vous. */
  bufferMinutes: 0,
  /** Pas de rendez-vous à moins de ce délai : le temps de préparer l'appel. */
  minNoticeHours: 12,
  /** Jusqu'où le calendrier s'ouvre. */
  horizonDays: 60,
  /** Au-delà, la journée est considérée comme pleine. */
  maxPerDay: 4,
  /**
   * Plages ouvertes par jour de semaine (0 = dimanche). Un jour absent est
   * fermé. Les heures de fin sont exclusives : 12:00 veut dire que le dernier
   * appel se termine à midi.
   */
  weekly: {
    1: [["09:30", "12:00"], ["14:00", "17:30"]],
    2: [["09:30", "12:00"], ["14:00", "17:30"]],
    3: [["09:30", "12:00"], ["14:00", "17:30"]],
    4: [["09:30", "12:00"], ["14:00", "17:30"]],
    5: [["09:30", "12:00"], ["14:00", "16:30"]],
  } as Record<number, [string, string][]>,
  /** Jours fermés ponctuellement (congés, fériés), au format AAAA-MM-JJ. */
  blackoutDates: [
    "2026-12-24",
    "2026-12-25",
    "2026-12-31",
    "2027-01-01",
  ] as string[],
};

export type BookingConfig = typeof bookingConfig & {
  /** Adresse iCal secrète d'un agenda externe : ses évènements bloquent les créneaux. */
  busyCalendarUrl?: string | null;
};
