"use client";
import { useEffect, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL;

export default function Agendar() {
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", serviceId: "", professionalId: "", date: "", notes: "" });

  useEffect(() => {
    fetch(`${API}/public/services`).then(r => r.json()).then(setServices);
    fetch(`${API}/public/professionals`).then(r => r.json()).then(data => {
      setProfessionals(data);
      if (data[0]) setForm(f => ({ ...f, professionalId: data[0].id }));
    });
  }, []);

  async function searchSlots() {
    setSelectedSlot(null);
    const res = await fetch(`${API}/available-slots?date=${form.date}&serviceId=${form.serviceId}`);
    setSlots(await res.json());
  }

  async function submit(e) {
    e.preventDefault();
    if (!selectedSlot) return alert("Escolha um horário.");
    const res = await fetch(`${API}/appointments/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client: { name: form.name, email: form.email, phone: form.phone }, serviceId: form.serviceId, professionalId: form.professionalId, date: form.date, startTime: selectedSlot.startTime, endTime: selectedSlot.endTime, notes: form.notes })
    });
    const data = await res.json();
    if (data.whatsappLink) window.open(data.whatsappLink, "_blank");
    setSuccess(data);
  }

  return (
    <div className="public-page">
      <div className="public-card">
        <div className="topbar"><div><h1 className="h1">Agendar consulta</h1><p className="subtitle">Escolha serviço, data e horário.</p></div><a className="btn light" href="/login">Área da Brenda</a></div>
        {success ? <div className="panel"><h2>Solicitação enviada!</h2><p>Código de acesso ao portal do paciente: <b>{success.accessCode}</b></p><p>Guarde esse código junto com seu e-mail para acessar o plano alimentar depois.</p>{success.payment?.paymentUrl && <a className="btn" target="_blank" href={success.payment.paymentUrl}>Abrir pagamento</a>}</div> : (
          <form className="grid" onSubmit={submit}>
            <div className="grid grid-2"><input required placeholder="Nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/><input required placeholder="Telefone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/></div>
            <input placeholder="E-mail" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
            <div className="grid grid-3"><select required value={form.serviceId} onChange={e => setForm({...form, serviceId: e.target.value})}><option value="">Serviço</option>{services.map(s => <option key={s.id} value={s.id}>{s.name} - R$ {Number(s.price).toFixed(2)}</option>)}</select><select required value={form.professionalId} onChange={e => setForm({...form, professionalId: e.target.value})}>{professionals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}/></div>
            <button type="button" className="btn light" onClick={searchSlots}>Buscar horários</button>
            <div className="slots">{slots.map(s => <button type="button" key={s.startTime} className={`slot ${selectedSlot?.startTime === s.startTime ? "selected" : ""}`} onClick={() => setSelectedSlot(s)}>{s.startTime}</button>)}</div>
            <textarea placeholder="Observações" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}/>
            <button className="btn">Enviar solicitação</button>
          </form>
        )}
      </div>
    </div>
  );
}
