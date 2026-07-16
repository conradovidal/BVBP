import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FileText, LayoutDashboard, ListChecks, LogOut, Plus, Settings, Target, UsersRound } from "lucide-react";
import { BrandLockup } from "@/components/BrandLockup";
import { Button } from "@/components/ui/button";
import { getBvbpWorkspaceCompany } from "@/lib/clientPortalStore";
import { getPerformanceSession, isBvbpStaff, signOutPerformanceUser } from "@/lib/performanceAuth";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { label: "Visão geral", href: "/app/admin", icon: LayoutDashboard },
  { label: "Ponteiros", href: "/app/admin/pointers", icon: Target },
  { label: "Iniciativas", href: "/app/admin/initiatives", icon: ListChecks },
  { label: "CRM", href: "/app/admin/clients", icon: UsersRound },
  { label: "Conteúdo", href: "/app/admin/content", icon: FileText },
  { label: "Configurações", href: "/app/admin/settings", icon: Settings },
];

const BVBP_WORKSPACE_EDIT_PATH = "/app/admin/clients/company-bvbp/edit";

function getActiveAdminNavHref(pathname: string) {
  if (pathname === BVBP_WORKSPACE_EDIT_PATH) return "/app/admin/settings";
  if (pathname === "/app/admin") return "/app/admin";
  if (pathname.startsWith("/app/admin/blog")) return "/app/admin/content";

  return adminNavItems.find((item) => (
    item.href !== "/app/admin" &&
    (pathname === item.href || pathname.startsWith(`${item.href}/`))
  ))?.href;
}

function getAdminPageTitle(pathname: string) {
  if (pathname === "/app/admin/clients/new") return "Novo cliente";
  if (pathname === BVBP_WORKSPACE_EDIT_PATH) return "Dados da BVBP";
  if (/^\/app\/admin\/clients\/[^/]+\/edit$/.test(pathname)) return "Editar cliente";
  if (pathname === "/app/admin/content/new" || pathname === "/app/admin/blog/new") return "Novo conteúdo";
  if (pathname.startsWith("/app/admin/content/edit/") || pathname.startsWith("/app/admin/blog/edit/")) return "Editar conteúdo";

  const activeHref = getActiveAdminNavHref(pathname);
  return adminNavItems.find((item) => item.href === activeHref)?.label || "Portal BVBP";
}

function needsBvbpWorkspace(pathname: string) {
  return pathname === "/app/admin" ||
    pathname === "/app/admin/pointers" ||
    pathname.startsWith("/app/admin/pointers/") ||
    pathname === "/app/admin/initiatives" ||
    pathname.startsWith("/app/admin/initiatives/");
}

function EmptyBvbpWorkspaceState() {
  return (
    <section className="rounded-[8px] border border-dashed border-bvbp-ink/15 bg-bvbp-raised p-6">
      <p className="font-label text-[10px] font-semibold uppercase tracking-[0.14em] text-bvbp-muted-ink">
        Primeiro uso
      </p>
      <h1 className="mt-3 font-heading text-2xl font-bold text-bvbp-ink">Cadastre o workspace BVBP</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-bvbp-muted-ink">
        O portal está sem dados de demonstração. Crie primeiro o workspace interno para liberar visão geral, ponteiros e iniciativas da BVBP.
      </p>
      <Button asChild className="mt-5 rounded-[8px] bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark">
        <Link to="/app/admin/clients/company-bvbp/edit">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Cadastrar workspace BVBP
        </Link>
      </Button>
    </section>
  );
}

export function AdminAppShell() {
  const session = getPerformanceSession();
  const navigate = useNavigate();
  const location = useLocation();
  const activeCompany = getBvbpWorkspaceCompany();
  const activeNavHref = getActiveAdminNavHref(location.pathname);
  const pageTitle = getAdminPageTitle(location.pathname);

  if (!isBvbpStaff(session)) {
    return <Navigate to="/app/performance/overview" replace />;
  }

  const handleLogout = async () => {
    try {
      await signOutPerformanceUser();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-bvbp-ivory text-bvbp-ink lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden border-r border-bvbp-gold/20 bg-bvbp-forest-dark text-bvbp-ivory lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-hidden">
        <div className="border-b border-bvbp-ivory/10 px-6 py-6">
          <a href="/" aria-label="Voltar para o site BVBP">
            <BrandLockup tone="light" size="lg" />
          </a>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavHref === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-bvbp-ivory text-bvbp-forest-dark"
                    : "text-bvbp-ivory/72 hover:bg-bvbp-ivory/10 hover:text-bvbp-ivory"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-bvbp-ivory/10 p-4">
          <p className="truncate text-sm font-semibold">{session?.user.name}</p>
          <p className="truncate text-xs text-bvbp-ivory/60">{session?.user.roleLabel}</p>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-bvbp-ink/10 bg-bvbp-raised/95 backdrop-blur">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <h1 className="font-heading text-xl font-semibold text-bvbp-ink">{pageTitle}</h1>

            <div className="flex items-center justify-between gap-3 lg:justify-end">
              <div className="min-w-0 text-left lg:text-right">
                <p className="truncate text-sm font-semibold text-bvbp-ink">{session?.user.name}</p>
                <p className="truncate text-xs text-bvbp-muted-ink">{session?.user.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-[8px] border-bvbp-ink/15 bg-transparent text-bvbp-ink hover:bg-bvbp-inset"
                onClick={() => void handleLogout()}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sair
              </Button>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-bvbp-ink/10 px-4 py-2 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden lg:hidden">
            {adminNavItems
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeNavHref === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-[8px] px-3 py-2 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-bvbp-forest text-bvbp-ivory"
                        : "text-bvbp-muted-ink hover:bg-bvbp-inset hover:text-bvbp-ink"
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {!activeCompany && needsBvbpWorkspace(location.pathname) ? (
            <EmptyBvbpWorkspaceState />
          ) : (
            <Outlet context={{ activeCompany }} />
          )}
        </main>
      </div>
    </div>
  );
}
