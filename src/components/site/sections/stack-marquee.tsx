import { siteConfig } from "@/lib/site";

/** Bandeau défilant des technologies. Décoratif : masqué aux lecteurs d'écran. */
export function StackMarquee() {
  const items = [...siteConfig.stack, ...siteConfig.stack];

  return (
    <div aria-hidden className="overflow-hidden pt-[clamp(2rem,4vh,3rem)] pb-[clamp(1rem,2vh,1.5rem)]">
      <div className="relative">
        <div className="marquee-track">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full bg-white px-5.5 py-2.5 font-display text-base font-bold tracking-[-0.02em] whitespace-nowrap text-[var(--ink-65)] shadow-soft"
            >
              {item}
            </span>
          ))}
        </div>
        {/* Dégradés latéraux : les pastilles disparaissent au lieu d'être coupées net. */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--color-canvas),transparent_10%,transparent_90%,var(--color-canvas))]" />
      </div>
    </div>
  );
}
