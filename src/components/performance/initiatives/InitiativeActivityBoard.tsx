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
import { ActivityCard } from "@/components/performance/initiatives/ActivityCard";
import { ActivityForm } from "@/components/performance/initiatives/ActivityForm";
import {
  type InitiativeActivity,
  type InitiativeActivityInput,
  type InitiativeActivityStatus,
} from "@/lib/initiativeActivityStore";
import type { Company } from "@/data/performanceSystem";

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
  const sortedActivities = [...activities].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.createdAt.localeCompare(b.createdAt));

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
    const reordered = [...sortedActivities];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    onReorder(reordered.map((activity) => activity.id));
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionHeader title="Atividades" description="Itens executáveis da iniciativa, ordenados conforme a sequência de trabalho." />
        {canManage ? (
          <Button type="button" size="sm" variant="outline" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nova atividade
          </Button>
        ) : null}
      </div>

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
        <div className="hidden grid-cols-[28px_minmax(160px,1fr)_90px_85px_125px_75px] gap-2 border-b border-bvbp-ink/10 px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink lg:grid">
          <span aria-hidden="true" />
          <span>Atividade</span>
          <span>Responsável</span>
          <span>Prioridade</span>
          <span>Status</span>
          <span>Prazo</span>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedActivities.map((activity) => activity.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 p-2">
              {sortedActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  company={company}
                  canManage={canManage}
                  canReorder={canManage}
                  onStatusChange={onStatusChange}
                  onUpdate={onUpdateActivity}
                />
              ))}
              {!sortedActivities.length ? <p className="p-4 text-center text-sm text-bvbp-muted-ink">Nenhuma atividade cadastrada.</p> : null}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
}
