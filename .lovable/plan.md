

## Corrigir remetente + Testar fluxo end-to-end

### Problema encontrado

A edge function `notify-new-lead` ainda usa o remetente de teste do Resend (`onboarding@resend.dev`) na linha 85. Com o dominio `contato.bvbp.com.br` verificado, isso precisa ser atualizado para garantir entrega confiavel.

### Alteracao

**Arquivo:** `supabase/functions/notify-new-lead/index.ts`

- **Linha 85**: Trocar `from: 'BVBP Leads <onboarding@resend.dev>'` por `from: 'BVBP Leads <leads@contato.bvbp.com.br>'`

### Teste end-to-end

Apos o deploy da edge function atualizada, testarei o fluxo completo:

1. Abrir o formulario de contato na pagina inicial
2. Preencher com dados de teste (nome, email, empresa, interesse)
3. Enviar o formulario
4. Verificar toast de sucesso
5. Confirmar que o lead foi salvo na tabela `leads` do Supabase
6. Verificar logs da edge function para confirmar envio de email
7. Reportar resultado

### Resumo

| Arquivo | Alteracao |
|---------|-----------|
| `supabase/functions/notify-new-lead/index.ts` | Atualizar remetente para `leads@contato.bvbp.com.br` |

