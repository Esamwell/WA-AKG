"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, Language, Translations } from "@/locales";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "wa_akg_lang";

export function LanguageProvider({
  children,
  initialLanguage = "pt-BR",
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved === "pt-BR" || saved === "en-US") return saved;
    }
    return initialLanguage;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved === "pt-BR" || saved === "en-US") {
        setLanguageState(saved);
      } else if (initialLanguage) {
        setLanguageState(initialLanguage);
      }
    }
  }, [initialLanguage]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
        document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=31536000;SameSite=Lax`;
      } catch (e) {
        console.error("Failed to save language preference", e);
      }
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = translations[language] || translations["pt-BR"];
      const parts = key.split(".");
      let current: any = dict;

      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = current[part];
        } else {
          // Fallback to English
          let fallback: any = translations["en-US"];
          for (const fbPart of parts) {
            if (fallback && typeof fallback === "object" && fbPart in fallback) {
              fallback = fallback[fbPart];
            } else {
              fallback = key;
              break;
            }
          }
          current = fallback;
          break;
        }
      }

      if (typeof current !== "string") {
        return key;
      }

      let result = current;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          result = result.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }

      return result;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations: translations[language] || translations["pt-BR"],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  return useLanguage();
}
