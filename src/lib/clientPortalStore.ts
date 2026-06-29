import { type Company, mockCompanies } from "@/data/performanceSystem";
import { type PerformanceSession, isBvbpStaff } from "@/lib/performanceAuth";
import { PORTAL_STORAGE_KEYS, isCompanyList, readJsonStorage, writeJsonStorage } from "@/lib/portalStorage";

export interface NewClientInput {
  name: string;
  segment: string;
  employees: number;
  monthlyRevenue: number;
  recurringRevenue: number;
  monthlyOperationalCost: number;
  contactName?: string;
  contactEmail?: string;
}

export function getPortalCompanies(): Company[] {
  const { data: storedCompanies } = readJsonStorage(PORTAL_STORAGE_KEYS.clients, isCompanyList);

  if (storedCompanies?.length) {
    const storedIds = new Set(storedCompanies.map((company) => company.id));
    const missingSeedCompanies = mockCompanies.filter((company) => !storedIds.has(company.id));

    if (missingSeedCompanies.length) {
      const mergedCompanies = [...missingSeedCompanies, ...storedCompanies];
      savePortalCompanies(mergedCompanies);
      return mergedCompanies;
    }

    return storedCompanies;
  }

  writeJsonStorage(PORTAL_STORAGE_KEYS.clients, mockCompanies);
  return mockCompanies;
}

export function savePortalCompanies(companies: Company[]) {
  writeJsonStorage(PORTAL_STORAGE_KEYS.clients, companies);
}

export function createPortalCompany(input: NewClientInput): Company {
  const companies = getPortalCompanies();
  const company: Company = {
    id: `company-${Date.now()}`,
    name: input.name.trim(),
    segment: input.segment.trim(),
    employees: input.employees,
    monthlyRevenue: input.monthlyRevenue,
    recurringRevenue: input.recurringRevenue,
    monthlyOperationalCost: input.monthlyOperationalCost,
    contactName: input.contactName?.trim() || undefined,
    contactEmail: input.contactEmail?.trim() || undefined,
    status: "Onboarding",
  };

  savePortalCompanies([company, ...companies]);
  setActiveCompanyId(company.id);
  return company;
}

export function getCompanyById(companyId: string | undefined) {
  if (!companyId) return undefined;
  return getPortalCompanies().find((company) => company.id === companyId);
}

export function setActiveCompanyId(companyId: string) {
  window.localStorage.setItem(PORTAL_STORAGE_KEYS.activeCompany, companyId);
}

export function getActiveCompanyId() {
  return window.localStorage.getItem(PORTAL_STORAGE_KEYS.activeCompany);
}

export function getAccessibleCompanies(session: PerformanceSession | null) {
  const companies = getPortalCompanies();

  if (!session) return [];
  if (isBvbpStaff(session)) return companies;

  return companies.filter((company) => session.user.companyIds.includes(company.id));
}

export function getActiveCompanyForSession(session: PerformanceSession | null) {
  const accessibleCompanies = getAccessibleCompanies(session);
  const activeCompany = accessibleCompanies.find((company) => company.id === getActiveCompanyId());

  return activeCompany || accessibleCompanies[0] || mockCompanies[0];
}
