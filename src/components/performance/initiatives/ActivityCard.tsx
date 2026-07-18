import { useState } from "react";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InitiativePriorityMenu } from "@/components/performance/initiatives/InitiativePriorityMenu";
import type { Company } from "@/data/performanceSystem";
import { formatWorkItemReference } from "@/lib/workItemReferences";
import { cn } from "@/lib/utils";
import {
  type InitiativeActivity,
  type InitiativeActivityInput,
  type InitiativeActivityStatus,
  initiativeActivityStatuses,
} from "@/lib/initiativeActivityStore";

function formatDateBr(value?: string) {
  if (!value) return "Sem prazo";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

interface ActivityCardProps {
  activity: InitiativeActivity;
  company: Company;
  canManage: boolean;
  canReorder: boolean;
  onStatusChange: (activityId: string, status: InitiativeActivityStatus) => void;
  onUpdate: (activity: InitiativeActivityInput) => void;
}

export function ActivityCard({ activity, company, canManage, canReorder, onStatusChange, onUpdate }: ActivityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [definitionOfDone, setDefinitionOfDone] = useState("");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
    disabled: !canReorder,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const saveDefinition = () => {
    onUpdate({ ...activity, definitionOfDone, description: definitionOfDone });
    setIsExpanded(false);
  };

  const cancelDefinition = () => {
    setIsExpanded(false);
  };

  const toggleDefinition = () => {
    if (!isExpanded) setDefinitionOfDone(activity.definitionOfDone || activity.description || "");
    setIsExpanded((current) => !current);
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised",
        isDragging && "relative z-20 opacity-80",
      )}
    >
      <div className="grid items-center gap-2 p-3 lg:grid-cols-[28px_minmax(160px,1fr)_90px_85px_125px_75px]">
        <button
          type="button"
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-bvbp-ink/10 text-bvbp-muted-ink",
            canReorder ? "cursor-grab active:cursor-grabbing" : "cursor-default opacity-35",
          )}
          aria-label={`Arrastar ${activity.title}`}
          disabled={!canReorder}
          {...(canReorder ? attributes : {})}
          {...(canReorder ? listeners : {})}
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>

        <button type="button" className="min-w-0 text-left" onClick={toggleDefinition}>
          <span className="font-label text-[10px] font-semibold text-bvbp-gold">
            {formatWorkItemReference(company, activity.referenceNumber)}
          </span>
          <span className="mt-1 flex items-start gap-2 text-sm font-semibold leading-5 text-bvbp-ink">
            <span className="min-w-0 flex-1">{activity.title}</span>
            {isExpanded ? <ChevronUp className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <ChevronDown className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
          </span>
        </button>

        <span className="text-sm font-medium text-bvbp-ink">{activity.owner || "A definir"}</span>

        <InitiativePriorityMenu priority={activity.priority} canManage={canManage} onChange={(priority) => onUpdate({ ...activity, priority })} />

        {canManage ? (
          <Select value={activity.status} onValueChange={(value) => onStatusChange(activity.id, value as InitiativeActivityStatus)}>
            <SelectTrigger className="h-8 border-0 bg-transparent px-2 text-xs shadow-none" aria-label={`Status de ${activity.title}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {initiativeActivityStatuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : <span className="text-xs font-semibold text-bvbp-muted-ink">{activity.status}</span>}

        <span className="text-sm font-medium text-bvbp-ink">{formatDateBr(activity.endDate || activity.dueDate)}</span>
      </div>

      {isExpanded ? (
        <div className="border-t border-bvbp-ink/10 bg-bvbp-inset p-3">
          <label className="font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink" htmlFor={`definition-${activity.id}`}>
            Definição de pronto
          </label>
          <Textarea
            id={`definition-${activity.id}`}
            value={definitionOfDone}
            onChange={(event) => setDefinitionOfDone(event.target.value)}
            placeholder="O que precisa ser verdade para considerar esta atividade concluída?"
            className="mt-2 min-h-20 bg-bvbp-raised"
            readOnly={!canManage}
          />
          {canManage ? (
            <div className="mt-3 flex justify-end gap-2">
              <Button type="button" size="sm" variant="ghost" onClick={cancelDefinition}>Cancelar</Button>
              <Button type="button" size="sm" onClick={saveDefinition}>Salvar definição</Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
