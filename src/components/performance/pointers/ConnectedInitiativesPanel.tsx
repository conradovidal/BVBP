import { CalendarDays } from "lucide-react";
import { EmptyState } from "@/components/performance/EmptyState";
import { StatusBadge } from "@/components/performance/StatusBadge";
import type { ClientMetricConfig, PdcaCycle } from "@/data/performanceSystem";
import { calculateInitiativeProgress, formatMetricValue } from "@/lib/initiativeProgress";

interface ConnectedInitiativesPanelProps {
  initiatives: PdcaCycle[];
  metrics: ClientMetricConfig[];
  onOpenInitiative: (initiative: PdcaCycle) => void;
  limit?: number;
}

function formatDate(value?: string) {
  if (!value) return "Sem prazo";
  const [, month, day] = value.split("-");
  return month && day ? `${day}/${month}` : value;
}

export function ConnectedInitiativesPanel({ initiatives, metrics, onOpenInitiative, limit = 3 }: ConnectedInitiativesPanelProps) {
  const visibleInitiatives = initiatives.slice(0, limit);
  const metricById = new Map(metrics.map((metric) => [metric.id, metric]));

  return (
    <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5">
      <div>
        <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Iniciativas prioritárias</p>
        <p className="mt-1 text-sm leading-6 text-bvbp-muted-ink">As três prioridades mais altas deste pilar.</p>
      </div>

      {visibleInitiatives.length ? (
        <ul className="mt-4 divide-y divide-bvbp-ink/10 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset">
          {visibleInitiatives.map((initiative) => {
            const metric = initiative.metricId ? metricById.get(initiative.metricId) : undefined;
            const currentValue = metric?.currentValue;
            const progress = calculateInitiativeProgress(initiative, currentValue);
            return (
              <li key={initiative.id}>
                <button type="button" onClick={() => onOpenInitiative(initiative)} className="grid w-full gap-3 p-4 text-left transition-colors hover:bg-bvbp-raised sm:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-base font-semibold leading-tight text-bvbp-ink">{initiative.title}</h3>
                      <StatusBadge label={initiative.pdcaStatus} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-bvbp-muted-ink">
                      <span>{initiative.owner || "Responsável a definir"}</span>
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />{formatDate(initiative.deadline)}</span>
                    </div>
                  </div>
                  <div className="self-center sm:text-right">
                    {currentValue !== undefined && initiative.targetValue !== undefined && progress !== undefined ? (
                      <>
                        <p className="text-xs text-bvbp-muted-ink">Atual {formatMetricValue(currentValue, initiative.metricUnit)} · Meta {formatMetricValue(initiative.targetValue, initiative.metricUnit)}</p>
                        <p className="mt-1 text-sm font-semibold text-bvbp-positive">{progress}% do caminho</p>
                      </>
                    ) : <p className="text-xs font-semibold text-bvbp-muted-ink">Progresso a mensurar</p>}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState title="Nenhuma iniciativa conectada a este pilar ainda." description="Abra a área de iniciativas para conectar a execução aos ponteiros." className="mt-4" />
      )}
    </article>
  );
}
