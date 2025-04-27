"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "de" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<
    Record<string, Record<Language, string>>
  >({});

  useEffect(() => {
    // Load translations from JSON files
    const loadTranslations = async () => {
      try {
        const en = await import("@/translations/en.json");
        const de = await import("@/translations/de.json");
        const fr = await import("@/translations/fr.json");

        setTranslations({
          ...en.default,
          ...de.default,
          ...fr.default,
        });
      } catch (error) {
        console.error("Error loading translations:", error);
      }
    };

    loadTranslations();
  }, []);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
