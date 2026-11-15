"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { pillColors } from "@/lib/crm/pill-colors";
import type { VividOption } from "@/lib/crm/vivid";
import { useFloating } from "@/lib/use-floating";
import { cn } from "@/lib/utils";

/** Pastille de statut : point de couleur et libellé. */
export function Pill({ option, className }: { option: Pick<VividOption, "label" | "color" | "solid">; className?: string }) {
  return (
    <span
      className={cn("inline-flex max-w-full items-center gap-1.5 rounded-full py-1 pr-2.5 pl-2 font-display text-[0.75rem] font-bold whitespace-nowrap", option.solid && "px-2.5", className)}
      style={pillColors(option.color, option.solid)}
    >
      {option.solid ? null : <span className="size-[7px] shrink-0 rounded-full" style={{ background: option.color }} />}
      <span className="truncate">{option.label}</span>
    </span>
  );
}

/**
 * Pastille qui ouvre la liste des statuts. Sans `onChange`, simple pastille.
 * Le menu flotte en position fixe : jamais rogné par un tableau.
 */
export function PillSelect({
  value,
  options,
  onChange,
  label = "Changer le statut",
}: {
  value: string;
  options: VividOption[];
  onChange?: (value: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current: VividOption = options.find((option) => option.value === value) ?? { label: value, color: "#9CA3AF", value };
  const floating = useFloating(ref, open, () => setOpen(false), { width: 220, height: options.length * 38 + 16 });

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => !ref.current?.contains(event.target as Node) && setOpen(false);
    const key = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", key);
    };
  }, [open]);

  if (!onChange) return <Pill option={current} />;

  return (
    <div ref={ref} className="relative inline-flex max-w-full">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label} (actuel : ${current.label})`}
        onClick={() => {
          if (!open) floating.place();
          setOpen((v) => !v);
        }}
        className="inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-full py-1 pr-2 pl-2 font-display text-[0.75rem] font-bold whitespace-nowrap transition-[filter,box-shadow] hover:brightness-[0.97] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
        style={pillColors(current.color, current.solid)}
      >
        {current.solid ? null : <span className="size-[7px] shrink-0 rounded-full" style={{ background: current.color }} />}
        <span className="truncate">{current.label}</span>
        <ChevronDown className={cn("size-3 shrink-0 opacity-70 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div
          data-floating
          role="listbox"
          style={floating.style}
          className="z-[45] grid animate-[menu-open_0.16s_var(--ease-out-expo)_both] gap-0.5 rounded-[16px] bg-white p-1.5 shadow-[0_0_0_1px_rgba(7,33,63,0.06),0_24px_60px_-20px_rgba(7,33,63,0.4)]"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                setOpen(false);
                if (option.value !== value) onChange(option.value);
              }}
              className="flex cursor-pointer items-center gap-2 rounded-[10px] px-2 py-1.5 text-left hover:bg-black/[0.04]"
            >
              <Pill option={option} />
              {option.value === value ? <Check className="ml-auto size-4 text-aegean-600" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
