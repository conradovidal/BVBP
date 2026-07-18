import { useState } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SectionHeader } from "@/components/performance/SectionHeader";
import { ActivityCard, activityListGridClass } from "@/components/performance/initiatives/ActivityCard";
import { ActivityForm } from "@/components/performance/initiatives/ActivityForm";
import {
  type InitiativeActivity,
  type InitiativeActivityInput,
  type InitiativeActivityStatus,
} from "@/lib/initiativeActivityStore";
import type { Company, InitiativePriority } from "@/data/performanceSystem";
import { cn } from "@/lib/utils";

interface InitiativeActivityBoardProps {
  activities: InitiativeActivity[];
  company: Company;
  formValue: InitiativeActivityInput;
  canManage: boolean;
  onFormChange: (value: InitiativeActivityInput) => void;
  onAddActivity: () => void;
  onUpdateActivity: (activity: InitiativeActivityInput) => void;
  onStatusChange: (activityId: string, status: InitiativeActivityStatus) => void;
  onReorder: (orderedIds: string[]) => void;
}

export function InitiativeActivityBoard({
  activities,
  company,
  formValue,
  canManage,
  onFormChange,
  onAddActivity,
  onUpdateActivity,
  onStatusChange,
  onReorder,
}: InitiativeActivityBoardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const priorityRank = (priority?: InitiativePriority) => priority === "Alta" ? 0 : priority === "Média" ? 1 : priority === "Baixa" ? 2 : 3;
  const sortedActivities = [...activities].sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || (a.order ?? 0) - (b.order ?? 0) || a.createdAt.localeCompare(b.createdAt));

  const submitActivity = () => {
    if (!formValue.title.trim()) return;
    onAddActivity();
    setIsFormOpen(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : "";
    if (!overId || activeId === overId) return;
    const from = sortedActivities.findIndex((activity) => activity.id === activeId);
    const to = sortedActivities.findIndex((activity) => activity.id === overId);
    if (from < 0 || to < 0) return;
    if (sortedActivities[from].priority !== sortedActivities[to].priority) return;
    const reordered = [...sortedActivities];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    onReorder(reordered.map((activity) => activity.id));
  };

  return (
    <section className="space-y-4">
      <SectionHeader title="Atividades" description="Itens executáveis da iniciativa, ordenados conforme a sequência de trabalho." />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent withinContentArea className="max-w-xl bg-bvbp-ivory">
          <DialogHeader>
            <DialogTitle>Nova atividade</DialogTitle>
            <DialogDescription>Defina o resultado esperado, responsável, prioridade e prazo.</DialogDescription>
          </DialogHeader>
          <ActivityForm value={formValue} onChange={onFormChange} onSubmit={submitActivity} />
        </DialogContent>
      </Dialog>

      <div className="overflow-hidden rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset">
        <div className={cn("hidden gap-2 border-b border-bvbp-ink/10 px-3 py-2 font-label text-[9px] font-medium uppercase tracking-[0.08em] text-bvbp-muted-ink min-[1180px]:grid", activityListGridClass)}>
          <span aria-hidden="true" />
          <span>ID</span>
          <span>Atividade</span>
          <span>Responsável</span>
          <span>Prioridade</span>
          <span>Status</span>
          <span>Prazo</span>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedActivities.map((activity) => activity.id)} strategy={verticalListSortingStrategy}>
            <div>
              {sortedActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  company={company}
                  canManage={canManage}
                  canReorder={canManage && Boolean(activity.priority)}
                  onStatusChange={onStatusChange}
                  onUpdate={onUpdateActivity}
                />
              ))}
              {!sortedActivities.length ? <p className="p-4 text-center text-sm text-bvbp-muted-ink">Nenhuma atividade cadastrada.</p> : null}
              {canManage ? (
                <button
                  type="button"
                  onClick={() => setIsFormOpen(true)}
                  className="flex w-full items-center gap-2 border-t border-dashed border-bvbp-ink/15 px-4 py-3 text-left text-sm text-bvbp-muted-ink transition-colors hover:bg-bvbp-raised hover:text-bvbp-ink"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Adicionar atividade
                </button>
              ) : null}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
}
