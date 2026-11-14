"use client";

import { Ban, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { createBlock } from "./actions";

import { DatePicker } from "@/components/ui/date-picker";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const TIMES = Array.from({ length: (22 - 6) * 4 + 1 }, (_, i) => {
  const minutes = 6 * 60 + i * 15;
  const value = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  return { value, label: value.replace(":", " h ") };
});

/** Fermer un créneau à la main : rendez-vous perso, déplacement… */
export function BlockForm({ defaultDate }: { defaultDate: string }) {
  const [date, setDate] = useState(defaultDate);
  const [from, setFrom] = useState("14:00");
  const [to, setTo] = useState("16:00");
  const [allDay, setAllDay] = useState(false);
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const result = await createBlock({ date, from, to, allDay, label });
          if (result.ok) {
            setLabel("");
            setMessage("Créneau bloqué.");
          } else setMessage(result.error);
        });
      }}
      className="grid gap-3"
    >
      <DatePicker value={date} onChange={setDate} clearable={false} aria-label="Jour à bloquer" />
      <div className="flex items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={allDay}
          onClick={() => setAllDay((v) => !v)}
          className={cn("relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors", allDay ? "bg-aegean-600" : "bg-black/15")}
        >
          <span className={cn("absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform", allDay && "translate-x-5")} />
        </button>
        <span className="font-display text-[0.8125rem] font-bold">Toute la journée</span>
      </div>
      {allDay ? null : (
        <div className="flex items-center gap-2">
          <Select name="block-from" defaultValue={from} options={TIMES} onValueChange={setFrom} className="flex-1" />
          <span className="text-[var(--ink-45)]">→</span>
          <Select name="block-to" defaultValue={to} options={TIMES} onValueChange={setTo} className="flex-1" />
        </div>
      )}
      <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Motif (facultatif) : dentiste, déplacement…" className="field-input" aria-label="Motif" />
      <button
        type="submit"
        disabled={pending || !date}
        className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-ink font-display text-[0.875rem] font-bold text-white disabled:opacity-50"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Ban className="size-4" />}
        Bloquer ce créneau
      </button>
      {message ? <p className={cn("text-[0.8125rem] font-semibold", message === "Créneau bloqué." ? "text-emerald-700" : "text-red-600")}>{message}</p> : null}
    </form>
  );
}
