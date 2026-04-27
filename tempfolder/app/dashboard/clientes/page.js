"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
const API = process.env.NEXT_PUBLIC_API_URL;

export default function Clientes() {
  const [clients, setClients] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "/login";
    fetch(`${API}/clients`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setClients);
  }, []);

  return (
    <AdminLayout>
      <h1 className="h1">Clientes</h1>
      <p className="subtitle">Pacientes cadastrados no sistema.</p>
      <div className="panel">
        <table className="table">
          <thead><tr><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Código do portal</th></tr></thead>
          <tbody>{clients.map(c => <tr key={c.id}><td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td><td>{c.accessCode}</td></tr>)}</tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
