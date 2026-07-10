import { EmptyState } from "@/components/performance/EmptyState";
import { StatusBadge } from "@/components/performance/StatusBadge";
import { clientMetricUnitLabels } from "@/lib/clientConfigurationStore";
import type { OverviewMetricView } from "@/lib/performanceOverviewModel";

interface TrackedMetricsGridProps {
  metrics: OverviewMetricView[];
}

export function TrackedMetricsGrid({ metrics }: TrackedMetricsGridProps) {
  if (!metrics.length) {
    return (
      <EmptyState
        title="Nenhum ponteiro selecionado."
        description="Edite o cliente para selecionar ponteiros deste pilar."
      />
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => {
        const details = [
          `Unidade: ${clientMetricUnitLabels[metric.unit]}`,
          metric.target ? `Meta: ${metric.target}` : null,
          metric.source ? `Fonte: ${metric.source}` : null,
          metric.owner ? `Responsável: ${metric.owner}` : null,
        ].filter(Boolean);

        return (
          <article key={metric.id} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-heading text-base font-semibold leading-tight text-bvbp-ink">{metric.name}</h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-bvbp-muted-ink">{metric.description}</p>
                {metric.formula ? <p className="mt-2 text-xs leading-5 text-bvbp-muted-ink">Fórmula: {metric.formula}</p> : null}
              </div>
              <StatusBadge label={metric.dataType} />
            </div>

            <p className="mt-5 font-heading text-2xl font-semibold leading-none text-bvbp-ink">{metric.displayValue}</p>

            <p className="mt-4 text-xs leading-5 text-bvbp-muted-ink">{details.join(" · ")}</p>
          </article>
        );
      })}
    </div>
  );
}
