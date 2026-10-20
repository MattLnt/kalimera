import {
  Blocks,
  Code2,
  Database,
  Gauge,
  Globe,
  Layers,
  LayoutDashboard,
  type LucideIcon,
  Palette,
  PenTool,
  Search,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";

/**
 * Liste blanche des icônes proposées dans l'administration.
 *
 * Une table explicite plutôt qu'un `import *` : seules ces icônes finissent
 * dans le bundle, au lieu de l'intégralité de lucide-react.
 */
export const serviceIcons = {
  Blocks,
  Code2,
  Database,
  Gauge,
  Globe,
  Layers,
  LayoutDashboard,
  Palette,
  PenTool,
  Search,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Workflow,
  Zap,
} satisfies Record<string, LucideIcon>;

export type ServiceIconName = keyof typeof serviceIcons;

export const serviceIconNames = Object.keys(serviceIcons) as ServiceIconName[];

export function isServiceIconName(name: string): name is ServiceIconName {
  return name in serviceIcons;
}
