

## Correções no Blog Post

### Problema
O `BlogPostContent` usa `prose prose-lg max-w-none`, que remove o limite de largura do prose. Combinado com o container `max-w-3xl`, o texto renderizado pelo Quill (que gera `<p>` sem quebras adequadas) pode extrapolar visualmente.

### Alterações

**1. `src/components/blog/BlogPostContent.tsx`**
- Trocar `max-w-none` por `max-w-prose` (limite natural do Tailwind prose ~65ch) ou remover completamente (o default do prose já limita)
- Adicionar `break-words` para garantir que textos longos quebrem

**2. `src/pages/BlogPostPage.tsx`**
- Remover `style={{ objectPosition }}` da imagem de capa — usar apenas `object-cover object-center` fixo

**3. `src/pages/AdminBlogEditorPage.tsx`**
- Remover o Select de posição da imagem (cover_image_position)

**4. Dimensões recomendadas para imagem de capa**
O container tem `max-w-3xl` (768px) e a imagem usa `aspect-video` (16:9). Dimensão ideal: **1200 x 675px** (cabe perfeitamente, boa resolução em retina).

### Arquivos

| Arquivo | Alteração |
|---------|----------|
| `src/components/blog/BlogPostContent.tsx` | `max-w-none` → remover (usar default do prose) + `break-words` |
| `src/pages/BlogPostPage.tsx` | Remover `objectPosition` dinâmico da imagem |
| `src/pages/AdminBlogEditorPage.tsx` | Remover bloco do Select de posição da imagem |

