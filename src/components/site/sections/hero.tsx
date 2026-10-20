import { getTranslations } from "next-intl/server";

import { Arches, Orbs } from "@/components/ui/decor";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export async function Hero() {
  const t = await getTranslations("home.hero");

  return (
    <header className="night-panel relative mx-(--page-gutter) flex min-h-[min(92vh,880px)] items-end overflow-hidden rounded-panel px-6 pt-[clamp(110px,16vh,170px)] pb-[clamp(26px,4vh,44px)] sm:px-10 lg:px-16">
      <Orbs />
      <Arches />
      <span aria-hidden className="grain-layer" />

      <div className="relative z-2 w-full">
        <div className="mb-[clamp(1.6rem,4vh,2.6rem)] flex flex-wrap items-center justify-between gap-4">
          <Chip tone="dark">{t("chip")}</Chip>
          <span className="font-display text-[0.9375rem] font-semibold text-white/60">
            {t("greek")}
          </span>
        </div>

        {/* Les trois lignes montent l'une après l'autre au chargement. */}
        <h1 className="display-1 text-white">
          {[t("line1"), t("line2")].map((line, index) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span
                className="block animate-[hero-line_1.15s_var(--ease-out-expo)_both]"
                style={{ animationDelay: `${index * 0.09}s` }}
              >
                {line}
              </span>
            </span>
          ))}
          <span className="block overflow-hidden pb-[0.06em]">
            <span
              className="gradient-light block animate-[hero-line_1.15s_var(--ease-out-expo)_both]"
              style={{ animationDelay: "0.18s" }}
            >
              {t("line3")}
            </span>
          </span>
        </h1>

        <div className="mt-[clamp(1.8rem,5vh,3rem)] grid animate-[hero-fade_0.9s_var(--ease-out-expo)_0.5s_both] items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <p className="text-lead text-lead-light">{t("description")}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Button asChild variant="white">
                <Link href="/contact">{t("primary")}</Link>
              </Button>
              <Button asChild variant="soft">
                <Link href="/work">{t("secondary")}</Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-full bg-white/10 px-5 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] backdrop-blur-md">
            <div aria-hidden className="flex">
              <span className="size-[34px] rounded-full bg-linear-[140deg,var(--color-aegean-400),var(--color-aegean-700)] ring-2 ring-aegean-900" />
              <span className="-ml-3 size-[34px] rounded-full bg-linear-[140deg,#8EC5FF,var(--color-aegean-600)] ring-2 ring-aegean-900" />
              <span className="-ml-3 size-[34px] rounded-full bg-linear-[140deg,var(--color-aegean-200),var(--color-aegean-700)] ring-2 ring-aegean-900" />
            </div>
            <div>
              <b className="block font-display text-[0.9375rem] font-bold tracking-[-0.02em] text-white">
                {t("proofTitle", { count: siteConfig.stats.projects })}
              </b>
              <small className="block text-xs text-white/60">
                {t("proofSubtitle", { score: siteConfig.stats.lighthouse })}
              </small>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
