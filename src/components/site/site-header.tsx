"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { LanguageSwitcher } from "@/components/site/language-switcher";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { Arches, Orbs } from "@/components/ui/decor";
import { Link, usePathname } from "@/i18n/navigation";
import { ContactLink } from "@/components/site/contact-link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Routes statiques uniquement : les routes dynamiques ont besoin de params. */
type StaticPath = "/services" | "/work" | "/studio" | "/journal";

const links: { href: StaticPath; key: "services" | "work" | "studio" | "journal" }[] = [
  { href: "/services", key: "services" },
  { href: "/work", key: "work" },
  { href: "/studio", key: "studio" },
  { href: "/journal", key: "journal" },
];

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-200 px-(--page-gutter) transition-[padding] duration-500 ease-[var(--ease-out-expo)]",
        scrolled && !open ? "pt-2 pb-3" : "py-3.5",
      )}
    >
      <nav
        aria-label="Principal"
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
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-full px-3.5 py-2 font-display text-[0.9375rem] font-semibold tracking-[-0.01em] transition-colors duration-300",
                    active
                      ? "bg-black/5 text-ink"
                      : "text-[var(--ink-65)] hover:bg-black/5 hover:text-ink",
                  )}
                >
                  {t(link.key)}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden sm:block">
          <LanguageSwitcher tone={open ? "dark" : "light"} />
        </div>

        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href="/contact">{t("cta")}</Link>
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
            open ? "bg-white text-aegean-900" : "bg-ink text-white",
          )}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <MobileMenu
        open={open}
        panelRef={panelRef}
        onNavigate={() => setOpen(false)}
        links={links}
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
  t,
}: {
  open: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
  onNavigate: () => void;
  links: { href: StaticPath; key: "services" | "work" | "studio" | "journal" }[];
  t: (key: string) => string;
}) {
  if (!open) return null;

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
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
          {links.map((link, index) => (
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
                <span className="font-display text-[clamp(2.25rem,11vw,3.5rem)] leading-[1.05] font-extrabold tracking-[-0.045em] transition-colors duration-300 group-hover:text-aegean-200">
                  {t(link.key)}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="ml-auto size-6 self-center text-white/35 transition-[transform,color] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white"
                />
              </Link>
            </li>
          ))}
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
