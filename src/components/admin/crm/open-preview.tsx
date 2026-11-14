"use client";

import { ExternalLink } from "lucide-react";

/**
 * Ouvre le brouillon en cours dans un onglet, avant même l'enregistrement :
 * le HTML de l'aperçu est servi depuis une adresse locale au navigateur.
 */
export function OpenDraftPreview({ html }: { html: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
        window.open(url, "_blank", "noopener");
        // L'onglet a chargé le document ; l'adresse peut être libérée ensuite.
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      }}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-xs font-bold text-aegean-700 hover:bg-aegean-50"
    >
      <ExternalLink className="size-3.5" />
      Ouvrir dans un onglet
    </button>
  );
}
