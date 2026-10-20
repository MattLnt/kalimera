/** Un contenu dans les trois langues du site. */
export type Tr = { fr: string; en: string; es: string };

export const t = (fr: string, en: string, es: string): Tr => ({ fr, en, es });
