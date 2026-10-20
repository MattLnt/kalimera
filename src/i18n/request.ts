import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: "Europe/Paris",
    formats: {
      dateTime: {
        long: { day: "numeric", month: "long", year: "numeric" },
        short: { day: "2-digit", month: "2-digit", year: "numeric" },
      },
    },
  };
});
