import type { PointerPillarId, PointerPillarOption } from "@/lib/performancePointersModel";
import { PencilLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface PointerPillarSelectorProps {
  pillars: PointerPillarOption[];
  activePillarId?: PointerPillarId;
  onSelect: (pillarId: PointerPillarId) => void;
  onEdit?: (pillarId: PointerPillarId) => void;
  ariaLabel?: string;
}

export function PointerPillarSelector({
  pillars,
  activePillarId,
  onSelect,
  onEdit,
  ariaLabel = "Pilares de ponteiros",
}: PointerPillarSelectorProps) {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label={ariaLabel}>
      {pillars.map((pillar) => {
        const isActive = pillar.id === activePillarId;

        return (
          <article
            key={pillar.id}
            className={cn(
              "relative min-h-[132px] overflow-hidden rounded-[8px] border transition-colors",
              isActive
                ? "border-bvbp-forest bg-bvbp-forest text-bvbp-ivory"
                : "border-bvbp-ink/10 bg-bvbp-raised text-bvbp-ink hover:border-bvbp-forest/35 hover:bg-bvbp-inset",
            )}
          >
            <button type="button" aria-pressed={isActive} onClick={() => onSelect(pillar.id)} className="h-full min-h-[132px] w-full p-4 pr-12 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-bvbp-gold/45">
              <p className="font-heading text-lg font-semibold leading-tight">{pillar.label}</p>
              <p className={cn("mt-3 text-sm leading-5", isActive ? "text-bvbp-ivory/72" : "text-bvbp-muted-ink")}>
                {pillar.description}
              </p>
            </button>
            {onEdit ? (
              <button type="button" onClick={() => onEdit(pillar.id)} className={cn("absolute right-3 top-3 rounded-full p-2 opacity-60 transition hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-bvbp-gold/45", isActive ? "hover:bg-white/10" : "hover:bg-bvbp-forest/8")} aria-label={`Editar ponteiros de ${pillar.label}`} title={`Editar ponteiros de ${pillar.label}`}>
                <PencilLine className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}
