# Como colocar online de forma simples

## O jeito mais simples

Use:

- GitHub para guardar o código
- Railway para banco PostgreSQL
- Render para backend
- Vercel para frontend

## 1. Banco no Railway

1. Crie uma conta no Railway
2. Clique em New Project
3. Escolha PostgreSQL
4. Copie a variável DATABASE_URL

## 2. Código no GitHub

1. Crie repositório chamado `brenda-nutri-saas`
2. Envie esta pasta para o GitHub
3. Pode fazer isso pelo VS Code usando Publish to GitHub

## 3. Backend no Render

1. Acesse Render
2. New Web Service
3. Escolha o repositório
4. Root Directory:

```txt
backend
```

5. Build Command:

```bash
npm install
```

6. Start Command:

```bash
npm start
```

7. Variáveis de ambiente:

```txt
DATABASE_URL=cole_a_url_do_railway
JWT_SECRET=uma_senha_grande_e_segura
FRONTEND_URL=https://seu-site.vercel.app
BRENDANUTRI_WHATSAPP=5527999999999
AUTO_APPROVE_APPOINTMENTS=false

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

MERCADO_PAGO_ACCESS_TOKEN=

WHATSAPP_CLOUD_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=

INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_PAGE_ID=

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_senha_de_app
EMAIL_FROM=Brenda Nutri <seuemail@gmail.com>
```

8. Depois de publicar, entre no Shell do Render e rode:

```bash
npm run seed
```

## 4. Frontend na Vercel

1. Acesse Vercel
2. Add New Project
3. Escolha o repositório
4. Root Directory:

```txt
frontend
```

5. Variável:

```txt
NEXT_PUBLIC_API_URL=https://sua-api.onrender.com/api
```

6. Deploy

## 5. Links finais

Painel:

```txt
https://seu-site.vercel.app/login
```

Página pública:

```txt
https://seu-site.vercel.app/agendar
```

Portal do paciente:

```txt
https://seu-site.vercel.app/paciente
```

## Observação sobre WhatsApp

A versão simples abre o WhatsApp com a mensagem pronta. Para envio 100% automático sem clique, configure WhatsApp Cloud API da Meta ou uma API homologada.

## Observação sobre pagamento

A estrutura do Mercado Pago está pronta. Para cobrança real, configure `MERCADO_PAGO_ACCESS_TOKEN`.
