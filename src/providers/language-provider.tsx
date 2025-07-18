"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Language = "en" | "de" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Load persisted language preference on mount
  useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem("lang");
    if (stored === "en" || stored === "de" || stored === "fr") {
      setLanguage(stored);
    }
  }, []);

  // Persist language changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", language);
    }
  }, [language]);

  useEffect(() => {
    // Dynamically load translation file from public/locales
    fetch(`/locales/${language}/translation.json`)
      .then((res) => res.json())
      .then((data) => setTranslations(data))
      .catch(() => setTranslations({}));
  }, [language]);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }} key={language}>
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
