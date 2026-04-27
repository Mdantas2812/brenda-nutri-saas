import AdminLayout from "../../components/AdminLayout";

export default function Integracoes() {
  return (
    <AdminLayout>
      <h1 className="h1">Integrações</h1>
      <p className="subtitle">Google, WhatsApp, Instagram, pagamento e app mobile.</p>

      <div className="cards">
        <div className="card"><small>Google</small><strong>Login preparado</strong></div>
        <div className="card"><small>WhatsApp</small><strong>Link ativo</strong></div>
        <div className="card"><small>Pagamento</small><strong>Pix/cartão preparado</strong></div>
        <div className="card"><small>Mobile</small><strong>PWA ativo</strong></div>
      </div>

      <div className="panel">
        <h2>Como ativar integrações reais</h2>
        <p>Configure as variáveis de ambiente no Render e na Vercel conforme o arquivo PASSO_A_PASSO_PUBLICAR.md.</p>
      </div>
    </AdminLayout>
  );
}
