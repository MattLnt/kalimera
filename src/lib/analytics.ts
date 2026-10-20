/**
 * Mesure d'audience et conversions.
 *
 * Deux identifiants, deux rôles :
 * - `NEXT_PUBLIC_GA_ID` (G-XXXX) alimente Google Analytics 4 ;
 * - `NEXT_PUBLIC_GOOGLE_ADS_ID` (AW-XXXX) permet à Google Ads d'optimiser
 *   vers les conversions. Sans ce signal, une campagne optimise vers le clic
 *   et achète du trafic qui ne convertit pas.
 *
 * Tout passe par le Consent Mode v2 : les balises se chargent toujours, mais
 * en mode refusé par défaut. Google n'écrit aucun cookie et ne remonte que des
 * pings anonymes jusqu'à l'acceptation.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
export const analyticsEnabled = Boolean(GA_ID || GOOGLE_ADS_ID);

export const CONSENT_STORAGE_KEY = "kalimera.consent";

/** Les conversions que l'on veut pouvoir optimiser en campagne. */
export const conversions = {
  /** Formulaire de contact envoyé — la conversion principale. */
  contactSubmit: "contact_submit",
  /** Clic sur le numéro de téléphone : intention forte en référencement local. */
  phoneClick: "phone_click",
  /** Clic sur l'adresse e-mail. */
  emailClick: "email_click",
  /** Ouverture de la prise de rendez-vous. */
  bookingOpen: "booking_open",
} as const;

export type ConversionName = (typeof conversions)[keyof typeof conversions];

type GtagArgs =
  | ["consent", "default" | "update", Record<string, string>]
  | ["event", string, Record<string, unknown>?]
  | ["config", string, Record<string, unknown>?]
  | ["js", Date];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

/**
 * Envoie un évènement. Sans balise chargée, l'appel est simplement ignoré :
 * les composants peuvent donc appeler `trackEvent` sans condition.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

/**
 * Déclare une conversion à GA4 et, si l'identifiant Ads est configuré, à
 * Google Ads. Le libellé de conversion Ads est propre à chaque compte, d'où le
 * paramètre optionnel `adsLabel` (format `AW-XXXX/abc123`).
 */
export function trackConversion(
  name: ConversionName,
  params: Record<string, unknown> = {},
) {
  trackEvent(name, params);

  const adsLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
  if (adsLabel && typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", { send_to: adsLabel, ...params });
  }
}

/** Met à jour le consentement Google après un choix explicite du visiteur. */
export function updateConsent(granted: boolean) {
  if (typeof window === "undefined" || !window.gtag) return;
  const value = granted ? "granted" : "denied";
  window.gtag("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
}
