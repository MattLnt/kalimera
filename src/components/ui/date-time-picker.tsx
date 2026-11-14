"use client";

import { useState } from "react";

import { DatePicker } from "@/components/ui/date-picker";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Heures proposées, au quart d'heure. */
const quarterHours = Array.from({ length: 96 }, (_, index) => {
  const hours = String(Math.floor(index / 4)).padStart(2, "0");
  const minutes = String((index % 4) * 15).padStart(2, "0");
  return `${hours}:${minutes}`;
});

/**
 * Date et heure, en remplacement de `<input type="datetime-local">`.
 *
 * La valeur garde le format du natif — « AAAA-MM-JJTHH:MM », heure locale —
 * pour que les actions serveur qui la lisaient n'aient rien à changer.
 */
export function DateTimePicker({
  name,
  defaultValue = "",
  value: controlled,
  onChange,
  className,
}: {
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  const [inner, setInner] = useState(defaultValue);
  const value = controlled ?? inner;
  const [date = "", time = ""] = value.split("T");
  const shortTime = time.slice(0, 5);

  const set = (nextDate: string, nextTime: string) => {
    const next = nextDate ? `${nextDate}T${nextTime || "09:00"}` : "";
    if (controlled === undefined) setInner(next);
    onChange?.(next);
  };

  // Une heure saisie ailleurs, hors quart d'heure, reste proposée.
  const times = shortTime && !quarterHours.includes(shortTime) ? [...quarterHours, shortTime].sort() : quarterHours;

  return (
    <div className={cn("grid grid-cols-[1fr_104px] gap-2", className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <DatePicker value={date} onChange={(next) => set(next, shortTime)} aria-label="Date" />
      <Select
        // La liste se remonte quand l'heure change de l'extérieur.
        key={shortTime}
        name={`${name ?? "datetime"}-time`}
        defaultValue={shortTime}
        placeholder="Heure"
        onValueChange={(next) => set(date, next)}
        options={times.map((item) => ({ value: item, label: item }))}
      />
    </div>
  );
}
