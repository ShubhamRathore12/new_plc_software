"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

/**
 * Only locales with a complete catalogue are listed. French has no catalogue
 * file at all, so it is not offered — a selector entry that renders raw keys is
 * worse than no entry (F-09).
 */
export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "th", label: "ไทย" },
] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number]["code"];

const FALLBACK_LANGUAGE: Language = "en";

function isSupported(value: unknown): value is Language {
  return SUPPORTED_LANGUAGES.some((l) => l.code === value);
}

/**
 * Last-resort rendering for a key with no translation anywhere: show a
 * readable phrase, never the raw key. `select_a_location` → "Select a location",
 * `Standort_auswählen` → "Standort auswählen".
 */
export function humanizeKey(key: string): string {
  const words = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .trim();
  if (!words) return key;
  const lower = words.toLowerCase() === words ? words : words;
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  /** Keys that fell through to English or to humanization — surfaced in dev so
   *  gaps are visible before they reach an operator. */
  missingKeys: string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

async function loadCatalogue(
  language: string
): Promise<Record<string, string>> {
  try {
    const res = await fetch(`/locales/${language}/translation.json`, {
      cache: "force-cache",
    });
    if (!res.ok) return {};
    return (await res.json()) as Record<string, string>;
  } catch {
    // A malformed catalogue used to leave the app rendering raw keys for every
    // string; it now degrades to English and then to humanized text.
    console.error(`Translation catalogue for "${language}" failed to load`);
    return {};
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(FALLBACK_LANGUAGE);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [fallback, setFallback] = useState<Record<string, string>>({});
  // A ref, not state: `t` runs during render and must not schedule updates.
  const missingRef = useRef<Set<string>>(new Set());

  // Load persisted language preference on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lang");
      if (isSupported(stored)) setLanguageState(stored);
    } catch {
      /* storage unavailable — English it is */
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("lang", lang);
    } catch {
      /* preference simply is not remembered */
    }
  }, []);

  // English is always loaded as the fallback layer so a gap in another locale
  // shows real words rather than a key.
  useEffect(() => {
    let cancelled = false;
    loadCatalogue(FALLBACK_LANGUAGE).then((data) => {
      if (!cancelled) setFallback(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    missingRef.current = new Set();
    loadCatalogue(language).then((data) => {
      if (!cancelled) setTranslations(data);
    });
    return () => {
      cancelled = true;
    };
  }, [language]);

  const t = useCallback(
    (key: string): string => {
      const hit = translations[key];
      if (hit) return hit;

      const english = fallback[key];
      if (
        process.env.NODE_ENV !== "production" &&
        !missingRef.current.has(key)
      ) {
        missingRef.current.add(key);
        console.warn(`[i18n] missing "${key}" for locale "${language}"`);
      }
      return english || humanizeKey(key);
    },
    [translations, fallback, language]
  );

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, missingKeys: [...missingRef.current] }}
      key={language}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
