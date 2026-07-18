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
import { InitiativePriorityMenu } from "@/components/performance/initiatives/InitiativePriorityMenu";
import { InitiativeStatusMenu } from "@/components/performance/initiatives/InitiativeStatusMenu";
import { bvbpPillarLabels, type ClientConfiguration, type ClientMetricConfig, type Company, type EvidenceType, type PdcaCycle } from "@/data/performanceSystem";
import type { EvidenceInput, PdcaCycleInput } from "@/lib/pdcaCycleStore";
import {
  type InitiativeActivity,
  type InitiativeActivityInput,
  type InitiativeActivityStatus,
} from "@/lib/initiativeActivityStore";
import { calculateInitiativeProgress, formatMetricValue, getInitiativeImpactLabel, parseMetricNumber } from "@/lib/initiativeProgress";
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
}: InitiativeDetailPanelProps) {
  type EditableField = "title" | "hypothesis" | "whyItMatters" | "owner" | "team" | "startDate" | "deadline" | "focus" | "baseline" | "target" | "source";
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftValue, setDraftValue] = useState("");
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

  const selectedMetricIds = new Set(configuration.pillars.flatMap((pillar) => pillar.selectedMetricIds));
  const availableMetrics = configuration.metrics.filter((metric) => selectedMetricIds.has(metric.id));

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
        <div ref={editorRef} className="min-h-[68px] py-3">
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
      <button type="button" onClick={() => startEditing(field, editValue === "Sem responsável" || editValue === "Sem equipe definida" || editValue === "Não informada" ? "" : editValue)} className="block min-h-[68px] w-full py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-bvbp-gold/45">
        <span className="block font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">{label}</span>
        <span className="mt-1 block font-semibold leading-5 text-bvbp-ink">{value}</span>
      </button>
    );
  };

  return (
    <section className="overflow-hidden bg-bvbp-raised">
      <div className="flex flex-col gap-4 border-b border-bvbp-ink/10 p-5 pr-14 lg:flex-row lg:items-start lg:justify-between">
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
            <span className="rounded-full bg-bvbp-inset px-2.5 py-1 text-xs font-semibold text-bvbp-muted-ink">
              {initiative.pillarId ? bvbpPillarLabels[initiative.pillarId] : "Vínculo a revisar"}
            </span>
            {editingField === "focus" ? (
              <div ref={editorRef} className="h-6 w-56">
                <Select value={initiative.metricId || ""} onValueChange={(value) => { const metric = availableMetrics.find((item) => item.id === value); if (metric) saveMetric(metric); }} open onOpenChange={(open) => { if (!open) setEditingField(null); }}>
                  <SelectTrigger className="h-6 rounded-full border-0 bg-bvbp-inset px-2.5 text-xs font-semibold text-bvbp-muted-ink shadow-none" aria-label="Ponteiro da iniciativa"><SelectValue placeholder="Selecione o ponteiro" /></SelectTrigger>
                  <SelectContent>{availableMetrics.map((metric) => <SelectItem key={metric.id} value={metric.id}>{bvbpPillarLabels[metric.pillar]} · {metric.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            ) : <button type="button" onClick={() => startEditing("focus")} className="h-6 rounded-full bg-bvbp-inset px-2.5 text-xs font-semibold text-bvbp-muted-ink">{getInitiativeMetricLabel(initiative)}</button>}
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

          {initiative.metricId && progress !== undefined ? (
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
            <Tabs defaultValue="comments" className="w-full">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeader title="Comentários e histórico" description="Contexto da equipe e registro automático das alterações." />
                <TabsList className="grid h-9 w-full grid-cols-2 bg-bvbp-inset sm:w-64">
                  <TabsTrigger value="comments">Comentários</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="comments" className="mt-3 space-y-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-3">
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
            <div className="flex flex-wrap items-center gap-2">
              {canManageInitiative ? <InitiativeStatusMenu status={initiative.pdcaStatus} onChange={(pdcaStatus) => savePatch({ pdcaStatus })} /> : <StatusBadge label={initiative.pdcaStatus} />}
              <InitiativePriorityMenu priority={initiative.priority} canManage={canManageInitiative} onChange={(priority) => savePatch({ priority })} />
            </div>
            <div className="divide-y divide-bvbp-ink/10 text-sm">
              {renderEditableMetadata("owner", "Responsável", initiative.owner || "Sem responsável")}
              {renderEditableMetadata("team", "Equipe", initiative.teamMembers?.length ? initiative.teamMembers.join(", ") : "Sem equipe definida")}
              <div className="min-h-[68px] py-3">
                <span className="block font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Início</span>
                {editingField === "startDate" ? <div ref={editorRef} className="mt-1"><DatePickerBr id="initiative-inline-start" value={initiative.startDate} onChange={(startDate) => savePatch({ startDate })} /></div> : <button type="button" className="mt-1 font-semibold text-bvbp-ink" onClick={() => startEditing("startDate")}>{formatDateBr(initiative.startDate)}</button>}
              </div>
              <div className="min-h-[68px] py-3">
                <span className="block font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Prazo</span>
                {editingField === "deadline" ? <div ref={editorRef} className="mt-1"><DatePickerBr id="initiative-inline-deadline" value={initiative.deadline || initiative.endDate} onChange={(deadline) => savePatch({ deadline, endDate: deadline })} /></div> : <button type="button" className="mt-1 font-semibold text-bvbp-ink" onClick={() => startEditing("deadline")}>{formatDateBr(initiative.deadline || initiative.endDate)}</button>}
              </div>
              <button type="button" onClick={() => startEditing("focus")} className="block min-h-[68px] w-full py-3 text-left">
                <span className="block font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Ponteiro</span>
                <span className="mt-1 block font-semibold leading-5 text-bvbp-ink">{getInitiativeMetricLabel(initiative)}</span>
              </button>
              {initiative.metricId ? (
                <>
                  {renderEditableMetadata("baseline", "Baseline", baselineLabel)}
                  {renderEditableMetadata("target", "Meta", targetLabel)}
                  {renderEditableMetadata("source", "Fonte", sourceLabel, initiative.metricSourceSnapshot || "")}
                  <div className="py-3"><span className="block font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Impacto</span><span className="mt-1 block font-semibold leading-5 text-bvbp-ink">{getInitiativeImpactLabel(initiative)}</span></div>
                </>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
