import {
  bvbpPillarIds,
  bvbpPillarLabels,
  type BvbpPillarId,
  type ClientConfiguration,
} from "@/data/performanceSystem";
import { cn } from "@/lib/utils";

interface InitiativePillarContextProps {
  configuration: ClientConfiguration;
  activePillarId: "all" | BvbpPillarId;
  onSelect: (pillarId: BvbpPillarId) => void;
}

export function InitiativePillarContext({
  configuration,
  activePillarId,
  onSelect,
}: InitiativePillarContextProps) {
  const activePillar = activePillarId === "all"
    ? undefined
    : configuration.pillars.find((item) => item.pillar === activePillarId);
  const criticalMetric = configuration.metrics.find((metric) => metric.id === activePillar?.criticalMetricId);
  const additionalMetrics = configuration.metrics.filter((metric) => (
    activePillar?.selectedMetricIds.includes(metric.id) && metric.id !== activePillar.criticalMetricId
  ));

  return (
    <section className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4" aria-label="Filtrar iniciativas por pilar">
        {bvbpPillarIds.map((pillarId) => {
          const isActive = activePillarId === pillarId;

          return (
            <button
              type="button"
              key={pillarId}
              aria-pressed={isActive}
              onClick={() => onSelect(pillarId)}
              className={cn(
                "min-h-12 rounded-[8px] border px-3 py-2.5 text-left font-heading font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-bvbp-gold/45",
                isActive
                  ? "border-bvbp-forest bg-bvbp-forest text-bvbp-ivory"
                  : "border-bvbp-ink/10 bg-bvbp-raised text-bvbp-ink hover:border-bvbp-forest/35 hover:bg-bvbp-inset",
              )}
            >
              {bvbpPillarLabels[pillarId]}
            </button>
          );
        })}
      </div>

      {activePillar ? (
        <div className="grid gap-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset px-4 py-3 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Ponteiro crítico</p>
            <p className="mt-1 text-sm font-semibold text-bvbp-ink">{criticalMetric?.name || "A definir"}</p>
          </div>
          <div>
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Outros ponteiros acompanhados</p>
            <p className="mt-1 text-sm text-bvbp-ink">
              {additionalMetrics.length ? additionalMetrics.map((metric) => metric.name).join(" · ") : "Nenhum adicional"}
            </p>
          </div>
          <div>
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Dores principais</p>
            <p className="mt-1 text-sm text-bvbp-ink">
              {activePillar.pains.length ? activePillar.pains.slice(0, 3).join(" · ") : "Nenhuma dor cadastrada"}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
