# Brenda Nutri SaaS Completo

Sistema em português para nutricionista, inspirado em fluxos conhecidos de plataformas de nutrição, mas com identidade, estrutura e código próprios.

## Módulos incluídos

- Login da Brenda
- Login com Google, estrutura preparada
- Dashboard financeiro
- Agenda
- Página pública de agendamento
- Confirmação automática opcional
- WhatsApp automático por link e estrutura para API oficial
- Pagamento Pix/cartão, estrutura preparada para Mercado Pago
- Cadastro de clientes
- Prontuário do paciente
- Plano alimentar
- Portal do paciente
- Diário alimentar
- Lista de compras
- Receitas
- Integração com Instagram, estrutura para leads
- App mobile via PWA, instala como aplicativo no celular

## Login padrão

E-mail:

```txt
brenda@email.com
```

Senha:

```txt
brenda123
```

## Rodar localmente

### 1. Subir banco

```bash
docker compose up -d
```

### 2. Rodar backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### 3. Rodar frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

## Links principais

```txt
/login
/dashboard
/dashboard/agenda
/dashboard/clientes
/dashboard/prontuarios
/dashboard/planos-alimentares
/dashboard/pagamentos
/dashboard/integracoes
/agendar
/paciente
```

## Publicação online

Leia:

```txt
PASSO_A_PASSO_PUBLICAR.md
```
