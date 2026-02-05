"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";

export default function TrialBalancePage() {
  const { t } = useLanguage();
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/accounting/trial-balance")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  const totalDebit = data.reduce((sum, acc: any) => sum + acc.totalDebit, 0);
  const totalCredit = data.reduce((sum, acc: any) => sum + acc.totalCredit, 0);

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>{t("accounting.trialBalance")}</h1>
      <div className="card">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{
              textAlign: "left",
              background: "#f9fafb",
              borderBottom: "2px solid #e5e7eb",
            }}
          >
            <tr>
              <th style={{ padding: "10px" }}>
                {t("accounting.chartOfAccounts")}
              </th>
              <th style={{ padding: "10px", textAlign: "right" }}>
                {t("accounting.debit")}
              </th>
              <th style={{ padding: "10px", textAlign: "right" }}>
                {t("accounting.credit")}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((acc: any) => (
              <tr key={acc.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "10px" }}>
                  {acc.code} - {acc.name} ({acc.type})
                </td>
                <td style={{ padding: "10px", textAlign: "right" }}>
                  {acc.totalDebit > 0 ? Number(acc.totalDebit).toFixed(2) : "-"}
                </td>
                <td style={{ padding: "10px", textAlign: "right" }}>
                  {acc.totalCredit > 0
                    ? Number(acc.totalCredit).toFixed(2)
                    : "-"}
                </td>
              </tr>
            ))}
            <tr style={{ fontWeight: "bold", background: "#f3f4f6" }}>
              <td style={{ padding: "10px" }}>{t("accounting.total")}</td>
              <td style={{ padding: "10px", textAlign: "right" }}>
                {totalDebit.toFixed(2)}
              </td>
              <td style={{ padding: "10px", textAlign: "right" }}>
                {totalCredit.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
