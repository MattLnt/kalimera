import Script from "next/script";

import { GA_ID, GOOGLE_ADS_ID, analyticsEnabled } from "@/lib/analytics";

/**
 * Déclare le consentement par défaut, avant tout chargement de balise.
 *
 * Volontairement une balise `<script>` natale et non `next/script` : le bloc
 * doit s'exécuter avant gtag.js, sinon Google pose ses cookies avant d'avoir
 * lu le refus. Une balise inline s'exécute à l'analyse du document, donc
 * toujours avant un script chargé en `afterInteractive`.
 */
const consentDefault = `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(localStorage.getItem('kalimera.consent')==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}}catch(e){}`;

/** Charge gtag.js une seule fois pour GA4 et Google Ads. */
export function Analytics() {
  if (!analyticsEnabled) return null;

  const primaryId = GA_ID ?? GOOGLE_ADS_ID;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: consentDefault }} />

      {/* La balise elle-même n'a aucune raison de bloquer le rendu. */}
      <Script
        id="gtag-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
      />

      <Script id="gtag-config" strategy="afterInteractive">
        {`gtag('js', new Date());
${GA_ID ? `gtag('config','${GA_ID}');` : ""}
${GOOGLE_ADS_ID ? `gtag('config','${GOOGLE_ADS_ID}');` : ""}`}
      </Script>
    </>
  );
}
