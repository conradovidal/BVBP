import { useEffect, useMemo, useState } from "react";
import { LockKeyhole } from "lucide-react";
import type { PointerPillarDiagnostic } from "@/lib/performancePointersModel";
import { cn } from "@/lib/utils";
import { maturityActiveCardClass } from "@/lib/maturityColors";
import { Checkbox } from "@/components/ui/checkbox";

interface PillarMaturityPanelProps {
  maturity: PointerPillarDiagnostic["maturity"];
  canManage?: boolean;
  onToggleCriterion?: (criterionId: string) => void;
}

export function PillarMaturityPanel({ maturity, canManage = false, onToggleCriterion }: PillarMaturityPanelProps) {
  const [selectedLevel, setSelectedLevel] = useState(maturity.currentLevel);
  const completedIds = useMemo(() => new Set(maturity.completedCriterionIds), [maturity.completedCriterionIds]);
  const selectedDefinition = maturity.levels.find((level) => level.level === selectedLevel) || maturity.levels[0];
  const isFutureLevel = selectedLevel > maturity.currentLevel;
  const isBaseLevel = selectedLevel === 1;
  const canEditSelectedLevel = canManage && !isFutureLevel && !isBaseLevel;

  useEffect(() => {
    setSelectedLevel(maturity.currentLevel);
  }, [maturity.currentLevel, maturity.levels]);

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
          <p className="font-semibold text-bvbp-ink">{maturity.currentLevel === 5 ? "Progresso" : "Próximo nível"}</p>
          <p className="text-bvbp-muted-ink">
            {maturity.currentLevel === 5
              ? `${maturity.completedCriteria}/${maturity.totalCriteria} critérios validados`
              : `${maturity.nextLevel}/5 · ${maturity.nextName}`}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-5" role="tablist" aria-label="Níveis de maturidade">
        {maturity.levels.map((level) => {
          const isSelected = level.level === selectedLevel;
          const isFuture = level.level > maturity.currentLevel;
          return (
            <button
              key={level.level}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedLevel(level.level)}
              className={cn(
                "relative min-h-[68px] rounded-[8px] border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bvbp-signal/40",
                isSelected
                  ? maturityActiveCardClass(level.level)
                  : "border-bvbp-ink/10 bg-bvbp-inset text-bvbp-muted-ink hover:border-bvbp-signal/30",
              )}
            >
              {isFuture ? <LockKeyhole className="absolute right-2 top-2 h-3.5 w-3.5 opacity-55" aria-hidden="true" /> : null}
              <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em]">Nível {level.level}</p>
              <p className="mt-1 pr-3 text-xs font-semibold leading-4">{level.name}</p>
            </button>
          );
        })}
      </div>

      <section className="mt-5 rounded-[8px] bg-bvbp-inset p-3 text-sm leading-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-bvbp-ink">Nível {selectedDefinition.level} · {selectedDefinition.name}</p>
            <p className="mt-1 text-bvbp-muted-ink">{selectedDefinition.description}</p>
          </div>
          {isFutureLevel ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-bvbp-raised px-2.5 py-1 text-xs text-bvbp-muted-ink">
              <LockKeyhole className="h-3.5 w-3.5" /> Conclua o nível atual para validar
            </span>
          ) : null}
        </div>

        {selectedDefinition.criteria.length ? (
          <div className="mt-3 space-y-2">
            {selectedDefinition.criteria.map((criterion) => (
              <label key={criterion.id} className={cn(
                "flex items-start gap-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised px-3 py-2.5 text-bvbp-ink",
                !canEditSelectedLevel && "cursor-default",
              )}>
                <Checkbox
                  checked={completedIds.has(criterion.id)}
                  disabled={!canEditSelectedLevel}
                  onCheckedChange={() => onToggleCriterion?.(criterion.id)}
                  aria-label={criterion.label}
                />
                <span className="leading-5">{criterion.label}</span>
              </label>
            ))}
            {isBaseLevel ? <p className="text-xs text-bvbp-muted-ink">Os critérios da base são validados automaticamente pelos dados do diagnóstico.</p> : null}
          </div>
        ) : <p className="mt-3 text-bvbp-muted-ink">Este é o ápice de maturidade do pilar.</p>}
      </section>
    </article>
  );
}
