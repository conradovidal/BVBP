import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/performance/SectionHeader";
import { ActivityCard } from "@/components/performance/initiatives/ActivityCard";
import { ActivityForm } from "@/components/performance/initiatives/ActivityForm";
import {
  type InitiativeActivity,
  type InitiativeActivityInput,
  type InitiativeActivityStatus,
} from "@/lib/initiativeActivityStore";

interface InitiativeActivityBoardProps {
  activities: InitiativeActivity[];
  formValue: InitiativeActivityInput;
  onFormChange: (value: InitiativeActivityInput) => void;
  onAddActivity: () => void;
  onUpdateActivity: (activity: InitiativeActivityInput) => void;
  onStatusChange: (activityId: string, status: InitiativeActivityStatus) => void;
}

export function InitiativeActivityBoard({
  activities,
  formValue,
  onFormChange,
  onAddActivity,
  onUpdateActivity,
  onStatusChange,
}: InitiativeActivityBoardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const activeStatuses: InitiativeActivityStatus[] = ["Em validação", "Em andamento", "A fazer"];
  const completedActivities = activities.filter((activity) => activity.status === "Concluído");

  const submitActivity = () => {
    if (!formValue.title.trim()) return;
    onAddActivity();
    setIsFormOpen(false);
  };

  const activityRows = (statusActivities: InitiativeActivity[]) => (
    <div className="divide-y divide-bvbp-ink/10">
      {statusActivities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} onStatusChange={onStatusChange} onUpdate={onUpdateActivity} />
      ))}
      {!statusActivities.length ? <p className="py-4 text-sm text-bvbp-muted-ink">Nenhuma atividade neste estágio.</p> : null}
    </div>
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionHeader title="Atividades" description="Execução organizada pelo estágio mais próximo da conclusão." />
        <Button type="button" size="sm" variant="outline" onClick={() => setIsFormOpen((current) => !current)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nova atividade
        </Button>
      </div>

      {isFormOpen ? (
        <div className="space-y-2">
          <ActivityForm value={formValue} onChange={onFormChange} onSubmit={submitActivity} />
          <Button type="button" variant="ghost" size="sm" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
        </div>
      ) : null}

      <div className="space-y-3">
        <details className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-bvbp-ink">
            Concluídas ({completedActivities.length})
          </summary>
          <div className="border-t border-bvbp-ink/10 px-4">{activityRows(completedActivities)}</div>
        </details>

        {activeStatuses.map((status) => {
          const statusActivities = activities.filter((activity) => activity.status === status);

          return (
            <section key={status} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised px-4">
              <div className="flex items-center justify-between gap-3 border-b border-bvbp-ink/10 py-3">
                <h3 className="font-heading text-base font-bold text-bvbp-ink">{status}</h3>
                <span className="text-xs font-bold text-bvbp-muted-ink/70">{statusActivities.length}</span>
              </div>
              {activityRows(statusActivities)}
            </section>
          );
        })}
      </div>
    </section>
  );
}
