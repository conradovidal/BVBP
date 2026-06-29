import { Helmet } from "react-helmet-async";
import { useOutletContext } from "react-router-dom";
import { EmptyState } from "@/components/performance/EmptyState";
import { MetricCard } from "@/components/performance/MetricCard";
import { SectionHeader } from "@/components/performance/SectionHeader";
import { StatusBadge } from "@/components/performance/StatusBadge";
import { type Company, createOverviewMetrics, getCompanyPortfolioSignal, impactCycles, isBvbpInternalWorkspace } from "@/data/performanceSystem";
import { formatMetricValue } from "@/lib/performanceFormatters";
import { getBvbpPdcaCycles } from "@/lib/pdcaCycleStore";

const metricLabels: Record<string, string> = {
  "metric-monthly-revenue": "Receita",
  "metric-savings": "Potencial",
  "metric-revenue-risk": "Risco",
  "metric-active-cycles": "Ciclos",
};

const PerformancePointersPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const isInternalWorkspace = isBvbpInternalWorkspace(activeCompany);
  const cycles = isInternalWorkspace ? getBvbpPdcaCycles() : [];
  const activeCycleCount = cycles.filter((cycle) => !["Padronizar", "Pausar"].includes(cycle.pdcaStatus)).length;
  const metrics = createOverviewMetrics(activeCompany).map((metric) =>
    isInternalWorkspace && metric.id === "metric-active-cycles" ? { ...metric, value: activeCycleCount } : metric
  );
  const signal = getCompanyPortfolioSignal(activeCompany);
  const featuredMetrics = metrics.filter((metric) =>
    ["metric-monthly-revenue", "metric-savings", "metric-revenue-risk", "metric-active-cycles"].includes(metric.id)
  );
  const connectedCycles = isInternalWorkspace
    ? cycles.map((cycle) => ({
        id: cycle.id,
        metric: cycle.affectedPointer,
        baseline: cycle.title,
        target90Days: cycle.nextDecision || "Sem próxima decisão",
        current: cycle.pdcaStatus,
        status: cycle.pdcaStatus,
      }))
    : impactCycles;

  return (
    <>
      <Helmet>
        <title>Ponteiros | BVBP Performance System</title>
        <meta name="description" content="Ponteiros do negócio e decisões priorizadas." />
      </Helmet>

      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-[#1B365D] sm:text-3xl">Ponteiros</h1>
          <p className="text-sm text-slate-500">{activeCompany.name}</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featuredMetrics.map((metric) => {
            const value =
              metric.id === "metric-savings" ? `${formatMetricValue(metric)}/mês` : formatMetricValue(metric);

            return (
              <MetricCard
                key={metric.id}
                title={metricLabels[metric.id] || metric.name}
                value={value}
                accent={metric.category === "risk" ? "orange" : metric.category === "operational" ? "green" : "blue"}
              />
            );
          })}
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader title="Ponteiro crítico" />
            <p className="mt-4 font-heading text-2xl font-bold text-[#1B365D]">{signal.criticalPointer}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{signal.nextAction}</p>
          </article>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader title="Ciclos conectados" />
            <div className="mt-4 grid gap-3">
              {connectedCycles.map((cycle) => (
                <div key={cycle.id} className="flex flex-col gap-2 rounded-md bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[#1B365D]">{cycle.metric}</p>
                    <p className="text-sm text-slate-500">
                      {cycle.baseline} para {cycle.target90Days}
                    </p>
                  </div>
                  <StatusBadge label={cycle.status} />
                </div>
              ))}
              {!connectedCycles.length && (
                <EmptyState
                  title="Nenhum ciclo ativo ainda."
                  description="Crie a primeira iniciativa conectada a um ponteiro."
                  className="bg-slate-50"
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PerformancePointersPage;
