import {
  BVBP_COMPANY_ID,
  type Company,
  type EvidenceType,
  type Improvement,
  type PdcaAction,
  type PdcaActionStatus,
  type PdcaCycle,
  type PdcaEvidence,
  type PdcaStatus,
  bvbpPdcaCycleSeeds,
  getImprovementsForCompany,
  mockCompanies,
} from "@/data/performanceSystem";
import { syncPdcaCyclesForCompanySoon } from "@/lib/clientPortalSupabase";
import { portalRuntimeConfig } from "@/lib/portalRuntimeConfig";
import { PORTAL_STORAGE_KEYS, isPdcaCycleList, readJsonStorage, writeJsonStorage } from "@/lib/portalStorage";

export type PdcaCycleInput = Omit<PdcaCycle, "id" | "companyId" | "evidences" | "learnings" | "actions"> & {
  id?: string;
  actions?: PdcaAction[];
};

export interface EvidenceInput {
  description: string;
  type: EvidenceType;
  observedValue?: string;
  note?: string;
}

export interface PdcaActionInput {
  id?: string;
  title: string;
  owner: string;
  deadline: string;
  status: PdcaActionStatus;
}

function savePdcaCycles(cycles: PdcaCycle[]) {
  writeJsonStorage(PORTAL_STORAGE_KEYS.pdcaCycles, cycles);
}

function readAllPdcaCycles() {
  const { data: storedCycles } = readJsonStorage(PORTAL_STORAGE_KEYS.pdcaCycles, isPdcaCycleList);
  return storedCycles?.map(normalizeStoredCycle) || [];
}

function syncCompanyCyclesFromList(companyId: string, cycles: PdcaCycle[]) {
  syncPdcaCyclesForCompanySoon(
    companyId,
    cycles.filter((cycle) => cycle.companyId === companyId),
  );
}

function normalizeAffectedPointer(pointer: string) {
  if (["Pipeline comercial", "Funil comercial", "Funil", "Cadência comercial"].includes(pointer)) return "Comercial";
  if (["Dinheiro", "Clareza financeira"].includes(pointer)) return "Finanças";
  if (pointer === "Eficiência operacional") return "Operação";
  if (["Tecnologia e IA", "Automações", "Automação aplicada", "Tecnologia"].includes(pointer)) return "Automação";
  if (pointer === "Ciclos ativos") return "Iniciativas ativas";
  return pointer;
}

function normalizeActionStatus(status: string | undefined): PdcaActionStatus {
  if (status === "Em andamento" || status === "Concluída" || status === "Bloqueada") return status;
  return "Aberta";
}

function normalizeActions(cycle: PdcaCycle): PdcaAction[] {
  if (cycle.actions?.length) {
    return cycle.actions.map((action) => ({
      id: action.id,
      title: action.title,
      owner: action.owner || cycle.owner,
      deadline: action.deadline || cycle.deadline,
      status: normalizeActionStatus(action.status),
    }));
  }

  return [
    {
      id: `${cycle.id}-action-main`,
      title: cycle.plannedAction || cycle.nextDecision || "Definir próxima ação",
      owner: cycle.owner,
      deadline: cycle.deadline,
      status: cycle.pdcaStatus === "Padronizar" ? "Concluída" : cycle.pdcaStatus === "Pausar" ? "Bloqueada" : "Aberta",
    },
  ];
}

function normalizeStoredCycle(cycle: PdcaCycle, index = 0): PdcaCycle {
  const affectedPointer = normalizeAffectedPointer(cycle.affectedPointer);
  const firstEvidenceDate = cycle.evidences[0]?.date;

  return {
    ...cycle,
    affectedPointer,
    startDate: cycle.startDate || firstEvidenceDate || "2026-06-30",
    endDate: cycle.endDate || cycle.deadline,
    baseline: cycle.baseline || "Linha de base a confirmar",
    target: cycle.target || cycle.nextDecision || "Objetivo a confirmar",
    priorityOrder: typeof cycle.priorityOrder === "number" ? cycle.priorityOrder : index,
    actions: normalizeActions({ ...cycle, affectedPointer }),
  };
}

function cycleFromImprovement(improvement: Improvement, company: Company, index: number): PdcaCycle {
  return normalizeStoredCycle(
    {
      id: `${company.id}-${improvement.id}`,
      companyId: company.id,
      title: improvement.title,
      affectedPointer: normalizeAffectedPointer(improvement.affectedPointer),
      affectedFlow: improvement.affectedFlow,
      hypothesis: improvement.hypothesis,
      plannedAction: improvement.nextDecision || improvement.hypothesis,
      whyItMatters: "Esta iniciativa foi seedada a partir dos sinais priorizados para o workspace.",
      owner: improvement.owner,
      deadline: improvement.deadline,
      pdcaStatus: normalizePdcaStatus(improvement.pdcaStatus),
      estimatedImpact: improvement.estimatedImpact,
      nextDecision: improvement.nextDecision || "Definir evidência mínima para avançar.",
      dataType: "Estimado",
      startDate: "2026-06-30",
      endDate: improvement.deadline,
      baseline: improvement.affectedPointer,
      target: `Reduzir impacto estimado em ${improvement.estimatedImpact ? "90 dias" : "uma rodada"}.`,
      priorityOrder: index,
      actions: [
        {
          id: `${company.id}-${improvement.id}-action-main`,
          title: improvement.nextDecision || improvement.hypothesis,
          owner: improvement.owner,
          deadline: improvement.deadline,
          status: improvement.pdcaStatus === "Padronizar" || improvement.pdcaStatus === "Concluído" ? "Concluída" : "Aberta",
        },
      ],
      evidences: [],
      learnings: [],
    },
    index,
  );
}

function normalizePdcaStatus(status: string): PdcaStatus {
  if (status === "Executar" || status === "Medir" || status === "Aprender" || status === "Padronizar" || status === "Pausar") return status;
  return "Planejar";
}

function getSeedCyclesForCompany(company: Company) {
  if (company.id === BVBP_COMPANY_ID) return bvbpPdcaCycleSeeds.map(normalizeStoredCycle);
  return getImprovementsForCompany(company).map((improvement, index) => cycleFromImprovement(improvement, company, index));
}

export function getPdcaCyclesForCompany(company: Company) {
  const storedCycles = readAllPdcaCycles();
  const seedCycles = portalRuntimeConfig.enableDemoData ? getSeedCyclesForCompany(company) : [];
  const storedIds = new Set(storedCycles.map((cycle) => cycle.id));
  const missingSeeds = seedCycles.filter((cycle) => !storedIds.has(cycle.id));
  const nextCycles = missingSeeds.length ? [...missingSeeds, ...storedCycles] : storedCycles;

  if (missingSeeds.length || nextCycles.some((cycle, index) => cycle !== storedCycles[index])) {
    savePdcaCycles(nextCycles);
    syncCompanyCyclesFromList(company.id, nextCycles);
  }

  return nextCycles
    .filter((cycle) => cycle.companyId === company.id)
    .sort((a, b) => (a.priorityOrder || 0) - (b.priorityOrder || 0));
}

export function upsertPdcaCycle(company: Company, input: PdcaCycleInput) {
  const cycles = readAllPdcaCycles();
  const now = Date.now();
  const existing = input.id ? cycles.find((cycle) => cycle.id === input.id) : undefined;
  const companyCycles = cycles.filter((cycle) => cycle.companyId === company.id);
  const nextCycle = normalizeStoredCycle({
    id: input.id || `${company.id}-cycle-${now}`,
    companyId: company.id,
    title: input.title.trim(),
    affectedPointer: input.affectedPointer.trim(),
    affectedFlow: input.affectedFlow.trim(),
    hypothesis: input.hypothesis.trim(),
    plannedAction: input.plannedAction.trim() || input.nextDecision.trim() || input.hypothesis.trim(),
    whyItMatters: input.whyItMatters.trim(),
    owner: input.owner.trim(),
    deadline: input.deadline.trim(),
    pdcaStatus: input.pdcaStatus,
    estimatedImpact: Number(input.estimatedImpact) || 0,
    nextDecision: input.nextDecision.trim(),
    dataType: input.dataType,
    startDate: input.startDate?.trim() || "2026-06-30",
    endDate: input.deadline.trim() || input.endDate?.trim(),
    baseline: input.baseline?.trim() || "Linha de base a confirmar",
    target: input.target?.trim() || input.nextDecision.trim() || "Objetivo a confirmar",
    pillarId: input.pillarId,
    painLabel: input.painLabel?.trim() || undefined,
    metricId: input.metricId,
    metricNameSnapshot: input.metricNameSnapshot?.trim() || input.affectedPointer.trim() || undefined,
    metricUnit: input.metricUnit,
    metricDirection: input.metricDirection,
    baselineValue: typeof input.baselineValue === "number" ? input.baselineValue : undefined,
    targetValue: typeof input.targetValue === "number" ? input.targetValue : undefined,
    priorityOrder: typeof input.priorityOrder === "number" ? input.priorityOrder : companyCycles.length,
    actions: input.actions || existing?.actions || [],
    evidences: existing?.evidences || [],
    learnings: existing?.learnings || [],
  });
  const nextCycles = existing
    ? cycles.map((cycle) => (cycle.id === nextCycle.id ? nextCycle : cycle))
    : [nextCycle, ...cycles];

  savePdcaCycles(nextCycles);
  syncCompanyCyclesFromList(company.id, nextCycles);
  return nextCycle;
}

export function updatePdcaCycleStatus(cycleId: string, pdcaStatus: PdcaStatus) {
  const cycles = readAllPdcaCycles();
  const nextCycles = cycles.map((cycle) => (cycle.id === cycleId ? { ...cycle, pdcaStatus } : cycle));
  const updatedCycle = nextCycles.find((cycle) => cycle.id === cycleId);

  savePdcaCycles(nextCycles);
  if (updatedCycle) {
    syncCompanyCyclesFromList(updatedCycle.companyId, nextCycles);
  }
  return nextCycles.find((cycle) => cycle.id === cycleId);
}

export function reorderPdcaCycles(companyId: string, orderedIds: string[], statusById: Record<string, PdcaStatus> = {}) {
  const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
  const cycles = readAllPdcaCycles();
  const nextCycles = cycles.map((cycle) => {
    if (cycle.companyId !== companyId || !orderMap.has(cycle.id)) return cycle;

    return {
      ...cycle,
      pdcaStatus: statusById[cycle.id] || cycle.pdcaStatus,
      priorityOrder: orderMap.get(cycle.id) || 0,
    };
  });

  savePdcaCycles(nextCycles);
  syncCompanyCyclesFromList(companyId, nextCycles);
  return nextCycles
    .filter((cycle) => cycle.companyId === companyId)
    .sort((a, b) => (a.priorityOrder || 0) - (b.priorityOrder || 0));
}

export function addPdcaEvidence(cycleId: string, input: EvidenceInput) {
  const cycles = readAllPdcaCycles();
  const evidence: PdcaEvidence = {
    id: `evidence-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    type: input.type,
    description: input.description.trim(),
    observedValue: input.observedValue?.trim() || undefined,
    note: input.note?.trim() || undefined,
  };
  const nextCycles = cycles.map((cycle) =>
    cycle.id === cycleId ? { ...cycle, evidences: [evidence, ...cycle.evidences] } : cycle,
  );
  const updatedCycle = nextCycles.find((cycle) => cycle.id === cycleId);

  savePdcaCycles(nextCycles);
  if (updatedCycle) {
    syncCompanyCyclesFromList(updatedCycle.companyId, nextCycles);
  }
  return evidence;
}

export function upsertPdcaAction(cycleId: string, input: PdcaActionInput) {
  const cycles = readAllPdcaCycles();
  const action: PdcaAction = {
    id: input.id || `action-${Date.now()}`,
    title: input.title.trim(),
    owner: input.owner.trim(),
    deadline: input.deadline.trim(),
    status: input.status,
  };
  const nextCycles = cycles.map((cycle) => {
    if (cycle.id !== cycleId) return cycle;
    const currentActions = normalizeActions(cycle);
    const nextActions = input.id
      ? currentActions.map((item) => (item.id === input.id ? action : item))
      : [action, ...currentActions];

    return { ...cycle, actions: nextActions };
  });
  const updatedCycle = nextCycles.find((cycle) => cycle.id === cycleId);

  savePdcaCycles(nextCycles);
  if (updatedCycle) {
    syncCompanyCyclesFromList(updatedCycle.companyId, nextCycles);
  }
  return action;
}

export function getBvbpPdcaCycles() {
  const bvbpCompany = mockCompanies.find((company) => company.id === BVBP_COMPANY_ID) || mockCompanies[0];
  return getPdcaCyclesForCompany(bvbpCompany);
}

export function upsertBvbpPdcaCycle(input: PdcaCycleInput) {
  const bvbpCompany = mockCompanies.find((company) => company.id === BVBP_COMPANY_ID) || mockCompanies[0];
  return upsertPdcaCycle(bvbpCompany, input);
}

export function updateBvbpPdcaCycleStatus(cycleId: string, pdcaStatus: PdcaStatus) {
  return updatePdcaCycleStatus(cycleId, pdcaStatus);
}

export function addBvbpPdcaEvidence(cycleId: string, input: EvidenceInput) {
  return addPdcaEvidence(cycleId, input);
}

export function buildBvbpWeeklySummary(cycles: PdcaCycle[]) {
  const activeCycle = cycles.find((cycle) => cycle.pdcaStatus === "Executar") || cycles.find((cycle) => cycle.pdcaStatus === "Medir") || cycles[0];
  const latestEvidence = cycles
    .flatMap((cycle) => cycle.evidences.map((evidence) => ({ cycle, evidence })))
    .sort((a, b) => b.evidence.date.localeCompare(a.evidence.date))[0];
  const nextDecision = activeCycle?.nextDecision || "Definir a próxima decisão da iniciativa ativa.";

  return [
    { label: "Próxima decisão", value: nextDecision },
    { label: "Principal oportunidade", value: "Converter pipeline mapeado em diagnósticos com evidência." },
    { label: "Principal risco", value: "Executar ações sem medir aprendizado suficiente para padronizar." },
    { label: "Iniciativa em andamento", value: activeCycle?.title || "Nenhuma iniciativa ativa registrada." },
    { label: "Última evidência", value: latestEvidence?.evidence.description || "Nenhuma evidência registrada." },
  ];
}
