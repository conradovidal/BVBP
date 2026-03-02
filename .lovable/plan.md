

## Otimizacao para Answer Engine Optimization (AEO)

O objetivo e fazer o site da BVBP aparecer como resposta citada em plataformas de IA (ChatGPT, Gemini, Perplexity, Copilot) quando alguem perguntar sobre consultoria de processos, otimizacao operacional ou problemas de gestao para SMBs no Brasil.

---

### O que e AEO e por que importa

Diferente do SEO tradicional (rankear no Google), AEO foca em estruturar o conteudo para que IAs consigam extrair respostas claras e citar sua pagina como fonte. As IAs priorizam:
- Conteudo em formato pergunta-resposta
- Dados estruturados (Schema.org)
- Textos claros e factuais (sem jargao vago)
- Autoridade e E-E-A-T (experiencia, expertise, autoridade, confiabilidade)

---

### Alteracoes planejadas

#### 1. Schema.org estruturado rico (index.html + Helmet em cada pagina)

**index.html** - Expandir o JSON-LD existente:
- Adicionar `FAQPage` schema com as 8 perguntas do FAQ da home
- Adicionar `Organization` schema com founders como `member` (nome, cargo, LinkedIn)
- Adicionar `Service` schema para cada um dos 5 servicos (nome, descricao, preco, duracao)
- Adicionar `Speakable` schema no bloco principal (permite assistentes de voz citarem o conteudo)

**Cada pagina de servico** (via Helmet) - Adicionar JSON-LD inline:
- `Service` schema especifico com nome canonico, duracao, preco, descricao
- `FAQPage` schema com as FAQs da pagina (Diagnostico, Sprint, etc. ja tem FAQs proprias)
- `BreadcrumbList` schema (Home > Servicos > Nome do Servico) para navegacao estruturada

**Calculadora** - Adicionar:
- `WebApplication` schema (tipo: calculadora, descricao, preco: gratuito)

#### 2. Conteudo otimizado para extracao por IA (Index.tsx)

Adicionar uma secao "O que fazemos" logo apos o hero com texto corrido (nao so bullets) que responda diretamente as perguntas mais comuns:
- "O que e a BVBP?" (1 paragrafo claro e factual)
- "Quais servicos a BVBP oferece?" (lista com nomes canonicos e duracoes)
- "Quanto custa uma consultoria de processos?" (faixa de preco transparente)
- "Onde a BVBP atende?" (Brasil inteiro, presencial e remoto)

Este bloco sera visualmente discreto (texto limpo, sem cards excessivos) mas rico em conteudo semantico. Formato: `<article>` com `<h2>` e `<p>` simples.

#### 3. Meta tags otimizadas para citacao (todas as paginas)

Cada pagina recebera via Helmet:
- `<meta name="robots" content="max-snippet:-1, max-image-preview:large">` (permite snippets longos)
- `<link rel="canonical">` com URL definitiva

#### 4. robots.txt - Liberar crawlers de IA

Atualizar `public/robots.txt` para permitir explicitamente os crawlers de IA:

```text
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: *
Allow: /

Sitemap: https://bvbp.com.br/sitemap.xml
```

#### 5. Sitemap XML (novo arquivo)

Criar `public/sitemap.xml` listando todas as paginas com prioridades:
- `/` (prioridade 1.0)
- `/calculadora-roi` (0.8)
- Cada pagina de servico (0.9)
- `/comparativo-servicos` (0.7)

---

### Resumo de arquivos

| Arquivo | Alteracao |
|---------|----------|
| `index.html` | Expandir JSON-LD: FAQPage, Organization com founders, Service array, Speakable |
| `src/pages/Index.tsx` | Adicionar secao "O que fazemos" com conteudo AEO + meta robots no Helmet |
| `src/pages/DiagnosticoOperacionalPage.tsx` | JSON-LD Service + FAQPage + BreadcrumbList via Helmet |
| `src/pages/SprintOtimizacaoPage.tsx` | Idem |
| `src/pages/GestaoProjetosPage.tsx` | Idem |
| `src/pages/RetainerGovernancaPage.tsx` | Idem |
| `src/pages/ProgramaCustomizadoPage.tsx` | Idem |
| `src/pages/CalculatorPage.tsx` | JSON-LD WebApplication via Helmet |
| `src/pages/ComparativoServicosPage.tsx` | JSON-LD BreadcrumbList via Helmet |
| `public/robots.txt` | Adicionar crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, etc.) |
| `public/sitemap.xml` | Novo arquivo com mapa do site |

**Total: 11 arquivos, sendo 1 novo (sitemap.xml)**

