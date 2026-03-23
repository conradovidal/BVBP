

## Corrigir tipografia do blog post

### Problema
O texto do blog está quebrando palavras de forma irregular no final das linhas (ex: "p rojetos", "estraté gicos", "cla reza"), criando uma aparência não profissional. Isso é causado pela classe `break-words` que força quebra de palavras em qualquer ponto.

### Solução

**`src/components/blog/BlogPostContent.tsx`**:
- Remover `break-words` (causa quebras no meio de palavras)
- Adicionar `overflow-wrap: anywhere` apenas como fallback para URLs longas, não para texto normal
- Adicionar `hyphens: auto` com `lang="pt-BR"` para hifenização correta em português
- Adicionar `text-pretty` (Tailwind v3.4+) ou `text-wrap: pretty` para balanceamento de linhas mais elegante nos parágrafos

Alterações na classe do container:
- Trocar `break-words` por `[overflow-wrap:anywhere]` (só quebra quando necessário, não proativamente)
- Adicionar `[hyphens:auto]` + atributo `lang="pt-BR"` no elemento para hifenização inteligente
- Adicionar `[text-wrap:pretty]` para distribuição mais equilibrada do texto nas linhas

1 arquivo, mudanças mínimas de classes CSS.

