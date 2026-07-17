import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AdminClientActions } from "@/components/admin/AdminClientActions";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/performance/EmptyState";
import { MetricCard } from "@/components/performance/MetricCard";
import { StatusBadge } from "@/components/performance/StatusBadge";
import { getExternalPortalCompanies, setActiveCompanyId } from "@/lib/clientPortalStore";
import { getClientConfiguration } from "@/lib/clientConfigurationStore";
import { getPdcaCyclesForCompany } from "@/lib/pdcaCycleStore";
import { isOverviewCycleActive } from "@/lib/performanceOverviewModel";
import { formatNumber } from "@/lib/performanceFormatters";

const AdminClientsPage = () => {
  const navigate = useNavigate();
  const [, refreshPortfolio] = useState(0);
  const companies = getExternalPortalCompanies();
  const portfolioItems = companies.map((company) => {
    const configuration = getClientConfiguration(company);
    const initiatives = getPdcaCyclesForCompany(company);
    const activeInitiatives = initiatives.filter(isOverviewCycleActive);
    const nextDecision = activeInitiatives.find((initiative) => initiative.nextDecision.trim())?.nextDecision;
    const pointerCount = configuration.pillars.reduce((total, pillar) => total + pillar.selectedMetricIds.length, 0);
    const criticalCount = configuration.pillars.filter((pillar) => Boolean(pillar.criticalMetricId)).length;

    return {
      company,
      pointerCount,
      criticalCount,
      activeInitiativeCount: activeInitiatives.length,
      nextDecision: nextDecision || "Definir próxima ação",
      owner: company.bvbpOwner || "A definir",
    };
  });
  const prospectCount = companies.filter((company) => (company.relationshipStatus || company.status) === "Prospect").length;
  const pointerCount = portfolioItems.reduce((total, item) => total + item.pointerCount, 0);
  const activeInitiativeCount = portfolioItems.reduce((total, item) => total + item.activeInitiativeCount, 0);

  const openClientWorkspace = (companyId: string) => {
    setActiveCompanyId(companyId);
    navigate("/app/performance/overview");
  };

  return (
    <>
      <Helmet><title>CRM | Portal BVBP</title></Helmet>

      <div className="space-y-5">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm text-bvbp-muted-ink">Clientes, diagnóstico e próximas decisões.</p>
          <Button asChild className="bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark">
            <Link to="/app/admin/clients/new"><Plus className="h-4 w-4" />Novo cliente</Link>
          </Button>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Clientes" value={formatNumber(companies.length)} accent="blue" compact />
          <MetricCard title="Prospects" value={formatNumber(prospectCount)} accent="gray" compact />
          <MetricCard title="Ponteiros selecionados" value={formatNumber(pointerCount)} accent="green" compact />
          <MetricCard title="Iniciativas ativas" value={formatNumber(activeInitiativeCount)} accent="green" compact />
        </section>

        <section className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised">
          {portfolioItems.length ? (
            <>
              <div className="hidden grid-cols-[minmax(150px,1.1fr)_110px_minmax(150px,0.8fr)_minmax(180px,1.2fr)_44px] gap-3 border-b border-bvbp-ink/10 px-4 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink lg:grid">
                <span>Cliente</span><span>Status</span><span>Ponteiros</span><span>Próxima decisão</span><span className="sr-only">Ações</span>
              </div>
              <div className="divide-y divide-bvbp-ink/10">
                {portfolioItems.map(({ company, pointerCount: itemPointerCount, criticalCount, nextDecision, owner }) => (
                  <article key={company.id} className="grid gap-3 p-4 lg:grid-cols-[minmax(150px,1.1fr)_110px_minmax(150px,0.8fr)_minmax(180px,1.2fr)_44px] lg:items-center">
                    <div className="min-w-0">
                      <h2 className="truncate font-heading text-base font-semibold text-bvbp-ink">{company.name}</h2>
                      <p className="mt-1 truncate text-xs text-bvbp-muted-ink">{company.segment || "Segmento a definir"}</p>
                    </div>
                    <div><StatusBadge label={company.relationshipStatus || company.status || "Prospect"} /></div>
                    <div className="text-sm text-bvbp-ink">
                      <p className="font-semibold">{itemPointerCount} selecionado(s)</p>
                      <p className="mt-1 text-xs text-bvbp-muted-ink">{criticalCount} crítico(s)</p>
                    </div>
                    <div className="min-w-0 text-sm text-bvbp-ink">
                      <p className="line-clamp-2">{nextDecision}</p>
                      <p className="mt-1 text-xs text-bvbp-muted-ink">Responsável: {owner}</p>
                    </div>
                    <AdminClientActions
                      companyId={company.id}
                      companyName={company.name}
                      onOpenWorkspace={() => openClientWorkspace(company.id)}
                      onDeleted={() => refreshPortfolio((current) => current + 1)}
                    />
                  </article>
                ))}
              </div>
            </>
          ) : (
            <EmptyState title="CRM vazio." description="Cadastre o primeiro cliente real para começar o diagnóstico." className="m-4" />
          )}
        </section>
      </div>
    </>
  );
};

export default AdminClientsPage;
