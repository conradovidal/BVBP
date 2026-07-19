import { useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  bvbpPillarIds,
  bvbpPillarLabels,
  type BvbpPillarId,
  type ClientConfiguration,
  type ClientMetricConfig,
  type PdcaCycle,
} from "@/data/performanceSystem";
import { cn } from "@/lib/utils";

interface InitiativeLinkChipsProps {
  initiative: PdcaCycle;
  configuration: ClientConfiguration;
  canManage: boolean;
  onSelectMetric: (metric: ClientMetricConfig) => void;
}

const chipClassName = "inline-flex h-7 items-center gap-1.5 rounded-full border border-bvbp-ink/10 bg-bvbp-inset px-2.5 text-xs font-semibold text-bvbp-muted-ink transition-colors hover:bg-bvbp-inset/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-bvbp-gold/45";

export function InitiativeLinkChips({ initiative, configuration, canManage, onSelectMetric }: InitiativeLinkChipsProps) {
  const [pillarOpen, setPillarOpen] = useState(false);
  const [metricOpen, setMetricOpen] = useState(false);
  const [draftPillar, setDraftPillar] = useState<BvbpPillarId>(initiative.pillarId || "financial");

  const selectedMetricIds = useMemo(
    () => new Set(configuration.pillars.flatMap((pillar) => pillar.selectedMetricIds)),
    [configuration.pillars],
  );
  const availableMetrics = useMemo(
    () => configuration.metrics.filter((metric) => selectedMetricIds.has(metric.id)),
    [configuration.metrics, selectedMetricIds],
  );
  const metricsByPillar = useMemo(
    () => Object.fromEntries(bvbpPillarIds.map((pillar) => [pillar, availableMetrics.filter((metric) => metric.pillar === pillar)])) as Record<BvbpPillarId, ClientMetricConfig[]>,
    [availableMetrics],
  );
  const currentPillar = initiative.pillarId || "financial";
  const currentMetric = availableMetrics.find((metric) => metric.id === initiative.metricId);

  const chooseMetric = (metric: ClientMetricConfig) => {
    onSelectMetric(metric);
    setPillarOpen(false);
    setMetricOpen(false);
  };

  if (!canManage) {
    return (
      <>
        <span className={chipClassName}>{initiative.pillarId ? bvbpPillarLabels[initiative.pillarId] : "Vínculo a revisar"}</span>
        <span className={chipClassName}>{currentMetric?.name || "Ponteiro a definir"}</span>
      </>
    );
  }

  return (
    <>
      <Popover open={pillarOpen} onOpenChange={(open) => {
        setPillarOpen(open);
        if (open) setDraftPillar(currentPillar);
      }}>
        <PopoverTrigger asChild>
          <button type="button" className={chipClassName} aria-label="Alterar pilar e ponteiro da iniciativa">
            {initiative.pillarId ? bvbpPillarLabels[initiative.pillarId] : "Vínculo a revisar"}
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 rounded-[8px] border-bvbp-ink/10 bg-bvbp-raised p-3 shadow-[0_18px_50px_rgba(26,25,23,0.12)]">
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Pilar</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {bvbpPillarIds.map((pillar) => {
              const disabled = metricsByPillar[pillar].length === 0;
              return (
                <button
                  key={pillar}
                  type="button"
                  disabled={disabled}
                  title={disabled ? "Este pilar ainda não possui ponteiros selecionados." : undefined}
                  onClick={() => setDraftPillar(pillar)}
                  className={cn(
                    "flex h-9 items-center justify-between rounded-[6px] border px-3 text-left text-sm font-medium",
                    draftPillar === pillar ? "border-bvbp-forest bg-bvbp-inset text-bvbp-forest" : "border-bvbp-ink/10 text-bvbp-ink hover:bg-bvbp-inset",
                    disabled && "cursor-not-allowed opacity-45",
                  )}
                >
                  {bvbpPillarLabels[pillar]}
                  {draftPillar === pillar ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>
          {bvbpPillarIds.some((pillar) => metricsByPillar[pillar].length === 0) ? (
            <p className="mt-2 text-xs text-bvbp-muted-ink">
              Pilares indisponíveis ainda não possuem ponteiros selecionados.
            </p>
          ) : null}
          <p className="mt-4 font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Ponteiro</p>
          <div className="mt-2 space-y-1">
            {metricsByPillar[draftPillar].map((metric) => (
              <button key={metric.id} type="button" onClick={() => chooseMetric(metric)} className="flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-left text-sm text-bvbp-ink hover:bg-bvbp-inset">
                {metric.name}
                {metric.id === initiative.metricId ? <Check className="h-4 w-4 text-bvbp-forest" aria-hidden="true" /> : null}
              </button>
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <Button type="button" size="sm" variant="ghost" onClick={() => setPillarOpen(false)}>Cancelar</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover open={metricOpen} onOpenChange={setMetricOpen}>
        <PopoverTrigger asChild>
          <button type="button" className={chipClassName} aria-label="Alterar ponteiro da iniciativa">
            {currentMetric?.name || "Ponteiro a definir"}
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 rounded-[8px] border-bvbp-ink/10 bg-bvbp-raised p-2 shadow-[0_18px_50px_rgba(26,25,23,0.12)]">
          <p className="px-2 py-1 font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Ponteiros de {bvbpPillarLabels[currentPillar]}</p>
          {metricsByPillar[currentPillar].map((metric) => (
            <button key={metric.id} type="button" onClick={() => chooseMetric(metric)} className="flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-left text-sm text-bvbp-ink hover:bg-bvbp-inset">
              {metric.name}
              {metric.id === initiative.metricId ? <Check className="h-4 w-4 text-bvbp-forest" aria-hidden="true" /> : null}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
}
