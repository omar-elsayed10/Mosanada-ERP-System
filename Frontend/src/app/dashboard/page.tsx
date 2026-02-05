"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>{t("common.dashboard")}</h1>
      <div className="card">
        <h2>
          {t("common.welcome")}, {user?.email}
        </h2>
        <p>
          {t("common.companyId")}: {user?.companyId}
        </p>
      </div>
    </div>
  );
}
