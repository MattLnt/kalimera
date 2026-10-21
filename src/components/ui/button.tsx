import { Children, cloneElement, isValidElement } from "react";

import { cn } from "@/lib/utils";

type Variant = "dark" | "blue" | "white" | "soft" | "line";

/**
 * Le bouton ne se déplace plus au survol : tout le mouvement est porté par la
 * pastille de la flèche. Un déplacement de quelques pixels se lisait mal, et
 * dans l'en-tête il se faisait au-dessus de la barre floutée, où il accrochait.
 *
 * Les ombres sont portées au repos et ne bougent plus au survol : une ombre
 * portée se repeint à chaque image, et ce repaint entraînait tout le contenu
 * du bouton avec elle — la flèche paraissait accrocher alors que sa rotation
 * ne coûte rien. Même règle que les cartes.
 *
 * `soft` perd son `backdrop-blur` : il se posait sur un dégradé lisse, où il
 * ne se voyait pas, et changer le fond d'un élément flouté oblige à refaire
 * le flou à chaque image du survol.
 */
const variants: Record<Variant, string> = {
  dark: "bg-ink text-white shadow-lift",
  blue: "bg-aegean-600 text-white shadow-lift hover:bg-aegean-700",
  white: "bg-white text-ink shadow-lift",
  soft: "bg-white/12 text-white hover:bg-white/20",
  line: "bg-transparent text-ink shadow-[inset_0_0_0_1px_var(--ink-10)] hover:bg-white",
};

const circleVariants: Record<Variant, string> = {
  dark: "bg-white/16 group-hover:bg-aegean-500",
  blue: "bg-white/18 group-hover:bg-white group-hover:text-aegean-700",
  white: "bg-aegean-100 text-aegean-700 group-hover:bg-aegean-600 group-hover:text-white",
  soft: "bg-white/16 group-hover:bg-white group-hover:text-aegean-800",
  line: "bg-aegean-100 text-aegean-700 group-hover:bg-aegean-600 group-hover:text-white",
};

export type ButtonProps = {
  variant?: Variant;
  size?: "md" | "sm";
  /** Affiche la pastille ronde avec la flèche, signature des boutons du site. */
  withArrow?: boolean;
  /**
   * Rend l'unique enfant à la place du <button> en lui appliquant le style :
   * permet d'obtenir un lien qui a l'apparence d'un bouton.
   */
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "dark",
  size = "md",
  withArrow = true,
  asChild = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "group inline-flex cursor-pointer items-center gap-2.5 rounded-full border-0 font-display font-bold tracking-[-0.01em]",
    "transition-[background-color] duration-[260ms] ease-[var(--ease-hover)]",
    size === "md"
      ? "py-2.5 pr-2.5 pl-6 text-[0.9375rem]"
      : "py-[0.45rem] pr-2 pl-[1.1rem] text-sm",
    variants[variant],
    className,
  );

  const arrow = withArrow ? (
    <span
      key="arrow"
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-[260ms] ease-[var(--ease-hover)] group-hover:rotate-45",
        size === "md" ? "size-8" : "size-7",
        circleVariants[variant],
      )}
    >
      <svg viewBox="0 0 14 14" fill="none" className="size-3.5">
        <path
          d="M3 11 11 3M5 3h6v6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  ) : null;

  if (asChild) {
    const child = Children.only(children);
    if (!isValidElement<{ className?: string; children?: React.ReactNode }>(child)) {
      return null;
    }

    // Le libellé de l'enfant est réinséré dans un <span>, et la flèche ajoutée
    // à côté : l'élément rendu reste l'enfant (un lien, par exemple).
    return cloneElement(
      child,
      { className: cn(classes, child.props.className) },
      <span key="label">{child.props.children}</span>,
      arrow,
    );
  }

  return (
    <button className={classes} {...props}>
      <span>{children}</span>
      {arrow}
    </button>
  );
}
