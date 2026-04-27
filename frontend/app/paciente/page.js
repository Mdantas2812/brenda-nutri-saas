"use client";
import { useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL;

export default function Paciente() {
  const [email, setEmail] = useState("paciente@email.com");
  const [accessCode, setAccessCode] = useState("ABC123");
  const [portal, setPortal] = useState(null);
  const [error, setError] = useState("");

  async function login(e) {
    e.preventDefault();
    setError("");
    const res = await fetch(`${API}/patient/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, accessCode })
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Erro ao entrar");
    const portalRes = await fetch(`${API}/patient/${data.client.id}/portal`);
    setPortal(await portalRes.json());
  }

  return (
    <div className="public-page">
      <div className="public-card">
        {!portal ? (
          <form className="grid" onSubmit={login}>
            <h1 className="h1">Portal do paciente</h1>
            <p className="subtitle">Acesse plano alimentar, consultas, pagamentos e lista de compras.</p>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" />
            <input value={accessCode} onChange={e => setAccessCode(e.target.value)} placeholder="Código de acesso" />
            {error && <p style={{color:"crimson"}}>{error}</p>}
            <button className="btn">Entrar</button>
          </form>
        ) : (
          <div>
            <h1 className="h1">Olá, {portal.client.name}</h1>
            <p className="subtitle">Aqui está sua área do paciente.</p>

            <div className="panel">
              <h2>Plano alimentar</h2>
              {portal.plans.map(plan => (
                <div className="meal" key={plan.id}>
                  <h3>{plan.title}</h3>
                  <p>{plan.generalGuidelines}</p>
                  {plan.Meals?.map(meal => (
                    <div className="meal" key={meal.id}>
                      <b>{meal.time} - {meal.name}</b>
                      <p>{meal.instructions}</p>
                      <ul>{meal.MealOptions?.map(o => <li key={o.id}>{o.description}</li>)}</ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="panel">
              <h2>Lista de compras</h2>
              <ul>{portal.shopping.map(i => <li key={i.id}>{i.name} - {i.quantity}</li>)}</ul>
            </div>

            <div className="panel">
              <h2>Pagamentos</h2>
              {portal.payments.map(p => <p key={p.id}>{p.description} - R$ {Number(p.amount).toFixed(2)} - {p.status}</p>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
