import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage, availableLanguages } = useLanguage();
  return (
    <div className="flex items-center">
      <label htmlFor="language-select" className="mr-2 text-sm text-gray-600">
        Language:
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang === "en-US" ? "English" : "Deutsch"}
          </option>
        ))}
      </select>
    </div>
  );
}