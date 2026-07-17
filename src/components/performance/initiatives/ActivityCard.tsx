import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  type InitiativeActivity,
  type InitiativeActivityInput,
  type InitiativeActivityStatus,
  initiativeActivityStatuses,
} from "@/lib/initiativeActivityStore";

interface ActivityCardProps {
  activity: InitiativeActivity;
  company: Company;
  onStatusChange: (activityId: string, status: InitiativeActivityStatus) => void;
  onUpdate: (activity: InitiativeActivityInput) => void;
}

export function ActivityCard({ activity, company, onStatusChange, onUpdate }: ActivityCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<InitiativeActivityInput>({
    id: activity.id,
    initiativeId: activity.initiativeId,
    title: activity.title,
    description: activity.description || "",
    definitionOfDone: activity.definitionOfDone || activity.description || "",
    owner: activity.owner || "",
    startDate: activity.startDate || "",
    endDate: activity.endDate || activity.dueDate || "",
    dueDate: activity.endDate || activity.dueDate || "",
    priority: activity.priority,
    status: activity.status,
  });

  const saveDraft = () => {
    if (!draft.title.trim()) return;
    onUpdate(draft);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <article className="space-y-2 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-3">
        <Input
          value={draft.title}
          onChange={(event) => setDraft({ ...draft, title: event.target.value })}
          placeholder="Título da atividade"
        />
        <Textarea
          value={draft.definitionOfDone || draft.description || ""}
          onChange={(event) => setDraft({ ...draft, definitionOfDone: event.target.value, description: event.target.value })}
          placeholder="Definição de pronto"
          className="min-h-20"
        />
        <Input
          value={draft.owner || ""}
          onChange={(event) => setDraft({ ...draft, owner: event.target.value })}
          placeholder="Responsável"
        />
        <Input
          type="date"
          value={draft.startDate || ""}
          onChange={(event) => setDraft({ ...draft, startDate: event.target.value })}
        />
        <Input
          type="date"
          value={draft.endDate || draft.dueDate || ""}
          onChange={(event) => setDraft({ ...draft, endDate: event.target.value, dueDate: event.target.value })}
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-bvbp-forest bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark hover:text-bvbp-ivory"
            onClick={saveDraft}
            disabled={!draft.title.trim()}
          >
            Salvar
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-label text-[10px] font-semibold text-bvbp-gold">{formatWorkItemReference(company, activity.referenceNumber)}</span>
          <p className="text-sm font-semibold leading-5 text-bvbp-ink">{activity.title}</p>
        </div>
        {(activity.definitionOfDone || activity.description) && <p className="mt-1 line-clamp-2 text-xs leading-5 text-bvbp-muted-ink">Pronto quando: {activity.definitionOfDone || activity.description}</p>}
        <p className="mt-1 text-xs leading-5 text-bvbp-muted-ink">
          {activity.owner || "Sem responsável"} · {activity.startDate || "Sem início"} → {activity.endDate || activity.dueDate || "Sem prazo"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <InitiativePriorityMenu priority={activity.priority} canManage onChange={(priority) => onUpdate({ ...activity, priority })} />
        <Select value={activity.status} onValueChange={(value) => onStatusChange(activity.id, value as InitiativeActivityStatus)}>
          <SelectTrigger className="h-8 w-[150px] bg-bvbp-ivory text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {initiativeActivityStatuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-bvbp-muted-ink hover:bg-bvbp-inset hover:text-bvbp-ink"
          onClick={() => setIsEditing(true)}
        >
          Editar
        </Button>
      </div>
    </article>
  );
}
