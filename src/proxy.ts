import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  /**
   * Le middleware ne s'applique qu'au site public : l'administration vit hors
   * du système de langues et protège ses propres routes dans son layout.
   */
  matcher: [
    // « documents » : devis et factures envoyés aux clients, hors du système de langues.
    // « icon », « apple-icon » : icônes générées, servies à la racine (sinon
    // redirigées vers /fr/icon, qui n'existe pas, et l'onglet reste sans icône).
    "/((?!api|admin|documents|_next|_vercel|monitoring|icon|apple-icon|.*\\..*).*)",
  ],
};
