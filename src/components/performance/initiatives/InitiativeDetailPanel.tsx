import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/performance/StatusBadge";
import { SectionHeader } from "@/components/performance/SectionHeader";
import { InitiativeActivityBoard } from "@/components/performance/initiatives/InitiativeActivityBoard";
import { bvbpPillarLabels, evidenceTypes, type EvidenceType, type PdcaCycle } from "@/data/performanceSystem";
import type { EvidenceInput } from "@/lib/pdcaCycleStore";
import {
  type InitiativeActivity,
  type InitiativeActivityInput,
  type InitiativeActivityStatus,
} from "@/lib/initiativeActivityStore";
import { calculateInitiativeProgress, formatMetricValue, getInitiativeImpactLabel } from "@/lib/initiativeProgress";

function formatDateBr(value?: string) {
  if (!value) return "Sem data";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

interface InitiativeDetailPanelProps {
  initiative: PdcaCycle | null;
  activities: InitiativeActivity[];
  activityForm: InitiativeActivityInput;
  evidenceForm: EvidenceInput;
  canManageInitiative: boolean;
  onEdit: () => void;
  onActivityFormChange: (value: InitiativeActivityInput) => void;
  onAddActivity: () => void;
  onUpdateActivity: (activity: InitiativeActivityInput) => void;
  onActivityStatusChange: (activityId: string, status: InitiativeActivityStatus) => void;
  onEvidenceFormChange: (value: EvidenceInput) => void;
  onAddEvidence: () => void;
}

export function InitiativeDetailPanel({
  initiative,
  activities,
  activityForm,
  evidenceForm,
  canManageInitiative,
  onEdit,
  onActivityFormChange,
  onAddActivity,
  onUpdateActivity,
  onActivityStatusChange,
  onEvidenceFormChange,
  onAddEvidence,
}: InitiativeDetailPanelProps) {
  if (!initiative) {
    return (
      <section className="rounded-[8px] border border-dashed border-bvbp-ink/15 bg-bvbp-raised p-6 text-center">
        <p className="font-heading text-lg font-semibold text-bvbp-ink">Selecione uma iniciativa</p>
        <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">
          O detalhe aparece aqui, com hipótese, evidências e atividades conectadas.
        </p>
      </section>
    );
  }
  const progress = calculateInitiativeProgress(initiative);
  const baselineLabel = initiative.baselineValue === undefined
    ? initiative.baseline || "Sem baseline"
    : formatMetricValue(initiative.baselineValue, initiative.metricUnit);
  const targetLabel = initiative.targetValue === undefined
    ? initiative.target || "Sem meta"
    : formatMetricValue(initiative.targetValue, initiative.metricUnit);

  return (
    <section className="space-y-6 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
            Detalhe da iniciativa
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-bvbp-ink">{initiative.title}</h2>
          <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">
            {initiative.affectedPointer}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {initiative.pillarId ? <StatusBadge label={bvbpPillarLabels[initiative.pillarId]} /> : <StatusBadge label="Vínculo a revisar" />}
            {initiative.painLabel ? <StatusBadge label={initiative.painLabel} /> : null}
          </div>
        </div>
        {canManageInitiative ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-[8px] border-bvbp-ink/15 bg-transparent text-bvbp-ink hover:bg-bvbp-inset"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Editar iniciativa
          </Button>
        ) : null}
      </div>

      <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {[
          ["Responsável", initiative.owner || "Sem responsável"],
          ["Equipe", initiative.teamMembers?.length ? initiative.teamMembers.join(", ") : "Sem equipe definida"],
          ["Início", formatDateBr(initiative.startDate)],
          ["Prazo", formatDateBr(initiative.deadline || initiative.endDate)],
          ["Status", initiative.pdcaStatus],
          ["Impacto", getInitiativeImpactLabel(initiative)],
          ["Baseline", baselineLabel],
          ["Meta", targetLabel],
          ["Fonte", initiative.metricSourceSnapshot
            ? `${initiative.metricValueOrigin === "estimated" ? "Estimado · " : ""}${initiative.metricSourceSnapshot}`
            : "Não informada"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-3">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">{label}</p>
            <p className="mt-1 text-sm font-bold text-bvbp-ink">{value}</p>
          </div>
        ))}
      </section>

      {progress !== undefined ? (
        <section className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4">
          <div className="flex items-center justify-between gap-3 text-sm font-semibold text-bvbp-ink">
            <span>Progresso até a meta</span><span>{progress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-bvbp-ink/10">
            <div className="h-full rounded-full bg-bvbp-positive" style={{ width: `${progress}%` }} />
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4 lg:col-span-2">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Hipótese</p>
          <p className="mt-2 text-sm leading-6 text-bvbp-ink">{initiative.hypothesis || "Hipótese a definir."}</p>
        </div>
        <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Próxima decisão</p>
          <p className="mt-2 text-sm leading-6 text-bvbp-ink">{initiative.nextDecision || "Definir próxima decisão."}</p>
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeader title="Evidências" />
        <div className="space-y-2">
          {initiative.evidences.map((evidence) => (
            <article key={evidence.id} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label={evidence.type} />
                <span className="text-xs font-semibold text-bvbp-muted-ink/70">{evidence.date}</span>
                {evidence.observedValue && <span className="text-xs font-semibold text-bvbp-positive">{evidence.observedValue}</span>}
              </div>
              <p className="mt-2 text-sm leading-6 text-bvbp-ink">{evidence.description}</p>
              {evidence.note && <p className="mt-1 text-xs leading-5 text-bvbp-muted-ink">{evidence.note}</p>}
            </article>
          ))}
          {!initiative.evidences.length && (
            <p className="text-sm leading-6 text-bvbp-muted-ink">Nenhuma evidência registrada ainda.</p>
          )}
        </div>
        <div className="grid gap-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset p-3 md:grid-cols-[160px_minmax(0,1fr)]">
          <Select
            value={evidenceForm.type}
            onValueChange={(value) => onEvidenceFormChange({ ...evidenceForm, type: value as EvidenceType })}
          >
            <SelectTrigger className="bg-bvbp-raised">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {evidenceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={evidenceForm.description}
            onChange={(event) => onEvidenceFormChange({ ...evidenceForm, description: event.target.value })}
            placeholder="Descrição da evidência"
          />
          <Input
            value={evidenceForm.observedValue}
            onChange={(event) => onEvidenceFormChange({ ...evidenceForm, observedValue: event.target.value })}
            placeholder="Valor observado"
          />
          <Input
            value={evidenceForm.note}
            onChange={(event) => onEvidenceFormChange({ ...evidenceForm, note: event.target.value })}
            placeholder="Observação"
          />
          <Button className="md:col-span-2" variant="outline" onClick={onAddEvidence} disabled={!evidenceForm.description.trim()}>
            Registrar evidência
          </Button>
        </div>
      </section>

      <InitiativeActivityBoard
        activities={activities}
        formValue={activityForm}
        onFormChange={onActivityFormChange}
        onAddActivity={onAddActivity}
        onUpdateActivity={onUpdateActivity}
        onStatusChange={onActivityStatusChange}
      />
    </section>
  );
}
