import { PointerPillarSelector } from "@/components/performance/pointers/PointerPillarSelector";
import type { BvbpPillarId, ClientConfiguration, PdcaCycle, PdcaStatus } from "@/data/performanceSystem";
import { pointerPillars } from "@/lib/performancePointersModel";

interface InitiativePillarContextProps {
  configuration: ClientConfiguration;
  initiatives: PdcaCycle[];
  activePillarId: "all" | BvbpPillarId;
  onSelect: (pillarId: BvbpPillarId) => void;
}

export function InitiativePillarContext({
  configuration,
  initiatives,
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
  const statusSummary: Array<{ label: string; status: PdcaStatus }> = [
    { label: "Em refinamento", status: "Em refinamento" },
    { label: "Em progresso", status: "Em desenvolvimento" },
    { label: "Em validação", status: "Em validação" },
    { label: "Concluídas", status: "Concluída" },
  ];

  return (
    <section className="space-y-2">
      <PointerPillarSelector
        pillars={pointerPillars}
        activePillarId={activePillar?.pillar}
        onSelect={onSelect}
        ariaLabel="Filtrar iniciativas por pilar"
      />

      {activePillar ? (
        <div className="grid gap-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset px-4 py-3 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Ponteiro crítico</p>
            <p className="mt-1 text-sm font-semibold text-bvbp-ink">{criticalMetric?.name || "A definir"}</p>
          </div>
          <div>
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Ponteiros adicionais</p>
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
      ) : (
        <div className="grid gap-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset px-4 py-3 sm:grid-cols-2 xl:grid-cols-4">
          {statusSummary.map(({ label, status }) => (
            <div key={status} className="flex items-end justify-between gap-3 border-bvbp-ink/10 sm:border-r sm:pr-3 sm:last:border-r-0">
              <div>
                <p className="font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">{label}</p>
                <p className="mt-1 font-heading text-2xl font-bold text-bvbp-ink">
                  {initiatives.filter((initiative) => initiative.pdcaStatus === status).length}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
