"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Défilement fluide, à inertie.
 *
 * `scroll-behavior: smooth` en CSS n'agit que sur les sauts d'ancre : la
 * molette, elle, reste saccadée. Lenis interpole la position de défilement
 * image par image, ce qui donne la glisse des sites de studio.
 *
 * Trois précautions :
 *
 * - **Mouvement réduit.** Si le système le demande, on ne monte rien du tout
 *   et le navigateur garde son défilement natif.
 * - **Ancres.** Lenis prend la main sur les liens internes, sinon le saut
 *   natif et l'interpolation se disputent la position.
 * - **Zones exclues.** Tout élément portant `data-lenis-prevent` — le menu
 *   mobile plein écran — conserve un défilement natif.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      // Assez long pour qu'on sente la glisse, assez court pour que la page
      // réponde tout de suite au geste.
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      // Le tactile garde son défilement natif : l'inertie du système est
      // meilleure que la nôtre, et la dupliquer donne une sensation molle.
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Les ancres passent par Lenis, avec la marge du bandeau fixe.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest?.("a");
      const href = link?.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
