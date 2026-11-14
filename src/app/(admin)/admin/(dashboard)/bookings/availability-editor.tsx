"use client";

import { CalendarOff, Check, Clock, Copy, Link2, Loader2, Plus, Settings2, X } from "lucide-react";
import { useState, useTransition } from "react";

import { saveAvailability, testCalendarUrl, type AvailabilityInput } from "./actions";

import { DatePicker } from "@/components/ui/date-picker";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const DAYS: { key: string; label: string }[] = [
  { key: "1", label: "Lundi" },
  { key: "2", label: "Mardi" },
  { key: "3", label: "Mercredi" },
  { key: "4", label: "Jeudi" },
  { key: "5", label: "Vendredi" },
  { key: "6", label: "Samedi" },
  { key: "0", label: "Dimanche" },
];

const TIMES = Array.from({ length: (22 - 6) * 4 + 1 }, (_, i) => {
  const minutes = 6 * 60 + i * 15;
  const value = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  return { value, label: value.replace(":", " h ") };
});

const opts = (values: number[], unit: (n: number) => string) => values.map((n) => ({ value: String(n), label: unit(n) }));
const dayFmt = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function Card({ icon, title, description, children, className }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[22px] bg-white p-5 shadow-[0_0_0_1px_#DFE6EF,0_16px_32px_-22px_rgba(7,33,63,0.28)] sm:p-6", className)}>
      <header className="mb-5 flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-aegean-50 text-aegean-700">{icon}</span>
        <div>
          <h2 className="font-display text-[1.0625rem] font-extrabold tracking-[-0.02em]">{title}</h2>
          <p className="text-[0.8125rem] text-[var(--ink-65)]">{description}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="font-display text-[0.8125rem] font-bold text-ink/80">{label}</span>
      {children}
    </label>
  );
}

export function AvailabilityEditor({ initial }: { initial: AvailabilityInput }) {
  const [state, setState] = useState(initial);
  const [version, setVersion] = useState(0); // remonte les listes après une copie
  const [newDate, setNewDate] = useState("");
  const [saved, setSaved] = useState<"idle" | "saved" | string>("idle");
  const [test, setTest] = useState<string>("");
  const [pending, startTransition] = useTransition();
  const [testing, startTest] = useTransition();

  const dirty = JSON.stringify(state) !== JSON.stringify(initial);
  const patch = (next: Partial<AvailabilityInput>) => {
    setState((current) => ({ ...current, ...next }));
    setSaved("idle");
  };
  const setDay = (day: string, ranges: [string, string][]) => patch({ weekly: { ...state.weekly, [day]: ranges } });

  const save = () =>
    startTransition(async () => {
      const result = await saveAvailability(state);
      setSaved(result.ok ? "saved" : result.error);
    });

  return (
    <div className="grid gap-5 pb-24">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <Card icon={<Clock className="size-4" />} title="Horaires d'ouverture" description="Les plages où l'on peut réserver un appel, heure de Paris.">
          <ul className="grid gap-2">
            {DAYS.map((day) => {
              const ranges = state.weekly[day.key] ?? [];
              const open = ranges.length > 0;
              return (
                <li key={`${day.key}-${version}`} className={cn("flex flex-wrap items-start gap-3 rounded-[16px] px-3 py-2.5", open ? "bg-[#F5F8FC]" : "bg-transparent")}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={open}
                    aria-label={`${day.label} : ${open ? "ouvert" : "fermé"}`}
                    onClick={() => setDay(day.key, open ? [] : [["09:30", "12:00"], ["14:00", "17:30"]])}
                    className={cn("relative mt-2 h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors", open ? "bg-aegean-600" : "bg-black/15")}
                  >
                    <span className={cn("absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform", open && "translate-x-5")} />
                  </button>
                  <span className={cn("mt-2 w-24 font-display text-[0.9375rem] font-bold", !open && "text-[var(--ink-45)]")}>{day.label}</span>
                  <div className="grid min-w-0 flex-1 gap-2">
                    {open ? (
                      ranges.map(([from, to], index) => (
                        <div key={`${index}-${from}-${to}`} className="flex flex-wrap items-center gap-2">
                          <Select
                            name={`from-${day.key}-${index}`}
                            defaultValue={from}
                            options={TIMES}
                            className="w-[7.5rem]"
                            onValueChange={(value) => setDay(day.key, ranges.map((r, i) => (i === index ? [value, r[1]] : r)))}
                          />
                          <span className="text-[var(--ink-45)]">→</span>
                          <Select
                            name={`to-${day.key}-${index}`}
                            defaultValue={to}
                            options={TIMES}
                            className="w-[7.5rem]"
                            onValueChange={(value) => setDay(day.key, ranges.map((r, i) => (i === index ? [r[0], value] : r)))}
                          />
                          <button
                            type="button"
                            aria-label="Retirer cette plage"
                            onClick={() => setDay(day.key, ranges.filter((_, i) => i !== index))}
                            className="grid size-9 cursor-pointer place-items-center rounded-full text-[var(--ink-45)] hover:bg-black/5 hover:text-red-600"
                          >
                            <X className="size-4" />
                          </button>
                          {from >= to ? <span className="text-[0.75rem] font-semibold text-red-600">Fin avant le début</span> : null}
                        </div>
                      ))
                    ) : (
                      <span className="mt-2 text-[0.875rem] text-[var(--ink-45)]">Fermé</span>
                    )}
                  </div>
                  {open ? (
                    <div className="mt-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const last = ranges.at(-1)?.[1] ?? "09:00";
                          const end = TIMES.find((t) => t.value > last && Number(t.value.slice(0, 2)) >= Number(last.slice(0, 2)) + 1)?.value ?? "18:00";
                          setDay(day.key, [...ranges, [last, end]]);
                        }}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 font-display text-[0.75rem] font-bold text-aegean-700 hover:bg-aegean-50"
                      >
                        <Plus className="size-3.5" />
                        Plage
                      </button>
                      {day.key === "1" ? (
                        <button
                          type="button"
                          title="Appliquer ces horaires du mardi au vendredi"
                          onClick={() => {
                            patch({ weekly: { ...state.weekly, 2: ranges, 3: ranges, 4: ranges, 5: ranges } });
                            setVersion((v) => v + 1);
                          }}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 font-display text-[0.75rem] font-bold text-[var(--ink-65)] hover:bg-black/5"
                        >
                          <Copy className="size-3.5" />
                          Mar.–ven.
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="grid content-start gap-5">
          <Card icon={<Settings2 className="size-4" />} title="Règles des appels" description="Durée, rythme et délais appliqués à la page Rendez-vous.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Durée d'un appel">
                <Select name="duration" defaultValue={String(state.durationMinutes)} options={opts([15, 20, 30, 45, 60, 90], (n) => `${n} min`)} onValueChange={(v) => patch({ durationMinutes: Number(v) })} />
              </Field>
              <Field label="Un créneau toutes les">
                <Select name="step" defaultValue={String(state.stepMinutes)} options={opts([15, 20, 30, 45, 60], (n) => `${n} min`)} onValueChange={(v) => patch({ stepMinutes: Number(v) })} />
              </Field>
              <Field label="Pause entre deux appels">
                <Select name="buffer" defaultValue={String(state.bufferMinutes)} options={opts([0, 5, 10, 15, 30], (n) => (n ? `${n} min` : "Aucune"))} onValueChange={(v) => patch({ bufferMinutes: Number(v) })} />
              </Field>
              <Field label="Préavis minimum">
                <Select name="notice" defaultValue={String(state.minNoticeHours)} options={opts([0, 2, 4, 12, 24, 48], (n) => (n ? `${n} h avant` : "Aucun"))} onValueChange={(v) => patch({ minNoticeHours: Number(v) })} />
              </Field>
              <Field label="Réservable jusqu'à">
                <Select name="horizon" defaultValue={String(state.horizonDays)} options={opts([7, 14, 21, 30, 60, 90], (n) => `${n} jours`)} onValueChange={(v) => patch({ horizonDays: Number(v) })} />
              </Field>
              <Field label="Appels par jour, au plus">
                <Select name="max" defaultValue={String(state.maxPerDay)} options={opts([1, 2, 3, 4, 5, 6, 8, 10], (n) => String(n))} onValueChange={(v) => patch({ maxPerDay: Number(v) })} />
              </Field>
            </div>
          </Card>

          <Card icon={<CalendarOff className="size-4" />} title="Jours fermés" description="Congés, jours fériés : aucun créneau ces jours-là.">
            <div className="flex flex-wrap items-center gap-2">
              <DatePicker value={newDate} onChange={setNewDate} placeholder="Choisir un jour" className="min-w-0 flex-1" />
              <button
                type="button"
                disabled={!newDate}
                onClick={() => {
                  if (!state.blackoutDates.includes(newDate)) patch({ blackoutDates: [...state.blackoutDates, newDate].sort() });
                  setNewDate("");
                }}
                className="inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-full bg-ink px-4 font-display text-[0.8125rem] font-bold text-white disabled:cursor-default disabled:opacity-40"
              >
                <Plus className="size-4" />
                Fermer ce jour
              </button>
            </div>
            {state.blackoutDates.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {state.blackoutDates.map((date) => (
                  <li key={date} className="inline-flex items-center gap-1 rounded-full bg-[#FDE3E3] py-1 pr-1 pl-3 font-display text-[0.75rem] font-bold text-[#A31919]">
                    <span className="first-letter:uppercase">{dayFmt.format(new Date(`${date}T00:00:00Z`))}</span>
                    <button type="button" aria-label="Rouvrir ce jour" onClick={() => patch({ blackoutDates: state.blackoutDates.filter((d) => d !== date) })} className="grid size-6 cursor-pointer place-items-center rounded-full hover:bg-white/60">
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[0.8125rem] text-[var(--ink-45)]">Aucun jour fermé.</p>
            )}
          </Card>

          <Card icon={<Link2 className="size-4" />} title="Mon agenda (Google, Outlook…)" description="Vos rendez-vous personnels bloquent automatiquement les créneaux.">
            <div className="grid gap-2">
              <input
                value={state.busyCalendarUrl}
                onChange={(event) => {
                  patch({ busyCalendarUrl: event.target.value });
                  setTest("");
                }}
                placeholder="https://calendar.google.com/calendar/ical/…/basic.ics"
                aria-label="Adresse iCal secrète de votre agenda"
                className="field-input font-mono text-[0.8125rem]"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={!state.busyCalendarUrl.trim() || testing}
                  onClick={() =>
                    startTest(async () => {
                      const result = await testCalendarUrl(state.busyCalendarUrl);
                      setTest(result.ok ? `ok:${result.count}` : result.error);
                    })
                  }
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-aegean-50 px-3.5 py-2 font-display text-[0.75rem] font-bold text-aegean-700 hover:bg-aegean-100 disabled:cursor-default disabled:opacity-50"
                >
                  {testing ? <Loader2 className="size-3.5 animate-spin" /> : null}
                  Tester la connexion
                </button>
                {test.startsWith("ok:") ? (
                  <span className="text-[0.8125rem] font-semibold text-emerald-700">Connecté · {test.slice(3)} évènement{Number(test.slice(3)) > 1 ? "s" : ""} sur 30 jours</span>
                ) : test ? (
                  <span className="text-[0.8125rem] font-semibold text-red-600">{test}</span>
                ) : null}
              </div>
              <p className="text-[0.75rem] leading-[1.55] text-[var(--ink-45)]">
                Google Agenda : Paramètres › votre agenda › Intégrer l&apos;agenda › « Adresse secrète au format iCal ». Les évènements marqués « Disponible » ne bloquent rien.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Barre d'enregistrement */}
      <div className="sticky bottom-24 z-20 flex justify-end lg:bottom-6">
        <div className="flex items-center gap-3 rounded-full bg-white py-2 pr-2 pl-5 shadow-[0_0_0_1px_#DFE6EF,0_18px_40px_-16px_rgba(7,33,63,0.45)]">
          <span className={cn("text-[0.8125rem] font-semibold", saved === "saved" ? "text-emerald-700" : saved !== "idle" ? "text-red-600" : "text-[var(--ink-65)]")}>
            {saved === "saved" ? "Enregistré : la page Rendez-vous est à jour." : saved !== "idle" ? saved : dirty ? "Modifications non enregistrées" : "Tout est à jour"}
          </span>
          <button
            type="button"
            onClick={save}
            disabled={pending || !dirty}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-aegean-600 px-5 py-2.5 font-display text-[0.875rem] font-bold text-white shadow-[0_10px_20px_-10px_rgba(21,98,184,0.9)] disabled:cursor-default disabled:opacity-50"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : saved === "saved" && !dirty ? <Check className="size-4" /> : null}
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
