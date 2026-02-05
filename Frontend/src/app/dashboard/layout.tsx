"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import GlobalLoader from "@/components/GlobalLoader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, [router]);

  if (loading || !user) return <GlobalLoader visible={true} />;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-main)",
      }}
    >
      <aside
        style={{
          width: "280px",
          background: "#0f172a",
          color: "white",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <img
            src="/logo.png"
            alt="Mosanada"
            style={{
              maxWidth: "40px",
              verticalAlign: "middle",
              marginRight: "10px",
            }}
          />
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            Mosanada
          </span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              marginBottom: "8px",
              paddingLeft: "8px",
            }}
          >
            Main
          </p>
          <Link
            href="/dashboard"
            className="nav-link"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "10px",
              borderRadius: "6px",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            {t("common.dashboard")}
          </Link>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              marginTop: "20px",
              marginBottom: "8px",
              paddingLeft: "8px",
            }}
          >
            {t("accounting.title")}
          </p>
          <Link
            href="/dashboard/accounting/accounts"
            style={{
              color: "#cbd5e1",
              textDecoration: "none",
              padding: "8px 10px",
              display: "block",
              transition: "color 0.2s",
            }}
          >
            ◦ {t("accounting.chartOfAccounts")}
          </Link>
          <Link
            href="/dashboard/accounting/journals"
            style={{
              color: "#cbd5e1",
              textDecoration: "none",
              padding: "8px 10px",
              display: "block",
              transition: "color 0.2s",
            }}
          >
            ◦ {t("accounting.journalEntries")}
          </Link>
          <Link
            href="/dashboard/accounting/trial-balance"
            style={{
              color: "#cbd5e1",
              textDecoration: "none",
              padding: "8px 10px",
              display: "block",
              transition: "color 0.2s",
            }}
          >
            ◦ {t("accounting.trialBalance")}
          </Link>
        </nav>

        <div
          style={{
            marginTop: "auto",
            borderTop: "1px solid #334155",
            paddingTop: "20px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <LanguageToggle />
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
            style={{
              background: "transparent",
              border: "1px solid #dc2626",
              color: "#f87171",
              padding: "8px",
              width: "100%",
              cursor: "pointer",
              borderRadius: "6px",
              fontSize: "0.9rem",
            }}
          >
            {t("common.logout")}
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "40px" }}>{children}</main>
    </div>
  );
}
