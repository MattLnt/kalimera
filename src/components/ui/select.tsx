"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
  /** Pictogramme facultatif, affiché devant le libellé. */
  icon?: React.ReactNode;
};

/**
 * Liste déroulante maison, en remplacement du `<select>` natif.
 *
 * Le natif s'affiche avec le style du système — une roue sur iOS, une liste
 * grise sur Windows — et ne se laisse pas habiller. Celui-ci garde l'allure du
 * site partout, et reste un vrai champ de formulaire :
 * - la valeur part avec le formulaire (champ caché nommé) ;
 * - `required` est vérifié par le navigateur, comme pour un natif ;
 * - clavier complet : flèches, Entrée, Échap, Début/Fin, saisie de la
 *   première lettre ; motif ARIA « listbox ».
 */
export function Select({
  name,
  options,
  defaultValue = "",
  placeholder,
  required,
  invalid,
  onValueChange,
  className,
  id,
}: {
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  onValueChange?: (value: string) => void;
  className?: string;
  id?: string;
}) {
  const autoId = useId();
  const buttonId = id ?? `select-${autoId}`;
  const listId = `${buttonId}-list`;
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // L'option active reste visible quand on la déplace au clavier.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const openList = () => {
    const index = options.findIndex((option) => option.value === value);
    setActive(index >= 0 ? index : 0);
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    setValue(option.value);
    onValueChange?.(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((index) => Math.min(options.length - 1, index + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((index) => Math.max(0, index - 1));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        if (event.key.length === 1) {
          const letter = event.key.toLowerCase();
          const index = options.findIndex((option) =>
            option.label.toLowerCase().startsWith(letter),
          );
          if (index >= 0) setActive(index);
        }
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {/* Champ réel, invisible : porte la valeur et la validation native. */}
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

      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid ? "true" : undefined}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "field-input flex cursor-pointer items-center gap-2.5 text-left",
          open && "shadow-[inset_0_0_0_1px_var(--color-aegean-500),0_0_0_4px_rgba(42,134,232,0.14)]",
        )}
      >
        {selected?.icon ? (
          <span className="grid size-6 shrink-0 place-items-center rounded-[8px] bg-aegean-100 text-aegean-700">
            {selected.icon}
          </span>
        ) : null}
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-[var(--ink-45)]")}>
          {selected?.label ?? placeholder ?? "—"}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-[var(--ink-45)] transition-transform duration-300",
            open && "rotate-180 text-aegean-600",
          )}
        />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={buttonId}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-72 animate-[menu-open_0.18s_var(--ease-out-expo)_both] overflow-y-auto overscroll-contain rounded-[18px] bg-white p-1.5 shadow-[0_1px_1px_rgba(7,33,63,0.04),0_24px_60px_-20px_rgba(7,33,63,0.35)] ring-1 ring-black/5"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                data-index={index}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[0.9375rem] transition-colors",
                  index === active && "bg-aegean-50",
                  isSelected && "font-semibold text-aegean-700",
                )}
              >
                {option.icon ? (
                  <span className="grid size-6 shrink-0 place-items-center rounded-[8px] bg-aegean-100 text-aegean-700">
                    {option.icon}
                  </span>
                ) : null}
                <span className="min-w-0 flex-1">{option.label}</span>
                {isSelected ? <Check aria-hidden className="size-4 shrink-0 text-aegean-600" /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
