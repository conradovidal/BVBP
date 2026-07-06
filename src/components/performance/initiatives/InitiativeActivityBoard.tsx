import { EmptyState } from "@/components/performance/EmptyState";
import { SectionHeader } from "@/components/performance/SectionHeader";
import { ActivityCard } from "@/components/performance/initiatives/ActivityCard";
import { ActivityForm } from "@/components/performance/initiatives/ActivityForm";
import {
  type InitiativeActivity,
  type InitiativeActivityInput,
  type InitiativeActivityStatus,
  initiativeActivityStatuses,
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
  return (
    <section className="space-y-4">
      <SectionHeader title="Atividades" description="Board simples conectado a esta iniciativa." />
      <div className="grid gap-3 lg:grid-cols-4">
        {initiativeActivityStatuses.map((status) => {
          const statusActivities = activities.filter((activity) => activity.status === status);

          return (
            <div key={status} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-heading text-base font-bold text-bvbp-ink">{status}</h3>
                <span className="text-xs font-bold text-bvbp-muted-ink/70">{statusActivities.length}</span>
              </div>
              <div className="space-y-3">
                {statusActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onStatusChange={onStatusChange}
                    onUpdate={onUpdateActivity}
                  />
                ))}
                {!statusActivities.length && (
                  <p className="rounded-[8px] border border-dashed border-bvbp-ink/10 px-3 py-5 text-center text-xs font-medium text-bvbp-muted-ink/70">
                    Sem atividades.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!activities.length && (
        <EmptyState
          title="Nenhuma atividade conectada ainda."
          description="Adicione a primeira atividade para tirar a iniciativa do plano."
        />
      )}
      <ActivityForm value={formValue} onChange={onFormChange} onSubmit={onAddActivity} />
    </section>
  );
}
