import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/ui/reveal";

/**
 * En-tête de section : pastille, titre sur deux lignes dont la seconde en
 * dégradé, et à droite soit un texte d'accroche, soit un bouton.
 */
export function SectionHead({
  chip,
  titleTop,
  titleBottom,
  lead,
  action,
}: {
  chip: string;
  titleTop: string;
  titleBottom?: string;
  lead?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-[clamp(2.2rem,5vh,3.5rem)] grid items-end gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
      <Reveal>
        <Chip>{chip}</Chip>
        <h2 className="display-2 mt-4">
          {titleTop}
          {titleBottom ? (
            <>
              <br />
              <span className="gradient-dark">{titleBottom}</span>
            </>
          ) : null}
        </h2>
      </Reveal>

      {lead ? (
        <Reveal delay={1}>
          <p className="text-lead">{lead}</p>
        </Reveal>
      ) : null}

      {action ? (
        <Reveal delay={1} className="flex items-end lg:justify-end">
          {action}
        </Reveal>
      ) : null}
    </div>
  );
}
