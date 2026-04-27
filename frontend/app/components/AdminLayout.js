export default function AdminLayout({ children }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="logo"><div className="logo-mark"></div>Brenda Nutri</div>
        <nav className="nav">
          <a href="/dashboard">Dashboard</a>
          <a href="/dashboard/agenda">Agenda</a>
          <a href="/dashboard/clientes">Clientes</a>
          <a href="/dashboard/prontuarios">Prontuários</a>
          <a href="/dashboard/planos-alimentares">Planos alimentares</a>
          <a href="/dashboard/pagamentos">Pagamentos</a>
          <a href="/dashboard/integracoes">Integrações</a>
          <a href="/agendar">Página pública</a>
          <a href="/paciente">Portal do paciente</a>
        </nav>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
