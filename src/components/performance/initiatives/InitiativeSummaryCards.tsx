import { MetricCard } from "@/components/performance/MetricCard";
import type { PdcaCycle } from "@/data/performanceSystem";
import type { InitiativeActivity } from "@/lib/initiativeActivityStore";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";

interface InitiativeSummaryCardsProps {
  initiatives: PdcaCycle[];
  activities: InitiativeActivity[];
}

export function InitiativeSummaryCards({ initiatives, activities }: InitiativeSummaryCardsProps) {
  const activeInitiatives = initiatives.filter((initiative) => !["Padronizar", "Pausar"].includes(initiative.pdcaStatus));
  const totalImpact = initiatives.reduce((sum, initiative) => sum + initiative.estimatedImpact, 0);

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard title="Iniciativas" value={formatNumber(initiatives.length)} accent="blue" />
      <MetricCard title="Ativas" value={formatNumber(activeInitiatives.length)} accent="orange" />
      <MetricCard title="Atividades" value={formatNumber(activities.length)} accent="gray" />
      <MetricCard title="Impacto estimado" value={`${formatCurrency(totalImpact)}/mês`} accent="green" />
    </section>
  );
}
