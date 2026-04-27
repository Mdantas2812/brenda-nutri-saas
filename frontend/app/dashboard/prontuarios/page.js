"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
const API = process.env.NEXT_PUBLIC_API_URL;

export default function Prontuarios() {
  const [records, setRecords] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "/login";
    fetch(`${API}/medical-records`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setRecords);
  }, []);

  return (
    <AdminLayout>
      <h1 className="h1">Prontuários</h1>
      <p className="subtitle">Histórico clínico, objetivos, restrições e evolução.</p>
      <div className="panel">
        <table className="table">
          <thead><tr><th>Paciente</th><th>Objetivo</th><th>Restrições</th><th>Peso</th><th>Observações</th></tr></thead>
          <tbody>{records.map(r => <tr key={r.id}><td>{r.Client?.name}</td><td>{r.objective}</td><td>{r.restrictions}</td><td>{r.weight}</td><td>{r.notes}</td></tr>)}</tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
