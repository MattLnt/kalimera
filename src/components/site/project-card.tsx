import type { ProjectKind } from "@/generated/prisma/enums";
import { Link } from "@/i18n/navigation";
import { accentClass } from "@/components/ui/decor";
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
        "group relative isolate flex flex-col overflow-hidden rounded-card px-6 pt-6 text-white shadow-soft sm:px-8 sm:pt-8",
        "transition-[transform,box-shadow] duration-[600ms] ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:shadow-float",
        size === "wide" ? "min-h-[26rem]" : "min-h-[24rem]",
        accentClass(project.accent),
        className,
      )}
    >
      <span aria-hidden className="grain-layer -z-10" />

      {project.metrics[0] ? (
        <div className="absolute top-6 right-6 z-10 flex translate-y-[-6px] items-center gap-2 rounded-full bg-white/14 py-1.5 pr-3 pl-2 opacity-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)] backdrop-blur-md transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 sm:top-8 sm:right-8">
          <span className="grid size-[30px] place-items-center rounded-full bg-[#1FBF6B] font-display text-[0.6875rem] font-extrabold text-[#04281A]">
            {project.metrics[0].value}
          </span>
          <span className="font-display text-[0.6875rem] font-semibold text-white/85">
            {project.metrics[0].label}
          </span>
        </div>
      ) : null}

      <div className="relative z-10">
        <span className="inline-block rounded-full bg-white/16 px-3 py-1.5 font-display text-xs font-semibold backdrop-blur-md">
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
            <Tag key={item} tone="dark" className="text-[0.6875rem]">
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
