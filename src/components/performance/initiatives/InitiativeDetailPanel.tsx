import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { bvbpPillarLabels, type Company, type EvidenceType, type InitiativePriority, type PdcaCycle, type PdcaStatus } from "@/data/performanceSystem";
import type { EvidenceInput } from "@/lib/pdcaCycleStore";
import {
  type InitiativeActivity,
  type InitiativeActivityInput,
  type InitiativeActivityStatus,
} from "@/lib/initiativeActivityStore";
import { calculateInitiativeProgress, formatMetricValue, getInitiativeImpactLabel } from "@/lib/initiativeProgress";
import { formatWorkItemReference } from "@/lib/workItemReferences";

const commentTypes: EvidenceType[] = ["Comentário", "Aprendizado", "Reunião", "Decisão", "Dado"];

function formatDateBr(value?: string) {
  if (!value) return "Sem data";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function formatDateTimeBr(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
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
  onReorderActivities: (orderedIds: string[]) => void;
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
  onReorderActivities,
  onEvidenceFormChange,
  onAddEvidence,
}: InitiativeDetailPanelProps) {
  if (!initiative) {
    return (
      <section className="rounded-[8px] border border-dashed border-bvbp-ink/15 bg-bvbp-raised p-6 text-center">
        <p className="font-heading text-lg font-semibold text-bvbp-ink">Selecione uma iniciativa</p>
        <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">
          O detalhe aparece aqui, com hipótese, atividades, comentários e histórico.
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
            canManage={canManageInitiative}
            onFormChange={onActivityFormChange}
            onAddActivity={onAddActivity}
            onUpdateActivity={onUpdateActivity}
            onStatusChange={onActivityStatusChange}
            onReorder={onReorderActivities}
          />

          <section className="space-y-3">
            <SectionHeader title="Comentários e histórico" description="Contexto registrado pela equipe e alterações automáticas da iniciativa." />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-3">
                <h3 className="font-heading text-base font-semibold text-bvbp-ink">Comentários</h3>
                {canManageInitiative ? (
                  <div className="space-y-2 rounded-[8px] bg-bvbp-inset p-3">
                    <Select value={evidenceForm.type} onValueChange={(value) => onEvidenceFormChange({ ...evidenceForm, type: value as EvidenceType })}>
                      <SelectTrigger className="bg-bvbp-raised" aria-label="Classificação do comentário"><SelectValue /></SelectTrigger>
                      <SelectContent>{commentTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                    </Select>
                    <Textarea
                      value={evidenceForm.description}
                      onChange={(event) => onEvidenceFormChange({ ...evidenceForm, description: event.target.value })}
                      placeholder="Registre o contexto, aprendizado, reunião, decisão ou dado relevante."
                      className="min-h-20 bg-bvbp-raised"
                    />
                    <Button className="w-full" variant="outline" onClick={onAddEvidence} disabled={!evidenceForm.description.trim()}>Adicionar comentário</Button>
                  </div>
                ) : null}
                <div className="space-y-2">
                  {initiative.evidences.map((evidence) => (
                    <article key={evidence.id} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge label={evidence.type} />
                        <span className="text-xs font-semibold text-bvbp-muted-ink/70">{formatDateBr(evidence.date)}</span>
                        {evidence.createdByName ? <span className="text-xs text-bvbp-muted-ink">{evidence.createdByName}</span> : null}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-bvbp-ink">{evidence.description}</p>
                    </article>
                  ))}
                  {!initiative.evidences.length ? <p className="py-3 text-sm leading-6 text-bvbp-muted-ink">Nenhum comentário registrado.</p> : null}
                </div>
              </div>

              <div className="space-y-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-3">
                <h3 className="font-heading text-base font-semibold text-bvbp-ink">Histórico de alterações</h3>
                <div className="space-y-2">
                  {(initiative.history || []).map((entry) => (
                    <article key={entry.id} className="border-l-2 border-bvbp-ink/10 py-1 pl-3">
                      <p className="text-sm leading-5 text-bvbp-ink">{entry.description}</p>
                      <p className="mt-1 text-xs text-bvbp-muted-ink">
                        {formatDateTimeBr(entry.createdAt)}{entry.createdByName ? ` · ${entry.createdByName}` : ""}
                      </p>
                    </article>
                  ))}
                  {!initiative.history?.length ? <p className="py-3 text-sm leading-6 text-bvbp-muted-ink">As próximas alterações de status, prioridade e prazo aparecerão aqui.</p> : null}
                </div>
              </div>
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
