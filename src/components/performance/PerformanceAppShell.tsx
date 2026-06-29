import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bot,
  Filter,
  LayoutDashboard,
  ListChecks,
  LogOut,
  SlidersHorizontal,
  Target,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type Company } from "@/data/performanceSystem";
import { getPerformanceSession, isBvbpStaff, signOutPerformanceUser } from "@/lib/performanceAuth";
import { getAccessibleCompanies, getActiveCompanyForSession, setActiveCompanyId } from "@/lib/clientPortalStore";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/app/performance/overview", icon: LayoutDashboard },
  { label: "Ponteiros", href: "/app/performance/pointers", icon: Target },
  { label: "Funil", href: "/app/performance/funnel", icon: Filter },
  { label: "Operação", href: "/app/performance/operations", icon: SlidersHorizontal },
  { label: "Execução", href: "/app/performance/execution", icon: ListChecks },
  { label: "Automações", href: "/app/performance/automations", icon: Bot },
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
    <div className="min-h-screen bg-[#F7FAFC] text-[#1B365D] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden border-r border-[#1B365D] bg-[#1B365D] text-white lg:flex lg:min-h-screen lg:flex-col">
        <div className="border-b border-white/10 px-6 py-6">
          <a href="/" className="font-heading text-2xl font-bold">
            BVBP
          </a>
          <p className="mt-2 text-sm leading-5 text-white/70">Performance Operacional</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {isBvbpStaff(session) && (
            <NavLink
              to="/app/admin"
              className="mb-3 flex items-center gap-3 rounded-md border border-white/15 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
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
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors",
                    isActive ? "bg-white text-[#1B365D]" : "text-white/75 hover:bg-white/10 hover:text-white"
                  )
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-lg bg-white/10 p-4">
            <p className="text-xs font-semibold uppercase text-white/55">Empresa</p>
            <p className="mt-1 text-sm font-bold text-white">{activeCompany.name}</p>
            <p className="mt-1 text-xs text-white/60">
              {activeCompany.segment} · {formatNumber(activeCompany.employees)} funcionários
            </p>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2 lg:hidden">
                <a href="/" className="font-heading text-xl font-bold text-[#1B365D]">
                  BVBP
                </a>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-sm font-semibold text-slate-600">Performance</span>
              </div>
              <div className="mt-1 flex flex-col gap-2 lg:mt-0 lg:flex-row lg:items-center">
                <p className="truncate font-heading text-lg font-bold text-[#1B365D]">{activeCompany.name}</p>
                {accessibleCompanies.length > 1 && (
                  <select
                    value={activeCompany.id}
                    onChange={(event) => handleCompanyChange(event.target.value)}
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-[#1B365D] outline-none focus:ring-2 focus:ring-[#38A169]/30"
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
              <p className="text-sm text-slate-500">
                {activeCompany.segment} · {formatNumber(activeCompany.employees)} funcionários ·{" "}
                {formatCurrency(activeCompany.monthlyRevenue)}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 lg:justify-end">
              <div className="min-w-0 text-left lg:text-right">
                <p className="truncate text-sm font-semibold text-[#1B365D]">{session?.user.name}</p>
                <p className="truncate text-xs text-slate-500">{session?.user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </Button>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden lg:hidden">
            {navItems
              .map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                        isActive ? "bg-[#1B365D] text-white" : "text-slate-600 hover:bg-slate-100"
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
