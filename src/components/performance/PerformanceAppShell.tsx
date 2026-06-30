import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  LogOut,
  Target,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { BrandLockup } from "@/components/BrandLockup";
import { Button } from "@/components/ui/button";
import bvbpMark from "@/assets/brand/bvbp-mark.svg";
import { type Company } from "@/data/performanceSystem";
import { getPerformanceSession, isBvbpStaff, signOutPerformanceUser } from "@/lib/performanceAuth";
import { getAccessibleCompanies, getActiveCompanyForSession, setActiveCompanyId } from "@/lib/clientPortalStore";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Visão geral", href: "/app/performance/overview", icon: LayoutDashboard },
  { label: "Ponteiros", href: "/app/performance/pointers", icon: Target },
  { label: "PDCA", href: "/app/performance/pdca", icon: ListChecks },
];

export function PerformanceAppShell() {
  const navigate = useNavigate();
  const session = getPerformanceSession();
  const accessibleCompanies = getAccessibleCompanies(session);
  const [activeCompany, setActiveCompany] = useState<Company>(() => getActiveCompanyForSession(session));

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
          <p className="mt-3 text-sm leading-5 text-bvbp-ivory/65">Performance operacional</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {isBvbpStaff(session) && (
            <NavLink
              to="/app/admin"
              className="mb-3 flex items-center gap-3 rounded-[8px] border border-bvbp-ivory/15 px-3 py-2.5 text-sm font-semibold text-bvbp-ivory transition-colors hover:bg-bvbp-ivory/10"
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
        </nav>

        <div className="border-t border-bvbp-ivory/10 p-4">
          <div className="rounded-[8px] border border-bvbp-ivory/10 bg-bvbp-ivory/8 p-4">
            <p className="font-label text-[10px] font-medium uppercase tracking-[0.08em] text-bvbp-ivory/55">Empresa</p>
            <p className="mt-2 text-sm font-semibold text-bvbp-ivory">{activeCompany.name}</p>
            <p className="mt-1 text-xs text-bvbp-ivory/60">
              {activeCompany.segment} · {formatNumber(activeCompany.employees)} funcionários
            </p>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-bvbp-ink/10 bg-bvbp-raised/95 backdrop-blur">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2 lg:hidden">
                <a href="/" aria-label="Voltar para o site BVBP">
                  <img src={bvbpMark} alt="BVBP" className="h-8 w-8" />
                </a>
                <span className="h-1 w-1 rounded-full bg-bvbp-gold/70" />
                <span className="text-sm font-semibold text-bvbp-muted-ink">Performance</span>
              </div>
              <div className="mt-1 flex flex-col gap-2 lg:mt-0 lg:flex-row lg:items-center">
                <p className="truncate font-heading text-lg font-semibold text-bvbp-ink">{activeCompany.name}</p>
                {accessibleCompanies.length > 1 && (
                  <select
                    value={activeCompany.id}
                    onChange={(event) => handleCompanyChange(event.target.value)}
                    className="h-9 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory px-3 text-sm font-semibold text-bvbp-ink outline-none focus:ring-2 focus:ring-bvbp-gold/30"
                    aria-label="Selecionar cliente"
                  >
                    {accessibleCompanies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <p className="text-sm text-bvbp-muted-ink">
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
