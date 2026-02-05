"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";

export default function JournalsPage() {
  const { t } = useLanguage();
  const [journals, setJournals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [lines, setLines] = useState([{ accountId: "", debit: 0, credit: 0 }]);

  const fetchData = async () => {
    try {
      const [jRes, aRes] = await Promise.all([
        api.get("/accounting/journals"),
        api.get("/accounting/accounts"),
      ]);
      setJournals(jRes.data);
      setAccounts(aRes.data);
      if (aRes.data.length > 0) {
        setLines([{ accountId: aRes.data[0].id, debit: 0, credit: 0 }]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addLine = () => {
    setLines([
      ...lines,
      {
        accountId: accounts.length > 0 ? (accounts[0] as any).id : "",
        debit: 0,
        credit: 0,
      },
    ]);
  };

  const updateLine = (index: number, field: string, value: any) => {
    const newLines = [...lines];
    (newLines[index] as any)[field] = value;
    setLines(newLines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/accounting/journals", { description, date, lines });
      setDescription("");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>{t("accounting.journalEntries")}</h1>

      <div className="card">
        <h3>{t("accounting.createEntry")}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>{t("accounting.description")}</label>
              <input
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label>{t("accounting.date")}</label>
              <input
                className="input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div
            style={{
              background: "#f9fafb",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
          >
            <h4>{t("accounting.lines")}</h4>
            {lines.map((line, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr auto",
                  gap: "10px",
                  marginBottom: "5px",
                }}
              >
                <select
                  className="input"
                  value={line.accountId}
                  onChange={(e) => updateLine(idx, "accountId", e.target.value)}
                >
                  {accounts.map((acc: any) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.code} - {acc.name}
                    </option>
                  ))}
                </select>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  placeholder={t("accounting.debit")}
                  value={line.debit}
                  onChange={(e) =>
                    updateLine(idx, "debit", parseFloat(e.target.value))
                  }
                />
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  placeholder={t("accounting.credit")}
                  value={line.credit}
                  onChange={(e) =>
                    updateLine(idx, "credit", parseFloat(e.target.value))
                  }
                />
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => setLines(lines.filter((_, i) => i !== idx))}
                    style={{ color: "red" }}
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLine}
              style={{ fontSize: "0.8rem", textDecoration: "underline" }}
            >
              + {t("accounting.addLine")}
            </button>
          </div>

          <button type="submit" className="btn">
            {t("accounting.postJournal")}
          </button>
        </form>
      </div>

      <div className="card">
        {journals.map((j: any) => (
          <div
            key={j.id}
            style={{
              borderBottom: "1px solid #eee",
              paddingBottom: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
              }}
            >
              <span>
                {new Date(j.date).toLocaleDateString()} - {j.description}
              </span>
              <span style={{ color: "#6b7280" }}>ID: {j.id.slice(0, 8)}</span>
            </div>
            <table
              style={{ width: "100%", fontSize: "0.9rem", marginTop: "5px" }}
            >
              <thead>
                <tr style={{ textAlign: "left", color: "#6b7280" }}>
                  <th>{t("accounting.chartOfAccounts")}</th>
                  <th style={{ textAlign: "right" }}>
                    {t("accounting.debit")}
                  </th>
                  <th style={{ textAlign: "right" }}>
                    {t("accounting.credit")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {j.lines.map((l: any) => (
                  <tr key={l.id}>
                    <td>
                      {l.account.code} - {l.account.name}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {Number(l.debit).toFixed(2) === "0.00"
                        ? "-"
                        : Number(l.debit).toFixed(2)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {Number(l.credit).toFixed(2) === "0.00"
                        ? "-"
                        : Number(l.credit).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
