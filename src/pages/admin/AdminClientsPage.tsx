import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AdminClientActions } from "@/components/admin/AdminClientActions";
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
import {
  getAdminClientPortfolioItems,
  getAdminClientPortfolioSummary,
  getBvbpPipelineOpportunities,
} from "@/data/performanceSystem";
import { getExternalPortalCompanies, setActiveCompanyId } from "@/lib/clientPortalStore";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";

const AdminClientsPage = () => {
  const navigate = useNavigate();
  const [, refreshPortfolio] = useState(0);
  const portfolioItems = getAdminClientPortfolioItems(getExternalPortalCompanies());
  const portfolioSummary = getAdminClientPortfolioSummary(portfolioItems);
  const pipelineOpportunities = getBvbpPipelineOpportunities();
  const diagnostics = pipelineOpportunities.filter((opportunity) => opportunity.stage === "Diagnóstico").length;
  const proposals = pipelineOpportunities.filter((opportunity) => opportunity.stage === "Proposta").length;

  const openClientWorkspace = (companyId: string) => {
    setActiveCompanyId(companyId);
    navigate("/app/performance/overview");
  };

  return (
    <>
      <Helmet>
        <title>CRM | Portal BVBP</title>
      </Helmet>

      <div className="space-y-5">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm text-bvbp-muted-ink">Pipeline comercial, clientes externos e próximas ações.</p>
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

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Oportunidades" value={formatNumber(portfolioSummary.opportunities)} accent="orange" compact />
          <MetricCard title="Diagnósticos" value={formatNumber(diagnostics)} accent="blue" compact />
          <MetricCard title="Propostas" value={formatNumber(proposals)} accent="gray" compact />
          <MetricCard title="Potencial" value={`${formatCurrency(portfolioSummary.mappedPotential)}/mês`} accent="green" compact />
        </section>

        <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised shadow-none">
          {portfolioItems.length ? (
            <div className="grid gap-3 p-4 md:hidden">
              {portfolioItems.map((item) => (
                <article key={item.id} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-heading text-base font-bold text-bvbp-ink">{item.name}</h2>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
                        {item.segment || item.type}
                      </p>
                    </div>
                    <StatusBadge label={item.status} />
                  </div>
                  <div className="mt-4 grid gap-3 text-sm">
                    <p className="text-bvbp-muted-ink">
                      <span className="font-semibold text-bvbp-ink">Ponteiro:</span> {item.criticalPointer}
                    </p>
                    <p className="font-semibold text-bvbp-positive">{formatCurrency(item.mappedPotential)}/mês</p>
                    <p className="text-bvbp-muted-ink">{item.nextAction}</p>
                    <p className="text-bvbp-muted-ink">{item.owner}</p>
                  </div>
                  {item.companyId ? (
                    <div className="mt-4 flex justify-end">
                      <AdminClientActions
                        companyId={item.companyId}
                        companyName={item.name}
                        onOpenWorkspace={() => openClientWorkspace(item.companyId!)}
                        onDeleted={() => refreshPortfolio((current) => current + 1)}
                      />
                    </div>
                  ) : (
                    <p className="mt-4 text-sm font-semibold text-bvbp-ink">{item.actionLabel}</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="CRM vazio."
              description="Cadastre o primeiro cliente real para acompanhar ponteiro, potencial e próxima ação."
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
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="min-w-[180px] font-semibold text-bvbp-ink">{item.name}</TableCell>
                    <TableCell className="min-w-[150px] text-bvbp-ink">{item.segment || item.type}</TableCell>
                    <TableCell>
                      <StatusBadge label={item.status} />
                    </TableCell>
                    <TableCell className="min-w-[180px] text-bvbp-ink">{item.criticalPointer}</TableCell>
                    <TableCell className="font-semibold text-bvbp-positive">{formatCurrency(item.mappedPotential)}/mês</TableCell>
                    <TableCell className="min-w-[220px] text-bvbp-ink">{item.nextAction}</TableCell>
                    <TableCell className="min-w-[130px] text-bvbp-ink">{item.owner}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.companyId ? (
                          <AdminClientActions
                            companyId={item.companyId}
                            companyName={item.name}
                            onOpenWorkspace={() => openClientWorkspace(item.companyId!)}
                            onDeleted={() => refreshPortfolio((current) => current + 1)}
                          />
                        ) : (
                          <span className="text-sm font-semibold text-bvbp-ink">{item.actionLabel}</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default AdminClientsPage;
