import { PRISMA_DEMO_COMPANY_ID, type PerformanceUser } from "@/data/performanceSystem";

const PERFORMANCE_SESSION_KEY = "bvbp-performance-session";

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

export function signInPerformanceUser(email: string, password: string): PerformanceSession | null {
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

  window.localStorage.setItem(PERFORMANCE_SESSION_KEY, JSON.stringify(session));
  return session;
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

export function signOutPerformanceUser() {
  window.localStorage.removeItem(PERFORMANCE_SESSION_KEY);
}

export function isBvbpStaff(session: PerformanceSession | null) {
  return session?.user?.role === "admin" || session?.user?.role === "editor";
}

export function getDefaultRouteForSession(session: PerformanceSession) {
  return isBvbpStaff(session) ? "/app/admin" : "/app/performance/overview";
}
