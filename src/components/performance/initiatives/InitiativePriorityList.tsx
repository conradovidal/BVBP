import { GripVertical } from "lucide-react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { StatusBadge } from "@/components/performance/StatusBadge";
import { DatePickerBr } from "@/components/ui/date-picker-br";
import { InitiativeStatusMenu } from "@/components/performance/initiatives/InitiativeStatusMenu";
import { InitiativePriorityMenu } from "@/components/performance/initiatives/InitiativePriorityMenu";
import type { Company, InitiativePriority, PdcaCycle, PdcaStatus } from "@/data/performanceSystem";
import { getInitiativeMetricLabel } from "@/lib/initiativeFocus";
import { formatWorkItemReference } from "@/lib/workItemReferences";
import { cn } from "@/lib/utils";
import { formatCompactOwner, initiativeListGridClass } from "@/components/performance/initiatives/initiativeListLayout";

function formatCompactDate(value?: string) {
  if (!value) return "—";
  const [, month, day] = value.split("-");
  return month && day ? `${day}/${month}` : value;
}

interface InitiativePriorityListProps {
  initiatives: PdcaCycle[];
  company: Company;
  selectedInitiativeId?: string;
  canManage: boolean;
  canReorder?: boolean;
  onSelect: (initiative: PdcaCycle) => void;
  onStatusChange: (initiativeId: string, status: PdcaStatus) => void;
  onPriorityChange: (initiativeId: string, priority: InitiativePriority) => void;
  onDeadlineChange: (initiativeId: string, deadline: string) => void;
}

function SortableInitiativeRow({
  initiative,
  company,
  isSelected,
  canManage,
  canReorder,
  onSelect,
  onStatusChange,
  onPriorityChange,
  onDeadlineChange,
}: {
  initiative: PdcaCycle;
  company: Company;
  isSelected: boolean;
  canManage: boolean;
  canReorder: boolean;
  onSelect: (initiative: PdcaCycle) => void;
  onStatusChange: (initiativeId: string, status: PdcaStatus) => void;
  onPriorityChange: (initiativeId: string, priority: InitiativePriority) => void;
  onDeadlineChange: (initiativeId: string, deadline: string) => void;
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
        "grid gap-3 border-b border-bvbp-ink/10 bg-bvbp-raised px-3 py-2.5 shadow-none transition-colors last:border-b-0 min-[1180px]:items-center",
        initiativeListGridClass,
        isSelected ? "bg-bvbp-inset" : "hover:bg-bvbp-inset/60",
        isDragging && "relative z-20 opacity-80",
      )}
    >
      <button
        type="button"
        className={cn(
          "inline-flex h-7 w-6 items-center justify-center text-bvbp-muted-ink",
          canReorder ? "cursor-grab active:cursor-grabbing" : "cursor-default opacity-35",
        )}
        aria-label={`Arrastar ${initiative.title}`}
        disabled={!canReorder}
        {...(canReorder ? attributes : {})}
        {...(canReorder ? listeners : {})}
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      <span className="flex h-7 items-center truncate font-label text-[11px] font-semibold tracking-[0.02em] text-bvbp-gold">{formatWorkItemReference(company, initiative.referenceNumber)}</span>

      <button type="button" className="min-w-0 text-left" onClick={() => onSelect(initiative)}>
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-sm font-medium leading-5 text-bvbp-ink">{initiative.title}</h2>
          {!initiative.pillarId || !initiative.metricId ? <StatusBadge label="Vínculo a revisar" /> : null}
        </div>
      </button>

      <button type="button" className="min-w-0 truncate text-center text-sm font-normal text-bvbp-ink" title={initiative.owner || "A definir"} onClick={() => onSelect(initiative)}>
        {formatCompactOwner(initiative.owner)}
      </button>

      <button type="button" className="min-w-0 truncate text-left text-sm font-normal text-bvbp-ink" title={getInitiativeMetricLabel(initiative)} onClick={() => onSelect(initiative)}>
        {getInitiativeMetricLabel(initiative)}
      </button>

      <div className="flex items-center justify-center" onClick={(event) => event.stopPropagation()}>
        <InitiativePriorityMenu
          priority={initiative.priority}
          canManage={canManage}
          compact
          onChange={(priority) => onPriorityChange(initiative.id, priority)}
        />
      </div>

      <div className="flex items-center justify-center" onClick={(event) => event.stopPropagation()}>
        {canManage ? (
          <DatePickerBr
            id={`initiative-deadline-${initiative.id}`}
            value={initiative.deadline || initiative.endDate}
            onChange={(deadline) => onDeadlineChange(initiative.id, deadline)}
            displayMode="compact"
          />
        ) : <span className="text-xs text-bvbp-ink">{formatCompactDate(initiative.deadline || initiative.endDate)}</span>}
      </div>

      <div className="flex items-center justify-center" onClick={(event) => event.stopPropagation()}>
        {canManage ? (
          <InitiativeStatusMenu
            status={initiative.pdcaStatus}
            onChange={(status) => onStatusChange(initiative.id, status)}
            className="w-auto min-w-0"
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
  company,
  selectedInitiativeId,
  canManage,
  canReorder = canManage,
  onSelect,
  onStatusChange,
  onPriorityChange,
  onDeadlineChange,
}: InitiativePriorityListProps) {
  return (
    <SortableContext items={initiatives.map((initiative) => initiative.id)} strategy={verticalListSortingStrategy}>
      <div>
        {initiatives.map((initiative) => (
          <SortableInitiativeRow
            key={initiative.id}
            initiative={initiative}
            company={company}
            isSelected={initiative.id === selectedInitiativeId}
            canManage={canManage}
            canReorder={canReorder && Boolean(initiative.priority)}
            onSelect={onSelect}
            onStatusChange={onStatusChange}
            onPriorityChange={onPriorityChange}
            onDeadlineChange={onDeadlineChange}
          />
        ))}
      </div>
    </SortableContext>
  );
}
