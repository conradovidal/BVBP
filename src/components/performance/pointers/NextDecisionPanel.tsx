import type { PointerPillarDiagnostic } from "@/lib/performancePointersModel";

interface NextDecisionPanelProps {
  nextDecision: PointerPillarDiagnostic["nextDecision"];
}

export function NextDecisionPanel({ nextDecision }: NextDecisionPanelProps) {
  return (
    <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-forest p-5 text-bvbp-ivory">
      <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-ivory/60">
        Próxima decisão
      </p>
      <p className="mt-4 font-heading text-xl font-semibold leading-7">{nextDecision.value}</p>
      <p className="mt-3 text-sm leading-6 text-bvbp-ivory/65">{nextDecision.source}</p>
    </article>
  );
}
