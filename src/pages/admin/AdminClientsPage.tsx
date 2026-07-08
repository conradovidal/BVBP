import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Pencil, Plus } from "lucide-react";
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
  bvbpPipelineOpportunities,
  getAdminClientPortfolioItems,
  getBvbpPipelinePotential,
} from "@/data/performanceSystem";
import { getExternalPortalCompanies, setActiveCompanyId } from "@/lib/clientPortalStore";
import { formatCurrency, formatNumber } from "@/lib/performanceFormatters";

const AdminClientsPage = () => {
  const navigate = useNavigate();
  const portfolioItems = getAdminClientPortfolioItems(getExternalPortalCompanies());
  const diagnostics = bvbpPipelineOpportunities.filter((opportunity) => opportunity.stage === "Diagnóstico").length;
  const proposals = bvbpPipelineOpportunities.filter((opportunity) => opportunity.stage === "Proposta").length;

  const openClientWorkspace = (companyId: string) => {
    setActiveCompanyId(companyId);
    navigate("/app/performance/overview");
  };

  return (
    <>
      <Helmet>
        <title>CRM | Portal BVBP</title>
      </Helmet>

      <div className="space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-bvbp-ink">CRM</h1>
            <p className="mt-1 text-sm text-bvbp-muted-ink">Pipeline comercial, clientes externos e próximas ações.</p>
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
          <MetricCard title="Oportunidades" value={formatNumber(bvbpPipelineOpportunities.length)} accent="orange" />
          <MetricCard title="Diagnósticos" value={formatNumber(diagnostics)} accent="blue" />
          <MetricCard title="Propostas" value={formatNumber(proposals)} accent="gray" />
          <MetricCard title="Potencial" value={`${formatCurrency(getBvbpPipelinePotential())}/mês`} accent="green" />
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
                    <div className="mt-4 grid gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full rounded-[8px] border-bvbp-forest bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark hover:text-bvbp-ivory"
                        onClick={() => openClientWorkspace(item.companyId)}
                      >
                        Abrir workspace
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button asChild size="sm" variant="outline" className="w-full rounded-[8px]">
                        <Link to={`/app/admin/clients/${item.companyId}/edit`}>
                          <Pencil className="h-4 w-4" />
                          Editar
                        </Link>
                      </Button>
                    </div>
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
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-[8px] border-bvbp-forest bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark hover:text-bvbp-ivory"
                              onClick={() => openClientWorkspace(item.companyId)}
                            >
                              Abrir workspace
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button asChild size="sm" variant="outline" className="rounded-[8px]">
                              <Link to={`/app/admin/clients/${item.companyId}/edit`}>
                                <Pencil className="h-4 w-4" />
                                Editar
                              </Link>
                            </Button>
                          </>
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
