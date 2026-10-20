import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Arches, Orbs } from "@/components/ui/decor";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  const nav = useTranslations("common");

  return (
    <section className="night-panel relative mx-(--page-gutter) my-(--page-gutter) overflow-hidden rounded-panel px-6 py-[clamp(6rem,18vh,10rem)] text-center sm:px-12">
      <Orbs />
      <Arches className="h-[50%] opacity-40" />
      <span aria-hidden className="grain-layer" />

      <div className="relative z-2 mx-auto max-w-[46ch]">
        <p className="gradient-light font-display text-[clamp(4rem,12vw,8rem)] leading-none font-extrabold tracking-[-0.05em]">
          404
        </p>
        <h1 className="display-2 mt-4 text-white">{t("title")}</h1>
        <p className="mt-5 text-white/70">{t("description")}</p>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="white">
            <Link href="/">{nav("backHome")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
