import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useOutletContext } from "react-router-dom";
import { EmptyState } from "@/components/performance/EmptyState";
import { PerformanceDetailDialog, type PerformanceDetail } from "@/components/performance/PerformanceDetailDialog";
import { MetricCard } from "@/components/performance/MetricCard";
import { SectionHeader } from "@/components/performance/SectionHeader";
import { StatusBadge } from "@/components/performance/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type Company,
  createFunnelMetrics,
  getFunnelChannelsForCompany,
  getFunnelSignalsForCompany,
  getPipelineOpportunitiesForCompany,
  isBvbpInternalWorkspace,
  type FunnelMetric,
} from "@/data/performanceSystem";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";
import { getBvbpPdcaCycles } from "@/lib/pdcaCycleStore";
import { funnelMetricDetail, pipelineOpportunityDetail } from "@/lib/performanceDetails";
import { cn } from "@/lib/utils";

const metricLabels: Record<string, string> = {
  leads: "Leads",
  meetings: "Reuniões",
  diagnostics: "Diagnósticos",
  proposals: "Propostas",
  conversion: "Conversão",
  ticket: "Ticket",
  pipeline: "Pipeline",
  "next-action": "Ações",
};

const metricAccents = ["blue", "blue", "gray", "orange", "green", "green"] as const;

function formatFunnelMetric(metric: FunnelMetric) {
  if (metric.unit === "currency") return formatCurrency(metric.value);
  if (metric.unit === "percentage") return `${metric.value}%`;
  return formatNumber(metric.value);
}

const PerformanceFunnelPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [detail, setDetail] = useState<PerformanceDetail | null>(null);
  const isInternalWorkspace = isBvbpInternalWorkspace(activeCompany);
  const cycles = isInternalWorkspace ? getBvbpPdcaCycles() : [];
  const metrics = createFunnelMetrics(activeCompany);
  const channels = getFunnelChannelsForCompany(activeCompany);
  const pipelineOpportunities = getPipelineOpportunitiesForCompany(activeCompany);
  const funnelSignals = getFunnelSignalsForCompany(activeCompany);

  return (
    <>
      <Helmet>
        <title>Comercial | BVBP Performance System</title>
        <meta name="description" content="Ponteiros comerciais, pipeline e vazamentos de receita." />
      </Helmet>

      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-bvbp-ink sm:text-3xl">Comercial</h1>
          <p className="text-sm text-bvbp-muted-ink">{activeCompany.name}</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric, index) => {
            const card = (
              <MetricCard
                title={metricLabels[metric.id] || metric.name}
                value={formatFunnelMetric(metric)}
                accent={metricAccents[index]}
              />
            );

            return isInternalWorkspace ? (
              <button
                type="button"
                key={metric.id}
                onClick={() => setDetail(funnelMetricDetail(metric, metricLabels[metric.id] || metric.name, cycles))}
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
          <SectionHeader title={isInternalWorkspace ? "Pipeline BVBP" : "Receita por canal"} />
          {isInternalWorkspace ? (
            pipelineOpportunities.length ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {pipelineOpportunities.map((opportunity) => (
                <button
                  type="button"
                  key={opportunity.id}
                  onClick={() => setDetail(pipelineOpportunityDetail(opportunity, cycles))}
                  className={cn(
                    "rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4 text-left shadow-none",
                    "transition hover:border-bvbp-forest/30 hover:bg-bvbp-inset"
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-heading text-base font-bold text-bvbp-ink">{opportunity.opportunity}</h2>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
                        {opportunity.origin} · {opportunity.stage}
                      </p>
                    </div>
                    <StatusBadge label={opportunity.status} />
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-bvbp-muted-ink/70">Potencial</p>
                      <p className="mt-1 font-semibold text-bvbp-positive">{formatCurrency(opportunity.potential)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-bvbp-muted-ink/70">Responsável</p>
                      <p className="mt-1 font-semibold text-bvbp-ink">{opportunity.owner}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-bvbp-muted-ink/70">Próxima ação</p>
                      <p className="mt-1 text-sm leading-5 text-bvbp-ink">{opportunity.nextAction}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            ) : (
              <EmptyState
                title="Nenhuma oportunidade comercial."
                description="Cadastre uma oportunidade para conectar potencial, próxima ação e ciclo PDCA."
              />
            )
          ) : (
          <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised shadow-none">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Canal</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Conversão</TableHead>
                    <TableHead>Receita estimada</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Observação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channels.length ? channels.map((channel) => (
                    <TableRow key={channel.id}>
                      <TableCell className="min-w-[150px] font-semibold text-bvbp-ink">{channel.channel}</TableCell>
                      <TableCell className="font-semibold text-bvbp-ink">{formatNumber(channel.entry)}</TableCell>
                      <TableCell>{channel.conversion}%</TableCell>
                      <TableCell className="font-semibold text-bvbp-positive">{formatCurrency(channel.estimatedRevenue)}</TableCell>
                      <TableCell>
                        <StatusBadge label={channel.status} />
                      </TableCell>
                      <TableCell className="min-w-[260px] text-bvbp-ink">{channel.observation}</TableCell>
                    </TableRow>
                  )) : null}
                </TableBody>
              </Table>
            </div>
            {!channels.length && (
              <EmptyState
                title="Nenhum canal registrado."
                description="Registre entradas comerciais para comparar origem, conversão e receita estimada."
                className="m-4"
              />
            )}
          </div>
          )}
        </section>

        <section className="space-y-4">
          <SectionHeader title={pipelineOpportunities.length ? "Sinais do pipeline" : "Vazamentos comerciais"} />
          {funnelSignals.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {funnelSignals.map((leak) => (
              <article key={leak} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4 text-sm leading-6 text-bvbp-ink shadow-none">
                {leak}
              </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhum sinal registrado." description="Use os próximos ciclos para registrar aprendizados do pipeline." />
          )}
        </section>
      </div>
      <PerformanceDetailDialog detail={detail} open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)} />
    </>
  );
};

export default PerformanceFunnelPage;
