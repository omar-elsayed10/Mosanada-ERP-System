"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import GlobalLoader from "@/components/GlobalLoader";

export default function Register() {
  const router = useRouter();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/auth/register-company", form);
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || t("auth.registrationFailed"));
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "420px", marginTop: "60px" }}>
      <GlobalLoader visible={isLoading} />
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <LanguageToggle />
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src="/logo.png" alt="Mosanada" style={{ width: "80px" }} />
        <h1
          style={{
            fontSize: "1.8rem",
            marginTop: "10px",
            color: "var(--primary)",
          }}
        >
          {t("auth.registerCompany")}
        </h1>
      </div>

      <div className="card">
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div>
            <label>{t("auth.companyName")}</label>
            <input
              className="input"
              value={form.companyName}
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label>{t("auth.adminEmail")}</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label>{t("auth.password")}</label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="btn"
            style={{ width: "100%", marginTop: "10px" }}
            disabled={isLoading}
          >
            {t("common.register")}
          </button>
        </form>
      </div>
    </div>
  );
}
