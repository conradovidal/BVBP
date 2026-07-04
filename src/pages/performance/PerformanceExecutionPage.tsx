import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useOutletContext } from "react-router-dom";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Columns3, GripVertical, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { MetricCard } from "@/components/performance/MetricCard";
import { SectionHeader } from "@/components/performance/SectionHeader";
import { StatusBadge } from "@/components/performance/StatusBadge";
import {
  type Company,
  type EvidenceType,
  type PdcaAction,
  type PdcaActionStatus,
  type PdcaCycle,
  type PdcaStatus,
  bvbpPointerOptions,
  evidenceTypes,
  pdcaStatuses,
} from "@/data/performanceSystem";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";
import {
  addPdcaEvidence,
  getPdcaCyclesForCompany,
  reorderPdcaCycles,
  updatePdcaCycleStatus,
  upsertPdcaAction,
  upsertPdcaCycle,
  type EvidenceInput,
  type PdcaActionInput,
  type PdcaCycleInput,
} from "@/lib/pdcaCycleStore";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "flow";

const actionStatuses: PdcaActionStatus[] = ["Aberta", "Em andamento", "Concluída", "Bloqueada"];
const pointerOptions = Array.from(new Set([...bvbpPointerOptions, "Financeiro", "Operacional", "Automação"]));

const blankCycleForm: PdcaCycleInput = {
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

const blankActionForm: PdcaActionInput = {
  title: "",
  owner: "",
  deadline: "",
  status: "Aberta",
};

function formatImpact(value: number) {
  return value ? `${formatCurrency(value)}/mês` : "Estimado";
}

function getSortedCycles(cycles: PdcaCycle[]) {
  return [...cycles].sort((a, b) => (a.priorityOrder || 0) - (b.priorityOrder || 0));
}

function cycleToForm(cycle: PdcaCycle): PdcaCycleInput {
  return {
    id: cycle.id,
    title: cycle.title,
    affectedPointer: cycle.affectedPointer,
    affectedFlow: cycle.affectedFlow,
    hypothesis: cycle.hypothesis,
    plannedAction: cycle.plannedAction,
    whyItMatters: cycle.whyItMatters,
    owner: cycle.owner,
    deadline: cycle.deadline,
    pdcaStatus: cycle.pdcaStatus,
    estimatedImpact: cycle.estimatedImpact,
    nextDecision: cycle.nextDecision,
    dataType: cycle.dataType,
    startDate: cycle.startDate || "",
    endDate: cycle.endDate || "",
    baseline: cycle.baseline || "",
    target: cycle.target || "",
    priorityOrder: cycle.priorityOrder || 0,
    actions: cycle.actions || [],
  };
}

function CycleDragHandle({ title }: { title: string }) {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-bvbp-ink/10 text-bvbp-muted-ink">
      <GripVertical className="h-4 w-4" aria-label={`Arrastar ${title}`} />
    </span>
  );
}

interface SortableCycleCardProps {
  cycle: PdcaCycle;
  variant: ViewMode;
  onOpen: (cycle: PdcaCycle) => void;
  onStatusChange: (cycleId: string, status: PdcaStatus) => void;
}

function SortableCycleCard({ cycle, variant, onOpen, onStatusChange }: SortableCycleCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cycle.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-3 shadow-none",
        isDragging && "relative z-20 border-bvbp-forest/40 opacity-80",
        variant === "list" && "grid gap-3 lg:grid-cols-[32px_minmax(0,1.3fr)_minmax(180px,0.7fr)_170px_150px]",
      )}
    >
      <button
        type="button"
        className={cn("cursor-grab active:cursor-grabbing", variant === "flow" && "mb-3")}
        {...attributes}
        {...listeners}
      >
        <CycleDragHandle title={cycle.title} />
      </button>

      <button type="button" className="min-w-0 text-left" onClick={() => onOpen(cycle)}>
        <p className="font-heading text-sm font-bold leading-5 text-bvbp-ink">{cycle.title}</p>
        <p className="mt-1 text-xs font-semibold text-bvbp-muted-ink">{cycle.affectedPointer}</p>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-bvbp-muted-ink">{cycle.nextDecision}</p>
      </button>

      <div className="grid gap-1 text-xs text-bvbp-muted-ink">
        <span className="font-semibold text-bvbp-ink">{cycle.owner || "Sem responsável"}</span>
        <span>{cycle.startDate || "Início a definir"} → {cycle.endDate || cycle.deadline || "Fim a definir"}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge label={cycle.dataType} />
        <span className="text-xs font-semibold text-bvbp-positive">{formatImpact(cycle.estimatedImpact)}</span>
      </div>

      <Select value={cycle.pdcaStatus} onValueChange={(value) => onStatusChange(cycle.id, value as PdcaStatus)}>
        <SelectTrigger className="h-9 bg-bvbp-ivory text-xs">
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
    </article>
  );
}

interface FlowColumnProps {
  status: PdcaStatus;
  cycles: PdcaCycle[];
  onOpen: (cycle: PdcaCycle) => void;
  onStatusChange: (cycleId: string, status: PdcaStatus) => void;
}

function FlowColumn({ status, cycles, onOpen, onStatusChange }: FlowColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `status:${status}` });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-3 shadow-none",
        isOver && "border-bvbp-forest/40 bg-bvbp-inset",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-heading text-base font-bold text-bvbp-ink">{status}</h2>
        <span className="text-xs font-bold text-bvbp-muted-ink/70">{cycles.length}</span>
      </div>
      <SortableContext items={cycles.map((cycle) => cycle.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {cycles.map((cycle) => (
            <SortableCycleCard
              key={cycle.id}
              cycle={cycle}
              variant="flow"
              onOpen={onOpen}
              onStatusChange={onStatusChange}
            />
          ))}
          {!cycles.length && (
            <p className="rounded-[8px] border border-dashed border-bvbp-ink/10 px-3 py-5 text-center text-xs font-medium text-bvbp-muted-ink/70">
              Arraste um ciclo para cá.
            </p>
          )}
        </div>
      </SortableContext>
    </section>
  );
}

const PerformanceExecutionPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [cycles, setCycles] = useState<PdcaCycle[]>(() => getPdcaCyclesForCompany(activeCompany));
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedCycle, setSelectedCycle] = useState<PdcaCycle | null>(null);
  const [isCycleDialogOpen, setIsCycleDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cycleForm, setCycleForm] = useState<PdcaCycleInput>(blankCycleForm);
  const [evidenceForm, setEvidenceForm] = useState<EvidenceInput>(blankEvidenceForm);
  const [actionForm, setActionForm] = useState<PdcaActionInput>(blankActionForm);
  const [formError, setFormError] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    setCycles(getPdcaCyclesForCompany(activeCompany));
    setSelectedCycle(null);
    setIsCycleDialogOpen(false);
  }, [activeCompany]);

  const sortedCycles = useMemo(() => getSortedCycles(cycles), [cycles]);
  const totalImpact = cycles.reduce((sum, cycle) => sum + cycle.estimatedImpact, 0);
  const activeCycles = cycles.filter((cycle) => !["Padronizar", "Pausar"].includes(cycle.pdcaStatus)).length;
  const actionCount = cycles.reduce((sum, cycle) => sum + (cycle.actions?.length || 0), 0);

  const refreshCycles = (nextSelectedId?: string) => {
    const nextCycles = getPdcaCyclesForCompany(activeCompany);
    setCycles(nextCycles);
    if (nextSelectedId) {
      setSelectedCycle(nextCycles.find((cycle) => cycle.id === nextSelectedId) || null);
    }
  };

  const openNewCycle = () => {
    setCycleForm({ ...blankCycleForm, priorityOrder: cycles.length });
    setSelectedCycle(null);
    setEvidenceForm(blankEvidenceForm);
    setActionForm(blankActionForm);
    setIsEditing(true);
    setFormError("");
    setIsCycleDialogOpen(true);
  };

  const openCycle = (cycle: PdcaCycle) => {
    setSelectedCycle(cycle);
    setCycleForm(cycleToForm(cycle));
    setEvidenceForm(blankEvidenceForm);
    setActionForm({ ...blankActionForm, owner: cycle.owner, deadline: cycle.deadline });
    setIsEditing(false);
    setFormError("");
    setIsCycleDialogOpen(true);
  };

  const saveCycle = () => {
    if (!cycleForm.title.trim() || !cycleForm.affectedPointer.trim()) {
      setFormError("Nome e ponteiro afetado são obrigatórios.");
      return;
    }

    const saved = upsertPdcaCycle(activeCompany, cycleForm);
    refreshCycles(saved.id);
    setCycleForm(cycleToForm(saved));
    setSelectedCycle(saved);
    setIsEditing(false);
    setFormError("");
    setIsCycleDialogOpen(true);
  };

  const changeCycleStatus = (cycleId: string, status: PdcaStatus) => {
    updatePdcaCycleStatus(cycleId, status);
    refreshCycles(selectedCycle?.id);
  };

  const saveEvidence = () => {
    if (!selectedCycle || !evidenceForm.description.trim()) return;

    addPdcaEvidence(selectedCycle.id, evidenceForm);
    setEvidenceForm(blankEvidenceForm);
    refreshCycles(selectedCycle.id);
  };

  const saveAction = () => {
    if (!selectedCycle || !actionForm.title.trim()) return;

    upsertPdcaAction(selectedCycle.id, actionForm);
    setActionForm({ ...blankActionForm, owner: selectedCycle.owner, deadline: selectedCycle.deadline });
    refreshCycles(selectedCycle.id);
  };

  const updateActionStatus = (action: PdcaAction, status: PdcaActionStatus) => {
    if (!selectedCycle) return;

    upsertPdcaAction(selectedCycle.id, { ...action, status });
    refreshCycles(selectedCycle.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : "";
    if (!overId || activeId === overId) return;

    const activeCycle = sortedCycles.find((cycle) => cycle.id === activeId);
    if (!activeCycle) return;

    const nextStatus =
      viewMode === "flow"
        ? overId.startsWith("status:")
          ? (overId.replace("status:", "") as PdcaStatus)
          : sortedCycles.find((cycle) => cycle.id === overId)?.pdcaStatus || activeCycle.pdcaStatus
        : activeCycle.pdcaStatus;
    const oldIndex = sortedCycles.findIndex((cycle) => cycle.id === activeId);
    const overIndex = sortedCycles.findIndex((cycle) => cycle.id === overId);
    const reorderedCycles = overIndex >= 0 ? arrayMove(sortedCycles, oldIndex, overIndex) : sortedCycles;
    const nextCycles = reorderPdcaCycles(
      activeCompany.id,
      reorderedCycles.map((cycle) => cycle.id),
      { [activeId]: nextStatus },
    );

    setCycles(nextCycles);
  };

  return (
    <>
      <Helmet>
        <title>Iniciativas | BVBP Performance System</title>
        <meta name="description" content="Iniciativas, prioridades, ações e evidências." />
      </Helmet>

      <div className="space-y-8">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-bvbp-ink sm:text-3xl">Iniciativas</h1>
            <p className="mt-1 text-sm text-bvbp-muted-ink">{activeCompany.name} · prioridades, ações e evidências.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn("rounded-[6px]", viewMode === "list" && "bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest hover:text-bvbp-ivory")}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
                Lista
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn("rounded-[6px]", viewMode === "flow" && "bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest hover:text-bvbp-ivory")}
                onClick={() => setViewMode("flow")}
              >
                <Columns3 className="h-4 w-4" />
                Fluxo
              </Button>
            </div>
            <Button
              variant="outline"
              className="rounded-[8px] border-bvbp-forest bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark hover:text-bvbp-ivory"
              onClick={openNewCycle}
            >
              <Plus className="h-4 w-4" />
              Novo ciclo
            </Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Iniciativas" value={formatNumber(cycles.length)} accent="blue" />
          <MetricCard title="Ativos" value={formatNumber(activeCycles)} accent="orange" />
          <MetricCard title="Ações" value={formatNumber(actionCount)} accent="gray" />
          <MetricCard title="Impacto" value={`${formatCurrency(totalImpact)}/mês`} accent="green" />
        </section>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {viewMode === "list" ? (
            <section className="space-y-4">
              <SectionHeader title="Lista por prioridade" description="Arraste para ordenar o que precisa vir primeiro." />
              <SortableContext items={sortedCycles.map((cycle) => cycle.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {sortedCycles.map((cycle) => (
                    <SortableCycleCard
                      key={cycle.id}
                      cycle={cycle}
                      variant="list"
                      onOpen={openCycle}
                      onStatusChange={changeCycleStatus}
                    />
                  ))}
                </div>
              </SortableContext>
            </section>
          ) : (
            <section className="space-y-4">
              <SectionHeader title="Fluxo das iniciativas" description="Arraste entre etapas para atualizar o status." />
              <div className="grid gap-3 lg:grid-cols-3 2xl:grid-cols-6">
                {pdcaStatuses.map((status) => (
                  <FlowColumn
                    key={status}
                    status={status}
                    cycles={sortedCycles.filter((cycle) => cycle.pdcaStatus === status)}
                    onOpen={openCycle}
                    onStatusChange={changeCycleStatus}
                  />
                ))}
              </div>
            </section>
          )}
        </DndContext>
      </div>

      <Dialog open={isCycleDialogOpen} onOpenChange={setIsCycleDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto bg-bvbp-ivory">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-bvbp-ink">
              {isEditing ? (cycleForm.id ? "Editar ciclo" : "Novo ciclo") : selectedCycle?.title}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Conecte ponteiro, responsável, baseline e objetivo." : "Detalhe do ciclo, ações, evidências e aprendizados."}
            </DialogDescription>
          </DialogHeader>

          {isEditing ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cycle-title">Título</Label>
                <Input id="cycle-title" value={cycleForm.title} onChange={(event) => setCycleForm({ ...cycleForm, title: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Ponteiro afetado</Label>
                <Select value={cycleForm.affectedPointer} onValueChange={(value) => setCycleForm({ ...cycleForm, affectedPointer: value })}>
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
                <Label htmlFor="cycle-flow">Frente afetada</Label>
                <Input id="cycle-flow" value={cycleForm.affectedFlow} onChange={(event) => setCycleForm({ ...cycleForm, affectedFlow: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cycle-owner">Responsável principal</Label>
                <Input id="cycle-owner" value={cycleForm.owner} onChange={(event) => setCycleForm({ ...cycleForm, owner: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status PDCA</Label>
                <Select value={cycleForm.pdcaStatus} onValueChange={(value) => setCycleForm({ ...cycleForm, pdcaStatus: value as PdcaStatus })}>
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
                <Label htmlFor="cycle-start">Data de início</Label>
                <Input id="cycle-start" value={cycleForm.startDate} onChange={(event) => setCycleForm({ ...cycleForm, startDate: event.target.value })} placeholder="2026-06-30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cycle-end">Data de fim</Label>
                <Input id="cycle-end" value={cycleForm.endDate} onChange={(event) => setCycleForm({ ...cycleForm, endDate: event.target.value })} placeholder="2026-07-30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cycle-baseline">Baseline</Label>
                <Input id="cycle-baseline" value={cycleForm.baseline} onChange={(event) => setCycleForm({ ...cycleForm, baseline: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cycle-target">Objetivo</Label>
                <Input id="cycle-target" value={cycleForm.target} onChange={(event) => setCycleForm({ ...cycleForm, target: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cycle-impact">Impacto estimado</Label>
                <Input
                  id="cycle-impact"
                  type="number"
                  value={cycleForm.estimatedImpact}
                  onChange={(event) => setCycleForm({ ...cycleForm, estimatedImpact: Number(event.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de dado</Label>
                <Select value={cycleForm.dataType} onValueChange={(value) => setCycleForm({ ...cycleForm, dataType: value as PdcaCycle["dataType"] })}>
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
                <Label htmlFor="cycle-hypothesis">Hipótese</Label>
                <Textarea id="cycle-hypothesis" value={cycleForm.hypothesis} onChange={(event) => setCycleForm({ ...cycleForm, hypothesis: event.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cycle-action">Ação planejada</Label>
                <Textarea id="cycle-action" value={cycleForm.plannedAction} onChange={(event) => setCycleForm({ ...cycleForm, plannedAction: event.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cycle-why">Por que importa</Label>
                <Textarea id="cycle-why" value={cycleForm.whyItMatters} onChange={(event) => setCycleForm({ ...cycleForm, whyItMatters: event.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cycle-decision">Próxima decisão</Label>
                <Input id="cycle-decision" value={cycleForm.nextDecision} onChange={(event) => setCycleForm({ ...cycleForm, nextDecision: event.target.value })} />
              </div>
              {formError && <p className="text-sm font-semibold text-bvbp-risk md:col-span-2">{formError}</p>}
            </div>
          ) : selectedCycle ? (
            <div className="space-y-6">
              <section className="grid gap-3 md:grid-cols-4">
                <MetricCard title="Ponteiro" value={selectedCycle.affectedPointer} accent="blue" />
                <MetricCard title="Status" value={selectedCycle.pdcaStatus} accent="orange" />
                <MetricCard title="Baseline" value={selectedCycle.baseline || "A confirmar"} accent="gray" />
                <MetricCard title="Objetivo" value={selectedCycle.target || "A confirmar"} accent="green" />
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                {[
                  ["Responsável", selectedCycle.owner],
                  ["Início", selectedCycle.startDate || "A definir"],
                  ["Fim", selectedCycle.endDate || selectedCycle.deadline],
                  ["Impacto", formatImpact(selectedCycle.estimatedImpact)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">{label}</p>
                    <p className="mt-2 text-sm font-bold text-bvbp-ink">{value}</p>
                  </div>
                ))}
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Hipótese</p>
                  <p className="mt-2 text-sm leading-6 text-bvbp-ink">{selectedCycle.hypothesis}</p>
                </div>
                <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Próxima decisão</p>
                  <p className="mt-2 text-sm leading-6 text-bvbp-ink">{selectedCycle.nextDecision}</p>
                </div>
              </section>

              <section className="space-y-3">
                <SectionHeader title="Ações do ciclo" />
                <div className="space-y-2">
                  {(selectedCycle.actions || []).map((action) => (
                    <article key={action.id} className="grid gap-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-3 md:grid-cols-[minmax(0,1fr)_140px_140px_160px] md:items-center">
                      <div>
                        <p className="text-sm font-semibold text-bvbp-ink">{action.title}</p>
                        <p className="mt-1 text-xs text-bvbp-muted-ink">{action.owner || "Sem responsável"} · {action.deadline || "Sem prazo"}</p>
                      </div>
                      <span className="text-xs font-semibold text-bvbp-muted-ink">{action.owner || "Sem dono"}</span>
                      <span className="text-xs font-semibold text-bvbp-muted-ink">{action.deadline || "Sem prazo"}</span>
                      <Select value={action.status} onValueChange={(value) => updateActionStatus(action, value as PdcaActionStatus)}>
                        <SelectTrigger className="h-9 bg-bvbp-ivory text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {actionStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </article>
                  ))}
                </div>
                <div className="grid gap-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset p-3 md:grid-cols-[minmax(0,1fr)_140px_140px_160px]">
                  <Input value={actionForm.title} onChange={(event) => setActionForm({ ...actionForm, title: event.target.value })} placeholder="Nova ação" />
                  <Input value={actionForm.owner} onChange={(event) => setActionForm({ ...actionForm, owner: event.target.value })} placeholder="Responsável" />
                  <Input value={actionForm.deadline} onChange={(event) => setActionForm({ ...actionForm, deadline: event.target.value })} placeholder="Prazo" />
                  <Button variant="outline" onClick={saveAction} disabled={!actionForm.title.trim()}>
                    Adicionar
                  </Button>
                </div>
              </section>

              <section className="space-y-3">
                <SectionHeader title="Evidências" />
                <div className="space-y-2">
                  {selectedCycle.evidences.map((evidence) => (
                    <article key={evidence.id} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge label={evidence.type} />
                        <span className="text-xs font-semibold text-bvbp-muted-ink/70">{evidence.date}</span>
                        {evidence.observedValue && <span className="text-xs font-semibold text-bvbp-positive">{evidence.observedValue}</span>}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-bvbp-ink">{evidence.description}</p>
                      {evidence.note && <p className="mt-1 text-xs leading-5 text-bvbp-muted-ink">{evidence.note}</p>}
                    </article>
                  ))}
                  {!selectedCycle.evidences.length && (
                    <p className="text-sm leading-6 text-bvbp-muted-ink">Nenhuma evidência registrada ainda.</p>
                  )}
                </div>
                <div className="grid gap-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset p-3 md:grid-cols-[160px_minmax(0,1fr)]">
                  <Select value={evidenceForm.type} onValueChange={(value) => setEvidenceForm({ ...evidenceForm, type: value as EvidenceType })}>
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
                    onChange={(event) => setEvidenceForm({ ...evidenceForm, description: event.target.value })}
                    placeholder="Descrição da evidência"
                  />
                  <Input
                    value={evidenceForm.observedValue}
                    onChange={(event) => setEvidenceForm({ ...evidenceForm, observedValue: event.target.value })}
                    placeholder="Valor observado"
                  />
                  <Input
                    value={evidenceForm.note}
                    onChange={(event) => setEvidenceForm({ ...evidenceForm, note: event.target.value })}
                    placeholder="Observação"
                  />
                  <Button className="md:col-span-2" variant="outline" onClick={saveEvidence} disabled={!evidenceForm.description.trim()}>
                    Registrar evidência
                  </Button>
                </div>
              </section>

              <section className="space-y-3">
                <SectionHeader title="Aprendizados" />
                <div className="space-y-2">
                  {selectedCycle.learnings.map((learning) => (
                    <p key={learning.id} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised px-3 py-2 text-sm leading-6 text-bvbp-ink">
                      <span className="mr-2 font-semibold text-bvbp-muted-ink/70">{learning.date}</span>
                      {learning.description}
                    </p>
                  ))}
                  {!selectedCycle.learnings.length && <p className="text-sm text-bvbp-muted-ink">Nenhum aprendizado registrado.</p>}
                </div>
              </section>
            </div>
          ) : null}

          <DialogFooter>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => (selectedCycle ? setIsEditing(false) : setIsCycleDialogOpen(false))}>
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  className="rounded-[8px] border-bvbp-forest bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark hover:text-bvbp-ivory"
                  onClick={saveCycle}
                >
                  Salvar ciclo
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsCycleDialogOpen(false)}>
                  Fechar
                </Button>
                {selectedCycle && (
                  <Button
                    variant="outline"
                    className="rounded-[8px] border-bvbp-forest bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark hover:text-bvbp-ivory"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar ciclo
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PerformanceExecutionPage;
