import { type EvidenceType, type PdcaCycle, type PdcaEvidence, type PdcaStatus, bvbpPdcaCycleSeeds } from "@/data/performanceSystem";
import { PORTAL_STORAGE_KEYS, isPdcaCycleList, readJsonStorage, writeJsonStorage } from "@/lib/portalStorage";

export type PdcaCycleInput = Omit<PdcaCycle, "id" | "companyId" | "evidences" | "learnings"> & {
  id?: string;
};

export interface EvidenceInput {
  description: string;
  type: EvidenceType;
  observedValue?: string;
  note?: string;
}

function savePdcaCycles(cycles: PdcaCycle[]) {
  writeJsonStorage(PORTAL_STORAGE_KEYS.pdcaCycles, cycles);
}

function normalizeAffectedPointer(pointer: string) {
  if (["Pipeline comercial", "Funil comercial", "Funil", "Cadência comercial"].includes(pointer)) return "Comercial";
  if (["Dinheiro", "Clareza financeira"].includes(pointer)) return "Finanças";
  if (pointer === "Eficiência operacional") return "Operação";
  if (["Tecnologia e IA", "Automações", "Automação aplicada"].includes(pointer)) return "Tecnologia";
  return pointer;
}

function normalizeStoredCycle(cycle: PdcaCycle) {
  const affectedPointer = normalizeAffectedPointer(cycle.affectedPointer);

  return affectedPointer === cycle.affectedPointer ? cycle : { ...cycle, affectedPointer };
}

export function getBvbpPdcaCycles() {
  const { data: storedCycles } = readJsonStorage(PORTAL_STORAGE_KEYS.pdcaCycles, isPdcaCycleList);

  if (storedCycles?.length) {
    const normalizedStoredCycles = storedCycles.map(normalizeStoredCycle);
    const hasNormalizedPointers = normalizedStoredCycles.some(
      (cycle, index) => cycle.affectedPointer !== storedCycles[index].affectedPointer,
    );
    const storedIds = new Set(normalizedStoredCycles.map((cycle) => cycle.id));
    const missingSeeds = bvbpPdcaCycleSeeds.filter((cycle) => !storedIds.has(cycle.id));

    if (missingSeeds.length || hasNormalizedPointers) {
      const mergedCycles = [...missingSeeds, ...normalizedStoredCycles];
      savePdcaCycles(mergedCycles);
      return mergedCycles;
    }

    return normalizedStoredCycles;
  }

  savePdcaCycles(bvbpPdcaCycleSeeds);
  return bvbpPdcaCycleSeeds;
}

export function upsertBvbpPdcaCycle(input: PdcaCycleInput) {
  const cycles = getBvbpPdcaCycles();
  const now = Date.now();
  const existing = input.id ? cycles.find((cycle) => cycle.id === input.id) : undefined;
  const nextCycle: PdcaCycle = {
    id: input.id || `bvbp-cycle-${now}`,
    companyId: existing?.companyId || bvbpPdcaCycleSeeds[0].companyId,
    title: input.title.trim(),
    affectedPointer: input.affectedPointer.trim(),
    affectedFlow: input.affectedFlow.trim(),
    hypothesis: input.hypothesis.trim(),
    plannedAction: input.plannedAction.trim(),
    whyItMatters: input.whyItMatters.trim(),
    owner: input.owner.trim(),
    deadline: input.deadline.trim(),
    pdcaStatus: input.pdcaStatus,
    estimatedImpact: Number(input.estimatedImpact) || 0,
    nextDecision: input.nextDecision.trim(),
    dataType: input.dataType,
    evidences: existing?.evidences || [],
    learnings: existing?.learnings || [],
  };
  const nextCycles = existing
    ? cycles.map((cycle) => (cycle.id === nextCycle.id ? nextCycle : cycle))
    : [nextCycle, ...cycles];

  savePdcaCycles(nextCycles);
  return nextCycle;
}

export function updateBvbpPdcaCycleStatus(cycleId: string, pdcaStatus: PdcaStatus) {
  const cycles = getBvbpPdcaCycles();
  const nextCycles = cycles.map((cycle) => (cycle.id === cycleId ? { ...cycle, pdcaStatus } : cycle));

  savePdcaCycles(nextCycles);
  return nextCycles.find((cycle) => cycle.id === cycleId);
}

export function addBvbpPdcaEvidence(cycleId: string, input: EvidenceInput) {
  const cycles = getBvbpPdcaCycles();
  const evidence: PdcaEvidence = {
    id: `evidence-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    type: input.type,
    description: input.description.trim(),
    observedValue: input.observedValue?.trim() || undefined,
    note: input.note?.trim() || undefined,
  };
  const nextCycles = cycles.map((cycle) =>
    cycle.id === cycleId ? { ...cycle, evidences: [evidence, ...cycle.evidences] } : cycle
  );

  savePdcaCycles(nextCycles);
  return evidence;
}

export function buildBvbpWeeklySummary(cycles: PdcaCycle[]) {
  const activeCycle = cycles.find((cycle) => cycle.pdcaStatus === "Executar") || cycles.find((cycle) => cycle.pdcaStatus === "Medir") || cycles[0];
  const latestEvidence = cycles
    .flatMap((cycle) => cycle.evidences.map((evidence) => ({ cycle, evidence })))
    .sort((a, b) => b.evidence.date.localeCompare(a.evidence.date))[0];
  const nextDecision = activeCycle?.nextDecision || "Definir a próxima decisão do ciclo ativo.";

  return [
    { label: "Próxima decisão", value: nextDecision },
    { label: "Principal oportunidade", value: "Converter pipeline mapeado em diagnósticos com evidência." },
    { label: "Principal risco", value: "Executar ações sem medir aprendizado suficiente para padronizar." },
    { label: "Ciclo em andamento", value: activeCycle?.title || "Nenhum ciclo ativo registrado." },
    { label: "Última evidência", value: latestEvidence?.evidence.description || "Nenhuma evidência registrada." },
  ];
}
