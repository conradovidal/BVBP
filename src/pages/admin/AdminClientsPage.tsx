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
import { getPdcaCyclesForCompany } from "@/lib/pdcaCycleStore";
import {
  buildPerformanceOverviewModel,
  getAttentionPillar,
  getPortfolioNextDecision,
  isOverviewCycleActive,
} from "@/lib/performanceOverviewModel";
import { formatNumber } from "@/lib/performanceFormatters";

const AdminClientsPage = () => {
  const navigate = useNavigate();
  const [, refreshPortfolio] = useState(0);
  const companies = getExternalPortalCompanies();
  const portfolioItems = companies.map((company) => {
    const initiatives = getPdcaCyclesForCompany(company);
    const activeInitiatives = initiatives.filter(isOverviewCycleActive);
    const overview = buildPerformanceOverviewModel(company, initiatives);
    const attentionPillar = getAttentionPillar(overview.pillarSummaries);
    const nextDecision = getPortfolioNextDecision(overview);
    const pointerCount = overview.pillarSummaries.reduce((total, pillar) => total + pillar.metricCount, 0);
    const criticalCount = overview.pillarSummaries.filter((pillar) => pillar.primaryMetricName !== "Ponteiro a definir").length;
    const minimumMaturity = Math.min(...overview.pillarSummaries.map((pillar) => pillar.maturityLevel));

    return {
      company,
      pointerCount,
      criticalCount,
      activeInitiativeCount: activeInitiatives.length,
      minimumMaturity,
      attentionPillar,
      nextDecision,
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
              <div className="hidden grid-cols-[minmax(150px,0.9fr)_minmax(170px,0.9fr)_minmax(220px,1.4fr)_104px] gap-4 border-b border-bvbp-ink/10 px-4 py-3 font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink lg:grid">
                <span>Cliente</span><span>Diagnóstico</span><span>Próxima decisão</span><span>Ações</span>
              </div>
              <div className="divide-y divide-bvbp-ink/10">
                {portfolioItems.map(({ company, pointerCount: itemPointerCount, criticalCount, minimumMaturity, attentionPillar, nextDecision }) => (
                  <article key={company.id} className="grid gap-4 p-4 lg:grid-cols-[minmax(150px,0.9fr)_minmax(170px,0.9fr)_minmax(220px,1.4fr)_104px] lg:items-center">
                    <div className="min-w-0">
                      <h2 className="truncate font-heading text-base font-semibold text-bvbp-ink">{company.name}</h2>
                      <p className="mt-1 truncate text-xs text-bvbp-muted-ink">{company.segment || "Segmento a definir"}</p>
                      <div className="mt-2"><StatusBadge label={company.relationshipStatus || company.status || "Prospect"} /></div>
                    </div>
                    <div className="min-w-0 text-sm text-bvbp-ink">
                      <p className="font-semibold">{attentionPillar.label} · {attentionPillar.primaryMetricName}</p>
                      <p className="mt-1 text-xs leading-5 text-bvbp-muted-ink">
                        Maturidade mínima {minimumMaturity}/5 · {criticalCount}/4 críticos
                      </p>
                      <p className="text-xs leading-5 text-bvbp-muted-ink">{itemPointerCount} ponteiros acompanhados</p>
                    </div>
                    <div className="min-w-0 text-sm text-bvbp-ink">
                      <p className="line-clamp-2 font-medium leading-5">{nextDecision.title}</p>
                      <p className="mt-1 text-xs leading-5 text-bvbp-muted-ink">
                        {nextDecision.pillarLabel} · {nextDecision.context}
                        {nextDecision.owner ? ` · ${nextDecision.owner}` : ""}
                      </p>
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
