"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
const API = process.env.NEXT_PUBLIC_API_URL;

export default function Pagamentos() {
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "/login";
    fetch(`${API}/payments`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setPayments);
  }, []);

  return (
    <AdminLayout>
      <h1 className="h1">Pagamentos</h1>
      <p className="subtitle">Controle de Pix, cartão e links de pagamento.</p>
      <div className="panel">
        <table className="table">
          <thead><tr><th>Paciente</th><th>Descrição</th><th>Valor</th><th>Status</th><th>Link</th></tr></thead>
          <tbody>{payments.map(p => <tr key={p.id}><td>{p.Client?.name}</td><td>{p.description}</td><td>R$ {Number(p.amount).toFixed(2)}</td><td><span className="badge">{p.status}</span></td><td>{p.paymentUrl && <a className="btn light" href={p.paymentUrl} target="_blank">Abrir</a>}</td></tr>)}</tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
