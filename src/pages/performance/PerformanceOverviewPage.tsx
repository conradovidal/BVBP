import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { SectionHeader } from "@/components/performance/SectionHeader";
import {
  ExecutiveReadingStrip,
  MaturityMapPanel,
  OverviewPillarCard,
  PrioritizedInitiativesList,
} from "@/components/performance/overview/OverviewCockpitSections";
import { type Company, type PdcaCycle } from "@/data/performanceSystem";
import { buildPerformanceOverviewModel, type OverviewPillarSummary } from "@/lib/performanceOverviewModel";
import { getPdcaCyclesForCompany } from "@/lib/pdcaCycleStore";

const PerformanceOverviewPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const location = useLocation();
  const navigate = useNavigate();
  const cycles = getPdcaCyclesForCompany(activeCompany);
  const overview = buildPerformanceOverviewModel(activeCompany, cycles);
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
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            {!isAdminPortal ? <h1 className="font-heading text-2xl font-bold text-bvbp-ink sm:text-3xl">Visão geral</h1> : null}
            <p className="mt-1 max-w-2xl text-sm leading-5 text-bvbp-muted-ink">
              Leitura executiva dos pilares, ponteiros e iniciativas prioritárias.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <SectionHeader title="Leitura executiva" />
          <ExecutiveReadingStrip items={overview.executiveReading} />
        </section>

        <section className="space-y-3">
          <SectionHeader title="Pilares e ponteiros principais" />
          <div className="grid items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {overview.pillarSummaries.map((pillar) => (
              <OverviewPillarCard key={pillar.id} pillar={pillar} onSelect={openPillar} />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <SectionHeader title="Mapa BVBP de maturidade" />
          <MaturityMapPanel pillars={overview.maturitySummaries} onSelect={openPillar} />
        </section>

        <section className="space-y-3">
          <SectionHeader title="Iniciativas priorizadas" />
          <PrioritizedInitiativesList initiatives={overview.prioritizedInitiatives} onSelect={openInitiative} />
        </section>
      </div>

    </>
  );
};

export default PerformanceOverviewPage;
