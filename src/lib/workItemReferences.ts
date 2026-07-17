import type { Company, PdcaCycle } from "@/data/performanceSystem";
import { deriveCompanyReferenceCode, normalizeCompanyReferenceCode } from "@/lib/clientPortalStore";
import { PORTAL_STORAGE_KEYS, readJsonStorage } from "@/lib/portalStorage";

interface ReferencedActivity {
  initiativeId: string;
  referenceNumber?: number;
}

const isLooseCycleList = (value: unknown): value is PdcaCycle[] => Array.isArray(value);
const isLooseActivityList = (value: unknown): value is ReferencedActivity[] => Array.isArray(value);

export function getCompanyReferenceCode(company: Pick<Company, "name" | "referenceCode">) {
  return (company.referenceCode
    ? normalizeCompanyReferenceCode(company.referenceCode)
    : deriveCompanyReferenceCode(company.name)) || "ITEM";
}

export function formatWorkItemReference(company: Pick<Company, "name" | "referenceCode">, referenceNumber?: number) {
  if (!referenceNumber) return getCompanyReferenceCode(company);
  return `${getCompanyReferenceCode(company)}-${referenceNumber}`;
}

export function getNextCompanyWorkItemReferenceNumber(companyId: string) {
  const { data: cycles = [] } = readJsonStorage(PORTAL_STORAGE_KEYS.pdcaCycles, isLooseCycleList);
  const { data: activities = [] } = readJsonStorage(PORTAL_STORAGE_KEYS.initiativeActivities, isLooseActivityList);
  const companyCycles = cycles.filter((cycle) => cycle.companyId === companyId);
  const initiativeIds = new Set(companyCycles.map((cycle) => cycle.id));
  const numbers = [
    ...companyCycles.map((cycle) => cycle.referenceNumber),
    ...activities.filter((activity) => initiativeIds.has(activity.initiativeId)).map((activity) => activity.referenceNumber),
  ].filter((value): value is number => typeof value === "number" && value > 0);

  return (numbers.length ? Math.max(...numbers) : 0) + 1;
}
