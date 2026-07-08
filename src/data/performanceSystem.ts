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

export type ClientMetricDataType = "real" | "estimated" | "mock";

export type ClientMetricUnit = "currency" | "percentage" | "hours" | "count" | "days" | "text";

export interface Company {
  id: string;
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
  startDate?: string;
  contactName?: string;
  contactEmail?: string;
  status?: ClientRelationshipStatus;
  relationshipStatus?: ClientRelationshipStatus;
}

export interface ClientMetricConfig {
  id: string;
  name: string;
  pillar: BvbpPillarId;
  description: string;
  unit: ClientMetricUnit;
  dataType: ClientMetricDataType;
  currentValue?: number;
  target?: string;
  source?: string;
  frequency?: string;
  owner?: string;
  custom: boolean;
}

export interface ClientPillarConfig {
  pillar: BvbpPillarId;
  maturityLevel: 1 | 2 | 3 | 4 | 5;
  currentLevelName: string;
  nextLevel: 1 | 2 | 3 | 4 | 5;
  advancementCriteria: string;
  selectedMetricIds: string[];
  pains: string[];
  notes: string;
}

export interface ClientConfiguration {
  companyId: string;
  pillars: ClientPillarConfig[];
  metrics: ClientMetricConfig[];
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
  pdcaStatus: "Planejar" | "Executar" | "Medir" | "Aprender" | "Padronizar" | "Pausar" | "Fazer agora" | "Em andamento" | "Aguardando" | "Concluído" | "Pausado";
  priorityBucket: "Fazer agora" | "Planejar" | "Monitorar" | "Pausar";
  nextDecision?: string;
}

export const pdcaStatuses = ["Planejar", "Executar", "Medir", "Aprender", "Padronizar", "Pausar"] as const;

export type PdcaStatus = (typeof pdcaStatuses)[number];

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
  title: string;
  affectedPointer: string;
  affectedFlow: string;
  hypothesis: string;
  plannedAction: string;
  whyItMatters: string;
  owner: string;
  deadline: string;
  pdcaStatus: PdcaStatus;
  estimatedImpact: number;
  nextDecision: string;
  dataType: "Mockado" | "Estimado" | "Real";
  startDate?: string;
  endDate?: string;
  baseline?: string;
  target?: string;
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

export const maturityLevels = [
  {
    level: 1,
    name: "Base dispersa",
    description: "Dados soltos, baixa confiabilidade e ausência de rotina clara.",
  },
  {
    level: 2,
    name: "Leitura mínima",
    description: "Alguns dados existem, mas ainda com baixa conexão com decisão.",
  },
  {
    level: 3,
    name: "Gestão ativa",
    description: "Indicadores acompanhados com alguma cadência e responsáveis definidos.",
  },
  {
    level: 4,
    name: "Evidência consistente",
    description: "Indicadores conectados a iniciativas, evidências e decisões recorrentes.",
  },
  {
    level: 5,
    name: "Sistema otimizado",
    description: "Rotina consolidada, melhoria contínua e dados confiáveis para decisão.",
  },
] as const;

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
): ClientMetricConfig {
  return {
    id: `${pillar}-${slug}`,
    name,
    pillar,
    description,
    unit,
    dataType: "estimated",
    custom: false,
  };
}

export const metricCatalogByPillar: Record<BvbpPillarId, ClientMetricConfig[]> = {
  financial: [
    makeMetricCatalogItem("financial", "faturamento", "Faturamento", "currency", "Receita mensal informada ou estimada."),
    makeMetricCatalogItem("financial", "margem", "Margem", "percentage", "Leitura de margem operacional."),
    makeMetricCatalogItem("financial", "custo-operacional", "Custo operacional", "currency", "Custo operacional mensal."),
    makeMetricCatalogItem("financial", "caixa", "Caixa", "currency", "Disponibilidade ou fôlego financeiro."),
    makeMetricCatalogItem("financial", "receita-em-risco", "Receita em risco", "currency", "Receita potencialmente comprometida por gargalos."),
    makeMetricCatalogItem("financial", "potencial-mapeado", "Potencial mapeado", "currency", "Potencial estimado para priorizar iniciativas."),
    makeMetricCatalogItem("financial", "ticket-medio", "Ticket médio", "currency", "Valor médio por venda ou contrato."),
    makeMetricCatalogItem("financial", "inadimplencia", "Inadimplência", "percentage", "Percentual de receita em atraso."),
    makeMetricCatalogItem("financial", "prazo-medio-recebimento", "Prazo médio de recebimento", "days", "Tempo médio até receber."),
  ],
  commercial: [
    makeMetricCatalogItem("commercial", "leads", "Leads", "count", "Entradas comerciais mapeadas."),
    makeMetricCatalogItem("commercial", "conversas-iniciadas", "Conversas iniciadas", "count", "Conversas comerciais abertas."),
    makeMetricCatalogItem("commercial", "diagnosticos-agendados", "Diagnósticos agendados", "count", "Diagnósticos marcados."),
    makeMetricCatalogItem("commercial", "reunioes-realizadas", "Reuniões realizadas", "count", "Reuniões comerciais feitas."),
    makeMetricCatalogItem("commercial", "propostas-enviadas", "Propostas enviadas", "count", "Propostas enviadas no ciclo."),
    makeMetricCatalogItem("commercial", "taxa-conversao", "Taxa de conversão", "percentage", "Conversão entre etapas ou lead para cliente."),
    makeMetricCatalogItem("commercial", "ticket-medio", "Ticket médio", "currency", "Ticket médio comercial."),
    makeMetricCatalogItem("commercial", "pipeline", "Pipeline", "currency", "Valor estimado em oportunidades abertas."),
    makeMetricCatalogItem("commercial", "origem-leads", "Origem dos leads", "count", "Leitura de origem e qualidade das entradas."),
    makeMetricCatalogItem("commercial", "ciclo-venda", "Ciclo de venda", "days", "Tempo médio entre entrada e fechamento."),
  ],
  operation: [
    makeMetricCatalogItem("operation", "lead-time", "Lead time", "days", "Tempo total do fluxo."),
    makeMetricCatalogItem("operation", "cycle-time", "Cycle time", "days", "Tempo de execução ativa."),
    makeMetricCatalogItem("operation", "retrabalho", "Retrabalho", "count", "Ocorrências ou volume de retrabalho."),
    makeMetricCatalogItem("operation", "horas-manuais", "Horas manuais", "hours", "Horas gastas em tarefas manuais."),
    makeMetricCatalogItem("operation", "custo-operacional-mensal", "Custo operacional mensal", "currency", "Custo mensal da operação."),
    makeMetricCatalogItem("operation", "gargalos-mapeados", "Gargalos mapeados", "count", "Gargalos conhecidos no fluxo."),
    makeMetricCatalogItem("operation", "capacidade-time", "Capacidade do time", "count", "Capacidade operacional disponível."),
    makeMetricCatalogItem("operation", "tempo-espera", "Tempo de espera", "days", "Espera entre áreas ou etapas."),
    makeMetricCatalogItem("operation", "sla", "SLA", "percentage", "Cumprimento de acordos de entrega."),
    makeMetricCatalogItem("operation", "entregas-atraso", "Entregas em atraso", "count", "Entregas fora do prazo."),
  ],
  technology: [
    makeMetricCatalogItem("technology", "automacoes-mapeadas", "Automações mapeadas", "count", "Oportunidades de automação já identificadas."),
    makeMetricCatalogItem("technology", "horas-automatizaveis", "Horas automatizáveis", "hours", "Horas com potencial de automação."),
    makeMetricCatalogItem("technology", "sistemas-criticos", "Sistemas críticos", "count", "Sistemas importantes para a operação."),
    makeMetricCatalogItem("technology", "dados-estruturados", "Dados estruturados", "percentage", "Nível de organização dos dados."),
    makeMetricCatalogItem("technology", "bases-dispersas", "Bases dispersas", "count", "Bases ou planilhas separadas."),
    makeMetricCatalogItem("technology", "relatorios-manuais", "Relatórios manuais", "count", "Relatórios montados manualmente."),
    makeMetricCatalogItem("technology", "integracoes-necessarias", "Integrações necessárias", "count", "Integrações relevantes para o fluxo."),
    makeMetricCatalogItem("technology", "impacto-estimado-automacao", "Impacto estimado de automação", "currency", "Ganho estimado com automação."),
    makeMetricCatalogItem("technology", "governanca-documental", "Governança documental", "count", "Itens críticos de documentação e governança."),
    makeMetricCatalogItem("technology", "uso-ia", "Uso de IA", "count", "Casos de uso de IA em operação."),
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
    "financial-potencial-mapeado",
  ],
  commercial: [
    "commercial-leads",
    "commercial-taxa-conversao",
    "commercial-pipeline",
  ],
  operation: [
    "operation-lead-time",
    "operation-horas-manuais",
    "operation-custo-operacional-mensal",
  ],
  technology: [
    "technology-automacoes-mapeadas",
    "technology-horas-automatizaveis",
    "technology-impacto-estimado-automacao",
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

function getMaturityLevel(level: number) {
  return maturityLevels.find((item) => item.level === level) || maturityLevels[0];
}

function getDefaultMetricValue(company: Company, metricId: string) {
  const signal = getCompanyPortfolioSignal(company);
  const margin =
    company.monthlyRevenue > 0
      ? Math.max(0, Math.round(((company.monthlyRevenue - company.monthlyOperationalCost) / company.monthlyRevenue) * 100))
      : undefined;

  const valueByMetric: Record<string, number | undefined> = {
    "financial-faturamento": company.reportedRevenue || company.monthlyRevenue || undefined,
    "financial-margem": margin,
    "financial-custo-operacional": company.monthlyOperationalCost || undefined,
    "financial-receita-em-risco": signal.revenueAtRisk || undefined,
    "financial-potencial-mapeado": signal.mappedPotential || undefined,
    "commercial-taxa-conversao": company.id === BVBP_COMPANY_ID ? undefined : 18,
    "commercial-pipeline": company.id === BVBP_COMPANY_ID ? getBvbpPipelinePotential() : Math.round(company.monthlyRevenue * 0.55),
    "operation-horas-manuais": company.id === BVBP_COMPANY_ID ? undefined : 146,
    "operation-custo-operacional-mensal": company.monthlyOperationalCost || undefined,
    "operation-gargalos-mapeados": signal.highRiskProjects || undefined,
    "technology-automacoes-mapeadas": company.id === BVBP_COMPANY_ID ? 2 : 4,
    "technology-horas-automatizaveis": company.id === BVBP_COMPANY_ID ? undefined : 72,
    "technology-impacto-estimado-automacao": getAutomationOpportunitySummary().estimatedPotential,
  };

  return valueByMetric[metricId];
}

function buildDefaultMetricForCompany(company: Company, metric: ClientMetricConfig): ClientMetricConfig {
  const currentValue = getDefaultMetricValue(company, metric.id);

  return {
    ...metric,
    dataType: currentValue === undefined ? "estimated" : metric.id.includes("faturamento") || metric.id.includes("custo-operacional") ? "real" : "estimated",
    currentValue,
    source: currentValue === undefined ? undefined : metric.id.includes("faturamento") || metric.id.includes("custo-operacional") ? "Cadastro do cliente" : "Seed local",
    owner: company.bvbpOwner || "BVBP",
  };
}

export function createDefaultClientConfiguration(company: Company): ClientConfiguration {
  const metrics = bvbpPillarIds.flatMap((pillar) =>
    metricCatalogByPillar[pillar].map((metric) => buildDefaultMetricForCompany(company, metric)),
  );

  return {
    companyId: company.id,
    metrics,
    pillars: bvbpPillarIds.map((pillar) => {
      const maturityLevel = getDefaultMaturityLevel(company, pillar);
      const currentLevel = getMaturityLevel(maturityLevel);
      const nextLevel = Math.min(maturityLevel + 1, 5) as 1 | 2 | 3 | 4 | 5;

      return {
        pillar,
        maturityLevel,
        currentLevelName: currentLevel.name,
        nextLevel,
        advancementCriteria: "Definir baseline, responsável e próxima rotina de acompanhamento.",
        selectedMetricIds: defaultSelectedMetricIdsByPillar[pillar],
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

export interface AdminClientPortfolioItem extends InternalPortfolioItem {
  companyId?: string;
  segment?: string;
}

export function getAdminClientPortfolioItems(companies: Company[]): AdminClientPortfolioItem[] {
  const clientItems = companies
    .filter((company) => company.id !== BVBP_COMPANY_ID)
    .map((company) => {
      const signal = getCompanyPortfolioSignal(company);

      return {
        id: `client-${company.id}`,
        companyId: company.id,
        name: company.name,
        type: company.status === "Onboarding" ? "Cliente em onboarding" : "Cliente",
        status: company.status || "Ativo",
        criticalPointer: signal.criticalPointer,
        mappedPotential: signal.mappedPotential,
        nextAction: signal.nextAction,
        owner: company.contactName || "BVBP",
        actionLabel: "Abrir workspace",
        segment: company.segment,
      };
    });
  const opportunityItems = internalPortfolioItems.filter((item) => item.id !== "internal-bvbp");

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
  return {
    activeItems: internalPortfolioItems.filter((item) => item.status !== "Pausado" && item.status !== "Perdido").length,
    opportunities: internalPortfolioItems.filter((item) => item.type === "Prospect" || item.type === "Lead interno").length,
    mappedPotential: getBvbpPortfolioPotential(),
    pendingActions: internalPortfolioItems.filter((item) => item.status !== "Ativo" && item.status !== "Perdido").length,
  };
}

export function getBvbpWorkspacePotential() {
  return portfolioSignalsByCompanyId[BVBP_COMPANY_ID].mappedPotential;
}

export function getBvbpPortfolioPotential() {
  return internalPortfolioItems.reduce((sum, item) => sum + item.mappedPotential, 0);
}

export function getCompanyPortfolioSignal(company: Company): CompanyPortfolioSignal {
  const stored = portfolioSignalsByCompanyId[company.id];

  if (stored) {
    return {
      companyId: company.id,
      ...stored,
    };
  }

  const mappedPotential = Math.round(company.monthlyOperationalCost * 0.18);
  const revenueAtRisk = Math.round(company.monthlyRevenue * 0.18);
  const activeCycles = company.status === "Onboarding" ? 1 : 2;

  return {
    companyId: company.id,
    criticalPointer: company.status === "Onboarding" ? "Dados sem linha de base" : "Potencial mapeado",
    mappedPotential,
    nextAction: company.status === "Onboarding" ? "Fechar diagnóstico inicial" : "Definir próxima decisão",
    activeCycles,
    highRiskProjects: company.status === "Onboarding" ? 1 : 0,
    projectsCount: activeCycles + 2,
    revenueAtRisk,
    attention: company.status === "Onboarding" || revenueAtRisk > 50000,
  };
}

export function createOverviewMetrics(company: Company): Metric[] {
  if (isBvbpInternalWorkspace(company)) {
    const pipelinePotential = getBvbpPipelinePotential();
    const diagnostics = bvbpPipelineOpportunities.filter((opportunity) => opportunity.stage === "Diagnóstico").length;
    const proposals = bvbpPipelineOpportunities.filter((opportunity) => opportunity.stage === "Proposta").length;

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
  const signal = getCompanyPortfolioSignal(company);
  const automationSummary = getAutomationOpportunitySummary();
  const isInternal = isBvbpInternalWorkspace(company);
  const commercialPipeline = isInternal ? getBvbpPipelinePotential() : Math.round(company.monthlyRevenue * 0.55);
  const funnelMetricsForCompany = createFunnelMetrics(company);
  const conversionMetric = funnelMetricsForCompany.find((metric) => metric.id === "conversion");
  const operationalPotential = isInternal
    ? bvbpPdcaCycleSeeds.reduce((sum, cycle) => sum + cycle.estimatedImpact, 0)
    : operationalLeaks.reduce((sum, leak) => sum + leak.estimatedCost, 0);
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
  if (isBvbpInternalWorkspace(company)) {
    const diagnostics = bvbpPipelineOpportunities.filter((opportunity) => opportunity.stage === "Diagnóstico").length;
    const proposals = bvbpPipelineOpportunities.filter((opportunity) => opportunity.stage === "Proposta").length;
    const activeConversations = bvbpPipelineOpportunities.filter((opportunity) => opportunity.stage !== "Mapeado").length;

    return [
      { id: "leads", name: "Leads mapeados", value: bvbpPipelineOpportunities.length, unit: "count", helper: "Mockado" },
      { id: "meetings", name: "Conversas iniciadas", value: activeConversations, unit: "count", helper: "Mockado" },
      { id: "diagnostics", name: "Diagnósticos agendados", value: diagnostics, unit: "count", helper: "Mockado" },
      { id: "proposals", name: "Propostas enviadas", value: proposals, unit: "count", helper: "Mockado" },
      { id: "pipeline", name: "Potencial estimado", value: getBvbpPipelinePotential(), unit: "currency", helper: "Estimado" },
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

export function getBvbpPipelinePotential() {
  return bvbpPipelineOpportunities.reduce((sum, opportunity) => sum + opportunity.potential, 0);
}

export function getBvbpOpenPipelineActionCount() {
  return bvbpPipelineOpportunities.filter((opportunity) => !["Fechado", "Perdido", "Pausado"].includes(opportunity.status)).length;
}

export function getPipelineOpportunitiesForCompany(company: Company) {
  return isBvbpInternalWorkspace(company) ? bvbpPipelineOpportunities : [];
}

export function getFunnelChannelsForCompany(company: Company) {
  return isBvbpInternalWorkspace(company) ? [] : funnelChannels;
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
  return isBvbpInternalWorkspace(company) ? internalFunnelSignals : funnelLeaks;
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
    pdcaStatus: "Planejar",
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
    pdcaStatus: "Executar",
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
    pdcaStatus: "Medir",
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
    pdcaStatus: "Aprender",
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
    pdcaStatus: "Executar",
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
    pdcaStatus: "Padronizar",
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
    pdcaStatus: "Pausar",
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
  priorityBucket: cycle.pdcaStatus === "Pausar" ? "Pausar" : cycle.pdcaStatus === "Padronizar" ? "Monitorar" : cycle.pdcaStatus === "Planejar" ? "Planejar" : "Fazer agora",
  nextDecision: cycle.nextDecision,
}));

export function getImprovementsForCompany(company: Company) {
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
