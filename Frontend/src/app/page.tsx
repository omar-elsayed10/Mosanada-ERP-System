"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import GlobalLoader from "@/components/GlobalLoader";
import { useState, useEffect } from "react";

export default function Home() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load for smooth transition
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="container"
      style={{ textAlign: "center", marginTop: "60px" }}
    >
      <GlobalLoader visible={loading} />

      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <LanguageToggle />
      </div>

      <div style={{ marginBottom: "30px" }}>
        <img
          src="/logo.png"
          alt="Mosanada ERP"
          style={{ maxWidth: "180px", height: "auto", borderRadius: "12px" }}
        />
      </div>

      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "15px",
          color: "var(--primary)",
        }}
      >
        {t("home.title")}
      </h1>
      <p
        style={{
          marginBottom: "50px",
          fontSize: "1.2rem",
          color: "var(--text-secondary)",
        }}
      >
        {t("home.subtitle")}
      </p>

      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <Link href="/register">
          <button
            className="btn"
            style={{ fontSize: "1.1rem", padding: "12px 30px" }}
          >
            {t("auth.registerCompany")}
          </button>
        </Link>
        <Link href="/login">
          <button
            className="btn btn-secondary"
            style={{ fontSize: "1.1rem", padding: "12px 30px" }}
          >
            {t("common.login")}
          </button>
        </Link>
      </div>
    </div>
  );
}
