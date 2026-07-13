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
  getAutomationOpportunitiesForCompany,
  getAutomationOpportunitySummary,
  isBvbpInternalWorkspace,
} from "@/data/performanceSystem";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";
import { getBvbpPdcaCycles } from "@/lib/pdcaCycleStore";
import { automationDetail } from "@/lib/performanceDetails";

const PerformanceAutomationsPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [detail, setDetail] = useState<PerformanceDetail | null>(null);
  const isInternalWorkspace = isBvbpInternalWorkspace(activeCompany);
  const cycles = isInternalWorkspace ? getBvbpPdcaCycles() : [];
  const automationOpportunities = getAutomationOpportunitiesForCompany(activeCompany);
  const summary = getAutomationOpportunitySummary(automationOpportunities);

  return (
    <>
      <Helmet>
        <title>Tecnologia | BVBP Performance System</title>
        <meta name="description" content="Oportunidades de tecnologia, IA, dados e aplicações internas." />
      </Helmet>

      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-bvbp-ink sm:text-3xl">Tecnologia</h1>
          <p className="text-sm text-bvbp-muted-ink">{activeCompany.name}</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Oportunidades"
            value={formatNumber(summary.opportunities)}
            accent="blue"
          />
          <MetricCard
            title="Horas manuais"
            value={`${formatNumber(summary.manualHours)}h/mês`}
            accent="orange"
          />
          <MetricCard
            title="Potencial"
            value={`${formatCurrency(summary.estimatedPotential)}/mês`}
            accent="green"
          />
          <MetricCard
            title="Em andamento"
            value={formatNumber(summary.running)}
            accent="gray"
          />
        </section>

        <article className="rounded-[8px] border border-bvbp-forest/15 bg-bvbp-raised p-5 shadow-none">
          <p className="text-sm font-semibold text-bvbp-ink">Tecnologia só entra quando ajuda a mover um ponteiro real.</p>
        </article>

        <section className="space-y-4">
          <SectionHeader title="Mapa de oportunidades" />
          {isInternalWorkspace ? (
            automationOpportunities.length ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {automationOpportunities.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setDetail(automationDetail(item, cycles))}
                  className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4 text-left shadow-none transition hover:border-bvbp-forest/30 hover:bg-bvbp-inset"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-heading text-base font-bold text-bvbp-ink">{item.opportunity}</h2>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
                        {item.type} · {item.affectedProcess}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <StatusBadge label={item.complexity} />
                      <StatusBadge label={item.status} />
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-bvbp-muted-ink/70">Horas</p>
                      <p className="mt-1 font-semibold text-bvbp-ink">{formatNumber(item.hoursPerMonth)}h/mês</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-bvbp-muted-ink/70">Potencial</p>
                      <p className="mt-1 font-semibold text-bvbp-positive">{formatCurrency(item.estimatedImpact)}/mês</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-bvbp-muted-ink/70">Ponteiro</p>
                      <p className="mt-1 text-sm font-semibold text-bvbp-ink">{item.affectedProcess}</p>
                    </div>
                  </div>
                </button>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhuma tecnologia mapeada."
                description="Tecnologia só entra quando houver ponteiro, gargalo e próxima decisão."
              />
            )
          ) : (
          <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised shadow-none">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Oportunidade</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Processo afetado</TableHead>
                    <TableHead>Horas/mês</TableHead>
                    <TableHead>Potencial estimado</TableHead>
                    <TableHead>Complexidade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automationOpportunities.length ? automationOpportunities.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="min-w-[260px] font-semibold text-bvbp-ink">{item.opportunity}</TableCell>
                      <TableCell className="min-w-[150px] text-bvbp-ink">{item.type}</TableCell>
                      <TableCell className="min-w-[180px] text-bvbp-ink">{item.affectedProcess}</TableCell>
                      <TableCell className="font-semibold text-bvbp-ink">{formatNumber(item.hoursPerMonth)}h</TableCell>
                      <TableCell className="font-semibold text-bvbp-positive">{formatCurrency(item.estimatedImpact)}/mês</TableCell>
                      <TableCell>
                        <StatusBadge label={item.complexity} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge label={item.status} />
                      </TableCell>
                    </TableRow>
                  )) : null}
                </TableBody>
              </Table>
            </div>
            {!automationOpportunities.length && (
              <EmptyState
                title="Nenhuma tecnologia mapeada."
                description="Tecnologia só entra quando houver ponteiro, gargalo e próxima decisão."
                className="m-4"
              />
            )}
          </div>
          )}
        </section>
      </div>
      <PerformanceDetailDialog detail={detail} open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)} />
    </>
  );
};

export default PerformanceAutomationsPage;
