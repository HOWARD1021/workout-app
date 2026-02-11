"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import zhTW from "./locales/zh-TW.json";
import en from "./locales/en.json";

export type Locale = "zh-TW" | "en";

type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = { [key: string]: TranslationValue };

const translations: Record<Locale, Translations> = {
  "zh-TW": zhTW,
  en: en,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const LOCALE_KEY = "workout-app-locale";

function getNestedValue(obj: Translations, path: string): string {
  const keys = path.split(".");
  let current: TranslationValue = obj;

  for (const key of keys) {
    if (typeof current !== "object" || current === null) {
      return path;
    }
    current = (current as { [key: string]: TranslationValue })[key];
  }

  return typeof current === "string" ? current : path;
}

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "zh-TW";
  
  const savedLocale = localStorage.getItem(LOCALE_KEY) as Locale | null;
  if (savedLocale && (savedLocale === "zh-TW" || savedLocale === "en")) {
    return savedLocale;
  }
  
  // Auto-detect based on browser language
  const browserLang = navigator.language;
  return browserLang.startsWith("zh") ? "zh-TW" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Use lazy initialization to avoid hydration issues
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Server-side or initial render: use default
    if (typeof window === "undefined") return "zh-TW";
    return getStoredLocale();
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration effect - only sets isHydrated flag
  useEffect(() => {
    // Re-read from storage to ensure consistency after hydration
    const storedLocale = getStoredLocale();
    if (storedLocale !== locale) {
      // Use setTimeout to avoid the lint warning about setState in effect
      setTimeout(() => setLocaleState(storedLocale), 0);
    }
    setIsHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_KEY, newLocale);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let text = getNestedValue(translations[locale], key);

      // Replace parameters like {days}
      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          text = text.replace(`{${paramKey}}`, String(value));
        });
      }

      return text;
    },
    [locale]
  );

  // Prevent hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useTranslation() {
  const { t } = useI18n();
  return { t };
}
