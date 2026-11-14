import { createElement } from "react";

import type { SelectOption } from "@/components/ui/select";
import { serviceIconNames, serviceIcons } from "@/components/site/service-icons";

/** Les icônes proposées dans l'administration, avec leur aperçu dans la liste. */
export const iconOptions: SelectOption[] = serviceIconNames.map((name) => ({
  value: name,
  label: name,
  icon: createElement(serviceIcons[name], { className: "size-3.5" }),
}));
