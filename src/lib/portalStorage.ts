import {
  BVBP_COMPANY_ID,
  type ClientConfiguration,
  type Company,
  bvbpPdcaCycleSeeds,
  createDefaultClientConfiguration,
  mockCompanies,
  type PdcaCycle,
} from "@/data/performanceSystem";

export const PORTAL_STORAGE_KEYS = {
  clients: "bvbp-portal-clients",
  activeCompany: "bvbp-active-company",
  pdcaCycles: "bvbp-pdca-cycles",
  initiativeActivities: "bvbp-initiative-activities",
  clientConfigurations: "bvbp-client-configurations",
} as const;

export interface StorageParseResult<T> {
  data: T | null;
  repaired: boolean;
}

export function readJsonStorage<T>(key: string, isValid: (value: unknown) => value is T): StorageParseResult<T> {
  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return { data: null, repaired: false };
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (isValid(parsed)) {
      return { data: parsed, repaired: false };
    }
  } catch {
    // Invalid JSON is handled by re-seeding callers.
  }

  window.localStorage.removeItem(key);
  return { data: null, repaired: true };
}

export function writeJsonStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function isCompanyList(value: unknown): value is Company[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== "object") return false;
    const company = item as Partial<Company>;

    return (
      typeof company.id === "string" &&
      typeof company.name === "string" &&
      typeof company.segment === "string" &&
      typeof company.employees === "number" &&
      typeof company.monthlyRevenue === "number" &&
      typeof company.recurringRevenue === "number" &&
      typeof company.monthlyOperationalCost === "number"
    );
  });
}

export function isPdcaCycleList(value: unknown): value is PdcaCycle[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== "object") return false;
    const cycle = item as Partial<PdcaCycle>;
    const hasValidEvidence = Array.isArray(cycle.evidences) && cycle.evidences.every((evidence) => (
      !!evidence &&
      typeof evidence.id === "string" &&
      typeof evidence.date === "string" &&
      typeof evidence.type === "string" &&
      typeof evidence.description === "string"
    ));
    const hasValidLearnings = Array.isArray(cycle.learnings) && cycle.learnings.every((learning) => (
      !!learning &&
      typeof learning.id === "string" &&
      typeof learning.date === "string" &&
      typeof learning.description === "string"
    ));

    return (
      typeof cycle.id === "string" &&
      typeof cycle.companyId === "string" &&
      typeof cycle.title === "string" &&
      typeof cycle.affectedPointer === "string" &&
      typeof cycle.pdcaStatus === "string" &&
      hasValidEvidence &&
      hasValidLearnings
    );
  });
}

export function isClientConfigurationList(value: unknown): value is ClientConfiguration[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== "object") return false;
    const config = item as Partial<ClientConfiguration>;

    const hasValidPillars = Array.isArray(config.pillars) && config.pillars.every((pillar) => (
      !!pillar &&
      typeof pillar.pillar === "string" &&
      typeof pillar.maturityLevel === "number" &&
      typeof pillar.currentLevelName === "string" &&
      typeof pillar.nextLevel === "number" &&
      typeof pillar.advancementCriteria === "string" &&
      Array.isArray(pillar.selectedMetricIds) &&
      Array.isArray(pillar.pains) &&
      typeof pillar.notes === "string"
    ));
    const hasValidMetrics = Array.isArray(config.metrics) && config.metrics.every((metric) => (
      !!metric &&
      typeof metric.id === "string" &&
      typeof metric.name === "string" &&
      typeof metric.pillar === "string" &&
      typeof metric.description === "string" &&
      typeof metric.unit === "string" &&
      typeof metric.dataType === "string" &&
      typeof metric.custom === "boolean"
    ));

    return typeof config.companyId === "string" && hasValidPillars && hasValidMetrics;
  });
}

export function resetPortalDemoData() {
  writeJsonStorage(PORTAL_STORAGE_KEYS.clients, mockCompanies);
  writeJsonStorage(PORTAL_STORAGE_KEYS.clientConfigurations, mockCompanies.map(createDefaultClientConfiguration));
  writeJsonStorage(PORTAL_STORAGE_KEYS.pdcaCycles, bvbpPdcaCycleSeeds);
  writeJsonStorage(PORTAL_STORAGE_KEYS.initiativeActivities, []);
  window.localStorage.setItem(PORTAL_STORAGE_KEYS.activeCompany, BVBP_COMPANY_ID);
}
