import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useOutletContext } from "react-router-dom";
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
import { InitiativePriorityList } from "@/components/performance/initiatives/InitiativePriorityList";
import { InitiativeSummaryCards } from "@/components/performance/initiatives/InitiativeSummaryCards";
import { SectionHeader } from "@/components/performance/SectionHeader";
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
import {
  type Company,
  type PdcaCycle,
  type PdcaStatus,
  bvbpPointerOptions,
  pdcaStatuses,
} from "@/data/performanceSystem";
import {
  getActivitiesForInitiatives,
  type InitiativeActivity,
  type InitiativeActivityInput,
  type InitiativeActivityStatus,
  updateInitiativeActivityStatus,
  upsertInitiativeActivity,
} from "@/lib/initiativeActivityStore";
import {
  addPdcaEvidence,
  getPdcaCyclesForCompany,
  reorderPdcaCycles,
  updatePdcaCycleStatus,
  upsertPdcaCycle,
  type EvidenceInput,
  type PdcaCycleInput,
} from "@/lib/pdcaCycleStore";
import { getPerformanceSession, isBvbpStaff } from "@/lib/performanceAuth";

const pointerOptions = Array.from(new Set([...bvbpPointerOptions, "Finanças", "Comercial", "Operação", "Tecnologia", "Automação"]));

const blankInitiativeForm: PdcaCycleInput = {
  title: "",
  affectedPointer: "Comercial",
  affectedFlow: "",
  hypothesis: "",
  plannedAction: "",
  whyItMatters: "",
  owner: "",
  deadline: "",
  pdcaStatus: "Planejar",
  estimatedImpact: 0,
  nextDecision: "",
  dataType: "Mockado",
  startDate: "",
  endDate: "",
  baseline: "",
  target: "",
  priorityOrder: 0,
  actions: [],
};

const blankEvidenceForm: EvidenceInput = {
  description: "",
  type: "Aprendizado",
  observedValue: "",
  note: "",
};

function getSortedInitiatives(initiatives: PdcaCycle[]) {
  return [...initiatives].sort((a, b) => (a.priorityOrder || 0) - (b.priorityOrder || 0));
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
    dataType: initiative.dataType,
    startDate: initiative.startDate || "",
    endDate: initiative.deadline || initiative.endDate || "",
    baseline: initiative.baseline || "",
    target: initiative.target || "",
    priorityOrder: initiative.priorityOrder || 0,
    actions: initiative.actions || [],
  };
}

function blankActivityForm(initiative?: PdcaCycle | null): InitiativeActivityInput {
  return {
    initiativeId: initiative?.id || "",
    title: "",
    description: "",
    owner: initiative?.owner || "",
    dueDate: initiative?.deadline || "",
    status: "A fazer",
  };
}

const PerformanceExecutionPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const location = useLocation();
  const isAdminPortal = location.pathname.startsWith("/app/admin");
  const canManageInitiatives = isBvbpStaff(getPerformanceSession());
  const [initiatives, setInitiatives] = useState<PdcaCycle[]>(() => getPdcaCyclesForCompany(activeCompany));
  const [activities, setActivities] = useState<InitiativeActivity[]>(() => getActivitiesForInitiatives(getPdcaCyclesForCompany(activeCompany)));
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string | null>(() => initiatives[0]?.id || null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [initiativeForm, setInitiativeForm] = useState<PdcaCycleInput>(blankInitiativeForm);
  const [evidenceForm, setEvidenceForm] = useState<EvidenceInput>(blankEvidenceForm);
  const [activityForm, setActivityForm] = useState<InitiativeActivityInput>(blankActivityForm());
  const [formError, setFormError] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    const nextInitiatives = getPdcaCyclesForCompany(activeCompany);

    setInitiatives(nextInitiatives);
    setActivities(getActivitiesForInitiatives(nextInitiatives));
    setSelectedInitiativeId(nextInitiatives[0]?.id || null);
    setIsFormDialogOpen(false);
    setEvidenceForm(blankEvidenceForm);
    setActivityForm(blankActivityForm(nextInitiatives[0]));
  }, [activeCompany]);

  const sortedInitiatives = useMemo(() => getSortedInitiatives(initiatives), [initiatives]);
  const selectedInitiative =
    sortedInitiatives.find((initiative) => initiative.id === selectedInitiativeId) ||
    sortedInitiatives[0] ||
    null;
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
    setEvidenceForm(blankEvidenceForm);
    setActivityForm(blankActivityForm(initiative));
  };

  const openNewInitiative = () => {
    if (!canManageInitiatives) return;

    setInitiativeForm({ ...blankInitiativeForm, priorityOrder: initiatives.length });
    setFormError("");
    setIsFormDialogOpen(true);
  };

  const openEditInitiative = () => {
    if (!canManageInitiatives || !selectedInitiative) return;

    setInitiativeForm(initiativeToForm(selectedInitiative));
    setFormError("");
    setIsFormDialogOpen(true);
  };

  const saveInitiative = () => {
    if (!canManageInitiatives) return;

    if (!initiativeForm.title.trim() || !initiativeForm.affectedPointer.trim()) {
      setFormError("Nome e ponteiro afetado são obrigatórios.");
      return;
    }

    const saved = upsertPdcaCycle(activeCompany, initiativeForm);
    refreshInitiatives(saved.id);
    setSelectedInitiativeId(saved.id);
    setEvidenceForm(blankEvidenceForm);
    setActivityForm(blankActivityForm(saved));
    setFormError("");
    setIsFormDialogOpen(false);
  };

  const changeInitiativeStatus = (initiativeId: string, status: PdcaStatus) => {
    if (!canManageInitiatives) return;

    updatePdcaCycleStatus(initiativeId, status);
    refreshInitiatives(selectedInitiativeId || initiativeId);
  };

  const addEvidence = () => {
    if (!selectedInitiative || !evidenceForm.description.trim()) return;

    addPdcaEvidence(selectedInitiative.id, evidenceForm);
    setEvidenceForm(blankEvidenceForm);
    refreshInitiatives(selectedInitiative.id);
  };

  const addActivity = () => {
    if (!selectedInitiative || !activityForm.title.trim()) return;

    upsertInitiativeActivity({ ...activityForm, initiativeId: selectedInitiative.id });
    setActivities(getActivitiesForInitiatives(initiatives));
    setActivityForm(blankActivityForm(selectedInitiative));
  };

  const updateActivity = (activity: InitiativeActivityInput) => {
    upsertInitiativeActivity(activity);
    setActivities(getActivitiesForInitiatives(initiatives));
  };

  const changeActivityStatus = (activityId: string, status: InitiativeActivityStatus) => {
    updateInitiativeActivityStatus(activityId, status);
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
        <meta name="description" content="Prioridades, atividades e evidências para mover os ponteiros." />
      </Helmet>

      <div className="space-y-8">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {!isAdminPortal ? <h1 className="font-heading text-2xl font-bold text-bvbp-ink sm:text-3xl">Iniciativas</h1> : null}
            <p className="mt-1 text-sm font-semibold text-bvbp-ink">{activeCompany.name}</p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-bvbp-muted-ink">
              Prioridades, atividades e evidências para mover os ponteiros.
            </p>
          </div>
          {canManageInitiatives ? (
            <Button
              variant="outline"
              className="rounded-[8px] border-bvbp-forest bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark hover:text-bvbp-ivory"
              onClick={openNewInitiative}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Nova iniciativa
            </Button>
          ) : null}
        </section>

        <InitiativeSummaryCards initiatives={initiatives} activities={activities} />

        <section className="space-y-4">
          <SectionHeader
            title="Lista por prioridade"
            description={canManageInitiatives ? "Arraste para ordenar o que precisa vir primeiro." : "Prioridades definidas pela equipe BVBP."}
          />
          {sortedInitiatives.length ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <InitiativePriorityList
                initiatives={sortedInitiatives}
                selectedInitiativeId={selectedInitiative?.id}
                canManage={canManageInitiatives}
                onSelect={selectInitiative}
                onStatusChange={changeInitiativeStatus}
              />
            </DndContext>
          ) : (
            <EmptyState
              title="Nenhuma iniciativa registrada."
              description="Crie a primeira iniciativa para conectar execução aos ponteiros."
            />
          )}
        </section>

        <InitiativeDetailPanel
          initiative={selectedInitiative}
          activities={selectedActivities}
          activityForm={activityForm}
          evidenceForm={evidenceForm}
          canManageInitiative={canManageInitiatives}
          onEdit={openEditInitiative}
          onActivityFormChange={setActivityForm}
          onAddActivity={addActivity}
          onUpdateActivity={updateActivity}
          onActivityStatusChange={changeActivityStatus}
          onEvidenceFormChange={setEvidenceForm}
          onAddEvidence={addEvidence}
        />
      </div>

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-bvbp-ivory">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-bvbp-ink">
              {initiativeForm.id ? "Editar iniciativa" : "Nova iniciativa"}
            </DialogTitle>
            <DialogDescription>
              Conecte ponteiro, responsável, baseline, objetivo e próxima decisão.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="initiative-title">Título</Label>
              <Input
                id="initiative-title"
                value={initiativeForm.title}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, title: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Ponteiro afetado</Label>
              <Select
                value={initiativeForm.affectedPointer}
                onValueChange={(value) => setInitiativeForm({ ...initiativeForm, affectedPointer: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pointerOptions.map((pointer) => (
                    <SelectItem key={pointer} value={pointer}>
                      {pointer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="initiative-flow">Frente afetada</Label>
              <Input
                id="initiative-flow"
                value={initiativeForm.affectedFlow}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, affectedFlow: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initiative-owner">Responsável principal</Label>
              <Input
                id="initiative-owner"
                value={initiativeForm.owner}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, owner: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={initiativeForm.pdcaStatus}
                onValueChange={(value) => setInitiativeForm({ ...initiativeForm, pdcaStatus: value as PdcaStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pdcaStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="initiative-start">Data de início</Label>
              <Input
                id="initiative-start"
                value={initiativeForm.startDate}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, startDate: event.target.value })}
                placeholder="2026-06-30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initiative-deadline">Prazo</Label>
              <Input
                id="initiative-deadline"
                value={initiativeForm.deadline}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, deadline: event.target.value, endDate: event.target.value })}
                placeholder="2026-07-30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initiative-baseline">Baseline</Label>
              <Input
                id="initiative-baseline"
                value={initiativeForm.baseline}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, baseline: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initiative-target">Objetivo</Label>
              <Input
                id="initiative-target"
                value={initiativeForm.target}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, target: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initiative-impact">Impacto estimado</Label>
              <Input
                id="initiative-impact"
                type="number"
                value={initiativeForm.estimatedImpact}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, estimatedImpact: Number(event.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de dado</Label>
              <Select
                value={initiativeForm.dataType}
                onValueChange={(value) => setInitiativeForm({ ...initiativeForm, dataType: value as PdcaCycle["dataType"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Mockado", "Estimado", "Real"].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="initiative-hypothesis">Hipótese</Label>
              <Textarea
                id="initiative-hypothesis"
                value={initiativeForm.hypothesis}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, hypothesis: event.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="initiative-why">Por que importa</Label>
              <Textarea
                id="initiative-why"
                value={initiativeForm.whyItMatters}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, whyItMatters: event.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="initiative-decision">Próxima decisão</Label>
              <Input
                id="initiative-decision"
                value={initiativeForm.nextDecision}
                onChange={(event) => setInitiativeForm({ ...initiativeForm, nextDecision: event.target.value })}
              />
            </div>
            {formError && <p className="text-sm font-semibold text-bvbp-risk md:col-span-2">{formError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="outline"
              className="rounded-[8px] border-bvbp-forest bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark hover:text-bvbp-ivory"
              onClick={saveInitiative}
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
