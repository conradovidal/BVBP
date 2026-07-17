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
import { InitiativePriorityMenu } from "@/components/performance/initiatives/InitiativePriorityMenu";
import { InitiativeStatusMenu } from "@/components/performance/initiatives/InitiativeStatusMenu";
import { bvbpPillarLabels, evidenceTypes, type Company, type EvidenceType, type InitiativePriority, type PdcaCycle, type PdcaStatus } from "@/data/performanceSystem";
import type { EvidenceInput } from "@/lib/pdcaCycleStore";
import {
  type InitiativeActivity,
  type InitiativeActivityInput,
  type InitiativeActivityStatus,
} from "@/lib/initiativeActivityStore";
import { calculateInitiativeProgress, formatMetricValue, getInitiativeImpactLabel } from "@/lib/initiativeProgress";
import { formatWorkItemReference } from "@/lib/workItemReferences";

function formatDateBr(value?: string) {
  if (!value) return "Sem data";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

interface InitiativeDetailPanelProps {
  initiative: PdcaCycle | null;
  company: Company;
  activities: InitiativeActivity[];
  activityForm: InitiativeActivityInput;
  evidenceForm: EvidenceInput;
  canManageInitiative: boolean;
  onEdit: () => void;
  onStatusChange: (status: PdcaStatus) => void;
  onPriorityChange: (priority: InitiativePriority) => void;
  onActivityFormChange: (value: InitiativeActivityInput) => void;
  onAddActivity: () => void;
  onUpdateActivity: (activity: InitiativeActivityInput) => void;
  onActivityStatusChange: (activityId: string, status: InitiativeActivityStatus) => void;
  onEvidenceFormChange: (value: EvidenceInput) => void;
  onAddEvidence: () => void;
}

export function InitiativeDetailPanel({
  initiative,
  company,
  activities,
  activityForm,
  evidenceForm,
  canManageInitiative,
  onEdit,
  onStatusChange,
  onPriorityChange,
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

  const sourceLabel = initiative.metricSourceSnapshot
    ? `${initiative.metricValueOrigin === "estimated" ? "Estimado · " : ""}${initiative.metricSourceSnapshot}`
    : "Não informada";

  return (
    <section className="overflow-hidden rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised">
      <div className="flex flex-col gap-4 border-b border-bvbp-ink/10 p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-gold">
            {formatWorkItemReference(company, initiative.referenceNumber)}
          </p>
          <button type="button" tabIndex={-1} onClick={canManageInitiative ? onEdit : undefined} className="mt-2 text-left focus:outline-none">
            <h2 className="font-heading text-2xl font-bold text-bvbp-ink">{initiative.title}</h2>
          </button>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-bvbp-inset px-2.5 py-1 text-xs font-semibold text-bvbp-muted-ink">
              {initiative.pillarId ? bvbpPillarLabels[initiative.pillarId] : "Vínculo a revisar"}
            </span>
            {initiative.painLabel ? (
              <span className="rounded-full bg-bvbp-inset px-2.5 py-1 text-xs font-semibold text-bvbp-muted-ink">{initiative.painLabel}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6 p-5">
          <section className="space-y-4">
            <button type="button" onClick={canManageInitiative ? onEdit : undefined} className="w-full text-left">
              <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Hipótese</p>
              <p className="mt-2 text-sm leading-6 text-bvbp-ink">{initiative.hypothesis || "Hipótese a definir."}</p>
            </button>
            <div>
              <button type="button" onClick={canManageInitiative ? onEdit : undefined} className="w-full text-left">
                <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Por que importa</p>
                <p className="mt-2 text-sm leading-6 text-bvbp-ink">{initiative.whyItMatters || "Impacto a detalhar."}</p>
              </button>
            </div>
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

          <InitiativeActivityBoard
            activities={activities}
            company={company}
            formValue={activityForm}
            onFormChange={onActivityFormChange}
            onAddActivity={onAddActivity}
            onUpdateActivity={onUpdateActivity}
            onStatusChange={onActivityStatusChange}
          />

          <section className="space-y-3">
            <SectionHeader title="Comentários e evidências" />
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
              {!initiative.evidences.length && <p className="text-sm leading-6 text-bvbp-muted-ink">Nenhuma evidência registrada ainda.</p>}
            </div>
            <div className="grid gap-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset p-3 md:grid-cols-[160px_minmax(0,1fr)]">
              <Select value={evidenceForm.type} onValueChange={(value) => onEvidenceFormChange({ ...evidenceForm, type: value as EvidenceType })}>
                <SelectTrigger className="bg-bvbp-raised"><SelectValue /></SelectTrigger>
                <SelectContent>{evidenceTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
              </Select>
              <Input value={evidenceForm.description} onChange={(event) => onEvidenceFormChange({ ...evidenceForm, description: event.target.value })} placeholder="Descrição da evidência" />
              <Input value={evidenceForm.observedValue} onChange={(event) => onEvidenceFormChange({ ...evidenceForm, observedValue: event.target.value })} placeholder="Valor observado" />
              <Input value={evidenceForm.note} onChange={(event) => onEvidenceFormChange({ ...evidenceForm, note: event.target.value })} placeholder="Observação" />
              <Button className="md:col-span-2" variant="outline" onClick={onAddEvidence} disabled={!evidenceForm.description.trim()}>Registrar evidência</Button>
            </div>
          </section>

        </div>

        <aside className="border-t border-bvbp-ink/10 bg-bvbp-inset p-4 lg:border-l lg:border-t-0">
          <div className="space-y-5 lg:sticky lg:top-0">
            <div className="flex flex-wrap gap-2">
              {canManageInitiative ? (
                <InitiativeStatusMenu status={initiative.pdcaStatus} onChange={onStatusChange} />
              ) : <StatusBadge label={initiative.pdcaStatus} />}
              <InitiativePriorityMenu priority={initiative.priority} canManage={canManageInitiative} onChange={onPriorityChange} />
            </div>
            <div className="divide-y divide-bvbp-ink/10 text-sm">
              {[
                ["Responsável", initiative.owner || "Sem responsável"],
                ["Equipe", initiative.teamMembers?.length ? initiative.teamMembers.join(", ") : "Sem equipe definida"],
                ["Início", formatDateBr(initiative.startDate)],
                ["Prazo", formatDateBr(initiative.deadline || initiative.endDate)],
                ["Ponteiro", initiative.affectedPointer || "A definir"],
                ["Baseline", baselineLabel],
                ["Meta", targetLabel],
                ["Fonte", sourceLabel],
                ["Impacto", getInitiativeImpactLabel(initiative)],
              ].map(([label, value]) => (
                <button
                  type="button"
                  key={label}
                  onClick={canManageInitiative ? onEdit : undefined}
                  className="block w-full py-3 text-left first:pt-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-bvbp-gold/45"
                >
                  <span className="block font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">{label}</span>
                  <span className="mt-1 block font-semibold leading-5 text-bvbp-ink">{value}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
