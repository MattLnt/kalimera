"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { CONSENT_STORAGE_KEY, analyticsEnabled, updateConsent } from "@/lib/analytics";

/** Aucune source externe à écouter : le choix ne change que par un clic ici. */
const noSubscribe = () => () => {};

/**
 * `localStorage` est un état extérieur à React. Le lire via
 * `useSyncExternalStore` plutôt que dans un effet évite à la fois le rendu en
 * cascade et la différence entre le HTML serveur et le premier rendu client.
 */
const hasNoChoiceYet = () => {
  try {
    return !localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    // Navigation privée ou stockage bloqué : on n'insiste pas.
    return false;
  }
};

/** Côté serveur, on ne sait rien : on ne rend pas le bandeau. */
const notOnServer = () => false;

/**
 * Bandeau de consentement minimal.
 *
 * Il ne s'affiche que si une balise de mesure est configurée, et seulement
 * tant qu'aucun choix n'a été enregistré. Le choix est conservé en local :
 * aucun cookie n'est posé par le bandeau lui-même.
 */
export function ConsentBanner() {
  const t = useTranslations("consent");
  const pending = useSyncExternalStore(noSubscribe, hasNoChoiceYet, notOnServer);
  const [decided, setDecided] = useState(false);

  if (!analyticsEnabled || !pending || decided) return null;

  const decide = (granted: boolean) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, granted ? "granted" : "denied");
    } catch {
      // Le choix ne sera pas mémorisé, mais il est appliqué pour cette visite.
    }
    updateConsent(granted);
    setDecided(true);
  };

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="fixed inset-x-4 bottom-4 z-200 mx-auto max-w-2xl rounded-[22px] bg-ink p-5 text-white shadow-lift sm:p-6"
    >
      <p className="font-display text-[0.9375rem] font-bold tracking-[-0.02em]">
        {t("title")}
      </p>
      <p className="mt-2 text-sm leading-[1.55] text-white/70">
        {t("body")}{" "}
        <Link href="/privacy" className="underline hover:text-white">
          {t("privacyLink")}
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => decide(true)}
          className="rounded-full bg-white px-5 py-2.5 font-display text-sm font-bold text-ink transition-opacity hover:opacity-85"
        >
          {t("accept")}
        </button>
        <button
          type="button"
          onClick={() => decide(false)}
          className="rounded-full px-5 py-2.5 font-display text-sm font-bold text-white/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] transition-colors hover:text-white"
        >
          {t("refuse")}
        </button>
      </div>
    </div>
  );
}
