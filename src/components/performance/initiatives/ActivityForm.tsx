import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { InitiativeActivityInput } from "@/lib/initiativeActivityStore";

interface ActivityFormProps {
  value: InitiativeActivityInput;
  onChange: (value: InitiativeActivityInput) => void;
  onSubmit: () => void;
}

export function ActivityForm({ value, onChange, onSubmit }: ActivityFormProps) {
  return (
    <div className="grid gap-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset p-3 md:grid-cols-[minmax(0,1fr)_150px_150px_auto]">
      <div className="space-y-2 md:col-span-4">
        <Input
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          placeholder="Nova atividade"
        />
        <Textarea
          value={value.description || ""}
          onChange={(event) => onChange({ ...value, description: event.target.value })}
          placeholder="Descrição curta, se necessário"
          className="min-h-20"
        />
      </div>
      <Input
        value={value.owner || ""}
        onChange={(event) => onChange({ ...value, owner: event.target.value })}
        placeholder="Responsável"
      />
      <Input
        value={value.dueDate || ""}
        onChange={(event) => onChange({ ...value, dueDate: event.target.value })}
        placeholder="Prazo"
      />
      <div className="hidden md:block" />
      <Button
        type="button"
        variant="outline"
        className="rounded-[8px] border-bvbp-forest bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark hover:text-bvbp-ivory"
        onClick={onSubmit}
        disabled={!value.title.trim()}
      >
        Adicionar
      </Button>
    </div>
  );
}
