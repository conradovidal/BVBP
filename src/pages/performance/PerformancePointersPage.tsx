import { Helmet } from "react-helmet-async";
import { useLocation, useOutletContext, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InitiativeDetailPanel } from "@/components/performance/initiatives/InitiativeDetailPanel";
import { MetricMeasurementDialog } from "@/components/performance/pointers/MetricMeasurementDialog";
import { ConnectedInitiativesPanel } from "@/components/performance/pointers/ConnectedInitiativesPanel";
import { PillarMaturityPanel } from "@/components/performance/pointers/PillarMaturityPanel";
import { PointerPillarSelector } from "@/components/performance/pointers/PointerPillarSelector";
import { PointerSummaryStrip } from "@/components/performance/pointers/PointerSummaryStrip";
import { PerformancePageHeader } from "@/components/performance/PerformancePageHeader";
import { type Company, type PdcaCycle } from "@/data/performanceSystem";
import {
  buildPerformancePointersModel,
  getActivePointerPillar,
  type PointerPillarId,
} from "@/lib/performancePointersModel";
import { getPdcaCyclesForCompany } from "@/lib/pdcaCycleStore";
import { getClientConfiguration, saveClientConfiguration } from "@/lib/clientConfigurationStore";
import { getPerformanceSession, isBvbpStaff } from "@/lib/performanceAuth";
import { addPdcaEvidence, addPdcaHistory, updatePdcaCycleFields, type EvidenceInput } from "@/lib/pdcaCycleStore";
import { getActivitiesForInitiatives, reorderInitiativeActivities, updateInitiativeActivityStatus, upsertInitiativeActivity, type InitiativeActivityInput, type InitiativeActivityStatus } from "@/lib/initiativeActivityStore";
import { formatWorkItemReference } from "@/lib/workItemReferences";

const blankEvidence: EvidenceInput = { description: "", type: "Comentário", observedValue: "", note: "" };

function blankActivity(initiative?: PdcaCycle | null): InitiativeActivityInput {
  return {
    initiativeId: initiative?.id || "",
    title: "",
    description: "",
    definitionOfDone: "",
    owner: initiative?.owner || "",
    startDate: "",
    endDate: initiative?.deadline || "",
    dueDate: initiative?.deadline || "",
    priority: "Média",
    status: "A fazer",
  };
}

const PerformancePointersPage = () => {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [, setConfigurationVersion] = useState(0);
  const [, setDataVersion] = useState(0);
  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string | null>(null);
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);
  const [evidenceForm, setEvidenceForm] = useState<EvidenceInput>(blankEvidence);
  const [activityForm, setActivityForm] = useState<InitiativeActivityInput>(blankActivity());
  const activePillarId = getActivePointerPillar(searchParams.get("pillar"));
  const cycles = getPdcaCyclesForCompany(activeCompany);
  const configuration = getClientConfiguration(activeCompany);
  const diagnostic = buildPerformancePointersModel(activeCompany, cycles, activePillarId);
  const isAdminPortal = location.pathname.startsWith("/app/admin");
  const performanceSession = getPerformanceSession();
  const canManageMaturity = isBvbpStaff(performanceSession);
  const selectedInitiative = cycles.find((initiative) => initiative.id === selectedInitiativeId) || null;
  const activities = getActivitiesForInitiatives(cycles);
  const selectedActivities = selectedInitiative ? activities.filter((activity) => activity.initiativeId === selectedInitiative.id) : [];
  const selectedMetric = configuration.metrics.find((metric) => metric.id === selectedMetricId);

  const refresh = () => {
    setDataVersion((current) => current + 1);
    setConfigurationVersion((current) => current + 1);
  };

  const openInitiative = (initiative: PdcaCycle) => {
    setSelectedInitiativeId(initiative.id);
    setEvidenceForm(blankEvidence);
    setActivityForm(blankActivity(initiative));
  };

  const saveInitiative = (initiativeId: string, patch: Parameters<typeof updatePdcaCycleFields>[2]) => {
    if (!canManageMaturity) return false;
    const saved = updatePdcaCycleFields(activeCompany, initiativeId, patch, performanceSession?.user.name);
    if (!saved) return false;
    refresh();
    return true;
  };

  const addEvidence = () => {
    if (!selectedInitiative || !evidenceForm.description.trim()) return;
    addPdcaEvidence(selectedInitiative.id, { ...evidenceForm, createdByName: performanceSession?.user.name });
    setEvidenceForm(blankEvidence);
    refresh();
  };

  const addActivity = () => {
    if (!selectedInitiative || !activityForm.title.trim()) return;
    const created = upsertInitiativeActivity({ ...activityForm, initiativeId: selectedInitiative.id });
    addPdcaHistory(selectedInitiative.id, { kind: "created", description: `${formatWorkItemReference(activeCompany, created.referenceNumber)}: atividade criada.`, createdByName: performanceSession?.user.name });
    setActivityForm(blankActivity(selectedInitiative));
    refresh();
  };

  const updateActivity = (input: InitiativeActivityInput) => {
    const previous = input.id ? selectedActivities.find((activity) => activity.id === input.id) : undefined;
    const updated = upsertInitiativeActivity(input);
    if (selectedInitiative && previous) {
      const reference = formatWorkItemReference(activeCompany, updated.referenceNumber);
      if (previous.priority !== updated.priority) {
        addPdcaHistory(selectedInitiative.id, {
          kind: "activity_priority",
          description: `${reference}: prioridade alterada de ${previous.priority || "A definir"} para ${updated.priority || "A definir"}.`,
          createdByName: performanceSession?.user.name,
        });
      }
      if ((previous.owner || "") !== (updated.owner || "")) {
        addPdcaHistory(selectedInitiative.id, {
          kind: "owner",
          description: `${reference}: responsável alterado de ${previous.owner || "A definir"} para ${updated.owner || "A definir"}.`,
          createdByName: performanceSession?.user.name,
        });
      }
      const previousDeadline = previous.endDate || previous.dueDate || "";
      const nextDeadline = updated.endDate || updated.dueDate || "";
      if (previousDeadline !== nextDeadline) {
        addPdcaHistory(selectedInitiative.id, {
          kind: "deadline",
          description: `${reference}: prazo alterado de ${previousDeadline || "Sem data"} para ${nextDeadline || "Sem data"}.`,
          createdByName: performanceSession?.user.name,
        });
      }
    }
    refresh();
  };

  const updateActivityStatus = (activityId: string, status: InitiativeActivityStatus) => {
    const previous = selectedActivities.find((activity) => activity.id === activityId);
    const updated = updateInitiativeActivityStatus(activityId, status);
    if (selectedInitiative && previous && updated && previous.status !== updated.status) {
      addPdcaHistory(selectedInitiative.id, {
        kind: "activity_status",
        description: `${formatWorkItemReference(activeCompany, updated.referenceNumber)}: status alterado de ${previous.status} para ${updated.status}.`,
        createdByName: performanceSession?.user.name,
      });
    }
    refresh();
  };

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

        <PointerSummaryStrip diagnostic={diagnostic} onUpdateMetric={canManageMaturity ? setSelectedMetricId : undefined} />

        <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <PillarMaturityPanel maturity={diagnostic.maturity} canManage={canManageMaturity} onToggleCriterion={toggleMaturityCriterion} />
          <ConnectedInitiativesPanel
            initiatives={diagnostic.initiatives}
            metrics={configuration.metrics}
            onOpenInitiative={openInitiative}
          />
        </section>
      </div>

      <MetricMeasurementDialog open={Boolean(selectedMetricId)} onOpenChange={(open) => !open && setSelectedMetricId(null)} company={activeCompany} metric={selectedMetric} createdByName={performanceSession?.user.name} onSaved={refresh} />

      <Dialog open={Boolean(selectedInitiative)} onOpenChange={(open) => !open && setSelectedInitiativeId(null)}>
        <DialogContent withinContentArea className="max-h-[92vh] max-w-6xl overflow-y-auto bg-bvbp-ivory p-0">
          <DialogHeader className="sr-only"><DialogTitle>{selectedInitiative?.title || "Detalhe da iniciativa"}</DialogTitle><DialogDescription>Detalhes, atividades, comentários e histórico.</DialogDescription></DialogHeader>
          <InitiativeDetailPanel
            initiative={selectedInitiative}
            company={activeCompany}
            activities={selectedActivities}
            activityForm={activityForm}
            evidenceForm={evidenceForm}
            canManageInitiative={canManageMaturity}
            configuration={configuration}
            onSaveInitiative={saveInitiative}
            onActivityFormChange={setActivityForm}
            onAddActivity={addActivity}
            onUpdateActivity={updateActivity}
            onActivityStatusChange={updateActivityStatus}
            onReorderActivities={(orderedIds) => { if (selectedInitiative) reorderInitiativeActivities(selectedInitiative.id, orderedIds); refresh(); }}
            onEvidenceFormChange={setEvidenceForm}
            onAddEvidence={addEvidence}
            onMetricUpdated={refresh}
            createdByName={performanceSession?.user.name}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PerformancePointersPage;
