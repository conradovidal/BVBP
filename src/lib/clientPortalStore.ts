import {
  BVBP_COMPANY_ID,
  type ClientContact,
  type ClientRelationshipStatus,
  type Company,
  mockCompanies,
} from "@/data/performanceSystem";
import { type PerformanceSession, isBvbpStaff } from "@/lib/performanceAuth";
import { syncCompanyToSupabaseSoon } from "@/lib/clientPortalSupabase";
import { portalRuntimeConfig } from "@/lib/portalRuntimeConfig";
import { PORTAL_STORAGE_KEYS, isCompanyList, readJsonStorage, writeJsonStorage } from "@/lib/portalStorage";

export interface NewClientInput {
  id?: string;
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
  contacts?: ClientContact[];
}

export type UpdateClientInput = Partial<NewClientInput>;

function normalizeContacts(companyId: string, contacts: ClientContact[] | undefined, contactName?: string, contactEmail?: string) {
  const sourceContacts = contacts?.length
    ? contacts
    : contactName || contactEmail
      ? [{
          id: `contact-${companyId}-primary`,
          name: contactName || "",
          email: contactEmail || "",
          isPrimary: true,
          accessStatus: "planned" as const,
        }]
      : [];
  const primaryIndex = Math.max(0, sourceContacts.findIndex((contact) => contact.isPrimary));

  return sourceContacts.map((contact, index) => ({
    ...contact,
    id: contact.id || `contact-${companyId}-${index + 1}`,
    name: contact.name.trim(),
    email: contact.email.trim().toLowerCase(),
    isPrimary: index === primaryIndex,
    accessStatus: contact.accessStatus || "planned",
  }));
}

function normalizeCompany(company: Company) {
  const contacts = normalizeContacts(company.id, company.contacts, company.contactName, company.contactEmail);
  const primaryContact = contacts.find((contact) => contact.isPrimary);

  return {
    ...company,
    contacts,
    contactName: primaryContact?.name || company.contactName,
    contactEmail: primaryContact?.email || company.contactEmail,
  };
}

export function getPortalCompanies(): Company[] {
  const { data: storedCompanies } = readJsonStorage(PORTAL_STORAGE_KEYS.clients, isCompanyList);

  if (storedCompanies?.length) {
    const storedIds = new Set(storedCompanies.map((company) => company.id));
    const missingSeedCompanies = portalRuntimeConfig.enableDemoData
      ? mockCompanies.filter((company) => !storedIds.has(company.id))
      : [];
    const normalizedCompanies = storedCompanies.map(normalizeCompany);

    if (missingSeedCompanies.length) {
      const mergedCompanies = [...missingSeedCompanies.map(normalizeCompany), ...normalizedCompanies];
      savePortalCompanies(mergedCompanies);
      return mergedCompanies;
    }

    if (JSON.stringify(normalizedCompanies) !== JSON.stringify(storedCompanies)) {
      savePortalCompanies(normalizedCompanies);
    }

    return normalizedCompanies;
  }

  if (!portalRuntimeConfig.enableDemoData) {
    return [];
  }

  const normalizedCompanies = mockCompanies.map(normalizeCompany);
  writeJsonStorage(PORTAL_STORAGE_KEYS.clients, normalizedCompanies);
  return normalizedCompanies;
}

export function savePortalCompanies(companies: Company[]) {
  writeJsonStorage(PORTAL_STORAGE_KEYS.clients, companies);
}

export function getBvbpWorkspaceCompany() {
  return getPortalCompanies().find((company) => company.id === BVBP_COMPANY_ID);
}

export function getExternalPortalCompanies() {
  return getPortalCompanies().filter((company) => company.id !== BVBP_COMPANY_ID);
}

export function createPortalCompany(input: NewClientInput): Company {
  const companies = getPortalCompanies();
  const companyId = input.id || `company-${Date.now()}`;
  const contacts = normalizeContacts(companyId, input.contacts, input.contactName, input.contactEmail);
  const primaryContact = contacts.find((contact) => contact.isPrimary);
  const company: Company = {
    id: companyId,
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
    contactName: primaryContact?.name || input.contactName?.trim() || undefined,
    contactEmail: primaryContact?.email || input.contactEmail?.trim() || undefined,
    contacts,
    status: input.relationshipStatus || "Onboarding",
  };

  savePortalCompanies([company, ...companies]);
  syncCompanyToSupabaseSoon(company);
  setActiveCompanyId(company.id);
  return company;
}

export function updatePortalCompany(companyId: string, input: UpdateClientInput) {
  const companies = getPortalCompanies();
  const existing = companies.find((company) => company.id === companyId);

  if (!existing) return undefined;

  const contacts = input.contacts
    ? normalizeContacts(companyId, input.contacts, input.contactName, input.contactEmail)
    : normalizeContacts(companyId, existing.contacts, input.contactName ?? existing.contactName, input.contactEmail ?? existing.contactEmail);
  const primaryContact = contacts.find((contact) => contact.isPrimary);
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
    contactName: primaryContact?.name || undefined,
    contactEmail: primaryContact?.email || undefined,
    contacts,
    status: input.relationshipStatus || existing.relationshipStatus || existing.status,
  };

  savePortalCompanies(companies.map((company) => (company.id === companyId ? updated : company)));
  syncCompanyToSupabaseSoon(updated);
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

  return activeCompany || accessibleCompanies[0];
}

export function getActiveClientCompanyForSession(session: PerformanceSession | null) {
  const accessibleCompanies = getAccessibleClientCompanies(session);
  const activeCompany = accessibleCompanies.find((company) => company.id === getActiveCompanyId());
  const fallbackCompany = activeCompany || accessibleCompanies[0];

  if (!fallbackCompany) {
    return undefined;
  }

  if (fallbackCompany.id !== getActiveCompanyId()) {
    setActiveCompanyId(fallbackCompany.id);
  }

  return fallbackCompany;
}
