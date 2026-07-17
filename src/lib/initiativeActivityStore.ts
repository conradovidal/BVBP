import type { InitiativePriority, PdcaAction, PdcaCycle } from "@/data/performanceSystem";
import { syncInitiativeActivitiesForInitiativeSoon } from "@/lib/clientPortalSupabase";
import { PORTAL_STORAGE_KEYS, readJsonStorage, writeJsonStorage } from "@/lib/portalStorage";
import { getNextCompanyWorkItemReferenceNumber } from "@/lib/workItemReferences";

export const initiativeActivityStatuses = ["A fazer", "Em andamento", "Em validação", "Concluído"] as const;

export type InitiativeActivityStatus = (typeof initiativeActivityStatuses)[number];

export interface InitiativeActivity {
  id: string;
  initiativeId: string;
  referenceNumber?: number;
  title: string;
  description?: string;
  definitionOfDone?: string;
  owner?: string;
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  priority?: InitiativePriority;
  status: InitiativeActivityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InitiativeActivityInput {
  id?: string;
  initiativeId: string;
  title: string;
  description?: string;
  definitionOfDone?: string;
  owner?: string;
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  priority?: InitiativePriority;
  status?: InitiativeActivityStatus;
}

function isInitiativeActivityStatus(value: unknown): value is InitiativeActivityStatus {
  return typeof value === "string" && initiativeActivityStatuses.includes(value as InitiativeActivityStatus);
}

export function isInitiativeActivityList(value: unknown): value is InitiativeActivity[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== "object") return false;
    const activity = item as Partial<InitiativeActivity>;

    return (
      typeof activity.id === "string" &&
      typeof activity.initiativeId === "string" &&
      typeof activity.title === "string" &&
      isInitiativeActivityStatus(activity.status) &&
      typeof activity.createdAt === "string" &&
      typeof activity.updatedAt === "string"
    );
  });
}

function readAllActivities() {
  const { data } = readJsonStorage(PORTAL_STORAGE_KEYS.initiativeActivities, isInitiativeActivityList);
  const activities = data || [];
  const { data: cycles = [] } = readJsonStorage(PORTAL_STORAGE_KEYS.pdcaCycles, (value): value is PdcaCycle[] => Array.isArray(value));
  const cycleById = new Map(cycles.map((cycle) => [cycle.id, cycle]));
  const nextByCompany = new Map<string, number>();
  cycles.forEach((cycle) => {
    if (!cycle.referenceNumber) return;
    nextByCompany.set(cycle.companyId, Math.max(nextByCompany.get(cycle.companyId) || 1, cycle.referenceNumber + 1));
  });
  activities.forEach((activity) => {
    const companyId = cycleById.get(activity.initiativeId)?.companyId;
    if (!companyId || !activity.referenceNumber) return;
    nextByCompany.set(companyId, Math.max(nextByCompany.get(companyId) || 1, activity.referenceNumber + 1));
  });
  let changed = false;
  const normalized = activities.map((activity) => {
    const companyId = cycleById.get(activity.initiativeId)?.companyId;
    if (!companyId || activity.referenceNumber) return activity;
    const next = nextByCompany.get(companyId) || 1;
    nextByCompany.set(companyId, next + 1);
    changed = true;
    return { ...activity, referenceNumber: next };
  });
  if (changed) {
    saveActivities(normalized);
    new Set(normalized.map((activity) => activity.initiativeId)).forEach((initiativeId) => {
      syncInitiativeActivitiesForInitiativeSoon(initiativeId, normalized);
    });
  }
  return normalized;
}

function saveActivities(activities: InitiativeActivity[]) {
  writeJsonStorage(PORTAL_STORAGE_KEYS.initiativeActivities, activities);
}

function activityStatusFromAction(action: PdcaAction): InitiativeActivityStatus {
  if (action.status === "Em andamento") return "Em andamento";
  if (action.status === "Concluída") return "Concluído";
  return "A fazer";
}

function activityFromAction(initiativeId: string, action: PdcaAction, index: number): InitiativeActivity {
  const now = new Date().toISOString();

  return {
    id: `${initiativeId}-${action.id || `activity-${index}`}`,
    initiativeId,
    referenceNumber: undefined,
    title: action.title || "Atividade a definir",
    owner: action.owner || undefined,
    dueDate: action.deadline || undefined,
    status: activityStatusFromAction(action),
    createdAt: now,
    updatedAt: now,
  };
}

export function getActivitiesForInitiative(initiative: PdcaCycle) {
  const storedActivities = readAllActivities();
  const initiativeActivities = storedActivities.filter((activity) => activity.initiativeId === initiative.id);

  if (initiativeActivities.length || !initiative.actions?.length) {
    return initiativeActivities;
  }

  const seededActivities = initiative.actions.map((action, index) => activityFromAction(initiative.id, action, index));
  saveActivities([...seededActivities, ...storedActivities]);
  syncInitiativeActivitiesForInitiativeSoon(initiative.id, [...seededActivities, ...storedActivities]);

  return seededActivities;
}

export function getActivitiesForInitiatives(initiatives: PdcaCycle[]) {
  const storedActivities = readAllActivities();
  const storedIds = new Set(storedActivities.map((activity) => activity.id));
  const seededActivities = initiatives.flatMap((initiative) => {
    const hasStoredActivity = storedActivities.some((activity) => activity.initiativeId === initiative.id);
    if (hasStoredActivity || !initiative.actions?.length) return [];

    return initiative.actions
      .map((action, index) => activityFromAction(initiative.id, action, index))
      .filter((activity) => !storedIds.has(activity.id));
  });

  if (seededActivities.length) {
    const nextActivities = [...seededActivities, ...storedActivities];
    saveActivities(nextActivities);
    seededActivities.forEach((activity) => {
      syncInitiativeActivitiesForInitiativeSoon(activity.initiativeId, nextActivities);
    });
  }

  return [...seededActivities, ...storedActivities].filter((activity) =>
    initiatives.some((initiative) => initiative.id === activity.initiativeId),
  );
}

export function upsertInitiativeActivity(input: InitiativeActivityInput) {
  const activities = readAllActivities();
  const now = new Date().toISOString();
  const existing = input.id ? activities.find((activity) => activity.id === input.id) : undefined;
  const { data: cycles = [] } = readJsonStorage(PORTAL_STORAGE_KEYS.pdcaCycles, (value): value is PdcaCycle[] => Array.isArray(value));
  const companyId = cycles.find((cycle) => cycle.id === input.initiativeId)?.companyId;
  const activity: InitiativeActivity = {
    id: input.id || `activity-${Date.now()}`,
    initiativeId: input.initiativeId,
    referenceNumber: existing?.referenceNumber || (companyId ? getNextCompanyWorkItemReferenceNumber(companyId) : undefined),
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    definitionOfDone: input.definitionOfDone?.trim() || input.description?.trim() || undefined,
    owner: input.owner?.trim() || undefined,
    startDate: input.startDate?.trim() || undefined,
    endDate: input.endDate?.trim() || input.dueDate?.trim() || undefined,
    dueDate: input.endDate?.trim() || input.dueDate?.trim() || undefined,
    priority: input.priority || existing?.priority || "Média",
    status: input.status || existing?.status || "A fazer",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  const nextActivities = existing
    ? activities.map((item) => (item.id === activity.id ? activity : item))
    : [activity, ...activities];

  saveActivities(nextActivities);
  syncInitiativeActivitiesForInitiativeSoon(activity.initiativeId, nextActivities);
  return activity;
}

export function updateInitiativeActivityStatus(activityId: string, status: InitiativeActivityStatus) {
  const activities = readAllActivities();
  const updatedAt = new Date().toISOString();
  const nextActivities = activities.map((activity) =>
    activity.id === activityId ? { ...activity, status, updatedAt } : activity,
  );
  const updatedActivity = nextActivities.find((activity) => activity.id === activityId);

  saveActivities(nextActivities);
  if (updatedActivity) {
    syncInitiativeActivitiesForInitiativeSoon(updatedActivity.initiativeId, nextActivities);
  }
  return nextActivities.find((activity) => activity.id === activityId);
}
