import { Arches, Orbs } from "@/components/ui/decor";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";

/**
 * En-tête des pages intérieures : même panneau bleu nuit arrondi que le hero
 * d'accueil, en plus bas, pour que la nav flottante reste lisible dessus.
 *
 * La colonne de texte est volontairement étroite — une ligne de plus de
 * soixante caractères se lit mal. Les pages qui ont de quoi remplir la place
 * restante passent un `aside` ; sans lui, la colonne de texte s'élargit
 * plutôt que de laisser la moitié droite vide.
 */
/**
 * Taille du titre selon sa longueur.
 *
 * « Studio » et « Développement de plateformes B2B en Suisse romande » ne
 * peuvent pas partager la même échelle : au corps maximal, le second se casse
 * sur cinq lignes et le bloc devient illisible. Le titre descend donc d'un
 * cran, et sa colonne s'élargit, à mesure qu'il s'allonge.
 */
function titleScale(title: React.ReactNode) {
  const length = typeof title === "string" ? title.length : 40;
  if (length <= 26) {
    return {
      size: "text-[clamp(2.4rem,5.4vw,4.2rem)]",
      width: "max-w-[16ch]",
    };
  }
  if (length <= 44) {
    return {
      size: "text-[clamp(2.1rem,4.2vw,3.4rem)]",
      width: "max-w-[20ch]",
    };
  }
  return {
    size: "text-[clamp(1.85rem,3.2vw,2.75rem)]",
    width: "max-w-[26ch]",
  };
}

export function PageHero({
  chip,
  title,
  lead,
  aside,
  children,
}: {
  chip?: string;
  title: React.ReactNode;
  lead?: string;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const scale = titleScale(title);

  return (
    <header className="night-panel relative mx-(--page-gutter) overflow-hidden rounded-panel px-6 pt-[clamp(8rem,15vh,11rem)] pb-[clamp(2.5rem,6vh,4rem)] sm:px-10 lg:px-16">
      <Orbs />
      <Arches className="h-[50%] opacity-40" />
      <span aria-hidden className="grain-layer" />

      <div
        className={cn(
          "relative z-2",
          aside
            ? "grid items-end gap-10 lg:grid-cols-[1.25fr_minmax(0,20rem)] lg:gap-14"
            : "max-w-[50ch]",
        )}
      >
        <div>
          {chip ? <Chip tone="dark">{chip}</Chip> : null}
          <h1
            className={cn(
              "mt-4 font-display font-extrabold tracking-[-0.04em] text-balance text-white",
              "leading-[1.02]",
              scale.size,
              scale.width,
            )}
          >
            {title}
          </h1>
          {lead ? <p className="text-lead text-lead-light mt-5">{lead}</p> : null}
          {children}
        </div>

        {aside}
      </div>
    </header>
  );
}

export type HeroStat = { value: string; label: string };

/**
 * Chiffres en vitrine du hero, sur deux colonnes.
 *
 * Ils occupent la moitié droite du panneau, qui restait vide, et donnent au
 * visiteur la mesure de la page avant qu'il n'ait lu une ligne. Les valeurs
 * sont dérivées du contenu réel : une page sans réalisation affichera donc
 * un zéro, ce qui est le signal qu'il manque la preuve.
 */
export function HeroStats({ stats }: { stats: HeroStat[] }) {
  if (stats.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card bg-white/12 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col bg-aegean-950/55 px-5 py-5 backdrop-blur-sm"
        >
          <dd className="font-display text-[clamp(1.6rem,2.4vw,2.1rem)] leading-none font-extrabold tracking-[-0.045em] text-white">
            {stat.value}
          </dd>
          <dt className="mt-2 text-[0.75rem] leading-[1.3] text-white/55">
            {stat.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
