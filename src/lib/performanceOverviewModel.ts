import {
  type BvbpPillarId,
  type ClientMetricConfig,
  type ClientMetricUnit,
  type ClientPillarConfig,
  type Company,
  type MaturityLevelDefinition,
  type PdcaCycle,
  bvbpPillarIds,
  getPillarMaturityState,
  maturityDefinitionsByPillar,
} from "@/data/performanceSystem";
import { getClientConfiguration } from "@/lib/clientConfigurationStore";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";

export type OverviewDataStatus = "Informado" | "Estimado" | "Fonte pendente" | "Sem baseline";

export interface OverviewMetricView {
  id: string;
  name: string;
  description: string;
  formula?: string;
  unit: ClientMetricUnit;
  dataType: OverviewDataStatus;
  currentValue?: number;
  displayValue: string;
  target?: string;
  benchmark?: string;
  source: string;
  owner?: string;
  custom: boolean;
}

export interface OverviewPillarSummary {
  id: BvbpPillarId;
  label: string;
  description: string;
  primaryMetricName: string;
  primaryMetricValue: string;
  primaryMetricSource: string;
  dataStatus: OverviewDataStatus;
  metricCount: number;
  noBaselineCount: number;
  painsCount: number;
  signal: string;
  context: string;
  maturityLevel: 1 | 2 | 3 | 4 | 5;
  currentLevelName: string;
  currentLevelDescription: string;
  nextLevel: 1 | 2 | 3 | 4 | 5;
  nextLevelName: string;
  nextLevelDescription: string;
  advancementCriteria: string;
  completedMaturityCriteria: number;
  totalMaturityCriteria: number;
  maturityLevels: MaturityLevelDefinition[];
  pains: string[];
  notes?: string;
  metrics: OverviewMetricView[];
  relatedInitiatives: PdcaCycle[];
  evidence: string[];
  nextDecision: string;
}

export interface ExecutiveReadingItem {
  label: string;
  value: string;
  meta: string;
}

export interface PerformanceOverviewModel {
  executiveReading: ExecutiveReadingItem[];
  pillarSummaries: OverviewPillarSummary[];
  maturitySummaries: OverviewPillarSummary[];
  prioritizedInitiatives: PdcaCycle[];
}

export interface PortfolioNextDecision {
  title: string;
  pillarLabel: string;
  context: string;
  owner?: string;
}

const pillarLabels: Record<BvbpPillarId, string> = {
  financial: "Finanças",
  commercial: "Comercial",
  operation: "Operação",
  technology: "Tecnologia",
};

const pillarDescriptions: Record<BvbpPillarId, string> = {
  financial: "Receita, margem, custo, caixa, risco e potencial.",
  commercial: "Origem, conversão, pipeline, follow-up e proposta.",
  operation: "Fluxo, espera, retrabalho, capacidade e entrega.",
  technology: "Dados, IA, sistemas e automações quando movem um ponteiro real.",
};

const pillarKeywords: Record<BvbpPillarId, string[]> = {
  financial: ["finan", "receita", "faturamento", "margem", "custo", "caixa", "potencial", "risco"],
  commercial: ["comercial", "pipeline", "lead", "proposta", "diagnostico", "conversa", "conversao", "follow"],
  operation: ["operacao", "operacional", "fluxo", "retrabalho", "entrega", "espera", "capacidade", "implantacao", "sla"],
  technology: ["tecnologia", "automacao", "automacoes", "ia", "dados", "sistema", "relatorio", "integracao", "dashboard"],
};

const statusPriority: Record<string, number> = {
  "Em refinamento": 0,
  "Em desenvolvimento": 1,
  "Em validação": 2,
  Pausada: 3,
  Concluída: 4,
  Descartada: 5,
  Arquivada: 6,
};

function hasMetricValue(metric: Pick<ClientMetricConfig, "currentValue">) {
  return metric.currentValue !== undefined && metric.currentValue !== null;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function pickPrimaryMetric(pillar: ClientPillarConfig, metrics: ClientMetricConfig[]) {
  if (!pillar.criticalMetricId) return undefined;
  return metrics.find((metric) => metric.id === pillar.criticalMetricId);
}

export function formatOverviewMetricValue(unit: ClientMetricUnit, value?: number) {
  if (value === undefined || value === null) return "Sem baseline";
  if (unit === "currency") return formatCurrency(value);
  if (unit === "percentage") return `${formatNumber(value)}%`;
  if (unit === "hours") return `${formatNumber(value)}h`;
  if (unit === "days") return `${formatNumber(value)} dias`;
  return formatNumber(value);
}

function dataStatusForMetric(metric: ClientMetricConfig): OverviewDataStatus {
  if (!hasMetricValue(metric)) return "Sem baseline";
  if (!metric.source?.trim()) return "Fonte pendente";
  return metric.valueOrigin === "estimated" ? "Estimado" : "Informado";
}

function metricViewFromConfig(metric: ClientMetricConfig): OverviewMetricView {
  const dataType = dataStatusForMetric(metric);
  const canDisplayValue = dataType === "Informado" || dataType === "Estimado";

  return {
    id: metric.id,
    name: metric.name,
    description: metric.description,
    formula: metric.formula,
    unit: metric.unit,
    dataType,
    currentValue: canDisplayValue ? metric.currentValue : undefined,
    displayValue: canDisplayValue ? formatOverviewMetricValue(metric.unit, metric.currentValue) : dataType,
    target: metric.target,
    benchmark: metric.benchmark,
    source: metric.source || "Fonte não informada",
    owner: metric.owner,
    custom: metric.custom,
  };
}

export function isOverviewCycleActive(cycle: PdcaCycle) {
  return ["Em refinamento", "Em desenvolvimento", "Em validação"].includes(cycle.pdcaStatus);
}

function parseDeadlineValue(deadline: string) {
  const dateTime = Date.parse(deadline);
  if (!Number.isNaN(dateTime)) return dateTime;

  const days = deadline.match(/(\d+)/)?.[1];
  if (days) return Number(days);

  return Number.MAX_SAFE_INTEGER;
}

export function sortOverviewInitiatives(cycles: PdcaCycle[]) {
  return [...cycles]
    .sort((a, b) => {
      const priorityRank = (priority?: PdcaCycle["priority"]) => {
        if (priority === "Alta") return 0;
        if (priority === "Média") return 1;
        if (priority === "Baixa") return 2;
        return 3;
      };
      const priorityDiff = priorityRank(a.priority) - priorityRank(b.priority);
      if (priorityDiff) return priorityDiff;

      const activeDiff = Number(isOverviewCycleActive(b)) - Number(isOverviewCycleActive(a));
      if (activeDiff) return activeDiff;

      const impactDiff = (b.estimatedImpact || 0) - (a.estimatedImpact || 0);
      if (impactDiff) return impactDiff;

      const statusDiff = (statusPriority[a.pdcaStatus] ?? 99) - (statusPriority[b.pdcaStatus] ?? 99);
      if (statusDiff) return statusDiff;

      const deadlineDiff = parseDeadlineValue(a.deadline) - parseDeadlineValue(b.deadline);
      if (deadlineDiff) return deadlineDiff;

      return (a.priorityOrder || 0) - (b.priorityOrder || 0);
    });
}

export function getPrioritizedOverviewInitiatives(cycles: PdcaCycle[]) {
  return sortOverviewInitiatives(cycles).slice(0, 5);
}

export function initiativeMatchesPillar(cycle: PdcaCycle, pillarId: BvbpPillarId) {
  if (cycle.pillarId) return cycle.pillarId === pillarId;
  const text = normalizeText(
    [
      cycle.title,
      cycle.affectedPointer,
      cycle.affectedFlow,
      cycle.hypothesis,
      cycle.plannedAction,
      cycle.nextDecision,
    ].join(" "),
  );
  const words = new Set(text.split(/[^a-z0-9]+/).filter(Boolean));

  return pillarKeywords[pillarId].some((keyword) => keyword.length <= 2 ? words.has(keyword) : text.includes(keyword));
}

function buildPillarSummary(
  company: Company,
  pillarConfig: ClientPillarConfig,
  metrics: ClientMetricConfig[],
  cycles: PdcaCycle[],
): OverviewPillarSummary {
  const selectedMetricViews = metrics.map(metricViewFromConfig);
  const primaryMetric = pickPrimaryMetric(pillarConfig, metrics);
  const primaryMetricView = primaryMetric ? metricViewFromConfig(primaryMetric) : undefined;
  const maturity = getPillarMaturityState(
    pillarConfig.pillar,
    pillarConfig.completedMaturityCriterionIds,
  );
  const completedCriterionIds = new Set(pillarConfig.completedMaturityCriterionIds);
  const pendingCurrentCriteria = maturity.current.criteria.filter((criterion) => !completedCriterionIds.has(criterion.id));
  const relatedInitiatives = cycles.filter((cycle) => initiativeMatchesPillar(cycle, pillarConfig.pillar));
  const evidence = relatedInitiatives.flatMap((cycle) =>
    cycle.evidences.map((item) => `${item.date} · ${item.description}`),
  );
  const noBaselineCount = selectedMetricViews.filter((metric) => metric.dataType === "Sem baseline" || metric.dataType === "Fonte pendente").length;
  const metricCount = selectedMetricViews.length;
  const signal =
    !metricCount
      ? "Sem ponteiros"
      : !primaryMetricView
        ? "Principal a definir"
        : primaryMetricView.dataType === "Sem baseline" || primaryMetricView.dataType === "Fonte pendente"
      ? "Mapear baseline"
      : maturity.level <= 2
        ? "Atenção"
        : "Acompanhar";

  return {
    id: pillarConfig.pillar,
    label: pillarLabels[pillarConfig.pillar],
    description: pillarDescriptions[pillarConfig.pillar],
    primaryMetricName: primaryMetricView?.name || "Ponteiro a definir",
    primaryMetricValue: primaryMetricView?.displayValue || "Sem baseline",
    primaryMetricSource: primaryMetricView?.source || "Ainda não definido",
    dataStatus: primaryMetricView?.dataType || "Sem baseline",
    metricCount,
    noBaselineCount,
    painsCount: pillarConfig.pains.length,
    signal,
    context: metricCount
      ? `${metricCount} ponteiros acompanhados`
      : `Sem ponteiros configurados para ${company.name}`,
    maturityLevel: maturity.level,
    currentLevelName: maturity.current.name,
    currentLevelDescription: maturity.current.description,
    nextLevel: maturity.next?.level || 5,
    nextLevelName: maturity.next?.name || maturity.current.name,
    nextLevelDescription: maturity.next?.description || maturity.current.description,
    advancementCriteria: pendingCurrentCriteria.length
      ? pendingCurrentCriteria.map((criterion) => criterion.label).join(" · ")
      : "Maturidade máxima validada.",
    completedMaturityCriteria: maturity.completedCriteria,
    totalMaturityCriteria: maturity.totalCriteria,
    maturityLevels: maturityDefinitionsByPillar[pillarConfig.pillar].levels,
    pains: pillarConfig.pains,
    notes: pillarConfig.notes,
    metrics: selectedMetricViews,
    relatedInitiatives,
    evidence,
    nextDecision: relatedInitiatives.find((cycle) => cycle.nextDecision)?.nextDecision || (
      !metricCount
        ? "Definir o primeiro ponteiro deste pilar"
        : !primaryMetricView
          ? "Definir o ponteiro principal deste pilar"
          : primaryMetricView.dataType === "Sem baseline" || primaryMetricView.dataType === "Fonte pendente"
            ? "Informar baseline e fonte do ponteiro principal"
            : "Definir próxima iniciativa conectada ao ponteiro principal"
    ),
  };
}

export function getAttentionPillar(pillars: OverviewPillarSummary[]) {
  return [...pillars].sort((a, b) => {
    const maturityDiff = a.maturityLevel - b.maturityLevel;
    if (maturityDiff) return maturityDiff;

    const painDiff = b.painsCount - a.painsCount;
    if (painDiff) return painDiff;

    const baselineDiff = b.noBaselineCount - a.noBaselineCount;
    if (baselineDiff) return baselineDiff;

    return bvbpPillarIds.indexOf(a.id) - bvbpPillarIds.indexOf(b.id);
  })[0];
}

function getPillarTransparencyGap(pillar: OverviewPillarSummary) {
  const criticalMetric = pillar.metrics.find((metric) => metric.name === pillar.primaryMetricName);

  if (!pillar.metricCount) return `Selecionar o primeiro ponteiro de ${pillar.label}`;
  if (!criticalMetric) return `Definir o ponteiro principal de ${pillar.label}`;
  if (criticalMetric.dataType === "Sem baseline") return `Informar o baseline do ponteiro principal de ${pillar.label}`;
  if (criticalMetric.dataType === "Fonte pendente") return `Informar a fonte do ponteiro principal de ${pillar.label}`;
  if (!criticalMetric.target?.trim()) return `Definir a meta do ponteiro principal de ${pillar.label}`;
  if (!criticalMetric.benchmark?.trim()) return `Registrar o benchmark do ponteiro principal de ${pillar.label}`;
  return undefined;
}

export function getPortfolioNextDecision(model: PerformanceOverviewModel): PortfolioNextDecision {
  const orderedPillars = [...model.pillarSummaries].sort((a, b) => {
    const maturityDiff = a.maturityLevel - b.maturityLevel;
    return maturityDiff || bvbpPillarIds.indexOf(a.id) - bvbpPillarIds.indexOf(b.id);
  });

  for (const pillar of orderedPillars) {
    const gap = getPillarTransparencyGap(pillar);
    if (gap) {
      return {
        title: gap,
        pillarLabel: pillar.label,
        context: `Completar a Base BVBP · maturidade ${pillar.maturityLevel}/5`,
      };
    }
  }

  const attentionPillar = getAttentionPillar(model.pillarSummaries);
  const activeInitiative = sortOverviewInitiatives(attentionPillar.relatedInitiatives)
    .find((cycle) => isOverviewCycleActive(cycle) && cycle.nextDecision.trim());

  if (activeInitiative) {
    return {
      title: activeInitiative.nextDecision,
      pillarLabel: attentionPillar.label,
      context: `${attentionPillar.primaryMetricName} · maturidade ${attentionPillar.maturityLevel}/5`,
      owner: activeInitiative.owner,
    };
  }

  return {
    title: `Criar a primeira iniciativa para mover ${attentionPillar.primaryMetricName}`,
    pillarLabel: attentionPillar.label,
    context: `Ponteiro principal definido · maturidade ${attentionPillar.maturityLevel}/5`,
  };
}

function getMainOpportunity(attentionPillar: OverviewPillarSummary, prioritizedInitiatives: PdcaCycle[]) {
  const initiative = prioritizedInitiatives.find((cycle) => cycle.estimatedImpact > 0);
  if (initiative) return initiative.title;
  if (attentionPillar.pains[0]) return attentionPillar.pains[0];
  return "Mapear primeira oportunidade";
}

function buildExecutiveReading(pillars: OverviewPillarSummary[], prioritizedInitiatives: PdcaCycle[]): ExecutiveReadingItem[] {
  const attentionPillar = getAttentionPillar(pillars);
  const initiativeWithDecision = prioritizedInitiatives.find((cycle) => cycle.nextDecision);

  return [
    {
      label: "Pilar em maior atenção",
      value: attentionPillar.label,
      meta: `Nível ${attentionPillar.maturityLevel} · ${attentionPillar.currentLevelName}`,
    },
    {
      label: "Ponteiro principal",
      value: attentionPillar.primaryMetricName || "Definir ponteiro principal",
      meta: `${attentionPillar.primaryMetricValue} · ${attentionPillar.dataStatus}`,
    },
    {
      label: "Principal oportunidade",
      value: getMainOpportunity(attentionPillar, prioritizedInitiatives),
      meta: attentionPillar.pains[0] ? "Dor ou iniciativa conectada" : "A mapear",
    },
    {
      label: "Próxima decisão",
      value: initiativeWithDecision?.nextDecision || "Definir próxima iniciativa conectada ao ponteiro principal",
      meta: initiativeWithDecision?.owner ? `Responsável: ${initiativeWithDecision.owner}` : "Sem responsável definido",
    },
  ];
}

export function buildPerformanceOverviewModel(company: Company, cycles: PdcaCycle[]): PerformanceOverviewModel {
  const configuration = getClientConfiguration(company);
  const metricById = new Map(configuration.metrics.map((metric) => [metric.id, metric]));
  const pillarSummaries = configuration.pillars.map((pillar) => {
    const metrics = pillar.selectedMetricIds
      .map((metricId) => metricById.get(metricId))
      .filter((metric): metric is ClientMetricConfig => Boolean(metric));
    return buildPillarSummary(company, pillar, metrics, cycles);
  });
  const prioritizedInitiatives = getPrioritizedOverviewInitiatives(cycles);

  return {
    executiveReading: buildExecutiveReading(pillarSummaries, prioritizedInitiatives),
    pillarSummaries,
    maturitySummaries: pillarSummaries,
    prioritizedInitiatives,
  };
}
