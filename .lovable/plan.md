

## Refinamentos do Blog Editor e Layout

### 1. Editor WYSIWYG no Admin

Substituir o `<Textarea>` de HTML por um editor rich text. Usar a biblioteca **ReactQuill** (react-quill-new, compativel com React 18) — leve, popular, toolbar configuravel. O editor produz HTML diretamente, entao nao precisa mudar o banco nem o componente de renderizacao (`BlogPostContent` ja usa `dangerouslySetInnerHTML`).

**Toolbar**: headings (H1-H3), bold, italic, underline, listas, links, blockquote, imagem inline, alinhamento de texto.

**Arquivo**: `src/pages/AdminBlogEditorPage.tsx` — trocar o Textarea de conteudo pelo ReactQuill.

### 2. Posicionamento/centralizacao da imagem de capa

Adicionar um campo `cover_image_position` no editor (select com opcoes: `left`, `center`, `right`) que controla o `object-position` da imagem. Salvar como campo extra no banco.

**Alteracoes**:
- **Migration SQL**: adicionar coluna `cover_image_position` (text, default 'center') na tabela `blog_posts`
- **`AdminBlogEditorPage.tsx`**: adicionar Select para posicao da imagem
- **`BlogCard.tsx`**: usar `object-position` dinamico na imagem
- **`BlogPostPage.tsx`**: idem

### 3. Tags movidas para baixo

**`BlogCard.tsx`**: mover o bloco de tags para depois do excerpt/data (final do card).

**`BlogPostPage.tsx`**: mover as tags para depois do conteudo do artigo (final da pagina, antes do footer).

### Resumo de arquivos

| Arquivo | Alteracao |
|---------|----------|
| Nova dependencia | `react-quill-new` |
| Migration SQL | Adicionar `cover_image_position` |
| `src/pages/AdminBlogEditorPage.tsx` | ReactQuill + select posicao imagem |
| `src/components/blog/BlogCard.tsx` | Tags movidas para baixo + object-position dinamico |
| `src/pages/BlogPostPage.tsx` | Tags movidas para final + object-position dinamico |
| `src/integrations/supabase/types.ts` | Atualizar tipo blog_posts |

