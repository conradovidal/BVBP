import type { ClientMetricUnit, PdcaCycle } from "@/data/performanceSystem";

export function parseMetricNumber(value: string | number | undefined) {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (!value?.trim()) return undefined;
  const normalized = value.trim().replace(/\s/g, "").replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", ".");
  const parsed = Number(normalized.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function getLatestObservedValue(cycle: PdcaCycle) {
  for (const evidence of cycle.evidences) {
    const value = parseMetricNumber(evidence.observedValue);
    if (value !== undefined) return value;
  }
  return undefined;
}

export function calculateInitiativeProgress(cycle: PdcaCycle, currentValue?: number) {
  const baseline = cycle.baselineValue ?? parseMetricNumber(cycle.baseline);
  const target = cycle.targetValue ?? parseMetricNumber(cycle.target);
  if (baseline === undefined || target === undefined || currentValue === undefined || baseline === target) return undefined;

  let progress: number;
  if (cycle.metricDirection === "lower") progress = (baseline - currentValue) / (baseline - target);
  else if (cycle.metricDirection === "target") progress = 1 - Math.abs(currentValue - target) / Math.abs(baseline - target);
  else progress = (currentValue - baseline) / (target - baseline);

  return Math.round(Math.min(1, Math.max(0, progress)) * 100);
}

export function formatMetricValue(value: number, unit: ClientMetricUnit | undefined) {
  if (unit === "currency") return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 }).format(value);
  if (unit === "percentage") return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(value)}%`;
  const suffix = unit === "hours" ? " h" : unit === "days" ? " dias" : "";
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(value)}${suffix}`;
}

export function getInitiativeImpactLabel(cycle: PdcaCycle, currentValue?: number) {
  const progress = calculateInitiativeProgress(cycle, currentValue);
  if (currentValue === undefined || progress === undefined) return "Progresso ainda não mensurado";
  return `Atual ${formatMetricValue(currentValue, cycle.metricUnit)} · ${progress}% do caminho`;
}
