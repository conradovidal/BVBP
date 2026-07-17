import type { PointerPillarId, PointerPillarOption } from "@/lib/performancePointersModel";
import { cn } from "@/lib/utils";

interface PointerPillarSelectorProps {
  pillars: PointerPillarOption[];
  activePillarId?: PointerPillarId;
  onSelect: (pillarId: PointerPillarId) => void;
  ariaLabel?: string;
}

export function PointerPillarSelector({
  pillars,
  activePillarId,
  onSelect,
  ariaLabel = "Pilares de ponteiros",
}: PointerPillarSelectorProps) {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label={ariaLabel}>
      {pillars.map((pillar) => {
        const isActive = pillar.id === activePillarId;

        return (
          <button
            key={pillar.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(pillar.id)}
            className={cn(
              "min-h-[132px] rounded-[8px] border p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-bvbp-gold/45",
              isActive
                ? "border-bvbp-forest bg-bvbp-forest text-bvbp-ivory"
                : "border-bvbp-ink/10 bg-bvbp-raised text-bvbp-ink hover:border-bvbp-forest/35 hover:bg-bvbp-inset",
            )}
          >
            <p className="font-heading text-lg font-semibold leading-tight">{pillar.label}</p>
            <p className={cn("mt-3 text-sm leading-5", isActive ? "text-bvbp-ivory/72" : "text-bvbp-muted-ink")}>
              {pillar.description}
            </p>
          </button>
        );
      })}
    </section>
  );
}
