"use client";

import {
  ArrowLeft,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Phone,
  Video,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import { bookCall, type BookingState } from "./actions";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Link, useRouter } from "@/i18n/navigation";
import { conversions, trackConversion, trackEvent } from "@/lib/analytics";
import type { AvailableDay } from "@/lib/booking/slots";
import { cn } from "@/lib/utils";

const intlLocale = { fr: "fr-FR", en: "en-GB", es: "es-ES" } as const;
const topics = ["website", "ecommerce", "app", "platform", "redesign", "other"] as const;

type Props = {
  days: AvailableDay[];
  timeZone: string;
  durationMinutes: number;
};

const initialState: BookingState = { status: "idle" };

/**
 * Prise de rendez-vous en trois temps, comme Calendly : un jour, une heure,
 * puis les coordonnées. Les créneaux arrivent calculés du serveur ; s'il en
 * prend un entre-temps, l'action le refuse et la page se recharge.
 */
export function BookingWidget({ days, timeZone, durationMinutes }: Props) {
  const t = useTranslations("booking");
  const locale = useLocale() as keyof typeof intlLocale;
  const router = useRouter();
  const [state, formAction] = useActionState(bookCall, initialState);

  const firstOpen = days.find((day) => day.slots.length > 0)?.date ?? null;
  const [selectedDay, setSelectedDay] = useState<string | null>(firstOpen);
  const [slot, setSlot] = useState<string | null>(null);
  const [mode, setMode] = useState<"VIDEO" | "PHONE">("VIDEO");
  const [visitorZone, setVisitorZone] = useState<string | null>(null);

  // Le fuseau du visiteur n'est connu qu'au navigateur : lu après le rendu
  // pour ne pas faire diverger le HTML du serveur.
  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- valeur propre au navigateur
    if (zone && zone !== timeZone) setVisitorZone(zone);
    trackEvent(conversions.bookingOpen, { locale });
  }, [timeZone, locale]);

  // Créneau pris entre-temps : on recharge les disponibilités et on revient
  // au choix de l'heure.
  const slotTaken = state.status === "error" && state.slotTaken;
  useEffect(() => {
    if (slotTaken) {
      router.refresh();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- retour au choix de l'heure
      setSlot(null);
    }
  }, [slotTaken, router]);

  useEffect(() => {
    if (state.status === "success") trackConversion(conversions.bookingConfirmed, { locale });
  }, [state.status, locale]);

  const fmt = useMemo(() => {
    const loc = intlLocale[locale] ?? "fr-FR";
    return {
      time: new Intl.DateTimeFormat(loc, { timeZone, hour: "2-digit", minute: "2-digit" }),
      visitorTime: (zone: string) =>
        new Intl.DateTimeFormat(loc, { timeZone: zone, hour: "2-digit", minute: "2-digit" }),
      long: new Intl.DateTimeFormat(loc, {
        timeZone,
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
      // Les dates du calendrier sont des jours civils : on les formate en UTC
      // à partir de minuit UTC, sans dépendre du fuseau du navigateur.
      month: new Intl.DateTimeFormat(loc, { timeZone: "UTC", month: "long", year: "numeric" }),
      monthShort: new Intl.DateTimeFormat(loc, { timeZone: "UTC", month: "short" }),
      weekday: new Intl.DateTimeFormat(loc, { timeZone: "UTC", weekday: "short" }),
      dayLong: new Intl.DateTimeFormat(loc, {
        timeZone: "UTC",
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    };
  }, [locale, timeZone]);

  if (state.status === "success") {
    return <Success state={state} fmt={fmt} durationMinutes={durationMinutes} />;
  }

  const dayInfo = days.find((day) => day.date === selectedDay) ?? null;

  return (
    <div className="surface-card h-full overflow-hidden">
      {slot ? (
        <form action={formAction} className="p-6 sm:p-10">
          <input type="hidden" name="slot" value={slot} />
          <input type="hidden" name="mode" value={mode} />
          <input type="hidden" name="locale" value={locale} />
          <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
            <label htmlFor="booking-website">Website</label>
            <input id="booking-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {/* Récapitulatif du créneau, toujours visible pendant la saisie. */}
          <div className="mb-8 flex flex-wrap items-center gap-4 rounded-[20px] bg-aegean-50 p-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-field bg-aegean-600 text-white">
              <CalendarCheck2 className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[1.0625rem] font-bold tracking-[-0.02em] first-letter:uppercase">
                {fmt.long.format(new Date(slot))}
              </p>
              <p className="text-[0.9375rem] text-[var(--ink-65)]">
                {fmt.time.format(new Date(slot))} · {durationMinutes} min · {t("zone")}
                {visitorZone ? (
                  <span className="block text-[0.8125rem] text-[var(--ink-45)]">
                    {t("yourTime", {
                      time: fmt.visitorTime(visitorZone).format(new Date(slot)),
                      zone: visitorZone.replace(/_/g, " "),
                    })}
                  </span>
                ) : null}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSlot(null)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 font-display text-sm font-bold text-aegean-700 shadow-soft transition-colors hover:text-aegean-900"
            >
              <ArrowLeft className="size-4" />
              {t("change")}
            </button>
          </div>

          <h2 className="display-3 mb-6">{t("stepDetails")}</h2>

          <fieldset className="mb-6">
            <legend className="field-label mb-2">{t("mode")}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["VIDEO", Video, t("modeVideo"), t("modeVideoHint")],
                  ["PHONE", Phone, t("modePhone"), t("modePhoneHint")],
                ] as const
              ).map(([value, Icon, label, hint]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={mode === value}
                  onClick={() => setMode(value)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-[16px] border p-4 text-left transition-colors",
                    mode === value
                      ? "border-aegean-500 bg-aegean-50 ring-2 ring-aegean-200"
                      : "border-black/10 hover:border-aegean-300",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-[12px]",
                      mode === value ? "bg-aegean-600 text-white" : "bg-aegean-100 text-aegean-700",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block font-display text-[0.9375rem] font-bold">{label}</span>
                    <span className="block text-[0.8125rem] text-[var(--ink-45)]">{hint}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t("name")} error={errorOf(state, "name")}>
              <input name="name" type="text" required autoComplete="name" className="field-input" />
            </Field>
            <Field label={t("email")} error={errorOf(state, "email")}>
              <input name="email" type="email" required autoComplete="email" className="field-input" />
            </Field>
            <Field
              label={t("phone")}
              optional={mode === "PHONE" ? undefined : t("optional")}
              error={errorOf(state, "phone")}
            >
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                required={mode === "PHONE"}
                className="field-input"
              />
            </Field>
            <Field label={t("company")} optional={t("optional")}>
              <input name="company" type="text" autoComplete="organization" className="field-input" />
            </Field>
            <div className="sm:col-span-2">
              <Field label={t("topic")} optional={t("optional")}>
                <Select
                  name="topic"
                  placeholder={t("topicPlaceholder")}
                  options={topics.map((key) => ({
                    value: t(`topics.${key}`),
                    label: t(`topics.${key}`),
                  }))}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label={t("message")} optional={t("optional")}>
                <textarea
                  name="message"
                  rows={4}
                  placeholder={t("messagePlaceholder")}
                  className="field-input resize-y"
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem] text-[var(--ink-65)]">
                <input name="consent" type="checkbox" required className="mt-1 size-4 shrink-0 accent-aegean-600" />
                <span>{t("consent")}</span>
              </label>
              {errorOf(state, "consent") ? <p className="field-error">{errorOf(state, "consent")}</p> : null}
            </div>
          </div>

          {errorOf(state, "form") || errorOf(state, "slot") ? (
            <p role="alert" className="mt-6 rounded-field bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorOf(state, "form") ?? errorOf(state, "slot")}
            </p>
          ) : null}

          <SubmitButton idle={t("submit")} busy={t("submitting")} />
        </form>
      ) : (
        <div className="grid h-full lg:grid-cols-[1.35fr_1fr]">
          <div className="border-black/5 p-6 sm:p-8 lg:border-r">
            <h2 className="mb-1 font-display text-[1.125rem] font-bold tracking-[-0.02em]">
              {t("stepDay")}
            </h2>
            {errorOf(state, "slot") ? (
              <p role="alert" className="mb-3 rounded-field bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {errorOf(state, "slot")}
              </p>
            ) : null}
            <Calendar days={days} selected={selectedDay} onSelect={setSelectedDay} fmt={fmt} />
          </div>

          <div className="bg-[var(--surface-sunken,#f6f8fb)] p-6 sm:p-8">
            <h2 className="mb-1 font-display text-[1.125rem] font-bold tracking-[-0.02em]">
              {t("stepTime")}
            </h2>
            <p className="mb-5 flex items-center gap-1.5 text-[0.8125rem] text-[var(--ink-45)]">
              <Clock className="size-3.5" />
              {durationMinutes} min · {t("zone")}
            </p>

            {dayInfo ? (
              <>
                <p className="mb-3 font-display text-[0.9375rem] font-bold first-letter:uppercase">
                  {fmt.dayLong.format(new Date(`${dayInfo.date}T00:00:00Z`))}
                </p>
                {dayInfo.slots.length > 0 ? (
                  <ul className="grid max-h-[22rem] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-2">
                    {dayInfo.slots.map((value) => (
                      <li key={value}>
                        <button
                          type="button"
                          onClick={() => setSlot(value)}
                          className="w-full cursor-pointer rounded-[12px] border border-aegean-200 bg-white px-3 py-3 font-display text-[0.9375rem] font-bold text-aegean-700 transition-colors hover:border-aegean-600 hover:bg-aegean-600 hover:text-white"
                        >
                          {fmt.time.format(new Date(value))}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[0.9375rem] text-[var(--ink-45)]">{t("noSlots")}</p>
                )}
              </>
            ) : (
              <p className="text-[0.9375rem] text-[var(--ink-45)]">{t("noDay")}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type Formatters = {
  month: Intl.DateTimeFormat;
  monthShort: Intl.DateTimeFormat;
  weekday: Intl.DateTimeFormat;
  time: Intl.DateTimeFormat;
  long: Intl.DateTimeFormat;
  dayLong: Intl.DateTimeFormat;
  visitorTime: (zone: string) => Intl.DateTimeFormat;
};

/** Grille du lundi au dimanche, des jours ouverts à la réservation. */
function Calendar({
  days,
  selected,
  onSelect,
  fmt,
}: {
  days: AvailableDay[];
  selected: string | null;
  onSelect: (date: string) => void;
  fmt: Formatters;
}) {
  if (days.length === 0) return null;

  const toDate = (value: string) => new Date(`${value}T00:00:00Z`);
  const byDate = new Map(days.map((day) => [day.date, day]));

  // Démarre au lundi de la première semaine, finit au dimanche de la dernière.
  const first = toDate(days[0].date);
  const start = new Date(first);
  start.setUTCDate(first.getUTCDate() - ((first.getUTCDay() + 6) % 7));
  const last = toDate(days[days.length - 1].date);
  const end = new Date(last);
  end.setUTCDate(last.getUTCDate() + (6 - ((last.getUTCDay() + 6) % 7)));

  const cells: string[] = [];
  for (const cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    cells.push(cursor.toISOString().slice(0, 10));
  }

  const months = Array.from(new Set(days.map((day) => fmt.month.format(toDate(day.date)))));

  return (
    <div>
      <p className="mb-4 text-[0.9375rem] text-[var(--ink-65)] first-letter:uppercase">
        {months.join(" – ")}
      </p>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {cells.slice(0, 7).map((date) => (
          <span
            key={`h-${date}`}
            className="pb-1 font-display text-[0.6875rem] font-bold tracking-[0.06em] text-[var(--ink-45)] uppercase"
          >
            {fmt.weekday.format(toDate(date)).replace(".", "")}
          </span>
        ))}
        {cells.map((date) => {
          const day = byDate.get(date);
          const open = Boolean(day && day.slots.length > 0);
          const isSelected = date === selected;
          const dayNumber = Number(date.slice(8));

          return (
            <button
              key={date}
              type="button"
              disabled={!open}
              onClick={() => onSelect(date)}
              aria-pressed={isSelected}
              aria-label={fmt.dayLong.format(toDate(date))}
              className={cn(
                "relative grid aspect-square place-items-center rounded-full font-display text-[0.9375rem] font-bold transition-colors",
                !day && "invisible",
                open && !isSelected && "cursor-pointer bg-aegean-50 text-aegean-700 hover:bg-aegean-100",
                isSelected && "bg-aegean-600 text-white shadow-[0_8px_20px_-8px_rgba(21,98,184,0.7)]",
                day && !open && "cursor-not-allowed text-[var(--ink-45)] opacity-40",
              )}
            >
              {dayNumber}
              {dayNumber === 1 ? (
                <span className="absolute -top-1 text-[0.5625rem] font-bold tracking-wide uppercase opacity-70">
                  {fmt.monthShort.format(toDate(date)).replace(".", "")}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Success({
  state,
  fmt,
  durationMinutes,
}: {
  state: Extract<BookingState, { status: "success" }>;
  fmt: Formatters;
  durationMinutes: number;
}) {
  const t = useTranslations("booking");
  const { booking } = state;
  const start = new Date(booking.startsAt);
  const end = new Date(booking.endsAt);
  const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const google = `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: "Kalimera",
    dates: `${stamp(start)}/${stamp(end)}`,
    ...(booking.meetingUrl ? { location: booking.meetingUrl } : {}),
  }).toString()}`;

  return (
    <div className="surface-card flex h-full flex-col items-center justify-center p-8 text-center sm:p-12">
      <span className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-aegean-100 text-aegean-700">
        <CheckCircle2 className="size-7" />
      </span>
      <h2 className="display-3">{t("successTitle")}</h2>
      <p className="mx-auto mt-4 max-w-[36ch] font-display text-[1.125rem] font-bold tracking-[-0.02em] first-letter:uppercase">
        {fmt.long.format(start)} · {fmt.time.format(start)}
      </p>
      <p className="text-[0.9375rem] text-[var(--ink-45)]">
        {durationMinutes} min · {t("zone")}
      </p>
      <p className="mx-auto mt-4 max-w-[44ch] text-[var(--ink-65)]">
        {t("successBody", { email: booking.email })}
        {booking.mode === "PHONE" ? <span className="mt-1 block">{t("successPhone")}</span> : null}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        {booking.mode === "VIDEO" && booking.meetingUrl ? (
          <Button asChild variant="blue">
            <a href={booking.meetingUrl} target="_blank" rel="noreferrer noopener">
              {t("successJoin")}
            </a>
          </Button>
        ) : null}
        <Button asChild variant="line">
          <a href={google} target="_blank" rel="noreferrer noopener">
            {t("addGoogle")}
          </a>
        </Button>
        <Button asChild variant="line">
          <Link href={{ pathname: "/book/[token]", params: { token: booking.token } }}>
            {t("manage")}
          </Link>
        </Button>
      </div>
    </div>
  );
}

function errorOf(state: BookingState, field: "name" | "email" | "phone" | "consent" | "slot" | "form") {
  return state.status === "error" ? state.errors[field] : undefined;
}

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="field-label">
        {label}
        {optional ? <span className="font-normal text-[var(--ink-45)]"> · {optional}</span> : null}
      </span>
      {children}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

function SubmitButton({ idle, busy }: { idle: string; busy: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="blue"
      disabled={pending}
      className="mt-8 disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? busy : idle}
    </Button>
  );
}
