import { getTranslations } from "next-intl/server";

import { Arches } from "@/components/ui/decor";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export async function CtaPanel() {
  const t = await getTranslations("home.cta");

  return (
    <section className="night-panel relative mx-(--page-gutter) mb-(--page-gutter) overflow-hidden rounded-panel px-6 py-[clamp(3rem,8vh,6rem)] text-center shadow-lift sm:px-12">
      <Arches className="h-[55%] opacity-45" />
      <span aria-hidden className="grain-layer" />

      <div className="relative z-2 mx-auto max-w-[820px]">
        <Reveal>
          <Chip tone="dark">{t("chip")}</Chip>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="display-2 my-5 text-white">
            {t("titleTop")} <span className="gradient-light">{t("titleBottom")}</span>
          </h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="mx-auto mb-8 max-w-[48ch] text-white/70">{t("description")}</p>
        </Reveal>
        <Reveal delay={3} className="flex flex-wrap justify-center gap-2.5">
          <Button asChild variant="white">
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </Button>
          <Button asChild variant="soft">
            <Link href="/contact">{t("secondary")}</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
