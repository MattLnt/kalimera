"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  ExternalLink,
  FileSignature,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  LayoutGrid,
  Layers,
  LogOut,
  Mail,
  Map,
  MoreHorizontal,
  Quote,
  Receipt,
  Settings,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icon: LucideIcon; exact?: boolean; badge?: "messages" | "tasks" };

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Pilotage",
    items: [
      { href: "/admin", label: "Tableau de bord", icon: LayoutGrid, exact: true },
      { href: "/admin/tasks", label: "Tâches", icon: CheckSquare, badge: "tasks" },
      { href: "/admin/bookings", label: "Agenda", icon: CalendarDays },
    ],
  },
  {
    title: "Clients",
    items: [
      { href: "/admin/clients", label: "Clients", icon: Users },
      { href: "/admin/deals", label: "Projets", icon: BriefcaseBusiness },
      { href: "/admin/messages", label: "Demandes", icon: Mail, badge: "messages" },
    ],
  },
  {
    title: "Ventes",
    items: [
      { href: "/admin/quotes", label: "Devis", icon: FileSignature },
      { href: "/admin/invoices", label: "Factures", icon: Receipt },
    ],
  },
  {
    title: "Site",
    items: [
      { href: "/admin/projects", label: "Portfolio", icon: FolderKanban },
      { href: "/admin/posts", label: "Journal", icon: FileText },
      { href: "/admin/services", label: "Services", icon: Layers },
      { href: "/admin/landings", label: "Secteurs & villes", icon: Map },
      { href: "/admin/testimonials", label: "Témoignages", icon: Quote },
      { href: "/admin/media", label: "Médias", icon: ImageIcon },
    ],
  },
  {
    title: "Compte",
    items: [{ href: "/admin/settings", label: "Réglages", icon: Settings }],
  },
];

/** Les quatre destinations de la barre du bas ; le reste passe par « Plus ». */
const mobileBar: Item[] = [
  { href: "/admin", label: "Accueil", icon: LayoutGrid, exact: true },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/deals", label: "Projets", icon: BriefcaseBusiness },
  { href: "/admin/quotes", label: "Devis", icon: FileSignature },
];

type Counts = { messages: number; tasks: number };

function isActive(pathname: string, item: Item) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/**
 * Navigation de l'administration.
 *
 * Sur ordinateur, une barre latérale fixe, groupée par usage : piloter,
 * suivre les clients, vendre, tenir le site. Sur téléphone, une barre en bas
 * d'écran — icône et titre — avec les quatre écrans qu'on ouvre en rendez-vous
 * ou en déplacement ; « Plus » ouvre le reste en feuille.
 */
export function AdminSidebar({
  user,
  counts,
}: {
  user: { name: string; email: string };
  counts: Counts;
}) {
  const pathname = usePathname();
  const [sheet, setSheet] = useState(false);

  // La feuille se referme dès qu'on change de page.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setSheet(false);
  }

  useEffect(() => {
    if (!sheet) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheet]);

  const badge = (item: Item) => (item.badge ? counts[item.badge] : 0);
  const moreActive = !mobileBar.some((item) => isActive(pathname, item));

  return (
    <>
      {/* ------------------------------------------------ ordinateur */}
      <aside className="sticky top-0 hidden h-dvh w-[264px] shrink-0 flex-col border-r border-black/5 bg-white lg:flex">
        <Link
          href="/admin"
          className="flex items-center gap-2 px-6 pt-6 pb-4 font-display text-lg font-extrabold tracking-[-0.04em]"
        >
          <Logo id="logo-admin" />
          Kalimera
          <span className="ml-auto rounded-full bg-aegean-50 px-2 py-0.5 font-display text-[0.625rem] font-bold tracking-[0.08em] text-aegean-700 uppercase">
            Studio
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {groups.map((group) => (
            <div key={group.title} className="mt-4 first:mt-1">
              <p className="mb-1 px-3 font-display text-[0.625rem] font-bold tracking-[0.1em] text-[var(--ink-45)] uppercase">
                {group.title}
              </p>
              <ul className="grid gap-0.5">
                {group.items.map((item) => {
                  const active = isActive(pathname, item);
                  const count = badge(item);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2.5 rounded-[12px] px-3 py-2 font-display text-[0.875rem] font-semibold transition-colors",
                          active
                            ? "bg-aegean-600 text-white shadow-[0_8px_20px_-10px_rgba(21,98,184,0.8)]"
                            : "text-[var(--ink-65)] hover:bg-aegean-50 hover:text-ink",
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        {item.label}
                        {count > 0 ? (
                          <span
                            className={cn(
                              "ml-auto min-w-5 rounded-full px-1.5 py-0.5 text-center text-[0.6875rem] font-bold",
                              active ? "bg-white/20 text-white" : "bg-aegean-600 text-white",
                            )}
                          >
                            {count}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="grid gap-1 border-t border-black/5 p-3">
          <a
            href="/fr"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-[12px] px-3 py-2 font-display text-[0.875rem] font-semibold text-[var(--ink-65)] transition-colors hover:bg-aegean-50 hover:text-ink"
          >
            <ExternalLink className="size-4" />
            Voir le site
          </a>
          <div className="flex items-center gap-2.5 rounded-[12px] px-3 py-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-aegean-600 font-display text-xs font-bold text-white">
              {(user.name || user.email).slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-[0.8125rem] font-bold">{user.name}</span>
              <span className="block truncate text-[0.6875rem] text-[var(--ink-45)]">{user.email}</span>
            </span>
            <button
              type="button"
              title="Se déconnecter"
              aria-label="Se déconnecter"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="grid size-8 cursor-pointer place-items-center rounded-full text-[var(--ink-45)] transition-colors hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------ téléphone : en-tête */}
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/5 bg-white/85 px-4 py-3 backdrop-blur-lg lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-display text-base font-extrabold tracking-[-0.04em]">
          <Logo id="logo-admin-mobile" />
          Kalimera
        </Link>
      </header>

      {/* ------------------------------------------------ téléphone : barre du bas */}
      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden"
      >
        <ul className="grid grid-cols-5">
          {mobileBar.map((item) => {
            const active = isActive(pathname, item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-1 pt-2.5 pb-2 font-display text-[0.6875rem] font-bold transition-colors",
                    active ? "text-aegean-700" : "text-[var(--ink-45)]",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-7 w-12 place-items-center rounded-full transition-colors",
                      active && "bg-aegean-100",
                    )}
                  >
                    <item.icon className="size-[18px]" />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setSheet(true)}
              aria-expanded={sheet}
              className={cn(
                "flex w-full cursor-pointer flex-col items-center gap-1 pt-2.5 pb-2 font-display text-[0.6875rem] font-bold",
                moreActive ? "text-aegean-700" : "text-[var(--ink-45)]",
              )}
            >
              <span className={cn("grid h-7 w-12 place-items-center rounded-full", moreActive && "bg-aegean-100")}>
                <MoreHorizontal className="size-[18px]" />
              </span>
              Plus
            </button>
          </li>
        </ul>
      </nav>

      {/* ------------------------------------------------ téléphone : feuille « Plus » */}
      {sheet ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setSheet(false)}
            className="absolute inset-0 animate-[fade-in_0.2s_ease-out_both] bg-ink/40"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] animate-[sheet-up_0.3s_var(--ease-out-expo)_both] overflow-y-auto rounded-t-[28px] bg-white px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-black/10" />
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="font-display text-lg font-extrabold tracking-[-0.03em]">Menu</p>
              <button
                type="button"
                onClick={() => setSheet(false)}
                aria-label="Fermer le menu"
                className="grid size-9 cursor-pointer place-items-center rounded-full bg-black/5"
              >
                <X className="size-4" />
              </button>
            </div>
            {groups.map((group) => (
              <div key={group.title} className="mt-4">
                <p className="mb-1.5 px-1 font-display text-[0.625rem] font-bold tracking-[0.1em] text-[var(--ink-45)] uppercase">
                  {group.title}
                </p>
                <ul className="grid grid-cols-3 gap-2">
                  {group.items.map((item) => {
                    const active = isActive(pathname, item);
                    const count = badge(item);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "relative flex h-full flex-col items-center gap-1.5 rounded-[16px] px-2 py-3 text-center font-display text-[0.75rem] font-bold",
                            active ? "bg-aegean-600 text-white" : "bg-aegean-50/60 text-ink",
                          )}
                        >
                          <item.icon className="size-5" />
                          {item.label}
                          {count > 0 ? (
                            <span className="absolute top-1.5 right-1.5 min-w-5 rounded-full bg-aegean-600 px-1.5 text-[0.625rem] text-white">
                              {count}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <div className="mt-6 grid grid-cols-2 gap-2">
              <a href="/fr" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-black/5 py-3 font-display text-sm font-bold">
                <ExternalLink className="size-4" />
                Voir le site
              </a>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-red-50 py-3 font-display text-sm font-bold text-red-700"
              >
                <LogOut className="size-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
