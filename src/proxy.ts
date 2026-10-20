import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  /**
   * Le middleware ne s'applique qu'au site public : l'administration vit hors
   * du système de langues et protège ses propres routes dans son layout.
   */
  matcher: [
    "/((?!api|admin|_next|_vercel|monitoring|.*\\..*).*)",
  ],
};
