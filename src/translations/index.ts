import { faultCodeTranslations } from './faultCodes';
import { uiTranslations } from './uiLabels';

// Supported languages
export type SupportedLanguage = 'en-US' | 'de-DE';

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en-US';

// Combined translations
export const translations = {
  'en-US': {
    ...faultCodeTranslations['en-US'],
    ...uiTranslations['en-US']
  },
  'de-DE': {
    ...faultCodeTranslations['de-DE'],
    ...uiTranslations['de-DE']
  }
};

// Helper function to get translation
export function getTranslation(key: string, language: SupportedLanguage = DEFAULT_LANGUAGE): string {
  const langTranslations:any = translations[language] || translations[DEFAULT_LANGUAGE];
  return langTranslations[key] || key;
}

// Helper function to get fault code translation
export function getFaultTranslation(code: string | number, language: SupportedLanguage = DEFAULT_LANGUAGE): string {
  const codeStr = String(code);
  const langTranslations:any = faultCodeTranslations[language] || faultCodeTranslations[DEFAULT_LANGUAGE];
  return langTranslations[codeStr] || `Unknown fault code: ${codeStr}`;
}

// Helper function to get UI label translation
export function getUITranslation(key: string, language: SupportedLanguage = DEFAULT_LANGUAGE): string {
  const langTranslations:any = uiTranslations[language] || uiTranslations[DEFAULT_LANGUAGE];
  return langTranslations[key] || key;
}