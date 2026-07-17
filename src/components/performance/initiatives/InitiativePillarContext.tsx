import { StatusBadge } from "@/components/performance/StatusBadge";
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
  return (
    <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4" aria-label="Filtrar iniciativas por pilar">
      {bvbpPillarIds.map((pillarId) => {
        const pillar = configuration.pillars.find((item) => item.pillar === pillarId);
        const criticalMetric = configuration.metrics.find((metric) => metric.id === pillar?.criticalMetricId);
        const isActive = activePillarId === pillarId;
        const pains = pillar?.pains.slice(0, 2) || [];

        return (
          <button
            type="button"
            key={pillarId}
            aria-pressed={isActive}
            onClick={() => onSelect(pillarId)}
            className={cn(
              "min-h-[108px] rounded-[8px] border p-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-bvbp-gold/45",
              isActive
                ? "border-bvbp-forest bg-bvbp-forest text-bvbp-ivory"
                : "border-bvbp-ink/10 bg-bvbp-raised text-bvbp-ink hover:border-bvbp-forest/35 hover:bg-bvbp-inset",
            )}
          >
            <span className="font-heading font-semibold">{bvbpPillarLabels[pillarId]}</span>
            <span className={cn("mt-2 block text-xs font-semibold", isActive ? "text-bvbp-ivory/75" : "text-bvbp-muted-ink")}>
              {criticalMetric?.name || "Ponteiro crítico a definir"}
            </span>
            <span className="mt-2 flex flex-wrap gap-1.5">
              {pains.length ? pains.map((pain) => <StatusBadge key={pain} label={pain} />) : (
                <span className={cn("text-xs", isActive ? "text-bvbp-ivory/65" : "text-bvbp-muted-ink")}>Dores a mapear</span>
              )}
            </span>
          </button>
        );
      })}
    </section>
  );
}
