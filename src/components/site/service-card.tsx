import { createElement } from "react";

import { serviceIcons, isServiceIconName } from "@/components/site/service-icons";
import { TechIcon } from "@/components/site/tech-icons";
import { Tag } from "@/components/ui/chip";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type ServiceCardData = {
  slug: string;
  title: string;
  summary: string;
  icon: string;
  stack: string[];
};

export function ServiceCard({
  service,
  index,
  className,
}: {
  service: ServiceCardData;
  index: number;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative isolate flex min-h-[19rem] flex-col overflow-hidden rounded-card bg-white p-6 shadow-lift sm:p-8",
        "transition-transform duration-[550ms] ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:text-white",
        className,
      )}
    >
      {/* Le bleu descend du haut de la carte au survol. `scaleY` et non
          une hauteur : animer une hauteur refait la mise en page à chaque
          image, une mise à l'échelle ne coûte qu'un calque. */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 origin-top scale-y-0 bg-linear-[150deg,var(--color-aegean-600),var(--color-aegean-900)] transition-transform duration-[600ms] ease-[var(--ease-out-expo)] group-hover:scale-y-100"
      />

      <span className="absolute top-6 right-6 font-display text-[0.8125rem] font-extrabold text-[var(--ink-45)] transition-colors duration-500 group-hover:text-white/55 sm:top-8 sm:right-8">
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="grid size-12 place-items-center rounded-field bg-aegean-100 text-aegean-700 transition-colors duration-500 group-hover:bg-white/16 group-hover:text-white">
        {/* createElement plutôt qu'une variable en majuscule : le composant
            est choisi par nom, il n'est pas créé pendant le rendu. */}
        {createElement(
          isServiceIconName(service.icon) ? serviceIcons[service.icon] : serviceIcons.Layers,
          { className: "size-5.5" },
        )}
      </span>

      <h3 className="display-3 mt-6 mb-2.5">
        <Link
          href={{ pathname: "/services/[slug]", params: { slug: service.slug } }}
          className="before:absolute before:inset-0 before:content-['']"
        >
          {service.title}
        </Link>
      </h3>

      <p className="text-[0.9375rem] text-[var(--ink-65)] transition-colors duration-500 group-hover:text-white/76">
        {service.summary}
      </p>

      <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
        {service.stack.map((item) => (
          <Tag
            key={item}
            className="inline-flex items-center gap-1.5 group-hover:bg-white/14 group-hover:text-white"
          >
            {/* Pas d'icône pour « Back-office » ou « Multilingue » : le
                composant ne rend rien plutôt qu'un symbole générique. */}
            <TechIcon name={item} className="size-3.5" />
            {item}
          </Tag>
        ))}
      </div>
    </article>
  );
}
