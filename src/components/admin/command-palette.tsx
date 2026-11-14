"use client";

import {
  BriefcaseBusiness,
  CheckSquare,
  CornerDownLeft,
  FileSignature,
  Loader2,
  Plus,
  Receipt,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { searchCrm, type SearchHit } from "@/app/(admin)/admin/(dashboard)/board-actions";
import { cn } from "@/lib/utils";

const OPEN_EVENT = "crm:command";

/** Ouvre la palette depuis n'importe quel bouton. */
export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

const kindMeta: Record<SearchHit["kind"], { label: string; icon: LucideIcon }> = {
  client: { label: "Client", icon: Users },
  deal: { label: "Projet", icon: BriefcaseBusiness },
  quote: { label: "Devis", icon: FileSignature },
  invoice: { label: "Facture", icon: Receipt },
  task: { label: "Tâche", icon: CheckSquare },
};

const shortcuts: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Nouveau client", href: "/admin/clients/new", icon: Users },
  { label: "Nouveau projet", href: "/admin/deals/new", icon: BriefcaseBusiness },
  { label: "Nouveau devis", href: "/admin/quotes/new", icon: FileSignature },
  { label: "Facture hors devis", href: "/admin/invoices/new", icon: Receipt },
  { label: "Mes tâches", href: "/admin/tasks", icon: CheckSquare },
];

/**
 * Recherche globale (Ctrl + K ou ⌘ + K) : clients, projets, devis, factures,
 * tâches, et raccourcis de création. Navigation au clavier.
 */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  // Recherche au fil de la frappe, avec un léger délai.
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    const timer = window.setTimeout(() => {
      if (q.length < 2) {
        setHits([]);
        return;
      }
      startTransition(async () => {
        setHits(await searchCrm(q));
        setActive(0);
      });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [query, open]);

  if (!open) return null;

  const matchingShortcuts = shortcuts.filter((item) => !query.trim() || item.label.toLowerCase().includes(query.trim().toLowerCase()));
  const entries = [
    ...hits.map((hit) => ({ key: `${hit.kind}-${hit.id}`, href: hit.href, icon: kindMeta[hit.kind].icon, title: hit.title, subtitle: hit.subtitle, tag: kindMeta[hit.kind].label })),
    ...matchingShortcuts.map((item) => ({ key: item.href, href: item.href, icon: item.icon, title: item.label, subtitle: "Raccourci", tag: "Action" })),
  ];

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] text-ink" role="dialog" aria-modal="true" aria-label="Recherche">
      <button type="button" aria-label="Fermer" onClick={() => setOpen(false)} className="absolute inset-0 animate-[fade-in_0.15s_ease-out_both] bg-aegean-950/40 backdrop-blur-[2px]" />
      <div className="relative w-full max-w-[640px] animate-[menu-open_0.2s_var(--ease-out-expo)_both] overflow-hidden rounded-[22px] bg-white shadow-[0_40px_100px_-30px_rgba(4,21,43,0.6)] ring-1 ring-black/[0.06]">
        <div className="flex items-center gap-3 border-b border-black/[0.06] px-5">
          {pending ? <Loader2 className="size-5 animate-spin text-aegean-600" /> : <Search className="size-5 text-[var(--ink-45)]" />}
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((index) => Math.min(entries.length - 1, index + 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((index) => Math.max(0, index - 1));
              } else if (event.key === "Enter" && entries[active]) {
                event.preventDefault();
                go(entries[active].href);
              }
            }}
            placeholder="Rechercher un client, un projet, un devis, une facture…"
            className="h-14 min-w-0 flex-1 bg-transparent text-[1rem] outline-none placeholder:text-[var(--ink-45)]"
          />
          <kbd className="rounded-[6px] bg-black/[0.05] px-1.5 py-0.5 font-mono text-[0.6875rem] text-[var(--ink-45)]">Échap</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {entries.length === 0 ? (
            <li className="px-3 py-8 text-center text-[0.875rem] text-[var(--ink-45)]">{query.trim().length >= 2 && !pending ? "Aucun résultat." : "Tapez au moins deux lettres."}</li>
          ) : (
            entries.map((entry, index) => (
              <li key={entry.key}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(entry.href)}
                  className={cn("flex w-full cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2.5 text-left", index === active && "bg-aegean-50")}
                >
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-[10px]", index === active ? "bg-aegean-600 text-white" : "bg-black/[0.04] text-[var(--ink-65)]")}>
                    {entry.tag === "Action" ? <Plus className="size-4" /> : <entry.icon className="size-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[0.9375rem] font-bold">{entry.title}</span>
                    <span className="block truncate text-[0.75rem] text-[var(--ink-45)]">{entry.subtitle}</span>
                  </span>
                  <span className="rounded-full bg-black/[0.04] px-2 py-0.5 font-display text-[0.625rem] font-bold text-[var(--ink-45)] uppercase">{entry.tag}</span>
                  {index === active ? <CornerDownLeft className="size-4 text-aegean-600" /> : null}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
