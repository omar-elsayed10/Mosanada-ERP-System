"use client";
import { useLanguage } from "@/lib/LanguageContext";

export default function GlobalLoader({ visible }: { visible: boolean }) {
  const { t } = useLanguage();

  if (!visible) return null;

  return (
    <div className="loader-overlay">
      <div style={{ textAlign: "center" }}>
        <div className="spinner" style={{ margin: "0 auto 1rem" }}></div>
        <p style={{ color: "var(--primary)", fontWeight: 500 }}>
          {t("common.loading")}
        </p>
      </div>
    </div>
  );
}
