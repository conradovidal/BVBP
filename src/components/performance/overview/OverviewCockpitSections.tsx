import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/performance/StatusBadge";
import type { MaturityLevel, PdcaCycle } from "@/data/performanceSystem";
import {
  type ExecutiveReadingItem,
  type OverviewMetricView,
  type OverviewPillarSummary,
} from "@/lib/performanceOverviewModel";
import { formatCurrency } from "@/lib/performanceFormatters";
import { cn } from "@/lib/utils";
import { maturityActiveCardClass, maturitySegmentClass } from "@/lib/maturityColors";

interface ExecutiveReadingStripProps {
  items: ExecutiveReadingItem[];
}

interface OverviewPillarCardProps {
  pillar: OverviewPillarSummary;
  onSelect: (pillar: OverviewPillarSummary) => void;
}

interface MaturityMapPanelProps {
  pillars: OverviewPillarSummary[];
  onSelect: (pillar: OverviewPillarSummary) => void;
}

interface PrioritizedInitiativesListProps {
  initiatives: PdcaCycle[];
  onSelect: (cycle: PdcaCycle) => void;
}

interface PillarOverviewDetailDialogProps {
  pillar: OverviewPillarSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatImpact(value: number) {
  return value ? `${formatCurrency(value)}/mês` : "Impacto ainda não mensurado";
}

function DetailPanel({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4", className)}>
      <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">{title}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function MetricLine({ metric }: { metric: OverviewMetricView }) {
  const details = [
    metric.formula ? `Fórmula: ${metric.formula}` : null,
    metric.source ? `Fonte: ${metric.source}` : null,
    metric.target ? `Meta: ${metric.target}` : null,
    metric.owner ? `Responsável: ${metric.owner}` : null,
  ].filter(Boolean);

  return (
    <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-semibold leading-5 text-bvbp-ink">{metric.name}</h4>
          <p className="mt-1 text-xs leading-5 text-bvbp-muted-ink">{metric.description}</p>
        </div>
        <StatusBadge label={metric.dataType} />
      </div>
      <p className="mt-4 font-heading text-xl font-semibold leading-none text-bvbp-ink">{metric.displayValue}</p>
      {details.length ? (
        <p className="mt-2 text-xs leading-5 text-bvbp-muted-ink">{details.join(" · ")}</p>
      ) : null}
    </article>
  );
}

export function ExecutiveReadingStrip({ items }: ExecutiveReadingStripProps) {
  return (
    <section className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised">
      <div className="grid divide-y divide-bvbp-ink/10 md:grid-cols-4 md:divide-x md:divide-y-0">
        {items.map((item) => (
          <article key={item.label} className="p-4">
            <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
              {item.label}
            </p>
            <p className="mt-3 line-clamp-2 min-h-[44px] font-heading text-lg font-semibold leading-6 text-bvbp-ink">
              {item.value}
            </p>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-bvbp-muted-ink">{item.meta}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function OverviewPillarCard({ pillar, onSelect }: OverviewPillarCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(pillar)}
      className={cn(
        "group h-full rounded-[8px] border bg-bvbp-raised p-4 text-left transition hover:bg-bvbp-raised/80 focus:outline-none focus:ring-2 focus:ring-bvbp-gold/45",
        pillar.primaryMetricName === "Ponteiro a definir" ? "border-bvbp-ink/10 hover:border-bvbp-forest/30" : "border-bvbp-gold/55 hover:border-bvbp-gold",
      )}
      aria-label={`Abrir detalhe do pilar ${pillar.label}`}
    >
      <div className="flex h-full min-h-[178px] flex-col justify-between gap-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-heading text-lg font-semibold text-bvbp-ink">{pillar.label}</p>
              <p className={cn("mt-1 text-xs font-medium leading-5", pillar.primaryMetricName === "Ponteiro a definir" ? "text-bvbp-muted-ink" : "text-bvbp-gold")}>{pillar.primaryMetricName}</p>
            </div>
            <StatusBadge label={pillar.signal} />
          </div>
          <p className="mt-6 font-heading text-2xl font-semibold leading-none text-bvbp-ink">
            {pillar.primaryMetricValue}
          </p>
        </div>

        <div className="space-y-2 border-t border-bvbp-ink/10 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={pillar.dataStatus} />
            <span className="text-xs font-medium text-bvbp-muted-ink">{pillar.context}</span>
          </div>
          <p className="line-clamp-2 text-xs leading-5 text-bvbp-muted-ink">{pillar.primaryMetricSource}</p>
        </div>
      </div>
    </button>
  );
}

export function MaturityMapPanel({ pillars, onSelect }: MaturityMapPanelProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {pillars.map((pillar) => (
        <button
          type="button"
          key={pillar.id}
          onClick={() => onSelect(pillar)}
          className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4 text-left transition hover:border-bvbp-forest/30 hover:bg-bvbp-raised/80 focus:outline-none focus:ring-2 focus:ring-bvbp-gold/45"
          aria-label={`Abrir maturidade de ${pillar.label}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-heading text-base font-semibold text-bvbp-ink">{pillar.label}</h3>
              <p className="mt-1 text-xs leading-5 text-bvbp-muted-ink">Nível {pillar.maturityLevel} · {pillar.currentLevelName}</p>
            </div>
            <StatusBadge label={pillar.signal} />
          </div>

          <div className="mt-5 flex gap-1.5" aria-label={`${pillar.label}: nível ${pillar.maturityLevel} de 5`}>
            {[1, 2, 3, 4, 5].map((step) => (
              <span
                key={step}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  step <= pillar.maturityLevel ? maturitySegmentClass(step as MaturityLevel) : "bg-bvbp-inset",
                )}
              />
            ))}
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
            {pillar.maturityLevel === 5 ? "Progresso" : "Próximo nível"}
          </p>
          <p className="mt-1 text-sm font-semibold leading-5 text-bvbp-ink">
            {pillar.maturityLevel === 5
              ? `${pillar.completedMaturityCriteria}/${pillar.totalMaturityCriteria} critérios validados`
              : `${pillar.nextLevel} · ${pillar.nextLevelName}`}
          </p>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-bvbp-muted-ink">{pillar.advancementCriteria}</p>
        </button>
      ))}
    </div>
  );
}

export function PrioritizedInitiativesList({ initiatives, onSelect }: PrioritizedInitiativesListProps) {
  if (!initiatives.length) {
    return (
      <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4 text-sm text-bvbp-muted-ink">
        Nenhuma iniciativa priorizada ainda. Defina uma iniciativa conectada ao ponteiro crítico.
      </div>
    );
  }

  return (
    <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised">
      <ul className="divide-y divide-bvbp-ink/10">
        {initiatives.map((cycle, index) => (
          <li key={cycle.id}>
            <button
              type="button"
              onClick={() => onSelect(cycle)}
              className="grid w-full gap-3 px-4 py-4 text-left text-sm leading-6 text-bvbp-ink transition hover:bg-bvbp-inset focus:outline-none focus:ring-2 focus:ring-inset focus:ring-bvbp-gold/45 sm:grid-cols-[40px_minmax(0,1fr)_auto]"
            >
              <span className="font-label text-xs font-semibold text-bvbp-muted-ink">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-bvbp-ink">{cycle.title}</span>
                <span className="mt-1 block text-xs font-medium text-bvbp-muted-ink">
                  {cycle.affectedPointer} · {cycle.owner} · {cycle.nextDecision}
                </span>
              </span>
              <span className="flex flex-wrap items-center gap-3 sm:justify-end">
                <span className="text-xs font-semibold text-bvbp-positive">{formatImpact(cycle.estimatedImpact)}</span>
                <StatusBadge label={cycle.pdcaStatus} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PillarOverviewDetailDialog({ pillar, open, onOpenChange }: PillarOverviewDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-bvbp-ivory">
        {pillar && (
          <>
            <DialogHeader>
              <div className="flex flex-wrap items-start justify-between gap-3 pr-6">
                <div>
                  <DialogTitle className="font-heading text-2xl text-bvbp-ink">{pillar.label}</DialogTitle>
                  <DialogDescription className="mt-2">
                    Nível {pillar.maturityLevel} · {pillar.currentLevelName}
                  </DialogDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge label={pillar.signal} />
                  <StatusBadge label={pillar.dataStatus} />
                </div>
              </div>
            </DialogHeader>

            <div className="grid gap-3 md:grid-cols-3">
              <DetailPanel title="Ponteiro principal">
                <p className="font-semibold text-bvbp-ink">{pillar.primaryMetricName}</p>
                <p className="mt-2 font-heading text-xl font-semibold text-bvbp-ink">{pillar.primaryMetricValue}</p>
              </DetailPanel>
              <DetailPanel title="Maturidade">
                <p className="font-semibold text-bvbp-ink">
                  {pillar.maturityLevel} · {pillar.currentLevelName}
                </p>
                <p className="mt-2 text-sm leading-5 text-bvbp-muted-ink">{pillar.currentLevelDescription}</p>
              </DetailPanel>
              <DetailPanel title="Próxima decisão">
                <p className="font-semibold leading-6 text-bvbp-ink">{pillar.nextDecision}</p>
              </DetailPanel>
            </div>

            <DetailPanel title="Ponteiros acompanhados">
              {pillar.metrics.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {pillar.metrics.map((metric) => (
                    <MetricLine key={metric.id} metric={metric} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-bvbp-muted-ink">Nenhum ponteiro configurado para este pilar.</p>
              )}
            </DetailPanel>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <DetailPanel title="Dores registradas">
                {pillar.pains.length ? (
                  <ul className="space-y-2 text-sm text-bvbp-ink">
                    {pillar.pains.map((pain) => (
                      <li key={pain} className="rounded-[8px] bg-bvbp-inset px-3 py-2">
                        {pain}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-bvbp-muted-ink">Nenhuma dor registrada para este pilar.</p>
                )}
              </DetailPanel>

              <DetailPanel title="Maturidade BVBP">
                <div className="space-y-3">
                  <div className="grid gap-2 sm:grid-cols-5">
                    {pillar.maturityLevels.map((level) => (
                      <div
                        key={level.level}
                        className={cn(
                          "rounded-[8px] border px-3 py-2",
                          level.level === pillar.maturityLevel
                            ? maturityActiveCardClass(level.level)
                            : "border-bvbp-ink/10 bg-bvbp-inset text-bvbp-muted-ink",
                        )}
                      >
                        <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em]">Nível {level.level}</p>
                        <p className="mt-1 text-xs font-semibold leading-4">{level.name}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-[8px] bg-bvbp-inset p-3 text-sm leading-6 text-bvbp-ink">
                    <p className="font-semibold">
                      {pillar.completedMaturityCriteria}/{pillar.totalMaturityCriteria} critérios validados
                    </p>
                    {pillar.maturityLevel < 5 ? (
                      <p className="mt-1">
                        Próximo: nível {pillar.nextLevel} · {pillar.nextLevelName}
                      </p>
                    ) : null}
                    <p className="mt-1 text-bvbp-muted-ink">{pillar.advancementCriteria}</p>
                  </div>
                </div>
              </DetailPanel>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <DetailPanel title="Iniciativas conectadas">
                {pillar.relatedInitiatives.length ? (
                  <ul className="space-y-2 text-sm text-bvbp-ink">
                    {pillar.relatedInitiatives.map((initiative) => (
                      <li key={initiative.id} className="rounded-[8px] bg-bvbp-inset px-3 py-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold">{initiative.title}</span>
                          <StatusBadge label={initiative.pdcaStatus} />
                        </div>
                        <p className="mt-1 text-xs leading-5 text-bvbp-muted-ink">
                          {initiative.owner} · {initiative.nextDecision}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-bvbp-muted-ink">Nenhuma iniciativa conectada a este pilar.</p>
                )}
              </DetailPanel>

              <DetailPanel title="Evidências">
                {pillar.evidence.length ? (
                  <ul className="space-y-2 text-sm text-bvbp-ink">
                    {pillar.evidence.map((item) => (
                      <li key={item} className="rounded-[8px] bg-bvbp-inset px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-bvbp-muted-ink">Nenhuma evidência registrada para este pilar.</p>
                )}
              </DetailPanel>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
