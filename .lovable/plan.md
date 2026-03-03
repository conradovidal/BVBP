

## Blog com Painel Admin

### Visao geral

Criar um sistema de blog completo: pagina publica para leitores, painel administrativo protegido por login para publicacao, e botao "Blog" no header ao lado de "Calculadora ROI".

---

### 1. Banco de dados (Supabase migrations)

**Tabela `blog_posts`**:
- `id` (uuid, PK)
- `title` (text, NOT NULL)
- `slug` (text, UNIQUE, NOT NULL) — URL amigavel
- `excerpt` (text) — resumo para listagem
- `content` (text, NOT NULL) — conteudo completo em markdown/HTML
- `cover_image_url` (text) — imagem de capa
- `author_id` (uuid, FK auth.users)
- `status` (text, default 'draft') — 'draft' ou 'published'
- `published_at` (timestamptz)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())
- `meta_description` (text) — SEO/AEO
- `tags` (text[]) — categorias

**Tabela `user_roles`** (seguranca):
- `id` (uuid, PK)
- `user_id` (uuid, FK auth.users, ON DELETE CASCADE)
- `role` (app_role enum: 'admin', 'editor')
- UNIQUE(user_id, role)

**Funcao `has_role`** (SECURITY DEFINER):
- Verifica se usuario tem determinado role sem recursao RLS

**RLS policies**:
- `blog_posts` SELECT: qualquer pessoa pode ler posts com `status = 'published'`
- `blog_posts` INSERT/UPDATE/DELETE: apenas usuarios com role 'admin' ou 'editor' (via `has_role`)
- `user_roles` SELECT: apenas o proprio usuario ou admins

**Storage bucket** `blog-images`: para upload de imagens de capa

### 2. Paginas e componentes

| Arquivo | Descricao |
|---------|-----------|
| `src/pages/BlogPage.tsx` | Listagem publica de posts (grid de cards com titulo, excerpt, imagem, data) |
| `src/pages/BlogPostPage.tsx` | Post individual com conteudo completo, meta tags AEO |
| `src/pages/AdminLoginPage.tsx` | Tela de login simples (email + senha via Supabase Auth) |
| `src/pages/AdminBlogPage.tsx` | Dashboard: lista de posts (draft/published), botao criar novo |
| `src/pages/AdminBlogEditorPage.tsx` | Editor de post: titulo, slug (auto-gerado), excerpt, conteudo (textarea), imagem, tags, status, botao publicar |
| `src/components/blog/BlogCard.tsx` | Card individual para listagem |
| `src/components/blog/BlogPostContent.tsx` | Renderizacao do conteudo do post |
| `src/components/admin/AdminLayout.tsx` | Layout com sidebar simples e protecao de rota (redirect se nao autenticado/sem role) |
| `src/components/admin/AdminGuard.tsx` | HOC que verifica autenticacao + role antes de renderizar |

### 3. Header — botao "Blog"

No `Header.tsx`, adicionar botao "Blog" ao lado esquerdo de "Calculadora ROI", usando `variant="outline"` e `size="lg"` (mesmo formato). Aponta para `/blog`.

### 4. Rotas (App.tsx)

Novas rotas:
- `/blog` — listagem publica
- `/blog/:slug` — post individual
- `/admin/login` — login do admin
- `/admin/blog` — dashboard de posts (protegida)
- `/admin/blog/novo` — editor novo post (protegida)
- `/admin/blog/editar/:id` — editor post existente (protegida)

### 5. Fluxo de gestao de publicacao

1. Admin acessa `/admin/login`, faz login com email/senha
2. Sistema verifica se usuario tem role 'admin' ou 'editor' na tabela `user_roles`
3. Se autorizado, acessa dashboard com lista de posts
4. Pode criar novo post (salva como draft), editar, e publicar (muda status para 'published' + seta `published_at`)
5. Posts publicados aparecem automaticamente em `/blog`

Para adicionar o primeiro admin: inserir manualmente na tabela `user_roles` via Supabase Dashboard apos criar a conta.

### 6. AEO para blog

Cada post tera via Helmet:
- `Article` schema JSON-LD (autor, data, descricao)
- `BreadcrumbList` (Home > Blog > Titulo)
- Meta tags otimizadas

### Arquivos a criar/modificar

| Arquivo | Acao |
|---------|------|
| Migration SQL | Criar tabelas, enum, funcao, RLS, bucket |
| `src/pages/BlogPage.tsx` | Novo |
| `src/pages/BlogPostPage.tsx` | Novo |
| `src/pages/AdminLoginPage.tsx` | Novo |
| `src/pages/AdminBlogPage.tsx` | Novo |
| `src/pages/AdminBlogEditorPage.tsx` | Novo |
| `src/components/blog/BlogCard.tsx` | Novo |
| `src/components/admin/AdminGuard.tsx` | Novo |
| `src/components/Header.tsx` | Adicionar botao Blog |
| `src/App.tsx` | Adicionar rotas |
| `public/sitemap.xml` | Adicionar `/blog` |

**Total: 1 migration + 8 arquivos novos + 3 modificados**

