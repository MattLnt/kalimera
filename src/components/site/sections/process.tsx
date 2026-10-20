import { getTranslations } from "next-intl/server";

import { SectionHead } from "@/components/site/sections/section-head";
import { Reveal } from "@/components/ui/reveal";

export async function Process() {
  const t = await getTranslations("home.process");

  const steps = [1, 2, 3, 4].map((n) => ({
    n,
    title: t(`step${n}Title` as "step1Title"),
    body: t(`step${n}Body` as "step1Body"),
    duration: t(`step${n}Duration` as "step1Duration"),
  }));

  return (
    <section className="py-[clamp(4.5rem,10vh,8rem)]">
      <div className="page-shell">
        <SectionHead
          chip={t("chip")}
          titleTop={t("titleTop")}
          titleBottom={t("titleBottom")}
          lead={t("description")}
        />

        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal
              key={step.n}
              as="li"
              delay={Math.min(index, 3) as 0 | 1 | 2 | 3}
              className="surface-card surface-card-hover p-6 sm:p-7"
            >
              <span className="grid size-10 place-items-center rounded-full bg-ink font-display text-sm font-extrabold text-white">
                {String(step.n).padStart(2, "0")}
              </span>
              <h3 className="display-4 mt-4 mb-2">{step.title}</h3>
              <p className="text-body-muted">{step.body}</p>
              <span className="mt-4 inline-block rounded-full bg-aegean-50 px-3 py-1.5 font-display text-xs font-semibold text-aegean-700">
                {step.duration}
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
