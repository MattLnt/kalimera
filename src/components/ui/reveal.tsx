"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const delays = ["", "delay-[55ms]", "delay-[110ms]", "delay-[165ms]", "delay-[220ms]"] as const;

/**
 * Révèle son contenu quand il entre dans le viewport, une seule fois.
 * Les animations sont neutralisées par la media query prefers-reduced-motion
 * définie dans globals.css.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4;
  as?: "div" | "section" | "article" | "li" | "header";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // Marge basse positive : l'élément est considéré visible un peu avant
      // d'entrer réellement dans l'écran. Sans cela, un défilement rapide
      // laisse voir le contenu encore transparent, et le site paraît lent.
      { threshold: 0, rootMargin: "0px 0px 12% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // Le même composant sert pour div, section, article, li ou header :
      // la ref est typée au plus large et réduite ici.
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      data-visible={visible}
      className={cn("reveal", delays[delay], className)}
    >
      {children}
    </Tag>
  );
}
