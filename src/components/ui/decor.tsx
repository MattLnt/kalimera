import { cn } from "@/lib/utils";

/** Rangée d'arches : la colonne grecque, en version arrondie et discrète. */
export function Arches({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("arches", className)}>
      {Array.from({ length: count }, (_, index) => (
        <i key={index} />
      ))}
    </div>
  );
}

/** Halos flous qui donnent sa profondeur aux panneaux bleu nuit. */
export function Orbs() {
  return (
    <>
      <div
        aria-hidden
        className="orb top-[-12vw] right-[-8vw] size-[44vw] bg-[radial-gradient(circle,rgba(98,169,242,0.5),transparent_68%)]"
      />
      <div
        aria-hidden
        className="orb bottom-[-14vw] left-[-10vw] size-[36vw] bg-[radial-gradient(circle,rgba(42,134,232,0.42),transparent_68%)]"
      />
    </>
  );
}

/** Dégradés de secours des cartes projet quand aucune image n'est fournie. */
export const projectAccents: Record<string, string> = {
  g1: "bg-[radial-gradient(85%_85%_at_20%_8%,#62A9F2,#07213F_74%)]",
  g2: "bg-[radial-gradient(85%_85%_at_80%_12%,#2A86E8,#04152B_76%)]",
  g3: "bg-[radial-gradient(90%_90%_at_50%_0%,#BBDBFB,#0F4486_72%)]",
  g4: "bg-[radial-gradient(100%_85%_at_8%_10%,#1562B8,#04152B_78%)]",
};

export function accentClass(accent: string) {
  return projectAccents[accent] ?? projectAccents.g1;
}
