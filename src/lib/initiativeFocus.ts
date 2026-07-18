import {
  bvbpPillarLabels,
  getPillarMaturityState,
  type ClientConfiguration,
  type InitiativeFocusType,
  type MaturityLevel,
  type PdcaCycle,
} from "@/data/performanceSystem";

export function inferInitiativeFocusType(initiative: Pick<PdcaCycle, "focusType" | "metricId" | "painLabel">): InitiativeFocusType | undefined {
  return initiative.focusType || (initiative.metricId ? "metric" : initiative.painLabel ? "pain" : undefined);
}

export function getNextMaturityTarget(configuration: ClientConfiguration, pillarId: PdcaCycle["pillarId"]): MaturityLevel | undefined {
  if (!pillarId) return undefined;
  const pillar = configuration.pillars.find((item) => item.pillar === pillarId);
  if (!pillar) return undefined;
  const maturity = getPillarMaturityState(pillarId, pillar.completedMaturityCriterionIds);
  return maturity.next?.level;
}

export function getInitiativeFocusLabel(initiative: Pick<PdcaCycle, "focusType" | "metricId" | "metricNameSnapshot" | "affectedPointer" | "painLabel" | "maturityTargetLevel" | "pillarId">) {
  const focusType = inferInitiativeFocusType(initiative);
  if (focusType === "metric") return `Ponteiro: ${initiative.metricNameSnapshot || initiative.affectedPointer || "A definir"}`;
  if (focusType === "pain") return `Dor: ${initiative.painLabel || "A definir"}`;
  if (focusType === "maturity") return `Maturidade: nível ${initiative.maturityTargetLevel || "—"}/5`;
  return initiative.pillarId ? `${bvbpPillarLabels[initiative.pillarId]}: vínculo a revisar` : "Vínculo a revisar";
}
