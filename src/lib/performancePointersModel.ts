import {
  type BvbpPillarId,
  type Company,
  type PdcaCycle,
} from "@/data/performanceSystem";
import {
  buildPerformanceOverviewModel,
  isOverviewCycleActive,
  sortOverviewInitiatives,
  type OverviewMetricView,
  type OverviewPillarSummary,
} from "@/lib/performanceOverviewModel";

export type PointerPillarId = BvbpPillarId;

export interface PointerPillarOption {
  id: PointerPillarId;
  label: string;
  description: string;
}

export interface CriticalPointerDiagnostic {
  name: string;
  value: string;
  dataStatus: string;
  source: string;
  target?: string;
  whyItMatters: string;
  nextDecision: string;
  hasBaseline: boolean;
}

export interface PointerPillarDiagnostic {
  activePillar: PointerPillarOption;
  pillars: PointerPillarOption[];
  summary: OverviewPillarSummary;
  criticalPointer: CriticalPointerDiagnostic | null;
  metrics: OverviewMetricView[];
  pains: string[];
  maturity: {
    currentLevel: number;
    currentName: string;
    currentDescription: string;
    nextLevel: number;
    nextName: string;
    nextDescription: string;
    advancementCriteria: string;
  };
  initiatives: PdcaCycle[];
  nextDecision: {
    value: string;
    source: string;
  };
}

export const pointerPillars: PointerPillarOption[] = [
  {
    id: "financial",
    label: "Finanças",
    description: "Receita, margem, custo, caixa, risco e potencial.",
  },
  {
    id: "commercial",
    label: "Comercial",
    description: "Origem, conversão, pipeline, follow-up e proposta.",
  },
  {
    id: "operation",
    label: "Operação",
    description: "Fluxo, espera, retrabalho, capacidade e entrega.",
  },
  {
    id: "technology",
    label: "Tecnologia",
    description: "Dados, IA, sistemas e automações quando movem ponteiro real.",
  },
];

const pillarAliases: Record<string, PointerPillarId> = {
  money: "financial",
  financial: "financial",
  financeiro: "financial",
  financas: "financial",
  funnel: "commercial",
  commercial: "commercial",
  comercial: "commercial",
  operation: "operation",
  operations: "operation",
  operacao: "operation",
  automations: "technology",
  automation: "technology",
  tecnologia: "technology",
  technology: "technology",
  tech: "technology",
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getActivePointerPillar(value: string | null): PointerPillarId {
  if (!value) return "financial";
  return pillarAliases[normalizeText(value)] || "financial";
}

function buildCriticalPointer(summary: OverviewPillarSummary): CriticalPointerDiagnostic | null {
  const metric =
    summary.metrics.find((item) => item.name === summary.primaryMetricName) ||
    summary.metrics[0];

  if (!metric) return null;

  const hasBaseline = metric.dataType !== "Sem baseline";
  const nextDecision = hasBaseline
    ? summary.nextDecision
    : "Ponteiro selecionado, mas ainda sem baseline. O próximo passo é definir fonte e valor inicial.";

  return {
    name: metric.name,
    value: metric.displayValue,
    dataStatus: metric.dataType,
    source: metric.source,
    target: metric.target,
    whyItMatters: metric.description || summary.description,
    nextDecision,
    hasBaseline,
  };
}

function buildNextDecision(
  summary: OverviewPillarSummary,
  criticalPointer: CriticalPointerDiagnostic | null,
  initiatives: PdcaCycle[],
) {
  const activeInitiative = initiatives.find((cycle) => isOverviewCycleActive(cycle) && cycle.nextDecision);

  if (activeInitiative) {
    return {
      value: activeInitiative.nextDecision,
      source: `Iniciativa: ${activeInitiative.title}`,
    };
  }

  if (summary.advancementCriteria) {
    return {
      value: summary.advancementCriteria,
      source: "Critério de avanço da maturidade",
    };
  }

  if (criticalPointer && !criticalPointer.hasBaseline) {
    return {
      value: "Definir fonte e valor inicial do ponteiro crítico.",
      source: "Baseline ausente",
    };
  }

  return {
    value: "Definir próxima iniciativa conectada a este pilar.",
    source: "Fallback",
  };
}

export function buildPerformancePointersModel(
  company: Company,
  cycles: PdcaCycle[],
  activePillarId: PointerPillarId,
): PointerPillarDiagnostic {
  const overview = buildPerformanceOverviewModel(company, cycles);
  const summary =
    overview.pillarSummaries.find((pillar) => pillar.id === activePillarId) ||
    overview.pillarSummaries[0];
  const activePillar =
    pointerPillars.find((pillar) => pillar.id === summary.id) ||
    pointerPillars[0];
  const initiatives = sortOverviewInitiatives(summary.relatedInitiatives);
  const criticalPointer = buildCriticalPointer(summary);

  return {
    activePillar,
    pillars: pointerPillars,
    summary,
    criticalPointer,
    metrics: summary.metrics,
    pains: summary.pains,
    maturity: {
      currentLevel: summary.maturityLevel,
      currentName: summary.currentLevelName,
      currentDescription: summary.currentLevelDescription,
      nextLevel: summary.nextLevel,
      nextName: summary.nextLevelName,
      nextDescription: summary.nextLevelDescription,
      advancementCriteria: summary.advancementCriteria,
    },
    initiatives,
    nextDecision: buildNextDecision(summary, criticalPointer, initiatives),
  };
}
