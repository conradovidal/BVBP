import { BVBP_COMPANY_ID } from "@/data/performanceSystem";
import { deleteWorkspaceFromSupabase } from "@/lib/clientPortalSupabase";
import { getCompanyById, getPortalCompanies, savePortalCompanies } from "@/lib/clientPortalStore";
import { isInitiativeActivityList } from "@/lib/initiativeActivityStore";
import { portalRuntimeConfig } from "@/lib/portalRuntimeConfig";
import {
  PORTAL_STORAGE_KEYS,
  isClientConfigurationList,
  isPdcaCycleList,
  readJsonStorage,
  writeJsonStorage,
} from "@/lib/portalStorage";

export interface ClientDeletionSummary {
  contacts: number;
  initiatives: number;
  activities: number;
}

export function getClientDeletionSummary(companyId: string): ClientDeletionSummary {
  const company = getCompanyById(companyId);
  const { data: cycles } = readJsonStorage(PORTAL_STORAGE_KEYS.pdcaCycles, isPdcaCycleList);
  const companyCycles = (cycles || []).filter((cycle) => cycle.companyId === companyId);
  const initiativeIds = new Set(companyCycles.map((cycle) => cycle.id));
  const { data: activities } = readJsonStorage(
    PORTAL_STORAGE_KEYS.initiativeActivities,
    isInitiativeActivityList,
  );

  return {
    contacts: company?.contacts?.length || 0,
    initiatives: companyCycles.length,
    activities: (activities || []).filter((activity) => initiativeIds.has(activity.initiativeId)).length,
  };
}

export async function deleteClientWorkspace(companyId: string) {
  if (companyId === BVBP_COMPANY_ID) {
    throw new Error("O workspace institucional da BVBP não pode ser excluído.");
  }

  const company = getCompanyById(companyId);
  if (!company) {
    throw new Error("Este cliente não existe mais no portal.");
  }

  if (!portalRuntimeConfig.enableDemoData) {
    const deleted = await deleteWorkspaceFromSupabase(companyId);
    if (!deleted) {
      throw new Error("O Supabase não confirmou a exclusão. Nenhum dado local foi removido.");
    }
  }

  const { data: cycles } = readJsonStorage(PORTAL_STORAGE_KEYS.pdcaCycles, isPdcaCycleList);
  const removedInitiativeIds = new Set(
    (cycles || []).filter((cycle) => cycle.companyId === companyId).map((cycle) => cycle.id),
  );
  const { data: activities } = readJsonStorage(
    PORTAL_STORAGE_KEYS.initiativeActivities,
    isInitiativeActivityList,
  );
  const { data: configurations } = readJsonStorage(
    PORTAL_STORAGE_KEYS.clientConfigurations,
    isClientConfigurationList,
  );

  savePortalCompanies(getPortalCompanies().filter((candidate) => candidate.id !== companyId));
  writeJsonStorage(
    PORTAL_STORAGE_KEYS.clientConfigurations,
    (configurations || []).filter((configuration) => configuration.companyId !== companyId),
  );
  writeJsonStorage(
    PORTAL_STORAGE_KEYS.pdcaCycles,
    (cycles || []).filter((cycle) => cycle.companyId !== companyId),
  );
  writeJsonStorage(
    PORTAL_STORAGE_KEYS.initiativeActivities,
    (activities || []).filter((activity) => !removedInitiativeIds.has(activity.initiativeId)),
  );

  if (window.localStorage.getItem(PORTAL_STORAGE_KEYS.activeCompany) === companyId) {
    window.localStorage.removeItem(PORTAL_STORAGE_KEYS.activeCompany);
  }

  return company;
}
