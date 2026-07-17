import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InitiativePriorityMenu } from "@/components/performance/initiatives/InitiativePriorityMenu";
import type { InitiativeActivityInput } from "@/lib/initiativeActivityStore";

interface ActivityFormProps {
  value: InitiativeActivityInput;
  onChange: (value: InitiativeActivityInput) => void;
  onSubmit: () => void;
}

export function ActivityForm({ value, onChange, onSubmit }: ActivityFormProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="space-y-2 md:col-span-2">
        <Input
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          placeholder="Título da atividade"
        />
        <Textarea
          value={value.definitionOfDone || value.description || ""}
          onChange={(event) => onChange({ ...value, definitionOfDone: event.target.value, description: event.target.value })}
          placeholder="Definição de pronto: qual resultado comprova que esta atividade terminou?"
          className="min-h-20"
        />
      </div>
      <Input
        value={value.owner || ""}
        onChange={(event) => onChange({ ...value, owner: event.target.value })}
        placeholder="Responsável"
      />
      <Input
        type="date"
        value={value.startDate || ""}
        onChange={(event) => onChange({ ...value, startDate: event.target.value })}
        aria-label="Data de início"
      />
      <Input
        type="date"
        value={value.endDate || value.dueDate || ""}
        onChange={(event) => onChange({ ...value, endDate: event.target.value, dueDate: event.target.value })}
        aria-label="Data de término"
      />
      <div className="flex items-center rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised px-2">
        <span className="mr-auto text-xs font-semibold text-bvbp-muted-ink">Prioridade</span>
        <InitiativePriorityMenu priority={value.priority} canManage onChange={(priority) => onChange({ ...value, priority })} />
      </div>
      <Button
        type="button"
        variant="outline"
        className="rounded-[8px] border-bvbp-forest bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark hover:text-bvbp-ivory"
        onClick={onSubmit}
        disabled={!value.title.trim()}
      >
        Adicionar atividade
      </Button>
    </div>
  );
}
