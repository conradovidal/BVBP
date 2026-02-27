

## Revisao de Consistencia: Duracoes e Nomes dos Servicos

### Referencia (fonte de verdade: Home + Comparativo + ServiceNavigation)

| Servico | Duracao correta | Nome correto |
|---------|----------------|--------------|
| Diagnostico Operacional | 1 semana | Diagnostico Operacional |
| Otimizacao de Processo | 2 semanas | Otimizacao de Processo |
| Gestao de Projetos | 3-4 semanas | Configuracao de Gestao e Entrega de Projetos |
| Governanca | Mensal | Implementacao de Governanca de Execucao |
| Programa Customizado | 6 a 12 semanas | Programa Customizado de Melhoria |

---

### Inconsistencias encontradas

#### 1. `src/components/ServicesSection.tsx` (usada na LandingPage)
- **Governanca**: duracao diz "2 semanas" -- deveria ser "Mensal"
- **Governanca**: titulo diz "Configuracao de Governanca de Execucao" -- deveria ser "Implementacao de Governanca de Execucao"

#### 2. `src/pages/DiagnosticoOperacionalPage.tsx`
- **Hero badge**: diz "10-15 dias" -- deveria ser "1 semana"
- **Card de prazo**: diz "10-15 dias" -- deveria ser "1 semana"
- **Meta description**: menciona "plano de 2 semanas" (isso se refere ao plano de acao entregue, nao a duracao do servico -- OK, manter)

#### 3. `src/components/calculator/CalculatorContactSection.tsx`
- **Diagnostico**: duracao diz "2-3 semanas" -- deveria ser "1 semana"
- **Otimizacao**: nome diz "Sprint de Otimizacao de Processo" -- deveria ser "Otimizacao de Processo"
- **Otimizacao**: duracao diz "4-6 semanas" -- deveria ser "2 semanas"
- **Programa**: duracao diz "Sob demanda" -- deveria ser "6 a 12 semanas"

#### 4. Paginas consistentes (sem alteracao necessaria)
- `GestaoProjetosPage.tsx`: 3-4 semanas -- OK
- `RetainerGovernancaPage.tsx`: Mensal -- OK
- `SprintOtimizacaoPage.tsx`: 2 semanas -- OK
- `ProgramaCustomizadoPage.tsx`: 6 a 12 semanas -- OK
- `ComparativoServicosPage.tsx`: todas corretas -- OK
- `ServiceNavigation.tsx`: todas corretas -- OK
- `Index.tsx`: todas corretas -- OK

---

### Arquivos a modificar

| Arquivo | Alteracoes |
|---------|-----------|
| `src/components/ServicesSection.tsx` | Governanca: duracao "2 semanas" para "Mensal", titulo para "Implementacao de Governanca de Execucao" |
| `src/pages/DiagnosticoOperacionalPage.tsx` | Hero e card de prazo: "10-15 dias" para "1 semana" (2 locais) |
| `src/components/calculator/CalculatorContactSection.tsx` | Corrigir nome e duracao dos 3 servicos listados |

### Total: 3 arquivos, 7 correcoes pontuais

