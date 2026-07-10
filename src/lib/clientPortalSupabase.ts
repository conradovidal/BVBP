import type { Session } from "@supabase/supabase-js";
import {
  type ClientConfiguration,
  type ClientContact,
  type Company,
  type PdcaCycle,
  getCompanyRelationshipStatus,
} from "@/data/performanceSystem";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { InitiativeActivity } from "@/lib/initiativeActivityStore";
import {
  PORTAL_STORAGE_KEYS,
  isClientConfigurationList,
  isCompanyList,
  isPdcaCycleList,
  readJsonStorage,
  writeJsonStorage,
} from "@/lib/portalStorage";

type ClientPayloadKey = "client_configuration" | "pdca_cycles" | "initiative_activities";
type ContactAccessAction = "invite" | "resend" | "disable";

interface RemoteContact {
  access_status: string;
  auth_user_id: string | null;
  disabled_at: string | null;
  email: string;
  id: string;
  invited_at: string | null;
  is_primary: boolean;
  name: string;
  workspace_id: string;
}

interface InviteClientContactResponse {
  contact: ClientContact;
}

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}

function isContactAccessStatus(value: string): ClientContact["accessStatus"] {
  if (value === "invited" || value === "active" || value === "disabled") return value;
  return "planned";
}

function toClientContact(contact: RemoteContact): ClientContact {
  return {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    isPrimary: contact.is_primary,
    accessStatus: isContactAccessStatus(contact.access_status),
  };
}

function mergeById<T extends { id: string }>(remoteItems: T[], localItems: T[]) {
  const remoteIds = new Set(remoteItems.map((item) => item.id));
  return [...remoteItems, ...localItems.filter((item) => !remoteIds.has(item.id))];
}

async function getCurrentUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
}

async function upsertWorkspacePayload(workspaceId: string, payloadKey: ClientPayloadKey, payload: unknown, schemaVersion = 1) {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const { error } = await supabase
    .from("client_workspace_payloads")
    .upsert({
      workspace_id: workspaceId,
      payload_key: payloadKey,
      schema_version: schemaVersion,
      payload: toJson(payload),
      updated_at: new Date().toISOString(),
      updated_by: userId,
    }, {
      onConflict: "workspace_id,payload_key",
    });

  return !error;
}

export async function syncCompanyToSupabase(company: Company) {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const relationshipStatus = getCompanyRelationshipStatus(company);
  const { error: workspaceError } = await supabase
    .from("client_workspaces")
    .upsert({
      id: company.id,
      name: company.name,
      segment: company.segment,
      relationship_status: relationshipStatus,
      company_payload: toJson({
        ...company,
        relationshipStatus,
        status: relationshipStatus,
      }),
      updated_at: new Date().toISOString(),
      updated_by: userId,
    });

  if (workspaceError) return false;

  const contacts = company.contacts || [];
  if (contacts.length) {
    const { error: contactsError } = await supabase
      .from("client_contacts")
      .upsert(
        contacts.map((contact) => ({
          id: contact.id,
          workspace_id: company.id,
          name: contact.name.trim(),
          email: contact.email.trim().toLowerCase(),
          is_primary: contact.isPrimary,
          access_status: contact.accessStatus || "planned",
          updated_at: new Date().toISOString(),
        })),
        { onConflict: "id" },
      );

    if (contactsError) return false;
  }

  const { data: remoteContacts } = await supabase
    .from("client_contacts")
    .select("id, access_status")
    .eq("workspace_id", company.id);
  const currentContactIds = new Set(contacts.map((contact) => contact.id));
  const removedContacts = (remoteContacts || []).filter((contact) => !currentContactIds.has(contact.id));

  await Promise.all(removedContacts.map((contact) => {
    if (contact.access_status === "planned") {
      return supabase.from("client_contacts").delete().eq("id", contact.id);
    }

    return supabase
      .from("client_contacts")
      .update({
        access_status: "disabled",
        disabled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", contact.id);
  }));

  return true;
}

export function syncCompanyToSupabaseSoon(company: Company) {
  void syncCompanyToSupabase(company);
}

export async function syncClientConfigurationToSupabase(config: ClientConfiguration) {
  return upsertWorkspacePayload(config.companyId, "client_configuration", config, config.schemaVersion);
}

export function syncClientConfigurationToSupabaseSoon(config: ClientConfiguration) {
  void syncClientConfigurationToSupabase(config);
}

export async function syncPdcaCyclesForCompany(companyId: string, cycles: PdcaCycle[]) {
  return upsertWorkspacePayload(companyId, "pdca_cycles", cycles);
}

export function syncPdcaCyclesForCompanySoon(companyId: string, cycles: PdcaCycle[]) {
  void syncPdcaCyclesForCompany(companyId, cycles);
}

export async function syncInitiativeActivitiesForCompany(companyId: string, activities: InitiativeActivity[]) {
  return upsertWorkspacePayload(companyId, "initiative_activities", activities);
}

export function syncInitiativeActivitiesForInitiativeSoon(initiativeId: string, activities: InitiativeActivity[]) {
  const { data: cycles } = readJsonStorage(PORTAL_STORAGE_KEYS.pdcaCycles, isPdcaCycleList);
  const initiative = cycles?.find((cycle) => cycle.id === initiativeId);

  if (!initiative) return;

  const companyInitiativeIds = new Set(
    cycles
      ?.filter((cycle) => cycle.companyId === initiative.companyId)
      .map((cycle) => cycle.id) || [],
  );
  const companyActivities = activities.filter((activity) => companyInitiativeIds.has(activity.initiativeId));

  void syncInitiativeActivitiesForCompany(initiative.companyId, companyActivities);
}

export async function hydratePortalFromSupabase(session?: Session | null) {
  const activeSession = session || (await supabase.auth.getSession()).data.session;
  if (!activeSession) return false;

  const { data: workspaces, error: workspacesError } = await supabase
    .from("client_workspaces")
    .select("*")
    .order("updated_at", { ascending: false });

  if (workspacesError || !workspaces?.length) return false;

  const workspaceIds = workspaces.map((workspace) => workspace.id);
  const [{ data: contacts }, { data: payloads }] = await Promise.all([
    supabase
      .from("client_contacts")
      .select("id, workspace_id, auth_user_id, name, email, is_primary, access_status, invited_at, disabled_at")
      .in("workspace_id", workspaceIds),
    supabase
      .from("client_workspace_payloads")
      .select("workspace_id, payload_key, payload")
      .in("workspace_id", workspaceIds),
  ]);

  const contactsByWorkspace = new Map<string, ClientContact[]>();
  (contacts || []).forEach((contact) => {
    const currentContacts = contactsByWorkspace.get(contact.workspace_id) || [];
    contactsByWorkspace.set(contact.workspace_id, [...currentContacts, toClientContact(contact)]);
  });

  const remoteCompanies = workspaces.map((workspace) => {
    const payload = workspace.company_payload as Partial<Company>;
    const workspaceContacts = contactsByWorkspace.get(workspace.id) || payload.contacts || [];
    const primaryContact = workspaceContacts.find((contact) => contact.isPrimary);

    return {
      id: workspace.id,
      name: payload.name || workspace.name,
      segment: payload.segment || workspace.segment,
      employees: typeof payload.employees === "number" ? payload.employees : 0,
      monthlyRevenue: typeof payload.monthlyRevenue === "number" ? payload.monthlyRevenue : 0,
      recurringRevenue: typeof payload.recurringRevenue === "number" ? payload.recurringRevenue : 0,
      monthlyOperationalCost: typeof payload.monthlyOperationalCost === "number" ? payload.monthlyOperationalCost : 0,
      description: payload.description,
      bvbpOwner: payload.bvbpOwner,
      companySize: payload.companySize,
      reportedRevenue: payload.reportedRevenue,
      startDate: payload.startDate,
      contactName: primaryContact?.name || payload.contactName,
      contactEmail: primaryContact?.email || payload.contactEmail,
      contacts: workspaceContacts,
      relationshipStatus: workspace.relationship_status as Company["relationshipStatus"],
      status: workspace.relationship_status as Company["status"],
    } satisfies Company;
  });

  const { data: localCompanies } = readJsonStorage(PORTAL_STORAGE_KEYS.clients, isCompanyList);
  writeJsonStorage(PORTAL_STORAGE_KEYS.clients, mergeById(remoteCompanies, localCompanies || []));

  const remoteConfigurations = (payloads || [])
    .filter((payload) => payload.payload_key === "client_configuration")
    .flatMap((payload) => {
      const value = payload.payload as unknown;

      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        "companyId" in value &&
        "pillars" in value &&
        "metrics" in value
      ) {
        return [value as ClientConfiguration];
      }

      return [];
    });
  const { data: localConfigurations } = readJsonStorage(PORTAL_STORAGE_KEYS.clientConfigurations, isClientConfigurationList);

  if (remoteConfigurations.length) {
    writeJsonStorage(
      PORTAL_STORAGE_KEYS.clientConfigurations,
      mergeById(remoteConfigurations.map((config) => ({ ...config, id: config.companyId })), (localConfigurations || []).map((config) => ({ ...config, id: config.companyId })))
        .map(({ id: _id, ...config }) => config as ClientConfiguration),
    );
  }

  const remoteCycles = (payloads || [])
    .filter((payload) => payload.payload_key === "pdca_cycles" && Array.isArray(payload.payload))
    .flatMap((payload) => payload.payload as unknown as PdcaCycle[]);
  const { data: localCycles } = readJsonStorage(PORTAL_STORAGE_KEYS.pdcaCycles, isPdcaCycleList);

  if (remoteCycles.length) {
    writeJsonStorage(PORTAL_STORAGE_KEYS.pdcaCycles, mergeById(remoteCycles, localCycles || []));
  }

  const remoteActivities = (payloads || [])
    .filter((payload) => payload.payload_key === "initiative_activities" && Array.isArray(payload.payload))
    .flatMap((payload) => payload.payload as unknown as InitiativeActivity[]);

  if (remoteActivities.length) {
    let localActivities: InitiativeActivity[] = [];

    try {
      const rawLocalActivities = window.localStorage.getItem(PORTAL_STORAGE_KEYS.initiativeActivities);
      localActivities = rawLocalActivities ? JSON.parse(rawLocalActivities) as InitiativeActivity[] : [];
    } catch {
      localActivities = [];
    }

    writeJsonStorage(PORTAL_STORAGE_KEYS.initiativeActivities, mergeById(remoteActivities, localActivities));
  }

  if (!window.localStorage.getItem(PORTAL_STORAGE_KEYS.activeCompany)) {
    window.localStorage.setItem(PORTAL_STORAGE_KEYS.activeCompany, workspaceIds[0]);
  }

  return true;
}

export async function sendClientContactAccessAction(
  workspaceId: string,
  contactId: string,
  action: ContactAccessAction,
) {
  const { data, error } = await supabase.functions.invoke<InviteClientContactResponse>("invite-client-contact", {
    body: { workspaceId, contactId, action },
  });

  if (error) {
    throw new Error(error.message || "Não foi possível atualizar o acesso do contato.");
  }

  if (!data?.contact) {
    throw new Error("A resposta do convite veio incompleta.");
  }

  return data.contact;
}
