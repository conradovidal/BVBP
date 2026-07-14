import {
  BVBP_COMPANY_ID,
  type ClientConfiguration,
  type Company,
  bvbpPdcaCycleSeeds,
  createDefaultClientConfiguration,
  mockCompanies,
  type PdcaCycle,
} from "@/data/performanceSystem";
import { portalRuntimeConfig } from "@/lib/portalRuntimeConfig";

export const PORTAL_STORAGE_KEYS = {
  clients: "bvbp-portal-clients",
  activeCompany: "bvbp-active-company",
  pdcaCycles: "bvbp-pdca-cycles",
  initiativeActivities: "bvbp-initiative-activities",
  clientConfigurations: "bvbp-client-configurations",
  performanceSession: "bvbp-performance-session",
  cacheVersion: "bvbp-portal-cache-version",
} as const;

const CURRENT_PORTAL_CACHE_VERSION = "2026-07-production-clean-start-v1";

const workspaceStorageKeys = [
  PORTAL_STORAGE_KEYS.clients,
  PORTAL_STORAGE_KEYS.activeCompany,
  PORTAL_STORAGE_KEYS.pdcaCycles,
  PORTAL_STORAGE_KEYS.initiativeActivities,
  PORTAL_STORAGE_KEYS.clientConfigurations,
] as const;

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

export function clearPortalWorkspaceData() {
  workspaceStorageKeys.forEach((key) => window.localStorage.removeItem(key));
}

export function clearPortalLocalState() {
  clearPortalWorkspaceData();
  window.localStorage.removeItem(PORTAL_STORAGE_KEYS.performanceSession);
}

export function initializePortalLocalState() {
  const storedVersion = window.localStorage.getItem(PORTAL_STORAGE_KEYS.cacheVersion);

  if (storedVersion === CURRENT_PORTAL_CACHE_VERSION) {
    return false;
  }

  clearPortalLocalState();
  window.localStorage.setItem(PORTAL_STORAGE_KEYS.cacheVersion, CURRENT_PORTAL_CACHE_VERSION);
  return true;
}

export function isCompanyList(value: unknown): value is Company[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== "object") return false;
    const company = item as Partial<Company>;

    const hasValidContacts = company.contacts === undefined || (
      Array.isArray(company.contacts) &&
      company.contacts.every((contact) => (
        !!contact &&
        typeof contact.id === "string" &&
        typeof contact.name === "string" &&
        typeof contact.email === "string" &&
        typeof contact.isPrimary === "boolean" &&
        typeof contact.accessStatus === "string"
      ))
    );

    return (
      typeof company.id === "string" &&
      typeof company.name === "string" &&
      typeof company.segment === "string" &&
      typeof company.employees === "number" &&
      typeof company.monthlyRevenue === "number" &&
      typeof company.recurringRevenue === "number" &&
      typeof company.monthlyOperationalCost === "number" &&
      hasValidContacts
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

    const hasValidPillars = Array.isArray(config.pillars) && config.pillars.every((pillar) => {
      if (!pillar || typeof pillar !== "object") return false;
      const storedPillar = pillar as Partial<ClientConfiguration["pillars"][number]> & {
        maturityLevel?: unknown;
        currentLevelName?: unknown;
        nextLevel?: unknown;
        advancementCriteria?: unknown;
      };
      const hasV2Maturity = Array.isArray(storedPillar.completedMaturityCriterionIds);
      const hasLegacyMaturity = (
        typeof storedPillar.maturityLevel === "number" &&
        typeof storedPillar.currentLevelName === "string" &&
        typeof storedPillar.nextLevel === "number" &&
        typeof storedPillar.advancementCriteria === "string"
      );

      return (
        typeof storedPillar.pillar === "string" &&
        (hasV2Maturity || hasLegacyMaturity) &&
        Array.isArray(storedPillar.selectedMetricIds) &&
        Array.isArray(storedPillar.pains) &&
        typeof storedPillar.notes === "string"
      );
    });
    const hasValidMetrics = Array.isArray(config.metrics) && config.metrics.every((metric) => (
      !!metric &&
      typeof metric.id === "string" &&
      typeof metric.name === "string" &&
      typeof metric.pillar === "string" &&
      typeof metric.description === "string" &&
      typeof metric.unit === "string" &&
      (
        typeof metric.formula === "string" ||
        typeof (metric as { dataType?: unknown }).dataType === "string"
      ) &&
      typeof metric.custom === "boolean"
    ));

    const hasValidSchema = config.schemaVersion === undefined || config.schemaVersion === 2;

    return hasValidSchema && typeof config.companyId === "string" && hasValidPillars && hasValidMetrics;
  });
}

export function resetPortalDemoData() {
  if (!portalRuntimeConfig.enableDemoData) {
    return false;
  }

  writeJsonStorage(PORTAL_STORAGE_KEYS.clients, mockCompanies);
  writeJsonStorage(
    PORTAL_STORAGE_KEYS.clientConfigurations,
    mockCompanies.map((company) => createDefaultClientConfiguration(company)),
  );
  writeJsonStorage(PORTAL_STORAGE_KEYS.pdcaCycles, bvbpPdcaCycleSeeds);
  writeJsonStorage(PORTAL_STORAGE_KEYS.initiativeActivities, []);
  window.localStorage.setItem(PORTAL_STORAGE_KEYS.activeCompany, BVBP_COMPANY_ID);

  return true;
}
