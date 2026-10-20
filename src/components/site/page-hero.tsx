import { Arches, Orbs } from "@/components/ui/decor";
import { Chip } from "@/components/ui/chip";

/**
 * En-tête des pages intérieures : même panneau bleu nuit arrondi que le hero
 * d'accueil, en plus bas, pour que la nav flottante reste lisible dessus.
 */
export function PageHero({
  chip,
  title,
  lead,
  children,
}: {
  chip?: string;
  title: React.ReactNode;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="night-panel relative mx-(--page-gutter) overflow-hidden rounded-panel px-6 pt-[clamp(8rem,15vh,11rem)] pb-[clamp(2.5rem,6vh,4rem)] sm:px-10 lg:px-16">
      <Orbs />
      <Arches className="h-[50%] opacity-40" />
      <span aria-hidden className="grain-layer" />

      <div className="relative z-2 max-w-[42ch]">
        {chip ? <Chip tone="dark">{chip}</Chip> : null}
        <h1 className="display-2 mt-4 text-white">{title}</h1>
        {lead ? <p className="text-lead text-lead-light mt-5">{lead}</p> : null}
        {children}
      </div>
    </header>
  );
}
