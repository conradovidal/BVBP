

## Corrigir FAQ da Calculadora

### Problema

Tres perguntas da FAQ fazem referencia a "envio de relatorio por email", funcionalidade que nao existe. Isso cria expectativa falsa no usuario.

**Trechos problematicos:**

1. **"Os dados sao confidenciais?"** - menciona "gerar seu relatorio personalizado"
2. **"Vao me bombardear com ligacoes?"** - menciona "Enviamos apenas o relatorio prometido"
3. **"Quanto tempo leva para receber o relatorio?"** - inteiramente sobre envio de relatorio por email, incluindo "enviado por email imediatamente" e "verifique sua caixa de spam"

### Solucao

Reescrever as 3 respostas para refletir o funcionamento real: a calculadora mostra os resultados na tela instantaneamente, e o usuario pode solicitar contato para aprofundar a analise.

| FAQ | Texto corrigido |
|-----|-----------------|
| "Os dados sao confidenciais?" | Remover referencia a "relatorio personalizado", focar em seguranca dos dados inseridos na calculadora |
| "Vao me bombardear com ligacoes?" | Remover "relatorio prometido", manter foco em respeito ao usuario e contato apenas se solicitado |
| "Quanto tempo leva para receber o relatorio?" | Reformular para "Os resultados sao instantaneos?" explicando que os calculos aparecem na tela em tempo real |

### Arquivo modificado

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/calculator/CalculatorFAQ.tsx` | Corrigir textos das 3 FAQs (linhas 7, 10, 21-22) |

