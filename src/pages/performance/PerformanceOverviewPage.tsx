import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useOutletContext } from "react-router-dom";
import { PerformanceDetailDialog, type PerformanceDetail } from "@/components/performance/PerformanceDetailDialog";
import { MetricCard } from "@/components/performance/MetricCard";
import { SectionHeader } from "@/components/performance/SectionHeader";
import { StatusBadge } from "@/components/performance/StatusBadge";
import {
  type Company,
  createOverviewMetrics,
  getDiagnosticSignalsForCompany,
  getPillarsForCompany,
  getWeeklySummaryForCompany,
  isBvbpInternalWorkspace,
} from "@/data/performanceSystem";
import { formatMetricValue } from "@/lib/performanceFormatters";
import { buildBvbpWeeklySummary, getBvbpPdcaCycles } from "@/lib/pdcaCycleStore";
import { metricDetail, pillarDetail, signalDetail, weeklySummaryDetail } from "@/lib/performanceDetails";
import { cn } from "@/lib/utils";

const metricLabels: Record<string, string> = {
  "metric-monthly-revenue": "Receita",
  "metric-margin": "Margem",
  "metric-operational-cost": "Custo",
  "metric-pipeline": "Pipeline comercial",
  "metric-diagnostics": "Diagnósticos",
  "metric-proposals": "Propostas",
  "metric-conversion": "Conversão",
  "metric-content": "Conteúdos",
  "metric-savings": "Potencial",
  "metric-revenue-risk": "Risco",
  "metric-active-cycles": "Ciclos",
};

const metricAccents: Record<string, "blue" | "green" | "orange" | "gray"> = {
  "metric-monthly-revenue": "green",
  "metric-margin": "green",
  "metric-operational-cost": "blue",
  "metric-pipeline": "green",
  "metric-diagnostics": "blue",
  "metric-proposals": "blue",
  "metric-conversion": "orange",
  "metric-content": "gray",
  "metric-savings": "green",
  "metric-revenue-risk": "orange",
  "metric-active-cycles": "blue",
};

const pillarAccentClasses = {
  money: {
    top: "border-t-[#38A169]",
    rail: "bg-[#38A169]",
  },
  funnel: {
    top: "border-t-[#ED8936]",
    rail: "bg-[#ED8936]",
  },
  operation: {
    top: "border-t-[#ED8936]",
    rail: "bg-[#ED8936]",
  },
  "tech-ai": {
    top: "border-t-[#1B365D]",
    rail: "bg-[#1B365D]",
  },
};

const PerformanceOverviewPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [detail, setDetail] = useState<PerformanceDetail | null>(null);
  const isInternalWorkspace = isBvbpInternalWorkspace(activeCompany);
  const cycles = isInternalWorkspace ? getBvbpPdcaCycles() : [];
  const activeCycleCount = cycles.filter((cycle) => !["Padronizar", "Pausar"].includes(cycle.pdcaStatus)).length;
  const overviewMetrics = createOverviewMetrics(activeCompany).map((metric) =>
    isInternalWorkspace && metric.id === "metric-active-cycles" ? { ...metric, value: activeCycleCount } : metric
  );
  const weeklySummary = isInternalWorkspace
    ? buildBvbpWeeklySummary(cycles)
    : getWeeklySummaryForCompany(activeCompany);
  const pillars = getPillarsForCompany(activeCompany);
  const visibleSignals = getDiagnosticSignalsForCompany(activeCompany).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>Overview | BVBP Performance System</title>
        <meta name="description" content="Painel executivo do Método BVBP de Performance Operacional." />
      </Helmet>

      <div className="space-y-7">
        <section className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-slate-500">Método BVBP</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold text-[#1B365D] sm:text-3xl">Overview</h1>
              <p className="mt-1 text-sm text-slate-500">{activeCompany.name}</p>
            </div>
            <p className="text-sm font-medium text-slate-500">Síntese executiva</p>
          </div>
        </section>

        {weeklySummary.length > 0 && (
          <section className="space-y-4">
            <SectionHeader title="Resumo da semana" />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {weeklySummary.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => isInternalWorkspace && setDetail(weeklySummaryDetail(item, cycles))}
                  className={cn(
                    "rounded-[8px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_1px_0_rgba(15,23,42,0.03)]",
                    isInternalWorkspace && "transition hover:border-[#1B365D]/35 hover:bg-[#F8FBFD]"
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#1B365D]/45">{item.label}</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#1B365D]">{item.value}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {overviewMetrics.map((metric) => {
            const value =
              metric.id === "metric-savings" ? `${formatMetricValue(metric)}/mês` : formatMetricValue(metric);
            const card = (
              <MetricCard
                title={metricLabels[metric.id] || metric.name}
                value={value}
                accent={metricAccents[metric.id] || "blue"}
                helper={metric.confidenceLevel}
                showHelper={isInternalWorkspace}
              />
            );

            return isInternalWorkspace ? (
              <button
                type="button"
                key={metric.id}
                onClick={() => setDetail(metricDetail(metric, metricLabels[metric.id] || metric.name, cycles))}
                className="text-left transition hover:-translate-y-0.5"
              >
                {card}
              </button>
            ) : (
              <div key={metric.id}>{card}</div>
            );
          })}
        </section>

        <section className="space-y-4">
          <SectionHeader title="Mapa BVBP" />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar) => {
              const accent = pillarAccentClasses[pillar.id as keyof typeof pillarAccentClasses] || pillarAccentClasses.money;

              return (
                <button
                  type="button"
                  key={pillar.id}
                  onClick={() => isInternalWorkspace && setDetail(pillarDetail(pillar, cycles))}
                  className={cn(
                    "rounded-[8px] border border-t-2 border-slate-200/80 bg-white p-4 text-left shadow-[0_1px_0_rgba(15,23,42,0.03)]",
                    isInternalWorkspace && "transition hover:border-x-[#1B365D]/25 hover:border-b-[#1B365D]/25",
                    accent.top
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-heading text-base font-bold text-[#1B365D]">{pillar.name}</h2>
                    <StatusBadge label={pillar.status} />
                  </div>
                  <p className="mt-7 font-heading text-3xl font-bold leading-none text-[#1B365D]">{pillar.score}/5</p>
                  <div className="mt-4 flex gap-1.5" aria-label={`${pillar.name}: ${pillar.score} de 5`}>
                    {[1, 2, 3, 4, 5].map((step) => (
                      <span
                        key={step}
                        className={cn("h-1 flex-1 rounded-full", step <= pillar.score ? accent.rail : "bg-slate-100")}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Principais sinais" />
          <div className="rounded-[8px] border border-slate-200/80 bg-white shadow-[0_1px_0_rgba(15,23,42,0.03)]">
            <ul className="divide-y divide-slate-100">
              {visibleSignals.map((signal, index) => (
                <li key={signal}>
                  <button
                    type="button"
                    onClick={() => isInternalWorkspace && setDetail(signalDetail(signal, index, cycles))}
                    className={cn(
                      "grid w-full gap-3 px-4 py-3 text-left text-sm leading-6 text-slate-700 sm:grid-cols-[32px_minmax(0,1fr)]",
                      isInternalWorkspace && "transition hover:bg-[#F8FBFD]"
                    )}
                  >
                    <span className="font-heading text-sm font-bold text-[#1B365D]/45">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{signal}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs font-medium text-slate-500">A ausência de dados também é diagnóstico.</p>
        </section>
      </div>
      <PerformanceDetailDialog detail={detail} open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)} />
    </>
  );
};

export default PerformanceOverviewPage;
