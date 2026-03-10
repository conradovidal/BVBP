

## Botões de Compartilhar no Blog Post

### O que será feito
Criar um componente `BlogShareButtons` com 4 botões: WhatsApp, LinkedIn, X (Twitter) e Copiar Link. Posicionar após o conteúdo do artigo (antes das tags), com visual discreto e alinhado ao layout existente.

### Componente novo: `src/components/blog/BlogShareButtons.tsx`
- Recebe `title` e `url` como props
- 4 botões inline com ícones SVG customizados (WhatsApp, LinkedIn, X) + ícone Lucide `Link2` para copiar
- WhatsApp: abre `https://wa.me/?text={title} {url}`
- LinkedIn: abre `https://www.linkedin.com/sharing/share-offsite/?url={url}`
- X: abre `https://twitter.com/intent/tweet?text={title}&url={url}`
- Copiar Link: copia URL para clipboard + toast "Link copiado!"
- Links externos abrem em `target="_blank"`
- Estilo: botões circulares com `bg-secondary hover:bg-primary hover:text-white`, transição suave

### Alteração: `src/pages/BlogPostPage.tsx`
- Importar `BlogShareButtons`
- Inserir entre `BlogPostContent` e o bloco de tags
- Passar `title={post.title}` e `url={https://bvbp.com.br/blog/${post.slug}}`

### Arquivos
| Arquivo | Ação |
|---------|------|
| `src/components/blog/BlogShareButtons.tsx` | Criar |
| `src/pages/BlogPostPage.tsx` | Adicionar componente de compartilhar |

