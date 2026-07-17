# Templates transacionais do Portal BVBP

Templates HTML standalone para o Supabase Auth. Use as versões legíveis para manutenção e para copiar no painel. As versões `*.min.html` devem ser regeneradas a partir das legíveis sempre que houver alteração.

Os templates de convite e recuperação fazem parte do fluxo seguro de primeiro acesso. Publique o frontend com `/auth/confirm` antes de alterar esses dois templates no Supabase.

## Templates e assuntos

| Evento | Assunto | HTML legível | HTML minificado |
| --- | --- | --- | --- |
| Confirm sign up | `Confirme seu email no Portal BVBP` | `confirm-sign-up.html` | — |
| Invite user | `Seu acesso ao Portal BVBP foi liberado` | `invite-user.html` | `invite-user.min.html` |
| Magic link or OTP | `Seu acesso ao Portal BVBP` | `magic-link-or-otp.html` | — |
| Change email address | `Confirme seu novo email no Portal BVBP` | `change-email-address.html` | — |
| Reset password | `Redefina sua senha do Portal BVBP` | `reset-password.html` | `reset-password.min.html` |
| Reauthentication | `{{ .Token }} é seu código de verificação BVBP` | `reauthentication.html` | — |
| Password changed | `Sua senha do Portal BVBP foi alterada` | `password-changed.html` | `password-changed.min.html` |

## Onde colar no Supabase

Em um projeto hospedado, abra **Supabase Dashboard > Authentication > Email Templates**:

1. Em **Confirm sign up**, cole o assunto e o conteúdo de `confirm-sign-up.html`.
2. Em **Invite user**, cole o assunto e o conteúdo de `invite-user.html`.
3. Em **Magic link or OTP**, cole o assunto e o conteúdo de `magic-link-or-otp.html`.
4. Em **Change email address**, cole o assunto e o conteúdo de `change-email-address.html`.
5. Em **Reset password**, cole o assunto e o conteúdo de `reset-password.html`.
6. Em **Reauthentication**, cole o assunto e o conteúdo de `reauthentication.html`.
7. Em **Password changed**, na área de notificações de segurança, habilite a notificação se necessário e cole o assunto e o conteúdo de `password-changed.html`.

Antes de salvar, confira em **Authentication > URL Configuration**:

- **Site URL**: `https://www.bvbp.com.br`;
- **Redirect URLs**: mantenha autorizadas as variantes `https://www.bvbp.com.br/auth/**` e `https://bvbp.com.br/auth/**`, além dos destinos locais ou de preview realmente utilizados.

Em **Authentication > Sign In / Providers > Email**, configure a validade do OTP para `86400` segundos (24 horas), limite recomendado para este fluxo.

## Variáveis utilizadas

| Template | Variáveis |
| --- | --- |
| Confirm sign up | `{{ .ConfirmationURL }}`, `{{ .Email }}` |
| Invite user | `{{ .TokenHash }}`, `{{ .Email }}` |
| Magic link or OTP | `{{ .ConfirmationURL }}`, `{{ .Token }}`, `{{ .Email }}` |
| Change email address | `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .NewEmail }}` |
| Reset password | `{{ .TokenHash }}`, `{{ .Email }}` |
| Reauthentication | `{{ .Token }}`, `{{ .Email }}` |
| Password changed | `{{ .SiteURL }}`, `{{ .Email }}` |

Invite user e Reset password apontam para a página intermediária da BVBP:

- convite: `https://www.bvbp.com.br/auth/confirm?token_hash={{ .TokenHash }}&type=invite`;
- recuperação: `https://www.bvbp.com.br/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`.

O endereço bruto do Supabase não deve aparecer no texto nem no destino do CTA. A página `/auth/confirm` remove o token da barra de endereço e só chama `verifyOtp` depois do clique explícito em **Continuar para definir senha**. Quando o token já foi usado ou expirou, a mesma página permite solicitar uma recuperação sem expor se o email está cadastrado.

## Identidade visual auditada

A implementação segue os tokens presentes em `src/index.css`, `tailwind.config.ts`, nos SVGs de `src/assets/brand/` e no documento `Novos Documentos Direcionadores/BVBP — Design System.pdf`:

- verde institucional: Forest Green `#143B2F`; variante escura `#0E2A22`;
- neutros: canvas `#F7F5F1`, raised `#FBFAF7`, inset `#F2EFE9`, ink `#1A1917`, muted ink `#6F6A62` e border `#DCD8D0`;
- detalhe de marca: Champagne Gold `#C8A96A`, usado apenas como régua superior e detalhe do lockup;
- tipografia equivalente para email: Georgia para títulos, Arial/Helvetica para corpo e Courier New para rótulos; são fallbacks locais para Newsreader, Hanken Grotesk e IBM Plex Mono, sem dependência de webfont;
- estrutura: ritmo de 8px, bordas finas, raio de 8px e espaçamento interno principal de 32–40px, consistente com o portal.

### Logo utilizado

Nenhuma URL externa é utilizada. O símbolo oficial “Signal Field” é reconstruído diretamente no HTML por uma tabela decorativa de 48×48px: fundo Forest Dark `#0E2A22`, três quadrantes Inset `#F2EFE9` e um quadrante Champagne Gold `#C8A96A`.

Essa solução evita dependência de imagens remotas e mantém o símbolo visível no preview do Supabase e em clientes que não exibem SVG. O nome “Basso & Vidal Business Partners” permanece em texto HTML ao lado do símbolo e fornece a identificação acessível da marca.

## Checklist de teste

Envie emails reais de cada evento para contas de teste. Não valide apenas pelo preview do Supabase.

### Gmail

- [ ] Testar Gmail web e aplicativo móvel.
- [ ] Confirmar que assunto, preheader, logo e nome da BVBP aparecem corretamente.
- [ ] Confirmar que o CTA abre o destino esperado e que o link textual é igual ao CTA.
- [ ] Confirmar que o símbolo e o lockup aparecem sem carregar imagens remotas.
- [ ] Confirmar que URLs longas quebram linha sem ampliar o email horizontalmente.

### Outlook / Hotmail

- [ ] Testar Outlook web, Hotmail e, se estiver no escopo dos usuários, Outlook desktop para Windows.
- [ ] Confirmar que o layout de tabelas mantém largura, alinhamento e espaçamentos.
- [ ] Confirmar que o CTA permanece grande e legível mesmo se o `border-radius` for ignorado.
- [ ] Confirmar que os quatro quadrantes e o lockup permanecem alinhados no Outlook.
- [ ] Verificar se o serviço de proteção de links não consumiu o link antes do clique do usuário.

### Mobile e acessibilidade

- [ ] Testar em viewport estreito, modo claro e modo escuro do cliente de email.
- [ ] Confirmar ausência de rolagem horizontal.
- [ ] Confirmar contraste do CTA, texto de 16px no corpo e área de toque confortável.
- [ ] Confirmar leitura correta com zoom de 200%.
- [ ] Confirmar que a marca continua identificada pelo texto do lockup, sem depender do símbolo decorativo.

## Publicação segura e validação

1. Publique o frontend e confirme que `/auth/confirm` está disponível.
2. Publique os templates **Invite user** e **Reset password** no Supabase.
3. Confirme Site URL, allowlist e validade de `86400` segundos (24 horas), com leitura de verificação depois da alteração.
4. No domínio transacional do Resend, mantenha `click_tracking=false` e `open_tracking=false`; a reescrita de URLs pode interferir nos links do Supabase Auth.
5. Abra uma URL de teste de `/auth/confirm` e confirme que nenhum `verifyOtp` ocorre antes do botão.
6. Dispare apenas o destinatário solicitado. Exemplo de recuperação controlada:

   ```json
   {
     "mode": "recover_existing",
     "emails": ["conrado@bvbp.com.br"]
   }
   ```

7. Confirme que o email mostra apenas o endereço seguro da BVBP e não contém `ConfirmationURL` nem URL `supabase.co/auth`.

Nunca envie para Conrado e Cristiano em conjunto por padrão. Cada endereço precisa constar explicitamente em `emails`, e o operador deve comparar os timestamps antes e depois do envio.

O envio para `cristiano@bvbp.com.br` permanece bloqueado operacionalmente até o aceite explícito de Conrado sobre a versão publicada do portal.
