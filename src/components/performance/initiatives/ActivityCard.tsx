import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { DatePickerBr } from "@/components/ui/date-picker-br";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InitiativePriorityMenu } from "@/components/performance/initiatives/InitiativePriorityMenu";
import { StatusBadge } from "@/components/performance/StatusBadge";
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
  const [isDefinitionOpen, setIsDefinitionOpen] = useState(false);
  const [definitionOfDone, setDefinitionOfDone] = useState("");
  const [owner, setOwner] = useState(activity.owner || "");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
    disabled: !canReorder,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  useEffect(() => setOwner(activity.owner || ""), [activity.owner]);

  const saveDefinition = () => {
    onUpdate({ ...activity, definitionOfDone, description: definitionOfDone });
    setIsDefinitionOpen(false);
  };

  const cancelDefinition = () => {
    setIsDefinitionOpen(false);
  };

  const openDefinition = () => {
    setDefinitionOfDone(activity.definitionOfDone || activity.description || "");
    setIsDefinitionOpen(true);
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-b border-bvbp-ink/10 bg-bvbp-raised last:border-b-0",
        isDragging && "relative z-20 opacity-80",
      )}
    >
      <div className="grid items-center gap-2 px-3 py-2.5 lg:grid-cols-[14px_45px_minmax(130px,1fr)_90px_65px_100px_95px]">
        <button
          type="button"
          className={cn(
            "inline-flex h-7 w-6 items-center justify-center text-bvbp-muted-ink",
            canReorder ? "cursor-grab active:cursor-grabbing" : "cursor-default opacity-35",
          )}
          aria-label={`Arrastar ${activity.title}`}
          disabled={!canReorder}
          {...(canReorder ? attributes : {})}
          {...(canReorder ? listeners : {})}
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>

        <span className="truncate font-label text-[9px] font-medium text-bvbp-gold">
          {formatWorkItemReference(company, activity.referenceNumber)}
        </span>

        <button type="button" className="min-w-0 truncate text-left text-sm font-medium text-bvbp-ink hover:underline" onClick={openDefinition}>
          {activity.title}
        </button>

        {canManage ? (
          <Input
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            onBlur={() => owner.trim() !== (activity.owner || "") && onUpdate({ ...activity, owner })}
            className="h-8 min-w-0 border-0 bg-transparent px-1 text-xs font-normal shadow-none focus-visible:ring-1"
            placeholder="A definir"
            aria-label={`Responsável por ${activity.title}`}
          />
        ) : <span className="truncate text-sm font-normal text-bvbp-ink">{activity.owner || "A definir"}</span>}

        <InitiativePriorityMenu priority={activity.priority} canManage={canManage} onChange={(priority) => onUpdate({ ...activity, priority })} />

        {canManage ? (
          <Select value={activity.status} onValueChange={(value) => onStatusChange(activity.id, value as InitiativeActivityStatus)}>
            <SelectTrigger className="h-8 border-0 bg-transparent px-1 text-xs shadow-none" aria-label={`Status de ${activity.title}`}>
              <StatusBadge label={activity.status} />
            </SelectTrigger>
            <SelectContent>
              {initiativeActivityStatuses.map((status) => <SelectItem key={status} value={status}><StatusBadge label={status} /></SelectItem>)}
            </SelectContent>
          </Select>
        ) : <span className="text-xs font-semibold text-bvbp-muted-ink">{activity.status}</span>}

        {canManage ? (
          <DatePickerBr
            id={`activity-deadline-${activity.id}`}
            value={activity.endDate || activity.dueDate || ""}
            onChange={(value) => onUpdate({ ...activity, endDate: value, dueDate: value })}
            className="h-8 border-0 bg-transparent px-1 shadow-none"
          />
        ) : <span className="text-sm font-normal text-bvbp-ink">{formatDateBr(activity.endDate || activity.dueDate)}</span>}
      </div>

      <Dialog open={isDefinitionOpen} onOpenChange={setIsDefinitionOpen}>
        <DialogContent withinContentArea className="max-w-lg bg-bvbp-ivory">
          <DialogHeader>
            <DialogTitle>{formatWorkItemReference(company, activity.referenceNumber)}</DialogTitle>
            <DialogDescription>Definição de pronto</DialogDescription>
          </DialogHeader>
          <Textarea
            id={`definition-${activity.id}`}
            value={definitionOfDone}
            onChange={(event) => setDefinitionOfDone(event.target.value)}
            placeholder="O que precisa ser verdade para considerar esta atividade concluída?"
            className="min-h-28 bg-bvbp-raised"
            readOnly={!canManage}
          />
          {canManage ? (
            <DialogFooter>
              <Button type="button" size="sm" variant="ghost" onClick={cancelDefinition}>Cancelar</Button>
              <Button type="button" size="sm" onClick={saveDefinition}>Salvar definição</Button>
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>
    </article>
  );
}
