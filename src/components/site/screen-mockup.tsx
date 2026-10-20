import Image from "next/image";

import { optimized } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

type Cover = { url: string; width: number; height: number; alt: string } | null;

/**
 * Fenêtre de navigateur stylisée. Si le projet a une image de couverture,
 * elle s'affiche dans la fenêtre ; sinon un squelette de page est dessiné,
 * ce qui évite une carte vide tant que les visuels ne sont pas livrés.
 */
export function BrowserMockup({
  url,
  cover,
  className,
}: {
  url: string;
  cover?: Cover;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-6 flex min-h-0 flex-1 translate-y-[12%] flex-col overflow-hidden rounded-t-xl bg-white",
        "shadow-[0_-2px_10px_rgba(4,21,43,0.12),0_-24px_60px_-20px_rgba(4,21,43,0.5)]",
        "transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-[5%]",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-black/5 bg-[#F4F6F9] px-3 py-2.5">
        <span className="size-2 shrink-0 rounded-full bg-[#D7DDE6]" />
        <span className="size-2 shrink-0 rounded-full bg-[#D7DDE6]" />
        <span className="size-2 shrink-0 rounded-full bg-[#D7DDE6]" />
        <span className="ml-2 flex h-[18px] flex-1 items-center truncate rounded-full bg-white px-2.5 text-[0.625rem] text-[var(--ink-45)] shadow-[inset_0_0_0_1px_rgba(8,9,11,0.07)]">
          {url}
        </span>
      </div>

      {cover ? (
        <div className="relative aspect-16/10 w-full">
          <Image
            src={optimized(cover.url, { width: 900 })}
            alt={cover.alt}
            fill
            sizes="(max-width: 880px) 100vw, 50vw"
            className="object-cover object-top"
          />
        </div>
      ) : (
        <PageSkeleton />
      )}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div aria-hidden className="grid gap-2 p-4">
      <div className="flex items-center gap-1.5">
        <span className="block h-[9px] w-[34px] rounded-sm bg-aegean-800" />
        <span className="block h-1.5 w-5 rounded-sm bg-black/8" />
        <span className="block h-1.5 w-5 rounded-sm bg-black/8" />
        <span className="block h-1.5 w-5 rounded-sm bg-black/8" />
        <span className="ml-auto block h-3.5 w-[42px] rounded-full bg-aegean-600" />
      </div>
      <div className="relative h-[clamp(44px,7vw,78px)] overflow-hidden rounded-[10px] bg-linear-[120deg,var(--color-aegean-600),var(--color-aegean-900)]">
        <span className="absolute top-[32%] left-[10%] h-2.5 w-[46%] rounded-sm bg-white/75 shadow-[0_18px_0_rgba(255,255,255,0.35),0_34px_0_rgba(255,255,255,0.2)]" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <span className="h-[clamp(22px,3.4vw,38px)] rounded-lg bg-aegean-50 shadow-[inset_0_0_0_1px_rgba(8,9,11,0.05)]" />
        <span className="h-[clamp(22px,3.4vw,38px)] rounded-lg bg-aegean-50 shadow-[inset_0_0_0_1px_rgba(8,9,11,0.05)]" />
        <span className="h-[clamp(22px,3.4vw,38px)] rounded-lg bg-aegean-50 shadow-[inset_0_0_0_1px_rgba(8,9,11,0.05)]" />
      </div>
      <span className="h-[7px] rounded-sm bg-black/8" />
      <span className="h-[7px] w-3/5 rounded-sm bg-black/8" />
    </div>
  );
}

/** Variante téléphone, pour les projets d'application mobile. */
export function PhoneMockup({
  cover,
  className,
}: {
  cover?: Cover;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto mt-6 flex min-h-0 w-[min(56%,230px)] flex-1 translate-y-[12%] flex-col rounded-t-[26px] bg-[#0B0D10] px-2 pt-2",
        "shadow-[0_-2px_10px_rgba(4,21,43,0.2),0_-26px_60px_-18px_rgba(4,21,43,0.55)]",
        "transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-[5%]",
        className,
      )}
    >
      <span className="mx-auto mb-2 block h-[5px] w-[34%] rounded-full bg-white/30" />
      <div className="h-full overflow-hidden rounded-t-[20px] bg-white">
        {cover ? (
          <div className="relative aspect-9/16 w-full">
            <Image
              src={optimized(cover.url, { width: 480 })}
              alt={cover.alt}
              fill
              sizes="230px"
              className="object-cover object-top"
            />
          </div>
        ) : (
          <AppSkeleton />
        )}
      </div>
    </div>
  );
}

function AppSkeleton() {
  return (
    <div aria-hidden className="grid gap-[0.45rem] p-4">
      <div className="flex items-center gap-1.5">
        <span className="block size-[22px] rounded-full bg-linear-[140deg,var(--color-aegean-400),var(--color-aegean-700)]" />
        <span className="block h-[7px] w-[46px] rounded-sm bg-black/8" />
      </div>
      <span className="block h-10 rounded-[10px] bg-linear-[120deg,var(--color-aegean-600),var(--color-aegean-900)]" />
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-1.5">
          <span className="block size-[18px] shrink-0 rounded-md bg-aegean-50" />
          <span className="block h-1.5 flex-1 rounded-sm bg-black/8" />
        </div>
      ))}
      <div className="mt-0.5 flex gap-1.5">
        <span className="h-[5px] flex-1 rounded-full bg-aegean-600" />
        <span className="h-[5px] flex-1 rounded-full bg-black/8" />
        <span className="h-[5px] flex-1 rounded-full bg-black/8" />
        <span className="h-[5px] flex-1 rounded-full bg-black/8" />
      </div>
    </div>
  );
}
