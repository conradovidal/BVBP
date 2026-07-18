import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useOutletContext, useSearchParams } from "react-router-dom";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePickerBr } from "@/components/ui/date-picker-br";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/performance/EmptyState";
import { InitiativeDetailPanel } from "@/components/performance/initiatives/InitiativeDetailPanel";
import { InitiativePillarContext } from "@/components/performance/initiatives/InitiativePillarContext";
import { PerformancePageHeader } from "@/components/performance/PerformancePageHeader";
import { InitiativePriorityList } from "@/components/performance/initiatives/InitiativePriorityList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/performance/StatusBadge";
import {
  type Company,
  type BvbpPillarId,
  type ClientMetricConfig,
  type InitiativePriority,
  type PdcaCycle,
  type PdcaStatus,
  bvbpPillarIds,
  bvbpPillarLabels,
  initiativePriorities,
  pdcaStatuses,
} from "@/data/performanceSystem";
import {
  getActivitiesForInitiatives,
  type InitiativeActivity,
  type InitiativeActivityInput,
  type InitiativeActivityStatus,
  reorderInitiativeActivities,
  updateInitiativeActivityStatus,
  upsertInitiativeActivity,
} from "@/lib/initiativeActivityStore";
import {
  addPdcaEvidence,
  addPdcaHistory,
  getPdcaCyclesForCompany,
  reorderPdcaCycles,
  updatePdcaCyclePriority,
  updatePdcaCycleStatus,
  upsertPdcaCycle,
  type EvidenceInput,
  type PdcaCycleInput,
} from "@/lib/pdcaCycleStore";
import { getPerformanceSession, isBvbpStaff } from "@/lib/performanceAuth";
import { getClientConfiguration } from "@/lib/clientConfigurationStore";
import { initiativeMatchesPillar } from "@/lib/performanceOverviewModel";
import { parseMetricNumber } from "@/lib/initiativeProgress";

const blankInitiativeForm: PdcaCycleInput = {
  title: "",
  affectedPointer: "",
  hypothesis: "",
  plannedAction: "",
  whyItMatters: "",
  owner: "",
  deadline: "",
  pdcaStatus: "Em refinamento",
  estimatedImpact: 0,
  nextDecision: "",
  startDate: "",
  endDate: "",
  baseline: "",
  target: "",
  priority: "Média",
  priorityOrder: 0,
  actions: [],
};

const blankEvidenceForm: EvidenceInput = {
  description: "",
  type: "Comentário",
  observedValue: "",
  note: "",
};

function getPriorityRank(priority?: InitiativePriority) {
  if (priority === "Alta") return 0;
  if (priority === "Média") return 1;
  if (priority === "Baixa") return 2;
  return 3;
}

function getSortedInitiatives(initiatives: PdcaCycle[]) {
  return [...initiatives].sort((a, b) => {
    const priorityDifference = getPriorityRank(a.priority) - getPriorityRank(b.priority);
    if (priorityDifference) return priorityDifference;
    return (a.priorityOrder || 0) - (b.priorityOrder || 0);
  });
}

function initiativeToForm(initiative: PdcaCycle): PdcaCycleInput {
  return {
    id: initiative.id,
    title: initiative.title,
    affectedPointer: initiative.affectedPointer,
    affectedFlow: initiative.affectedFlow,
    hypothesis: initiative.hypothesis,
    plannedAction: initiative.plannedAction,
    whyItMatters: initiative.whyItMatters,
    owner: initiative.owner,
    deadline: initiative.deadline || initiative.endDate || "",
    pdcaStatus: initiative.pdcaStatus,
    estimatedImpact: initiative.estimatedImpact,
    nextDecision: initiative.nextDecision,
    startDate: initiative.startDate || "",
    endDate: initiative.deadline || initiative.endDate || "",
    baseline: initiative.baseline || "",
    target: initiative.target || "",
    pillarId: initiative.pillarId,
    painLabel: initiative.painLabel,
    metricId: initiative.metricId,
    metricNameSnapshot: initiative.metricNameSnapshot,
    metricUnit: initiative.metricUnit,
    metricDirection: initiative.metricDirection,
    metricSourceSnapshot: initiative.metricSourceSnapshot,
    metricValueOrigin: initiative.metricValueOrigin,
    baselineValue: initiative.baselineValue,
    targetValue: initiative.targetValue,
    teamMembers: initiative.teamMembers || [],
    priority: initiative.priority,
    priorityOrder: initiative.priorityOrder || 0,
    actions: initiative.actions || [],
  };
}

function blankActivityForm(initiative?: PdcaCycle | null): InitiativeActivityInput {
  return {
    initiativeId: initiative?.id || "",
    title: "",
    description: "",
    definitionOfDone: "",
    owner: initiative?.owner || "",
    startDate: "",
    endDate: initiative?.deadline || "",
    dueDate: initiative?.deadline || "",
    priority: "Média",
    status: "A fazer",
  };
}

const PerformanceExecutionPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAdminPortal = location.pathname.startsWith("/app/admin");
  const performanceSession = getPerformanceSession();
  const canManageInitiatives = isBvbpStaff(performanceSession);
  const configuration = useMemo(() => getClientConfiguration(activeCompany), [activeCompany]);
  const [initiatives, setInitiatives] = useState<PdcaCycle[]>(() => getPdcaCyclesForCompany(activeCompany));
  const [activities, setActivities] = useState<InitiativeActivity[]>(() => getActivitiesForInitiatives(getPdcaCyclesForCompany(activeCompany)));
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [initiativeForm, setInitiativeForm] = useState<PdcaCycleInput>(blankInitiativeForm);
  const [evidenceForm, setEvidenceForm] = useState<EvidenceInput>(blankEvidenceForm);
  const [activityForm, setActivityForm] = useState<InitiativeActivityInput>(blankActivityForm());
  const [formError, setFormError] = useState("");
  const [teamMembersInput, setTeamMembersInput] = useState("");
  const [pillarFilter, setPillarFilter] = useState<"all" | BvbpPillarId>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | PdcaStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "unset" | InitiativePriority>("all");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    const nextInitiatives = getPdcaCyclesForCompany(activeCompany);

    setInitiatives(nextInitiatives);
    setActivities(getActivitiesForInitiatives(nextInitiatives));
    setSelectedInitiativeId(null);
    setIsDetailDialogOpen(false);
    setIsFormDialogOpen(false);
    setEvidenceForm(blankEvidenceForm);
    setActivityForm(blankActivityForm(nextInitiatives[0]));
    setPillarFilter("all");
    setStatusFilter("all");
    setPriorityFilter("all");
  }, [activeCompany]);

  useEffect(() => {
    const requestedInitiativeId = searchParams.get("initiative");
    if (!requestedInitiativeId || !initiatives.some((initiative) => initiative.id === requestedInitiativeId)) return;

    setSelectedInitiativeId(requestedInitiativeId);
    setIsDetailDialogOpen(true);
  }, [initiatives, searchParams]);

  const sortedInitiatives = useMemo(() => getSortedInitiatives(initiatives), [initiatives]);
  const filteredInitiatives = useMemo(
    () => sortedInitiatives.filter((initiative) => (
      initiative.pdcaStatus !== "Arquivada" &&
      (pillarFilter === "all" || initiativeMatchesPillar(initiative, pillarFilter)) &&
      (statusFilter === "all" || initiative.pdcaStatus === statusFilter) &&
      (priorityFilter === "all" || (priorityFilter === "unset" ? !initiative.priority : initiative.priority === priorityFilter))
    )),
    [pillarFilter, priorityFilter, sortedInitiatives, statusFilter],
  );
  const archivedInitiatives = useMemo(
    () => sortedInitiatives.filter((initiative) => (
      initiative.pdcaStatus === "Arquivada" &&
      (pillarFilter === "all" || initiativeMatchesPillar(initiative, pillarFilter)) &&
      (priorityFilter === "all" || (priorityFilter === "unset" ? !initiative.priority : initiative.priority === priorityFilter))
    )),
    [pillarFilter, priorityFilter, sortedInitiatives],
  );
  const selectedInitiative = initiatives.find((initiative) => initiative.id === selectedInitiativeId) || null;
  const selectedActivities = selectedInitiative
    ? activities.filter((activity) => activity.initiativeId === selectedInitiative.id)
    : [];

  const refreshInitiatives = (nextSelectedId?: string) => {
    const nextInitiatives = getPdcaCyclesForCompany(activeCompany);
    const nextSelected =
      nextSelectedId ||
      selectedInitiativeId ||
      nextInitiatives[0]?.id ||
      null;

    setInitiatives(nextInitiatives);
    setActivities(getActivitiesForInitiatives(nextInitiatives));
    setSelectedInitiativeId(nextSelected);

    const nextSelectedInitiative = nextInitiatives.find((initiative) => initiative.id === nextSelected) || null;
    setActivityForm(blankActivityForm(nextSelectedInitiative));
  };

  const selectInitiative = (initiative: PdcaCycle) => {
    setSelectedInitiativeId(initiative.id);
    setIsDetailDialogOpen(true);
    setEvidenceForm(blankEvidenceForm);
    setActivityForm(blankActivityForm(initiative));
  };

  const applyPillarFilter = (pillarId: BvbpPillarId) => {
    setPillarFilter((current) => current === pillarId ? "all" : pillarId);
    setSelectedInitiativeId(null);
    setEvidenceForm(blankEvidenceForm);
    setActivityForm(blankActivityForm());
  };

  const openNewInitiative = () => {
    if (!canManageInitiatives) return;

    setInitiativeForm({
      ...blankInitiativeForm,
      pillarId: pillarFilter === "all" ? undefined : pillarFilter,
      priorityOrder: initiatives.length,
    });
    setTeamMembersInput("");
    setFormError("");
    setIsFormDialogOpen(true);
  };

  const openEditInitiative = () => {
    if (!canManageInitiatives || !selectedInitiative) return;

    setIsDetailDialogOpen(false);
    setInitiativeForm(initiativeToForm(selectedInitiative));
    setTeamMembersInput((selectedInitiative.teamMembers || []).join(", "));
    setFormError("");
    setIsFormDialogOpen(true);
  };

  const saveInitiative = () => {
    if (!canManageInitiatives) return;

    if (!initiativeForm.title.trim() || !initiativeForm.pillarId || !initiativeForm.painLabel || !initiativeForm.metricId) {
      setFormError("Título, pilar, dor principal e ponteiro principal são obrigatórios.");
      return;
    }
    const pillar = configuration.pillars.find((item) => item.pillar === initiativeForm.pillarId);
    const metric = configuration.metrics.find((item) => item.id === initiativeForm.metricId);
    if (!pillar?.pains.includes(initiativeForm.painLabel) || !pillar.selectedMetricIds.includes(initiativeForm.metricId) || metric?.pillar !== initiativeForm.pillarId) {
      setFormError("A dor e o ponteiro precisam pertencer ao pilar selecionado.");
      return;
    }

    const teamMembers = Array.from(new Map(
      teamMembersInput
        .split(",")
        .map((member) => member.trim().replace(/\s+/g, " "))
        .filter(Boolean)
        .map((member) => [member.toLocaleLowerCase("pt-BR"), member]),
    ).values());
    const invalidTeamMember = teamMembers.find((member) => member.split(" ").filter(Boolean).length < 2);
    if (invalidTeamMember) {
      setFormError(`Informe nome e sobrenome para ${invalidTeamMember}.`);
      return;
    }

    const saved = upsertPdcaCycle(activeCompany, { ...initiativeForm, teamMembers }, performanceSession?.user.name);
    refreshInitiatives(saved.id);
    setSelectedInitiativeId(saved.id);
    setIsDetailDialogOpen(true);
    setEvidenceForm(blankEvidenceForm);
    setActivityForm(blankActivityForm(saved));
    setFormError("");
    setIsFormDialogOpen(false);
  };

  const setDetailDialogOpen = (open: boolean) => {
    setIsDetailDialogOpen(open);
    if (!open) setSelectedInitiativeId(null);
    if (open || !searchParams.has("initiative")) return;

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("initiative");
    setSearchParams(nextSearchParams, { replace: true });
  };

  const selectInitiativePillar = (pillarId: BvbpPillarId) => {
    setInitiativeForm((current) => ({
      ...current,
      pillarId,
      painLabel: undefined,
      metricId: undefined,
      metricNameSnapshot: undefined,
      metricUnit: undefined,
      metricDirection: undefined,
      metricSourceSnapshot: undefined,
      metricValueOrigin: undefined,
      baselineValue: undefined,
      targetValue: undefined,
      affectedPointer: "",
      baseline: "",
      target: "",
    }));
    setFormError("");
  };

  const selectInitiativeMetric = (metric: ClientMetricConfig) => {
    const baselineValue = metric.currentValue;
    const targetValue = parseMetricNumber(metric.target);
    setInitiativeForm((current) => ({
      ...current,
      metricId: metric.id,
      metricNameSnapshot: metric.name,
      metricUnit: metric.unit,
      metricDirection: metric.direction || "higher",
      metricSourceSnapshot: metric.source,
      metricValueOrigin: metric.valueOrigin,
      baselineValue,
      targetValue,
      affectedPointer: metric.name,
      baseline: baselineValue === undefined ? "" : String(baselineValue),
      target: targetValue === undefined ? metric.target || "" : String(targetValue),
      estimatedImpact: baselineValue !== undefined && targetValue !== undefined ? Math.abs(targetValue - baselineValue) : 0,
    }));
    setFormError("");
  };

  const selectedPillarConfig = initiativeForm.pillarId
    ? configuration.pillars.find((pillar) => pillar.pillar === initiativeForm.pillarId)
    : undefined;
  const selectedMetricIds = new Set(selectedPillarConfig?.selectedMetricIds || []);
  const availableMetrics = initiativeForm.pillarId
    ? configuration.metrics.filter((metric) => metric.pillar === initiativeForm.pillarId && selectedMetricIds.has(metric.id))
    : [];
  const canSaveInitiative = Boolean(
    initiativeForm.title.trim() &&
    initiativeForm.painLabel &&
    selectedPillarConfig?.pains.includes(initiativeForm.painLabel) &&
    availableMetrics.some((metric) => metric.id === initiativeForm.metricId),
  );

  const changeInitiativeStatus = (initiativeId: string, status: PdcaStatus) => {
    if (!canManageInitiatives) return;

    updatePdcaCycleStatus(initiativeId, status, performanceSession?.user.name);
    refreshInitiatives(selectedInitiativeId || initiativeId);
  };

  const changeInitiativePriority = (initiativeId: string, priority: InitiativePriority) => {
    if (!canManageInitiatives) return;

    updatePdcaCyclePriority(initiativeId, priority, performanceSession?.user.name);
    refreshInitiatives(selectedInitiativeId || initiativeId);
  };

  const addEvidence = () => {
    if (!selectedInitiative || !evidenceForm.description.trim()) return;

    addPdcaEvidence(selectedInitiative.id, { ...evidenceForm, createdByName: performanceSession?.user.name });
    setEvidenceForm(blankEvidenceForm);
    refreshInitiatives(selectedInitiative.id);
  };

  const addActivity = () => {
    if (!selectedInitiative || !activityForm.title.trim()) return;

    const created = upsertInitiativeActivity({ ...activityForm, initiativeId: selectedInitiative.id });
    addPdcaHistory(selectedInitiative.id, {
      kind: "created",
      description: `${created.title.replace(/[.:;!?]+$/, "")}: atividade criada.`,
      createdByName: performanceSession?.user.name,
    });
    setActivities(getActivitiesForInitiatives(initiatives));
    setActivityForm(blankActivityForm(selectedInitiative));
  };

  const updateActivity = (activity: InitiativeActivityInput) => {
    const previous = activity.id ? activities.find((item) => item.id === activity.id) : undefined;
    const updated = upsertInitiativeActivity(activity);
    if (selectedInitiative && previous) {
      if (previous.priority !== updated.priority) {
        addPdcaHistory(selectedInitiative.id, {
          kind: "activity_priority",
          description: `${updated.title.replace(/[.:;!?]+$/, "")}: prioridade alterada de ${previous.priority || "A definir"} para ${updated.priority || "A definir"}.`,
          createdByName: performanceSession?.user.name,
        });
      }
      const previousDeadline = previous.endDate || previous.dueDate || "";
      const nextDeadline = updated.endDate || updated.dueDate || "";
      if (previousDeadline !== nextDeadline) {
        addPdcaHistory(selectedInitiative.id, {
          kind: "deadline",
          description: `${updated.title.replace(/[.:;!?]+$/, "")}: prazo alterado de ${previousDeadline || "Sem data"} para ${nextDeadline || "Sem data"}.`,
          createdByName: performanceSession?.user.name,
        });
      }
    }
    refreshInitiatives(selectedInitiative?.id);
  };

  const changeActivityStatus = (activityId: string, status: InitiativeActivityStatus) => {
    const previous = activities.find((activity) => activity.id === activityId);
    const updated = updateInitiativeActivityStatus(activityId, status);
    if (selectedInitiative && previous && updated && previous.status !== updated.status) {
      addPdcaHistory(selectedInitiative.id, {
        kind: "activity_status",
        description: `${updated.title.replace(/[.:;!?]+$/, "")}: status alterado de ${previous.status} para ${updated.status}.`,
        createdByName: performanceSession?.user.name,
      });
    }
    refreshInitiatives(selectedInitiative?.id);
  };

  const reorderActivities = (orderedIds: string[]) => {
    if (!selectedInitiative || !canManageInitiatives) return;
    reorderInitiativeActivities(selectedInitiative.id, orderedIds);
    setActivities(getActivitiesForInitiatives(initiatives));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!canManageInitiatives) return;

    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : "";
    if (!overId || activeId === overId) return;

    const oldIndex = sortedInitiatives.findIndex((initiative) => initiative.id === activeId);
    const overIndex = sortedInitiatives.findIndex((initiative) => initiative.id === overId);
    if (oldIndex < 0 || overIndex < 0) return;
    if (sortedInitiatives[oldIndex].priority !== sortedInitiatives[overIndex].priority) return;

    const reorderedInitiatives = arrayMove(sortedInitiatives, oldIndex, overIndex);
    const nextInitiatives = reorderPdcaCycles(
      activeCompany.id,
      reorderedInitiatives.map((initiative) => initiative.id),
    );

    setInitiatives(nextInitiatives);
    setSelectedInitiativeId(activeId);
  };

  return (
    <>
      <Helmet>
        <title>Iniciativas | BVBP Performance System</title>
        <meta name="description" content="Prioridades, atividades e histórico para mover os ponteiros." />
      </Helmet>

      <div className={`flex flex-col ${isAdminPortal ? "lg:h-[calc(100dvh-7.75rem)]" : "lg:h-[calc(100dvh-3rem)]"}`}>
        <div className="mb-7 shrink-0">
          <PerformancePageHeader
            title="Iniciativas"
            description="Prioridades, atividades e histórico para mover os ponteiros."
            showTitle={!isAdminPortal}
          />
        </div>

        <InitiativePillarContext
          configuration={configuration}
          initiatives={initiatives}
          activePillarId={pillarFilter}
          onSelect={applyPillarFilter}
        />

        <section className="mt-4 flex min-h-[340px] flex-1 flex-col overflow-hidden rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised">
          <div className="flex shrink-0 flex-col gap-3 border-b border-bvbp-ink/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold text-bvbp-ink">Lista por prioridade</h2>
              <p className="mt-1 text-xs leading-5 text-bvbp-muted-ink">
                {canManageInitiatives ? "Arraste para ordenar. Clique para abrir os detalhes." : "Clique para abrir os detalhes."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | PdcaStatus)}>
                <SelectTrigger className="h-9 w-[190px] bg-bvbp-ivory" aria-label="Filtrar por status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {pdcaStatuses.filter((status) => status !== "Arquivada").map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as "all" | "unset" | InitiativePriority)}>
                <SelectTrigger className="h-9 w-[180px] bg-bvbp-ivory" aria-label="Filtrar por prioridade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as prioridades</SelectItem>
                  {initiativePriorities.map((priority) => <SelectItem key={priority} value={priority}>{priority}</SelectItem>)}
                  <SelectItem value="unset">A definir</SelectItem>
                </SelectContent>
              </Select>
              {canManageInitiatives ? (
                <Button
                  className="h-9 rounded-[8px] bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark"
                  onClick={openNewInitiative}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Nova iniciativa
                </Button>
              ) : null}
            </div>
          </div>

          <div className="hidden shrink-0 grid-cols-[32px_minmax(240px,1.45fr)_minmax(120px,0.65fr)_minmax(140px,0.7fr)_105px_160px] gap-3 border-b border-bvbp-ink/10 bg-bvbp-inset px-3 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink lg:grid">
            <span aria-hidden="true" />
            <span>Iniciativa</span>
            <span>Ponteiro</span>
            <span>Baseline → meta</span>
            <span>Prioridade</span>
            <span>Status</span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {filteredInitiatives.length ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <InitiativePriorityList
                  initiatives={filteredInitiatives}
                  company={activeCompany}
                  selectedInitiativeId={selectedInitiative?.id}
                  canManage={canManageInitiatives}
                  canReorder={canManageInitiatives && pillarFilter === "all" && statusFilter === "all" && priorityFilter !== "unset"}
                  onSelect={selectInitiative}
                  onStatusChange={changeInitiativeStatus}
                  onPriorityChange={changeInitiativePriority}
                />
              </DndContext>
            ) : (
              <EmptyState
                title="Nenhuma iniciativa neste recorte."
                description="Altere o pilar ou o status para visualizar outras iniciativas."
              />
            )}

            {archivedInitiatives.length ? (
              <details className="mt-4 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset">
                <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-bvbp-muted-ink">
                  Arquivadas ({archivedInitiatives.length})
                </summary>
                <div className="border-t border-bvbp-ink/10 p-3">
                  <InitiativePriorityList
                    initiatives={archivedInitiatives}
                    company={activeCompany}
                    canManage={canManageInitiatives}
                    canReorder={false}
                    onSelect={selectInitiative}
                    onStatusChange={changeInitiativeStatus}
                    onPriorityChange={changeInitiativePriority}
                  />
                </div>
              </details>
            ) : null}
          </div>
        </section>
      </div>

      <Dialog open={isDetailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent withinContentArea className="max-h-[92vh] max-w-6xl overflow-y-auto bg-bvbp-ivory p-3 sm:p-4">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedInitiative?.title || "Detalhe da iniciativa"}</DialogTitle>
            <DialogDescription>Detalhes, atividades, comentários e histórico da iniciativa.</DialogDescription>
          </DialogHeader>
          <InitiativeDetailPanel
            initiative={selectedInitiative}
            company={activeCompany}
            activities={selectedActivities}
            activityForm={activityForm}
            evidenceForm={evidenceForm}
            canManageInitiative={canManageInitiatives}
            onEdit={openEditInitiative}
            onStatusChange={(status) => selectedInitiative && changeInitiativeStatus(selectedInitiative.id, status)}
            onPriorityChange={(priority) => selectedInitiative && changeInitiativePriority(selectedInitiative.id, priority)}
            onActivityFormChange={setActivityForm}
            onAddActivity={addActivity}
            onUpdateActivity={updateActivity}
            onActivityStatusChange={changeActivityStatus}
            onReorderActivities={reorderActivities}
            onEvidenceFormChange={setEvidenceForm}
            onAddEvidence={addEvidence}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent withinContentArea className="max-h-[90vh] max-w-4xl overflow-y-auto bg-bvbp-ivory">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-bvbp-ink">
              {initiativeForm.id ? "Editar iniciativa" : "Nova iniciativa"}
            </DialogTitle>
            <DialogDescription>
              Conecte ponteiro, responsável, baseline, objetivo e próxima decisão.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="initiative-title">Título</Label>
              <Input
                id="initiative-title"
                value={initiativeForm.title}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, title: event.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Status</Label>
              <Select
                value={initiativeForm.pdcaStatus}
                onValueChange={(value) => setInitiativeForm({ ...initiativeForm, pdcaStatus: value as PdcaStatus })}
              >
                <SelectTrigger aria-label="Status da iniciativa"><StatusBadge label={initiativeForm.pdcaStatus} /></SelectTrigger>
                <SelectContent>
                  {pdcaStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      <StatusBadge label={status} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Prioridade</Label>
              <Select
                value={initiativeForm.priority || "Média"}
                onValueChange={(value) => setInitiativeForm({ ...initiativeForm, priority: value as InitiativePriority })}
              >
                <SelectTrigger aria-label="Prioridade da iniciativa"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {initiativePriorities.map((priority) => <SelectItem key={priority} value={priority}>{priority}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label>Pilar</Label>
              <Select
                value={initiativeForm.pillarId || ""}
                onValueChange={(value) => selectInitiativePillar(value as BvbpPillarId)}
              >
                <SelectTrigger><SelectValue placeholder="Selecione o pilar" /></SelectTrigger>
                <SelectContent>
                  {bvbpPillarIds.map((pillarId) => <SelectItem key={pillarId} value={pillarId}>{bvbpPillarLabels[pillarId]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label>Dor principal</Label>
              <Select
                value={initiativeForm.painLabel || ""}
                onValueChange={(value) => setInitiativeForm({ ...initiativeForm, painLabel: value })}
                disabled={!selectedPillarConfig?.pains.length}
              >
                <SelectTrigger><SelectValue placeholder={initiativeForm.pillarId ? "Selecione a dor" : "Selecione o pilar primeiro"} /></SelectTrigger>
                <SelectContent>
                  {(selectedPillarConfig?.pains || []).map((pain) => <SelectItem key={pain} value={pain}>{pain}</SelectItem>)}
                </SelectContent>
              </Select>
              {initiativeForm.pillarId && !selectedPillarConfig?.pains.length ? <p className="text-xs text-bvbp-risk">Complete o diagnóstico de dores deste pilar antes de criar a iniciativa.</p> : null}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Ponteiro</Label>
              <Select
                value={initiativeForm.metricId || ""}
                onValueChange={(value) => {
                  const metric = availableMetrics.find((item) => item.id === value);
                  if (metric) selectInitiativeMetric(metric);
                }}
                disabled={!availableMetrics.length}
              >
                <SelectTrigger><SelectValue placeholder={initiativeForm.pillarId ? "Selecione o ponteiro" : "Selecione o pilar primeiro"} /></SelectTrigger>
                <SelectContent>
                  {availableMetrics.map((metric) => <SelectItem key={metric.id} value={metric.id}>{metric.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {initiativeForm.pillarId && !availableMetrics.length ? (
                <p className="text-xs text-bvbp-risk">Este pilar ainda não possui um ponteiro cadastrado. Selecione outro pilar com ponteiros ou complete o diagnóstico antes de criar a iniciativa.</p>
              ) : null}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="initiative-baseline">Baseline</Label>
              <Input
                id="initiative-baseline"
                type="number"
                value={initiativeForm.baselineValue ?? ""}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, baselineValue: event.target.value === "" ? undefined : Number(event.target.value), baseline: event.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="initiative-target">Meta</Label>
              <Input
                id="initiative-target"
                type="number"
                value={initiativeForm.targetValue ?? ""}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, targetValue: event.target.value === "" ? undefined : Number(event.target.value), target: event.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="initiative-owner">Responsável</Label>
              <Input id="initiative-owner" value={initiativeForm.owner} onChange={(event) => setInitiativeForm({ ...initiativeForm, owner: event.target.value })} placeholder="Nome e sobrenome" />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="initiative-team">Equipe</Label>
              <Input id="initiative-team" value={teamMembersInput} onChange={(event) => setTeamMembersInput(event.target.value)} placeholder="Nome Sobrenome, Nome Sobrenome" />
              <p className="text-xs text-bvbp-muted-ink">Separe cada pessoa por vírgula.</p>
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="initiative-start">Data de início</Label>
              <DatePickerBr id="initiative-start" value={initiativeForm.startDate} onChange={(value) => setInitiativeForm({ ...initiativeForm, startDate: value })} />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="initiative-deadline">Prazo</Label>
              <DatePickerBr id="initiative-deadline" value={initiativeForm.deadline} onChange={(value) => setInitiativeForm({ ...initiativeForm, deadline: value, endDate: value })} />
            </div>
            <div className="space-y-2 md:col-span-6">
              <Label htmlFor="initiative-hypothesis">Hipótese</Label>
              <Textarea
                id="initiative-hypothesis"
                value={initiativeForm.hypothesis}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, hypothesis: event.target.value })}
                placeholder="Se reduzirmos [causa] por meio de [ação], então [ponteiro] irá de [baseline] para [meta] porque [racional]."
              />
            </div>
            <div className="space-y-2 md:col-span-6">
              <Label htmlFor="initiative-why">Por que importa</Label>
              <Textarea
                id="initiative-why"
                value={initiativeForm.whyItMatters}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, whyItMatters: event.target.value })}
                placeholder="Isso importa porque afeta [cliente/processo/resultado] em [impacto observável]."
              />
            </div>
            <div className="space-y-2 md:col-span-6">
              <Label htmlFor="initiative-decision">Próxima decisão</Label>
              <Input
                id="initiative-decision"
                value={initiativeForm.nextDecision}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, nextDecision: event.target.value })}
                placeholder="Decidir [o quê] quando [evidência ou critério] estiver disponível."
              />
            </div>
            {formError && <p className="text-sm font-semibold text-bvbp-risk md:col-span-6">{formError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="outline"
              className="rounded-[8px] border-bvbp-forest bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark hover:text-bvbp-ivory"
              onClick={saveInitiative}
              disabled={!canSaveInitiative}
            >
              Salvar iniciativa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PerformanceExecutionPage;
