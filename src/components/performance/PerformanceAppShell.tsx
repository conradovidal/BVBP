import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Check,
  ChevronDown,
  ChevronsUpDown,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Target,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { BrandLockup } from "@/components/BrandLockup";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Company } from "@/data/performanceSystem";
import { getPerformanceSession, isBvbpStaff, signOutPerformanceUser } from "@/lib/performanceAuth";
import { getAccessibleClientCompanies, getActiveClientCompanyForSession, setActiveCompanyId } from "@/lib/clientPortalStore";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Visão geral", href: "/app/performance/overview", icon: LayoutDashboard },
  { label: "Ponteiros", href: "/app/performance/pointers", icon: Target },
  { label: "Iniciativas", href: "/app/performance/initiatives", icon: ListChecks },
];

interface WorkspaceSwitcherProps {
  activeCompany: Company;
  companies: Company[];
  onCompanyChange: (companyId: string) => void;
  variant: "dark" | "light";
}

function WorkspaceSwitcher({ activeCompany, companies, onCompanyChange, variant }: WorkspaceSwitcherProps) {
  const canSwitchWorkspace = companies.length > 1;
  const isDark = variant === "dark";

  if (!canSwitchWorkspace) {
    return (
      <div
        className={cn(
          "rounded-[8px] border p-3",
          isDark
            ? "border-bvbp-ivory/12 bg-bvbp-ivory/8 text-bvbp-ivory"
            : "border-bvbp-ink/10 bg-bvbp-ivory text-bvbp-ink",
        )}
      >
        <p
          className={cn(
            "font-label text-[10px] font-medium uppercase tracking-[0.12em]",
            isDark ? "text-bvbp-ivory/50" : "text-bvbp-muted-ink",
          )}
        >
          Cliente
        </p>
        <p className="mt-1 truncate text-sm font-semibold">{activeCompany.name}</p>
        <p className={cn("mt-0.5 truncate text-xs", isDark ? "text-bvbp-ivory/58" : "text-bvbp-muted-ink")}>
          {activeCompany.segment}
        </p>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-auto w-full justify-between gap-3 rounded-[8px] px-3 py-3 text-left shadow-none",
            isDark
              ? "border-bvbp-ivory/15 bg-bvbp-ivory/8 text-bvbp-ivory hover:bg-bvbp-ivory/12 hover:text-bvbp-ivory"
              : "border-bvbp-ink/10 bg-bvbp-ivory text-bvbp-ink hover:bg-bvbp-inset",
          )}
          aria-label="Trocar cliente"
        >
          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "block font-label text-[10px] font-medium uppercase tracking-[0.12em]",
                isDark ? "text-bvbp-ivory/50" : "text-bvbp-muted-ink",
              )}
            >
              Cliente
            </span>
            <span className="mt-1 block truncate text-sm font-semibold leading-tight">{activeCompany.name}</span>
            <span className={cn("mt-0.5 block truncate text-xs", isDark ? "text-bvbp-ivory/58" : "text-bvbp-muted-ink")}>
              {activeCompany.segment}
            </span>
          </span>
          <ChevronsUpDown className={cn("h-4 w-4 shrink-0", isDark ? "text-bvbp-ivory/55" : "text-bvbp-muted-ink")} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[min(92vw,360px)] rounded-[8px] border-bvbp-ink/10 bg-bvbp-raised p-2 text-bvbp-ink shadow-[0_18px_50px_rgba(26,25,23,0.12)]"
      >
        <DropdownMenuLabel className="font-label text-[10px] font-medium uppercase tracking-[0.14em] text-bvbp-muted-ink">
          Trocar cliente
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-bvbp-ink/10" />
        <DropdownMenuGroup>
          {companies.map((company) => {
            const isActive = company.id === activeCompany.id;

            return (
              <DropdownMenuItem
                key={company.id}
                onClick={() => onCompanyChange(company.id)}
                className="cursor-pointer items-start gap-3 rounded-[8px] px-3 py-3 focus:bg-bvbp-inset focus:text-bvbp-ink"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-bvbp-ink/15 text-bvbp-forest">
                  {isActive && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-bvbp-ink">{company.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-bvbp-muted-ink">{company.segment}</span>
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PerformanceAppShell() {
  const navigate = useNavigate();
  const session = getPerformanceSession();
  const accessibleCompanies = getAccessibleClientCompanies(session);
  const [activeCompany, setActiveCompany] = useState<Company | undefined>(() => getActiveClientCompanyForSession(session));
  const isStaff = isBvbpStaff(session);

  const handleLogout = async () => {
    try {
      await signOutPerformanceUser();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleCompanyChange = (companyId: string) => {
    const nextCompany = accessibleCompanies.find((company) => company.id === companyId);

    if (!nextCompany) return;

    setActiveCompanyId(nextCompany.id);
    setActiveCompany(nextCompany);
  };

  if (!activeCompany) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bvbp-ivory px-4 text-bvbp-ink">
        <section className="w-full max-w-md rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-6">
          <BrandLockup tone="dark" size="md" />
          <h1 className="mt-8 font-heading text-2xl font-bold text-bvbp-ink">Nenhum workspace ativo</h1>
          <p className="mt-2 text-sm leading-6 text-bvbp-muted-ink">
            Este usuário ainda não tem um workspace de cliente liberado ou o acesso foi desativado.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            {isStaff ? (
              <Button asChild variant="outline" className="rounded-[8px]">
                <NavLink to="/app/admin">Portal BVBP</NavLink>
              </Button>
            ) : null}
            <Button variant="outline" className="rounded-[8px]" onClick={() => void handleLogout()}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bvbp-ivory text-bvbp-ink lg:grid lg:h-dvh lg:grid-cols-[260px_minmax(0,1fr)] lg:overflow-hidden">
      <aside className="hidden border-r border-bvbp-gold/20 bg-bvbp-forest-dark text-bvbp-ivory lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-hidden">
        <div className="border-b border-bvbp-ivory/10 px-6 py-6">
          <a href="/" aria-label="Voltar para o site BVBP">
            <BrandLockup tone="light" size="lg" />
          </a>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {isStaff && (
            <NavLink
              to="/app/admin"
              className="mb-3 flex items-center gap-3 rounded-[8px] border border-bvbp-ivory/15 px-3 py-2.5 text-sm font-semibold text-bvbp-ivory transition-colors hover:bg-bvbp-ivory/10"
            >
              <UsersRound className="h-4 w-4" aria-hidden="true" />
              Portal BVBP
            </NavLink>
          )}

          <div className="mb-5">
            <WorkspaceSwitcher
              activeCompany={activeCompany}
              companies={accessibleCompanies}
              onCompanyChange={handleCompanyChange}
              variant="dark"
            />
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-bvbp-ivory text-bvbp-forest-dark"
                        : "text-bvbp-ivory/72 hover:bg-bvbp-ivory/10 hover:text-bvbp-ivory"
                    )
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-bvbp-ivory/10 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left transition-colors hover:bg-bvbp-ivory/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bvbp-gold"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bvbp-ivory/10">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{session?.user.name}</span>
                  <span className="block truncate text-xs text-bvbp-ivory/60">{session?.user.roleLabel}</span>
                </span>
                <ChevronDown className="h-4 w-4 text-bvbp-ivory/60" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-[228px] rounded-[8px]">
              <DropdownMenuLabel className="font-normal">
                <span className="block truncate text-sm font-semibold text-bvbp-ink">{session?.user.name}</span>
                <span className="block truncate text-xs text-bvbp-muted-ink">{session?.user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <NavLink to="/app/performance/profile" className="gap-2">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  Acessar perfil
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onSelect={() => void handleLogout()}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="min-w-0 lg:h-dvh lg:overflow-y-auto">
        <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="mb-5 space-y-3 border-b border-bvbp-ink/10 pb-4 lg:hidden">
            <WorkspaceSwitcher
              activeCompany={activeCompany}
              companies={accessibleCompanies}
              onCompanyChange={handleCompanyChange}
              variant="light"
            />
            <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
              {isStaff && (
                <NavLink
                  to="/app/admin"
                  className="inline-flex shrink-0 items-center gap-2 rounded-[8px] px-3 py-2 text-sm font-semibold text-bvbp-muted-ink transition-colors hover:bg-bvbp-inset hover:text-bvbp-ink"
                >
                  <UsersRound className="h-4 w-4" aria-hidden="true" />
                  Portal BVBP
                </NavLink>
              )}
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "inline-flex shrink-0 items-center gap-2 rounded-[8px] px-3 py-2 text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-bvbp-forest text-bvbp-ivory"
                          : "text-bvbp-muted-ink hover:bg-bvbp-inset hover:text-bvbp-ink"
                      )
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
          <Outlet context={{ activeCompany }} />
        </main>
      </div>
    </div>
  );
}
