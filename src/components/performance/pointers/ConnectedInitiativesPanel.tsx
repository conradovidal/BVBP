import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/performance/EmptyState";
import { StatusBadge } from "@/components/performance/StatusBadge";
import type { PdcaCycle } from "@/data/performanceSystem";
import { getInitiativeImpactLabel } from "@/lib/initiativeProgress";

interface ConnectedInitiativesPanelProps {
  initiatives: PdcaCycle[];
  initiativesHref: string;
  limit?: number;
}

export function ConnectedInitiativesPanel({ initiatives, initiativesHref, limit = 3 }: ConnectedInitiativesPanelProps) {
  const visibleInitiatives = initiatives.slice(0, limit);

  return (
    <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
            Iniciativas prioritárias
          </p>
          <p className="mt-1 text-sm leading-6 text-bvbp-muted-ink">As três prioridades mais altas deste pilar.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to={initiativesHref}>Ver iniciativas</Link>
        </Button>
      </div>

      {visibleInitiatives.length ? (
        <ul className="mt-4 divide-y divide-bvbp-ink/10 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset">
          {visibleInitiatives.map((initiative) => (
            <li key={initiative.id} className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_auto]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-heading text-base font-semibold leading-tight text-bvbp-ink">{initiative.title}</h3>
                  <StatusBadge label={initiative.pdcaStatus} />
                  {!initiative.pillarId || !initiative.metricId ? <StatusBadge label="Vínculo a revisar" /> : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">{initiative.nextDecision}</p>
                <p className="mt-2 text-xs leading-5 text-bvbp-muted-ink">
                  {initiative.affectedPointer} · {initiative.owner} · {initiative.deadline}
                </p>
              </div>
              <p className="text-sm font-semibold text-bvbp-positive md:text-right">{getInitiativeImpactLabel(initiative)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Nenhuma iniciativa conectada a este pilar ainda."
          description="Abra a área de iniciativas para conectar a execução aos ponteiros."
          className="mt-4"
        />
      )}
    </article>
  );
}
