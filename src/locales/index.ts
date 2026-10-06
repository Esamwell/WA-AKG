import { en, Translations } from "./en";
import { pt } from "./pt";

export type Language = "pt-BR" | "en-US";

export const translations: Record<Language, Translations> = {
  "pt-BR": pt,
  "en-US": en,
};

export { en, pt };
export type { Translations };
