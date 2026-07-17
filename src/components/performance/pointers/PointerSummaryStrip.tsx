import { StatusBadge } from "@/components/performance/StatusBadge";
import type { PdcaCycle } from "@/data/performanceSystem";
import type { OverviewMetricView } from "@/lib/performanceOverviewModel";
import type { PointerPillarDiagnostic } from "@/lib/performancePointersModel";

interface PointerSummaryStripProps {
  diagnostic: PointerPillarDiagnostic;
}

function relatedPains(metric: OverviewMetricView, initiatives: PdcaCycle[]) {
  return Array.from(new Set(
    initiatives
      .filter((initiative) => initiative.metricId === metric.id && initiative.painLabel?.trim())
      .map((initiative) => initiative.painLabel!.trim()),
  ));
}

function PointerBlock({
  label,
  metrics,
  initiatives,
}: {
  label: string;
  metrics: OverviewMetricView[];
  initiatives: PdcaCycle[];
}) {
  return (
    <div className="min-w-0 p-4">
      <p className="font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">{label}</p>
      {metrics.length ? (
        <div className="mt-3 space-y-3">
          {metrics.map((metric) => {
            const pains = relatedPains(metric, initiatives);
            return (
              <div key={metric.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-heading text-base font-semibold text-bvbp-ink">{metric.name}</p>
                  <p className="font-heading text-lg font-semibold text-bvbp-ink">{metric.displayValue}</p>
                </div>
                {pains.length ? (
                  <p className="mt-1 text-xs leading-5 text-bvbp-muted-ink">Dores: {pains.join(" · ")}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-3 text-sm text-bvbp-muted-ink">Nenhum ponteiro definido.</p>
      )}
    </div>
  );
}

export function PointerSummaryStrip({ diagnostic }: PointerSummaryStripProps) {
  const primary = diagnostic.criticalMetricId
    ? diagnostic.metrics.filter((metric) => metric.id === diagnostic.criticalMetricId)
    : [];
  const support = diagnostic.metrics.filter((metric) => metric.id !== diagnostic.criticalMetricId);
  const priorityInitiative = diagnostic.initiatives[0];

  return (
    <section className="grid overflow-hidden rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised lg:grid-cols-[1fr_1fr_1.05fr] lg:divide-x lg:divide-bvbp-ink/10">
      <PointerBlock label="Ponteiro principal" metrics={primary} initiatives={diagnostic.initiatives} />
      <PointerBlock label="Ponteiros de suporte" metrics={support} initiatives={diagnostic.initiatives} />
      <div className="bg-bvbp-forest p-4 text-white">
        <p className="font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-white/60">Próxima ação priorizada</p>
        {priorityInitiative ? (
          <div className="mt-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label={priorityInitiative.priority ? `Prioridade ${priorityInitiative.priority}` : "Prioridade a definir"} />
              <StatusBadge label={priorityInitiative.pdcaStatus} />
            </div>
            <p className="mt-3 font-heading text-lg font-semibold leading-6 text-white">
              {priorityInitiative.nextDecision || priorityInitiative.title}
            </p>
            <p className="mt-2 text-xs leading-5 text-white/70">Iniciativa: {priorityInitiative.title}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-white/75">Nenhuma iniciativa priorizada neste pilar.</p>
        )}
      </div>
    </section>
  );
}
