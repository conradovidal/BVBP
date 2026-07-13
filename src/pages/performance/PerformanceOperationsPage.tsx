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
import { type Company, getOperationalLeaksForCompany, isBvbpInternalWorkspace } from "@/data/performanceSystem";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";
import { getBvbpPdcaCycles } from "@/lib/pdcaCycleStore";
import { operationalLeakDetail } from "@/lib/performanceDetails";

const PerformanceOperationsPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [detail, setDetail] = useState<PerformanceDetail | null>(null);
  const isInternalWorkspace = isBvbpInternalWorkspace(activeCompany);
  const cycles = isInternalWorkspace ? getBvbpPdcaCycles() : [];
  const operationalLeaks = getOperationalLeaksForCompany(activeCompany);
  const totalHours = operationalLeaks.reduce((sum, leak) => sum + leak.hoursPerMonth, 0);
  const totalEstimatedCost = operationalLeaks.reduce((sum, leak) => sum + leak.estimatedCost, 0);
  const highSeverity = operationalLeaks.filter((leak) => leak.severity === "Alta").length;

  return (
    <>
      <Helmet>
        <title>Operação | BVBP Performance System</title>
        <meta name="description" content="Vazamentos operacionais e impacto financeiro estimado." />
      </Helmet>

      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-bvbp-ink sm:text-3xl">Operação</h1>
          <p className="text-sm text-bvbp-muted-ink">{activeCompany.name}</p>
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
                  className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4 text-left shadow-none transition hover:border-bvbp-forest/30 hover:bg-bvbp-inset"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-heading text-base font-bold text-bvbp-ink">{leak.name}</h2>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
                        {leak.affectedFlow}
                      </p>
                    </div>
                    <StatusBadge label={leak.severity} />
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-bvbp-muted-ink/70">Ponteiro</p>
                      <p className="mt-1 font-semibold text-bvbp-ink">{leak.affectedPointer}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-bvbp-muted-ink/70">Horas</p>
                      <p className="mt-1 font-semibold text-bvbp-ink">{formatNumber(leak.hoursPerMonth)}h</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-bvbp-muted-ink/70">Impacto</p>
                      <p className="mt-1 font-semibold text-bvbp-positive">{formatCurrency(leak.estimatedCost)}/mês</p>
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
          <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised shadow-none">
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
                      <TableCell className="min-w-[220px] font-semibold text-bvbp-ink">{leak.name}</TableCell>
                      <TableCell className="min-w-[170px] text-bvbp-ink">{leak.affectedFlow}</TableCell>
                      <TableCell className="min-w-[160px] text-bvbp-ink">{leak.affectedPointer}</TableCell>
                      <TableCell className="font-semibold text-bvbp-ink">{formatNumber(leak.hoursPerMonth)}h</TableCell>
                      <TableCell className="font-semibold text-bvbp-positive">{formatCurrency(leak.estimatedCost)}/mês</TableCell>
                      <TableCell>
                        <StatusBadge label={leak.severity} />
                      </TableCell>
                      <TableCell className="min-w-[240px] text-bvbp-ink">{leak.source}</TableCell>
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

        <article className="flex gap-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5 shadow-none">
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-bvbp-ink" aria-hidden="true" />
          <p className="text-sm leading-6 text-bvbp-ink">Estimativas para priorizar melhorias, não auditoria financeira.</p>
        </article>
      </div>
      <PerformanceDetailDialog detail={detail} open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)} />
    </>
  );
};

export default PerformanceOperationsPage;
