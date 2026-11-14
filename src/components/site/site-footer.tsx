import { getTranslations } from "next-intl/server";

import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { LandingKind, type Locale as DbLocale } from "@/generated/prisma/enums";
import { getLandings, getServices } from "@/lib/content";
import { ContactLink } from "@/components/site/contact-link";
import { siteConfig } from "@/lib/site";

export async function SiteFooter({ dbLocale }: { dbLocale: DbLocale }) {
  const [t, services, locations] = await Promise.all([
    getTranslations(),
    getServices(dbLocale),
    getLandings(dbLocale, LandingKind.LOCATION),
  ]);

  return (
    <footer className="pt-10 pb-8">
      <div className="page-shell">
        <div className="grid gap-8 pb-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-[1.2rem] font-extrabold tracking-[-0.04em]"
            >
              <Logo id="logo-footer" />
              Kalimera
            </Link>
            <p className="my-4 max-w-[32ch] text-[0.9375rem] text-[var(--ink-65)]">
              {t("footer.about")}
            </p>
            <Button asChild variant="blue" size="sm">
              <Link href="/contact">{t("nav.cta")}</Link>
            </Button>
          </div>

          <div>
            <h2 className="mb-4 font-display text-[0.8125rem] font-bold text-[var(--ink-45)]">
              {t("footer.servicesTitle")}
            </h2>
            <ul className="grid gap-2.5">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={{
                      pathname: "/services/[slug]",
                      params: { slug: service.translations[0].slug },
                    }}
                    className="text-[0.9375rem] text-[var(--ink-65)] transition-colors hover:text-ink"
                  >
                    {service.translations[0].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Les villes ne sont plus dans le menu : ce bloc garde un lien vers
              chacune depuis toutes les pages, utile au référencement local. */}
          <div>
            <h2 className="mb-4 font-display text-[0.8125rem] font-bold text-[var(--ink-45)]">
              {t("footer.locationsTitle")}
            </h2>
            <ul className="grid gap-2.5">
              {locations.map((location) => (
                <li key={location.id}>
                  <Link
                    href={{
                      pathname: "/locations/[slug]",
                      params: { slug: location.translations[0].slug },
                    }}
                    className="text-[0.9375rem] text-[var(--ink-65)] transition-colors hover:text-ink"
                  >
                    {/* Le titre complet : « Développement web à Aix-en-Provence »
                        est aussi l'ancre que l'on veut voir associée à la page. */}
                    {location.translations[0].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-display text-[0.8125rem] font-bold text-[var(--ink-45)]">
              {t("footer.studioTitle")}
            </h2>
            <ul className="grid gap-2.5">
              <li>
                <FooterLink href="/sectors">{t("nav.sectors")}</FooterLink>
              </li>
              <li>
                <FooterLink href="/locations">{t("nav.locations")}</FooterLink>
              </li>
              <li>
                <FooterLink href="/studio">{t("nav.studio")}</FooterLink>
              </li>
              <li>
                <FooterLink href="/work">{t("nav.work")}</FooterLink>
              </li>
              <li>
                <FooterLink href="/journal">{t("nav.journal")}</FooterLink>
              </li>
              <li>
                <FooterLink href="/legal">{t("footer.legal")}</FooterLink>
              </li>
              <li>
                <FooterLink href="/privacy">{t("footer.privacy")}</FooterLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-display text-[0.8125rem] font-bold text-[var(--ink-45)]">
              {t("footer.contactTitle")}
            </h2>
            <ul className="grid gap-2.5">
              <li>
                <ContactLink
                  kind="email"
                  href={`mailto:${siteConfig.email}`}
                  className="text-[0.9375rem] text-[var(--ink-65)] transition-colors hover:text-ink"
                >
                  {siteConfig.email}
                </ContactLink>
              </li>
              <li>
                <ContactLink
                  kind="phone"
                  href={`tel:${siteConfig.phoneHref}`}
                  className="text-[0.9375rem] text-[var(--ink-65)] transition-colors hover:text-ink"
                >
                  {siteConfig.phone}
                </ContactLink>
              </li>
              <li>
                <a
                  href={siteConfig.social.linkedin}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="text-[0.9375rem] text-[var(--ink-65)] transition-colors hover:text-ink"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.github}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="text-[0.9375rem] text-[var(--ink-65)] transition-colors hover:text-ink"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 rounded-full bg-white px-6 py-5 text-[0.8125rem] text-[var(--ink-45)] shadow-soft">
          <span>
            © {new Date().getFullYear()} Kalimera — {siteConfig.domain}
          </span>
          <span>{t("footer.rights")}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href:
    | "/studio"
    | "/sectors"
    | "/locations"
    | "/work"
    | "/journal"
    | "/legal"
    | "/privacy";
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[0.9375rem] text-[var(--ink-65)] transition-colors hover:text-ink"
    >
      {children}
    </Link>
  );
}
