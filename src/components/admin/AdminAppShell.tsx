import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { FileText, LayoutDashboard, LogOut, Settings, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPerformanceSession, isBvbpStaff, signOutPerformanceUser } from "@/lib/performanceAuth";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { label: "Visão geral", href: "/app/admin", icon: LayoutDashboard },
  { label: "Clientes", href: "/app/admin/clients", icon: UsersRound },
  { label: "Conteúdo", href: "/app/admin/content", icon: FileText },
  { label: "Configurações", href: "/app/admin/settings", icon: Settings },
];

export function AdminAppShell() {
  const session = getPerformanceSession();
  const navigate = useNavigate();

  if (!isBvbpStaff(session)) {
    return <Navigate to="/app/performance/overview" replace />;
  }

  const handleLogout = () => {
    signOutPerformanceUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#1B365D] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden border-r border-slate-200 bg-[#1B365D] text-white lg:flex lg:min-h-screen lg:flex-col">
        <div className="border-b border-white/10 px-6 py-6">
          <a href="/" className="font-heading text-2xl font-bold">
            BVBP
          </a>
          <p className="mt-1 text-sm text-white/70">Portal administrativo</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {adminNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/app/admin"}
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
          <p className="truncate text-sm font-semibold">{session?.user.name}</p>
          <p className="truncate text-xs text-white/60">{session?.user.roleLabel}</p>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="font-heading text-lg font-bold text-[#1B365D]">Portal BVBP</p>
              <p className="text-sm text-slate-500">Carteira, ponteiros e conteúdo estratégico.</p>
            </div>

            <div className="flex items-center justify-between gap-3 lg:justify-end">
              <div className="min-w-0 text-left lg:text-right">
                <p className="truncate text-sm font-semibold text-[#1B365D]">{session?.user.name}</p>
                <p className="truncate text-xs text-slate-500">{session?.user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sair
              </Button>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden lg:hidden">
            {adminNavItems
              .map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === "/app/admin"}
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
