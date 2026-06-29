import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useOutletContext } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
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
import { type Company, isBvbpInternalWorkspace, operationalLeaks } from "@/data/performanceSystem";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";
import { getBvbpPdcaCycles } from "@/lib/pdcaCycleStore";
import { operationalLeakDetail } from "@/lib/performanceDetails";

const totalHours = operationalLeaks.reduce((sum, leak) => sum + leak.hoursPerMonth, 0);
const totalEstimatedCost = operationalLeaks.reduce((sum, leak) => sum + leak.estimatedCost, 0);
const highSeverity = operationalLeaks.filter((leak) => leak.severity === "Alta").length;

const PerformanceOperationsPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [detail, setDetail] = useState<PerformanceDetail | null>(null);
  const isInternalWorkspace = isBvbpInternalWorkspace(activeCompany);
  const cycles = isInternalWorkspace ? getBvbpPdcaCycles() : [];

  return (
    <>
      <Helmet>
        <title>Operação | BVBP Performance System</title>
        <meta name="description" content="Vazamentos operacionais e impacto financeiro estimado." />
      </Helmet>

      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-[#1B365D] sm:text-3xl">Operação</h1>
          <p className="text-sm text-slate-500">{activeCompany.name}</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            title="Horas"
            value={`${formatNumber(totalHours)}h`}
            accent="blue"
          />
          <MetricCard
            title="Custo"
            value={`${formatCurrency(totalEstimatedCost)}/mês`}
            accent="green"
          />
          <MetricCard
            title="Alta severidade"
            value={formatNumber(highSeverity)}
            accent="orange"
          />
        </section>

        <section className="space-y-4">
          <SectionHeader title="Vazamentos operacionais" />
          {isInternalWorkspace ? (
            operationalLeaks.length ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {operationalLeaks.map((leak) => (
                <button
                  type="button"
                  key={leak.id}
                  onClick={() => setDetail(operationalLeakDetail(leak, cycles))}
                  className="rounded-[8px] border border-slate-200 bg-white p-4 text-left shadow-[0_1px_0_rgba(15,23,42,0.03)] transition hover:border-[#1B365D]/30 hover:bg-[#F8FBFD]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-heading text-base font-bold text-[#1B365D]">{leak.name}</h2>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#1B365D]/45">
                        {leak.affectedFlow}
                      </p>
                    </div>
                    <StatusBadge label={leak.severity} />
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Ponteiro</p>
                      <p className="mt-1 font-semibold text-[#1B365D]">{leak.affectedPointer}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Horas</p>
                      <p className="mt-1 font-semibold text-[#1B365D]">{formatNumber(leak.hoursPerMonth)}h</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Impacto</p>
                      <p className="mt-1 font-semibold text-[#38A169]">{formatCurrency(leak.estimatedCost)}/mês</p>
                    </div>
                  </div>
                </button>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhum vazamento operacional."
                description="Mapeie um fluxo com perda de tempo, retrabalho ou espera para priorizar melhoria."
              />
            )
          ) : (
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Fluxo afetado</TableHead>
                    <TableHead>Ponteiro afetado</TableHead>
                    <TableHead>Horas por mês</TableHead>
                    <TableHead>Custo estimado</TableHead>
                    <TableHead>Severidade</TableHead>
                    <TableHead>Fonte da estimativa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operationalLeaks.length ? operationalLeaks.map((leak) => (
                    <TableRow key={leak.id}>
                      <TableCell className="min-w-[220px] font-semibold text-[#1B365D]">{leak.name}</TableCell>
                      <TableCell className="min-w-[170px] text-slate-700">{leak.affectedFlow}</TableCell>
                      <TableCell className="min-w-[160px] text-slate-700">{leak.affectedPointer}</TableCell>
                      <TableCell className="font-semibold text-[#1B365D]">{formatNumber(leak.hoursPerMonth)}h</TableCell>
                      <TableCell className="font-semibold text-[#38A169]">{formatCurrency(leak.estimatedCost)}/mês</TableCell>
                      <TableCell>
                        <StatusBadge label={leak.severity} />
                      </TableCell>
                      <TableCell className="min-w-[240px] text-slate-700">{leak.source}</TableCell>
                    </TableRow>
                  )) : null}
                </TableBody>
              </Table>
            </div>
            {!operationalLeaks.length && (
              <EmptyState
                title="Nenhum vazamento operacional."
                description="Mapeie um fluxo com perda de tempo, retrabalho ou espera para priorizar melhoria."
                className="m-4"
              />
            )}
          </div>
          )}
        </section>

        <article className="flex gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#1B365D]" aria-hidden="true" />
          <p className="text-sm leading-6 text-slate-700">Estimativas para priorizar melhorias, não auditoria financeira.</p>
        </article>
      </div>
      <PerformanceDetailDialog detail={detail} open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)} />
    </>
  );
};

export default PerformanceOperationsPage;
