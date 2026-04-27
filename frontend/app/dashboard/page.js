"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
const API = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
    fetch(`${API}/finance/summary`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setSummary);
  }, []);

  if (!summary) return <AdminLayout><p>Carregando...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="topbar">
        <div><h1 className="h1">Dashboard</h1><p className="subtitle">Resumo financeiro e operacional.</p></div>
        <a className="btn" href="/agendar">Página pública</a>
      </div>
      <section className="cards">
        <div className="card"><small>Receita total</small><strong>R$ {Number(summary.revenue).toFixed(2)}</strong></div>
        <div className="card"><small>Repasse</small><strong>R$ {Number(summary.professionalAmount).toFixed(2)}</strong></div>
        <div className="card"><small>Líquido</small><strong>R$ {Number(summary.clinicAmount).toFixed(2)}</strong></div>
        <div className="card"><small>Pendentes</small><strong>{summary.pendingAppointments}</strong></div>
      </section>
      <div className="panel">
        <h2>Central da Brenda</h2>
        <p>Use o menu lateral para gerenciar agenda, pacientes, prontuários, planos alimentares, pagamentos e integrações.</p>
      </div>
    </AdminLayout>
  );
}
