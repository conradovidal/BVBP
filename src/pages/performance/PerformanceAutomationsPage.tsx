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
import { type Company, automationOpportunities, getAutomationOpportunitySummary, isBvbpInternalWorkspace } from "@/data/performanceSystem";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";
import { getBvbpPdcaCycles } from "@/lib/pdcaCycleStore";
import { automationDetail } from "@/lib/performanceDetails";

const PerformanceAutomationsPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [detail, setDetail] = useState<PerformanceDetail | null>(null);
  const isInternalWorkspace = isBvbpInternalWorkspace(activeCompany);
  const cycles = isInternalWorkspace ? getBvbpPdcaCycles() : [];
  const summary = getAutomationOpportunitySummary();

  return (
    <>
      <Helmet>
        <title>Automações | BVBP Performance System</title>
        <meta name="description" content="Oportunidades de automação, IA, dados e aplicações internas." />
      </Helmet>

      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-[#1B365D] sm:text-3xl">Automações</h1>
          <p className="text-sm text-slate-500">{activeCompany.name}</p>
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

        <article className="rounded-lg border border-[#1B365D]/15 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#1B365D]">Tecnologia só entra quando ajuda a mover um ponteiro real.</p>
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
                  className="rounded-[8px] border border-slate-200 bg-white p-4 text-left shadow-[0_1px_0_rgba(15,23,42,0.03)] transition hover:border-[#1B365D]/30 hover:bg-[#F8FBFD]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-heading text-base font-bold text-[#1B365D]">{item.opportunity}</h2>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#1B365D]/45">
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
                      <p className="text-xs font-semibold uppercase text-slate-400">Horas</p>
                      <p className="mt-1 font-semibold text-[#1B365D]">{formatNumber(item.hoursPerMonth)}h/mês</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Potencial</p>
                      <p className="mt-1 font-semibold text-[#38A169]">{formatCurrency(item.estimatedImpact)}/mês</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Ponteiro</p>
                      <p className="mt-1 text-sm font-semibold text-[#1B365D]">{item.affectedProcess}</p>
                    </div>
                  </div>
                </button>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhuma automação mapeada."
                description="Tecnologia só entra quando houver ponteiro, gargalo e próxima decisão."
              />
            )
          ) : (
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
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
                      <TableCell className="min-w-[260px] font-semibold text-[#1B365D]">{item.opportunity}</TableCell>
                      <TableCell className="min-w-[150px] text-slate-700">{item.type}</TableCell>
                      <TableCell className="min-w-[180px] text-slate-700">{item.affectedProcess}</TableCell>
                      <TableCell className="font-semibold text-[#1B365D]">{formatNumber(item.hoursPerMonth)}h</TableCell>
                      <TableCell className="font-semibold text-[#38A169]">{formatCurrency(item.estimatedImpact)}/mês</TableCell>
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
                title="Nenhuma automação mapeada."
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
