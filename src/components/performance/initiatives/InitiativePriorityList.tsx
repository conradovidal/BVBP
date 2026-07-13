import { GripVertical } from "lucide-react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { StatusBadge } from "@/components/performance/StatusBadge";
import { InitiativeStatusMenu } from "@/components/performance/initiatives/InitiativeStatusMenu";
import type { PdcaCycle, PdcaStatus } from "@/data/performanceSystem";
import { formatCurrency } from "@/lib/performanceFormatters";
import { cn } from "@/lib/utils";

interface InitiativePriorityListProps {
  initiatives: PdcaCycle[];
  selectedInitiativeId?: string;
  canManage: boolean;
  onSelect: (initiative: PdcaCycle) => void;
  onStatusChange: (initiativeId: string, status: PdcaStatus) => void;
}

function formatImpact(value: number) {
  return value ? `${formatCurrency(value)}/mês` : "Sem baseline";
}

function SortableInitiativeRow({
  initiative,
  isSelected,
  canManage,
  onSelect,
  onStatusChange,
}: {
  initiative: PdcaCycle;
  isSelected: boolean;
  canManage: boolean;
  onSelect: (initiative: PdcaCycle) => void;
  onStatusChange: (initiativeId: string, status: PdcaStatus) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: initiative.id,
    disabled: !canManage,
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
        "grid gap-3 rounded-[8px] border bg-bvbp-raised p-3 shadow-none transition-colors lg:grid-cols-[32px_minmax(0,1.35fr)_minmax(170px,0.55fr)_minmax(150px,0.45fr)_160px]",
        isSelected ? "border-bvbp-forest/45 bg-bvbp-inset" : "border-bvbp-ink/10 hover:border-bvbp-ink/20",
        isDragging && "relative z-20 opacity-80",
      )}
    >
      <button
        type="button"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-bvbp-ink/10 text-bvbp-muted-ink",
          canManage ? "cursor-grab active:cursor-grabbing" : "cursor-default opacity-45",
        )}
        aria-label={`Arrastar ${initiative.title}`}
        disabled={!canManage}
        {...(canManage ? attributes : {})}
        {...(canManage ? listeners : {})}
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      <button type="button" className="min-w-0 text-left" onClick={() => onSelect(initiative)}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-base font-bold leading-5 text-bvbp-ink">{initiative.title}</h2>
          {isSelected && <span className="text-xs font-semibold text-bvbp-forest">Selecionada</span>}
        </div>
        <p className="mt-1 text-xs font-semibold text-bvbp-muted-ink">{initiative.affectedPointer}</p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-bvbp-muted-ink">
          {initiative.hypothesis || initiative.nextDecision || "Hipótese a definir."}
        </p>
      </button>

      <button type="button" className="grid gap-1 text-left text-xs text-bvbp-muted-ink" onClick={() => onSelect(initiative)}>
        <span className="font-semibold text-bvbp-ink">{initiative.owner || "Sem responsável"}</span>
        <span>{initiative.deadline || initiative.endDate || "Sem prazo"}</span>
      </button>

      <button type="button" className="flex flex-wrap items-center gap-2 text-left" onClick={() => onSelect(initiative)}>
        <StatusBadge label={initiative.dataType} />
        <span className="text-xs font-semibold text-bvbp-positive">{formatImpact(initiative.estimatedImpact)}</span>
      </button>

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
  onSelect,
  onStatusChange,
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
            onSelect={onSelect}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </SortableContext>
  );
}
