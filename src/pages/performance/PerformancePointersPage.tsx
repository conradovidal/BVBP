import { Helmet } from "react-helmet-async";
import { useLocation, useOutletContext, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ConnectedInitiativesPanel } from "@/components/performance/pointers/ConnectedInitiativesPanel";
import { PillarMaturityPanel } from "@/components/performance/pointers/PillarMaturityPanel";
import { PointerPillarSelector } from "@/components/performance/pointers/PointerPillarSelector";
import { PointerSummaryStrip } from "@/components/performance/pointers/PointerSummaryStrip";
import { PerformancePageHeader } from "@/components/performance/PerformancePageHeader";
import { type Company } from "@/data/performanceSystem";
import {
  buildPerformancePointersModel,
  getActivePointerPillar,
  type PointerPillarId,
} from "@/lib/performancePointersModel";
import { getPdcaCyclesForCompany } from "@/lib/pdcaCycleStore";
import { getClientConfiguration, saveClientConfiguration } from "@/lib/clientConfigurationStore";
import { getPerformanceSession, isBvbpStaff } from "@/lib/performanceAuth";

const PerformancePointersPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [, setConfigurationVersion] = useState(0);
  const activePillarId = getActivePointerPillar(searchParams.get("pillar"));
  const cycles = getPdcaCyclesForCompany(activeCompany);
  const diagnostic = buildPerformancePointersModel(activeCompany, cycles, activePillarId);
  const initiativesHref = location.pathname.startsWith("/app/admin") ? "/app/admin/initiatives" : "/app/performance/initiatives";
  const isAdminPortal = location.pathname.startsWith("/app/admin");
  const canManageMaturity = isBvbpStaff(getPerformanceSession());

  const toggleMaturityCriterion = (criterionId: string) => {
    if (!canManageMaturity) return;
    const configuration = getClientConfiguration(activeCompany);
    const nextConfiguration = {
      ...configuration,
      pillars: configuration.pillars.map((pillar) => {
        if (pillar.pillar !== activePillarId) return pillar;
        const completed = new Set(pillar.completedMaturityCriterionIds);
        if (completed.has(criterionId)) completed.delete(criterionId);
        else completed.add(criterionId);
        return { ...pillar, completedMaturityCriterionIds: Array.from(completed) };
      }),
    };
    saveClientConfiguration(nextConfiguration);
    setConfigurationVersion((current) => current + 1);
  };

  const setPillar = (pillarId: PointerPillarId) => {
    setSearchParams(pillarId === "financial" ? {} : { pillar: pillarId });
  };

  return (
    <>
      <Helmet>
        <title>Ponteiros | BVBP Performance System</title>
        <meta name="description" content="Ponteiros, dores e iniciativas por pilar do Método BVBP." />
      </Helmet>

      <div className={isAdminPortal ? "space-y-5" : "space-y-7"}>
        <PerformancePageHeader
          title="Ponteiros"
          description="Ponteiros, dores e iniciativas por pilar."
          showTitle={!isAdminPortal}
        />

        <PointerPillarSelector
          pillars={diagnostic.pillars}
          activePillarId={diagnostic.activePillar.id}
          onSelect={setPillar}
        />

        <PointerSummaryStrip diagnostic={diagnostic} />

        <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <ConnectedInitiativesPanel
            initiatives={diagnostic.initiatives}
            initiativesHref={initiativesHref}
          />
          <PillarMaturityPanel maturity={diagnostic.maturity} canManage={canManageMaturity} onToggleCriterion={toggleMaturityCriterion} />
        </section>
      </div>
    </>
  );
};

export default PerformancePointersPage;
