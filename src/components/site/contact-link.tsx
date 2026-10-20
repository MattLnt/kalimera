"use client";

import { conversions, trackConversion } from "@/lib/analytics";

/**
 * Lien de contact instrumenté : `tel:` et `mailto:` quittent la page sans
 * déclencher de navigation mesurable, donc un clic téléphone n'apparaît dans
 * aucune statistique si on ne l'envoie pas explicitement.
 *
 * Ce sont des signaux d'intention forts — surtout en référencement local, où
 * beaucoup de visiteurs appellent au lieu de remplir le formulaire. Sans eux,
 * une campagne locale paraît ne rien convertir.
 */
export function ContactLink({
  kind,
  href,
  className,
  children,
}: {
  kind: "phone" | "email";
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() =>
        trackConversion(
          kind === "phone" ? conversions.phoneClick : conversions.emailClick,
        )
      }
    >
      {children}
    </a>
  );
}
