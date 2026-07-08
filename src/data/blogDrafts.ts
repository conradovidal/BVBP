export interface BlogDraft {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaDescription: string;
  tags: string;
  status: "Rascunho" | "Revisão" | "Publicado";
  updated: string;
}

export const blogDrafts: BlogDraft[] = [
  {
    id: "indicadores-financeiros-operacao",
    title: "Como conectar indicadores financeiros à operação",
    slug: "como-conectar-indicadores-financeiros-a-operacao",
    excerpt: "Dinheiro e operação precisam aparecer na mesma conversa de decisão.",
    content: "<p>Indicadores financeiros ganham força quando mostram o fluxo operacional que move margem, custo e receita em risco.</p>",
    metaDescription: "Veja como conectar indicadores financeiros à operação para priorizar melhorias com mais clareza.",
    tags: "dinheiro, operação, indicadores",
    status: "Rascunho",
    updated: "Hoje",
  },
  {
    id: "medir-antes-automatizar",
    title: "O que medir antes de automatizar processos",
    slug: "o-que-medir-antes-de-automatizar-processos",
    excerpt: "Automação só faz sentido quando existe ponteiro real para mover.",
    content: "<p>Antes de automatizar, é preciso entender o fluxo afetado, o indicador impactado e a evidência do gargalo.</p>",
    metaDescription: "Entenda o que medir antes de automatizar processos e evitar tecnologia sem impacto real.",
    tags: "automação, tecnologia, operação",
    status: "Revisão",
    updated: "Ontem",
  },
  {
    id: "funil-receita-vazar",
    title: "Funil comercial: onde a receita começa a vazar",
    slug: "funil-comercial-onde-a-receita-comeca-a-vazar",
    excerpt: "Nem todo vazamento aparece no financeiro primeiro.",
    content: "<p>Receita vaza quando origem, etapa, follow-up e capacidade operacional deixam de conversar.</p>",
    metaDescription: "Veja como identificar onde a receita começa a vazar no funil comercial.",
    tags: "funil, receita, comercial",
    status: "Publicado",
    updated: "2 dias",
  },
  {
    id: "ia-sem-hype",
    title: "IA sem hype: quando automatizar faz sentido",
    slug: "ia-sem-hype-quando-automatizar-faz-sentido",
    excerpt: "IA entra depois do diagnóstico, não antes.",
    content: "<p>IA faz sentido quando reduz espera, retrabalho ou falta de visibilidade em um ponteiro do negócio.</p>",
    metaDescription: "Entenda quando IA e automação fazem sentido dentro de um método de performance operacional.",
    tags: "ia, automação, performance",
    status: "Rascunho",
    updated: "3 dias",
  },
  {
    id: "diagnostico-plano-melhoria",
    title: "Como transformar diagnóstico em plano de melhoria",
    slug: "como-transformar-diagnostico-em-plano-de-melhoria",
    excerpt: "Diagnóstico precisa virar hipótese, responsável e ciclo de execução.",
    content: "<p>O plano de melhoria nasce quando cada sinal vira hipótese, impacto estimado, dono, prazo e critério de aprendizagem.</p>",
    metaDescription: "Aprenda a transformar diagnóstico operacional em plano de melhoria priorizado.",
    tags: "diagnóstico, execução, pdca",
    status: "Revisão",
    updated: "4 dias",
  },
];

export function getBlogDraft(draftId: string | undefined) {
  return blogDrafts.find((draft) => draft.id === draftId) || blogDrafts[0];
}
