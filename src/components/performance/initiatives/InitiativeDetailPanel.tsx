import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePickerBr } from "@/components/ui/date-picker-br";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { InitiativeLinkChips } from "@/components/performance/initiatives/InitiativeLinkChips";
import { InitiativePriorityMenu } from "@/components/performance/initiatives/InitiativePriorityMenu";
import { InitiativeStatusMenu } from "@/components/performance/initiatives/InitiativeStatusMenu";
import { MetricMeasurementDialog } from "@/components/performance/pointers/MetricMeasurementDialog";
import { type ClientConfiguration, type ClientMetricConfig, type Company, type EvidenceType, type PdcaCycle } from "@/data/performanceSystem";
import type { EvidenceInput, PdcaCycleInput } from "@/lib/pdcaCycleStore";
import {
  type InitiativeActivity,
  type InitiativeActivityInput,
  type InitiativeActivityStatus,
} from "@/lib/initiativeActivityStore";
import { calculateInitiativeProgress, formatMetricValue, parseMetricNumber } from "@/lib/initiativeProgress";
import { formatWorkItemReference } from "@/lib/workItemReferences";
import { getInitiativeMetricLabel } from "@/lib/initiativeFocus";

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
  configuration: ClientConfiguration;
  onSaveInitiative: (initiativeId: string, patch: Partial<PdcaCycleInput>) => boolean;
  onActivityFormChange: (value: InitiativeActivityInput) => void;
  onAddActivity: () => void;
  onUpdateActivity: (activity: InitiativeActivityInput) => void;
  onActivityStatusChange: (activityId: string, status: InitiativeActivityStatus) => void;
  onReorderActivities: (orderedIds: string[]) => void;
  onEvidenceFormChange: (value: EvidenceInput) => void;
  onAddEvidence: () => void;
  onMetricUpdated?: () => void;
  createdByName?: string;
}

export function InitiativeDetailPanel({
  initiative,
  company,
  activities,
  activityForm,
  evidenceForm,
  canManageInitiative,
  configuration,
  onSaveInitiative,
  onActivityFormChange,
  onAddActivity,
  onUpdateActivity,
  onActivityStatusChange,
  onReorderActivities,
  onEvidenceFormChange,
  onAddEvidence,
  onMetricUpdated,
  createdByName,
}: InitiativeDetailPanelProps) {
  type EditableField = "title" | "hypothesis" | "whyItMatters" | "owner" | "team" | "startDate" | "deadline" | "baseline" | "target" | "source";
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [isMeasurementOpen, setMeasurementOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditingField(null);
    setDraftValue("");
  }, [initiative?.id]);

  useEffect(() => {
    if (!editingField) return;
    const cancelOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (editorRef.current?.contains(target) || target.closest("[data-radix-popper-content-wrapper]")) return;
      setEditingField(null);
    };
    document.addEventListener("mousedown", cancelOnOutsideClick);
    return () => document.removeEventListener("mousedown", cancelOnOutsideClick);
  }, [editingField]);

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
  const linkedMetric = configuration.metrics.find((metric) => metric.id === initiative.metricId);
  const currentMetricValue = linkedMetric?.currentValue;
  const progress = calculateInitiativeProgress(initiative, currentMetricValue);
  const baselineLabel = initiative.baselineValue === undefined
    ? initiative.baseline || "Sem baseline"
    : formatMetricValue(initiative.baselineValue, initiative.metricUnit);
  const targetLabel = initiative.targetValue === undefined
    ? initiative.target || "Sem meta"
    : formatMetricValue(initiative.targetValue, initiative.metricUnit);

  const sourceLabel = initiative.metricSourceSnapshot
    ? `${initiative.metricValueOrigin === "estimated" ? "Estimado · " : ""}${initiative.metricSourceSnapshot}`
    : "Não informada";

  const startEditing = (field: EditableField, value = "") => {
    if (!canManageInitiative) return;
    setDraftValue(value);
    setEditingField(field);
  };

  const savePatch = (patch: Partial<PdcaCycleInput>) => {
    if (onSaveInitiative(initiative.id, patch)) setEditingField(null);
  };

  const saveTextField = () => {
    if (!editingField) return;
    const patchByField: Partial<Record<EditableField, Partial<PdcaCycleInput>>> = {
      title: { title: draftValue },
      hypothesis: { hypothesis: draftValue },
      whyItMatters: { whyItMatters: draftValue },
      owner: { owner: draftValue },
      team: { teamMembers: draftValue.split(",").map((name) => name.trim()).filter(Boolean) },
      baseline: { baseline: draftValue, baselineValue: parseMetricNumber(draftValue) },
      target: { target: draftValue, targetValue: parseMetricNumber(draftValue) },
      source: { metricSourceSnapshot: draftValue },
    };
    const patch = patchByField[editingField];
    if (patch) savePatch(patch);
  };

  const saveMetric = (metric: ClientMetricConfig) => {
    savePatch({
      pillarId: metric.pillar,
      focusType: "metric",
      metricId: metric.id,
      metricNameSnapshot: metric.name,
      metricUnit: metric.unit,
      metricDirection: metric.direction || "higher",
      metricSourceSnapshot: metric.source,
      metricValueOrigin: metric.valueOrigin,
      affectedPointer: metric.name,
      baselineValue: metric.currentValue,
      targetValue: parseMetricNumber(metric.target),
      baseline: metric.currentValue === undefined ? "" : String(metric.currentValue),
      target: metric.target || "",
      painLabel: undefined,
      maturityTargetLevel: undefined,
    });
  };

  const renderEditableMetadata = (field: EditableField, label: string, value: string, editValue = value) => {
    if (editingField === field) {
      return (
        <div ref={editorRef} className="h-[68px] py-3">
          <span className="block font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">{label}</span>
          <div className="mt-1 flex items-center gap-1">
            <Input value={draftValue} onChange={(event) => setDraftValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setEditingField(null); if (event.key === "Enter") saveTextField(); }} className="h-8 min-w-0 bg-bvbp-raised" autoFocus />
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingField(null)} aria-label={`Cancelar ${label}`}><X className="h-3.5 w-3.5" /></Button>
            <Button type="button" size="icon" className="h-8 w-8" onClick={saveTextField} aria-label={`Salvar ${label}`}><Check className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      );
    }

    return (
      <button type="button" onClick={() => startEditing(field, editValue === "Sem responsável" || editValue === "Sem equipe definida" || editValue === "Não informada" ? "" : editValue)} className="block h-[68px] w-full py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-bvbp-gold/45">
        <span className="block font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">{label}</span>
        <span className="mt-1 block font-semibold leading-5 text-bvbp-ink">{value}</span>
      </button>
    );
  };

  return (
    <section className="overflow-hidden bg-bvbp-raised">
      <div className="border-b border-bvbp-ink/10 p-5 pr-14">
        <div className="min-w-0 flex-1">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-gold">
            {formatWorkItemReference(company, initiative.referenceNumber)}
          </p>
          <div className="mt-2 min-h-10 max-w-3xl">
          {editingField === "title" ? (
            <div ref={editorRef} className="flex h-10 items-center gap-2">
              <Input value={draftValue} onChange={(event) => setDraftValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setEditingField(null); if (event.key === "Enter") saveTextField(); }} className="h-10 min-w-0 flex-1 font-heading text-xl font-semibold" aria-label="Título da iniciativa" autoFocus />
              <Button type="button" size="icon" className="h-9 w-9" onClick={saveTextField} aria-label="Salvar título"><Check className="h-4 w-4" /></Button>
              <Button type="button" size="icon" className="h-9 w-9" variant="ghost" onClick={() => setEditingField(null)} aria-label="Cancelar edição"><X className="h-4 w-4" /></Button>
            </div>
          ) : (
            <button type="button" onClick={() => startEditing("title", initiative.title)} className="flex min-h-10 items-center text-left focus:outline-none">
              <h2 className="font-heading text-2xl font-semibold text-bvbp-ink">{initiative.title}</h2>
            </button>
          )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <InitiativeLinkChips initiative={initiative} configuration={configuration} canManage={canManageInitiative} onSelectMetric={saveMetric} />
            <InitiativePriorityMenu priority={initiative.priority} canManage={canManageInitiative} onChange={(priority) => savePatch({ priority })} className="h-7" showChevron={false} />
            {canManageInitiative ? <InitiativeStatusMenu status={initiative.pdcaStatus} onChange={(pdcaStatus) => savePatch({ pdcaStatus })} className="h-7" /> : <StatusBadge label={initiative.pdcaStatus} />}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6 p-5">
          <section className="space-y-4">
            {editingField === "hypothesis" ? (
              <div ref={editorRef} className="relative min-h-24">
                <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Hipótese</p>
                <Textarea className="mt-2 h-[68px] min-h-0 resize-none pr-20" value={draftValue} onChange={(event) => setDraftValue(event.target.value)} onKeyDown={(event) => event.key === "Escape" && setEditingField(null)} autoFocus />
                <div className="absolute bottom-2 right-2 flex gap-1"><Button type="button" size="icon" variant="ghost" className="h-8 w-8 bg-bvbp-raised" onClick={() => setEditingField(null)} aria-label="Cancelar edição"><X className="h-4 w-4" /></Button><Button type="button" size="icon" className="h-8 w-8" onClick={saveTextField} aria-label="Salvar hipótese"><Check className="h-4 w-4" /></Button></div>
              </div>
            ) : <button type="button" onClick={() => startEditing("hypothesis", initiative.hypothesis)} className="min-h-24 w-full text-left align-top">
              <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Hipótese</p>
              <p className="mt-2 text-sm leading-6 text-bvbp-ink">{initiative.hypothesis || "Hipótese a definir."}</p>
            </button>}
            <div>
              {editingField === "whyItMatters" ? (
                <div ref={editorRef} className="relative min-h-24">
                  <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Por que importa</p>
                  <Textarea className="mt-2 h-[68px] min-h-0 resize-none pr-20" value={draftValue} onChange={(event) => setDraftValue(event.target.value)} onKeyDown={(event) => event.key === "Escape" && setEditingField(null)} autoFocus />
                  <div className="absolute bottom-2 right-2 flex gap-1"><Button type="button" size="icon" variant="ghost" className="h-8 w-8 bg-bvbp-raised" onClick={() => setEditingField(null)} aria-label="Cancelar edição"><X className="h-4 w-4" /></Button><Button type="button" size="icon" className="h-8 w-8" onClick={saveTextField} aria-label="Salvar relevância"><Check className="h-4 w-4" /></Button></div>
                </div>
              ) : <button type="button" onClick={() => startEditing("whyItMatters", initiative.whyItMatters)} className="min-h-24 w-full text-left align-top">
                <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Por que importa</p>
                <p className="mt-2 text-sm leading-6 text-bvbp-ink">{initiative.whyItMatters || "Impacto a detalhar."}</p>
              </button>}
            </div>
          </section>

          {initiative.metricId && currentMetricValue !== undefined ? (
            <section className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4">
              <div className="grid gap-3 text-sm sm:grid-cols-4">
                <div><span className="block text-xs text-bvbp-muted-ink">Baseline</span><strong className="mt-1 block text-bvbp-ink">{baselineLabel}</strong></div>
                <div><span className="block text-xs text-bvbp-muted-ink">Atual</span><strong className="mt-1 block text-bvbp-ink">{formatMetricValue(currentMetricValue, initiative.metricUnit)}</strong></div>
                <div><span className="block text-xs text-bvbp-muted-ink">Meta</span><strong className="mt-1 block text-bvbp-ink">{targetLabel}</strong></div>
                <div className="sm:text-right"><span className="block text-xs text-bvbp-muted-ink">Progresso</span><strong className="mt-1 block text-bvbp-positive">{progress === undefined ? "A mensurar" : `${progress}%`}</strong></div>
              </div>
              {progress !== undefined ? <div className="mt-3 h-2 overflow-hidden rounded-full bg-bvbp-ink/10"><div className="h-full rounded-full bg-bvbp-positive" style={{ width: `${progress}%` }} /></div> : null}
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
            <Tabs defaultValue="comments" className="w-full">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeader title="Comentários e histórico" description="Contexto da equipe e registro automático das alterações." />
                <TabsList className="grid h-9 w-full grid-cols-2 bg-bvbp-inset sm:w-64">
                  <TabsTrigger value="comments">Comentários</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="comments" className="mt-3 space-y-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-3">
                <div className="space-y-2">
                  {initiative.evidences.map((evidence) => (
                    <article key={evidence.id} className="grid gap-2 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-3 sm:grid-cols-[auto_auto_minmax(0,1fr)] sm:items-start">
                      <div className="flex flex-wrap items-center gap-2 sm:contents">
                        <StatusBadge label={evidence.type} />
                        <span className="text-xs font-semibold text-bvbp-muted-ink/70">{formatDateBr(evidence.date)}</span>
                        <p className="text-sm leading-5 text-bvbp-ink">{evidence.description}</p>
                      </div>
                    </article>
                  ))}
                  {!initiative.evidences.length ? <p className="py-3 text-sm leading-6 text-bvbp-muted-ink">Nenhum comentário registrado.</p> : null}
                </div>
                {canManageInitiative ? (
                  <div className="grid gap-2 rounded-[8px] bg-bvbp-inset p-2 sm:grid-cols-[150px_minmax(0,1fr)_auto]">
                    <Select value={evidenceForm.type} onValueChange={(value) => onEvidenceFormChange({ ...evidenceForm, type: value as EvidenceType })}>
                      <SelectTrigger className="h-10 bg-bvbp-raised" aria-label="Classificação do comentário"><SelectValue /></SelectTrigger>
                      <SelectContent>{commentTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input value={evidenceForm.description} onChange={(event) => onEvidenceFormChange({ ...evidenceForm, description: event.target.value })} placeholder="Registre contexto, aprendizado, reunião, decisão ou dado." className="h-10 bg-bvbp-raised" onKeyDown={(event) => { if (event.key === "Enter" && evidenceForm.description.trim()) onAddEvidence(); }} />
                    <Button className="h-10" onClick={onAddEvidence} disabled={!evidenceForm.description.trim()} aria-label="Registrar comentário"><Check className="h-4 w-4" /></Button>
                  </div>
                ) : null}
              </TabsContent>
              <TabsContent value="history" className="mt-3 space-y-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-3">
                <div className="space-y-2">
                  {(initiative.history || []).map((entry) => (
                    <article key={entry.id} className="border-l border-bvbp-ink/10 py-0.5 pl-2.5">
                      <p className="text-xs leading-5 text-bvbp-ink">{entry.description}</p>
                      <p className="mt-1 text-xs text-bvbp-muted-ink">
                        {formatDateTimeBr(entry.createdAt)}{entry.createdByName ? ` · ${entry.createdByName}` : ""}
                      </p>
                    </article>
                  ))}
                  {!initiative.history?.length ? <p className="py-3 text-sm leading-6 text-bvbp-muted-ink">As próximas alterações de status, prioridade e prazo aparecerão aqui.</p> : null}
                </div>
              </TabsContent>
            </Tabs>
          </section>

        </div>

        <aside className="border-t border-bvbp-ink/10 bg-bvbp-inset p-4 lg:border-l lg:border-t-0">
          <div className="space-y-5 lg:sticky lg:top-0">
            <div className="divide-y divide-bvbp-ink/10 text-sm">
              {renderEditableMetadata("owner", "Responsável", initiative.owner || "Sem responsável")}
              <div className="block h-[68px] w-full py-3 text-left">
                <span className="block font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Ponteiro</span>
                <span className="mt-1 block font-semibold leading-5 text-bvbp-ink">{getInitiativeMetricLabel(initiative)}</span>
              </div>
              {initiative.metricId ? (
                <div className="grid h-[88px] grid-cols-3 gap-2 py-3">
                  {editingField === "baseline" ? <div ref={editorRef} className="min-w-0 rounded-[6px] bg-bvbp-raised px-2 py-2">
                    <span className="block font-label text-[9px] font-semibold uppercase tracking-[0.06em] text-bvbp-muted-ink">Baseline</span>
                    <div className="mt-1 flex gap-1"><Input value={draftValue} onChange={(event) => setDraftValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setEditingField(null); if (event.key === "Enter") saveTextField(); }} className="h-7 min-w-0 px-1.5" autoFocus /><Button type="button" size="icon" className="h-7 w-7 shrink-0" onClick={saveTextField}><Check className="h-3 w-3" /></Button></div>
                  </div> : <button type="button" onClick={() => startEditing("baseline", initiative.baselineValue === undefined ? initiative.baseline : String(initiative.baselineValue))} className="min-w-0 rounded-[6px] bg-bvbp-raised px-2 text-left focus-visible:ring-2 focus-visible:ring-bvbp-gold/45">
                    <span className="block font-label text-[9px] font-semibold uppercase tracking-[0.06em] text-bvbp-muted-ink">Baseline</span><span className="mt-1 block truncate font-semibold text-bvbp-ink">{baselineLabel}</span>
                  </button>}
                  <button type="button" onClick={() => canManageInitiative && setMeasurementOpen(true)} className="min-w-0 rounded-[6px] bg-bvbp-raised px-2 text-left focus-visible:ring-2 focus-visible:ring-bvbp-gold/45">
                    <span className="block font-label text-[9px] font-semibold uppercase tracking-[0.06em] text-bvbp-muted-ink">Atual</span>
                    <span className="mt-1 block truncate font-semibold text-bvbp-ink">{currentMetricValue === undefined ? "Sem valor" : formatMetricValue(currentMetricValue, initiative.metricUnit)}</span>
                  </button>
                  {editingField === "target" ? <div ref={editorRef} className="min-w-0 rounded-[6px] bg-bvbp-raised px-2 py-2">
                    <span className="block font-label text-[9px] font-semibold uppercase tracking-[0.06em] text-bvbp-muted-ink">Meta</span>
                    <div className="mt-1 flex gap-1"><Input value={draftValue} onChange={(event) => setDraftValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setEditingField(null); if (event.key === "Enter") saveTextField(); }} className="h-7 min-w-0 px-1.5" autoFocus /><Button type="button" size="icon" className="h-7 w-7 shrink-0" onClick={saveTextField}><Check className="h-3 w-3" /></Button></div>
                  </div> : <button type="button" onClick={() => startEditing("target", initiative.targetValue === undefined ? initiative.target : String(initiative.targetValue))} className="min-w-0 rounded-[6px] bg-bvbp-raised px-2 text-left focus-visible:ring-2 focus-visible:ring-bvbp-gold/45">
                    <span className="block font-label text-[9px] font-semibold uppercase tracking-[0.06em] text-bvbp-muted-ink">Meta</span><span className="mt-1 block truncate font-semibold text-bvbp-ink">{targetLabel}</span>
                  </button>}
                </div>
              ) : null}
              <div className="h-[68px] py-3">
                <span className="block font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Início</span>
                {editingField === "startDate" ? <div ref={editorRef} className="mt-1"><DatePickerBr id="initiative-inline-start" value={initiative.startDate} onChange={(startDate) => savePatch({ startDate })} /></div> : <button type="button" className="mt-1 font-semibold text-bvbp-ink" onClick={() => startEditing("startDate")}>{formatDateBr(initiative.startDate)}</button>}
              </div>
              <div className="h-[68px] py-3">
                <span className="block font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Prazo</span>
                {editingField === "deadline" ? <div ref={editorRef} className="mt-1"><DatePickerBr id="initiative-inline-deadline" value={initiative.deadline || initiative.endDate} onChange={(deadline) => savePatch({ deadline, endDate: deadline })} /></div> : <button type="button" className="mt-1 font-semibold text-bvbp-ink" onClick={() => startEditing("deadline")}>{formatDateBr(initiative.deadline || initiative.endDate)}</button>}
              </div>
              {renderEditableMetadata("team", "Equipe", initiative.teamMembers?.length ? initiative.teamMembers.join(", ") : "Sem equipe definida")}
              {initiative.metricId ? (
                <>
                  {renderEditableMetadata("source", "Fonte", sourceLabel, initiative.metricSourceSnapshot || "")}
                </>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
      <MetricMeasurementDialog open={isMeasurementOpen} onOpenChange={setMeasurementOpen} company={company} metric={linkedMetric} initiativeId={initiative.id} createdByName={createdByName} onSaved={onMetricUpdated} />
    </section>
  );
}
