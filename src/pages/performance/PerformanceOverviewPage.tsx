import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useOutletContext } from "react-router-dom";
import { PerformanceDetailDialog, type PerformanceDetail } from "@/components/performance/PerformanceDetailDialog";
import { SectionHeader } from "@/components/performance/SectionHeader";
import { StatusBadge } from "@/components/performance/StatusBadge";
import {
  ExecutiveReadingStrip,
  MaturityMapPanel,
  OverviewPillarCard,
  PillarOverviewDetailDialog,
  PrioritizedInitiativesList,
} from "@/components/performance/overview/OverviewCockpitSections";
import { type Company, type PdcaCycle, getCompanyRelationshipStatus, isBvbpInternalWorkspace } from "@/data/performanceSystem";
import {
  buildPerformanceOverviewModel,
  type OverviewPillarSummary,
} from "@/lib/performanceOverviewModel";
import { getPdcaCyclesForCompany } from "@/lib/pdcaCycleStore";

function initiativeDetail(cycle: PdcaCycle): PerformanceDetail {
  return {
    title: cycle.title,
    subtitle: `${cycle.affectedPointer} · ${cycle.pdcaStatus}`,
    status: cycle.pdcaStatus,
    affectedPointer: cycle.affectedPointer,
    estimatedImpact: cycle.estimatedImpact,
    description: cycle.hypothesis,
    whyItMatters: cycle.whyItMatters,
    facts: [
      { label: "Responsável", value: cycle.owner },
      { label: "Início", value: cycle.startDate || "A confirmar" },
      { label: "Fim", value: cycle.endDate || cycle.deadline },
      { label: "Baseline", value: cycle.baseline || "A confirmar" },
      { label: "Objetivo", value: cycle.target || "A confirmar" },
    ],
    evidence: cycle.evidences.map((evidence) => evidence.description),
    connectedActions: cycle.actions?.map((action) => `${action.title} · ${action.owner}`) || [cycle.plannedAction],
    nextDecision: cycle.nextDecision,
  };
}

const PerformanceOverviewPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const location = useLocation();
  const [selectedPillar, setSelectedPillar] = useState<OverviewPillarSummary | null>(null);
  const [initiative, setInitiative] = useState<PerformanceDetail | null>(null);
  const isInternalWorkspace = isBvbpInternalWorkspace(activeCompany);
  const cycles = getPdcaCyclesForCompany(activeCompany);
  const overview = buildPerformanceOverviewModel(activeCompany, cycles);
  const pageTitle = isInternalWorkspace ? "Portal BVBP" : "Visão geral";
  const isAdminPortal = location.pathname.startsWith("/app/admin");
  const contextLabel = isInternalWorkspace ? "Workspace interno" : activeCompany.name;
  const relationshipStatus = getCompanyRelationshipStatus(activeCompany);

  const openInitiative = (cycle: PdcaCycle) => {
    setInitiative(initiativeDetail(cycle));
  };

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
              <OverviewPillarCard key={pillar.id} pillar={pillar} onSelect={setSelectedPillar} />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <SectionHeader title="Mapa BVBP de maturidade" />
          <MaturityMapPanel pillars={overview.maturitySummaries} onSelect={setSelectedPillar} />
        </section>

        <section className="space-y-3">
          <SectionHeader title="Iniciativas priorizadas" />
          <PrioritizedInitiativesList initiatives={overview.prioritizedInitiatives} onSelect={openInitiative} />
        </section>
      </div>

      <PillarOverviewDetailDialog
        pillar={selectedPillar}
        open={Boolean(selectedPillar)}
        onOpenChange={(open) => !open && setSelectedPillar(null)}
      />
      <PerformanceDetailDialog
        detail={initiative}
        open={Boolean(initiative)}
        onOpenChange={(open) => !open && setInitiative(null)}
      />
    </>
  );
};

export default PerformanceOverviewPage;
