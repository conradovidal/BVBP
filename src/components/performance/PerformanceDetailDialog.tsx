import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/performance/StatusBadge";
import { formatCurrency } from "@/lib/performanceFormatters";

export interface PerformanceDetail {
  title: string;
  subtitle?: string;
  status?: string;
  affectedPointer?: string;
  estimatedImpact?: number | string;
  dataType?: "Real" | "Estimado" | "Mockado" | string;
  description?: string;
  whyItMatters?: string;
  evidence?: string[];
  connectedActions?: string[];
  nextDecision?: string;
  facts?: Array<{ label: string; value: string }>;
}

interface PerformanceDetailDialogProps {
  detail: PerformanceDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatImpact(value: PerformanceDetail["estimatedImpact"]) {
  if (typeof value === "number") return value ? `${formatCurrency(value)}/mês` : "Impacto ainda não mensurado";
  return value;
}

function DetailBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">{title}</p>
      <div className="mt-3 text-sm leading-6 text-bvbp-ink">{children}</div>
    </section>
  );
}

export function PerformanceDetailDialog({ detail, open, onOpenChange }: PerformanceDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent withinContentArea className="max-h-[90vh] max-w-3xl overflow-y-auto bg-bvbp-ivory">
        {detail && (
          <>
            <DialogHeader>
              <div className="flex flex-wrap items-start justify-between gap-3 pr-6">
                <div>
                  <DialogTitle className="font-heading text-2xl text-bvbp-ink">{detail.title}</DialogTitle>
                  {detail.subtitle && <DialogDescription className="mt-2">{detail.subtitle}</DialogDescription>}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {detail.status && <StatusBadge label={detail.status} />}
                  {detail.dataType && <StatusBadge label={detail.dataType} />}
                </div>
              </div>
            </DialogHeader>

            <div className="grid gap-3 sm:grid-cols-3">
              {detail.affectedPointer && (
                <DetailBlock title="Ponteiro afetado">
                  <p className="font-semibold text-bvbp-ink">{detail.affectedPointer}</p>
                </DetailBlock>
              )}
              {detail.estimatedImpact !== undefined && (
                <DetailBlock title="Impacto estimado">
                  <p className="font-semibold text-bvbp-positive">{formatImpact(detail.estimatedImpact)}</p>
                </DetailBlock>
              )}
              {detail.nextDecision && (
                <DetailBlock title="Próxima decisão">
                  <p className="font-semibold text-bvbp-ink">{detail.nextDecision}</p>
                </DetailBlock>
              )}
            </div>

            {(detail.description || detail.whyItMatters) && (
              <div className="grid gap-3 md:grid-cols-2">
                {detail.description && (
                  <DetailBlock title="Descrição">
                    <p>{detail.description}</p>
                  </DetailBlock>
                )}
                {detail.whyItMatters && (
                  <DetailBlock title="Por que importa">
                    <p>{detail.whyItMatters}</p>
                  </DetailBlock>
                )}
              </div>
            )}

            {detail.facts?.length ? (
              <DetailBlock title="Dados usados">
                <div className="grid gap-2 sm:grid-cols-2">
                  {detail.facts.map((fact) => (
                    <div key={`${fact.label}-${fact.value}`} className="rounded-md bg-bvbp-inset px-3 py-2">
                      <p className="text-xs font-semibold uppercase text-bvbp-muted-ink/70">{fact.label}</p>
                      <p className="mt-1 font-semibold text-bvbp-ink">{fact.value}</p>
                    </div>
                  ))}
                </div>
              </DetailBlock>
            ) : null}

            <div className="grid gap-3 md:grid-cols-2">
              <DetailBlock title="Evidências">
                {detail.evidence?.length ? (
                  <ul className="space-y-2">
                    {detail.evidence.map((item) => (
                      <li key={item} className="rounded-md bg-bvbp-inset px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-bvbp-muted-ink">Nenhuma evidência registrada ainda.</p>
                )}
              </DetailBlock>
              <DetailBlock title="Ações conectadas">
                {detail.connectedActions?.length ? (
                  <ul className="space-y-2">
                    {detail.connectedActions.map((item) => (
                      <li key={item} className="rounded-md bg-bvbp-inset px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-bvbp-muted-ink">Nenhuma ação conectada a este ponteiro.</p>
                )}
              </DetailBlock>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
