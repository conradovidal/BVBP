

## Plano: Padronizar Formularios + Notificacao por Email

### Problema Atual

- **5 paginas com formulario simulado** (setTimeout, sem salvar dados):
  - `Index.tsx`
  - `DiagnosticoOperacionalPage.tsx`
  - `SprintOtimizacaoPage.tsx`
  - `GestaoProjetosPage.tsx`
  - `RetainerGovernancaPage.tsx`
  - `ComparativoServicosPage.tsx`
- **2 paginas ja integradas** ao Supabase:
  - `ProgramaCustomizadoPage.tsx`
  - `CalculatorContactSection.tsx`
- **Nenhuma notificacao por email** quando um lead chega

---

### O que sera feito

#### 1. Padronizar os 6 formularios simulados

Em cada uma das 6 paginas listadas acima:
- Adicionar imports do `supabase` client e `validateLeadData`
- Substituir o `setTimeout` simulado por logica real:
  1. Validar dados com `validateLeadData`
  2. Inserir na tabela `leads` via `supabase.from('leads').insert()`
  3. Apos sucesso, chamar a edge function de notificacao
  4. Mostrar toast de sucesso/erro
- Adicionar campos `source` (nome da pagina) e `page_url` (URL atual) em cada submissao

#### 2. Criar Edge Function `notify-new-lead`

**Arquivo:** `supabase/functions/notify-new-lead/index.ts`

- Recebe os dados do lead via POST (nome, email, empresa, interesse, etc.)
- Envia email de notificacao para os 3 destinatarios:
  - `basso.vidal.bp@gmail.com`
  - `conrado@bvbp.com.br`
  - `cristiano@bvbp.com.br`
- Usa a API do Resend para envio de emails
- Inclui CORS headers para chamadas do frontend
- Email formatado em HTML com os dados do lead

**Configuracao necessaria:**
- Sera necessario adicionar um secret `RESEND_API_KEY` no projeto
- Voce precisara criar uma conta gratuita no [Resend](https://resend.com) e gerar uma API key
- O plano gratuito do Resend permite 100 emails/dia, suficiente para notificacoes de leads

#### 3. Atualizar `supabase/config.toml`

Adicionar configuracao da edge function com `verify_jwt = false` (a funcao sera chamada apos insert publico, sem autenticacao).

#### 4. Integrar chamada da edge function nos formularios

Apos o insert bem-sucedido na tabela `leads`, cada formulario chamara:

```typescript
supabase.functions.invoke('notify-new-lead', {
  body: { name, email, company, interest, source, challenge }
})
```

A chamada sera fire-and-forget (nao bloqueara o feedback ao usuario).

---

### Arquivos a criar

| Arquivo | Descricao |
|---------|-----------|
| `supabase/functions/notify-new-lead/index.ts` | Edge function de notificacao |

### Arquivos a modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Index.tsx` | Integrar com Supabase + notificacao |
| `src/pages/DiagnosticoOperacionalPage.tsx` | Integrar com Supabase + notificacao |
| `src/pages/SprintOtimizacaoPage.tsx` | Integrar com Supabase + notificacao |
| `src/pages/GestaoProjetosPage.tsx` | Integrar com Supabase + notificacao |
| `src/pages/RetainerGovernancaPage.tsx` | Integrar com Supabase + notificacao |
| `src/pages/ComparativoServicosPage.tsx` | Integrar com Supabase + notificacao |
| `src/pages/ProgramaCustomizadoPage.tsx` | Adicionar chamada de notificacao |
| `src/components/calculator/CalculatorContactSection.tsx` | Adicionar chamada de notificacao |
| `supabase/config.toml` | Adicionar config da edge function |

### Prerequisito

Antes de implementar, sera necessario configurar o secret `RESEND_API_KEY` no projeto. Eu solicitarei a chave durante a implementacao.

