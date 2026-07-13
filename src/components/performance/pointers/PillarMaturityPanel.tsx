import type { PointerPillarDiagnostic } from "@/lib/performancePointersModel";
import { cn } from "@/lib/utils";

interface PillarMaturityPanelProps {
  maturity: PointerPillarDiagnostic["maturity"];
}

export function PillarMaturityPanel({ maturity }: PillarMaturityPanelProps) {
  return (
    <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5">
      <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
        Maturidade do pilar
      </p>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-heading text-3xl font-semibold leading-none text-bvbp-ink">{maturity.currentLevel}/5</p>
          <h3 className="mt-2 font-heading text-lg font-semibold text-bvbp-ink">{maturity.currentName}</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-bvbp-muted-ink">{maturity.currentDescription}</p>
        </div>
        <div className="rounded-[8px] bg-bvbp-inset px-4 py-3 text-sm leading-6">
          <p className="font-semibold text-bvbp-ink">
            {maturity.currentLevel === 5 ? "Progresso" : "Próximo nível"}
          </p>
          <p className="text-bvbp-muted-ink">
            {maturity.currentLevel === 5
              ? `${maturity.completedCriteria}/${maturity.totalCriteria} critérios validados`
              : `${maturity.nextLevel}/5 · ${maturity.nextName}`}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-5">
        {maturity.levels.map((level) => (
          <div
            key={level.level}
            className={cn(
              "rounded-[8px] border px-3 py-2",
              level.level === maturity.currentLevel
                ? "border-bvbp-forest bg-bvbp-forest text-bvbp-ivory"
                : "border-bvbp-ink/10 bg-bvbp-inset text-bvbp-muted-ink",
            )}
          >
            <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em]">Nível {level.level}</p>
            <p className="mt-1 text-xs font-semibold leading-4">{level.name}</p>
          </div>
        ))}
      </div>

      <section className="mt-5 rounded-[8px] bg-bvbp-inset p-3 text-sm leading-6">
        <p className="font-semibold text-bvbp-ink">
          {maturity.currentLevel === 5 ? "Situação atual" : "Critérios para avançar"}
        </p>
        <p className="mt-1 text-bvbp-muted-ink">{maturity.advancementCriteria}</p>
      </section>
    </article>
  );
}
