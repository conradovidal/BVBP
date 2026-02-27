

## Revisao SEO e Consistencia de Nomenclatura

### Problemas encontrados

Alem das meta descriptions, encontrei referencias antigas a "Sprint" e "Configuracao de Governanca" espalhadas pelos formularios e textos das paginas de servico.

---

### 1. Meta descriptions a corrigir

| Pagina | Problema | Correcao |
|--------|----------|----------|
| `CalculatorPage.tsx` (L25) | Menciona "Relatorio personalizado gratuito" (nao existe) | "Calcule quanto sua empresa esta perdendo mensalmente com processos ineficientes. Resultados instantaneos em 3 minutos." |
| `ComparativoServicosPage.tsx` (L259) | Menciona "Sprint" | Trocar "Sprint" por "Otimizacao" |
| `DiagnosticoOperacionalPage.tsx` (L162) | OK - consistente | Nenhuma alteracao |
| `SprintOtimizacaoPage.tsx` (L163) | OK - consistente | Nenhuma alteracao |
| `GestaoProjetosPage.tsx` (L200) | OK - consistente | Nenhuma alteracao |
| `RetainerGovernancaPage.tsx` (L199) | OK - consistente | Nenhuma alteracao |
| `ProgramaCustomizadoPage.tsx` (L81) | OK - consistente | Nenhuma alteracao |

---

### 2. Select dropdowns nos formularios (nomenclatura antiga)

Tres paginas usam "Sprint de Otimizacao de Processo" e "Configuracao de Governanca de Execucao" nos selects:

| Arquivo | Correcoes no Select |
|---------|---------------------|
| `DiagnosticoOperacionalPage.tsx` (L589-591) | "Sprint de Otimizacao de Processo" -> "Otimizacao de Processo"; "Configuracao de Governanca" -> "Implementacao de Governanca" |
| `SprintOtimizacaoPage.tsx` (L590-592) | Idem |
| `GestaoProjetosPage.tsx` (L579-581) | Idem |
| `RetainerGovernancaPage.tsx` (L582-583) | "Sprint de Otimizacao de Processo" -> "Otimizacao de Processo" (Governanca ja esta OK neste) |
| `ProgramaCustomizadoPage.tsx` (L519) | "Sprint de Otimizacao" -> "Otimizacao de Processo" |

---

### 3. Textos no corpo das paginas

| Arquivo | Linha | Problema | Correcao |
|---------|-------|----------|----------|
| `DiagnosticoOperacionalPage.tsx` | L416 | "sprint de otimizacao" em texto descritivo | "uma Otimizacao de Processo" |
| `GestaoProjetosPage.tsx` | L308 | "Sprint de Otimizacao" em texto | "a Otimizacao de Processo" |
| `ProgramaCustomizadoPage.tsx` | L161 | "Diagnostico ou Sprint" | "Diagnostico ou Otimizacao" |
| `ProgramaCustomizadoPage.tsx` | L402 | "Sprints de Otimizacao adicionais" | "Otimizacoes de Processo adicionais" |

---

### Resumo

| Arquivo | Qtd alteracoes |
|---------|---------------|
| `CalculatorPage.tsx` | 1 (meta description) |
| `ComparativoServicosPage.tsx` | 1 (meta description) |
| `DiagnosticoOperacionalPage.tsx` | 3 (texto + 2 selects) |
| `SprintOtimizacaoPage.tsx` | 2 (2 selects) |
| `GestaoProjetosPage.tsx` | 3 (texto + 2 selects) |
| `RetainerGovernancaPage.tsx` | 1 (1 select) |
| `ProgramaCustomizadoPage.tsx` | 3 (texto x2 + 1 select) |

**Total: 7 arquivos, 14 correcoes pontuais**

