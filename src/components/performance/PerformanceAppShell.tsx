import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Check,
  ChevronsUpDown,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Target,
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
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Visão geral", href: "/app/performance/overview", icon: LayoutDashboard },
  { label: "Ponteiros", href: "/app/performance/pointers", icon: Target },
  { label: "Iniciativas", href: "/app/performance/pdca", icon: ListChecks },
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
  const [activeCompany, setActiveCompany] = useState<Company>(() => getActiveClientCompanyForSession(session));
  const canSwitchWorkspace = accessibleCompanies.length > 1;
  const isStaff = isBvbpStaff(session);

  const handleLogout = () => {
    signOutPerformanceUser();
    navigate("/login", { replace: true });
  };

  const handleCompanyChange = (companyId: string) => {
    const nextCompany = accessibleCompanies.find((company) => company.id === companyId);

    if (!nextCompany) return;

    setActiveCompanyId(nextCompany.id);
    setActiveCompany(nextCompany);
  };

  return (
    <div className="min-h-screen bg-bvbp-ivory text-bvbp-ink lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden border-r border-bvbp-gold/20 bg-bvbp-forest-dark text-bvbp-ivory lg:flex lg:min-h-screen lg:flex-col">
        <div className="border-b border-bvbp-ivory/10 px-6 py-6">
          <a href="/" aria-label="Voltar para o site BVBP">
            <BrandLockup tone="light" size="lg" />
          </a>
        </div>

        <nav className="flex-1 px-3 py-5">
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
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-bvbp-ink/10 bg-bvbp-raised/95 backdrop-blur">
          <div className="flex min-h-16 flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="min-w-0">
              <p className="font-label text-[10px] font-medium uppercase tracking-[0.14em] text-bvbp-muted-ink">
                Cliente
              </p>
              <div className="mt-1 hidden lg:block">
                <p className="truncate font-heading text-lg font-semibold text-bvbp-ink">{activeCompany.name}</p>
              </div>
              <div className="mt-2 lg:hidden">
                {canSwitchWorkspace ? (
                  <WorkspaceSwitcher
                    activeCompany={activeCompany}
                    companies={accessibleCompanies}
                    onCompanyChange={handleCompanyChange}
                    variant="light"
                  />
                ) : (
                  <p className="truncate font-heading text-lg font-semibold text-bvbp-ink">{activeCompany.name}</p>
                )}
              </div>
              <p className="mt-1 text-sm text-bvbp-muted-ink">
                {activeCompany.segment} · {formatNumber(activeCompany.employees)} funcionários ·{" "}
                {formatCurrency(activeCompany.monthlyRevenue)}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 lg:justify-end">
              <div className="min-w-0 text-left lg:text-right">
                <p className="truncate text-sm font-semibold text-bvbp-ink">{session?.user.name}</p>
                <p className="truncate text-xs text-bvbp-muted-ink">{session?.user.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-[8px] border-bvbp-ink/15 bg-transparent text-bvbp-ink hover:bg-bvbp-inset"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sair
              </Button>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-bvbp-ink/10 px-4 py-2 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden lg:hidden">
            {isStaff && (
              <NavLink
                to="/app/admin"
                className="inline-flex shrink-0 items-center gap-2 rounded-[8px] px-3 py-2 text-sm font-semibold text-bvbp-muted-ink transition-colors hover:bg-bvbp-inset hover:text-bvbp-ink"
              >
                <UsersRound className="h-4 w-4" aria-hidden="true" />
                Portal BVBP
              </NavLink>
            )}
            {navItems
              .map((item) => {
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
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet context={{ activeCompany }} />
        </main>
      </div>
    </div>
  );
}
