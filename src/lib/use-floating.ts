"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

/**
 * Position fixe d'un menu ouvert sous un bouton, centrée sur lui et gardée
 * dans l'écran (ouverture vers le haut s'il manque de place). En position
 * fixe, le menu n'est plus rogné par un tableau qui défile ou un cadre
 * arrondi. Il se ferme au défilement, puisqu'il ne suit pas son bouton.
 *
 * `place()` se lance au clic qui ouvre le menu.
 */
export function useFloating(
  anchor: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
  size: { width: number; height: number },
) {
  const [style, setStyle] = useState<React.CSSProperties>({ position: "fixed" });

  const place = useCallback(() => {
    if (!anchor.current) return;
    const rect = anchor.current.getBoundingClientRect();
    const margin = 8;
    const left = Math.min(Math.max(margin, rect.left + rect.width / 2 - size.width / 2), window.innerWidth - size.width - margin);
    const below = rect.bottom + 6;
    const top = below + size.height > window.innerHeight - margin ? Math.max(margin, rect.top - 6 - size.height) : below;
    setStyle({ position: "fixed", top, left, width: size.width });
  }, [anchor, size.width, size.height]);

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      // Le défilement interne du menu lui-même ne le ferme pas.
      if (event.target instanceof Element && event.target.closest("[data-floating]")) return;
      onClose();
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", onClose);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", onClose);
    };
  }, [open, onClose]);

  return { style, place };
}
