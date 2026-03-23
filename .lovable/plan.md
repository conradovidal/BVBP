
Objetivo: eliminar definitivamente a quebra de palavras no meio no conteúdo dos posts, fazendo a palavra inteira “escorregar” para a próxima linha.

1) Corrigir a causa raiz no conteúdo (NBSP)
- Arquivo: `src/components/blog/BlogPostContent.tsx`
- Antes de renderizar, normalizar o HTML do post trocando espaços não separáveis por espaços normais:
  - `&nbsp;`
  - `&#160;`
  - `\u00A0`
- Isso remove o comportamento de “palavra colada” que força quebra feia no meio quando o navegador tenta encaixar o texto.

2) Ajustar tipografia para modo “nunca quebrar no meio”
- Arquivo: `src/components/blog/BlogPostContent.tsx`
- Atualizar classes do container `prose` para política estrita de quebra:
  - remover fallback agressivo atual (`[overflow-wrap:anywhere]` e hifenização automática)
  - aplicar:
    - `[word-break:normal]`
    - `[overflow-wrap:normal]`
    - `[hyphens:none]`
    - manter `[text-wrap:pretty]` para acabamento visual
- Aplicar override explícito em parágrafos/listas/headings (`prose-p`, `prose-li`, `prose-headings`) para garantir consistência total.

3) Prevenir reincidência em novos artigos
- Arquivo: `src/pages/AdminBlogEditorPage.tsx`
- Na rotina de salvar/publicar (`handleSave`), normalizar `content` com a mesma função antes de enviar ao Supabase.
- Opcional complementar: normalizar também ao carregar post para edição, para “limpar” artigos antigos ao serem re-salvos.

4) Validação de qualidade (fim a fim)
- Verificar no post atual (`/blog/planejamento-de-2026-arquivado-em-março`) e no segundo post publicado.
- Testar desktop + mobile para confirmar:
  - nenhuma palavra comum quebrando no meio
  - fluidez visual consistente
  - sem regressão em títulos, listas, links e bloco de compartilhamento.

Detalhes técnicos
- Problema atual: conteúdo vindo com `&nbsp;` + regras de wrap permissivas (`anywhere`) => o navegador perde pontos de quebra naturais e acaba fragmentando palavras.
- Estratégia: normalizar o conteúdo + forçar regras tipográficas conservadoras (`word-break/overflow-wrap/hyphens`) para comportamento editorial profissional e previsível.
- Escopo de alteração: 2 arquivos (`BlogPostContent.tsx`, `AdminBlogEditorPage.tsx`), sem mudança de schema no banco.

Critérios de aceite
- Zero palavras quebradas no meio em texto corrido.
- Quebra de linha sempre em fronteira natural entre palavras.
- Novos posts já entram normalizados, sem voltar o problema.
