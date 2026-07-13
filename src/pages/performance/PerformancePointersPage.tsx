import { Helmet } from "react-helmet-async";
import { useLocation, useOutletContext, useSearchParams } from "react-router-dom";
import { ConnectedInitiativesPanel } from "@/components/performance/pointers/ConnectedInitiativesPanel";
import { CriticalPointerPanel } from "@/components/performance/pointers/CriticalPointerPanel";
import { NextDecisionPanel } from "@/components/performance/pointers/NextDecisionPanel";
import { PillarMaturityPanel } from "@/components/performance/pointers/PillarMaturityPanel";
import { PillarPainsPanel } from "@/components/performance/pointers/PillarPainsPanel";
import { PointerPillarSelector } from "@/components/performance/pointers/PointerPillarSelector";
import { TrackedMetricsGrid } from "@/components/performance/pointers/TrackedMetricsGrid";
import { SectionHeader } from "@/components/performance/SectionHeader";
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

  const setPillar = (pillarId: PointerPillarId) => {
    setSearchParams(pillarId === "financial" ? {} : { pillar: pillarId });
  };

  return (
    <>
      <Helmet>
        <title>Ponteiros | BVBP Performance System</title>
        <meta name="description" content="Ponteiros, dores e iniciativas por pilar do Método BVBP." />
      </Helmet>

      <div className="space-y-7">
        <section className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-bvbp-ink sm:text-3xl">Ponteiros</h1>
          <p className="text-sm font-semibold text-bvbp-ink">{activeCompany.name}</p>
          <p className="max-w-2xl text-sm leading-6 text-bvbp-muted-ink">
            Ponteiros, dores e iniciativas por pilar.
          </p>
        </section>

        <PointerPillarSelector
          pillars={diagnostic.pillars}
          activePillarId={diagnostic.activePillar.id}
          onSelect={setPillar}
        />

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <CriticalPointerPanel pointer={diagnostic.criticalPointer} />
          <NextDecisionPanel nextDecision={diagnostic.nextDecision} />
        </section>

        <section className="space-y-3">
          <SectionHeader
            title="Ponteiros acompanhados"
            description={`${diagnostic.activePillar.label} · ${diagnostic.activePillar.description}`}
          />
          <TrackedMetricsGrid metrics={diagnostic.metrics} />
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <PillarPainsPanel pains={diagnostic.pains} />
          <PillarMaturityPanel maturity={diagnostic.maturity} />
        </section>

        <ConnectedInitiativesPanel
          initiatives={diagnostic.initiatives}
          initiativesHref={initiativesHref}
        />
      </div>
    </>
  );
};

export default PerformancePointersPage;
