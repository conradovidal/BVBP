import { BVBP_COMPANY_ID, type ClientRelationshipStatus, type Company, mockCompanies } from "@/data/performanceSystem";
import { type PerformanceSession, isBvbpStaff } from "@/lib/performanceAuth";
import { PORTAL_STORAGE_KEYS, isCompanyList, readJsonStorage, writeJsonStorage } from "@/lib/portalStorage";

export interface NewClientInput {
  name: string;
  segment: string;
  description?: string;
  relationshipStatus?: ClientRelationshipStatus;
  bvbpOwner?: string;
  companySize?: string;
  employees: number;
  monthlyRevenue: number;
  recurringRevenue: number;
  monthlyOperationalCost: number;
  reportedRevenue?: number;
  startDate?: string;
  contactName?: string;
  contactEmail?: string;
}

export type UpdateClientInput = Partial<NewClientInput>;

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

export function getBvbpWorkspaceCompany() {
  return (
    getPortalCompanies().find((company) => company.id === BVBP_COMPANY_ID) ||
    mockCompanies.find((company) => company.id === BVBP_COMPANY_ID) ||
    mockCompanies[0]
  );
}

export function getExternalPortalCompanies() {
  return getPortalCompanies().filter((company) => company.id !== BVBP_COMPANY_ID);
}

export function createPortalCompany(input: NewClientInput): Company {
  const companies = getPortalCompanies();
  const company: Company = {
    id: `company-${Date.now()}`,
    name: input.name.trim(),
    segment: input.segment.trim(),
    description: input.description?.trim() || undefined,
    relationshipStatus: input.relationshipStatus || "Onboarding",
    bvbpOwner: input.bvbpOwner?.trim() || undefined,
    companySize: input.companySize?.trim() || undefined,
    employees: input.employees,
    monthlyRevenue: input.monthlyRevenue,
    recurringRevenue: input.recurringRevenue,
    monthlyOperationalCost: input.monthlyOperationalCost,
    reportedRevenue: input.reportedRevenue,
    startDate: input.startDate?.trim() || undefined,
    contactName: input.contactName?.trim() || undefined,
    contactEmail: input.contactEmail?.trim() || undefined,
    status: input.relationshipStatus || "Onboarding",
  };

  savePortalCompanies([company, ...companies]);
  setActiveCompanyId(company.id);
  return company;
}

export function updatePortalCompany(companyId: string, input: UpdateClientInput) {
  const companies = getPortalCompanies();
  const existing = companies.find((company) => company.id === companyId);

  if (!existing) return undefined;

  const updated: Company = {
    ...existing,
    name: input.name !== undefined ? input.name.trim() : existing.name,
    segment: input.segment !== undefined ? input.segment.trim() : existing.segment,
    description: input.description !== undefined ? input.description.trim() || undefined : existing.description,
    relationshipStatus: input.relationshipStatus || existing.relationshipStatus || existing.status,
    bvbpOwner: input.bvbpOwner !== undefined ? input.bvbpOwner.trim() || undefined : existing.bvbpOwner,
    companySize: input.companySize !== undefined ? input.companySize.trim() || undefined : existing.companySize,
    employees: input.employees ?? existing.employees,
    monthlyRevenue: input.monthlyRevenue ?? existing.monthlyRevenue,
    recurringRevenue: input.recurringRevenue ?? existing.recurringRevenue,
    monthlyOperationalCost: input.monthlyOperationalCost ?? existing.monthlyOperationalCost,
    reportedRevenue: input.reportedRevenue !== undefined ? input.reportedRevenue : existing.reportedRevenue,
    startDate: input.startDate !== undefined ? input.startDate.trim() || undefined : existing.startDate,
    contactName: input.contactName !== undefined ? input.contactName.trim() || undefined : existing.contactName,
    contactEmail: input.contactEmail !== undefined ? input.contactEmail.trim() || undefined : existing.contactEmail,
    status: input.relationshipStatus || existing.relationshipStatus || existing.status,
  };

  savePortalCompanies(companies.map((company) => (company.id === companyId ? updated : company)));
  return updated;
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

export function getAccessibleClientCompanies(session: PerformanceSession | null) {
  return getAccessibleCompanies(session).filter((company) => company.id !== BVBP_COMPANY_ID);
}

export function getActiveCompanyForSession(session: PerformanceSession | null) {
  const accessibleCompanies = getAccessibleCompanies(session);
  const activeCompany = accessibleCompanies.find((company) => company.id === getActiveCompanyId());

  return activeCompany || accessibleCompanies[0] || mockCompanies[0];
}

export function getActiveClientCompanyForSession(session: PerformanceSession | null) {
  const accessibleCompanies = getAccessibleClientCompanies(session);
  const activeCompany = accessibleCompanies.find((company) => company.id === getActiveCompanyId());
  const fallbackCompany = activeCompany || accessibleCompanies[0] || mockCompanies.find((company) => company.id !== BVBP_COMPANY_ID) || mockCompanies[0];

  if (fallbackCompany.id !== getActiveCompanyId()) {
    setActiveCompanyId(fallbackCompany.id);
  }

  return fallbackCompany;
}
