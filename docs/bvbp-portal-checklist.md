# Checklist Interno do Portal BVBP

## Rodar localmente

```sh
npm install
npm run dev
```

Abra `http://localhost:8080` quando o servidor estiver nessa porta, ou use a porta indicada pelo Vite.

## Desenvolvimento local

- Demo e login mock ficam desligados por padrão em qualquer ambiente.
- `VITE_ENABLE_DEMO_DATA=true` habilita explicitamente clientes e workspace de demonstração.
- `VITE_ENABLE_MOCK_AUTH=true` habilita explicitamente o fallback local `cliente@bvbp.com.br` / `bvbp90`.
- Em produção, deixe `VITE_ENABLE_DEMO_DATA=false` e `VITE_ENABLE_MOCK_AUTH=false`.

## Produção zerada

- Aplique as migrações Supabase.
- Faça deploy de `invite-client-contact` e `bootstrap-admins`.
- Configure `PUBLIC_SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `BOOTSTRAP_ADMIN_SECRET` nas Edge Functions.
- Configure `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` e `VITE_PUBLIC_SITE_URL` no app.
- Configure `https://www.bvbp.com.br` como Site URL e autorize `https://www.bvbp.com.br/auth/**` e `https://bvbp.com.br/auth/**` nas Redirect URLs do Supabase Auth.
- Configure a validade do OTP para 3.600 segundos.
- Publique os templates de `docs/email-templates/` somente depois de `/auth/confirm` estar no ar.
- No Resend, confirme `click_tracking=false` e `open_tracking=false` no domínio transacional.
- Configure SMTP/email transacional antes de convidar clientes reais.

Com demo desligada, o primeiro acesso admin deve mostrar o portal sem BVBP nem clientes exemplo.

## Bootstrap de admins

- Chame a Edge Function `bootstrap-admins` com o header `x-bootstrap-secret` e um body com destinatários explícitos, como `{ "mode": "invite_only", "emails": ["conrado@bvbp.com.br"] }`.
- A lista `emails` é obrigatória, não aceita duplicatas e só permite `conrado@bvbp.com.br` e `cristiano@bvbp.com.br`.
- Somente os endereços solicitados recebem email. Nunca inclua Cristiano durante uma validação exclusiva do Conrado.
- Para um ambiente novo, cada destinatário solicitado deve retornar `invited`.
- `already_exists` não envia email nem altera papéis. Use `recover_existing` apenas quando a intenção explícita for recuperar uma conta existente.
- Usuários confirmados com email `@bvbp.com.br` recebem papel `admin` automaticamente pela migration.

## Reset controlado de produção

Antes de qualquer exclusão, registre as contagens e aborte se houver usuários, clientes ou leads diferentes do inventário aprovado. O reset não deve ser salvo como migration nem como script destrutivo reutilizável.

Preserve sempre:

- `blog_posts`, objetos do bucket `blog-images` e suas URLs;
- `staff_access_rules`, `staff_access_domains`, migrations, secrets e Edge Functions;
- o mapa temporário `email -> posts/imagens` necessário para restaurar autoria e ownership depois dos novos convites.

Ordem operacional:

1. Publique primeiro a versão que invalida o cache legado e revalida a sessão no Supabase.
2. Confirme o inventário imediatamente antes da limpeza.
3. Exporte autoria dos posts e ownership das imagens por email; remova temporariamente esses vínculos sem apagar conteúdo.
4. Revogue sessões, limpe as tabelas do portal na ordem das dependências, remova somente leads aprovados e exclua os usuários alvo.
5. Confirme zero usuários, sessões, papéis, leads de teste e registros do portal.
6. Rotacione `BOOTSTRAP_ADMIN_SECRET`, invoque `bootstrap-admins` em `invite_only` com a lista explícita aprovada e exija `invited` para cada destinatário solicitado.
7. Restaure autoria e ownership usando os novos UUIDs e repita todas as contagens.

Estado esperado para o reset inicial de julho de 2026:

- intermediário: 0 usuários, 0 sessões, 0 papéis, 0 leads e 0 registros nas quatro tabelas do portal;
- preservado: 2 regras de staff, 1 domínio, 6 posts e 14 imagens;
- final: 2 novos usuários convidados, 2 papéis admin, 6 posts e 14 imagens com ownership restaurado, portal ainda sem workspaces.

## Primeiro uso

- Abra o link recebido, clique em **Continuar para definir senha** em `/auth/confirm` e defina a senha em `/auth/set-password`.
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

- Testar link ausente, tipo inválido, token expirado e clique repetido em `/auth/confirm`.
- Confirmar que um GET em `/auth/confirm` não consome o token; somente o botão chama `verifyOtp`.
- Testar login admin, recuperação de senha e `/auth/set-password`.
- Testar Supabase vazio sem dados de demo.
- Testar cadastro do workspace BVBP.
- Testar criação/edição de cliente, contatos, convite, reenvio e desativação.
- Testar cliente acessando apenas o próprio workspace.
- Testar mobile em 390px.
