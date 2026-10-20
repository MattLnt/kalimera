"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { LanguageSwitcher } from "@/components/site/language-switcher";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-200 px-(--page-gutter) transition-[padding] duration-500 ease-[var(--ease-out-expo)]",
        scrolled ? "pt-2 pb-3" : "py-3.5",
      )}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-[1280px] items-center gap-4 rounded-full bg-white/72 py-[9px] pr-[9px] pl-[22px] shadow-[0_1px_1px_rgba(7,33,63,0.04),0_10px_30px_-12px_rgba(7,33,63,0.18)] backdrop-blur-[22px] backdrop-saturate-150"
      >
        <Link
          href="/"
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

        <LanguageSwitcher />

        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href="/contact">{t("cta")}</Link>
        </Button>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          className="grid size-10 cursor-pointer place-items-center rounded-full bg-ink text-white lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="mt-2 rounded-card bg-white p-3 shadow-lift lg:hidden"
        >
          <ul className="grid gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-field px-4 py-3 font-display text-lg font-bold tracking-[-0.03em] transition-colors hover:bg-aegean-50"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
            <li className="mt-1">
              <Button asChild variant="blue" className="w-full justify-between">
                <Link href="/contact" onClick={() => setOpen(false)}>
                  {t("cta")}
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
