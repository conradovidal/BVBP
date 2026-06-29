import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useOutletContext } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { MetricCard } from "@/components/performance/MetricCard";
import { SectionHeader } from "@/components/performance/SectionHeader";
import { StatusBadge } from "@/components/performance/StatusBadge";
import {
  type Company,
  type EvidenceType,
  type PdcaCycle,
  type PdcaStatus,
  bvbpPointerOptions,
  evidenceTypes,
  getImprovementsForCompany,
  isBvbpInternalWorkspace,
  pdcaStatuses,
  priorityBuckets,
} from "@/data/performanceSystem";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";
import {
  addBvbpPdcaEvidence,
  getBvbpPdcaCycles,
  updateBvbpPdcaCycleStatus,
  upsertBvbpPdcaCycle,
  type EvidenceInput,
  type PdcaCycleInput,
} from "@/lib/pdcaCycleStore";
import { cn } from "@/lib/utils";

const blankCycleForm: PdcaCycleInput = {
  title: "",
  affectedPointer: "Pipeline comercial",
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
};

const blankEvidenceForm: EvidenceInput = {
  description: "",
  type: "Aprendizado",
  observedValue: "",
  note: "",
};

function formatImpact(value: number) {
  return value ? `${formatCurrency(value)}/mês` : "Estimado";
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
  };
}

function ExternalExecutionView({ activeCompany }: { activeCompany: Company }) {
  const [selectedBucket, setSelectedBucket] = useState("Todos");
  const improvements = getImprovementsForCompany(activeCompany);

  const visibleImprovements = useMemo(() => {
    if (selectedBucket === "Todos") return improvements;
    return improvements.filter((improvement) => improvement.priorityBucket === selectedBucket);
  }, [improvements, selectedBucket]);

  const totalImpact = improvements.reduce((sum, improvement) => sum + improvement.estimatedImpact, 0);
  const runningItems = improvements.filter((item) => ["Executar", "Medir"].includes(item.pdcaStatus)).length;

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="font-heading text-2xl font-bold text-[#1B365D] sm:text-3xl">Execução</h1>
        <p className="text-sm text-slate-500">{activeCompany.name}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard title="Hipóteses" value={formatNumber(improvements.length)} accent="blue" />
        <MetricCard title="Impacto" value={`${formatCurrency(totalImpact)}/mês`} accent="green" />
        <MetricCard title="Em execução" value={formatNumber(runningItems)} accent="orange" />
      </section>

      <section className="space-y-4">
        <SectionHeader title="Matriz de priorização" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {priorityBuckets.map((bucket) => {
            const bucketItems = improvements.filter((improvement) => improvement.priorityBucket === bucket);
            const bucketImpact = bucketItems.reduce((sum, improvement) => sum + improvement.estimatedImpact, 0);
            const isSelected = selectedBucket === bucket;

            return (
              <button
                key={bucket}
                type="button"
                onClick={() => setSelectedBucket(isSelected ? "Todos" : bucket)}
                className={cn(
                  "rounded-lg border p-4 text-left shadow-sm transition-colors",
                  isSelected
                    ? "border-[#1B365D] bg-[#1B365D] text-white"
                    : "border-slate-200 bg-white text-[#1B365D] hover:border-[#1B365D]/40"
                )}
              >
                <h2 className="font-heading text-lg font-bold">{bucket}</h2>
                <p className={cn("mt-3 text-sm", isSelected ? "text-white/80" : "text-slate-500")}>
                  {bucketItems.length} iniciativa(s)
                </p>
                <p className="mt-2 text-sm font-bold">{bucketImpact ? `${formatCurrency(bucketImpact)}/mês` : "Sem itens"}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title="Ciclos PDCA" />
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ponteiro afetado</TableHead>
                  <TableHead>Fluxo afetado</TableHead>
                  <TableHead>Hipótese</TableHead>
                  <TableHead>Impacto estimado</TableHead>
                  <TableHead>Facilidade</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Status PDCA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleImprovements.map((improvement) => (
                  <TableRow key={improvement.id}>
                    <TableCell className="min-w-[260px] font-semibold text-[#1B365D]">{improvement.title}</TableCell>
                    <TableCell className="min-w-[160px] text-slate-700">{improvement.affectedPointer}</TableCell>
                    <TableCell className="min-w-[170px] text-slate-700">{improvement.affectedFlow}</TableCell>
                    <TableCell className="min-w-[300px] text-slate-700">{improvement.hypothesis}</TableCell>
                    <TableCell className="font-semibold text-[#38A169]">{formatCurrency(improvement.estimatedImpact)}/mês</TableCell>
                    <TableCell>
                      <StatusBadge label={improvement.ease} />
                    </TableCell>
                    <TableCell className="min-w-[140px] text-slate-700">{improvement.owner}</TableCell>
                    <TableCell className="text-slate-700">{improvement.deadline}</TableCell>
                    <TableCell>
                      <StatusBadge label={improvement.pdcaStatus} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  );
}

const PerformanceExecutionPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const isInternalWorkspace = isBvbpInternalWorkspace(activeCompany);
  const [cycles, setCycles] = useState<PdcaCycle[]>(() => (isInternalWorkspace ? getBvbpPdcaCycles() : []));
  const [selectedCycle, setSelectedCycle] = useState<PdcaCycle | null>(null);
  const [isCycleDialogOpen, setIsCycleDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cycleForm, setCycleForm] = useState<PdcaCycleInput>(blankCycleForm);
  const [evidenceForm, setEvidenceForm] = useState<EvidenceInput>(blankEvidenceForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isInternalWorkspace) {
      setCycles(getBvbpPdcaCycles());
      return;
    }

    setCycles([]);
    setSelectedCycle(null);
    setIsCycleDialogOpen(false);
  }, [isInternalWorkspace, activeCompany.id]);

  if (!isInternalWorkspace) {
    return (
      <>
        <Helmet>
          <title>Execução | BVBP Performance System</title>
          <meta name="description" content="Ciclos PDCA e hipóteses de melhoria priorizadas." />
        </Helmet>
        <ExternalExecutionView activeCompany={activeCompany} />
      </>
    );
  }

  const openNewCycle = () => {
    setCycleForm(blankCycleForm);
    setSelectedCycle(null);
    setIsEditing(true);
    setFormError("");
    setIsCycleDialogOpen(true);
  };

  const openCycle = (cycle: PdcaCycle) => {
    setSelectedCycle(cycle);
    setCycleForm(cycleToForm(cycle));
    setEvidenceForm(blankEvidenceForm);
    setIsEditing(false);
    setFormError("");
    setIsCycleDialogOpen(true);
  };

  const refreshCycles = (nextSelectedId?: string) => {
    const nextCycles = getBvbpPdcaCycles();
    setCycles(nextCycles);
    if (nextSelectedId) {
      setSelectedCycle(nextCycles.find((cycle) => cycle.id === nextSelectedId) || null);
    }
  };

  const saveCycle = () => {
    if (!cycleForm.title.trim() || !cycleForm.affectedPointer.trim()) {
      setFormError("Nome e ponteiro afetado são obrigatórios.");
      return;
    }

    const saved = upsertBvbpPdcaCycle(cycleForm);
    refreshCycles(saved.id);
    setCycleForm(cycleToForm(saved));
    setSelectedCycle(saved);
    setIsEditing(false);
    setFormError("");
    setIsCycleDialogOpen(true);
  };

  const changeCycleStatus = (cycleId: string, status: PdcaStatus) => {
    updateBvbpPdcaCycleStatus(cycleId, status);
    refreshCycles(selectedCycle?.id);
  };

  const saveEvidence = () => {
    if (!selectedCycle || !evidenceForm.description.trim()) return;

    addBvbpPdcaEvidence(selectedCycle.id, evidenceForm);
    setEvidenceForm(blankEvidenceForm);
    refreshCycles(selectedCycle.id);
  };

  const totalImpact = cycles.reduce((sum, cycle) => sum + cycle.estimatedImpact, 0);
  const activeCycles = cycles.filter((cycle) => cycle.pdcaStatus !== "Padronizar" && cycle.pdcaStatus !== "Pausar").length;
  const evidenceCount = cycles.reduce((sum, cycle) => sum + cycle.evidences.length, 0);

  return (
    <>
      <Helmet>
        <title>Execução | BVBP Performance System</title>
        <meta name="description" content="Board de ciclos PDCA da BVBP." />
      </Helmet>

      <div className="space-y-8">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#1B365D] sm:text-3xl">Execução</h1>
            <p className="mt-1 text-sm text-slate-500">Ciclos PDCA conectados a ponteiros, decisões e evidências.</p>
          </div>
          <Button variant="corporate" onClick={openNewCycle}>
            <Plus className="h-4 w-4" />
            Nova iniciativa
          </Button>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <MetricCard title="Ciclos" value={formatNumber(cycles.length)} accent="blue" />
          <MetricCard title="Ativos" value={formatNumber(activeCycles)} accent="orange" />
          <MetricCard title="Evidências" value={formatNumber(evidenceCount)} accent="green" />
        </section>

        <section className="space-y-4">
          <SectionHeader title="Board PDCA" />
          <div className="grid gap-3 lg:grid-cols-3 2xl:grid-cols-6">
            {pdcaStatuses.map((status) => {
              const statusCycles = cycles.filter((cycle) => cycle.pdcaStatus === status);

              return (
                <section key={status} className="rounded-[8px] border border-slate-200/80 bg-white p-3 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="font-heading text-base font-bold text-[#1B365D]">{status}</h2>
                    <span className="text-xs font-bold text-slate-400">{statusCycles.length}</span>
                  </div>
                  <div className="space-y-3">
                    {statusCycles.map((cycle) => (
                      <article
                        key={cycle.id}
                        className="rounded-[8px] border border-slate-200 bg-slate-50/70 p-3"
                      >
                        <button type="button" className="block w-full text-left" onClick={() => openCycle(cycle)}>
                          <p className="font-heading text-sm font-bold leading-5 text-[#1B365D]">{cycle.title}</p>
                          <p className="mt-2 text-xs font-semibold text-slate-500">{cycle.affectedPointer}</p>
                          <p className="mt-3 text-xs leading-5 text-slate-600">{cycle.nextDecision}</p>
                        </button>
                        <div className="mt-3 grid gap-2 text-xs text-slate-500">
                          <div className="flex items-center justify-between gap-2">
                            <span>{cycle.owner}</span>
                            <span>{cycle.deadline}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <StatusBadge label={cycle.dataType} />
                            <span className="font-semibold text-[#38A169]">{formatImpact(cycle.estimatedImpact)}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Select value={cycle.pdcaStatus} onValueChange={(value) => changeCycleStatus(cycle.id, value as PdcaStatus)}>
                            <SelectTrigger className="h-8 bg-white text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {pdcaStatuses.map((nextStatus) => (
                                <SelectItem key={nextStatus} value={nextStatus}>
                                  {nextStatus}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </article>
                    ))}
                    {!statusCycles.length && (
                      <p className="rounded-[8px] border border-dashed border-slate-200 px-3 py-5 text-center text-xs font-medium text-slate-400">
                        Nenhum ciclo ativo ainda.
                      </p>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </div>

      <Dialog open={isCycleDialogOpen} onOpenChange={setIsCycleDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? (cycleForm.id ? "Editar iniciativa" : "Nova iniciativa") : selectedCycle?.title}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Conecte a iniciativa a um ponteiro e mantenha a linguagem PDCA." : "Detalhe do ciclo, evidências e aprendizados."}
            </DialogDescription>
          </DialogHeader>

          {isEditing ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cycle-title">Nome</Label>
                <Input id="cycle-title" value={cycleForm.title} onChange={(event) => setCycleForm({ ...cycleForm, title: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Ponteiro afetado</Label>
                <Select value={cycleForm.affectedPointer} onValueChange={(value) => setCycleForm({ ...cycleForm, affectedPointer: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bvbpPointerOptions.map((pointer) => (
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
              <div className="space-y-2">
                <Label htmlFor="cycle-owner">Responsável</Label>
                <Input id="cycle-owner" value={cycleForm.owner} onChange={(event) => setCycleForm({ ...cycleForm, owner: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cycle-deadline">Prazo</Label>
                <Input id="cycle-deadline" value={cycleForm.deadline} onChange={(event) => setCycleForm({ ...cycleForm, deadline: event.target.value })} />
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
              <div className="space-y-2">
                <Label htmlFor="cycle-impact">Impacto estimado</Label>
                <Input
                  id="cycle-impact"
                  type="number"
                  value={cycleForm.estimatedImpact}
                  onChange={(event) => setCycleForm({ ...cycleForm, estimatedImpact: Number(event.target.value) })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cycle-decision">Próxima decisão</Label>
                <Input id="cycle-decision" value={cycleForm.nextDecision} onChange={(event) => setCycleForm({ ...cycleForm, nextDecision: event.target.value })} />
              </div>
              {formError && <p className="text-sm font-semibold text-red-600 md:col-span-2">{formError}</p>}
            </div>
          ) : selectedCycle ? (
            <div className="space-y-6">
              <section className="grid gap-3 md:grid-cols-4">
                <MetricCard title="Ponteiro" value={selectedCycle.affectedPointer} accent="blue" />
                <MetricCard title="Status" value={selectedCycle.pdcaStatus} accent="orange" />
                <MetricCard title="Impacto" value={formatImpact(selectedCycle.estimatedImpact)} accent="green" />
                <MetricCard title="Dado" value={selectedCycle.dataType} accent="gray" />
              </section>
              <section className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[8px] border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-400">Hipótese</p>
                  <p className="mt-2 text-sm leading-6 text-[#1B365D]">{selectedCycle.hypothesis}</p>
                </div>
                <div className="rounded-[8px] border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-400">Ação planejada</p>
                  <p className="mt-2 text-sm leading-6 text-[#1B365D]">{selectedCycle.plannedAction}</p>
                </div>
                <div className="rounded-[8px] border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-400">Por que importa</p>
                  <p className="mt-2 text-sm leading-6 text-[#1B365D]">{selectedCycle.whyItMatters}</p>
                </div>
                <div className="rounded-[8px] border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-400">Próxima decisão</p>
                  <p className="mt-2 text-sm leading-6 text-[#1B365D]">{selectedCycle.nextDecision}</p>
                </div>
              </section>
              <section className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Responsável</p>
                  <p className="mt-1 text-sm font-bold text-[#1B365D]">{selectedCycle.owner}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Prazo</p>
                  <p className="mt-1 text-sm font-bold text-[#1B365D]">{selectedCycle.deadline}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Frente</p>
                  <p className="mt-1 text-sm font-bold text-[#1B365D]">{selectedCycle.affectedFlow}</p>
                </div>
              </section>
              <section className="space-y-3">
                <SectionHeader title="Evidências" />
                <div className="space-y-2">
                  {selectedCycle.evidences.map((evidence) => (
                    <article key={evidence.id} className="rounded-[8px] border border-slate-200 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge label={evidence.type} />
                        <span className="text-xs font-semibold text-slate-400">{evidence.date}</span>
                        {evidence.observedValue && <span className="text-xs font-semibold text-[#38A169]">{evidence.observedValue}</span>}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#1B365D]">{evidence.description}</p>
                      {evidence.note && <p className="mt-1 text-xs leading-5 text-slate-500">{evidence.note}</p>}
                    </article>
                  ))}
                  {!selectedCycle.evidences.length && (
                    <p className="text-sm leading-6 text-slate-500">
                      Nenhuma evidência registrada. Registre aprendizados para sustentar a próxima decisão.
                    </p>
                  )}
                </div>
                <div className="grid gap-3 rounded-[8px] border border-slate-200 bg-slate-50 p-3 md:grid-cols-[160px_minmax(0,1fr)]">
                  <Select value={evidenceForm.type} onValueChange={(value) => setEvidenceForm({ ...evidenceForm, type: value as EvidenceType })}>
                    <SelectTrigger className="bg-white">
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
                    <p key={learning.id} className="rounded-[8px] border border-slate-200 px-3 py-2 text-sm leading-6 text-slate-700">
                      <span className="mr-2 font-semibold text-slate-400">{learning.date}</span>
                      {learning.description}
                    </p>
                  ))}
                  {!selectedCycle.learnings.length && <p className="text-sm text-slate-500">Nenhum aprendizado registrado.</p>}
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
                <Button variant="corporate" onClick={saveCycle}>
                  Salvar ciclo
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsCycleDialogOpen(false)}>
                  Fechar
                </Button>
                {selectedCycle && (
                  <Button variant="corporate" onClick={() => setIsEditing(true)}>
                    Editar iniciativa
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
