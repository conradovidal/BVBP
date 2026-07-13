import type { PdcaAction, PdcaCycle } from "@/data/performanceSystem";
import { syncInitiativeActivitiesForInitiativeSoon } from "@/lib/clientPortalSupabase";
import { PORTAL_STORAGE_KEYS, readJsonStorage, writeJsonStorage } from "@/lib/portalStorage";

export const initiativeActivityStatuses = ["A fazer", "Em andamento", "Em validação", "Concluído"] as const;

export type InitiativeActivityStatus = (typeof initiativeActivityStatuses)[number];

export interface InitiativeActivity {
  id: string;
  initiativeId: string;
  title: string;
  description?: string;
  owner?: string;
  dueDate?: string;
  status: InitiativeActivityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InitiativeActivityInput {
  id?: string;
  initiativeId: string;
  title: string;
  description?: string;
  owner?: string;
  dueDate?: string;
  status?: InitiativeActivityStatus;
}

function isInitiativeActivityStatus(value: unknown): value is InitiativeActivityStatus {
  return typeof value === "string" && initiativeActivityStatuses.includes(value as InitiativeActivityStatus);
}

function isInitiativeActivityList(value: unknown): value is InitiativeActivity[] {
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
  return data || [];
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
  const activity: InitiativeActivity = {
    id: input.id || `activity-${Date.now()}`,
    initiativeId: input.initiativeId,
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    owner: input.owner?.trim() || undefined,
    dueDate: input.dueDate?.trim() || undefined,
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
