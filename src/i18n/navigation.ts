import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Ces helpers remplacent next/link et next/navigation côté site public :
 * ils traduisent automatiquement les chemins internes vers l'URL de la langue
 * courante (`/work` devient `/fr/projets`, `/es/proyectos`, …).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
