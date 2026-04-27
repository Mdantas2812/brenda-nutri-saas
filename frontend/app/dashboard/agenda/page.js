"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
const API = process.env.NEXT_PUBLIC_API_URL;

export default function Agenda() {
  const [items, setItems] = useState([]);

  async function load() {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "/login";
    const res = await fetch(`${API}/appointments`, { headers: { Authorization: `Bearer ${token}` } });
    setItems(await res.json());
  }

  async function status(id, value) {
    const token = localStorage.getItem("token");
    await fetch(`${API}/appointments/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: value })
    });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <AdminLayout>
      <h1 className="h1">Agenda</h1>
      <p className="subtitle">Aprovação, recusa e WhatsApp da solicitação.</p>
      <div className="panel">
        <table className="table">
          <thead><tr><th>Data</th><th>Horário</th><th>Cliente</th><th>Serviço</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id}>
                <td>{i.date}</td><td>{i.startTime} até {i.endTime}</td><td>{i.Client?.name}<br/><small>{i.Client?.phone}</small></td><td>{i.Service?.name}</td><td><span className="badge">{i.status}</span></td>
                <td><div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
                  <button className="btn" onClick={() => status(i.id, "aprovado")}>Aprovar</button>
                  <button className="btn light" onClick={() => status(i.id, "recusado")}>Recusar</button>
                  {i.whatsappLink && <a className="btn light" target="_blank" href={i.whatsappLink}>WhatsApp</a>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
