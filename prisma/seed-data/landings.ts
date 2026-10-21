import { LandingKind } from "../../src/generated/prisma/enums";

import { locations } from "./landings-locations";
import { sectors } from "./landings-sectors";

/**
 * Les deux familles réunies, chacune portant son `kind`.
 *
 * L'ordre du tableau devient la position affichée. Les secteurs passent avant
 * les villes : une page sectorielle vise une intention d'achat qualifiée,
 * là où une page géographique capte surtout de la proximité.
 */
export const landings = [
  ...sectors.map((entry) => ({ ...entry, kind: LandingKind.SECTOR })),
  ...locations.map((entry) => ({ ...entry, kind: LandingKind.LOCATION })),
];
