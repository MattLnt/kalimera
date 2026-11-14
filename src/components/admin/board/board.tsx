"use client";

import { ChevronDown, ChevronRight, Maximize2, Plus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

import { DatePicker } from "@/components/ui/date-picker";
import type { VividOption } from "@/lib/crm/vivid";
import { useFloating } from "@/lib/use-floating";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Tableau groupé, à la manière des outils de gestion de projet modernes :    */
/*  groupes colorés repliables, cellules modifiables sur place, sommes par     */
/*  groupe, ajout rapide en bas de chaque groupe.                               */
/* -------------------------------------------------------------------------- */

export type BoardColumn<T> = {
  key: string;
  label: string;
  /** Largeur de grille : « 160px », « minmax(260px,1fr) »… */
  width: string;
  align?: "left" | "center" | "right";
  render: (item: T) => React.ReactNode;
  /** Pied de groupe : somme, moyenne… */
  summary?: (items: T[]) => React.ReactNode;
};

export type BoardGroup<T> = { key: string; label: string; color: string; items: T[] };

export function Board<T extends { id: string }>({
  groups,
  columns,
  quickAdd,
  hideEmptyGroups = false,
}: {
  groups: BoardGroup<T>[];
  columns: BoardColumn<T>[];
  /** Ligne « + Ajouter » au bas de chaque groupe. */
  quickAdd?: { placeholder: string; extra?: React.ReactNode; onAdd: (groupKey: string, title: string) => Promise<string | null> };
  hideEmptyGroups?: boolean;
}) {
  const template = `6px ${columns.map((column) => column.width).join(" ")}`;
  // Largeur minimale = somme des minimums de colonnes : au-delà, le tableau
  // occupe toute la largeur ; en deçà, il défile horizontalement.
  const minWidth = 6 + columns.reduce((sum, column) => sum + (Number.parseInt(column.width.replace(/^minmax\(/, ""), 10) || 0), 0);
  const visible = hideEmptyGroups ? groups.filter((group) => group.items.length > 0) : groups;

  return (
    <div className="grid gap-7 overflow-x-auto pb-2">
      {visible.map((group) => (
        <BoardGroupView key={group.key} group={group} columns={columns} template={template} minWidth={minWidth} quickAdd={quickAdd} />
      ))}
    </div>
  );
}

function BoardGroupView<T extends { id: string }>({
  group,
  columns,
  template,
  minWidth,
  quickAdd,
}: {
  group: BoardGroup<T>;
  columns: BoardColumn<T>[];
  template: string;
  minWidth: number;
  quickAdd?: { placeholder: string; extra?: React.ReactNode; onAdd: (groupKey: string, title: string) => Promise<string | null> };
}) {
  const [collapsed, setCollapsed] = useState(false);
  const hasSummary = columns.some((column) => column.summary);

  return (
    <section style={{ minWidth }}>
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        className="mb-2 flex cursor-pointer items-center gap-2 font-display text-[1rem] font-bold tracking-[-0.02em]"
        style={{ color: group.color }}
      >
        {collapsed ? <ChevronRight className="size-4" /> : <ChevronDown className="size-4" />}
        {group.label}
        <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[0.6875rem] font-semibold text-[var(--ink-45)]">
          {group.items.length} élément{group.items.length > 1 ? "s" : ""}
        </span>
      </button>

      {collapsed ? null : (
        <div className="overflow-hidden rounded-[14px] bg-white ring-1 ring-black/[0.07] shadow-[0_1px_2px_rgba(7,33,63,0.04)]">
          {/* En-têtes de colonnes, répétés pour chaque groupe. */}
          <div className="grid border-b border-black/[0.07] bg-[#fafbfd]" style={{ gridTemplateColumns: template }}>
            <span style={{ background: group.color }} />
            {columns.map((column) => (
              <span
                key={column.key}
                className={cn(
                  "border-l border-black/[0.05] px-3 py-2 font-display text-[0.6875rem] font-bold tracking-[0.04em] text-[var(--ink-45)] uppercase first-of-type:border-l-0",
                  column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left",
                )}
              >
                {column.label}
              </span>
            ))}
          </div>

          {group.items.map((item) => (
            <div key={item.id} className="group/row grid border-b border-black/[0.05] transition-colors hover:bg-aegean-50/40" style={{ gridTemplateColumns: template }}>
              <span style={{ background: group.color }} className="opacity-90" />
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={cn(
                    "relative flex min-h-11 min-w-0 items-center border-l border-black/[0.05] first-of-type:border-l-0",
                    column.align === "right" ? "justify-end" : column.align === "center" ? "justify-center" : "justify-start",
                  )}
                >
                  {column.render(item)}
                </div>
              ))}
            </div>
          ))}

          {quickAdd ? <QuickAddRow groupKey={group.key} color={group.color} template={template} columns={columns.length} quickAdd={quickAdd} /> : null}

          {hasSummary && group.items.length > 0 ? (
            <div className="grid bg-[#fafbfd]" style={{ gridTemplateColumns: template }}>
              <span />
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={cn(
                    "flex min-h-9 items-center px-3 font-display text-[0.8125rem] font-bold tabular-nums",
                    column.align === "right" ? "justify-end" : column.align === "center" ? "justify-center" : "justify-start",
                  )}
                >
                  {column.summary?.(group.items)}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

function QuickAddRow({
  groupKey,
  color,
  template,
  columns,
  quickAdd,
}: {
  groupKey: string;
  color: string;
  template: string;
  columns: number;
  quickAdd: { placeholder: string; extra?: React.ReactNode; onAdd: (groupKey: string, title: string) => Promise<string | null> };
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = () => {
    if (!value.trim()) return;
    startTransition(async () => {
      const problem = await quickAdd.onAdd(groupKey, value);
      if (problem) setError(problem);
      else {
        setValue("");
        setError("");
      }
    });
  };

  return (
    <div className="grid border-b border-black/[0.05]" style={{ gridTemplateColumns: template }}>
      <span style={{ background: color }} className="opacity-30" />
      <div className="flex min-h-10 items-center gap-2 px-3" style={{ gridColumn: `span ${columns}` }}>
        <Plus className="size-4 shrink-0 text-[var(--ink-45)]" />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), submit())}
          onBlur={submit}
          disabled={pending}
          placeholder={quickAdd.placeholder}
          className="min-w-0 flex-1 bg-transparent py-2 text-[0.875rem] outline-none placeholder:text-[var(--ink-45)]"
        />
        {quickAdd.extra}
        {error ? <span className="text-xs text-red-600">{error}</span> : null}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- cellules */

/** Statut en bloc de couleur plein, qui ouvre la liste des statuts. */
export function StatusCell({ value, options, onChange }: { value: string; options: VividOption[]; onChange?: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((option) => option.value === value) ?? { label: value, color: "#9CA3AF", value };
  const floating = useFloating(ref, open, () => setOpen(false), { width: 208, height: options.length * 40 + 16 });
  const toggle = () => {
    if (!open) floating.place();
    setOpen((v) => !v);
  };

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

  return (
    <div ref={ref} className="relative h-full w-full self-stretch">
      <button
        type="button"
        disabled={!onChange}
        onClick={toggle}
        className="flex h-full min-h-11 w-full cursor-pointer items-center justify-center px-2 font-display text-[0.8125rem] font-bold text-white transition-[filter] hover:brightness-110 disabled:cursor-default"
        style={{ background: current.color }}
      >
        <span className="truncate">{current.label}</span>
      </button>
      {open ? (
        <div data-floating style={floating.style} className="z-[45] grid animate-[menu-open_0.16s_var(--ease-out-expo)_both] gap-1 rounded-[16px] bg-white p-2 shadow-[0_24px_60px_-20px_rgba(7,33,63,0.4)] ring-1 ring-black/[0.06]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setOpen(false);
                if (option.value !== value) onChange?.(option.value);
              }}
              className={cn(
                "cursor-pointer rounded-[8px] px-3 py-2 font-display text-[0.8125rem] font-bold text-white transition-[filter] hover:brightness-110",
                option.value === value && "ring-2 ring-black/20 ring-offset-1",
              )}
              style={{ background: option.color }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Texte modifiable sur place : un clic, on tape, Entrée ou clic ailleurs. */
export function TextCell({
  value,
  onChange,
  placeholder = "",
  className,
  href,
  onOpen,
}: {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Lien vers la fiche, ouvert par l'icône au survol. */
  href?: string;
  /** Ouvre le panneau latéral. */
  onOpen?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          setEditing(false);
          if (draft.trim() !== value) onChange?.(draft.trim());
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") (event.target as HTMLInputElement).blur();
          if (event.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className="mx-1 w-full rounded-[8px] px-2 py-1.5 text-[0.875rem] outline-none ring-2 ring-aegean-400"
      />
    );
  }
  return (
    <div className="flex w-full min-w-0 items-center gap-1 px-3">
      <button
        type="button"
        onClick={() => {
          if (!onChange) return;
          setDraft(value);
          setEditing(true);
        }}
        className={cn("min-w-0 flex-1 cursor-text truncate rounded-[6px] py-1 text-left text-[0.875rem] hover:ring-1 hover:ring-black/10", !value && "text-[var(--ink-45)]", className)}
      >
        {value || placeholder}
      </button>
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 font-display text-[0.6875rem] font-bold text-aegean-700 opacity-0 transition-opacity group-hover/row:opacity-100 hover:bg-aegean-50"
        >
          <Maximize2 className="size-3" />
          Ouvrir
        </button>
      ) : href ? (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 font-display text-[0.6875rem] font-bold text-aegean-700 opacity-0 transition-opacity group-hover/row:opacity-100 hover:bg-aegean-50">
          <Maximize2 className="size-3" />
          Ouvrir
        </Link>
      ) : null}
    </div>
  );
}

/** Montant modifiable sur place (saisi en euros, stocké en centimes). */
export function MoneyCell({ cents, onChange, currency = "EUR" }: { cents: number | null; onChange?: (cents: number | null) => void; currency?: string }) {
  const format = (value: number | null) =>
    value === null ? "" : new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 0 }).format(value / 100).replace(/ /g, " ");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  if (editing) {
    return (
      <input
        autoFocus
        inputMode="decimal"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          setEditing(false);
          const cleaned = draft.replace(/\s|€|\$/g, "").replace(",", ".");
          const next = cleaned === "" ? null : Math.round(Number(cleaned) * 100);
          if (next === null || Number.isFinite(next)) {
            if (next !== cents) onChange?.(next);
          }
        }}
        onKeyDown={(event) => event.key === "Enter" && (event.target as HTMLInputElement).blur()}
        className="mx-1 w-full rounded-[8px] px-2 py-1.5 text-right text-[0.875rem] tabular-nums outline-none ring-2 ring-aegean-400"
      />
    );
  }
  return (
    <button
      type="button"
      disabled={!onChange}
      onClick={() => {
        setDraft(cents === null ? "" : String(cents / 100).replace(".", ","));
        setEditing(true);
      }}
      className="h-full w-full cursor-text px-3 text-right font-display text-[0.875rem] font-bold tabular-nums hover:bg-black/[0.03] disabled:cursor-default"
    >
      {format(cents) || <span className="font-normal text-[var(--ink-45)]">—</span>}
    </button>
  );
}

export function DateCell({ value, onChange, late }: { value: string; onChange?: (value: string) => void; late?: boolean }) {
  return (
    <div className={cn("h-full w-full", late && "text-red-600 [&_span]:font-bold")}>
      <DatePicker value={value} onChange={(next) => next !== value && onChange?.(next)} bare />
    </div>
  );
}

/** Avancement en barre. */
export function ProgressCell({ value }: { value: number }) {
  return (
    <div className="flex w-full items-center gap-2 px-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      <span className="w-9 text-right text-[0.75rem] font-semibold text-[var(--ink-65)] tabular-nums">{Math.round(value)} %</span>
    </div>
  );
}

/* ------------------------------------------------------- vues et panneau */

export function ViewSwitcher({ views, current }: { views: { key: string; label: string; icon: React.ReactNode; href: string }[]; current: string }) {
  return (
    <div className="inline-flex gap-1 rounded-[14px] bg-white p-1 shadow-[0_1px_2px_rgba(7,33,63,0.06)] ring-1 ring-black/[0.05]">
      {views.map((view) => (
        <Link
          key={view.key}
          href={view.href}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 font-display text-[0.8125rem] font-bold transition-colors",
            view.key === current ? "bg-aegean-600 text-white shadow-[0_6px_14px_-8px_rgba(21,98,184,0.9)]" : "text-[var(--ink-65)] hover:bg-black/[0.04]",
          )}
        >
          {view.icon}
          {view.label}
        </Link>
      ))}
    </div>
  );
}

/** Panneau latéral : la fiche s'ouvre par-dessus le tableau, sans le quitter. */
export function Drawer({ open, onClose, title, subtitle, href, children }: { open: boolean; onClose: () => void; title: string; subtitle?: React.ReactNode; href?: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Fermer" onClick={onClose} className="absolute inset-0 animate-[fade-in_0.2s_ease-out_both] bg-aegean-950/30" />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[560px] animate-[drawer-in_0.3s_var(--ease-out-expo)_both] flex-col bg-canvas shadow-[-24px_0_60px_-20px_rgba(4,21,43,0.45)]">
        <header className="flex items-start gap-3 border-b border-black/[0.06] bg-white px-6 py-5">
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-[1.25rem] font-extrabold tracking-[-0.03em]">{title}</h2>
            {subtitle ? <div className="mt-1 text-[0.8125rem] text-[var(--ink-65)]">{subtitle}</div> : null}
          </div>
          {href ? (
            <Link href={href} className="inline-flex items-center gap-1.5 rounded-full bg-aegean-50 px-3 py-1.5 font-display text-xs font-bold text-aegean-700 hover:bg-aegean-100">
              <Maximize2 className="size-3.5" />
              Fiche complète
            </Link>
          ) : null}
          <button type="button" onClick={onClose} aria-label="Fermer" className="grid size-8 cursor-pointer place-items-center rounded-full hover:bg-black/5">
            <X className="size-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </aside>
    </div>
  );
}

/** Appel d'une action de tableau avec mise à jour optimiste. */
export function useOptimisticItems<T extends { id: string }>(initial: T[]) {
  const [items, setItems] = useState(initial);
  const [lastInitial, setLastInitial] = useState(initial);
  if (initial !== lastInitial) {
    setLastInitial(initial);
    setItems(initial);
  }
  const [, startTransition] = useTransition();
  const [error, setError] = useState("");

  const patch = (id: string, change: Partial<T>, save: () => Promise<{ ok: boolean; error?: string }>) => {
    const before = items;
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...change } : item)));
    startTransition(async () => {
      const result = await save();
      if (!result.ok) {
        setItems(before);
        setError(result.error ?? "Modification impossible.");
        window.setTimeout(() => setError(""), 4000);
      }
    });
  };
  return { items, patch, error };
}

export function BoardError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-red-600 px-4 py-2 font-display text-sm font-bold text-white shadow-lg lg:bottom-6">
      {message}
    </div>
  );
}
