import { EmptyState } from "@/components/performance/EmptyState";
import { StatusBadge } from "@/components/performance/StatusBadge";
import type { CriticalPointerDiagnostic } from "@/lib/performancePointersModel";

interface CriticalPointerPanelProps {
  pointer: CriticalPointerDiagnostic | null;
}

export function CriticalPointerPanel({ pointer }: CriticalPointerPanelProps) {
  if (!pointer) {
    return (
      <EmptyState
        title="Nenhum ponteiro definido."
        description="Edite o cliente para selecionar métricas deste pilar."
      />
    );
  }

  return (
    <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5 shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
            Ponteiro crítico
          </p>
          <h2 className="mt-3 font-heading text-2xl font-semibold leading-tight text-bvbp-ink">{pointer.name}</h2>
        </div>
        <StatusBadge label={pointer.dataStatus} />
      </div>

      <p className="mt-6 font-heading text-3xl font-semibold leading-none text-bvbp-ink">{pointer.value}</p>

      <div className="mt-5 grid gap-3 border-t border-bvbp-ink/10 pt-4 text-sm leading-6 md:grid-cols-2">
        <p className="text-bvbp-muted-ink">
          <span className="font-semibold text-bvbp-ink">Fonte:</span> {pointer.source || "Não informada"}
        </p>
        <p className="text-bvbp-muted-ink">
          <span className="font-semibold text-bvbp-ink">Meta:</span> {pointer.target || "Sem meta definida"}
        </p>
      </div>

      <div className="mt-5 grid gap-3 text-sm leading-6 md:grid-cols-2">
        <section className="rounded-[8px] bg-bvbp-inset p-3">
          <p className="font-semibold text-bvbp-ink">Por que importa</p>
          <p className="mt-1 text-bvbp-muted-ink">{pointer.whyItMatters}</p>
        </section>
        <section className="rounded-[8px] bg-bvbp-inset p-3">
          <p className="font-semibold text-bvbp-ink">Próxima decisão</p>
          <p className="mt-1 text-bvbp-muted-ink">{pointer.nextDecision}</p>
        </section>
      </div>
    </article>
  );
}
