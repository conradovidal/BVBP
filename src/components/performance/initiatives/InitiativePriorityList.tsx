import { GripVertical } from "lucide-react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { StatusBadge } from "@/components/performance/StatusBadge";
import { InitiativeStatusMenu } from "@/components/performance/initiatives/InitiativeStatusMenu";
import { InitiativePriorityMenu } from "@/components/performance/initiatives/InitiativePriorityMenu";
import type { InitiativePriority, PdcaCycle, PdcaStatus } from "@/data/performanceSystem";
import { formatMetricValue } from "@/lib/initiativeProgress";
import { cn } from "@/lib/utils";

interface InitiativePriorityListProps {
  initiatives: PdcaCycle[];
  selectedInitiativeId?: string;
  canManage: boolean;
  canReorder?: boolean;
  onSelect: (initiative: PdcaCycle) => void;
  onStatusChange: (initiativeId: string, status: PdcaStatus) => void;
  onPriorityChange: (initiativeId: string, priority: InitiativePriority) => void;
}

function SortableInitiativeRow({
  initiative,
  isSelected,
  canManage,
  canReorder,
  onSelect,
  onStatusChange,
  onPriorityChange,
}: {
  initiative: PdcaCycle;
  isSelected: boolean;
  canManage: boolean;
  canReorder: boolean;
  onSelect: (initiative: PdcaCycle) => void;
  onStatusChange: (initiativeId: string, status: PdcaStatus) => void;
  onPriorityChange: (initiativeId: string, priority: InitiativePriority) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: initiative.id,
    disabled: !canReorder,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        "grid gap-3 rounded-[8px] border bg-bvbp-raised p-3 shadow-none transition-colors lg:grid-cols-[32px_minmax(180px,1.25fr)_minmax(100px,0.5fr)_minmax(110px,0.55fr)_minmax(125px,0.65fr)_105px_160px] lg:items-center",
        isSelected ? "border-bvbp-forest/45 bg-bvbp-inset" : "border-bvbp-ink/10 hover:border-bvbp-ink/20",
        isDragging && "relative z-20 opacity-80",
      )}
    >
      <button
        type="button"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-bvbp-ink/10 text-bvbp-muted-ink",
          canReorder ? "cursor-grab active:cursor-grabbing" : "cursor-default opacity-35",
        )}
        aria-label={`Arrastar ${initiative.title}`}
        disabled={!canReorder}
        {...(canReorder ? attributes : {})}
        {...(canReorder ? listeners : {})}
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      <button type="button" className="min-w-0 text-left" onClick={() => onSelect(initiative)}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-base font-bold leading-5 text-bvbp-ink">{initiative.title}</h2>
          {!initiative.pillarId || !initiative.metricId || !initiative.painLabel ? <StatusBadge label="Vínculo a revisar" /> : null}
        </div>
      </button>

      <button type="button" className="grid gap-1 text-left text-xs text-bvbp-muted-ink" onClick={() => onSelect(initiative)}>
        <span className="font-label text-[10px] uppercase tracking-[0.08em]">Responsável</span>
        <span className="font-semibold text-bvbp-ink">{initiative.owner || "Sem responsável"}</span>
      </button>

      <button type="button" className="min-w-0 text-left" onClick={() => onSelect(initiative)}>
        <span className="text-sm font-semibold text-bvbp-ink">{initiative.affectedPointer || "A definir"}</span>
      </button>

      <button type="button" className="grid gap-1 text-left" onClick={() => onSelect(initiative)}>
        <span className="text-sm font-semibold text-bvbp-ink">
          {initiative.baselineValue === undefined
            ? initiative.baseline || "A definir"
            : formatMetricValue(initiative.baselineValue, initiative.metricUnit)}
          {" → "}
          {initiative.targetValue === undefined
            ? initiative.target || "A definir"
            : formatMetricValue(initiative.targetValue, initiative.metricUnit)}
        </span>
      </button>

      <div onClick={(event) => event.stopPropagation()}>
        <InitiativePriorityMenu
          priority={initiative.priority}
          canManage={canManage}
          onChange={(priority) => onPriorityChange(initiative.id, priority)}
        />
      </div>

      <div onClick={(event) => event.stopPropagation()}>
        {canManage ? (
          <InitiativeStatusMenu
            status={initiative.pdcaStatus}
            onChange={(status) => onStatusChange(initiative.id, status)}
            className="w-full"
          />
        ) : (
          <StatusBadge label={initiative.pdcaStatus} />
        )}
      </div>
    </article>
  );
}

export function InitiativePriorityList({
  initiatives,
  selectedInitiativeId,
  canManage,
  canReorder = canManage,
  onSelect,
  onStatusChange,
  onPriorityChange,
}: InitiativePriorityListProps) {
  return (
    <SortableContext items={initiatives.map((initiative) => initiative.id)} strategy={verticalListSortingStrategy}>
      <div className="space-y-3">
        {initiatives.map((initiative) => (
          <SortableInitiativeRow
            key={initiative.id}
            initiative={initiative}
            isSelected={initiative.id === selectedInitiativeId}
            canManage={canManage}
            canReorder={canReorder}
            onSelect={onSelect}
            onStatusChange={onStatusChange}
            onPriorityChange={onPriorityChange}
          />
        ))}
      </div>
    </SortableContext>
  );
}
