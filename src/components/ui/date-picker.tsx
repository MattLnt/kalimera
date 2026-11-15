"use client";

import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { useFloating } from "@/lib/use-floating";
import { cn } from "@/lib/utils";

const monthFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", month: "long", year: "numeric" });
const labelFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short", year: "numeric" });
const shortFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", day: "numeric", month: "short" });
const weekdays = ["L", "M", "M", "J", "V", "S", "D"];

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (date: Date) => `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
const parse = (value: string) => (/^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00Z`) : null);

function todayIso() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/**
 * Sélecteur de date maison, en remplacement de `<input type="date">`.
 *
 * Le natif change d'allure d'un navigateur à l'autre et ne s'habille pas.
 * Celui-ci envoie la même valeur (AAAA-MM-JJ) dans un champ caché nommé, se
 * pilote au clavier (flèches, Page préc./suiv. pour les mois, Entrée, Échap)
 * et propose « Aujourd'hui » et « Effacer ».
 */
export function DatePicker({
  name,
  defaultValue = "",
  value: controlled,
  onChange,
  placeholder = "Choisir une date",
  required,
  className,
  clearable = true,
  "aria-label": ariaLabel,
  bare = false,
}: {
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  clearable?: boolean;
  /** Version cellule de tableau : sans cadre, date courte centrée. */
  bare?: boolean;
  "aria-label"?: string;
}) {
  const id = useId();
  const [inner, setInner] = useState(defaultValue);
  const value = controlled ?? inner;
  const selected = parse(value);
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => value || todayIso());
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  // Dans une cellule de tableau, le calendrier flotte en position fixe pour
  // ne pas être rogné par le tableau.
  // Le calendrier flotte en position fixe, gardé dans l'écran : il s'ouvre
  // vers le haut s'il manque de place en bas, et n'est jamais rogné.
  const floating = useFloating(rootRef, open, () => setOpen(false), { width: 296, height: 360, align: bare ? "center" : "start" });

  const set = (next: string) => {
    if (controlled === undefined) setInner(next);
    onChange?.(next);
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Le focus suit le jour actif, pour que le clavier reste dans la grille.
  useEffect(() => {
    if (open) gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${cursor}"]`)?.focus({ preventScroll: true });
  }, [cursor, open]);

  const cursorDate = parse(cursor) ?? new Date();
  const first = new Date(Date.UTC(cursorDate.getUTCFullYear(), cursorDate.getUTCMonth(), 1));
  const start = new Date(first);
  start.setUTCDate(1 - ((first.getUTCDay() + 6) % 7));
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return date;
  });

  const shift = (days: number, months = 0) => {
    const date = new Date(cursorDate);
    if (months) date.setUTCMonth(date.getUTCMonth() + months);
    date.setUTCDate(date.getUTCDate() + days);
    setCursor(iso(date));
  };

  const choose = (next: string) => {
    set(next);
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  };

  const onGridKey = (event: React.KeyboardEvent) => {
    const moves: Record<string, () => void> = {
      ArrowLeft: () => shift(-1),
      ArrowRight: () => shift(1),
      ArrowUp: () => shift(-7),
      ArrowDown: () => shift(7),
      PageUp: () => shift(0, -1),
      PageDown: () => shift(0, 1),
      Home: () => shift(-((cursorDate.getUTCDay() + 6) % 7)),
      End: () => shift(6 - ((cursorDate.getUTCDay() + 6) % 7)),
    };
    if (moves[event.key]) {
      event.preventDefault();
      moves[event.key]();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus({ preventScroll: true });
    }
  };

  const today = todayIso();

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {name ? (
        <input
          tabIndex={-1}
          aria-hidden
          name={name}
          value={value}
          required={required}
          onChange={() => {}}
          onInvalid={() => buttonRef.current?.focus()}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-full opacity-0"
        />
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${id}-dialog`}
        aria-label={ariaLabel}
        onClick={() => {
          setCursor(value || today);
          if (!open) floating.place();
          setOpen((current) => !current);
        }}
        className={cn(
          bare
            ? "flex h-full w-full cursor-pointer items-center justify-center gap-1.5 px-2 text-[0.8125rem] transition-colors hover:bg-black/[0.03]"
            : "field-input flex cursor-pointer items-center gap-2.5 text-left",
          open && "shadow-[inset_0_0_0_1px_var(--color-aegean-500),0_0_0_4px_rgba(42,134,232,0.14)]",
        )}
      >
        {bare && selected ? null : (
          <CalendarDays className={cn("size-4 shrink-0", selected ? "text-aegean-600" : "text-[var(--ink-45)]")} />
        )}
        <span className={cn("min-w-0 truncate first-letter:uppercase", !bare && "flex-1", !selected && "text-[var(--ink-45)]")}>
          {selected ? (bare ? shortFmt.format(selected) : labelFmt.format(selected)) : bare ? "" : placeholder}
        </span>
        {clearable && selected && !bare ? (
          <span
            role="button"
            tabIndex={-1}
            aria-label="Effacer la date"
            onClick={(event) => {
              event.stopPropagation();
              set("");
            }}
            className="grid size-6 place-items-center rounded-full text-[var(--ink-45)] hover:bg-black/5 hover:text-ink"
          >
            <X className="size-3.5" />
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          id={`${id}-dialog`}
          role="dialog"
          aria-label="Choisir une date"
          data-floating
          style={floating.style}
          className={cn(
            "z-50 w-[296px] animate-[menu-open_0.18s_var(--ease-out-expo)_both] rounded-[20px] bg-white p-3 text-left shadow-[0_1px_1px_rgba(7,33,63,0.04),0_24px_60px_-20px_rgba(7,33,63,0.35)] ring-1 ring-black/5",
          )}
        >
          <div className="mb-2 flex items-center gap-1 px-1">
            <p className="flex-1 font-display text-[0.9375rem] font-bold first-letter:uppercase" aria-live="polite">
              {monthFmt.format(first)}
            </p>
            <button type="button" onClick={() => shift(0, -1)} aria-label="Mois précédent" className="grid size-8 cursor-pointer place-items-center rounded-full text-aegean-700 hover:bg-aegean-50">
              <ChevronLeft className="size-4" />
            </button>
            <button type="button" onClick={() => shift(0, 1)} aria-label="Mois suivant" className="grid size-8 cursor-pointer place-items-center rounded-full text-aegean-700 hover:bg-aegean-50">
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div ref={gridRef} role="group" onKeyDown={onGridKey} className="grid grid-cols-7 gap-0.5 text-center">
            {weekdays.map((day, index) => (
              <span key={index} className="py-1 font-display text-[0.6875rem] font-bold text-[var(--ink-45)]">
                {day}
              </span>
            ))}
            {cells.map((date) => {
              const key = iso(date);
              const inMonth = date.getUTCMonth() === first.getUTCMonth();
              const isSelected = key === value;
              const isToday = key === today;
              return (
                <button
                  key={key}
                  type="button"
                  data-date={key}
                  tabIndex={key === cursor ? 0 : -1}
                  aria-pressed={isSelected}
                  aria-label={labelFmt.format(date)}
                  onClick={() => choose(key)}
                  className={cn(
                    "grid aspect-square cursor-pointer place-items-center rounded-full font-display text-[0.8125rem] font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-aegean-400",
                    inMonth ? "text-ink" : "text-[var(--ink-45)] opacity-50",
                    isSelected ? "bg-aegean-600 text-white" : "hover:bg-aegean-50",
                    isToday && !isSelected && "ring-1 ring-aegean-300",
                  )}
                >
                  {date.getUTCDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex justify-between border-t border-black/5 px-1 pt-2">
            <button type="button" onClick={() => choose(today)} className="cursor-pointer rounded-full px-3 py-1.5 font-display text-xs font-bold text-aegean-700 hover:bg-aegean-50">
              Aujourd&apos;hui
            </button>
            {clearable ? (
              <button type="button" onClick={() => choose("")} className="cursor-pointer rounded-full px-3 py-1.5 font-display text-xs font-bold text-[var(--ink-45)] hover:bg-black/5">
                Effacer
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
