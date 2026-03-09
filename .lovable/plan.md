

## Correção: Formatação HTML nos posts do blog

### Problema
O plugin `@tailwindcss/typography` está instalado como dependência (`package.json`), mas **não está registrado** no array `plugins` do `tailwind.config.ts`. Sem isso, as classes `prose`, `prose-lg`, `prose-headings:*`, etc. não geram nenhum CSS — o texto é renderizado sem formatação.

### Correção

**`tailwind.config.ts`** (linha 127):
- Adicionar `require("@tailwindcss/typography")` ao array de plugins, junto com o `tailwindcss-animate` já existente.

```ts
plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
```

**1 linha alterada, 1 arquivo.**

