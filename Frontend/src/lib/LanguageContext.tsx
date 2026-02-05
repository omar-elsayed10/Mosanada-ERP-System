"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

type Language = "en" | "ar";
type LanguageContextType = {
  language: Language;
  direction: "ltr" | "rtl";
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved) setLanguage(saved);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const direction = language === "ar" ? "rtl" : "ltr";

  // Update HTML direction
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = translations[language];
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Fallback to key if not found
      }
    }
    return value;
  };

  return (
    <LanguageContext.Provider
      value={{ language, direction, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
