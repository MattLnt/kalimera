import { getTranslations } from "next-intl/server";

import { Arches } from "@/components/ui/decor";
import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/lib/site";

export async function StatsPanel() {
  const t = await getTranslations("home.stats");
  const { projects, platforms, countries, locales } = siteConfig.stats;

  // Quatre chiffres, tous vérifiables dans le portfolio : aucun score déclaratif.
  const stats = [
    { value: projects, suffix: "", label: t("projects") },
    { value: platforms, suffix: "", label: t("platforms") },
    { value: countries, suffix: "", label: t("countries") },
    { value: locales, suffix: "", label: t("locales") },
  ];

  return (
    <Reveal
      as="section"
      className="night-panel relative mx-(--page-gutter) overflow-hidden rounded-panel p-8 shadow-lift sm:p-12 lg:p-16"
    >
      <Arches count={10} className="h-[70%] opacity-40" />
      <div className="relative z-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[20px] bg-white/7 px-6 py-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
          >
            <div className="font-display text-[clamp(2.2rem,3.8vw,3.2rem)] leading-none font-extrabold tracking-[-0.05em] text-white">
              <Counter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="mt-2 text-sm text-white/62">{stat.label}</div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
