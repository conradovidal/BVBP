

## Refinamento Estetico da Pagina Principal

### Diagnostico visual atual

Apos analisar a pagina em desktop (1920px), identifiquei os seguintes pontos de melhoria:

---

### 1. Hero Section - Espacamento e ritmo

**Problema**: Espaco muito grande entre o titulo e os botoes (gap vazio onde o texto rotativo "some"). Botoes ficam soltos no centro sem contexto visual.

**Correcoes**:
- Reduzir `space-y-12` para `space-y-8` no container principal
- Reduzir `pt-8` dos botoes para `pt-4`
- Adicionar subtitulo/tagline abaixo do titulo rotativo para preencher o espaco e dar contexto ("Organizamos processos para CEOs que estao cansados de apagar incendio")
- Botoes: aumentar levemente o tamanho do texto (`text-xl`) e adicionar `min-w-[320px]` para uniformidade

### 2. Problem Section - Cards e icones

**Problema**: Icone generico (Search) no cabecalho da secao. Cards com muito espaco vazio e checkbox cinza pouco expressivo.

**Correcoes**:
- Trocar icone `Search` por `AlertTriangle` (mais semantico para "problemas")
- Cards: aumentar padding interno de `p-6` para `p-8`
- Icone do card: substituir `Check` por `X` (representando problema, nao solucao) com cor vermelha/laranja no estado default
- No hover, transformar o `X` em `Check` verde (transicao visual de problema para solucao)
- Card "O custo real disso": adicionar borda esquerda verde (`border-l-4 border-bvbp-growth`) para destaque

### 3. Differentiation Section - Iconografia e hierarquia

**Problema**: Icones grandes (w-20 h-20) demais para o conteudo. Titulos e descricoes com tamanhos similares, sem hierarquia clara.

**Correcoes**:
- Reduzir icone container de `w-20 h-20` para `w-16 h-16` e icone interno de `h-10 w-10` para `h-8 w-8`
- Titulo: manter `text-xl` mas adicionar `tracking-tight`
- Descricao: reduzir de tamanho default para `text-sm` para criar contraste com o titulo
- Adicionar `gap-6` entre os cards (atualmente `gap-8`, mais compacto)

### 4. Services Section - Consistencia visual

**Problema**: Cards tem tamanhos muito variados por causa do conteudo. Secao "Detalhes" visualmente descolada dos features. Duracao da "Gestao de Projetos" no `ServicesSection.tsx` diz "2 semanas" (incorreto, deveria ser "3-4 semanas").

**Correcoes**:
- Corrigir duracao da Gestao de Projetos em `ServicesSection.tsx` (L46): "2 semanas" para "3-4 semanas"
- Icone de duracao: aumentar de `h-4 w-4` para `h-4.5 w-4.5` e adicionar `text-bvbp-growth` para destaque
- Badge de duracao: envolver em `bg-muted/50 px-3 py-1 rounded-full` para parecer um chip/tag
- Secao "Detalhes": adicionar `border-t border-gray-100 pt-4` para separacao visual mais clara
- Botao CTA: reduzir de `size="lg"` para `size="default"` para nao dominar o card

### 5. Quem Somos Section - Time e valores

**Problema**: Fotos dos fundadores pequenas (w-48 h-48) para uma secao de destaque. Valores com icones excessivamente grandes. Muito espaco vertical entre missao e time.

**Correcoes**:
- Fotos: aumentar de `w-48 h-48` para `w-56 h-56`
- Cards de time: adicionar `border-t-4 border-bvbp-growth` no topo para destaque
- Valores: reduzir icone de `w-20 h-20` para `w-14 h-14` e interno de `h-10 w-10` para `h-7 w-7`
- Reduzir `mb-20` entre time e valores para `mb-14`
- Titulo "Nosso Time": reduzir `mb-12` para `mb-8`

### 6. Contato Section - Formulario e informacoes

**Problema**: Card "Fale Direto Conosco" (coluna direita) fica muito pequeno e desbalanceado em relacao ao formulario. Muito espaco desperdicado.

**Correcoes**:
- Card direito: adicionar beneficios abaixo dos emails (reutilizar array `benefits` que ja existe mas nao e renderizado)
- Adicionar icone `CheckCircle` verde ao lado de cada beneficio
- Card direito: adicionar `bg-gradient-subtle` e `border-0` para diferenciar visualmente do formulario
- Botao submit: trocar texto todo-caps "QUERO AGENDAR CONVERSA" para "Agendar minha conversa" (menos agressivo, mais conversional)

### 7. Footer - Refinamentos tipograficos

**Problema**: Links de servicos nao apontam para as paginas corretas (apenas Diagnostico tem link proprio, os outros vao para `/#servicos`).

**Correcoes**:
- Corrigir links dos servicos no footer para apontar para as paginas dedicadas (`/sprint-otimizacao`, `/gestao-projetos`, `/retainer-governanca`, `/programa-customizado`)
- Adicionar `text-sm` nos links para hierarquia

### 8. Animacoes - Stagger nos cards

**Problema**: Secoes inteiras aparecem de uma vez so (fade-in unico). Falta stagger nos cards.

**Correcoes**:
- Adicionar delays escalonados nos cards de servicos (`[animation-delay:100ms]`, `200ms`, `300ms`)
- Adicionar delays nos cards de valores e diferenciais
- Problema cards: stagger de `100ms` entre cada card

---

### Resumo de arquivos

| Arquivo | Alteracoes principais |
|---------|----------------------|
| `src/pages/Index.tsx` | Hero spacing, problem icons, diff sizing, team sizing, contact card, animation stagger |
| `src/components/ServicesSection.tsx` | Duracao Gestao (bug), badge duracao, detalhes separator, CTA sizing |
| `src/components/Footer.tsx` | Links corretos para paginas de servico |

### Nota sobre inconsistencia encontrada

Encontrei mais uma inconsistencia de duracao que escapou da revisao anterior: `ServicesSection.tsx` linha 46 mostra "2 semanas" para Gestao de Projetos, deveria ser "3-4 semanas". Sera corrigida junto.

