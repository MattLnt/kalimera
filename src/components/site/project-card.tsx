import type { ProjectKind } from "@/generated/prisma/enums";
import { Link } from "@/i18n/navigation";
import { accentClass } from "@/components/ui/decor";
import { TechIcon } from "@/components/site/tech-icons";
import { Tag } from "@/components/ui/chip";
import { BrowserMockup, PhoneMockup } from "@/components/site/screen-mockup";
import { cn } from "@/lib/utils";

export type ProjectCardData = {
  slug: string;
  title: string;
  category: string;
  kind: ProjectKind;
  accent: string;
  stack: string[];
  liveUrl: string | null;
  cover: { url: string; width: number; height: number; alt: string } | null;
  metrics: { value: string; label: string }[];
};

export function ProjectCard({
  project,
  size = "wide",
  className,
}: {
  project: ProjectCardData;
  size?: "wide" | "narrow";
  className?: string;
}) {
  const isMobile = project.kind === "MOBILE";
  const displayUrl =
    project.liveUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "") ??
    `${project.slug}.com`;

  return (
    <article
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-card px-6 pt-6 text-white shadow-lift sm:px-8 sm:pt-8",
        "transition-transform duration-[320ms] ease-[var(--ease-hover)] hover:-translate-y-1.5",
        size === "wide" ? "min-h-[26rem]" : "min-h-[24rem]",
        accentClass(project.accent),
        className,
      )}
    >
      <span aria-hidden className="grain-layer -z-10" />

      {project.metrics[0] ? (
        <div className="absolute top-6 right-6 z-10 flex translate-y-[-6px] items-center gap-2 rounded-full bg-white/14 py-1.5 pr-3 pl-2 opacity-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)] transition-[opacity,translate] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 sm:top-8 sm:right-8">
          <span className="grid size-[30px] place-items-center rounded-full bg-[#1FBF6B] font-display text-[0.6875rem] font-extrabold text-[#04281A]">
            {project.metrics[0].value}
          </span>
          <span className="font-display text-[0.6875rem] font-semibold text-white/85">
            {project.metrics[0].label}
          </span>
        </div>
      ) : null}

      <div className="relative z-10">
        {/* Sans `backdrop-blur` : la pastille vit dans une carte qui monte de
            6 px au survol, et déplacer un élément flouté change ce qu'il y a
            derrière lui — le flou serait refait à chaque image. Sur un
            dégradé lisse, il ne se voyait de toute façon pas. */}
        <span className="inline-block rounded-full bg-white/16 px-3 py-1.5 font-display text-xs font-semibold">
          {project.category}
        </span>
        <h3 className="display-3 mt-3 mb-3 text-white">
          <Link
            href={{ pathname: "/work/[slug]", params: { slug: project.slug } }}
            className="before:absolute before:inset-0 before:z-20 before:content-['']"
          >
            {project.title}
          </Link>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 3).map((item) => (
            <Tag
              key={item}
              tone="dark"
              className="inline-flex items-center gap-1.5 text-[0.6875rem]"
            >
              <TechIcon name={item} tone="dark" className="size-3.5" />
              {item}
            </Tag>
          ))}
        </div>
      </div>

      {isMobile ? (
        <PhoneMockup cover={project.cover} />
      ) : (
        <BrowserMockup url={displayUrl} cover={project.cover} />
      )}
    </article>
  );
}
