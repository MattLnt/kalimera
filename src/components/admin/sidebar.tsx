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
import { Arches } from "@/components/ui/decor";
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
 * Navigation de l'administration, aux couleurs du site.
 *
 * Sur ordinateur, le panneau bleu nuit de kalimera.agency — dégradé, grain,
 * arches — posé en colonne flottante, groupé par usage. Sur téléphone, une
 * barre bleu nuit en bas d'écran, icône et titre, avec les quatre écrans
 * qu'on ouvre en rendez-vous ; « Plus » ouvre le reste en feuille.
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
      <aside className="sticky top-0 hidden h-dvh w-[280px] shrink-0 p-3 lg:block">
        <div className="night-panel relative isolate flex h-full flex-col overflow-hidden rounded-[30px] shadow-lift">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(98,169,242,0.45),transparent_68%)]"
          />
          <Arches count={4} className="h-[38%] opacity-60" />
          <span aria-hidden className="grain-layer" />

          <Link
            href="/admin"
            className="relative z-2 flex items-center gap-2 px-6 pt-6 pb-4 font-display text-lg font-extrabold tracking-[-0.04em] text-white"
          >
            <Logo id="logo-admin" />
            Kalimera
            <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 font-display text-[0.625rem] font-bold tracking-[0.08em] text-aegean-200 uppercase">
              Studio
            </span>
          </Link>

          <nav className="relative z-2 flex-1 overflow-y-auto px-3 pb-4 [scrollbar-color:rgba(255,255,255,0.2)_transparent] [scrollbar-width:thin]">
            {groups.map((group) => (
              <div key={group.title} className="mt-4 first:mt-1">
                <p className="mb-1 px-3 font-display text-[0.625rem] font-bold tracking-[0.12em] text-white/35 uppercase">
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
                              ? "bg-white text-aegean-800 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.6)]"
                              : "text-white/65 hover:bg-white/[0.08] hover:text-white",
                          )}
                        >
                          <item.icon className={cn("size-4 shrink-0", active && "text-aegean-600")} />
                          {item.label}
                          {count > 0 ? (
                            <span
                              className={cn(
                                "ml-auto min-w-5 rounded-full px-1.5 py-0.5 text-center text-[0.6875rem] font-bold",
                                active ? "bg-aegean-100 text-aegean-700" : "bg-aegean-500 text-white",
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

          <div className="relative z-2 grid gap-1 border-t border-white/10 p-3">
            <a
              href="/fr"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 rounded-[12px] px-3 py-2 font-display text-[0.875rem] font-semibold text-white/65 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <ExternalLink className="size-4" />
              Voir le site
            </a>
            <div className="flex items-center gap-2.5 rounded-[16px] bg-white/[0.06] px-3 py-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-aegean-400 to-aegean-600 font-display text-xs font-bold text-white">
                {(user.name || user.email).slice(0, 1).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[0.8125rem] font-bold text-white">{user.name}</span>
                <span className="block truncate text-[0.6875rem] text-white/45">{user.email}</span>
              </span>
              <button
                type="button"
                title="Se déconnecter"
                aria-label="Se déconnecter"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="grid size-8 cursor-pointer place-items-center rounded-full text-white/45 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------ téléphone : en-tête */}
      <header className="night-panel sticky top-0 z-30 flex items-center gap-2 overflow-hidden px-4 py-3.5 lg:hidden">
        <span aria-hidden className="grain-layer" />
        <Link href="/admin" className="relative flex items-center gap-2 font-display text-base font-extrabold tracking-[-0.04em] text-white">
          <Logo id="logo-admin-mobile" />
          Kalimera
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.5625rem] font-bold tracking-[0.08em] text-aegean-200 uppercase">
            Studio
          </span>
        </Link>
      </header>

      {/* ------------------------------------------------ téléphone : barre du bas */}
      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-2 bottom-2 z-40 rounded-[24px] bg-aegean-950/92 pb-[env(safe-area-inset-bottom)] shadow-[0_18px_40px_-12px_rgba(4,21,43,0.6)] ring-1 ring-white/10 backdrop-blur-xl lg:hidden"
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
                    active ? "text-white" : "text-white/50",
                  )}
                >
                  <span className={cn("grid h-7 w-12 place-items-center rounded-full transition-colors", active && "bg-aegean-500")}>
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
                moreActive ? "text-white" : "text-white/50",
              )}
            >
              <span className={cn("grid h-7 w-12 place-items-center rounded-full", moreActive && "bg-aegean-500")}>
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
            className="absolute inset-0 animate-[fade-in_0.2s_ease-out_both] bg-aegean-950/50"
          />
          <div className="night-panel absolute inset-x-0 bottom-0 max-h-[85dvh] animate-[sheet-up_0.3s_var(--ease-out-expo)_both] overflow-y-auto rounded-t-[28px] px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
            <span aria-hidden className="grain-layer" />
            <div className="relative">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="font-display text-lg font-extrabold tracking-[-0.03em] text-white">Menu</p>
                <button
                  type="button"
                  onClick={() => setSheet(false)}
                  aria-label="Fermer le menu"
                  className="grid size-9 cursor-pointer place-items-center rounded-full bg-white/10 text-white"
                >
                  <X className="size-4" />
                </button>
              </div>
              {groups.map((group) => (
                <div key={group.title} className="mt-4">
                  <p className="mb-1.5 px-1 font-display text-[0.625rem] font-bold tracking-[0.12em] text-white/40 uppercase">
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
                              active ? "bg-white text-aegean-800" : "bg-white/[0.07] text-white",
                            )}
                          >
                            <item.icon className="size-5" />
                            {item.label}
                            {count > 0 ? (
                              <span className="absolute top-1.5 right-1.5 min-w-5 rounded-full bg-aegean-500 px-1.5 text-[0.625rem] text-white">
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
                <a
                  href="/fr"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-white/10 py-3 font-display text-sm font-bold text-white"
                >
                  <ExternalLink className="size-4" />
                  Voir le site
                </a>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white py-3 font-display text-sm font-bold text-aegean-800"
                >
                  <LogOut className="size-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
