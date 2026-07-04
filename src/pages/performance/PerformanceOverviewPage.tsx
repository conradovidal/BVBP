import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useOutletContext } from "react-router-dom";
import { PerformanceDetailDialog, type PerformanceDetail } from "@/components/performance/PerformanceDetailDialog";
import { MetricCard } from "@/components/performance/MetricCard";
import { SectionHeader } from "@/components/performance/SectionHeader";
import { StatusBadge } from "@/components/performance/StatusBadge";
import {
  type Company,
  getMaturityMapForCompany,
  getOverviewPillarHighlights,
  type MaturityMapItem,
  type OverviewPillarHighlight,
  isBvbpInternalWorkspace,
} from "@/data/performanceSystem";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";
import { getConfiguredMaturityMap, getConfiguredOverviewPillarHighlights } from "@/lib/clientConfigurationStore";
import { getPdcaCyclesForCompany } from "@/lib/pdcaCycleStore";
import { cn } from "@/lib/utils";

const highlightAccents: Record<OverviewPillarHighlight["id"], "blue" | "green" | "orange" | "gray"> = {
  financial: "green",
  commercial: "blue",
  operational: "orange",
  automation: "gray",
};

const pillarAccentClasses = {
  money: {
    top: "border-t-bvbp-positive",
    rail: "bg-bvbp-positive",
  },
  funnel: {
    top: "border-t-bvbp-gold",
    rail: "bg-bvbp-gold",
  },
  operation: {
    top: "border-t-bvbp-gold",
    rail: "bg-bvbp-gold",
  },
  "tech-ai": {
    top: "border-t-bvbp-forest",
    rail: "bg-bvbp-forest",
  },
};

function formatHighlightValue(highlight: OverviewPillarHighlight) {
  if (highlight.value === undefined) return "Sem valor";
  if (highlight.unit === "currency") return `${formatCurrency(highlight.value)}/mês`;
  if (highlight.unit === "percentage") return `${highlight.value}%`;
  if (highlight.unit === "hours") return `${formatNumber(highlight.value)}h`;
  if (highlight.unit === "days") return `${formatNumber(highlight.value)} dias`;
  return formatNumber(highlight.value);
}

function formatMetricValue(metric: OverviewPillarHighlight["metrics"][number]) {
  if (metric.value === undefined) return "Sem valor";
  if (metric.unit === "currency") return `${formatCurrency(metric.value)}/mês`;
  if (metric.unit === "percentage") return `${metric.value}%`;
  if (metric.unit === "hours") return `${formatNumber(metric.value)}h`;
  if (metric.unit === "days") return `${formatNumber(metric.value)} dias`;
  return formatNumber(metric.value);
}

function highlightDetail(highlight: OverviewPillarHighlight): PerformanceDetail {
  return {
    title: highlight.pillar,
    subtitle: highlight.metricLabel,
    affectedPointer: highlight.metricLabel,
    estimatedImpact: highlight.value === undefined ? "Sem valor" : highlight.unit === "currency" ? highlight.value : formatHighlightValue(highlight),
    dataType: highlight.dataType,
    description: highlight.description,
    whyItMatters: "Este pilar resume os ponteiros que orientam a decisão executiva antes do aprofundamento.",
    facts: highlight.metrics.map((metric) => ({
      label: `${metric.label} · ${metric.dataType}`,
      value: `${formatMetricValue(metric)} · ${metric.source}`,
    })),
    nextDecision: "Aprofundar em Ponteiros ou abrir uma iniciativa conectada.",
  };
}

function maturityDetail(item: MaturityMapItem, connectedActions: string[]): PerformanceDetail {
  return {
    title: item.name,
    subtitle: `Nível ${item.score} · ${item.currentLevelLabel}`,
    status: item.status,
    affectedPointer: item.name,
    dataType: "Mockado",
    description: item.currentMeaning,
    whyItMatters: item.description,
    facts: [
      { label: "Nível atual", value: `${item.score}/5 · ${item.currentLevelLabel}` },
      { label: "Próximo nível", value: `${item.nextLevel}/5 · ${item.nextLevelLabel}` },
    ],
    connectedActions,
    nextDecision: item.advancementCriteria.join(" · "),
  };
}

function initiativeDetail(cycle: ReturnType<typeof getPdcaCyclesForCompany>[number]): PerformanceDetail {
  return {
    title: cycle.title,
    subtitle: `${cycle.affectedPointer} · ${cycle.pdcaStatus}`,
    status: cycle.pdcaStatus,
    affectedPointer: cycle.affectedPointer,
    estimatedImpact: cycle.estimatedImpact,
    dataType: cycle.dataType,
    description: cycle.hypothesis,
    whyItMatters: cycle.whyItMatters,
    facts: [
      { label: "Responsável", value: cycle.owner },
      { label: "Início", value: cycle.startDate || "A confirmar" },
      { label: "Fim", value: cycle.endDate || cycle.deadline },
      { label: "Baseline", value: cycle.baseline || "A confirmar" },
      { label: "Objetivo", value: cycle.target || "A confirmar" },
    ],
    evidence: cycle.evidences.map((evidence) => evidence.description),
    connectedActions: cycle.actions?.map((action) => `${action.title} · ${action.owner}`) || [cycle.plannedAction],
    nextDecision: cycle.nextDecision,
  };
}

const PerformanceOverviewPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [detail, setDetail] = useState<PerformanceDetail | null>(null);
  const isInternalWorkspace = isBvbpInternalWorkspace(activeCompany);
  const cycles = getPdcaCyclesForCompany(activeCompany);
  const overviewHighlights = getConfiguredOverviewPillarHighlights(activeCompany, getOverviewPillarHighlights(activeCompany));
  const maturityMap = getConfiguredMaturityMap(activeCompany, getMaturityMapForCompany(activeCompany));
  const priorityInitiatives = cycles.slice(0, 3);
  const pageTitle = isInternalWorkspace ? "Portal BVBP" : "Visão geral";

  return (
    <>
      <Helmet>
        <title>Visão geral | BVBP Performance System</title>
        <meta name="description" content="Painel executivo do Método BVBP de Performance Operacional." />
      </Helmet>

      <div className="space-y-7">
        <section>
          <h1 className="font-heading text-2xl font-bold text-bvbp-ink sm:text-3xl">{pageTitle}</h1>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {overviewHighlights.map((highlight) => (
            <button
              type="button"
              key={highlight.id}
              onClick={() => setDetail(highlightDetail(highlight))}
              className="text-left transition hover:-translate-y-0.5"
            >
              <MetricCard
                title={highlight.pillar}
                value={formatHighlightValue(highlight)}
                accent={highlightAccents[highlight.id]}
                helper={`${highlight.metricLabel} · ${highlight.dataType}`}
                showHelper
              />
            </button>
          ))}
        </section>

        <section className="space-y-4">
          <SectionHeader title="Mapa BVBP" description="Maturidade por pilar, com próximo avanço explícito." />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {maturityMap.map((pillar) => {
              const accent = pillarAccentClasses[pillar.id as keyof typeof pillarAccentClasses] || pillarAccentClasses.money;
              const relatedInitiatives = cycles
                .filter((cycle) => {
                  const text = `${cycle.affectedPointer} ${cycle.affectedFlow} ${cycle.title}`.toLowerCase();
                  if (pillar.id === "money") return text.includes("finan") || text.includes("receita") || text.includes("potencial");
                  if (pillar.id === "funnel") return text.includes("comercial") || text.includes("pipeline") || text.includes("proposta");
                  if (pillar.id === "operation") return text.includes("opera") || text.includes("execu") || text.includes("fluxo");
                  return text.includes("automa") || text.includes("tecnologia") || text.includes("conteúdo") || text.includes("site");
                })
                .map((cycle) => cycle.title);

              return (
                <button
                  type="button"
                  key={pillar.id}
                  onClick={() => setDetail(maturityDetail(pillar, relatedInitiatives))}
                  className={cn(
                    "rounded-[8px] border border-t-2 border-bvbp-ink/10 bg-bvbp-raised p-4 text-left shadow-none",
                    "transition hover:border-x-bvbp-forest/25 hover:border-b-bvbp-forest/25",
                    accent.top
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-heading text-base font-bold text-bvbp-ink">{pillar.name}</h2>
                    <StatusBadge label={pillar.status} />
                  </div>
                  <p className="mt-6 font-heading text-3xl font-bold leading-none text-bvbp-ink">{pillar.score}/5</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
                    {pillar.currentLevelLabel}
                  </p>
                  <div className="mt-4 flex gap-1.5" aria-label={`${pillar.name}: ${pillar.score} de 5`}>
                    {[1, 2, 3, 4, 5].map((step) => (
                      <span
                        key={step}
                        className={cn("h-1 flex-1 rounded-full", step <= pillar.score ? accent.rail : "bg-bvbp-inset")}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-xs font-medium leading-5 text-bvbp-muted-ink">
                    Próximo: {pillar.nextLevel}/5 · {pillar.nextLevelLabel}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Iniciativas prioritárias" description="Os três movimentos mais importantes para mover ponteiros agora." />
          <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised shadow-none">
            {priorityInitiatives.length ? (
              <ul className="divide-y divide-bvbp-ink/10">
                {priorityInitiatives.map((cycle, index) => (
                  <li key={cycle.id}>
                  <button
                    type="button"
                    onClick={() => setDetail(initiativeDetail(cycle))}
                    className="grid w-full gap-3 px-4 py-4 text-left text-sm leading-6 text-bvbp-ink transition hover:bg-bvbp-inset sm:grid-cols-[32px_minmax(0,1fr)_auto]"
                  >
                    <span className="font-heading text-sm font-bold text-bvbp-muted-ink">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-bvbp-ink">{cycle.title}</span>
                      <span className="mt-1 block text-xs font-medium text-bvbp-muted-ink">
                        {cycle.affectedPointer} · {cycle.owner} · {cycle.nextDecision}
                      </span>
                    </span>
                    <StatusBadge label={cycle.pdcaStatus} />
                  </button>
                </li>
              ))}
            </ul>
            ) : (
              <div className="p-4 text-sm text-bvbp-muted-ink">Nenhuma iniciativa priorizada ainda.</div>
            )}
          </div>
        </section>
      </div>
      <PerformanceDetailDialog detail={detail} open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)} />
    </>
  );
};

export default PerformanceOverviewPage;
