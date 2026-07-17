import { isDemoDataEnabled } from "@/lib/portalRuntimeConfig";

export type PortalRole = "admin" | "editor" | "client";

export interface PerformanceUser {
  id: string;
  name: string;
  email: string;
  role: PortalRole;
  roleLabel: string;
  companyIds: string[];
}

export const relationshipStatuses = ["Prospect", "Em diagnóstico", "Onboarding", "Ativo", "Pausado", "Encerrado"] as const;

export type ClientRelationshipStatus = (typeof relationshipStatuses)[number];

export type BvbpPillarId = "financial" | "commercial" | "operation" | "technology";

export type ClientMetricUnit = "currency" | "percentage" | "hours" | "count" | "days" | "text";
export type ClientBudgetMethod = "defined" | "revenue_percentage";
export type ClientRevenueRangeId = "up_to_100k" | "100k_300k" | "300k_500k" | "500k_1m" | "1m_3m" | "over_3m" | "not_informed";
export type ClientBudgetRangeId = "up_to_5k" | "5k_10k" | "10k_20k" | "20k_40k" | "40k_80k" | "over_80k" | "undefined";
export type ClientContactAccessLevel = "collaborator" | "viewer";
export type ClientMetricDirection = "higher" | "lower" | "target";
export type ClientRelationshipEventType = "meeting" | "proposal" | "follow_up" | "contract_start" | "note";
export type MaturityLevel = 1 | 2 | 3 | 4 | 5;

export interface ClientContact {
  id: string;
  name: string;
  email: string;
  title?: string;
  accessLevel?: ClientContactAccessLevel;
  isPrimary: boolean;
  accessStatus: "planned" | "invited" | "active" | "disabled";
}

export interface ClientRelationshipEvent {
  id: string;
  type: ClientRelationshipEventType;
  occurredAt: string;
  createdAt: string;
  createdBy: string;
  createdByUserId?: string;
  createdByName?: string;
  notes: string;
}

export interface Company {
  id: string;
  referenceCode?: string;
  name: string;
  segment: string;
  employees: number;
  monthlyRevenue: number;
  recurringRevenue: number;
  monthlyOperationalCost: number;
  description?: string;
  bvbpOwner?: string;
  companySize?: string;
  reportedRevenue?: number;
  revenueRangeId?: ClientRevenueRangeId;
  budgetMethod?: ClientBudgetMethod;
  budgetAmount?: number;
  budgetRangeId?: ClientBudgetRangeId;
  budgetPercentage?: number;
  startDate?: string;
  contactName?: string;
  contactEmail?: string;
  contacts?: ClientContact[];
  relationshipEvents?: ClientRelationshipEvent[];
  status?: ClientRelationshipStatus;
  relationshipStatus?: ClientRelationshipStatus;
}

export function getCompanyRelationshipStatus(company: Pick<Company, "relationshipStatus" | "status">): ClientRelationshipStatus {
  return company.relationshipStatus || company.status || "Ativo";
}

export interface ClientMetricConfig {
  id: string;
  name: string;
  pillar: BvbpPillarId;
  description: string;
  unit: ClientMetricUnit;
  formula: string;
  currentValue?: number;
  valueOrigin?: ClientMetricValueOrigin;
  target?: string;
  benchmark?: string;
  direction?: ClientMetricDirection;
  source?: string;
  owner?: string;
  custom: boolean;
}

export interface ClientPillarConfig {
  pillar: BvbpPillarId;
  completedMaturityCriterionIds: string[];
  selectedMetricIds: string[];
  criticalMetricId?: string;
  pains: string[];
  notes: string;
}

export interface ClientConfiguration {
  schemaVersion: 3;
  companyId: string;
  pillars: ClientPillarConfig[];
  metrics: ClientMetricConfig[];
}

export type ClientMetricValueOrigin = "informed" | "estimated";

export interface MaturityCriterionDefinition {
  id: string;
  label: string;
}

export interface MaturityLevelDefinition {
  level: MaturityLevel;
  name: string;
  description: string;
  criteria: MaturityCriterionDefinition[];
}

export interface PillarMaturityDefinition {
  pillar: BvbpPillarId;
  levels: MaturityLevelDefinition[];
}

export interface PillarMaturityState {
  level: MaturityLevel;
  current: MaturityLevelDefinition;
  next?: MaturityLevelDefinition;
  completedCurrentCriteria: number;
  completedCriteria: number;
  totalCriteria: number;
}

export interface Metric {
  id: string;
  companyId: string;
  name: string;
  value: number;
  unit: "currency" | "percentage" | "count";
  category: "financial" | "operational" | "risk";
  confidenceLevel: string;
}

export interface OverviewPillarHighlight {
  id: "financial" | "commercial" | "operational" | "automation";
  companyId: string;
  pillar: "Financeiro" | "Comercial" | "Operacional" | "Automação";
  metricLabel: string;
  value?: number;
  unit: ClientMetricUnit;
  helper: string;
  dataType: "Real" | "Estimado" | "Interno" | "Mockado";
  source: string;
  description: string;
  metrics: Array<{
    label: string;
    value?: number;
    unit: ClientMetricUnit;
    dataType: "Real" | "Estimado" | "Interno" | "Mockado";
    source: string;
  }>;
}

export interface CompanyPortfolioSignal {
  companyId: string;
  type?: "Cliente" | "Prospect" | "Parceiro" | "Lead interno" | "Workspace interno";
  owner?: string;
  actionLabel?: string;
  criticalPointer: string;
  mappedPotential: number;
  nextAction: string;
  activeCycles: number;
  highRiskProjects: number;
  projectsCount: number;
  revenueAtRisk: number;
  attention: boolean;
}

export interface Project {
  id: string;
  companyId: string;
  name: string;
  owner: string;
  status: "Em andamento" | "Atrasado" | "Planejado";
  value: number;
  deadline: string;
  risk: "Baixo" | "Médio" | "Alto";
  bottleneck: string;
}

export interface InternalPortfolioItem {
  id: string;
  name: string;
  type: "Cliente" | "Prospect" | "Parceiro" | "Lead interno" | "Workspace interno";
  status: "Mapeado" | "Em diagnóstico" | "Proposta enviada" | "Em negociação" | "Ativo" | "Pausado" | "Perdido";
  criticalPointer: string;
  mappedPotential: number;
  nextAction: string;
  owner: string;
  actionLabel: string;
}

export interface BvbpPillar {
  id: string;
  name: string;
  score: number;
  status: "Atenção" | "Em evolução" | "Base inicial";
  description: string;
}

export interface MaturityMapItem extends BvbpPillar {
  currentLevelLabel: string;
  nextLevel: number;
  nextLevelLabel: string;
  currentMeaning: string;
  advancementCriteria: string[];
}

export interface MaturityScore {
  id: string;
  companyId: string;
  dimension: string;
  score: number;
  description: string;
}

export interface OperationalLeak {
  id: string;
  companyId: string;
  name: string;
  affectedFlow: string;
  affectedPointer: string;
  hoursPerMonth: number;
  estimatedCost: number;
  severity: "Alta" | "Média" | "Baixa";
  source: string;
}

export interface Improvement {
  id: string;
  companyId: string;
  title: string;
  affectedPointer: string;
  affectedFlow: string;
  hypothesis: string;
  estimatedImpact: number;
  ease: "Alta" | "Média" | "Baixa";
  owner: string;
  deadline: string;
  pdcaStatus: "Planejar" | "Executar" | "Medir" | "Aprender" | "Padronizar" | "Pausar" | "Fazer agora" | "Em andamento" | "Aguardando" | "Concluído" | "Pausado" | "Pausada" | "Em refinamento" | "Em desenvolvimento" | "Em validação" | "Concluída" | "Descartada" | "Arquivada";
  priorityBucket: "Fazer agora" | "Planejar" | "Monitorar" | "Pausar";
  nextDecision?: string;
}

export const pdcaStatuses = [
  "Em refinamento",
  "Em desenvolvimento",
  "Em validação",
  "Pausada",
  "Concluída",
  "Descartada",
  "Arquivada",
] as const;

export type PdcaStatus = (typeof pdcaStatuses)[number];

export const initiativePriorities = ["Alta", "Média", "Baixa"] as const;

export type InitiativePriority = (typeof initiativePriorities)[number];

export const evidenceTypes = ["Dado", "Reunião", "Cliente", "Entrega", "Aprendizado", "Decisão"] as const;

export type EvidenceType = (typeof evidenceTypes)[number];

export type PdcaActionStatus = "Aberta" | "Em andamento" | "Concluída" | "Bloqueada";

export const bvbpPointerOptions = [
  "Receita mensal",
  "Comercial",
  "Diagnósticos agendados",
  "Propostas enviadas",
  "Taxa de conversão",
  "Conteúdos publicados",
  "Potencial mapeado",
  "Iniciativas ativas",
] as const;

export interface PdcaEvidence {
  id: string;
  date: string;
  description: string;
  type: EvidenceType;
  observedValue?: string;
  note?: string;
}

export interface PdcaLearning {
  id: string;
  date: string;
  description: string;
}

export interface PdcaAction {
  id: string;
  title: string;
  owner: string;
  deadline: string;
  status: PdcaActionStatus;
}

export interface PdcaCycle {
  id: string;
  companyId: string;
  referenceNumber?: number;
  title: string;
  affectedPointer: string;
  affectedFlow?: string;
  hypothesis: string;
  plannedAction: string;
  whyItMatters: string;
  owner: string;
  deadline: string;
  pdcaStatus: PdcaStatus;
  estimatedImpact: number;
  nextDecision: string;
  dataType?: "Mockado" | "Estimado" | "Real";
  startDate?: string;
  endDate?: string;
  baseline?: string;
  target?: string;
  pillarId?: BvbpPillarId;
  painLabel?: string;
  metricId?: string;
  metricNameSnapshot?: string;
  metricUnit?: ClientMetricUnit;
  metricDirection?: ClientMetricDirection;
  metricSourceSnapshot?: string;
  metricValueOrigin?: ClientMetricValueOrigin;
  baselineValue?: number;
  targetValue?: number;
  teamMembers?: string[];
  priority?: InitiativePriority;
  priorityOrder?: number;
  actions?: PdcaAction[];
  evidences: PdcaEvidence[];
  learnings: PdcaLearning[];
}

export interface FunnelMetric {
  id: string;
  name: string;
  value: number;
  unit: "currency" | "percentage" | "count";
  helper: string;
}

export interface FunnelChannel {
  id: string;
  channel: string;
  entry: number;
  conversion: number;
  estimatedRevenue: number;
  status: "Forte" | "Atenção" | "Testar" | "Pausar";
  observation: string;
}

export interface PipelineOpportunity {
  id: string;
  opportunity: string;
  origin: "Networking" | "Indicação" | "LinkedIn" | "Site" | "Conteúdo" | "Parceiro" | "Relação profissional";
  stage: "Mapeado" | "Contato inicial" | "Conversa marcada" | "Diagnóstico" | "Proposta" | "Negociação" | "Fechado" | "Perdido";
  potential: number;
  nextAction: string;
  owner: string;
  status: "Mapeado" | "Em diagnóstico" | "Proposta enviada" | "Em negociação" | "Ativo" | "Pausado" | "Perdido";
}

export interface WeeklySummaryItem {
  label: string;
  value: string;
}

export interface AutomationOpportunity {
  id: string;
  opportunity: string;
  type: "Automação" | "IA" | "Dashboard" | "Banco de dados" | "Landing page" | "Governança documental" | "Aplicação interna";
  affectedProcess: string;
  hoursPerMonth: number;
  estimatedImpact: number;
  complexity: "Baixa" | "Média" | "Alta";
  status: "Mapeada" | "Em desenho" | "Em andamento" | "Validar" | "Pausar";
}

export interface ImpactCycle {
  id: string;
  metric: string;
  baseline: string;
  target90Days: string;
  current: string;
  status: string;
}

export const bvbpPillarLabels: Record<BvbpPillarId, string> = {
  financial: "Finanças",
  commercial: "Comercial",
  operation: "Operação",
  technology: "Tecnologia",
};

export const bvbpPillarIds: BvbpPillarId[] = ["financial", "commercial", "operation", "technology"];

export const clientSegmentOptions = [
  "Serviços profissionais/consultoria",
  "Tecnologia/SaaS",
  "Indústria",
  "Distribuição/atacado",
  "Varejo/E-commerce",
  "Saúde",
  "Educação",
  "Construção/engenharia",
  "Logística/transportes",
  "Serviços financeiros",
  "Agronegócio",
] as const;

export const clientRevenueRanges: Array<{ id: ClientRevenueRangeId; label: string }> = [
  { id: "up_to_100k", label: "Até R$ 100 mil" },
  { id: "100k_300k", label: "R$ 100–300 mil" },
  { id: "300k_500k", label: "R$ 300–500 mil" },
  { id: "500k_1m", label: "R$ 500 mil–1 milhão" },
  { id: "1m_3m", label: "R$ 1–3 milhões" },
  { id: "over_3m", label: "Acima de R$ 3 milhões" },
  { id: "not_informed", label: "Não informado" },
];

export const clientBudgetRanges: Array<{ id: ClientBudgetRangeId; label: string }> = [
  { id: "up_to_5k", label: "Até R$ 5 mil" },
  { id: "5k_10k", label: "R$ 5–10 mil" },
  { id: "10k_20k", label: "R$ 10–20 mil" },
  { id: "20k_40k", label: "R$ 20–40 mil" },
  { id: "40k_80k", label: "R$ 40–80 mil" },
  { id: "over_80k", label: "Acima de R$ 80 mil" },
  { id: "undefined", label: "A definir" },
];

function criterion(id: string, label: string): MaturityCriterionDefinition {
  return { id, label };
}

export const maturityDefinitionsByPillar: Record<BvbpPillarId, PillarMaturityDefinition> = {
  financial: {
    pillar: "financial",
    levels: [
      {
        level: 1,
        name: "Base BVBP",
        description: "O diagnóstico financeiro possui o mínimo de transparência para orientar a primeira decisão.",
        criteria: [
          criterion("financial-1-revenue-cost-source", "O ponteiro principal de Finanças está definido."),
          criterion("financial-1-cash-commitments", "O ponteiro principal possui baseline e fonte."),
          criterion("financial-1-update-owner", "O ponteiro principal possui meta e benchmark."),
        ],
      },
      {
        level: 2,
        name: "Visibilidade financeira",
        description: "A empresa enxerga sua situação atual e começa a conectar números a decisões.",
        criteria: [
          criterion("financial-2-margin-validated", "A margem operacional está calculada e validada."),
          criterion("financial-2-goals-routine", "Metas financeiras são acompanhadas em uma rotina definida."),
          criterion("financial-2-deviation-actions", "Desvios geram ações com responsável e prazo."),
        ],
      },
      {
        level: 3,
        name: "Gestão de resultado",
        description: "Os ponteiros financeiros orientam prioridades, ações e alocação de recursos.",
        criteria: [
          criterion("financial-3-projection-updated", "A projeção de caixa e receita é atualizada regularmente."),
          criterion("financial-3-risk-scenarios", "Riscos e cenários financeiros são avaliados antes das decisões."),
          criterion("financial-3-investment-history", "Decisões de investimento consideram o histórico dos ponteiros."),
        ],
      },
      {
        level: 4,
        name: "Previsibilidade",
        description: "Projeções e realizado são comparados para antecipar riscos e oportunidades.",
        criteria: [
          criterion("financial-4-forecast-actual", "O forecast é comparado sistematicamente com o realizado."),
          criterion("financial-4-return-risk", "Recursos são priorizados considerando retorno e risco."),
          criterion("financial-4-proven-impact", "Ciclos de melhoria comprovam impacto financeiro."),
        ],
      },
      {
        level: 5,
        name: "Otimização de valor",
        description: "A gestão financeira sustenta decisões previsíveis e melhoria contínua de valor.",
        criteria: [],
      },
    ],
  },
  commercial: {
    pillar: "commercial",
    levels: [
      {
        level: 1,
        name: "Base BVBP",
        description: "O diagnóstico comercial possui o mínimo de transparência para orientar a primeira decisão.",
        criteria: [
          criterion("commercial-1-funnel-stages", "O ponteiro principal de Comercial está definido."),
          criterion("commercial-1-qualified-origin", "O ponteiro principal possui baseline e fonte."),
          criterion("commercial-1-owner-next-action", "O ponteiro principal possui meta e benchmark."),
        ],
      },
      {
        level: 2,
        name: "Funil visível",
        description: "A empresa enxerga oportunidades, etapas e responsabilidades do processo comercial.",
        criteria: [
          criterion("commercial-2-conversion-cycle", "Conversão e ciclo de vendas possuem baseline."),
          criterion("commercial-2-pipeline-routine", "O pipeline é revisado em uma rotina definida."),
          criterion("commercial-2-loss-reasons", "Perdas são registradas com seus motivos."),
        ],
      },
      {
        level: 3,
        name: "Gestão comercial",
        description: "Metas e gargalos do funil orientam a atuação do time comercial.",
        criteria: [
          criterion("commercial-3-stage-goals", "Existem metas definidas por etapa do funil."),
          criterion("commercial-3-forecast-updated", "O forecast comercial é atualizado regularmente."),
          criterion("commercial-3-bottleneck-actions", "Ações comerciais atacam os gargalos identificados."),
        ],
      },
      {
        level: 4,
        name: "Receita previsível",
        description: "Histórico e forecast permitem antecipar receita e ajustar a estratégia.",
        criteria: [
          criterion("commercial-4-forecast-accuracy", "A acurácia do forecast é medida."),
          criterion("commercial-4-channel-comparison", "Canais de aquisição são comparados por resultado."),
          criterion("commercial-4-playbook", "Aprendizados comerciais estão consolidados em um playbook."),
        ],
      },
      {
        level: 5,
        name: "Crescimento replicável",
        description: "O processo comercial é previsível, mensurável e replicável.",
        criteria: [],
      },
    ],
  },
  operation: {
    pillar: "operation",
    levels: [
      {
        level: 1,
        name: "Base BVBP",
        description: "O diagnóstico operacional possui o mínimo de transparência para orientar a primeira decisão.",
        criteria: [
          criterion("operation-1-critical-flow", "O ponteiro principal de Operação está definido."),
          criterion("operation-1-roles", "O ponteiro principal possui baseline e fonte."),
          criterion("operation-1-baseline", "O ponteiro principal possui meta e benchmark."),
        ],
      },
      {
        level: 2,
        name: "Fluxo visível",
        description: "Etapas, responsabilidades e problemas recorrentes são conhecidos.",
        criteria: [
          criterion("operation-2-rework", "O retrabalho é medido."),
          criterion("operation-2-management-routine", "Existe uma rotina ativa de acompanhamento operacional."),
          criterion("operation-2-bottleneck-actions", "Gargalos geram ações com responsável."),
        ],
      },
      {
        level: 3,
        name: "Gestão do fluxo",
        description: "Capacidade, demanda e desempenho orientam as decisões operacionais.",
        criteria: [
          criterion("operation-3-capacity-demand", "Capacidade e demanda são comparadas."),
          criterion("operation-3-sla", "O cumprimento de SLA é acompanhado."),
          criterion("operation-3-risk-anticipation", "Riscos operacionais são antecipados."),
        ],
      },
      {
        level: 4,
        name: "Operação previsível",
        description: "A operação mantém padrões, antecipa desvios e sustenta seus ganhos.",
        criteria: [
          criterion("operation-4-before-after", "Melhorias mensuram resultados antes e depois."),
          criterion("operation-4-standards", "Padrões operacionais estão documentados."),
          criterion("operation-4-sustained-gains", "Os ganhos permanecem após o encerramento do ciclo."),
        ],
      },
      {
        level: 5,
        name: "Melhoria contínua",
        description: "A operação aprende, padroniza e melhora continuamente com base em evidências.",
        criteria: [],
      },
    ],
  },
  technology: {
    pillar: "technology",
    levels: [
      {
        level: 1,
        name: "Base BVBP",
        description: "O diagnóstico tecnológico possui o mínimo de transparência para orientar a primeira decisão.",
        criteria: [
          criterion("technology-1-inventory", "O ponteiro principal de Tecnologia está definido."),
          criterion("technology-1-owners", "O ponteiro principal possui baseline e fonte."),
          criterion("technology-1-access", "O ponteiro principal possui meta e benchmark."),
        ],
      },
      {
        level: 2,
        name: "Base organizada",
        description: "A empresa conhece sua base tecnológica e começa a aplicá-la aos gargalos prioritários.",
        criteria: [
          criterion("technology-2-automations", "Existem automações em produção."),
          criterion("technology-2-integrations", "Integrações removem etapas manuais do processo."),
          criterion("technology-2-baseline", "Horas manuais ou erros possuem baseline."),
        ],
      },
      {
        level: 3,
        name: "Tecnologia aplicada",
        description: "Soluções digitais removem gargalos e possuem responsáveis claros.",
        criteria: [
          criterion("technology-3-adoption-incidents", "Adoção e incidentes são medidos."),
          criterion("technology-3-monitoring", "As soluções críticas são monitoradas."),
          criterion("technology-3-business-pointers", "Resultados tecnológicos estão conectados a ponteiros do negócio."),
        ],
      },
      {
        level: 4,
        name: "Adoção mensurada",
        description: "A tecnologia é priorizada por impacto, adoção e continuidade.",
        criteria: [
          criterion("technology-4-impact-portfolio", "O portfólio tecnológico é priorizado por impacto."),
          criterion("technology-4-continuity-governance", "Continuidade e governança estão definidas."),
          criterion("technology-4-measured-cycles", "A evolução ocorre em ciclos com resultados mensurados."),
        ],
      },
      {
        level: 5,
        name: "Evolução contínua",
        description: "Tecnologia, adoção e impacto evoluem de forma contínua e mensurável.",
        criteria: [],
      },
    ],
  },
};

export function getPillarMaturityState(
  pillarId: BvbpPillarId,
  completedMaturityCriterionIds: string[],
): PillarMaturityState {
  const definition = maturityDefinitionsByPillar[pillarId];
  const completedIds = new Set(completedMaturityCriterionIds);
  let level: MaturityLevel = 1;

  for (const levelDefinition of definition.levels.slice(0, -1)) {
    const isTransitionComplete = levelDefinition.criteria.every((item) => completedIds.has(item.id));
    if (!isTransitionComplete) break;
    level = Math.min(levelDefinition.level + 1, 5) as MaturityLevel;
  }

  const current = definition.levels[level - 1];
  const next = definition.levels[level];
  const totalCriteria = definition.levels.reduce((sum, item) => sum + item.criteria.length, 0);
  const completedCriteria = definition.levels.reduce(
    (sum, item) => sum + item.criteria.filter((criterionItem) => completedIds.has(criterionItem.id)).length,
    0,
  );

  return {
    level,
    current,
    next,
    completedCurrentCriteria: current.criteria.filter((item) => completedIds.has(item.id)).length,
    completedCriteria,
    totalCriteria,
  };
}

export function getMaturityCriterionIdsForLevel(pillarId: BvbpPillarId, level: MaturityLevel) {
  return maturityDefinitionsByPillar[pillarId].levels
    .filter((item) => item.level < level)
    .flatMap((item) => item.criteria.map((criterionItem) => criterionItem.id));
}

export const painCatalogByPillar: Record<BvbpPillarId, string[]> = {
  financial: [
    "Baixa clareza de margem",
    "Custo operacional alto",
    "Receita em risco",
    "Falta de visão de caixa",
  ],
  commercial: [
    "Baixa conversão",
    "Pouca clareza de origem dos leads",
    "Propostas sem follow-up",
    "Pipeline desorganizado",
  ],
  operation: [
    "Retrabalho",
    "Espera entre áreas",
    "Falta de responsável",
    "Documentos dispersos",
    "Atrasos recorrentes",
  ],
  technology: [
    "Dados espalhados",
    "Trabalho manual recorrente",
    "Falta de dashboard",
    "Sistemas sem integração",
    "Oportunidade de automação",
  ],
};

function makeMetricCatalogItem(
  pillar: BvbpPillarId,
  slug: string,
  name: string,
  unit: ClientMetricUnit,
  description: string,
  formula: string,
  direction: ClientMetricDirection = "higher",
): ClientMetricConfig {
  return {
    id: `${pillar}-${slug}`,
    name,
    pillar,
    description,
    unit,
    formula,
    direction,
    custom: false,
  };
}

export const metricCatalogByPillar: Record<BvbpPillarId, ClientMetricConfig[]> = {
  financial: [
    makeMetricCatalogItem("financial", "faturamento", "Faturamento", "currency", "Receita reconhecida no período.", "Soma das receitas reconhecidas no período"),
    makeMetricCatalogItem("financial", "margem", "Margem operacional", "percentage", "Resultado operacional em relação ao faturamento.", "(Faturamento - custo operacional) / faturamento × 100"),
    makeMetricCatalogItem("financial", "custo-operacional", "Custo operacional", "currency", "Custos necessários para manter a operação.", "Soma dos custos operacionais do período", "lower"),
    makeMetricCatalogItem("financial", "caixa", "Caixa disponível", "currency", "Recursos disponíveis para uso imediato.", "Soma dos saldos disponíveis em caixa e contas"),
    makeMetricCatalogItem("financial", "inadimplencia", "Inadimplência", "percentage", "Percentual do faturamento vencido e não recebido.", "Valores vencidos / faturamento do período × 100", "lower"),
  ],
  commercial: [
    makeMetricCatalogItem("commercial", "leads-qualificados", "Leads qualificados", "count", "Entradas que atendem aos critérios comerciais.", "Contagem de leads qualificados no período"),
    makeMetricCatalogItem("commercial", "taxa-conversao", "Taxa de conversão", "percentage", "Conversão de leads qualificados em clientes.", "Clientes conquistados / leads qualificados × 100"),
    makeMetricCatalogItem("commercial", "pipeline", "Pipeline aberto", "currency", "Valor das oportunidades comerciais abertas.", "Soma dos valores das oportunidades abertas"),
    makeMetricCatalogItem("commercial", "ticket-medio", "Ticket médio", "currency", "Valor médio das vendas fechadas.", "Receita das vendas fechadas / número de vendas"),
    makeMetricCatalogItem("commercial", "ciclo-venda", "Ciclo de vendas", "days", "Tempo médio entre qualificação e fechamento.", "Média de dias entre qualificação e fechamento", "lower"),
  ],
  operation: [
    makeMetricCatalogItem("operation", "lead-time", "Lead time", "days", "Tempo total entre solicitação e entrega.", "Média de dias entre solicitação e entrega", "lower"),
    makeMetricCatalogItem("operation", "retrabalho", "Retrabalho", "count", "Ocorrências que exigiram refazer uma entrega.", "Contagem de ocorrências de retrabalho no período", "lower"),
    makeMetricCatalogItem("operation", "horas-manuais", "Horas manuais", "hours", "Horas dedicadas a tarefas manuais recorrentes.", "Soma das horas registradas em tarefas manuais", "lower"),
    makeMetricCatalogItem("operation", "sla", "SLA", "percentage", "Percentual de entregas realizadas dentro do acordo.", "Entregas no prazo / total de entregas × 100"),
    makeMetricCatalogItem("operation", "entregas-atraso", "Entregas em atraso", "count", "Entregas concluídas ou abertas fora do prazo.", "Contagem de entregas fora do prazo no período", "lower"),
  ],
  technology: [
    makeMetricCatalogItem("technology", "automacoes-producao", "Automações em produção", "count", "Automações ativas no fluxo real.", "Contagem de automações ativas em produção"),
    makeMetricCatalogItem("technology", "horas-economizadas", "Horas economizadas", "hours", "Tempo efetivamente reduzido por tecnologia.", "Horas manuais do baseline - horas manuais atuais"),
    makeMetricCatalogItem("technology", "taxa-adocao", "Taxa de adoção", "percentage", "Uso efetivo da solução pelo público esperado.", "Usuários ativos / usuários previstos × 100"),
    makeMetricCatalogItem("technology", "erros-incidentes", "Erros e incidentes", "count", "Falhas observadas no processo apoiado por tecnologia.", "Contagem de erros e incidentes no período", "lower"),
  ],
};

export const BVBP_COMPANY_ID = "company-bvbp";
export const PRISMA_DEMO_COMPANY_ID = "company-prisma";

export const mockPerformanceUser: PerformanceUser = {
  id: "user-prisma-01",
  name: "Marina Lopes",
  email: "cliente@bvbp.com.br",
  role: "client",
  roleLabel: "Cliente",
  companyIds: [PRISMA_DEMO_COMPANY_ID],
};

export const mockCompany: Company = {
  id: "company-atlas",
  name: "Atlas Serviços Profissionais",
  segment: "Serviços B2B",
  employees: 42,
  monthlyRevenue: 280000,
  recurringRevenue: 120000,
  monthlyOperationalCost: 190000,
  contactName: "Ana Ribeiro",
  contactEmail: "cliente@bvbp.com.br",
  status: "Ativo",
};

export const demoCompany: Company = {
  id: PRISMA_DEMO_COMPANY_ID,
  name: "Prisma Distribuição B2B",
  segment: "Distribuição B2B em crescimento",
  employees: 76,
  monthlyRevenue: 620000,
  recurringRevenue: 240000,
  monthlyOperationalCost: 430000,
  contactName: "Marina Lopes",
  contactEmail: "marina@prisma.example",
  status: "Ativo",
};

export const mockCompanies: Company[] = [
  {
    id: BVBP_COMPANY_ID,
    name: "BVBP",
    segment: "Consultoria boutique de performance operacional",
    employees: 2,
    monthlyRevenue: 0,
    recurringRevenue: 0,
    monthlyOperationalCost: 0,
    contactName: "Conrado Vidal",
    contactEmail: "conrado@bvbp.com.br",
    status: "Ativo",
  },
  demoCompany,
  mockCompany,
  {
    id: "company-nortech",
    name: "Nortech Operações",
    segment: "Distribuição B2B",
    employees: 68,
    monthlyRevenue: 430000,
    recurringRevenue: 160000,
    monthlyOperationalCost: 310000,
    contactName: "Paulo Martins",
    contactEmail: "paulo@nortech.example",
    status: "Onboarding",
  },
  {
    id: "company-lumina",
    name: "Lumina Educação Corporativa",
    segment: "Serviços educacionais",
    employees: 28,
    monthlyRevenue: 190000,
    recurringRevenue: 95000,
    monthlyOperationalCost: 138000,
    contactName: "Beatriz Costa",
    contactEmail: "beatriz@lumina.example",
    status: "Ativo",
  },
];

const defaultSelectedMetricIdsByPillar: Record<BvbpPillarId, string[]> = {
  financial: [
    "financial-faturamento",
    "financial-margem",
    "financial-custo-operacional",
  ],
  commercial: [
    "commercial-leads-qualificados",
    "commercial-taxa-conversao",
    "commercial-pipeline",
  ],
  operation: [
    "operation-lead-time",
    "operation-horas-manuais",
    "operation-custo-operacional-mensal",
  ],
  technology: [
    "technology-automacoes-producao",
    "technology-horas-economizadas",
    "technology-taxa-adocao",
  ],
};

function getDefaultMaturityLevel(company: Company, pillar: BvbpPillarId): 1 | 2 | 3 | 4 | 5 {
  if (company.id === BVBP_COMPANY_ID) {
    const levels: Record<BvbpPillarId, 1 | 2 | 3 | 4 | 5> = {
      financial: 1,
      commercial: 2,
      operation: 3,
      technology: 2,
    };

    return levels[pillar];
  }

  const levels: Record<BvbpPillarId, 1 | 2 | 3 | 4 | 5> = {
    financial: 3,
    commercial: 2,
    operation: 2,
    technology: 1,
  };

  return levels[pillar];
}

function buildDefaultMetricForCompany(company: Company, metric: ClientMetricConfig): ClientMetricConfig {
  return {
    ...metric,
    owner: company.bvbpOwner,
  };
}

export function createDefaultClientConfiguration(
  company: Company,
  options: { selectDefaults?: boolean } = {},
): ClientConfiguration {
  const { selectDefaults = false } = options;
  const metrics = bvbpPillarIds.flatMap((pillar) =>
    metricCatalogByPillar[pillar].map((metric) => buildDefaultMetricForCompany(company, metric)),
  );

  return {
    schemaVersion: 3,
    companyId: company.id,
    metrics,
    pillars: bvbpPillarIds.map((pillar) => {
      const maturityLevel = selectDefaults ? getDefaultMaturityLevel(company, pillar) : 1;

      return {
        pillar,
        completedMaturityCriterionIds: getMaturityCriterionIdsForLevel(pillar, maturityLevel),
        selectedMetricIds: selectDefaults ? defaultSelectedMetricIdsByPillar[pillar] : [],
        criticalMetricId: undefined,
        pains: [],
        notes: "",
      };
    }),
  };
}

export function isBvbpInternalWorkspace(company: Pick<Company, "id">) {
  return company.id === BVBP_COMPANY_ID;
}

const portfolioSignalsByCompanyId: Record<string, Omit<CompanyPortfolioSignal, "companyId">> = {
  [BVBP_COMPANY_ID]: {
    type: "Workspace interno",
    owner: "BVBP",
    actionLabel: "Abrir workspace",
    criticalPointer: "Comercial",
    mappedPotential: 42000,
    nextAction: "Definir 10 diagnósticos prioritários",
    activeCycles: 2,
    highRiskProjects: 1,
    projectsCount: 4,
    revenueAtRisk: 0,
    attention: true,
  },
  "company-atlas": {
    criticalPointer: "Receita em risco",
    mappedPotential: 38000,
    nextAction: "Conectar comercial e operação",
    activeCycles: 3,
    highRiskProjects: 2,
    projectsCount: 8,
    revenueAtRisk: 105000,
    attention: true,
  },
  [PRISMA_DEMO_COMPANY_ID]: {
    criticalPointer: "Passagem venda -> implantação",
    mappedPotential: 74000,
    nextAction: "Priorizar gargalos entre comercial e operação",
    activeCycles: 3,
    highRiskProjects: 2,
    projectsCount: 7,
    revenueAtRisk: 118000,
    attention: true,
  },
  "company-nortech": {
    criticalPointer: "Tempo de espera",
    mappedPotential: 62000,
    nextAction: "Priorizar vazamentos operacionais",
    activeCycles: 2,
    highRiskProjects: 1,
    projectsCount: 5,
    revenueAtRisk: 88000,
    attention: true,
  },
  "company-lumina": {
    criticalPointer: "Conversão por etapa",
    mappedPotential: 26000,
    nextAction: "Medir origem das oportunidades",
    activeCycles: 1,
    highRiskProjects: 0,
    projectsCount: 4,
    revenueAtRisk: 34000,
    attention: false,
  },
};

export const internalPortfolioItems: InternalPortfolioItem[] = [
  {
    id: "internal-bvbp",
    name: "BVBP",
    type: "Workspace interno",
    status: "Ativo",
    criticalPointer: "Comercial",
    mappedPotential: 42000,
    nextAction: "Definir 10 diagnósticos prioritários",
    owner: "BVBP",
    actionLabel: "Abrir workspace",
  },
  {
    id: "prospect-a",
    name: "Prospect A",
    type: "Prospect",
    status: "Em diagnóstico",
    criticalPointer: "Comercial",
    mappedPotential: 18000,
    nextAction: "Marcar conversa de diagnóstico",
    owner: "Conrado",
    actionLabel: "Acompanhar",
  },
  {
    id: "prospect-b",
    name: "Prospect B",
    type: "Prospect",
    status: "Mapeado",
    criticalPointer: "Origem da oportunidade",
    mappedPotential: 12000,
    nextAction: "Validar dor operacional",
    owner: "Cristiano",
    actionLabel: "Qualificar",
  },
  {
    id: "cliente-piloto",
    name: "Cliente piloto",
    type: "Cliente",
    status: "Ativo",
    criticalPointer: "Ciclo de melhoria",
    mappedPotential: 22000,
    nextAction: "Fechar próxima evidência",
    owner: "BVBP",
    actionLabel: "Revisar",
  },
  {
    id: "parceiro-estrategico",
    name: "Parceiro estratégico",
    type: "Parceiro",
    status: "Em negociação",
    criticalPointer: "Indicações qualificadas",
    mappedPotential: 15000,
    nextAction: "Definir modelo de parceria",
    owner: "Conrado",
    actionLabel: "Alinhar",
  },
  {
    id: "lead-interno-site",
    name: "Lead interno",
    type: "Lead interno",
    status: "Mapeado",
    criticalPointer: "Entrada pelo site",
    mappedPotential: 8000,
    nextAction: "Criar qualificação mínima",
    owner: "Cristiano",
    actionLabel: "Triar",
  },
];

export function getInternalPortfolioItems() {
  return isDemoDataEnabled ? internalPortfolioItems : [];
}

export interface AdminClientPortfolioItem extends Omit<InternalPortfolioItem, "status"> {
  companyId?: string;
  segment?: string;
  status: InternalPortfolioItem["status"] | ClientRelationshipStatus;
}

export function getAdminClientPortfolioItems(companies: Company[]): AdminClientPortfolioItem[] {
  const clientItems = companies
    .filter((company) => company.id !== BVBP_COMPANY_ID)
    .map((company) => {
      const signal = getCompanyPortfolioSignal(company);
      const relationshipStatus = getCompanyRelationshipStatus(company);

      return {
        id: `client-${company.id}`,
        companyId: company.id,
        name: company.name,
        type: "Cliente" as const,
        status: relationshipStatus,
        criticalPointer: signal.criticalPointer,
        mappedPotential: signal.mappedPotential,
        nextAction: signal.nextAction,
        owner: company.bvbpOwner || signal.owner || "BVBP",
        actionLabel: "Abrir workspace",
        segment: company.segment,
      };
    });
  const opportunityItems = isDemoDataEnabled
    ? internalPortfolioItems.filter((item) => item.id !== "internal-bvbp")
    : [];

  return [...clientItems, ...opportunityItems];
}

export function getAdminClientPortfolioSummary(items: AdminClientPortfolioItem[]) {
  return {
    clients: items.filter((item) => item.type.includes("Cliente")).length,
    opportunities: items.filter((item) => item.type === "Prospect" || item.type === "Lead interno" || item.type === "Parceiro").length,
    mappedPotential: items.reduce((sum, item) => sum + item.mappedPotential, 0),
    pendingActions: items.filter((item) => item.status !== "Perdido" && item.nextAction).length,
  };
}

export function getInternalPortfolioSummary() {
  if (!isDemoDataEnabled) {
    return {
      activeItems: 0,
      opportunities: 0,
      mappedPotential: 0,
      pendingActions: 0,
    };
  }

  return {
    activeItems: getInternalPortfolioItems().filter((item) => item.status !== "Pausado" && item.status !== "Perdido").length,
    opportunities: getInternalPortfolioItems().filter((item) => item.type === "Prospect" || item.type === "Lead interno").length,
    mappedPotential: getBvbpPortfolioPotential(),
    pendingActions: getInternalPortfolioItems().filter((item) => item.status !== "Ativo" && item.status !== "Perdido").length,
  };
}

export function getBvbpWorkspacePotential() {
  return isDemoDataEnabled ? portfolioSignalsByCompanyId[BVBP_COMPANY_ID].mappedPotential : 0;
}

export function getBvbpPortfolioPotential() {
  return getInternalPortfolioItems().reduce((sum, item) => sum + item.mappedPotential, 0);
}

export function getCompanyPortfolioSignal(company: Company): CompanyPortfolioSignal {
  if (!isDemoDataEnabled) {
    return {
      companyId: company.id,
      criticalPointer: "A definir",
      mappedPotential: 0,
      nextAction: "Definir próxima ação",
      activeCycles: 0,
      highRiskProjects: 0,
      projectsCount: 0,
      revenueAtRisk: 0,
      attention: false,
    };
  }

  const stored = portfolioSignalsByCompanyId[company.id];
  const relationshipStatus = getCompanyRelationshipStatus(company);

  if (stored) {
    return {
      companyId: company.id,
      ...stored,
    };
  }

  const mappedPotential = Math.round(company.monthlyOperationalCost * 0.18);
  const revenueAtRisk = Math.round(company.monthlyRevenue * 0.18);
  const activeCycles = relationshipStatus === "Onboarding" ? 1 : 2;

  return {
    companyId: company.id,
    criticalPointer: relationshipStatus === "Onboarding" ? "Dados sem linha de base" : "Potencial mapeado",
    mappedPotential,
    nextAction: relationshipStatus === "Onboarding" ? "Fechar diagnóstico inicial" : "Definir próxima decisão",
    activeCycles,
    highRiskProjects: relationshipStatus === "Onboarding" ? 1 : 0,
    projectsCount: activeCycles + 2,
    revenueAtRisk,
    attention: relationshipStatus === "Onboarding" || revenueAtRisk > 50000,
  };
}

export function createOverviewMetrics(company: Company): Metric[] {
  if (!isDemoDataEnabled) return [];

  if (isBvbpInternalWorkspace(company)) {
    const pipelineOpportunities = getBvbpPipelineOpportunities();
    const pipelinePotential = getBvbpPipelinePotential();
    const diagnostics = pipelineOpportunities.filter((opportunity) => opportunity.stage === "Diagnóstico").length;
    const proposals = pipelineOpportunities.filter((opportunity) => opportunity.stage === "Proposta").length;

    return [
      {
        id: "metric-monthly-revenue",
        companyId: company.id,
        name: "Receita mensal",
        value: 0,
        unit: "currency",
        category: "financial",
        confidenceLevel: "Mockado controlado",
      },
      {
        id: "metric-pipeline",
        companyId: company.id,
        name: "Pipeline comercial",
        value: pipelinePotential,
        unit: "currency",
        category: "financial",
        confidenceLevel: "Potencial estimado",
      },
      {
        id: "metric-diagnostics",
        companyId: company.id,
        name: "Diagnósticos agendados",
        value: diagnostics,
        unit: "count",
        category: "operational",
        confidenceLevel: "Mockado",
      },
      {
        id: "metric-proposals",
        companyId: company.id,
        name: "Propostas enviadas",
        value: proposals,
        unit: "count",
        category: "operational",
        confidenceLevel: "Mockado",
      },
      {
        id: "metric-conversion",
        companyId: company.id,
        name: "Taxa de conversão",
        value: 0,
        unit: "percentage",
        category: "financial",
        confidenceLevel: "Base inicial",
      },
      {
        id: "metric-content",
        companyId: company.id,
        name: "Conteúdos publicados",
        value: 0,
        unit: "count",
        category: "operational",
        confidenceLevel: "Mockado",
      },
      {
        id: "metric-savings",
        companyId: company.id,
        name: "Potencial mapeado",
        value: getBvbpWorkspacePotential(),
        unit: "currency",
        category: "operational",
        confidenceLevel: "Estimado",
      },
      {
        id: "metric-active-cycles",
        companyId: company.id,
        name: "Iniciativas ativas",
        value: 2,
        unit: "count",
        category: "operational",
        confidenceLevel: "Mockado",
      },
    ];
  }

  const signal = getCompanyPortfolioSignal(company);
  const margin = Math.max(8, Math.round(((company.monthlyRevenue - company.monthlyOperationalCost) / company.monthlyRevenue) * 100));

  return [
    {
      id: "metric-monthly-revenue",
      companyId: company.id,
      name: "Receita mensal",
      value: company.monthlyRevenue,
      unit: "currency",
      category: "financial",
      confidenceLevel: "Informado pelo cliente",
    },
    {
      id: "metric-margin",
      companyId: company.id,
      name: "Margem estimada",
      value: margin,
      unit: "percentage",
      category: "financial",
      confidenceLevel: "Estimado",
    },
    {
      id: "metric-operational-cost",
      companyId: company.id,
      name: "Custo operacional mensal",
      value: company.monthlyOperationalCost,
      unit: "currency",
      category: "financial",
      confidenceLevel: "Informado pelo cliente",
    },
    {
      id: "metric-savings",
      companyId: company.id,
      name: "Potencial de economia mapeado",
      value: signal.mappedPotential,
      unit: "currency",
      category: "operational",
      confidenceLevel: "Estimado a partir do diagnóstico",
    },
    {
      id: "metric-revenue-risk",
      companyId: company.id,
      name: "Receita em risco",
      value: signal.revenueAtRisk,
      unit: "currency",
      category: "risk",
      confidenceLevel: "Estimado",
    },
    {
      id: "metric-active-cycles",
      companyId: company.id,
      name: "Iniciativas ativas",
      value: signal.activeCycles,
      unit: "count",
      category: "operational",
      confidenceLevel: "Iniciativas em acompanhamento",
    },
  ];
}

export function getOverviewPillarHighlights(company: Company): OverviewPillarHighlight[] {
  if (!isDemoDataEnabled) return [];

  const signal = getCompanyPortfolioSignal(company);
  const automationSummary = getAutomationOpportunitySummary(getAutomationOpportunitiesForCompany(company));
  const isInternal = isBvbpInternalWorkspace(company);
  const commercialPipeline = isInternal ? getBvbpPipelinePotential() : Math.round(company.monthlyRevenue * 0.55);
  const funnelMetricsForCompany = createFunnelMetrics(company);
  const conversionMetric = funnelMetricsForCompany.find((metric) => metric.id === "conversion");
  const operationalLeaksForCompany = getOperationalLeaksForCompany(company);
  const operationalPotential = isInternal
    ? isDemoDataEnabled
      ? bvbpPdcaCycleSeeds.reduce((sum, cycle) => sum + cycle.estimatedImpact, 0)
      : 0
    : operationalLeaksForCompany.reduce((sum, leak) => sum + leak.estimatedCost, 0);
  const financialValue = isInternal ? getBvbpWorkspacePotential() : company.monthlyRevenue;
  const financialMetricLabel = isInternal ? "Potencial mapeado" : "Faturamento mensal";
  const financialHelper = isInternal ? "Estimativa interna" : "Dado de entrada";
  const commercialValue = conversionMetric && !isInternal ? conversionMetric.value : commercialPipeline;
  const commercialUnit = conversionMetric && !isInternal ? "percentage" : "currency";
  const commercialMetricLabel = conversionMetric && !isInternal ? "Taxa de conversão" : "Pipeline aberto";
  const operationalValue = isInternal ? operationalPotential : company.monthlyOperationalCost;
  const operationalMetricLabel = isInternal ? "Gargalo mapeado" : "Custo operacional mensal";

  return [
    {
      id: "financial",
      companyId: company.id,
      pillar: "Financeiro",
      metricLabel: financialMetricLabel,
      value: financialValue,
      unit: "currency",
      helper: financialHelper,
      dataType: isInternal ? "Interno" : "Real",
      source: isInternal ? "Carteira e pipeline BVBP" : "Cadastro do workspace",
      description: "Receita, margem, custo, caixa, risco e potencial.",
      metrics: [
        {
          label: financialMetricLabel,
          value: financialValue,
          unit: "currency",
          dataType: isInternal ? "Interno" : "Real",
          source: isInternal ? "Carteira BVBP" : "Cadastro do workspace",
        },
        {
          label: "Potencial mapeado",
          value: isInternal ? getBvbpWorkspacePotential() : signal.mappedPotential,
          unit: "currency",
          dataType: "Estimado",
          source: isInternal ? "Estimativa interna" : "Diagnóstico executivo",
        },
        {
          label: "Receita em risco",
          value: signal.revenueAtRisk,
          unit: "currency",
          dataType: "Estimado",
          source: "Leitura executiva",
        },
      ],
    },
    {
      id: "commercial",
      companyId: company.id,
      pillar: "Comercial",
      metricLabel: commercialMetricLabel,
      value: commercialValue,
      unit: commercialUnit,
      helper: isInternal ? "Pipeline BVBP" : "Oportunidades abertas",
      dataType: "Estimado",
      source: isInternal ? "CRM BVBP" : "Funil mockado",
      description: "Origem, conversão, pipeline, follow-up e proposta.",
      metrics: [
        {
          label: "Pipeline aberto",
          value: commercialPipeline,
          unit: "currency",
          dataType: "Estimado",
          source: isInternal ? "CRM BVBP" : "Funil comercial",
        },
        {
          label: "Taxa de conversão",
          value: conversionMetric?.value || 0,
          unit: "percentage",
          dataType: isInternal ? "Mockado" : "Estimado",
          source: isInternal ? "Base inicial" : "Funil comercial",
        },
        {
          label: "Próximas ações abertas",
          value: isInternal ? getBvbpOpenPipelineActionCount() : 0,
          unit: "count",
          dataType: isInternal ? "Interno" : "Mockado",
          source: isInternal ? "CRM BVBP" : "Workspace cliente",
        },
      ],
    },
    {
      id: "operational",
      companyId: company.id,
      pillar: "Operacional",
      metricLabel: operationalMetricLabel,
      value: operationalValue,
      unit: "currency",
      helper: isInternal ? "Rotina interna" : "Vazamentos estimados",
      dataType: isInternal ? "Estimado" : "Real",
      source: isInternal ? "Iniciativas internas" : "Cadastro do workspace",
      description: "Fluxo, espera, retrabalho, capacidade e entrega.",
      metrics: [
        {
          label: operationalMetricLabel,
          value: operationalValue,
          unit: "currency",
          dataType: isInternal ? "Estimado" : "Real",
          source: isInternal ? "Iniciativas internas" : "Cadastro do workspace",
        },
        {
          label: "Gargalo mapeado",
          value: operationalPotential,
          unit: "currency",
          dataType: "Estimado",
          source: isInternal ? "PDCA interno" : "Vazamentos operacionais",
        },
        {
          label: "Custo operacional mensal",
          value: company.monthlyOperationalCost,
          unit: "currency",
          dataType: isInternal ? "Interno" : "Real",
          source: "Cadastro do workspace",
        },
      ],
    },
    {
      id: "automation",
      companyId: company.id,
      pillar: "Automação",
      metricLabel: "Ganho estimado com automação",
      value: automationSummary.estimatedPotential,
      unit: "currency",
      helper: "Só quando move ponteiro real",
      dataType: "Estimado",
      source: "Oportunidades de automação",
      description: "IA, sistemas e automações conectados a decisão.",
      metrics: [
        {
          label: "Ganho estimado com automação",
          value: automationSummary.estimatedPotential,
          unit: "currency",
          dataType: "Estimado",
          source: "Oportunidades de automação",
        },
        {
          label: "Horas manuais mapeadas",
          value: automationSummary.manualHours,
          unit: "count",
          dataType: "Estimado",
          source: "Leitura operacional",
        },
        {
          label: "Automações em desenho",
          value: automationSummary.running,
          unit: "count",
          dataType: "Interno",
          source: "Backlog BVBP",
        },
      ],
    },
  ];
}

export const overviewMetrics: Metric[] = createOverviewMetrics(mockCompany);

export const bvbpPillars: BvbpPillar[] = [
  {
    id: "money",
    name: "Finanças",
    score: 3,
    status: "Em evolução",
    description: "Receita, margem, custo, caixa, risco e potencial com leitura objetiva.",
  },
  {
    id: "funnel",
    name: "Comercial",
    score: 2,
    status: "Atenção",
    description: "Origem, conversão, pipeline, follow-up e proposta em uma rotina clara.",
  },
  {
    id: "operation",
    name: "Operação",
    score: 2,
    status: "Atenção",
    description: "Fluxo, espera, retrabalho, capacidade e entrega com menos atrito.",
  },
  {
    id: "tech-ai",
    name: "Automação",
    score: 1,
    status: "Base inicial",
    description: "Dados, IA e sistemas apenas quando ajudam a mover um ponteiro real.",
  },
];

export const internalBvbpPillars: BvbpPillar[] = [
  {
    id: "money",
    name: "Finanças",
    score: 1,
    status: "Base inicial",
    description: "Receita, pipeline e potencial ainda em validação comercial.",
  },
  {
    id: "funnel",
    name: "Comercial",
    score: 2,
    status: "Em evolução",
    description: "Networking, diagnósticos, propostas e cadência semanal.",
  },
  {
    id: "operation",
    name: "Operação",
    score: 3,
    status: "Em evolução",
    description: "Método, rotina interna e ciclos mínimos de melhoria.",
  },
  {
    id: "tech-ai",
    name: "Automação",
    score: 2,
    status: "Em evolução",
    description: "Plataforma própria, conteúdo e base operacional interna.",
  },
];

export function getPillarsForCompany(company: Company) {
  if (!isDemoDataEnabled) return [];
  return isBvbpInternalWorkspace(company) ? internalBvbpPillars : bvbpPillars;
}

const maturityLevelLabels = {
  1: "Base dispersa",
  2: "Leitura mínima",
  3: "Gestão ativa",
  4: "Evidência consistente",
  5: "Sistema escalável",
} as const;

const maturityLevelMeanings = {
  1: "Dados existem, mas estão manuais, soltos ou pouco confiáveis.",
  2: "Ponteiros principais definidos e atualizados com alguma cadência.",
  3: "Rotina de análise, responsáveis e iniciativas conectadas aos ponteiros.",
  4: "Decisões baseadas em histórico, baseline, metas e aprendizados.",
  5: "Operação previsível, automações úteis e melhoria contínua sustentada.",
} as const;

const maturityCriteriaByPillar: Record<string, string[]> = {
  money: [
    "Definir ponteiro financeiro principal e baseline.",
    "Separar dado real, estimado e hipótese.",
    "Conectar potencial financeiro às iniciativas abertas.",
  ],
  funnel: [
    "Organizar origem, etapa e próxima ação do pipeline.",
    "Medir conversão mínima por etapa.",
    "Conectar follow-up a uma rotina semanal.",
  ],
  operation: [
    "Mapear fluxo crítico e gargalo atual.",
    "Medir custo, espera ou retrabalho com baseline.",
    "Definir responsável pela melhoria do fluxo.",
  ],
  "tech-ai": [
    "Priorizar automações por ponteiro movido.",
    "Validar evidência do gargalo antes de automatizar.",
    "Medir ganho estimado após cada ciclo.",
  ],
};

export function getMaturityMapForCompany(company: Company): MaturityMapItem[] {
  return getPillarsForCompany(company).map((pillar) => {
    const nextLevel = Math.min(pillar.score + 1, 5);

    return {
      ...pillar,
      currentLevelLabel: maturityLevelLabels[pillar.score as keyof typeof maturityLevelLabels],
      nextLevel,
      nextLevelLabel: maturityLevelLabels[nextLevel as keyof typeof maturityLevelLabels],
      currentMeaning: maturityLevelMeanings[pillar.score as keyof typeof maturityLevelMeanings],
      advancementCriteria: maturityCriteriaByPillar[pillar.id] || maturityCriteriaByPillar.money,
    };
  });
}

export const diagnosticSignals = [
  "Indicadores financeiros e operacionais ainda aparecem em lugares separados.",
  "Tempo de espera elevado entre comercial e operação.",
  "Pipeline existe, mas ainda falta clareza de conversão por etapa.",
  "Tarefas manuais recorrentes têm potencial de tecnologia aplicada.",
  "Projetos ativos precisam de responsáveis e critérios de risco mais claros.",
];

export const internalDiagnosticSignals = [
  "Método e plataforma avançaram mais rápido que a rotina comercial.",
  "Pipeline inicial existe, mas ainda precisa de lista prioritária e rotina semanal.",
  "Conteúdo deve funcionar como canal de autoridade e aquisição.",
  "Diagnósticos precisam virar evidências e proposta simples de 90 dias.",
];

export function getDiagnosticSignalsForCompany(company: Company) {
  if (!isDemoDataEnabled) return [];
  return isBvbpInternalWorkspace(company) ? internalDiagnosticSignals : diagnosticSignals;
}

export const internalWeeklySummary: WeeklySummaryItem[] = [
  {
    label: "Próxima decisão",
    value: "Definir lista dos 10 primeiros diagnósticos prioritários.",
  },
  {
    label: "Principal oportunidade",
    value: "Converter networking próximo em conversas de diagnóstico.",
  },
  {
    label: "Principal risco",
    value: "Ter método e plataforma bons, mas comercial ainda pouco consistente.",
  },
  {
    label: "Iniciativa em andamento",
    value: "Estruturar pipeline mínimo da BVBP.",
  },
  {
    label: "Última evidência",
    value: "Modelo comercial simplificado em duas ofertas principais.",
  },
];

export function getWeeklySummaryForCompany(company: Company) {
  return isBvbpInternalWorkspace(company) ? internalWeeklySummary : [];
}

export const maturityScores: MaturityScore[] = bvbpPillars.map((pillar) => ({
  id: `score-${pillar.id}`,
  companyId: mockCompany.id,
  dimension: pillar.name,
  score: pillar.score,
  description: pillar.description,
}));

export const projectSummary = {
  activeProjects: 8,
  delayedProjects: 3,
  projectsWithoutClearOwner: 2,
  revenueAtRisk: 105000,
};

export const projects: Project[] = [
  {
    id: "project-commercial-flow",
    companyId: mockCompany.id,
    name: "Redesenho do fluxo comercial",
    status: "Em andamento",
    owner: "Mariana Alves",
    value: 80000,
    deadline: "30/07/2026",
    risk: "Médio",
    bottleneck: "Aprovação de proposta",
  },
  {
    id: "project-financial-dashboard",
    companyId: mockCompany.id,
    name: "Implantação de dashboard financeiro",
    status: "Atrasado",
    owner: "João Pereira",
    value: 45000,
    deadline: "15/07/2026",
    risk: "Alto",
    bottleneck: "Falta de dados consolidados",
  },
  {
    id: "project-followups",
    companyId: mockCompany.id,
    name: "Automação de follow-ups",
    status: "Planejado",
    owner: "Carla Mendes",
    value: 25000,
    deadline: "20/08/2026",
    risk: "Baixo",
    bottleneck: "Tarefas manuais recorrentes",
  },
  {
    id: "project-standardization",
    companyId: mockCompany.id,
    name: "Padronização da gestão de projetos",
    status: "Em andamento",
    owner: "Roberto Lima",
    value: 60000,
    deadline: "10/08/2026",
    risk: "Médio",
    bottleneck: "Falta de responsáveis claros",
  },
];

export function createFunnelMetrics(company: Company): FunnelMetric[] {
  if (!isDemoDataEnabled) return [];

  if (isBvbpInternalWorkspace(company)) {
    const pipelineOpportunities = getBvbpPipelineOpportunities();
    const diagnostics = pipelineOpportunities.filter((opportunity) => opportunity.stage === "Diagnóstico").length;
    const proposals = pipelineOpportunities.filter((opportunity) => opportunity.stage === "Proposta").length;
    const activeConversations = pipelineOpportunities.filter((opportunity) => opportunity.stage !== "Mapeado").length;

    return [
      { id: "leads", name: "Leads mapeados", value: pipelineOpportunities.length, unit: "count", helper: isDemoDataEnabled ? "Demo" : "Sem dados" },
      { id: "meetings", name: "Conversas iniciadas", value: activeConversations, unit: "count", helper: isDemoDataEnabled ? "Demo" : "Sem dados" },
      { id: "diagnostics", name: "Diagnósticos agendados", value: diagnostics, unit: "count", helper: isDemoDataEnabled ? "Demo" : "Sem dados" },
      { id: "proposals", name: "Propostas enviadas", value: proposals, unit: "count", helper: isDemoDataEnabled ? "Demo" : "Sem dados" },
      { id: "pipeline", name: "Potencial estimado", value: getBvbpPipelinePotential(), unit: "currency", helper: isDemoDataEnabled ? "Estimado" : "Sem dados" },
      { id: "next-action", name: "Próxima ação pendente", value: getBvbpOpenPipelineActionCount(), unit: "count", helper: "Ações abertas" },
    ];
  }

  const ticket = Math.round(company.monthlyRevenue * 0.08);

  return [
    { id: "leads", name: "Leads no mês", value: 186, unit: "count", helper: "Entradas registradas" },
    { id: "meetings", name: "Reuniões realizadas", value: 42, unit: "count", helper: "Etapa comercial" },
    { id: "proposals", name: "Propostas enviadas", value: 24, unit: "count", helper: "Com valor estimado" },
    { id: "conversion", name: "Taxa de conversão", value: 18, unit: "percentage", helper: "Lead para venda" },
    { id: "ticket", name: "Ticket médio", value: ticket, unit: "currency", helper: "Base recente" },
    { id: "pipeline", name: "Receita em pipeline", value: Math.round(company.monthlyRevenue * 0.55), unit: "currency", helper: "Oportunidades abertas" },
  ];
}

export const funnelChannels: FunnelChannel[] = [
  {
    id: "indication",
    channel: "Indicação",
    entry: 36,
    conversion: 31,
    estimatedRevenue: 92000,
    status: "Forte",
    observation: "Melhor ticket e decisão mais rápida.",
  },
  {
    id: "whatsapp",
    channel: "WhatsApp",
    entry: 58,
    conversion: 17,
    estimatedRevenue: 48000,
    status: "Atenção",
    observation: "Muitos contatos sem qualificação mínima.",
  },
  {
    id: "landing-page",
    channel: "Landing page",
    entry: 42,
    conversion: 12,
    estimatedRevenue: 36000,
    status: "Testar",
    observation: "Boa entrada, baixa clareza de origem.",
  },
  {
    id: "cold-outreach",
    channel: "Cold outreach",
    entry: 22,
    conversion: 8,
    estimatedRevenue: 21000,
    status: "Atenção",
    observation: "Precisa segmentar ICP e cadência.",
  },
  {
    id: "newsletter",
    channel: "Newsletter",
    entry: 18,
    conversion: 10,
    estimatedRevenue: 14000,
    status: "Testar",
    observation: "Ainda sem ponte clara para reunião.",
  },
  {
    id: "paid-traffic",
    channel: "Tráfego pago",
    entry: 10,
    conversion: 4,
    estimatedRevenue: 8000,
    status: "Pausar",
    observation: "Custo alto sem evidência de conversão.",
  },
];

export const bvbpPipelineOpportunities: PipelineOpportunity[] = [
  {
    id: "pipeline-prospect-a",
    opportunity: "Prospect A",
    origin: "Networking",
    stage: "Diagnóstico",
    potential: 18000,
    nextAction: "Agendar diagnóstico inicial",
    owner: "Conrado",
    status: "Em diagnóstico",
  },
  {
    id: "pipeline-prospect-b",
    opportunity: "Prospect B",
    origin: "Indicação",
    stage: "Contato inicial",
    potential: 12000,
    nextAction: "Agendar primeira conversa",
    owner: "Cristiano",
    status: "Mapeado",
  },
  {
    id: "pipeline-cliente-piloto",
    opportunity: "Cliente piloto",
    origin: "Relação profissional",
    stage: "Proposta",
    potential: 22000,
    nextAction: "Aplicar template de proposta 90 dias",
    owner: "BVBP",
    status: "Proposta enviada",
  },
  {
    id: "pipeline-parceiro",
    opportunity: "Parceiro estratégico",
    origin: "Parceiro",
    stage: "Negociação",
    potential: 15000,
    nextAction: "Definir regra de indicação",
    owner: "Conrado",
    status: "Em negociação",
  },
  {
    id: "pipeline-conteudo",
    opportunity: "Lead interno",
    origin: "Conteúdo",
    stage: "Mapeado",
    potential: 8000,
    nextAction: "Criar qualificação mínima",
    owner: "Cristiano",
    status: "Mapeado",
  },
];

export function getBvbpPipelineOpportunities() {
  return isDemoDataEnabled ? bvbpPipelineOpportunities : [];
}

export function getBvbpPipelinePotential() {
  return getBvbpPipelineOpportunities().reduce((sum, opportunity) => sum + opportunity.potential, 0);
}

export function getBvbpOpenPipelineActionCount() {
  return getBvbpPipelineOpportunities().filter((opportunity) => !["Fechado", "Perdido", "Pausado"].includes(opportunity.status)).length;
}

export function getPipelineOpportunitiesForCompany(company: Company) {
  return isBvbpInternalWorkspace(company) ? getBvbpPipelineOpportunities() : [];
}

export function getFunnelChannelsForCompany(company: Company) {
  return isDemoDataEnabled && !isBvbpInternalWorkspace(company) ? funnelChannels : [];
}

export const funnelLeaks = [
  "Leads entram por canais diferentes sem padrão mínimo de qualificação.",
  "WhatsApp concentra demanda, mas não separa oportunidade real de atendimento.",
  "Propostas ficam sem follow-up estruturado depois do envio.",
  "Não há leitura simples de conversão por origem e etapa.",
  "Receita em pipeline não conversa com capacidade operacional disponível.",
];

export const internalFunnelSignals = [
  "Lista de prospects ainda precisa de prioridade objetiva.",
  "Networking próximo deve virar rotina semanal de conversas.",
  "Diagnóstico e proposta precisam de roteiro simples e repetível.",
];

export function getFunnelSignalsForCompany(company: Company) {
  if (!isDemoDataEnabled) return [];
  if (isBvbpInternalWorkspace(company)) {
    return isDemoDataEnabled ? internalFunnelSignals : [];
  }

  return funnelLeaks;
}

export const operationalLeaks: OperationalLeak[] = [
  {
    id: "leak-approvals",
    companyId: mockCompany.id,
    name: "Retrabalho em aprovações",
    affectedFlow: "Comercial -> Financeiro",
    affectedPointer: "Margem estimada",
    hoursPerMonth: 95,
    estimatedCost: 14250,
    severity: "Alta",
    source: "Entrevistas e revisão de propostas",
  },
  {
    id: "leak-between-areas",
    companyId: mockCompany.id,
    name: "Espera entre comercial e operação",
    affectedFlow: "Venda -> Implantação",
    affectedPointer: "Receita em risco",
    hoursPerMonth: 130,
    estimatedCost: 19500,
    severity: "Alta",
    source: "Agenda de passagem e relatos do time",
  },
  {
    id: "leak-manual-reports",
    companyId: mockCompany.id,
    name: "Relatórios manuais",
    affectedFlow: "Gestão -> Diretoria",
    affectedPointer: "Iniciativas ativas",
    hoursPerMonth: 40,
    estimatedCost: 6000,
    severity: "Média",
    source: "Rotina mensal informada",
  },
  {
    id: "leak-meetings",
    companyId: mockCompany.id,
    name: "Reuniões sem decisão clara",
    affectedFlow: "Governança",
    affectedPointer: "Próxima decisão",
    hoursPerMonth: 55,
    estimatedCost: 8250,
    severity: "Média",
    source: "Análise de ritos e atas",
  },
  {
    id: "leak-documents",
    companyId: mockCompany.id,
    name: "Documentos dispersos",
    affectedFlow: "Operação -> Cliente",
    affectedPointer: "Tempo de resposta",
    hoursPerMonth: 34,
    estimatedCost: 5100,
    severity: "Média",
    source: "Mapeamento de ferramentas",
  },
  {
    id: "leak-owner",
    companyId: mockCompany.id,
    name: "Falta de responsável único",
    affectedFlow: "Projetos internos",
    affectedPointer: "Projetos em risco",
    hoursPerMonth: 28,
    estimatedCost: 4200,
    severity: "Alta",
    source: "Diagnóstico de execução",
  },
];

export function getOperationalLeaksForCompany(company: Company) {
  if (!isDemoDataEnabled) return [];
  return isBvbpInternalWorkspace(company) ? operationalLeaks : operationalLeaks.filter((leak) => leak.companyId === company.id);
}

export const improvements: Improvement[] = [
  {
    id: "improvement-approval-flow",
    companyId: mockCompany.id,
    title: "Criar fluxo único de aprovação comercial",
    affectedPointer: "Receita em risco",
    affectedFlow: "Comercial -> Financeiro",
    hypothesis: "Reduzir retrabalho de aprovação encurta o ciclo de proposta.",
    estimatedImpact: 12000,
    ease: "Alta",
    owner: "Mariana Alves",
    deadline: "21 dias",
    pdcaStatus: "Executar",
    priorityBucket: "Fazer agora",
  },
  {
    id: "improvement-followup",
    companyId: mockCompany.id,
    title: "Automatizar follow-up de propostas",
    affectedPointer: "Conversão por etapa",
    affectedFlow: "Proposta -> Fechamento",
    hypothesis: "Follow-ups consistentes aumentam conversão sem aumentar volume de leads.",
    estimatedImpact: 7500,
    ease: "Média",
    owner: "Carla Mendes",
    deadline: "30 dias",
    pdcaStatus: "Planejar",
    priorityBucket: "Planejar",
  },
  {
    id: "improvement-project-review",
    companyId: mockCompany.id,
    title: "Implantar ritual quinzenal de revisão de projetos",
    affectedPointer: "Iniciativas ativas",
    affectedFlow: "Governança de execução",
    hypothesis: "Cadência curta aumenta clareza de risco e próxima decisão.",
    estimatedImpact: 15000,
    ease: "Alta",
    owner: "Roberto Lima",
    deadline: "14 dias",
    pdcaStatus: "Medir",
    priorityBucket: "Fazer agora",
  },
  {
    id: "improvement-financial-dashboard",
    companyId: mockCompany.id,
    title: "Consolidar dashboard financeiro-operacional",
    affectedPointer: "Margem estimada",
    affectedFlow: "Diretoria -> Operação",
    hypothesis: "Unificar finanças e operação melhora priorização semanal.",
    estimatedImpact: 18000,
    ease: "Média",
    owner: "João Pereira",
    deadline: "45 dias",
    pdcaStatus: "Aprender",
    priorityBucket: "Planejar",
  },
  {
    id: "improvement-doc-governance",
    companyId: mockCompany.id,
    title: "Criar governança mínima de documentos",
    affectedPointer: "Tempo de resposta",
    affectedFlow: "Operação -> Cliente",
    hypothesis: "Documentos padronizados reduzem procura, dúvida e retrabalho.",
    estimatedImpact: 5400,
    ease: "Alta",
    owner: "Ana Ribeiro",
    deadline: "20 dias",
    pdcaStatus: "Planejar",
    priorityBucket: "Monitorar",
  },
  {
    id: "improvement-pause-paid",
    companyId: mockCompany.id,
    title: "Pausar tráfego pago sem evidência de conversão",
    affectedPointer: "Custo por oportunidade",
    affectedFlow: "Marketing -> Comercial",
    hypothesis: "Pausar canal fraco libera caixa para experimentos com melhor evidência.",
    estimatedImpact: 4200,
    ease: "Alta",
    owner: "Mariana Alves",
    deadline: "7 dias",
    pdcaStatus: "Pausar",
    priorityBucket: "Pausar",
  },
];

export const bvbpPdcaCycleSeeds: PdcaCycle[] = [
  {
    id: "bvbp-action-prospects",
    companyId: BVBP_COMPANY_ID,
    title: "Definir lista de 10 prospects prioritários",
    affectedPointer: "Comercial",
    affectedFlow: "Comercial interno",
    hypothesis: "Uma lista curta aumenta foco e cadência de abordagem.",
    plannedAction: "Selecionar 10 contas, registrar origem e definir próximo contato.",
    whyItMatters: "Sem prioridade explícita, o comercial tende a ficar reativo.",
    owner: "Conrado",
    deadline: "7 dias",
    pdcaStatus: "Em refinamento",
    estimatedImpact: 42000,
    nextDecision: "Quais 10 contas entram na primeira rodada?",
    dataType: "Estimado",
    evidences: [
      {
        id: "evidence-prospects-1",
        date: "2026-06-29",
        type: "Decisão",
        description: "Primeira lista de prospects definida como base do ciclo comercial.",
        note: "Ainda precisa validar prioridade e cadência semanal.",
      },
    ],
    learnings: [
      {
        id: "learning-prospects-1",
        date: "2026-06-29",
        description: "Lista curta ajuda a separar oportunidade real de relação ampla.",
      },
    ],
  },
  {
    id: "bvbp-action-diagnostic-script",
    companyId: BVBP_COMPANY_ID,
    title: "Criar roteiro do diagnóstico inicial",
    affectedPointer: "Diagnósticos agendados",
    affectedFlow: "Diagnóstico -> Proposta",
    hypothesis: "Um roteiro simples reduz improviso e melhora evidência.",
    plannedAction: "Definir perguntas, evidências mínimas e saída esperada do diagnóstico.",
    whyItMatters: "O diagnóstico precisa gerar decisão, não apenas conversa exploratória.",
    owner: "Cristiano",
    deadline: "10 dias",
    pdcaStatus: "Em desenvolvimento",
    estimatedImpact: 18000,
    nextDecision: "Qual evidência mínima precisa sair do diagnóstico?",
    dataType: "Estimado",
    evidences: [
      {
        id: "evidence-diagnostic-1",
        date: "2026-06-29",
        type: "Entrega",
        description: "Modelo comercial simplificado validado internamente.",
        note: "Roteiro deve conectar ponteiros, hipótese e proposta 90 dias.",
      },
    ],
    learnings: [
      {
        id: "learning-diagnostic-1",
        date: "2026-06-29",
        description: "Diagnóstico precisa terminar com próxima decisão clara.",
      },
    ],
  },
  {
    id: "bvbp-action-site-offer",
    companyId: BVBP_COMPANY_ID,
    title: "Atualizar site com novo modelo comercial",
    affectedPointer: "Conversas iniciadas",
    affectedFlow: "Site -> Conversa",
    hypothesis: "Oferta clara reduz fricção para iniciar diagnóstico.",
    plannedAction: "Ajustar a narrativa para Sprint e Partnership, sem prometer retorno garantido.",
    whyItMatters: "O site precisa refletir a oferta que será usada nas conversas comerciais.",
    owner: "Conrado",
    deadline: "14 dias",
    pdcaStatus: "Em validação",
    estimatedImpact: 12000,
    nextDecision: "Quais duas ofertas ficam visíveis primeiro?",
    dataType: "Mockado",
    evidences: [
      {
        id: "evidence-site-1",
        date: "2026-06-29",
        type: "Aprendizado",
        description: "Site ainda não reflete oferta Sprint e Partnership.",
      },
    ],
    learnings: [
      {
        id: "learning-site-1",
        date: "2026-06-29",
        description: "A oferta precisa ser simples o bastante para virar CTA.",
      },
    ],
  },
  {
    id: "bvbp-action-content",
    companyId: BVBP_COMPANY_ID,
    title: "Publicar conteúdo sobre comercial e operação",
    affectedPointer: "Conteúdos publicados",
    affectedFlow: "Conteúdo -> Autoridade",
    hypothesis: "Conteúdo recorrente cria contexto para conversas comerciais.",
    plannedAction: "Publicar um conteúdo curto conectando comercial, operação e execução.",
    whyItMatters: "A autoridade precisa abrir conversas, não apenas educar em abstrato.",
    owner: "Cristiano",
    deadline: "14 dias",
    pdcaStatus: "Em validação",
    estimatedImpact: 8000,
    nextDecision: "Qual tema abre a sequência editorial?",
    dataType: "Mockado",
    evidences: [
      {
        id: "evidence-content-1",
        date: "2026-06-29",
        type: "Aprendizado",
        description: "Pipeline precisa de cadência semanal e narrativa pública consistente.",
      },
    ],
    learnings: [
      {
        id: "learning-content-1",
        date: "2026-06-29",
        description: "Conteúdo deve nascer dos ciclos reais de diagnóstico.",
      },
    ],
  },
  {
    id: "bvbp-action-proposal-template",
    companyId: BVBP_COMPANY_ID,
    title: "Criar template de proposta 90 dias",
    affectedPointer: "Propostas enviadas",
    affectedFlow: "Diagnóstico -> Proposta",
    hypothesis: "Template reduz tempo entre diagnóstico e decisão.",
    plannedAction: "Definir estrutura padrão com problema, hipótese, ciclo e decisão de 90 dias.",
    whyItMatters: "A proposta precisa transformar evidência em decisão de continuidade.",
    owner: "BVBP",
    deadline: "10 dias",
    pdcaStatus: "Em desenvolvimento",
    estimatedImpact: 22000,
    nextDecision: "Qual estrutura mínima da proposta?",
    dataType: "Estimado",
    evidences: [],
    learnings: [
      {
        id: "learning-proposal-1",
        date: "2026-06-29",
        description: "Proposta 90 dias deve ser consequência direta do diagnóstico.",
      },
    ],
  },
  {
    id: "bvbp-action-pipeline-base",
    companyId: BVBP_COMPANY_ID,
    title: "Estruturar base mínima de pipeline",
    affectedPointer: "Comercial",
    affectedFlow: "Comercial interno",
    hypothesis: "Uma base única evita perda de oportunidades pequenas.",
    plannedAction: "Manter oportunidade, origem, etapa, potencial, dono e próxima ação no mesmo lugar.",
    whyItMatters: "Sem base mínima, o time perde cadência e contexto entre conversas.",
    owner: "BVBP",
    deadline: "7 dias",
    pdcaStatus: "Concluída",
    estimatedImpact: 15000,
    nextDecision: "Quais campos ficam obrigatórios?",
    dataType: "Mockado",
    evidences: [
      {
        id: "evidence-pipeline-1",
        date: "2026-06-29",
        type: "Entrega",
        description: "Base mínima de pipeline estruturada no workspace interno.",
      },
    ],
    learnings: [
      {
        id: "learning-pipeline-1",
        date: "2026-06-29",
        description: "Poucos campos são suficientes para começar a manter cadência.",
      },
    ],
  },
  {
    id: "bvbp-action-method-page",
    companyId: BVBP_COMPANY_ID,
    title: "Criar página interna de método BVBP",
    affectedPointer: "Iniciativas ativas",
    affectedFlow: "Método -> Execução",
    hypothesis: "Método visível ajuda a repetir diagnóstico e execução.",
    plannedAction: "Documentar somente depois dos primeiros diagnósticos gerarem evidências.",
    whyItMatters: "Padronizar cedo demais pode cristalizar um método ainda não validado.",
    owner: "Conrado",
    deadline: "21 dias",
    pdcaStatus: "Arquivada",
    estimatedImpact: 0,
    nextDecision: "Esperar validação dos primeiros diagnósticos.",
    dataType: "Mockado",
    evidences: [],
    learnings: [
      {
        id: "learning-method-1",
        date: "2026-06-29",
        description: "Método interno deve ser padronizado após evidência prática.",
      },
    ],
  },
];

export const bvbpInternalActions: Improvement[] = bvbpPdcaCycleSeeds.map((cycle) => ({
  id: cycle.id,
  companyId: cycle.companyId,
  title: cycle.title,
  affectedPointer: cycle.affectedPointer,
  affectedFlow: cycle.affectedFlow,
  hypothesis: cycle.hypothesis,
  estimatedImpact: cycle.estimatedImpact,
  ease: "Média",
  owner: cycle.owner,
  deadline: cycle.deadline,
  pdcaStatus: cycle.pdcaStatus,
  priorityBucket: cycle.pdcaStatus === "Arquivada" || cycle.pdcaStatus === "Pausada" ? "Pausar" : cycle.pdcaStatus === "Concluída" ? "Monitorar" : cycle.pdcaStatus === "Em refinamento" ? "Planejar" : "Fazer agora",
  nextDecision: cycle.nextDecision,
}));

export function getImprovementsForCompany(company: Company) {
  if (!isDemoDataEnabled) return [];
  return isBvbpInternalWorkspace(company)
    ? bvbpInternalActions
    : improvements.filter((improvement) => improvement.companyId === mockCompany.id || improvement.companyId === company.id);
}

export const automationOpportunities: AutomationOpportunity[] = [
  {
    id: "automation-proposal-followup",
    opportunity: "Follow-up automático de propostas",
    type: "Automação",
    affectedProcess: "Proposta -> Fechamento",
    hoursPerMonth: 22,
    estimatedImpact: 7500,
    complexity: "Média",
    status: "Em desenho",
  },
  {
    id: "automation-financial-dashboard",
    opportunity: "Dashboard financeiro-operacional",
    type: "Dashboard",
    affectedProcess: "Gestão semanal",
    hoursPerMonth: 18,
    estimatedImpact: 18000,
    complexity: "Média",
    status: "Mapeada",
  },
  {
    id: "automation-database",
    opportunity: "Base única de oportunidades e clientes",
    type: "Banco de dados",
    affectedProcess: "Comercial -> Operação",
    hoursPerMonth: 30,
    estimatedImpact: 12000,
    complexity: "Alta",
    status: "Validar",
  },
  {
    id: "automation-doc-governance",
    opportunity: "Governança documental mínima",
    type: "Governança documental",
    affectedProcess: "Documentos operacionais",
    hoursPerMonth: 16,
    estimatedImpact: 5400,
    complexity: "Baixa",
    status: "Mapeada",
  },
  {
    id: "automation-ai-summary",
    opportunity: "Resumo de reuniões com próxima decisão",
    type: "IA",
    affectedProcess: "Governança",
    hoursPerMonth: 14,
    estimatedImpact: 4200,
    complexity: "Média",
    status: "Em andamento",
  },
  {
    id: "automation-landing",
    opportunity: "Landing page com qualificação mínima",
    type: "Landing page",
    affectedProcess: "Entrada de leads",
    hoursPerMonth: 10,
    estimatedImpact: 9600,
    complexity: "Baixa",
    status: "Mapeada",
  },
  {
    id: "automation-internal-app",
    opportunity: "Aplicação interna para ciclos PDCA",
    type: "Aplicação interna",
    affectedProcess: "Execução de melhorias",
    hoursPerMonth: 20,
    estimatedImpact: 15000,
    complexity: "Alta",
    status: "Validar",
  },
];

export function getAutomationOpportunitiesForCompany(company: Company) {
  if (!isDemoDataEnabled) return [];
  return automationOpportunities;
}

export function getAutomationOpportunitySummary(items: AutomationOpportunity[] = automationOpportunities) {
  return {
    opportunities: items.length,
    manualHours: items.reduce((sum, item) => sum + item.hoursPerMonth, 0),
    estimatedPotential: items.reduce((sum, item) => sum + item.estimatedImpact, 0),
    running: items.filter((item) => item.status === "Em desenho" || item.status === "Em andamento").length,
  };
}

export const impactCycles: ImpactCycle[] = [
  {
    id: "impact-revenue-risk",
    metric: "Receita em risco",
    baseline: "R$ 105 mil",
    target90Days: "R$ 65 mil",
    current: "R$ 105 mil",
    status: "Planejar",
  },
  {
    id: "impact-wait-time",
    metric: "Tempo de espera",
    baseline: "130h/mês",
    target90Days: "70h/mês",
    current: "130h/mês",
    status: "Executar",
  },
  {
    id: "impact-manual-tasks",
    metric: "Tarefas manuais",
    baseline: "40h/mês",
    target90Days: "15h/mês",
    current: "40h/mês",
    status: "Medir",
  },
];

export const priorityBuckets = ["Fazer agora", "Planejar", "Monitorar", "Pausar"] as const;
