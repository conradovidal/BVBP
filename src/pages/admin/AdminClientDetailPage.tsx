import { Helmet } from "react-helmet-async";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/performance/MetricCard";
import { StatusBadge } from "@/components/performance/StatusBadge";
import { createOverviewMetrics, getCompanyPortfolioSignal, isBvbpInternalWorkspace } from "@/data/performanceSystem";
import { getCompanyById, setActiveCompanyId } from "@/lib/clientPortalStore";
import { formatCurrency, formatMetricValue, formatNumber } from "@/lib/performanceFormatters";
import { getBvbpPdcaCycles } from "@/lib/pdcaCycleStore";

const metricLabels: Record<string, string> = {
  "metric-monthly-revenue": "Receita",
  "metric-margin": "Margem",
  "metric-operational-cost": "Custo",
  "metric-savings": "Potencial",
  "metric-revenue-risk": "Risco",
  "metric-active-cycles": "Ciclos",
};

const AdminClientDetailPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const company = getCompanyById(companyId);

  if (!company) return <Navigate to="/app/admin/clients" replace />;

  const isInternalWorkspace = isBvbpInternalWorkspace(company);
  const cycles = isInternalWorkspace ? getBvbpPdcaCycles() : [];
  const activeCycleCount = cycles.filter((cycle) => !["Padronizar", "Pausar"].includes(cycle.pdcaStatus)).length;
  const metrics = createOverviewMetrics(company).map((metric) =>
    isInternalWorkspace && metric.id === "metric-active-cycles" ? { ...metric, value: activeCycleCount } : metric
  );
  const signal = getCompanyPortfolioSignal(company);
  const openPerformance = () => {
    setActiveCompanyId(company.id);
    navigate("/app/performance/overview");
  };

  return (
    <>
      <Helmet>
        <title>{company.name} | Portal BVBP</title>
      </Helmet>

      <div className="space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/app/admin/clients" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#1B365D]">
              <ArrowLeft className="h-4 w-4" />
              Clientes
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl font-bold text-[#1B365D]">{company.name}</h1>
              <StatusBadge label={company.status || "Ativo"} />
            </div>
            <p className="mt-1 text-sm text-slate-500">{company.segment}</p>
          </div>
          <Button variant="corporate" onClick={openPerformance}>
            <BarChart3 className="h-4 w-4" />
            Abrir workspace
          </Button>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Crítico" value={signal.criticalPointer} accent="orange" />
          <MetricCard title="Potencial" value={`${formatCurrency(signal.mappedPotential)}/mês`} accent="green" />
          <MetricCard title="Alto risco" value={formatNumber(signal.highRiskProjects)} accent="orange" />
          <MetricCard title="Ciclos" value={formatNumber(isInternalWorkspace ? activeCycleCount : signal.activeCycles)} accent="blue" />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.slice(0, 6).map((metric) => (
            <MetricCard
              key={metric.id}
              title={metricLabels[metric.id] || metric.name}
              value={metric.id === "metric-savings" ? `${formatMetricValue(metric)}/mês` : formatMetricValue(metric)}
              accent={metric.category === "risk" ? "orange" : metric.category === "operational" ? "green" : "blue"}
            />
          ))}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-[#1B365D]">Acesso do cliente</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Contato</p>
              <p className="mt-1 text-sm font-bold text-[#1B365D]">{company.contactName || "Não informado"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">E-mail</p>
              <p className="mt-1 text-sm font-bold text-[#1B365D]">{company.contactEmail || "Não informado"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Escopo</p>
              <p className="mt-1 text-sm font-bold text-[#1B365D]">Performance System</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminClientDetailPage;
