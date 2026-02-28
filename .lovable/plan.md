

## Menu "Servicos" com destaque ativo e submenu hover

### Problema atual
Quando o usuario esta em uma pagina de servico (ex: `/diagnostico-operacional`), o menu nao destaca nenhum item. Alem disso, nao existe submenu para navegar entre servicos diretamente pelo header.

### Solucao

#### 1. Detectar pagina de servico e destacar "Servicos"

No `Header.tsx`, identificar se a rota atual corresponde a uma pagina de servico. Se sim, forcar `activeTab` para o indice de "Servicos" (indice 1).

Rotas de servico: `/diagnostico-operacional`, `/sprint-otimizacao`, `/gestao-projetos`, `/retainer-governanca`, `/programa-customizado`, `/comparativo-servicos`.

#### 2. Submenu hover no item "Servicos" (desktop)

Substituir o componente `<Tabs>` no Header por uma navegacao customizada que replica o mesmo estilo visual (underline animada, hover highlight) mas adiciona suporte a dropdown no item "Servicos".

O dropdown sera:
- Ativado por hover (mouseEnter/mouseLeave com pequeno delay para evitar flickering)
- Estilo minimalista: fundo branco, sombra suave, sem bordas pesadas
- Lista dos 5 servicos principais + link "Comparar Servicos"
- Cada item mostra titulo curto e duracao
- Destaque visual no servico atual (se estiver em uma pagina de servico)
- Animacao de entrada suave (fade-in + slight translate-y)

Lista de servicos no dropdown:
| Titulo curto | Rota | Duracao |
|---|---|---|
| Diagnostico Operacional | /diagnostico-operacional | 1 semana |
| Otimizacao de Processo | /sprint-otimizacao | 2 semanas |
| Gestao de Projetos | /gestao-projetos | 3-4 semanas |
| Governanca de Execucao | /retainer-governanca | Mensal |
| Programa Customizado | /programa-customizado | 6-12 semanas |
| Comparar Servicos | /comparativo-servicos | - |

#### 3. Menu mobile - submenu em accordion

No menu mobile, o item "Servicos" tera um sub-nivel expandivel (clique para abrir/fechar) mostrando os mesmos links de servico antes dos botoes CTA.

### Arquivos a modificar

| Arquivo | Alteracao |
|---------|----------|
| `src/components/Header.tsx` | Logica de deteccao de pagina de servico, navegacao desktop customizada com dropdown, menu mobile com sub-items |

O componente `vercel-tabs.tsx` nao sera alterado (continua disponivel para outros usos). A navegacao do Header passara a ser construida diretamente com elementos customizados que replicam o estilo visual mas com suporte a dropdown.

### Detalhes tecnicos

- Dropdown implementado com CSS/estado React puro (sem biblioteca extra)
- `onMouseEnter`/`onMouseLeave` com `setTimeout` de ~150ms para evitar fechamento acidental
- Dropdown posicionado com `absolute` abaixo do item "Servicos"
- Transicao: `opacity` + `translateY(4px)` com `duration-200`
- Z-index adequado (z-50 ja existe no header)
- `useNavigate` para navegacao SPA nos links do dropdown

