"use client";
import { useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL;

export default function Login() {
  const [email, setEmail] = useState("brenda@email.com");
  const [password, setPassword] = useState("brenda123");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Erro ao entrar");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "/dashboard";
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <section className="login-hero">
          <div className="logo-mark"></div>
          <h1 style={{fontSize: 42, lineHeight: 1}}>Painel Brenda Nutri</h1>
          <p>Agenda, pacientes, prontuários, planos alimentares, financeiro e portal do paciente.</p>
        </section>
        <form className="login-form grid" onSubmit={handleLogin}>
          <h2>Entrar</h2>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" type="password" />
          {error && <p style={{color: "crimson"}}>{error}</p>}
          <button className="btn">Acessar painel</button>
          <button type="button" className="btn light" onClick={() => alert("Login com Google preparado para ativação via GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET.")}>Entrar com Google</button>
          <a className="btn light" href="/agendar">Ir para agendamento público</a>
        </form>
      </div>
    </div>
  );
}
