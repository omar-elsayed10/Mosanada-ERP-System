"use client";
import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      style={{
        padding: "5px 10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        background: "white",
        cursor: "pointer",
        fontSize: "0.9rem",
      }}
    >
      {language === "en" ? "العربية" : "English"}
    </button>
  );
}
