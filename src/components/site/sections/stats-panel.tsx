import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { Chip } from "@/components/ui/chip";
import { Flag } from "@/components/ui/flag";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { optimized } from "@/lib/cloudinary";
import { getProjects } from "@/lib/content";
import { toDbLocale } from "@/lib/locale";

/** Une teinte par type de projet, dans les bleus de la marque. */
const KIND_COLORS: Record<string, string> = {
  WEBAPP: "#0B3A75",
  ECOMMERCE: "#1F6FD1",
  WEBSITE: "#38A3E8",
  MOBILE: "#0E9AA7",
  DESIGN: "#94A3B8",
};

/**
 * « En bref » : la preuve par l'écran. Le nombre de projets en ligne, leur
 * répartition par type, les pays et les langues, et les sites eux-mêmes,
 * cliquables. Tout vient du portfolio publié : rien à tenir à jour à la main.
 */
export async function StatsPanel() {
  const locale = (await getLocale()) as AppLocale;
  const [t, tKind, projects] = await Promise.all([getTranslations("home.stats"), getTranslations("work.kind"), getProjects(toDbLocale(locale))]);
  const live = projects.filter((project) => project.liveUrl);
  if (live.length === 0) return null;

  const kinds = Object.entries(
    live.reduce<Record<string, number>>((acc, project) => {
      acc[project.kind] = (acc[project.kind] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const domain = (url: string) => url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

  return (
    <section className="pb-[clamp(4.5rem,10vh,8rem)]">
      <div className="page-shell">
        <Reveal className="grid gap-10 rounded-panel bg-white p-7 shadow-lift sm:p-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 lg:p-14">
          {/* ------------------------------------------------ le résumé */}
          <div className="flex flex-col">
            <Chip className="self-start">{t("chip")}</Chip>
            <h2 className="display-2 mt-4">
              {t("titleTop")}
              <br />
              <span className="gradient-dark">{t("titleBottom")}</span>
            </h2>
            <p className="text-lead mt-5 max-w-[46ch]">{t("intro")}</p>

            <div className="mt-8">
              <p className="mb-3 font-display text-[0.75rem] font-bold tracking-[0.08em] text-[var(--ink-45)] uppercase">{t("breakdown")}</p>
              <div className="flex h-3 gap-1 overflow-hidden rounded-full">
                {kinds.map(([kind, count]) => (
                  <span key={kind} className="h-full rounded-full" style={{ flexGrow: count, background: KIND_COLORS[kind] ?? "#94A3B8" }} />
                ))}
              </div>
              <ul className="mt-4 grid gap-2.5">
                {kinds.map(([kind]) => (
                  <li key={kind} className="flex items-center gap-3 text-[0.9375rem]">
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: KIND_COLORS[kind] ?? "#94A3B8" }} />
                    <span className="flex-1 text-[var(--ink-74)]">{tKind(kind)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-8 grid gap-4 border-t border-black/[0.06] pt-6 sm:grid-cols-2">
              <div>
                <dt className="font-display text-[0.75rem] font-bold tracking-[0.08em] text-[var(--ink-45)] uppercase">{t("countries")}</dt>
                <dd className="mt-2.5 flex gap-2.5">
                  <Flag code="be" label={t("countryBe")} className="h-6 w-9" />
                  <Flag code="fr" label={t("countryFr")} className="h-6 w-9" />
                  <Flag code="us" label={t("countryUs")} className="h-6 w-9" />
                </dd>
              </div>
              <div>
                <dt className="font-display text-[0.75rem] font-bold tracking-[0.08em] text-[var(--ink-45)] uppercase">{t("locales")}</dt>
                <dd className="mt-2.5 flex gap-2.5">
                  <Flag code="fr" label={t("langFr")} className="h-6 w-9" />
                  <Flag code="gb" label={t("langEn")} className="h-6 w-9" />
                  <Flag code="es" label={t("langEs")} className="h-6 w-9" />
                </dd>
              </div>
            </dl>
          </div>

          {/* ------------------------------------------------ les sites */}
          <div className="flex flex-col gap-4">
            <ul className="grid flex-1 auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {live.map((project) => (
                <li key={project.id}>
                  <a
                    href={project.liveUrl!}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${t("visit")} : ${project.client}`}
                    className="group flex h-full flex-col gap-3 rounded-[20px] bg-[#F5F8FC] p-2.5 pb-4 transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_0_0_1px_#DFE6EF,0_18px_36px_-20px_rgba(7,33,63,0.35)]"
                  >
                    {project.coverImage ? (
                      <span className="relative block aspect-[16/10] overflow-hidden rounded-[14px] bg-white shadow-[0_0_0_1px_rgba(7,33,63,0.06)]">
                        <Image
                          src={optimized(project.coverImage.url, { width: 480 })}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 90vw, (max-width: 1280px) 40vw, 200px"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      </span>
                    ) : null}
                    <span className="flex items-center gap-2 px-1.5">
                      <span className="size-2 shrink-0 rounded-full" style={{ background: KIND_COLORS[project.kind] ?? "#94A3B8" }} />
                      <span className="truncate font-display text-[0.6875rem] font-bold tracking-[0.06em] text-[var(--ink-45)] uppercase">{tKind(project.kind)}</span>
                      <ArrowUpRight className="ml-auto size-4 shrink-0 text-[var(--ink-45)] transition-colors group-hover:text-aegean-600" />
                    </span>
                    <span className="mt-auto px-1.5">
                      <span className="block truncate font-display text-[1.0625rem] font-extrabold tracking-[-0.02em]">{project.client}</span>
                      <span className="block truncate text-[0.8125rem] text-aegean-700">{domain(project.liveUrl!)}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/work" className="inline-flex items-center gap-1.5 self-start font-display text-[0.9375rem] font-bold text-aegean-700 hover:underline">
              {t("all")}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
