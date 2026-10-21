"use client";

import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { ContactLink } from "@/components/site/contact-link";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { Logo } from "@/components/site/logo";
import { MegaPanel, type MegaColumn } from "@/components/site/mega-panel";
import type { NavData } from "@/components/site/nav-data";
import { Button } from "@/components/ui/button";
import { Arches, Orbs } from "@/components/ui/decor";
import { Link, usePathname } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Routes statiques uniquement : les routes dynamiques ont besoin de params. */
type StaticPath =
  | "/services"
  | "/sectors"
  | "/locations"
  | "/work"
  | "/studio"
  | "/journal";

type NavKey = "build" | "sectors" | "work" | "studio" | "journal";

type MegaKey = "build" | "sectors";

/**
 * Deux entrées ouvrent un panneau, les autres sont des liens directs.
 *
 * `menu` désigne le panneau à ouvrir, et `href` reste la destination du clic :
 * le menu fonctionne donc à la souris comme au clavier, et reste utilisable
 * si le JavaScript n'a pas encore pris la main.
 */
const links: { href: StaticPath; key: NavKey; menu?: MegaKey }[] = [
  { href: "/services", key: "build", menu: "build" },
  { href: "/sectors", key: "sectors", menu: "sectors" },
  { href: "/work", key: "work" },
  { href: "/studio", key: "studio" },
  { href: "/journal", key: "journal" },
];

export function SiteHeader({ nav }: { nav: NavData }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<MegaKey | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Le panneau se referme à la navigation. Le composant n'étant pas démonté,
  // il resterait sinon ouvert par-dessus la nouvelle page. L'ajustement se
  // fait au rendu et non dans un effet : c'est le motif recommandé pour
  // recaler un état sur un changement de props, et il évite le rendu en
  // cascade d'un `setState` appelé depuis un effet.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMega(null);
    setOpen(false);
  }

  useEffect(() => {
    if (!mega) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMega(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!megaRef.current?.contains(event.target as Node)) setMega(null);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [mega]);

  useEffect(() => {
    if (!open) return;

    // Le menu occupe tout l'écran : la page derrière ne doit plus défiler.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Échap referme, et le focus part dans le panneau puis revient au bouton.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    // Capturé maintenant : au nettoyage, la ref pourrait déjà pointer ailleurs.
    const toggle = toggleRef.current;

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
      toggle?.focus();
    };
  }, [open]);

  /** Latence à la sortie : traverser le vide ne doit pas tout refermer. */
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(null), 110);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const columns: Record<MegaKey, MegaColumn[]> = {
    build: [
      {
        heading: t("build"),
        entries: nav.services,
        pathname: "/services/[slug]",
        allLabel: t("allServices"),
        allHref: "/services",
        split: true,
      },
    ],
    sectors: [
      {
        heading: t("sectors"),
        entries: nav.sectors,
        pathname: "/sectors/[slug]",
        allLabel: t("allSectors"),
        allHref: "/sectors",
      },
      {
        heading: t("markets"),
        entries: nav.locations,
        pathname: "/locations/[slug]",
        allLabel: t("locations"),
        allHref: "/locations",
      },
    ],
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-200 px-(--page-gutter) transition-[padding] duration-500 ease-[var(--ease-out-expo)]",
        scrolled && !open ? "pt-2 pb-3" : "py-3.5",
      )}
    >
      <nav
        aria-label="Principal"
        onMouseEnter={cancelClose}
        className={cn(
          "relative z-10 mx-auto flex max-w-[1280px] items-center gap-4 rounded-full py-[9px] pr-[9px] pl-[22px] transition-[background-color,box-shadow,color] duration-500 ease-[var(--ease-out-expo)]",
          open
            ? "bg-white/10 text-white shadow-none backdrop-blur-[22px]"
            : "bg-white/72 shadow-[0_1px_1px_rgba(7,33,63,0.04),0_10px_30px_-12px_rgba(7,33,63,0.18)] backdrop-blur-[22px] backdrop-saturate-150",
        )}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="mr-auto flex items-center gap-2 font-display text-[1.2rem] font-extrabold tracking-[-0.04em]"
        >
          <Logo id="logo-header" />
          Kalimera
        </Link>

        <ul className="hidden gap-1 lg:flex">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            const expanded = mega === link.menu;

            return (
              <li
                key={link.href}
                onMouseEnter={() => {
                  if (!link.menu) {
                    setMega(null);
                    return;
                  }
                  cancelClose();
                  setMega(link.menu);
                }}
                onMouseLeave={link.menu ? scheduleClose : undefined}
              >
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  aria-expanded={link.menu ? expanded : undefined}
                  onFocus={() => setMega(link.menu ?? null)}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3.5 py-2 font-display text-[0.9375rem] font-semibold tracking-[-0.01em] transition-colors duration-300",
                    active || expanded
                      ? "bg-black/5 text-ink"
                      : "text-[var(--ink-65)] hover:bg-black/5 hover:text-ink",
                  )}
                >
                  {t(link.key)}
                  {link.menu ? (
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        "size-3.5 transition-transform duration-300",
                        expanded && "rotate-180",
                      )}
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden sm:block">
          <LanguageSwitcher tone={open ? "dark" : "light"} />
        </div>

        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href="/contact" onClick={() => setOpen(false)}>
            {t("cta")}
          </Link>
        </Button>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          className={cn(
            "grid size-10 cursor-pointer place-items-center rounded-full transition-colors duration-300 lg:hidden",
            open ? "bg-white/15 text-white" : "bg-black/5 text-ink",
          )}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Hors du <nav> arrondi : le panneau doit pouvoir le déborder. Le
          conteneur inclut l'espace qui le sépare de la barre, sinon une
          trajectoire en diagonale traverse une zone morte et referme tout. */}
      {mega ? (
        <div
          ref={megaRef}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="relative z-9 mx-auto hidden max-w-[1280px] pt-2 lg:block"
        >
          <div className="animate-[menu-open_0.18s_var(--ease-out-expo)_both] overflow-hidden rounded-[26px] bg-white/92 shadow-[0_1px_1px_rgba(7,33,63,0.04),0_24px_60px_-20px_rgba(7,33,63,0.28)] backdrop-blur-[22px] backdrop-saturate-150">
            <MegaPanel columns={columns[mega]} onNavigate={() => setMega(null)} />
          </div>
        </div>
      ) : null}

      <MobileMenu
        open={open}
        panelRef={panelRef}
        onNavigate={() => setOpen(false)}
        links={links}
        nav={nav}
        t={t}
      />
    </header>
  );
}

function MobileMenu({
  open,
  panelRef,
  onNavigate,
  links,
  nav,
  t,
}: {
  open: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
  onNavigate: () => void;
  links: { href: StaticPath; key: NavKey; menu?: MegaKey }[];
  nav: NavData;
  t: (key: string) => string;
}) {
  if (!open) return null;

  /**
   * Sous-liste en pastilles sous l'entrée concernée. Les pages d'intention
   * sont ainsi atteignables en un geste depuis le mobile, sans accordéon à
   * déplier — et elles reçoivent un lien depuis chaque page du site.
   */
  const subGroups = (menu?: MegaKey) => {
    if (menu === "build") {
      return [{ pathname: "/services/[slug]" as const, entries: nav.services }];
    }
    if (menu === "sectors") {
      return [
        { pathname: "/sectors/[slug]" as const, entries: nav.sectors },
        { pathname: "/locations/[slug]" as const, entries: nav.locations },
      ];
    }
    return [];
  };

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      // Le panneau defile nativement : Lenis ne doit pas s'en meler.
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={t("openMenu")}
      className="night-panel fixed inset-0 z-0 flex animate-[menu-open_0.5s_var(--ease-out-expo)_both] flex-col overflow-y-auto overscroll-contain px-(--page-gutter) pt-28 pb-10 lg:hidden"
    >
      <Orbs />
      <Arches count={6} className="h-[45%] opacity-40" />
      <span aria-hidden className="grain-layer" />

      <nav aria-label="Menu" className="relative z-2">
        <ul className="grid">
          {links.map((link, index) => {
            const groups = subGroups(link.menu);

            return (
              <li
                key={link.href}
                className="animate-[menu-item_0.6s_var(--ease-out-expo)_both] border-b border-white/10"
                style={{ animationDelay: `${0.06 + index * 0.06}s` }}
              >
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className="group flex items-baseline gap-4 py-5 text-white"
                >
                  <span className="font-display text-xs font-bold text-white/35 tabular-nums">
                    0{index + 1}
                  </span>
                  <span className="font-display text-[clamp(1.9rem,9vw,3.1rem)] leading-[1.05] font-extrabold tracking-[-0.045em] transition-colors duration-300 group-hover:text-aegean-200">
                    {t(link.key)}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="ml-auto size-6 self-center text-white/35 transition-[transform,color] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white"
                  />
                </Link>

                {groups.length > 0 ? (
                  <ul className="mb-5 flex flex-wrap gap-1.5">
                    {groups.flatMap((group) =>
                      group.entries.map((entry) => (
                        <li key={`${group.pathname}-${entry.slug}`}>
                          <Link
                            href={{
                              pathname: group.pathname,
                              params: { slug: entry.slug },
                            }}
                            onClick={onNavigate}
                            className="block rounded-full bg-white/10 px-3.5 py-2 font-display text-[0.8125rem] font-semibold text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                          >
                            {entry.title}
                          </Link>
                        </li>
                      )),
                    )}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className="relative z-2 mt-10 animate-[menu-item_0.6s_var(--ease-out-expo)_both] space-y-6"
        style={{ animationDelay: "0.34s" }}
      >
        <Button asChild variant="white" className="w-full justify-between">
          <Link href="/contact" onClick={onNavigate}>
            {t("cta")}
          </Link>
        </Button>

        <div className="grid gap-1.5">
          <ContactLink
            kind="email"
            href={`mailto:${siteConfig.email}`}
            className="font-display text-base font-bold tracking-[-0.02em] text-white transition-colors hover:text-aegean-200"
          >
            {siteConfig.email}
          </ContactLink>
          <ContactLink
            kind="phone"
            href={`tel:${siteConfig.phoneHref}`}
            className="font-display text-base font-bold tracking-[-0.02em] text-white/70 transition-colors hover:text-white"
          >
            {siteConfig.phone}
          </ContactLink>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-6">
          <LanguageSwitcher tone="dark" />
          <span className="font-display text-xs font-semibold text-white/40">
            {siteConfig.markets.map((market) => market.label).join(" · ")}
          </span>
        </div>
      </div>
    </div>
  );
}
