import { Blocks, Gauge, Languages, Workflow } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { SectionHead } from "@/components/site/sections/section-head";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export async function StudioBento() {
  const t = await getTranslations("home.studio");

  return (
    <section className="py-[clamp(4.5rem,10vh,8rem)]">
      <div className="page-shell">
        <SectionHead
          chip={t("chip")}
          titleTop={t("titleTop")}
          titleBottom={t("titleBottom")}
          lead={t("description")}
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <BentoCard tone="dark" className="lg:col-span-3">
            <span className="arch-deco" />
            <Icon tone="dark">
              <Blocks className="size-5" />
            </Icon>
            <h3 className="display-3">{t("card1Title")}</h3>
            <p className="mt-2.5 text-[0.9375rem] text-white/70">{t("card1Body")}</p>
            <Terminal />
          </BentoCard>

          <BentoCard className="flex flex-col lg:col-span-3">
            <Icon>
              <Workflow className="size-5" />
            </Icon>
            <h3 className="display-3">{t("card2Title")}</h3>
            <p className="text-body-muted mt-2.5">{t("card2Body")}</p>
            <ul className="mt-auto flex flex-wrap gap-2 pt-6">
              {t("card2Tags")
                .split("|")
                .map((tag) => (
                  <li key={tag} className="rounded-full bg-aegean-50 px-3 py-1.5 font-display text-[0.8125rem] font-bold text-aegean-800">
                    {tag}
                  </li>
                ))}
            </ul>
          </BentoCard>

          <BentoCard delay={1} className="lg:col-span-2">
            <Icon>
              <Gauge className="size-5" />
            </Icon>
            <h3 className="display-3">{t("card3Title")}</h3>
            <p className="text-body-muted mt-2.5">{t("card3Body")}</p>
          </BentoCard>

          <BentoCard tone="blue" delay={2} className="lg:col-span-2">
            <span className="arch-deco" />
            <Icon tone="dark">
              <Languages className="size-5" />
            </Icon>
            <h3 className="display-3">{t("card4Title")}</h3>
            <p className="mt-2.5 text-[0.9375rem] text-white/72">{t("card4Body")}</p>
          </BentoCard>

          <BentoCard delay={3} className="flex flex-col justify-center lg:col-span-2">
            <div className="gradient-number pb-1.5 font-display text-[clamp(2.6rem,4vw,3.6rem)] leading-[1.05] font-extrabold tracking-[-0.05em] whitespace-nowrap">
              {t("statScoreValue")}
            </div>
            <p className="mt-3 max-w-[26ch] text-base leading-[1.5] text-[var(--ink-74)]">
              {t("statScoreCaption")}
            </p>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  children,
  tone = "white",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  tone?: "white" | "dark" | "blue";
  delay?: 0 | 1 | 2 | 3;
  className?: string;
}) {
  return (
    <Reveal
      delay={delay}
      as="article"
      className={cn(
        "surface-card surface-card-hover relative overflow-hidden p-6 sm:p-8",
        tone === "dark" && "bg-linear-[150deg,var(--color-aegean-800),var(--color-aegean-950)] text-white",
        tone === "blue" && "bg-linear-[150deg,var(--color-aegean-600),var(--color-aegean-800)] text-white",
        className,
      )}
    >
      {children}
    </Reveal>
  );
}

function Icon({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "mb-4 grid size-[46px] place-items-center rounded-field",
        tone === "light" ? "bg-aegean-100 text-aegean-700" : "bg-white/12 text-white",
      )}
    >
      {children}
    </span>
  );
}

/** Petit terminal décoratif : dit « on code » sans avoir à l'écrire. */
function Terminal() {
  return (
    <div
      aria-hidden
      className="mt-5 rounded-field bg-black/28 px-4 py-3.5 font-mono text-[0.78125rem] leading-[1.8] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
    >
      <div className="truncate text-white/55">
        <span className="text-aegean-400">$</span> npm run build
      </div>
      <div className="truncate text-white/55">
        <span className="text-[#8EE6A8]">✓</span> Compiled successfully — 0 errors
      </div>
      <div className="truncate text-white/55">
        <span className="text-[#8EE6A8]">✓</span> 42 pages generated · 1.2s
      </div>
    </div>
  );
}
