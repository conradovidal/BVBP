import {
  type BvbpPillarId,
  type ClientMetricConfig,
  type ClientMetricUnit,
  type ClientPillarConfig,
  type Company,
  type MaturityLevelDefinition,
  type OverviewPillarHighlight,
  type PdcaCycle,
  bvbpPillarIds,
  getPillarMaturityState,
  maturityDefinitionsByPillar,
  getOverviewPillarHighlights,
} from "@/data/performanceSystem";
import { getClientConfiguration } from "@/lib/clientConfigurationStore";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";

export type OverviewDataStatus = "Real" | "Estimado" | "Mockado" | "Sem baseline";

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

const pillarLabels: Record<BvbpPillarId, string> = {
  financial: "Finanças",
  commercial: "Comercial",
  operation: "Operação",
  technology: "Tecnologia",
};

const fallbackHighlightIdByPillar: Record<BvbpPillarId, OverviewPillarHighlight["id"]> = {
  financial: "financial",
  commercial: "commercial",
  operation: "operational",
  technology: "automation",
};

const metricPriorityByPillar: Record<BvbpPillarId, string[]> = {
  financial: [
    "financial-faturamento",
    "faturamento",
    "receita",
    "financial-potencial-mapeado",
    "potencial mapeado",
    "financial-margem",
    "margem",
    "financial-custo-operacional",
    "custo operacional",
  ],
  commercial: [
    "commercial-pipeline",
    "pipeline",
    "commercial-taxa-conversao",
    "taxa de conversao",
    "commercial-diagnosticos-agendados",
    "diagnosticos agendados",
    "commercial-propostas-enviadas",
    "propostas enviadas",
    "commercial-leads-qualificados",
    "leads qualificados",
  ],
  operation: [
    "operation-custo-operacional-mensal",
    "custo operacional mensal",
    "operation-horas-manuais",
    "horas manuais",
    "operation-retrabalho",
    "retrabalho",
    "operation-lead-time",
    "lead time",
    "operation-gargalos-mapeados",
    "gargalos mapeados",
  ],
  technology: [
    "technology-horas-economizadas",
    "horas economizadas",
    "technology-taxa-adocao",
    "taxa de adocao",
    "technology-automacoes-producao",
    "automacoes em producao",
    "technology-relatorios-manuais",
    "relatorios manuais",
    "technology-sistemas-criticos",
    "sistemas criticos",
  ],
};

const pillarKeywords: Record<BvbpPillarId, string[]> = {
  financial: ["finan", "receita", "faturamento", "margem", "custo", "caixa", "potencial", "risco"],
  commercial: ["comercial", "pipeline", "lead", "proposta", "diagnostico", "conversa", "conversao", "follow"],
  operation: ["operacao", "operacional", "fluxo", "retrabalho", "entrega", "espera", "capacidade", "implantacao", "sla"],
  technology: ["tecnologia", "automacao", "automacoes", "ia", "dados", "sistema", "relatorio", "integracao", "dashboard"],
};

const statusPriority: Record<string, number> = {
  Planejar: 0,
  Executar: 1,
  Medir: 2,
  Aprender: 3,
  Padronizar: 4,
  Pausar: 5,
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

function metricMatchesPriority(metric: ClientMetricConfig, priority: string) {
  const normalizedPriority = normalizeText(priority);
  return normalizeText(metric.id) === normalizedPriority || normalizeText(metric.name) === normalizedPriority;
}

function pickPrimaryMetric(pillarId: BvbpPillarId, metrics: ClientMetricConfig[]) {
  const priorities = metricPriorityByPillar[pillarId];

  for (const priority of priorities) {
    const metric = metrics.find((item) => metricMatchesPriority(item, priority) && hasMetricValue(item));
    if (metric) return metric;
  }

  const firstWithValue = metrics.find(hasMetricValue);
  if (firstWithValue) return firstWithValue;

  for (const priority of priorities) {
    const metric = metrics.find((item) => metricMatchesPriority(item, priority));
    if (metric) return metric;
  }

  return metrics[0];
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
  return "Real";
}

function normalizeFallbackDataStatus(dataType: OverviewPillarHighlight["dataType"], value?: number): OverviewDataStatus {
  if (value === undefined || value === null) return "Sem baseline";
  if (dataType === "Real") return "Real";
  if (dataType === "Mockado") return "Mockado";
  return "Estimado";
}

function metricViewFromConfig(metric: ClientMetricConfig): OverviewMetricView {
  return {
    id: metric.id,
    name: metric.name,
    description: metric.description,
    formula: metric.formula,
    unit: metric.unit,
    dataType: dataStatusForMetric(metric),
    currentValue: metric.currentValue,
    displayValue: formatOverviewMetricValue(metric.unit, metric.currentValue),
    target: metric.target,
    source: metric.source || (metric.custom ? "Ponteiro personalizado" : "Catálogo BVBP"),
    owner: metric.owner,
    custom: metric.custom,
  };
}

function metricViewFromFallback(highlight?: OverviewPillarHighlight): OverviewMetricView | undefined {
  if (!highlight) return undefined;

  return {
    id: highlight.id,
    name: highlight.metricLabel,
    description: highlight.description,
    unit: highlight.unit,
    dataType: normalizeFallbackDataStatus(highlight.dataType, highlight.value),
    currentValue: highlight.value,
    displayValue: formatOverviewMetricValue(highlight.unit, highlight.value),
    source: highlight.source,
    custom: false,
  };
}

export function isOverviewCycleActive(cycle: PdcaCycle) {
  return cycle.pdcaStatus !== "Padronizar" && cycle.pdcaStatus !== "Pausar";
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

function cycleMatchesPillar(cycle: PdcaCycle, pillarId: BvbpPillarId) {
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

  return pillarKeywords[pillarId].some((keyword) => text.includes(keyword));
}

function buildFallbackMetricViews(highlight?: OverviewPillarHighlight): OverviewMetricView[] {
  if (!highlight) return [];

  return highlight.metrics.map((metric) => ({
    id: `${highlight.id}-${metric.label}`,
    name: metric.label,
    description: highlight.description,
    unit: metric.unit,
    dataType: normalizeFallbackDataStatus(metric.dataType, metric.value),
    currentValue: metric.value,
    displayValue: formatOverviewMetricValue(metric.unit, metric.value),
    source: metric.source,
    custom: false,
  }));
}

function buildPillarSummary(
  company: Company,
  pillarConfig: ClientPillarConfig,
  metrics: ClientMetricConfig[],
  cycles: PdcaCycle[],
  fallback?: OverviewPillarHighlight,
): OverviewPillarSummary {
  const selectedMetricViews = metrics.map(metricViewFromConfig);
  const fallbackPrimary = metricViewFromFallback(fallback);
  const primaryMetric = pickPrimaryMetric(pillarConfig.pillar, metrics);
  const primaryMetricView = primaryMetric ? metricViewFromConfig(primaryMetric) : fallbackPrimary;
  const maturity = getPillarMaturityState(
    pillarConfig.pillar,
    pillarConfig.completedMaturityCriterionIds,
  );
  const completedCriterionIds = new Set(pillarConfig.completedMaturityCriterionIds);
  const pendingCurrentCriteria = maturity.current.criteria.filter((criterion) => !completedCriterionIds.has(criterion.id));
  const relatedInitiatives = cycles.filter((cycle) => cycleMatchesPillar(cycle, pillarConfig.pillar));
  const evidence = relatedInitiatives.flatMap((cycle) =>
    cycle.evidences.map((item) => `${item.date} · ${item.description}`),
  );
  const noBaselineCount = selectedMetricViews.filter((metric) => metric.dataType === "Sem baseline").length;
  const metricCount = selectedMetricViews.length;
  const signal =
    noBaselineCount > 0
      ? "Mapear baseline"
      : maturity.level <= 2
        ? "Atenção"
        : "Acompanhar";

  return {
    id: pillarConfig.pillar,
    label: pillarLabels[pillarConfig.pillar],
    description: fallback?.description || `${pillarLabels[pillarConfig.pillar]} configurado localmente.`,
    primaryMetricName: primaryMetricView?.name || "Ponteiro a definir",
    primaryMetricValue: primaryMetricView?.displayValue || "Sem baseline",
    primaryMetricSource: primaryMetricView?.source || "Configuração local",
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
    metrics: selectedMetricViews.length ? selectedMetricViews : buildFallbackMetricViews(fallback),
    relatedInitiatives,
    evidence,
    nextDecision: relatedInitiatives.find((cycle) => cycle.nextDecision)?.nextDecision || "Definir próxima iniciativa conectada ao ponteiro crítico",
  };
}

function getAttentionPillar(pillars: OverviewPillarSummary[]) {
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
      label: "Ponteiro crítico principal",
      value: attentionPillar.primaryMetricName || "Definir ponteiro crítico",
      meta: `${attentionPillar.primaryMetricValue} · ${attentionPillar.dataStatus}`,
    },
    {
      label: "Principal oportunidade",
      value: getMainOpportunity(attentionPillar, prioritizedInitiatives),
      meta: attentionPillar.pains[0] ? "Dor ou iniciativa conectada" : "A mapear",
    },
    {
      label: "Próxima decisão",
      value: initiativeWithDecision?.nextDecision || "Definir próxima iniciativa conectada ao ponteiro crítico",
      meta: initiativeWithDecision?.owner ? `Responsável: ${initiativeWithDecision.owner}` : "Sem responsável definido",
    },
  ];
}

export function buildPerformanceOverviewModel(company: Company, cycles: PdcaCycle[]): PerformanceOverviewModel {
  const configuration = getClientConfiguration(company);
  const fallbackHighlights = getOverviewPillarHighlights(company);
  const fallbackByPillar = new Map(fallbackHighlights.map((highlight) => [highlight.id, highlight]));
  const metricById = new Map(configuration.metrics.map((metric) => [metric.id, metric]));
  const pillarSummaries = configuration.pillars.map((pillar) => {
    const metrics = pillar.selectedMetricIds
      .map((metricId) => metricById.get(metricId))
      .filter((metric): metric is ClientMetricConfig => Boolean(metric));
    const fallback = fallbackByPillar.get(fallbackHighlightIdByPillar[pillar.pillar]);

    return buildPillarSummary(company, pillar, metrics, cycles, fallback);
  });
  const prioritizedInitiatives = getPrioritizedOverviewInitiatives(cycles);

  return {
    executiveReading: buildExecutiveReading(pillarSummaries, prioritizedInitiatives),
    pillarSummaries,
    maturitySummaries: pillarSummaries,
    prioritizedInitiatives,
  };
}
