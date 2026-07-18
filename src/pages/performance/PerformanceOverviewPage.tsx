import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { SectionHeader } from "@/components/performance/SectionHeader";
import { PerformancePageHeader } from "@/components/performance/PerformancePageHeader";
import {
  MaturityMapPanel,
  OverviewPillarCard,
  PrioritizedInitiativesList,
} from "@/components/performance/overview/OverviewCockpitSections";
import { type Company, type PdcaCycle } from "@/data/performanceSystem";
import { buildPerformanceOverviewModel, getAttentionPillar, type OverviewPillarSummary } from "@/lib/performanceOverviewModel";
import { getPdcaCyclesForCompany } from "@/lib/pdcaCycleStore";
import { getClientConfiguration } from "@/lib/clientConfigurationStore";

const PerformanceOverviewPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const location = useLocation();
  const navigate = useNavigate();
  const cycles = getPdcaCyclesForCompany(activeCompany);
  const configuration = getClientConfiguration(activeCompany);
  const currentValueByMetricId = new Map(configuration.metrics.flatMap((metric) => metric.currentValue === undefined ? [] : [[metric.id, metric.currentValue] as const]));
  const overview = buildPerformanceOverviewModel(activeCompany, cycles);
  const attentionPillar = getAttentionPillar(overview.pillarSummaries);
  const isAdminPortal = location.pathname.startsWith("/app/admin");
  const pointersHref = isAdminPortal ? "/app/admin/pointers" : "/app/performance/pointers";
  const initiativesHref = isAdminPortal ? "/app/admin/initiatives" : "/app/performance/initiatives";

  const openPillar = (pillar: OverviewPillarSummary) => navigate(`${pointersHref}?pillar=${pillar.id}`);
  const openInitiative = (cycle: PdcaCycle) => navigate(`${initiativesHref}?initiative=${cycle.id}`);

  return (
    <>
      <Helmet>
        <title>Visão geral | BVBP Performance System</title>
        <meta name="description" content="Painel executivo do Método BVBP de Performance Operacional." />
      </Helmet>

      <div className="space-y-7">
        <PerformancePageHeader
          title="Visão geral"
          description="Leitura executiva dos pilares, ponteiros e iniciativas prioritárias."
          showTitle={!isAdminPortal}
        />

        <section className="space-y-3">
          <SectionHeader title="Pilares e ponteiros" />
          <div className="grid items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {overview.pillarSummaries.map((pillar) => (
              <OverviewPillarCard key={pillar.id} pillar={pillar} highlighted={pillar.id === attentionPillar.id} onSelect={openPillar} />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <SectionHeader title="Mapa de maturidade" />
          <MaturityMapPanel pillars={overview.maturitySummaries} onSelect={openPillar} />
        </section>

        <section className="space-y-3">
          <SectionHeader title="Iniciativas priorizadas" />
          <PrioritizedInitiativesList initiatives={overview.prioritizedInitiatives} onSelect={openInitiative} currentValueByMetricId={currentValueByMetricId} />
        </section>
      </div>

    </>
  );
};

export default PerformanceOverviewPage;
