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
        (contact.title === undefined || typeof contact.title === "string") &&
        (contact.accessLevel === undefined || contact.accessLevel === "collaborator" || contact.accessLevel === "viewer") &&
        typeof contact.isPrimary === "boolean" &&
        typeof contact.accessStatus === "string"
      ))
    );
    const hasValidRelationshipEvents = company.relationshipEvents === undefined || (
      Array.isArray(company.relationshipEvents) &&
      company.relationshipEvents.every((event) => (
        !!event &&
        typeof event.id === "string" &&
        typeof event.type === "string" &&
        typeof event.occurredAt === "string" &&
        typeof event.createdAt === "string" &&
        typeof event.createdBy === "string" &&
        (event.createdByUserId === undefined || typeof event.createdByUserId === "string") &&
        (event.createdByName === undefined || typeof event.createdByName === "string") &&
        typeof event.notes === "string"
      ))
    );

    return (
      typeof company.id === "string" &&
      (company.referenceCode === undefined || typeof company.referenceCode === "string") &&
      typeof company.name === "string" &&
      typeof company.segment === "string" &&
      typeof company.employees === "number" &&
      typeof company.monthlyRevenue === "number" &&
      typeof company.recurringRevenue === "number" &&
      typeof company.monthlyOperationalCost === "number" &&
      (company.budgetMethod === undefined || company.budgetMethod === "defined" || company.budgetMethod === "revenue_percentage") &&
      (company.revenueRangeId === undefined || ["up_to_100k", "100k_300k", "300k_500k", "500k_1m", "1m_3m", "over_3m", "not_informed"].includes(company.revenueRangeId)) &&
      (company.budgetRangeId === undefined || ["up_to_5k", "5k_10k", "10k_20k", "20k_40k", "40k_80k", "over_80k", "undefined"].includes(company.budgetRangeId)) &&
      (company.budgetAmount === undefined || typeof company.budgetAmount === "number") &&
      (company.budgetPercentage === undefined || typeof company.budgetPercentage === "number") &&
      hasValidContacts &&
      hasValidRelationshipEvents
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
    const hasValidHistory = cycle.history === undefined || (Array.isArray(cycle.history) && cycle.history.every((entry) => (
      !!entry &&
      typeof entry.id === "string" &&
      typeof entry.createdAt === "string" &&
      typeof entry.kind === "string" &&
      typeof entry.description === "string"
    )));

    return (
      typeof cycle.id === "string" &&
      typeof cycle.companyId === "string" &&
      (cycle.referenceNumber === undefined || typeof cycle.referenceNumber === "number") &&
      typeof cycle.title === "string" &&
      typeof cycle.affectedPointer === "string" &&
      typeof cycle.pdcaStatus === "string" &&
      (cycle.pillarId === undefined || ["financial", "commercial", "operation", "technology"].includes(cycle.pillarId)) &&
      (cycle.painLabel === undefined || typeof cycle.painLabel === "string") &&
      (cycle.metricId === undefined || typeof cycle.metricId === "string") &&
      (cycle.metricNameSnapshot === undefined || typeof cycle.metricNameSnapshot === "string") &&
      (cycle.metricUnit === undefined || typeof cycle.metricUnit === "string") &&
      (cycle.metricDirection === undefined || ["higher", "lower", "target"].includes(cycle.metricDirection)) &&
      (cycle.metricSourceSnapshot === undefined || typeof cycle.metricSourceSnapshot === "string") &&
      (cycle.metricValueOrigin === undefined || ["informed", "estimated"].includes(cycle.metricValueOrigin)) &&
      (cycle.baselineValue === undefined || typeof cycle.baselineValue === "number") &&
      (cycle.targetValue === undefined || typeof cycle.targetValue === "number") &&
      (cycle.teamMembers === undefined || (Array.isArray(cycle.teamMembers) && cycle.teamMembers.every((member) => typeof member === "string"))) &&
      (cycle.priority === undefined || ["Alta", "Média", "Baixa"].includes(cycle.priority)) &&
      hasValidEvidence &&
      hasValidLearnings &&
      hasValidHistory
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
        (storedPillar.criticalMetricId === undefined || typeof storedPillar.criticalMetricId === "string") &&
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
      (metric.valueOrigin === undefined || ["informed", "estimated"].includes(metric.valueOrigin)) &&
      (
        typeof metric.formula === "string" ||
        typeof (metric as { dataType?: unknown }).dataType === "string"
      ) &&
      typeof metric.custom === "boolean"
    ));

    const schemaVersion = (config as { schemaVersion?: number }).schemaVersion;
    const hasValidSchema = schemaVersion === undefined || schemaVersion === 2 || schemaVersion === 3;

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
