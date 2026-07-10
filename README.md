# BVBP Portal

Portal BVBP em React/Vite para site institucional, administração interna e workspace de Performance Operacional.

## Stack

- React + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase Auth, Database e Edge Functions
- GitHub como repositório
- Vercel como deploy

## Desenvolvimento Local

```sh
npm install
npm run dev
```

O Vite usa a porta `8080` por padrão quando disponível. Abra `http://localhost:8080` ou a porta indicada no terminal.

Comandos principais:

```sh
npx tsc -p tsconfig.app.json --noEmit
npm run lint
npm run build
npm audit
```

## Variáveis de Ambiente

Variáveis públicas do app:

```sh
VITE_SUPABASE_PROJECT_ID=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_PUBLIC_SITE_URL=
VITE_ENABLE_DEMO_DATA=false
VITE_ENABLE_MOCK_AUTH=false
```

Variáveis server-only das Edge Functions:

```sh
PUBLIC_SITE_URL=
SUPABASE_SERVICE_ROLE_KEY=
BOOTSTRAP_ADMIN_SECRET=
```

Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend.

## Supabase

Antes de publicar o portal para uso real:

1. Aplique as migrações Supabase, incluindo `client_portal_access` e `staff_access_bootstrap`.
2. Faça deploy das Edge Functions `invite-client-contact` e `bootstrap-admins`.
3. Configure `PUBLIC_SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `BOOTSTRAP_ADMIN_SECRET` nas Edge Functions.
4. No Supabase Auth, configure Site URL e Redirect URLs de produção, preview e localhost apontando para `/auth/set-password`.
5. Configure SMTP/email transacional antes de convidar clientes reais.
6. Execute o bootstrap inicial chamando `bootstrap-admins` com o header `x-bootstrap-secret`; Conrado e Cristiano recebem link para definir senha.

## Produção

Em produção, mantenha:

```sh
VITE_ENABLE_DEMO_DATA=false
VITE_ENABLE_MOCK_AUTH=false
```

Com demo desligada, um Supabase vazio não cria BVBP nem clientes exemplo. O primeiro admin deve acessar o portal, abrir Configurações e cadastrar manualmente o workspace BVBP.

## Deploy

O deploy é feito pela Vercel a partir do repositório no GitHub.

Checklist antes de promover uma versão:

```sh
npx tsc -p tsconfig.app.json --noEmit
npm run lint
npm run build
npm audit
```

Também valide:

- Login e recuperação/definição de senha.
- Admin acessando CRM e Configurações.
- Supabase vazio sem dados de demonstração.
- Cadastro do workspace BVBP.
- Cadastro de cliente, contatos, convite, reenvio e desativação de acesso.
- Cliente acessando apenas o próprio workspace.

## Checklist Interno

O checklist de uso e validação do portal está em [`docs/bvbp-portal-checklist.md`](docs/bvbp-portal-checklist.md).
