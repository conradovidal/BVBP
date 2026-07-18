import {
  BVBP_COMPANY_ID,
  type Company,
  type EvidenceType,
  type Improvement,
  type InitiativePriority,
  type PdcaAction,
  type PdcaActionStatus,
  type PdcaCycle,
  type PdcaEvidence,
  type PdcaHistoryEntry,
  type PdcaStatus,
  bvbpPdcaCycleSeeds,
  getImprovementsForCompany,
  mockCompanies,
} from "@/data/performanceSystem";
import { syncPdcaCyclesForCompanySoon } from "@/lib/clientPortalSupabase";
import { portalRuntimeConfig } from "@/lib/portalRuntimeConfig";
import { PORTAL_STORAGE_KEYS, isPdcaCycleList, readJsonStorage, writeJsonStorage } from "@/lib/portalStorage";
import { getNextCompanyWorkItemReferenceNumber } from "@/lib/workItemReferences";

export type PdcaCycleInput = Omit<PdcaCycle, "id" | "companyId" | "evidences" | "learnings" | "actions"> & {
  id?: string;
  actions?: PdcaAction[];
};

export interface EvidenceInput {
  description: string;
  type: EvidenceType;
  observedValue?: string;
  note?: string;
  createdByName?: string;
}

export interface PdcaHistoryInput {
  kind: PdcaHistoryEntry["kind"];
  description: string;
  createdByName?: string;
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
  const sourceCycles = storedCycles || [];
  const normalizedCycles = sourceCycles.map(normalizeStoredCycle);
  const nextReferenceByCompany = new Map<string, number>();
  normalizedCycles.forEach((cycle) => {
    const current = nextReferenceByCompany.get(cycle.companyId) || 1;
    if (cycle.referenceNumber) {
      nextReferenceByCompany.set(cycle.companyId, Math.max(current, cycle.referenceNumber + 1));
    }
  });
  normalizedCycles
    .filter((cycle) => !cycle.referenceNumber)
    .sort((a, b) => (a.priorityOrder || 0) - (b.priorityOrder || 0))
    .forEach((cycle) => {
      const next = nextReferenceByCompany.get(cycle.companyId) || 1;
      cycle.referenceNumber = next;
      nextReferenceByCompany.set(cycle.companyId, next + 1);
    });

  if (JSON.stringify(sourceCycles) !== JSON.stringify(normalizedCycles)) {
    savePdcaCycles(normalizedCycles);
    new Set(normalizedCycles.map((cycle) => cycle.companyId)).forEach((companyId) => {
      syncCompanyCyclesFromList(companyId, normalizedCycles);
    });
  }

  return normalizedCycles;
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
      status: cycle.pdcaStatus === "Concluída" ? "Concluída" : cycle.pdcaStatus === "Arquivada" || cycle.pdcaStatus === "Pausada" ? "Bloqueada" : "Aberta",
    },
  ];
}

function normalizeStoredCycle(cycle: PdcaCycle, index = 0): PdcaCycle {
  const affectedPointer = normalizeAffectedPointer(cycle.affectedPointer);
  const firstEvidenceDate = cycle.evidences[0]?.date;
  const pdcaStatus = normalizePdcaStatus(cycle.pdcaStatus);
  const focusType = cycle.focusType || (cycle.metricId ? "metric" : cycle.painLabel ? "pain" : undefined);

  return {
    ...cycle,
    affectedPointer,
    pdcaStatus,
    focusType,
    maturityTargetLevel: focusType === "maturity" ? cycle.maturityTargetLevel : undefined,
    painLabel: focusType === "pain" ? cycle.painLabel : undefined,
    metricId: focusType === "metric" ? cycle.metricId : undefined,
    metricNameSnapshot: focusType === "metric" ? cycle.metricNameSnapshot : undefined,
    metricUnit: focusType === "metric" ? cycle.metricUnit : undefined,
    metricDirection: focusType === "metric" ? cycle.metricDirection : undefined,
    metricSourceSnapshot: focusType === "metric" ? cycle.metricSourceSnapshot : undefined,
    metricValueOrigin: focusType === "metric"
      ? cycle.metricValueOrigin || (cycle.dataType === "Estimado" ? "estimated" : cycle.dataType === "Real" ? "informed" : undefined)
      : undefined,
    baselineValue: focusType === "metric" ? cycle.baselineValue : undefined,
    targetValue: focusType === "metric" ? cycle.targetValue : undefined,
    startDate: cycle.startDate || firstEvidenceDate,
    endDate: cycle.endDate || cycle.deadline,
    baseline: focusType === "metric" ? cycle.baseline || "" : "",
    target: focusType === "metric" ? cycle.target || "" : "",
    teamMembers: normalizeTeamMembers(cycle.teamMembers || []),
    priority: normalizeInitiativePriority(cycle.priority),
    priorityOrder: typeof cycle.priorityOrder === "number" ? cycle.priorityOrder : index,
    actions: normalizeActions({ ...cycle, affectedPointer, pdcaStatus }),
    history: Array.isArray(cycle.history) ? cycle.history : [],
  };
}

function normalizeInitiativePriority(priority: InitiativePriority | undefined) {
  return priority === "Alta" || priority === "Média" || priority === "Baixa" ? priority : undefined;
}

function normalizeTeamMembers(members: string[]) {
  const seen = new Set<string>();
  return members
    .map((member) => member.trim().replace(/\s+/g, " "))
    .filter((member) => {
      const key = member.toLocaleLowerCase("pt-BR");
      if (!member || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
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
  if (status === "Em refinamento" || status === "Em desenvolvimento" || status === "Em validação" || status === "Pausada" || status === "Concluída" || status === "Descartada" || status === "Arquivada") return status;
  if (status === "Executar" || status === "Em andamento") return "Em desenvolvimento";
  if (status === "Medir" || status === "Aprender" || status === "Aguardando") return "Em validação";
  if (status === "Padronizar" || status === "Concluído") return "Concluída";
  if (status === "Pausar" || status === "Pausado") return "Pausada";
  return "Em refinamento";
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

export function upsertPdcaCycle(company: Company, input: PdcaCycleInput, createdByName?: string) {
  const cycles = readAllPdcaCycles();
  const now = Date.now();
  const existing = input.id ? cycles.find((cycle) => cycle.id === input.id) : undefined;
  const companyCycles = cycles.filter((cycle) => cycle.companyId === company.id);
  let history = existing?.history || [{
    id: `history-created-${now}`,
    createdAt: new Date(now).toISOString(),
    kind: "created" as const,
    description: "Iniciativa criada.",
  }];
  if (existing && existing.pdcaStatus !== input.pdcaStatus) {
    history = prependHistory(history, { kind: "status", description: `Status alterado de ${existing.pdcaStatus} para ${input.pdcaStatus}.`, createdByName });
  }
  if (existing && existing.priority !== input.priority) {
    history = prependHistory(history, { kind: "priority", description: `Prioridade alterada de ${existing.priority || "A definir"} para ${input.priority || "A definir"}.`, createdByName });
  }
  if (existing && (existing.deadline || "") !== input.deadline.trim()) {
    history = prependHistory(history, { kind: "deadline", description: `Prazo alterado de ${existing.deadline || "Sem data"} para ${input.deadline.trim() || "Sem data"}.`, createdByName });
  }
  if (existing && existing.owner !== input.owner.trim()) {
    history = prependHistory(history, { kind: "owner", description: `Responsável alterado de ${existing.owner || "A definir"} para ${input.owner.trim() || "A definir"}.`, createdByName });
  }
  const focusType = input.focusType || (input.metricId ? "metric" : input.painLabel ? "pain" : undefined);
  const nextFocusLabel = focusType === "metric"
    ? input.metricNameSnapshot || input.affectedPointer || "Ponteiro a definir"
    : focusType === "pain"
      ? input.painLabel || "Dor a definir"
      : focusType === "maturity"
        ? `Maturidade ${input.maturityTargetLevel || "a definir"}/5`
        : "Vínculo a revisar";
  const previousFocusLabel = existing?.focusType === "metric" || (!existing?.focusType && existing?.metricId)
    ? existing.metricNameSnapshot || existing.affectedPointer
    : existing?.focusType === "pain" || (!existing?.focusType && existing?.painLabel)
      ? existing.painLabel
      : existing?.focusType === "maturity"
        ? `Maturidade ${existing.maturityTargetLevel || "a definir"}/5`
        : "Vínculo a revisar";
  if (existing && (
    (existing.focusType || (existing.metricId ? "metric" : existing.painLabel ? "pain" : undefined)) !== focusType ||
    previousFocusLabel !== nextFocusLabel
  )) {
    history = prependHistory(history, { kind: "focus", description: `Foco alterado de ${previousFocusLabel || "Vínculo a revisar"} para ${nextFocusLabel}.`, createdByName });
  }
  if (existing && existing.title !== input.title.trim()) {
    history = prependHistory(history, { kind: "content", description: "Título da iniciativa atualizado.", createdByName });
  }
  if (existing && existing.hypothesis !== input.hypothesis.trim()) {
    history = prependHistory(history, { kind: "content", description: "Hipótese da iniciativa atualizada.", createdByName });
  }
  if (existing && existing.whyItMatters !== input.whyItMatters.trim()) {
    history = prependHistory(history, { kind: "content", description: "Relevância da iniciativa atualizada.", createdByName });
  }
  if (existing && JSON.stringify(existing.teamMembers || []) !== JSON.stringify(normalizeTeamMembers(input.teamMembers || []))) {
    history = prependHistory(history, { kind: "team", description: "Equipe da iniciativa atualizada.", createdByName });
  }
  if (existing && (existing.startDate || "") !== (input.startDate?.trim() || "")) {
    history = prependHistory(history, { kind: "start_date", description: `Início alterado de ${existing.startDate || "Sem data"} para ${input.startDate?.trim() || "Sem data"}.`, createdByName });
  }
  const isMetricFocus = focusType === "metric";
  const isPainFocus = focusType === "pain";
  const nextCycle = normalizeStoredCycle({
    id: input.id || `${company.id}-cycle-${now}`,
    companyId: company.id,
    referenceNumber: existing?.referenceNumber || getNextCompanyWorkItemReferenceNumber(company.id),
    title: input.title.trim(),
    affectedPointer: isMetricFocus
      ? input.affectedPointer.trim()
      : isPainFocus
        ? input.painLabel?.trim() || ""
        : focusType === "maturity"
          ? `Maturidade ${input.maturityTargetLevel || ""}/5`
          : input.affectedPointer.trim(),
    affectedFlow: input.affectedFlow?.trim() || undefined,
    hypothesis: input.hypothesis.trim(),
    plannedAction: input.plannedAction.trim() || input.nextDecision.trim() || input.hypothesis.trim(),
    whyItMatters: input.whyItMatters.trim(),
    owner: input.owner.trim(),
    deadline: input.deadline.trim(),
    pdcaStatus: input.pdcaStatus,
    estimatedImpact: Number(input.estimatedImpact) || 0,
    nextDecision: input.nextDecision.trim(),
    dataType: input.dataType,
    startDate: input.startDate?.trim() || undefined,
    endDate: input.deadline.trim() || input.endDate?.trim(),
    baseline: input.baseline?.trim() || "",
    target: input.target?.trim() || "",
    pillarId: input.pillarId,
    focusType,
    maturityTargetLevel: focusType === "maturity" ? input.maturityTargetLevel : undefined,
    painLabel: isPainFocus ? input.painLabel?.trim() || undefined : undefined,
    metricId: isMetricFocus ? input.metricId : undefined,
    metricNameSnapshot: isMetricFocus ? input.metricNameSnapshot?.trim() || input.affectedPointer.trim() || undefined : undefined,
    metricUnit: isMetricFocus ? input.metricUnit : undefined,
    metricDirection: isMetricFocus ? input.metricDirection : undefined,
    metricSourceSnapshot: isMetricFocus ? input.metricSourceSnapshot?.trim() || undefined : undefined,
    metricValueOrigin: isMetricFocus ? input.metricValueOrigin : undefined,
    baselineValue: isMetricFocus && typeof input.baselineValue === "number" ? input.baselineValue : undefined,
    targetValue: isMetricFocus && typeof input.targetValue === "number" ? input.targetValue : undefined,
    teamMembers: normalizeTeamMembers(input.teamMembers || []),
    priority: normalizeInitiativePriority(input.priority),
    priorityOrder: typeof input.priorityOrder === "number" ? input.priorityOrder : companyCycles.length,
    actions: input.actions || existing?.actions || [],
    evidences: existing?.evidences || [],
    learnings: existing?.learnings || [],
    history,
  });
  const nextCycles = existing
    ? cycles.map((cycle) => (cycle.id === nextCycle.id ? nextCycle : cycle))
    : [nextCycle, ...cycles];

  savePdcaCycles(nextCycles);
  syncCompanyCyclesFromList(company.id, nextCycles);
  return nextCycle;
}

export function updatePdcaCycleFields(
  company: Company,
  cycleId: string,
  patch: Partial<PdcaCycleInput>,
  createdByName?: string,
) {
  const existing = getPdcaCyclesForCompany(company).find((cycle) => cycle.id === cycleId);
  if (!existing) return undefined;
  return upsertPdcaCycle(company, { ...existing, ...patch, id: cycleId }, createdByName);
}

export function updatePdcaCycleStatus(cycleId: string, pdcaStatus: PdcaStatus, createdByName?: string) {
  const cycles = readAllPdcaCycles();
  const nextCycles = cycles.map((cycle) => {
    if (cycle.id !== cycleId || cycle.pdcaStatus === pdcaStatus) return cycle;
    return {
      ...cycle,
      pdcaStatus,
      history: prependHistory(cycle.history, {
        kind: "status",
        description: `Status alterado de ${cycle.pdcaStatus} para ${pdcaStatus}.`,
        createdByName,
      }),
    };
  });
  const updatedCycle = nextCycles.find((cycle) => cycle.id === cycleId);

  savePdcaCycles(nextCycles);
  if (updatedCycle) {
    syncCompanyCyclesFromList(updatedCycle.companyId, nextCycles);
  }
  return nextCycles.find((cycle) => cycle.id === cycleId);
}

export function updatePdcaCyclePriority(cycleId: string, priority: InitiativePriority, createdByName?: string) {
  const cycles = readAllPdcaCycles();
  const nextCycles = cycles.map((cycle) => {
    if (cycle.id !== cycleId || cycle.priority === priority) return cycle;
    return {
      ...cycle,
      priority,
      history: prependHistory(cycle.history, {
        kind: "priority",
        description: `Prioridade alterada de ${cycle.priority || "A definir"} para ${priority}.`,
        createdByName,
      }),
    };
  });
  const updatedCycle = nextCycles.find((cycle) => cycle.id === cycleId);

  savePdcaCycles(nextCycles);
  if (updatedCycle) syncCompanyCyclesFromList(updatedCycle.companyId, nextCycles);
  return updatedCycle;
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
    createdByName: input.createdByName?.trim() || undefined,
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

function prependHistory(history: PdcaHistoryEntry[] | undefined, input: PdcaHistoryInput): PdcaHistoryEntry[] {
  const now = new Date().toISOString();
  return [{
    id: `history-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now,
    kind: input.kind,
    description: input.description.trim(),
    createdByName: input.createdByName?.trim() || undefined,
  }, ...(history || [])];
}

export function addPdcaHistory(cycleId: string, input: PdcaHistoryInput) {
  const cycles = readAllPdcaCycles();
  const nextCycles = cycles.map((cycle) => cycle.id === cycleId
    ? { ...cycle, history: prependHistory(cycle.history, input) }
    : cycle);
  const updatedCycle = nextCycles.find((cycle) => cycle.id === cycleId);

  savePdcaCycles(nextCycles);
  if (updatedCycle) syncCompanyCyclesFromList(updatedCycle.companyId, nextCycles);
  return updatedCycle;
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
  const activeCycle = cycles.find((cycle) => cycle.pdcaStatus === "Em desenvolvimento") || cycles.find((cycle) => cycle.pdcaStatus === "Em validação") || cycles[0];
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
