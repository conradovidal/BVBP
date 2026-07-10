import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/performance/EmptyState";
import { MetricCard } from "@/components/performance/MetricCard";
import { StatusBadge } from "@/components/performance/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BVBP_COMPANY_ID, getInternalPortfolioItems, getInternalPortfolioSummary } from "@/data/performanceSystem";
import { setActiveCompanyId } from "@/lib/clientPortalStore";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const summary = getInternalPortfolioSummary();
  const portfolioItems = getInternalPortfolioItems();

  const openBvbpWorkspace = () => {
    setActiveCompanyId(BVBP_COMPANY_ID);
    navigate("/app/performance/overview");
  };

  return (
    <>
      <Helmet>
        <title>Portal BVBP | Administração</title>
      </Helmet>

      <div className="space-y-7">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-bvbp-ink">Visão geral</h1>
            <p className="mt-1 text-sm text-bvbp-muted-ink">Carteira BVBP, ponteiros e ciclos ativos.</p>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-[8px] border-bvbp-forest bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark hover:text-bvbp-ivory"
          >
            <Link to="/app/admin/clients/new">
              <Plus className="h-4 w-4" />
              Novo cliente
            </Link>
          </Button>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Ativos" value={formatNumber(summary.activeItems)} accent="blue" />
          <MetricCard title="Oportunidades" value={formatNumber(summary.opportunities)} accent="orange" />
          <MetricCard title="Potencial" value={`${formatCurrency(summary.mappedPotential)}/mês`} accent="green" />
          <MetricCard title="Ações" value={formatNumber(summary.pendingActions)} accent="gray" />
        </section>

        <section className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised shadow-none">
          <div className="flex items-center justify-between gap-4 border-b border-bvbp-ink/10 p-5">
            <h2 className="font-heading text-lg font-bold text-bvbp-ink">Carteira BVBP</h2>
            <Link to="/app/admin/clients" className="text-sm font-semibold text-bvbp-ink hover:text-bvbp-positive">
              Ver todos
            </Link>
          </div>

          {portfolioItems.length ? (
            <div className="grid gap-3 p-4 md:hidden">
              {portfolioItems.map((item) => (
                <article key={item.id} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-heading text-base font-bold text-bvbp-ink">{item.name}</h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">{item.type}</p>
                    </div>
                    <StatusBadge label={item.status} />
                  </div>
                  <div className="mt-4 grid gap-3 text-sm">
                    <p className="text-bvbp-muted-ink">
                      <span className="font-semibold text-bvbp-ink">Ponteiro:</span> {item.criticalPointer}
                    </p>
                    <p className="font-semibold text-bvbp-positive">{formatCurrency(item.mappedPotential)}/mês</p>
                    <p className="text-bvbp-muted-ink">{item.nextAction}</p>
                  </div>
                  {item.id === "internal-bvbp" ? (
                    <Button size="sm" variant="outline" onClick={openBvbpWorkspace} className="mt-4 w-full">
                      Abrir workspace
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <p className="mt-4 text-sm font-semibold text-bvbp-ink">{item.actionLabel}</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum cliente ou prospect."
              description="Cadastre a primeira oportunidade para acompanhar ponteiro, potencial e próxima ação."
              className="m-4"
            />
          )}

          {portfolioItems.length ? (
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ponteiro crítico</TableHead>
                  <TableHead>Potencial mapeado</TableHead>
                  <TableHead>Próxima ação</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="min-w-[180px] font-semibold text-bvbp-ink">{item.name}</TableCell>
                    <TableCell className="min-w-[130px] text-bvbp-ink">{item.type}</TableCell>
                    <TableCell>
                      <StatusBadge label={item.status} />
                    </TableCell>
                    <TableCell className="min-w-[180px] text-bvbp-ink">{item.criticalPointer}</TableCell>
                    <TableCell className="font-semibold text-bvbp-positive">{formatCurrency(item.mappedPotential)}/mês</TableCell>
                    <TableCell className="min-w-[220px] text-bvbp-ink">{item.nextAction}</TableCell>
                    <TableCell className="min-w-[130px] text-bvbp-ink">{item.owner}</TableCell>
                    <TableCell>
                      {item.id === "internal-bvbp" ? (
                        <Button size="sm" variant="outline" onClick={openBvbpWorkspace}>
                          Abrir
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-sm font-semibold text-bvbp-ink">{item.actionLabel}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          ) : null}
        </section>
      </div>
    </>
  );
};

export default AdminDashboardPage;
