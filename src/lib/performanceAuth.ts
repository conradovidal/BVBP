import { PRISMA_DEMO_COMPANY_ID, type PerformanceUser, type PortalRole } from "@/data/performanceSystem";
import { supabase } from "@/integrations/supabase/client";
import { hydratePortalFromSupabase } from "@/lib/clientPortalSupabase";
import { getAuthRedirectUrl, portalRuntimeConfig } from "@/lib/portalRuntimeConfig";
import { PORTAL_STORAGE_KEYS, clearPortalLocalState } from "@/lib/portalStorage";

const PERFORMANCE_SESSION_KEY = PORTAL_STORAGE_KEYS.performanceSession;

export const mockLoginCredentials = {
  email: "cliente@bvbp.com.br",
  password: "bvbp90",
};

export const mockLoginAccounts: Array<PerformanceUser & { password: string }> = [
  {
    id: "user-conrado",
    name: "Conrado Vidal",
    email: "conrado@bvbp.com.br",
    role: "admin",
    roleLabel: "Administrador BVBP",
    companyIds: [],
    password: "bvbp90",
  },
  {
    id: "user-cristiano",
    name: "Cristiano Basso",
    email: "cristiano@bvbp.com.br",
    role: "admin",
    roleLabel: "Administrador BVBP",
    companyIds: [],
    password: "bvbp90",
  },
  {
    id: "user-editor",
    name: "Equipe BVBP",
    email: "editor@bvbp.com.br",
    role: "editor",
    roleLabel: "Editor",
    companyIds: [],
    password: "bvbp90",
  },
  {
    id: "user-prisma-01",
    name: "Marina Lopes",
    email: "cliente@bvbp.com.br",
    role: "client",
    roleLabel: "Cliente",
    companyIds: [PRISMA_DEMO_COMPANY_ID],
    password: "bvbp90",
  },
];

export interface PerformanceSession {
  user: PerformanceUser;
  authenticatedAt: string;
}

function isPerformanceSession(value: unknown): value is PerformanceSession {
  if (!value || typeof value !== "object") return false;

  const session = value as Partial<PerformanceSession>;
  const user = session.user as Partial<PerformanceUser> | undefined;

  return (
    typeof session.authenticatedAt === "string" &&
    !!user &&
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    ["admin", "editor", "client"].includes(user.role || "") &&
    typeof user.roleLabel === "string" &&
    Array.isArray(user.companyIds)
  );
}

function persistPerformanceSession(session: PerformanceSession) {
  window.localStorage.setItem(PERFORMANCE_SESSION_KEY, JSON.stringify(session));
  return session;
}

function getSupabaseUserName(user: { email?: string; user_metadata?: Record<string, unknown> }) {
  const metadataName = user.user_metadata?.name || user.user_metadata?.full_name;
  if (typeof metadataName === "string" && metadataName.trim()) return metadataName.trim();
  return user.email?.split("@")[0] || "Usuário BVBP";
}

function getRoleLabel(role: PortalRole) {
  if (role === "admin") return "Administrador BVBP";
  if (role === "editor") return "Editor";
  return "Cliente";
}

export async function refreshPerformanceSessionFromSupabase(): Promise<PerformanceSession | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData.user;

  if (userError || !user?.email) {
    if (portalRuntimeConfig.enableMockAuth) {
      return getPerformanceSession();
    }
    window.localStorage.removeItem(PERFORMANCE_SESSION_KEY);
    return null;
  }

  const [rolesResult, membershipsResult] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", user.id),
    supabase.from("client_memberships").select("workspace_id, status").eq("user_id", user.id).eq("status", "active"),
  ]);
  const { data: roles, error: rolesError } = rolesResult;
  const { data: memberships, error: membershipsError } = membershipsResult;

  if (rolesError || membershipsError) {
    throw new Error("Não foi possível validar as permissões do portal.");
  }
  const roleNames = new Set((roles || []).map((role) => role.role));
  const role: PortalRole = roleNames.has("admin")
    ? "admin"
    : roleNames.has("editor")
      ? "editor"
      : "client";
  const companyIds = role === "client"
    ? (memberships || []).map((membership) => membership.workspace_id)
    : [];

  if (role === "client" && !companyIds.length) {
    window.localStorage.removeItem(PERFORMANCE_SESSION_KEY);
    return null;
  }

  const session: PerformanceSession = {
    user: {
      id: user.id,
      name: getSupabaseUserName(user),
      email: user.email,
      role,
      roleLabel: getRoleLabel(role),
      companyIds,
    },
    authenticatedAt: new Date().toISOString(),
  };

  await hydratePortalFromSupabase();
  return persistPerformanceSession(session);
}

function signInMockPerformanceUser(email: string, password: string): PerformanceSession | null {
  const normalizedEmail = email.trim().toLowerCase();
  const account = mockLoginAccounts.find(
    (mockAccount) => mockAccount.email === normalizedEmail && mockAccount.password === password
  );

  if (!account) {
    return null;
  }

  const { password: _password, ...user } = account;
  const session: PerformanceSession = {
    user,
    authenticatedAt: new Date().toISOString(),
  };

  return persistPerformanceSession(session);
}

export async function signInPerformanceUser(email: string, password: string): Promise<PerformanceSession | null> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (!error && data.user) {
    const session = await refreshPerformanceSessionFromSupabase();

    if (session) return session;

    await supabase.auth.signOut();
  }

  if (portalRuntimeConfig.enableMockAuth) {
    return signInMockPerformanceUser(email, password);
  }

  return null;
}

export async function completePerformancePasswordSetup(password: string): Promise<PerformanceSession | null> {
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw error;
  }

  return refreshPerformanceSessionFromSupabase();
}

export async function requestPerformancePasswordReset(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Informe o email para recuperar a senha.");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: getAuthRedirectUrl(),
  });

  if (error) {
    throw error;
  }
}

export function getPerformanceSession(): PerformanceSession | null {
  const storedSession = window.localStorage.getItem(PERFORMANCE_SESSION_KEY);

  if (!storedSession) return null;

  try {
    const parsed = JSON.parse(storedSession) as unknown;

    if (isPerformanceSession(parsed)) {
      return parsed;
    }

    window.localStorage.removeItem(PERFORMANCE_SESSION_KEY);
    return null;
  } catch {
    window.localStorage.removeItem(PERFORMANCE_SESSION_KEY);
    return null;
  }
}

export async function signOutPerformanceUser() {
  clearPortalLocalState();
  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    throw error;
  }
}

export function isBvbpStaff(session: PerformanceSession | null) {
  return session?.user?.role === "admin" || session?.user?.role === "editor";
}

export function getDefaultRouteForSession(session: PerformanceSession) {
  return isBvbpStaff(session) ? "/app/admin" : "/app/performance/overview";
}
