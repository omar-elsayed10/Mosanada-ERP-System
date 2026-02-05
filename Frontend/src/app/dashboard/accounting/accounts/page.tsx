"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";

export default function AccountsPage() {
  const { t } = useLanguage();
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ code: "", name: "", type: "ASSET" });

  const fetchAccounts = async () => {
    try {
      const { data } = await api.get("/accounting/accounts");
      setAccounts(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/accounting/accounts", form);
      setForm({ code: "", name: "", type: "ASSET" });
      fetchAccounts();
    } catch (e) {
      alert("Failed to create account");
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>
        {t("accounting.chartOfAccounts")}
      </h1>

      <div className="card">
        <h3>{t("accounting.createAccount")}</h3>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr auto",
            gap: "10px",
            alignItems: "end",
          }}
        >
          <div>
            <label>{t("accounting.code")}</label>
            <input
              className="input"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
            />
          </div>
          <div>
            <label>{t("accounting.name")}</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>{t("accounting.type")}</label>
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="ASSET">{t("accounting.accounts.asset")}</option>
              <option value="LIABILITY">
                {t("accounting.accounts.liability")}
              </option>
              <option value="EQUITY">{t("accounting.accounts.equity")}</option>
              <option value="REVENUE">
                {t("accounting.accounts.revenue")}
              </option>
              <option value="EXPENSE">
                {t("accounting.accounts.expense")}
              </option>
            </select>
          </div>
          <button
            type="submit"
            className="btn"
            style={{ marginBottom: "12px" }}
          >
            {t("common.add")}
          </button>
        </form>
      </div>

      <div className="card">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ textAlign: "left", background: "#f9fafb" }}>
            <tr>
              <th style={{ padding: "10px" }}>{t("accounting.code")}</th>
              <th style={{ padding: "10px" }}>{t("accounting.name")}</th>
              <th style={{ padding: "10px" }}>{t("accounting.type")}</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc: any) => (
              <tr key={acc.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "10px" }}>{acc.code}</td>
                <td style={{ padding: "10px" }}>{acc.name}</td>
                <td style={{ padding: "10px" }}>{acc.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
