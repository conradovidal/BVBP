import type { PerformanceDetail } from "@/components/performance/PerformanceDetailDialog";
import type {
  AutomationOpportunity,
  BvbpPillar,
  FunnelMetric,
  Metric,
  OperationalLeak,
  PdcaCycle,
  PipelineOpportunity,
  WeeklySummaryItem,
} from "@/data/performanceSystem";
import { formatCurrency, formatMetricValue, formatNumber } from "@/lib/performanceFormatters";

function normalizePointerText(value: string) {
  return value
    .toLowerCase()
    .replace(/pipeline comercial|funil comercial|funil|cadência comercial/g, "comercial")
    .replace(/dinheiro|clareza financeira/g, "finanças")
    .replace(/eficiência operacional/g, "operação")
    .replace(/tecnologia e ia|automações|automação aplicada/g, "tecnologia");
}

function cycleMatchesPointer(cycle: PdcaCycle, pointer: string) {
  const normalizedPointer = normalizePointerText(pointer);
  const normalizedCyclePointer = normalizePointerText(cycle.affectedPointer);
  const normalizedCycleTitle = normalizePointerText(cycle.title);

  return (
    normalizedCyclePointer.includes(normalizedPointer) ||
    normalizedPointer.includes(normalizedCyclePointer) ||
    normalizedCycleTitle.includes(normalizedPointer)
  );
}

function connectedCycleNames(cycles: PdcaCycle[], pointer: string) {
  return cycles.filter((cycle) => cycleMatchesPointer(cycle, pointer)).map((cycle) => cycle.title);
}

function evidenceForPointer(cycles: PdcaCycle[], pointer: string) {
  return cycles
    .filter((cycle) => cycleMatchesPointer(cycle, pointer))
    .flatMap((cycle) => cycle.evidences.map((evidence) => evidence.description));
}

function firstDecision(cycles: PdcaCycle[], pointer: string) {
  return cycles.find((cycle) => cycleMatchesPointer(cycle, pointer))?.nextDecision;
}

export function metricDetail(metric: Metric, label: string, cycles: PdcaCycle[]): PerformanceDetail {
  const confidence = metric.confidenceLevel.toLowerCase();

  return {
    title: label,
    subtitle: metric.name,
    status: metric.confidenceLevel,
    affectedPointer: metric.name,
    estimatedImpact: metric.unit === "currency" ? metric.value : formatMetricValue(metric),
    dataType: confidence.includes("real") ? "Real" : confidence.includes("estimado") ? "Estimado" : "Mockado",
    description: `Leitura atual: ${formatMetricValue(metric)}.`,
    whyItMatters:
      metric.id === "metric-pipeline"
        ? "Mostra a capacidade da BVBP de gerar receita futura com rotina comercial."
        : "Ajuda a priorizar decisões sem transformar a tela principal em diagnóstico completo.",
    facts: [
      { label: "Valor atual", value: metric.id === "metric-savings" ? `${formatMetricValue(metric)}/mês` : formatMetricValue(metric) },
      { label: "Tipo", value: metric.confidenceLevel },
    ],
    evidence: evidenceForPointer(cycles, metric.name),
    connectedActions: connectedCycleNames(cycles, metric.name),
    nextDecision: firstDecision(cycles, metric.name) || "Defina a próxima decisão para manter o ciclo vivo.",
  };
}

export function weeklySummaryDetail(item: WeeklySummaryItem, cycles: PdcaCycle[]): PerformanceDetail {
  const cycle = cycles.find((candidate) => item.value.includes(candidate.title)) || cycles[0];
  return {
    title: item.label,
    subtitle: item.value,
    status: cycle?.pdcaStatus,
    affectedPointer: cycle?.affectedPointer,
    estimatedImpact: cycle?.estimatedImpact,
    dataType: cycle?.dataType || "Mockado",
    description: item.value,
    whyItMatters: "Resumo semanal existe para transformar leitura rápida em decisão operacional.",
    evidence: cycle?.evidences.map((evidence) => evidence.description),
    connectedActions: cycle ? [cycle.title] : [],
    nextDecision: cycle?.nextDecision || "Defina a próxima decisão para manter o ciclo vivo.",
  };
}

export function pillarDetail(pillar: BvbpPillar, cycles: PdcaCycle[]): PerformanceDetail {
  const relatedCycles = cycles.filter((cycle) => {
    const text = `${cycle.affectedPointer} ${cycle.affectedFlow} ${cycle.title}`.toLowerCase();
    if (pillar.id === "funnel") return text.includes("pipeline") || text.includes("diagnóstico") || text.includes("proposta");
    if (pillar.id === "money") return text.includes("receita") || text.includes("potencial");
    if (pillar.id === "operation") return text.includes("execução") || text.includes("comercial");
    return text.includes("site") || text.includes("tecnologia") || text.includes("conteúdo");
  });

  return {
    title: pillar.name,
    subtitle: `${pillar.score}/5`,
    status: pillar.status,
    affectedPointer: pillar.name,
    dataType: "Mockado",
    description: pillar.description,
    whyItMatters: "O mapa mostra onde investigar antes de aprofundar em documento de devolutiva.",
    evidence: relatedCycles.flatMap((cycle) => cycle.evidences.map((evidence) => evidence.description)),
    connectedActions: relatedCycles.map((cycle) => cycle.title),
    nextDecision: relatedCycles[0]?.nextDecision || "Defina a próxima decisão para manter o ciclo vivo.",
  };
}

export function signalDetail(signal: string, index: number, cycles: PdcaCycle[]): PerformanceDetail {
  const cycle = cycles[index] || cycles[0];
  return {
    title: `Sinal ${String(index + 1).padStart(2, "0")}`,
    subtitle: signal,
    status: "Estimado",
    affectedPointer: cycle?.affectedPointer,
    dataType: "Estimado",
    description: signal,
    whyItMatters: "Sinal existe para orientar investigação, não para fechar diagnóstico sozinho.",
    evidence: cycle?.evidences.map((evidence) => evidence.description),
    connectedActions: cycle ? [cycle.title] : [],
    nextDecision: cycle?.nextDecision || "Defina a próxima decisão para manter o ciclo vivo.",
  };
}

export function funnelMetricDetail(metric: FunnelMetric, label: string, cycles: PdcaCycle[]): PerformanceDetail {
  return {
    title: label,
    subtitle: metric.name,
    status: metric.helper,
    affectedPointer: metric.name,
    estimatedImpact: metric.unit === "currency" ? metric.value : metric.value.toString(),
    dataType: metric.helper.includes("Estimado") ? "Estimado" : "Mockado",
    description: `Leitura atual do comercial: ${metric.unit === "currency" ? formatCurrency(metric.value) : metric.unit === "percentage" ? `${metric.value}%` : formatNumber(metric.value)}.`,
    whyItMatters: "Mantém a primeira leitura simples e permite investigar origem, etapa e decisão quando necessário.",
    evidence: evidenceForPointer(cycles, metric.name),
    connectedActions: connectedCycleNames(cycles, metric.name),
    nextDecision: firstDecision(cycles, metric.name) || "Defina a próxima decisão para manter o ciclo vivo.",
  };
}

export function pipelineOpportunityDetail(opportunity: PipelineOpportunity, cycles: PdcaCycle[]): PerformanceDetail {
  const cycle =
    cycles.find((item) => opportunity.nextAction.toLowerCase().includes("diagnóstico") && item.affectedPointer === "Diagnósticos agendados") ||
    cycles.find((item) => opportunity.nextAction.toLowerCase().includes("proposta") && item.affectedPointer === "Propostas enviadas") ||
    cycles.find((item) => normalizePointerText(item.affectedPointer) === "comercial");

  return {
    title: opportunity.opportunity,
    subtitle: `${opportunity.origin} · ${opportunity.stage}`,
    status: opportunity.status,
    affectedPointer: cycle?.affectedPointer || "Comercial",
    estimatedImpact: opportunity.potential,
    dataType: "Estimado",
    description: `Oportunidade em ${opportunity.stage.toLowerCase()} com origem em ${opportunity.origin.toLowerCase()}.`,
    whyItMatters: "Cada oportunidade precisa manter próxima ação clara para não perder cadência.",
    facts: [
      { label: "Responsável", value: opportunity.owner },
      { label: "Próxima ação", value: opportunity.nextAction },
      { label: "Risco principal", value: "Perder cadência de follow-up" },
      { label: "Ciclo conectado", value: cycle?.title || "Sem ciclo conectado" },
    ],
    evidence: cycle?.evidences.map((evidence) => evidence.description),
    connectedActions: cycle ? [cycle.title] : [],
    nextDecision: cycle?.nextDecision || opportunity.nextAction,
  };
}

export function operationalLeakDetail(leak: OperationalLeak, cycles: PdcaCycle[]): PerformanceDetail {
  const cycle = cycles.find((item) => cycleMatchesPointer(item, leak.affectedPointer)) || cycles.find((item) => item.affectedFlow.includes("Execução"));

  return {
    title: leak.name,
    subtitle: leak.affectedFlow,
    status: leak.severity,
    affectedPointer: leak.affectedPointer,
    estimatedImpact: leak.estimatedCost,
    dataType: "Estimado",
    description: `${formatNumber(leak.hoursPerMonth)}h/mês estimadas em ${leak.affectedFlow}.`,
    whyItMatters: "Vazamento operacional indica onde a BVBP pode priorizar melhoria antes de automatizar.",
    facts: [
      { label: "Horas/mês", value: `${formatNumber(leak.hoursPerMonth)}h` },
      { label: "Fonte", value: leak.source },
      { label: "Hipótese de causa", value: "Falta de rotina, dono claro ou passagem de contexto." },
      { label: "Possível ação", value: cycle?.title || "Criar iniciativa conectada ao ponteiro." },
    ],
    evidence: cycle?.evidences.map((evidence) => evidence.description),
    connectedActions: cycle ? [cycle.title] : [],
    nextDecision: cycle?.nextDecision || "Defina a próxima decisão para manter o ciclo vivo.",
  };
}

export function automationDetail(item: AutomationOpportunity, cycles: PdcaCycle[]): PerformanceDetail {
  const cycle = cycles.find((candidate) => item.affectedProcess.toLowerCase().includes(candidate.affectedPointer.toLowerCase())) || cycles.find((candidate) => candidate.title.toLowerCase().includes("pipeline"));

  return {
    title: item.opportunity,
    subtitle: `${item.type} · ${item.affectedProcess}`,
    status: item.status,
    affectedPointer: cycle?.affectedPointer || item.affectedProcess,
    estimatedImpact: item.estimatedImpact,
    dataType: "Estimado",
    description: `${item.hoursPerMonth}h/mês de potencial operacional mapeado.`,
    whyItMatters: "Automação só faz sentido quando ajuda a mover um ponteiro real.",
    facts: [
      { label: "Complexidade", value: item.complexity },
      { label: "Tipo", value: item.type },
      { label: "Ainda precisa validar", value: "Evidência do gargalo e responsável pelo ciclo." },
    ],
    evidence: cycle?.evidences.map((evidence) => evidence.description),
    connectedActions: cycle ? [cycle.title] : [],
    nextDecision: cycle?.nextDecision || "Defina a próxima decisão antes de automatizar.",
  };
}
