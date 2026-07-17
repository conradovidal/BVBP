import { MetricCard } from "@/components/performance/MetricCard";
import type { PdcaCycle } from "@/data/performanceSystem";
import type { InitiativeActivity } from "@/lib/initiativeActivityStore";
import { formatNumber } from "@/lib/performanceFormatters";
import { calculateInitiativeProgress } from "@/lib/initiativeProgress";

interface InitiativeSummaryCardsProps {
  initiatives: PdcaCycle[];
  activities: InitiativeActivity[];
  compact?: boolean;
}

export function InitiativeSummaryCards({ initiatives, activities, compact = false }: InitiativeSummaryCardsProps) {
  const activeInitiatives = initiatives.filter((initiative) => ["Em refinamento", "Em desenvolvimento", "Em validação"].includes(initiative.pdcaStatus));
  const measuredInitiatives = initiatives.filter((initiative) => calculateInitiativeProgress(initiative) !== undefined);

  return (
    <section className={compact ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-4" : "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"}>
      <MetricCard title="Iniciativas" value={formatNumber(initiatives.length)} accent="blue" compact={compact} />
      <MetricCard title="Ativas" value={formatNumber(activeInitiatives.length)} accent="orange" compact={compact} />
      <MetricCard title="Atividades" value={formatNumber(activities.length)} accent="gray" compact={compact} />
      <MetricCard title="Com impacto mensurado" value={formatNumber(measuredInitiatives.length)} accent="green" compact={compact} />
    </section>
  );
}
