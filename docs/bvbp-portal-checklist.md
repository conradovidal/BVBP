# Checklist Interno do Portal BVBP

## Rodar localmente

```sh
npm install
npm run dev
```

Abra `http://localhost:8080` quando o servidor estiver nessa porta, ou use a porta indicada pelo Vite.

## Desenvolvimento local

- `VITE_ENABLE_DEMO_DATA=true` mantém clientes e workspace de demonstração.
- `VITE_ENABLE_MOCK_AUTH=true` libera o fallback local `cliente@bvbp.com.br` / `bvbp90`.
- Em produção, deixe `VITE_ENABLE_DEMO_DATA=false` e `VITE_ENABLE_MOCK_AUTH=false`.

## Produção zerada

- Aplique as migrações Supabase.
- Faça deploy de `invite-client-contact` e `bootstrap-admins`.
- Configure `PUBLIC_SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `BOOTSTRAP_ADMIN_SECRET` nas Edge Functions.
- Configure `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` e `VITE_PUBLIC_SITE_URL` no app.
- Configure Site URL e Redirect URLs do Supabase Auth para `/auth/set-password`.
- Configure SMTP/email transacional antes de convidar clientes reais.

Com demo desligada, o primeiro acesso admin deve mostrar o portal sem BVBP nem clientes exemplo.

## Bootstrap de admins

- Chame a Edge Function `bootstrap-admins` com o header `x-bootstrap-secret`.
- `conrado@bvbp.com.br` e `cristiano@bvbp.com.br` recebem link para definir senha.
- Usuários confirmados com email `@bvbp.com.br` recebem papel `admin` automaticamente pela migration.

## Primeiro uso

- Entre pelo link recebido e defina a senha em `/auth/set-password`.
- Acesse `/app/admin/settings`.
- Clique em `Cadastrar workspace BVBP`.
- Cadastre a BVBP manualmente.
- Depois cadastre clientes reais no CRM.

## Contatos de clientes

- Salvar contato não envia email.
- O acesso só é liberado em edição do cliente, pelo botão `Enviar convite`.
- `Reenviar convite` manda novo link de definição/recuperação de senha.
- `Desativar acesso` revoga a membership do cliente.

## Validação antes de publicar

```sh
npx tsc -p tsconfig.app.json --noEmit
npm run lint
npm run build
```

- Testar login admin, reset de senha e `/auth/set-password`.
- Testar Supabase vazio sem dados de demo.
- Testar cadastro do workspace BVBP.
- Testar criação/edição de cliente, contatos, convite, reenvio e desativação.
- Testar cliente acessando apenas o próprio workspace.
- Testar mobile em 390px.
