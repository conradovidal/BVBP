import { GripVertical } from "lucide-react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { StatusBadge } from "@/components/performance/StatusBadge";
import { InitiativeStatusMenu } from "@/components/performance/initiatives/InitiativeStatusMenu";
import { InitiativePriorityMenu } from "@/components/performance/initiatives/InitiativePriorityMenu";
import type { Company, InitiativePriority, PdcaCycle, PdcaStatus } from "@/data/performanceSystem";
import { formatMetricValue } from "@/lib/initiativeProgress";
import { formatWorkItemReference } from "@/lib/workItemReferences";
import { cn } from "@/lib/utils";

function formatDateBr(value?: string) {
  if (!value) return "Sem prazo";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
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
}: {
  initiative: PdcaCycle;
  company: Company;
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
        "grid gap-2 border-b border-bvbp-ink/10 bg-bvbp-raised px-3 py-2.5 shadow-none transition-colors last:border-b-0 lg:grid-cols-[20px_56px_minmax(160px,1.4fr)_90px_90px_minmax(125px,0.8fr)_75px_120px_80px] lg:items-center",
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

      <span className="truncate font-label text-[9px] font-medium text-bvbp-gold">{formatWorkItemReference(company, initiative.referenceNumber)}</span>

      <button type="button" className="min-w-0 text-left" onClick={() => onSelect(initiative)}>
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-sm font-medium leading-5 text-bvbp-ink">{initiative.title}</h2>
          {!initiative.pillarId || !initiative.metricId || !initiative.painLabel ? <StatusBadge label="Vínculo a revisar" /> : null}
        </div>
      </button>

      <button type="button" className="min-w-0 truncate text-left text-sm font-normal text-bvbp-ink" onClick={() => onSelect(initiative)}>
        {initiative.owner || "A definir"}
      </button>

      <button type="button" className="min-w-0 text-left" onClick={() => onSelect(initiative)}>
        <span className="text-sm font-normal text-bvbp-ink">{initiative.affectedPointer || "A definir"}</span>
      </button>

      <button type="button" className="grid gap-1 text-left" onClick={() => onSelect(initiative)}>
        <span className="text-sm font-normal text-bvbp-ink">
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

      <button type="button" className="text-left text-sm font-normal text-bvbp-ink" onClick={() => onSelect(initiative)}>
        {formatDateBr(initiative.deadline || initiative.endDate)}
      </button>
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
          />
        ))}
      </div>
    </SortableContext>
  );
}
