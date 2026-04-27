export default function Home() {
  return (
    <div className="public-page">
      <div className="public-card">
        <h1 className="h1">Brenda Nutri</h1>
        <p className="subtitle">Sistema completo de atendimento nutricional.</p>
        <div style={{display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap"}}>
          <a className="btn" href="/login">Área da Brenda</a>
          <a className="btn light" href="/agendar">Agendar consulta</a>
          <a className="btn light" href="/paciente">Portal do paciente</a>
        </div>
      </div>
    </div>
  );
}
