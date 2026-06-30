import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { Bot, DollarSign, Filter, SlidersHorizontal } from "lucide-react";
import { EmptyState } from "@/components/performance/EmptyState";
import { MetricCard } from "@/components/performance/MetricCard";
import { PerformanceDetailDialog, type PerformanceDetail } from "@/components/performance/PerformanceDetailDialog";
import { SectionHeader } from "@/components/performance/SectionHeader";
import { StatusBadge } from "@/components/performance/StatusBadge";
import {
  automationOpportunities,
  createFunnelMetrics,
  createOverviewMetrics,
  getAutomationOpportunitySummary,
  getCompanyPortfolioSignal,
  getFunnelChannelsForCompany,
  getFunnelSignalsForCompany,
  getPipelineOpportunitiesForCompany,
  impactCycles,
  isBvbpInternalWorkspace,
  operationalLeaks,
  type Company,
  type FunnelMetric,
  type Metric,
} from "@/data/performanceSystem";
import { automationDetail, funnelMetricDetail, metricDetail, operationalLeakDetail, pipelineOpportunityDetail } from "@/lib/performanceDetails";
import { formatCurrency, formatMetricValue, formatNumber } from "@/lib/performanceFormatters";
import { getBvbpPdcaCycles } from "@/lib/pdcaCycleStore";
import { cn } from "@/lib/utils";

type PointerPillarId = "financial" | "commercial" | "operation" | "technology";

const pointerPillars: Array<{
  id: PointerPillarId;
  title: string;
  description: string;
  icon: typeof DollarSign;
}> = [
  {
    id: "financial",
    title: "Finanças",
    description: "Receita, margem, custo, caixa, risco e potencial.",
    icon: DollarSign,
  },
  {
    id: "commercial",
    title: "Comercial",
    description: "Origem, conversão, pipeline, follow-up e proposta.",
    icon: Filter,
  },
  {
    id: "operation",
    title: "Operação",
    description: "Fluxo, espera, retrabalho, capacidade e entrega.",
    icon: SlidersHorizontal,
  },
  {
    id: "technology",
    title: "Tecnologia",
    description: "Dados, IA e sistemas quando movem ponteiro real.",
    icon: Bot,
  },
];

const pillarAliases: Record<string, PointerPillarId> = {
  money: "financial",
  financeiro: "financial",
  funnel: "commercial",
  commercial: "commercial",
  comercial: "commercial",
  operation: "operation",
  operations: "operation",
  operacao: "operation",
  automations: "technology",
  automation: "technology",
  technology: "technology",
  tecnologia: "technology",
};

const overviewMetricLabels: Record<string, string> = {
  "metric-monthly-revenue": "Receita",
  "metric-margin": "Margem",
  "metric-operational-cost": "Custo",
  "metric-savings": "Potencial",
  "metric-revenue-risk": "Risco",
  "metric-active-cycles": "Ciclos",
  "metric-pipeline": "Pipeline",
  "metric-diagnostics": "Diagnósticos",
  "metric-proposals": "Propostas",
  "metric-conversion": "Conversão",
  "metric-content": "Conteúdos",
};

const funnelMetricLabels: Record<string, string> = {
  leads: "Leads",
  meetings: "Conversas",
  diagnostics: "Diagnósticos",
  proposals: "Propostas",
  conversion: "Conversão",
  ticket: "Ticket",
  pipeline: "Pipeline",
  "next-action": "Ações",
};

function formatFunnelMetric(metric: FunnelMetric) {
  if (metric.unit === "currency") return formatCurrency(metric.value);
  if (metric.unit === "percentage") return `${metric.value}%`;
  return formatNumber(metric.value);
}

function formatOverviewMetric(metric: Metric) {
  return metric.id === "metric-savings" ? `${formatMetricValue(metric)}/mês` : formatMetricValue(metric);
}

function getActivePillar(value: string | null): PointerPillarId {
  if (!value) return "financial";
  return pillarAliases[value] || (pointerPillars.some((pillar) => pillar.id === value) ? (value as PointerPillarId) : "financial");
}

const compactButtonClass =
  "rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4 text-left shadow-none transition hover:border-bvbp-forest/30 hover:bg-bvbp-inset";

const PerformancePointersPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [detail, setDetail] = useState<PerformanceDetail | null>(null);
  const activePillarId = getActivePillar(searchParams.get("pillar"));
  const activePillar = pointerPillars.find((pillar) => pillar.id === activePillarId) || pointerPillars[0];
  const isInternalWorkspace = isBvbpInternalWorkspace(activeCompany);
  const pdcaCycles = isInternalWorkspace ? getBvbpPdcaCycles() : [];
  const connectedCycles = isInternalWorkspace ? pdcaCycles : impactCycles;
  const activeCycleCount = pdcaCycles.filter((cycle) => !["Padronizar", "Pausar"].includes(cycle.pdcaStatus)).length;
  const signal = getCompanyPortfolioSignal(activeCompany);

  const overviewMetrics = useMemo(
    () =>
      createOverviewMetrics(activeCompany).map((metric) =>
        isInternalWorkspace && metric.id === "metric-active-cycles" ? { ...metric, value: activeCycleCount } : metric,
      ),
    [activeCompany, activeCycleCount, isInternalWorkspace],
  );
  const financialMetrics = overviewMetrics.filter((metric) =>
    isInternalWorkspace
      ? ["metric-monthly-revenue", "metric-pipeline", "metric-savings", "metric-active-cycles"].includes(metric.id)
      : ["metric-monthly-revenue", "metric-margin", "metric-operational-cost", "metric-savings", "metric-revenue-risk", "metric-active-cycles"].includes(metric.id),
  );
  const funnelMetrics = createFunnelMetrics(activeCompany);
  const pipelineOpportunities = getPipelineOpportunitiesForCompany(activeCompany);
  const funnelChannels = getFunnelChannelsForCompany(activeCompany);
  const funnelSignals = getFunnelSignalsForCompany(activeCompany);
  const totalHours = operationalLeaks.reduce((sum, leak) => sum + leak.hoursPerMonth, 0);
  const totalEstimatedCost = operationalLeaks.reduce((sum, leak) => sum + leak.estimatedCost, 0);
  const highSeverity = operationalLeaks.filter((leak) => leak.severity === "Alta").length;
  const automationSummary = getAutomationOpportunitySummary();

  const setPillar = (pillarId: PointerPillarId) => {
    setSearchParams(pillarId === "financial" ? {} : { pillar: pillarId });
  };

  return (
    <>
      <Helmet>
        <title>Ponteiros | BVBP Performance System</title>
        <meta name="description" content="Ponteiros por pilar do Método BVBP." />
      </Helmet>

      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-bvbp-ink sm:text-3xl">Ponteiros</h1>
          <p className="max-w-2xl text-sm leading-6 text-bvbp-muted-ink">
            {activeCompany.name} · quatro pilares para entender o que mover antes de abrir um ciclo PDCA.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Pilares de ponteiros">
          {pointerPillars.map((pillar) => {
            const Icon = pillar.icon;
            const isActive = pillar.id === activePillarId;

            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setPillar(pillar.id)}
                className={cn(
                  "rounded-[8px] border p-4 text-left transition-colors",
                  isActive
                    ? "border-bvbp-forest bg-bvbp-forest text-bvbp-ivory"
                    : "border-bvbp-ink/10 bg-bvbp-raised text-bvbp-ink hover:border-bvbp-forest/35 hover:bg-bvbp-inset",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-heading text-lg font-bold leading-tight">{pillar.title}</h2>
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-bvbp-gold" : "text-bvbp-forest")} aria-hidden="true" />
                </div>
                <p className={cn("mt-3 text-sm leading-5", isActive ? "text-bvbp-ivory/72" : "text-bvbp-muted-ink")}>
                  {pillar.description}
                </p>
              </button>
            );
          })}
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,0.74fr)_minmax(0,1.26fr)]">
          <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5 shadow-none">
            <SectionHeader title="Ponteiro crítico" />
            <p className="mt-4 font-heading text-2xl font-bold text-bvbp-ink">{signal.criticalPointer}</p>
            <p className="mt-3 text-sm leading-6 text-bvbp-muted-ink">{signal.nextAction}</p>
          </article>

          <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5 shadow-none">
            <SectionHeader title="Ciclos conectados" />
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {connectedCycles.slice(0, 4).map((cycle) => (
                <div key={cycle.id} className="rounded-md bg-bvbp-inset p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-bvbp-ink">{"metric" in cycle ? cycle.metric : cycle.affectedPointer}</p>
                    <StatusBadge label={"status" in cycle ? cycle.status : cycle.pdcaStatus} />
                  </div>
                  <p className="mt-2 text-sm leading-5 text-bvbp-muted-ink">
                    {"target90Days" in cycle ? `${cycle.baseline} para ${cycle.target90Days}` : cycle.nextDecision || cycle.title}
                  </p>
                </div>
              ))}
              {!connectedCycles.length && (
                <EmptyState
                  title="Nenhum ciclo ativo ainda."
                  description="Crie uma iniciativa PDCA conectada a um ponteiro."
                  className="md:col-span-2"
                />
              )}
            </div>
          </article>
        </section>

        <section className="space-y-4">
          <SectionHeader title={activePillar.title} description={activePillar.description} />

          {activePillarId === "financial" && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {financialMetrics.map((metric) => (
                  <button
                    type="button"
                    key={metric.id}
                    onClick={() => setDetail(metricDetail(metric, overviewMetricLabels[metric.id] || metric.name, pdcaCycles))}
                    className="text-left transition hover:-translate-y-0.5"
                  >
                    <MetricCard
                      title={overviewMetricLabels[metric.id] || metric.name}
                      value={formatOverviewMetric(metric)}
                      accent={metric.category === "risk" ? "orange" : metric.category === "operational" ? "green" : "blue"}
                    />
                  </button>
                ))}
              </div>
              <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5 text-sm leading-6 text-bvbp-ink">
                Finanças existe para separar leitura executiva de diagnóstico detalhado: poucos números,
                próximos passos claros e evidência para decidir.
              </article>
            </div>
          )}

          {activePillarId === "commercial" && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {funnelMetrics.map((metric) => (
                  <button
                    type="button"
                    key={metric.id}
                    onClick={() => setDetail(funnelMetricDetail(metric, funnelMetricLabels[metric.id] || metric.name, pdcaCycles))}
                    className="text-left transition hover:-translate-y-0.5"
                  >
                    <MetricCard title={funnelMetricLabels[metric.id] || metric.name} value={formatFunnelMetric(metric)} accent="blue" />
                  </button>
                ))}
              </div>

              {pipelineOpportunities.length ? (
                <div className="grid gap-3 lg:grid-cols-2">
                  {pipelineOpportunities.map((opportunity) => (
                    <button
                      type="button"
                      key={opportunity.id}
                      onClick={() => setDetail(pipelineOpportunityDetail(opportunity, pdcaCycles))}
                      className={compactButtonClass}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-heading text-base font-bold text-bvbp-ink">{opportunity.opportunity}</h3>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
                            {opportunity.origin} · {opportunity.stage}
                          </p>
                        </div>
                        <StatusBadge label={opportunity.status} />
                      </div>
                      <p className="mt-4 font-semibold text-bvbp-positive">{formatCurrency(opportunity.potential)}</p>
                      <p className="mt-2 text-sm leading-5 text-bvbp-ink">{opportunity.nextAction}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 lg:grid-cols-2">
                  {funnelChannels.map((channel) => (
                    <article key={channel.id} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-heading text-base font-bold text-bvbp-ink">{channel.channel}</h3>
                        <StatusBadge label={channel.status} />
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                        <span>{formatNumber(channel.entry)} entradas</span>
                        <span>{channel.conversion}% conv.</span>
                        <span className="font-semibold text-bvbp-positive">{formatCurrency(channel.estimatedRevenue)}</span>
                      </div>
                      <p className="mt-3 text-sm leading-5 text-bvbp-muted-ink">{channel.observation}</p>
                    </article>
                  ))}
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                {funnelSignals.map((signalText) => (
                  <article key={signalText} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4 text-sm leading-6 text-bvbp-ink">
                    {signalText}
                  </article>
                ))}
              </div>
            </div>
          )}

          {activePillarId === "operation" && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <MetricCard title="Horas" value={`${formatNumber(totalHours)}h`} accent="blue" />
                <MetricCard title="Custo" value={`${formatCurrency(totalEstimatedCost)}/mês`} accent="green" />
                <MetricCard title="Alta severidade" value={formatNumber(highSeverity)} accent="orange" />
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {operationalLeaks.map((leak) => (
                  <button
                    type="button"
                    key={leak.id}
                    onClick={() => setDetail(operationalLeakDetail(leak, pdcaCycles))}
                    className={compactButtonClass}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-heading text-base font-bold text-bvbp-ink">{leak.name}</h3>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">{leak.affectedFlow}</p>
                      </div>
                      <StatusBadge label={leak.severity} />
                    </div>
                    <p className="mt-4 text-sm text-bvbp-ink">{leak.affectedPointer}</p>
                    <p className="mt-2 font-semibold text-bvbp-positive">{formatCurrency(leak.estimatedCost)}/mês</p>
                  </button>
                ))}
              </div>
              <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5 text-sm leading-6 text-bvbp-ink">
                Estimativas para priorizar melhorias, não auditoria financeira.
              </article>
            </div>
          )}

          {activePillarId === "technology" && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard title="Oportunidades" value={formatNumber(automationSummary.opportunities)} accent="blue" />
                <MetricCard title="Horas manuais" value={`${formatNumber(automationSummary.manualHours)}h/mês`} accent="orange" />
                <MetricCard title="Potencial" value={`${formatCurrency(automationSummary.estimatedPotential)}/mês`} accent="green" />
                <MetricCard title="Em andamento" value={formatNumber(automationSummary.running)} accent="gray" />
              </div>
              <article className="rounded-[8px] border border-bvbp-forest/15 bg-bvbp-raised p-5 text-sm font-semibold text-bvbp-ink">
                Tecnologia só entra quando ajuda a mover um ponteiro real.
              </article>
              <div className="grid gap-3 lg:grid-cols-2">
                {automationOpportunities.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setDetail(automationDetail(item, pdcaCycles))}
                    className={compactButtonClass}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-heading text-base font-bold text-bvbp-ink">{item.opportunity}</h3>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
                          {item.type} · {item.affectedProcess}
                        </p>
                      </div>
                      <StatusBadge label={item.status} />
                    </div>
                    <p className="mt-4 text-sm text-bvbp-ink">{formatNumber(item.hoursPerMonth)}h/mês</p>
                    <p className="mt-2 font-semibold text-bvbp-positive">{formatCurrency(item.estimatedImpact)}/mês</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <PerformanceDetailDialog detail={detail} open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)} />
    </>
  );
};

export default PerformancePointersPage;
