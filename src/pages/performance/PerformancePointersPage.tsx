import { Helmet } from "react-helmet-async";
import { useLocation, useOutletContext, useSearchParams } from "react-router-dom";
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

const PerformancePointersPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const activePillarId = getActivePointerPillar(searchParams.get("pillar"));
  const cycles = getPdcaCyclesForCompany(activeCompany);
  const diagnostic = buildPerformancePointersModel(activeCompany, cycles, activePillarId);
  const initiativesHref = location.pathname.startsWith("/app/admin") ? "/app/admin/initiatives" : "/app/performance/initiatives";
  const isAdminPortal = location.pathname.startsWith("/app/admin");

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
          <PillarMaturityPanel maturity={diagnostic.maturity} />
          <ConnectedInitiativesPanel
            initiatives={diagnostic.initiatives}
            initiativesHref={initiativesHref}
          />
        </section>
      </div>
    </>
  );
};

export default PerformancePointersPage;
