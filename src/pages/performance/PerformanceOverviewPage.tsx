import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { SectionHeader } from "@/components/performance/SectionHeader";
import { StatusBadge } from "@/components/performance/StatusBadge";
import {
  ExecutiveReadingStrip,
  MaturityMapPanel,
  OverviewPillarCard,
  PrioritizedInitiativesList,
} from "@/components/performance/overview/OverviewCockpitSections";
import { type Company, type PdcaCycle, getCompanyRelationshipStatus, isBvbpInternalWorkspace } from "@/data/performanceSystem";
import { buildPerformanceOverviewModel, type OverviewPillarSummary } from "@/lib/performanceOverviewModel";
import { getPdcaCyclesForCompany } from "@/lib/pdcaCycleStore";

const PerformanceOverviewPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const location = useLocation();
  const navigate = useNavigate();
  const isInternalWorkspace = isBvbpInternalWorkspace(activeCompany);
  const cycles = getPdcaCyclesForCompany(activeCompany);
  const overview = buildPerformanceOverviewModel(activeCompany, cycles);
  const pageTitle = isInternalWorkspace ? "Portal BVBP" : "Visão geral";
  const isAdminPortal = location.pathname.startsWith("/app/admin");
  const pointersHref = isAdminPortal ? "/app/admin/pointers" : "/app/performance/pointers";
  const initiativesHref = isAdminPortal ? "/app/admin/initiatives" : "/app/performance/initiatives";
  const contextLabel = isInternalWorkspace ? "Workspace interno" : activeCompany.name;
  const relationshipStatus = getCompanyRelationshipStatus(activeCompany);

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
            {!isAdminPortal ? <h1 className="font-heading text-2xl font-bold text-bvbp-ink sm:text-3xl">{pageTitle}</h1> : null}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold text-bvbp-ink">{contextLabel}</p>
              {relationshipStatus && <StatusBadge label={relationshipStatus} />}
            </div>
            {activeCompany.description && (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-bvbp-muted-ink">{activeCompany.description}</p>
            )}
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
