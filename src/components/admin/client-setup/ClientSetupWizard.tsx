import { useMemo, useState } from "react";
import { Ban, CheckCircle2, History, KeyRound, LockKeyhole, Plus, RefreshCw, Save, Send, Star, Trash2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  type BvbpPillarId,
  type ClientBudgetMethod,
  type ClientBudgetRangeId,
  type ClientContact,
  type ClientContactAccessLevel,
  type ClientConfiguration,
  type ClientMetricConfig,
  type ClientMetricUnit,
  type ClientMetricDirection,
  type ClientPillarConfig,
  type ClientRelationshipStatus,
  type ClientRelationshipEvent,
  type ClientRelationshipEventType,
  type ClientRevenueRangeId,
  type Company,
  type MaturityLevel,
  bvbpPillarIds,
  bvbpPillarLabels,
  clientBudgetRanges,
  clientRevenueRanges,
  clientSegmentOptions,
  getPillarMaturityState,
  maturityDefinitionsByPillar,
  painCatalogByPillar,
  relationshipStatuses,
} from "@/data/performanceSystem";
import { toast } from "@/hooks/use-toast";
import {
  type ClientSetupInput,
  clientMetricUnitLabels,
} from "@/lib/clientConfigurationStore";
import { sendClientContactAccessAction, syncCompanyToSupabase } from "@/lib/clientPortalSupabase";
import { getPerformanceSession } from "@/lib/performanceAuth";
import { cn } from "@/lib/utils";

interface ClientSetupCompanyForm {
  name: string;
  segment: string;
  segmentPreset: string;
  description: string;
  relationshipStatus: ClientRelationshipStatus;
  bvbpOwner: string;
  companySize: string;
  employees: string;
  monthlyRevenue: string;
  recurringRevenue: string;
  monthlyOperationalCost: string;
  reportedRevenue: string;
  revenueRangeId: ClientRevenueRangeId;
  budgetMethod: ClientBudgetMethod;
  budgetAmount: string;
  budgetRangeId: ClientBudgetRangeId;
  budgetPercentage: string;
  contacts: ClientContact[];
  relationshipEvents: ClientRelationshipEvent[];
  startDate: string;
}

interface ClientSetupFormState {
  company: ClientSetupCompanyForm;
  configuration: Omit<ClientConfiguration, "companyId">;
}

type ContactAccessAction = "invite" | "resend" | "disable";

interface ClientSetupWizardProps {
  mode: "create" | "edit";
  company?: Company;
  configuration: ClientConfiguration;
  onCancel: () => void;
  onSave: (input: ClientSetupInput) => Promise<void>;
  onSaveDraft: (input: ClientSetupInput) => Promise<void>;
}

interface StepProps {
  state: ClientSetupFormState;
  updateCompanyField: <K extends keyof ClientSetupCompanyForm>(field: K, value: ClientSetupCompanyForm[K]) => void;
  updatePillar: (pillarId: BvbpPillarId, patch: Partial<ClientPillarConfig>) => void;
  togglePain: (pillarId: BvbpPillarId, pain: string) => void;
  toggleMetric: (pillarId: BvbpPillarId, metricId: string) => void;
  updateMetric: (metricId: string, patch: Partial<ClientMetricConfig>) => void;
  addCustomMetric: (metric: ClientMetricConfig) => void;
  addCustomPain: (pillarId: BvbpPillarId, pain: string) => void;
  addContact: () => void;
  updateContact: (contactId: string, patch: Partial<ClientContact>) => void;
  removeContact: (contactId: string) => void;
  setPrimaryContact: (contactId: string) => void;
  mode: "create" | "edit";
  companyId?: string;
  contactAccessLoadingId?: string;
  onContactAccessAction: (contact: ClientContact, action: ContactAccessAction) => void;
}

const steps = ["Dados", "Dores", "Ponteiros", "Maturidade", "Revisão"] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contactAccessStatusLabels: Record<ClientContact["accessStatus"], string> = {
  planned: "Acesso previsto",
  invited: "Convite enviado",
  active: "Acesso ativo",
  disabled: "Acesso desativado",
};
const contactAccessLevelLabels: Record<ClientContactAccessLevel, string> = {
  collaborator: "Colaborador",
  viewer: "Somente leitura",
};
const relationshipEventTypeLabels: Record<ClientRelationshipEventType, string> = {
  meeting: "Reunião",
  proposal: "Proposta",
  follow_up: "Follow-up",
  contract_start: "Início do contrato",
  note: "Registro geral",
};
const metricDirectionLabels: Record<ClientMetricDirection, string> = {
  higher: "Quanto maior, melhor",
  lower: "Quanto menor, melhor",
  target: "Mais próximo da meta, melhor",
};
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const defaultCompanyForm: ClientSetupCompanyForm = {
  name: "",
  segment: "",
  segmentPreset: "",
  description: "",
  relationshipStatus: "Prospect",
  bvbpOwner: "BVBP",
  companySize: "",
  employees: "",
  monthlyRevenue: "",
  recurringRevenue: "",
  monthlyOperationalCost: "",
  reportedRevenue: "",
  revenueRangeId: "not_informed",
  budgetMethod: "defined",
  budgetAmount: "",
  budgetRangeId: "undefined",
  budgetPercentage: "",
  contacts: [],
  relationshipEvents: [],
  startDate: "",
};

function toStringValue(value: number | string | undefined) {
  if (value === undefined || value === null) return "";
  return String(value);
}

function toNumber(value: string) {
  return Number(value.replace(",", ".")) || 0;
}

function toOptionalNumber(value: string) {
  if (!value.trim()) return undefined;
  return Number(value.replace(",", ".")) || undefined;
}

function createInitialState(company: Company | undefined, configuration: ClientConfiguration): ClientSetupFormState {
  const contacts = company?.contacts?.length
    ? company.contacts.map((contact) => ({ ...contact }))
    : company?.contactName || company?.contactEmail
      ? [{
          id: `contact-${company?.id || "draft"}-primary`,
          name: company?.contactName || "",
          email: company?.contactEmail || "",
          title: "",
          accessLevel: "collaborator" as const,
          isPrimary: true,
          accessStatus: "planned" as const,
        }]
      : [];

  return {
    company: {
      ...defaultCompanyForm,
      name: company?.name || "",
      segment: company?.segment || "",
      segmentPreset: clientSegmentOptions.includes(company?.segment as (typeof clientSegmentOptions)[number])
        ? company?.segment || ""
        : company?.segment
          ? "other"
          : "",
      description: company?.description || "",
      relationshipStatus: company?.relationshipStatus || company?.status || "Onboarding",
      bvbpOwner: company?.bvbpOwner || "BVBP",
      companySize: company?.companySize || "",
      employees: toStringValue(company?.employees ?? defaultCompanyForm.employees),
      monthlyRevenue: toStringValue(company?.monthlyRevenue ?? defaultCompanyForm.monthlyRevenue),
      recurringRevenue: toStringValue(company?.recurringRevenue ?? defaultCompanyForm.recurringRevenue),
      monthlyOperationalCost: toStringValue(company?.monthlyOperationalCost ?? defaultCompanyForm.monthlyOperationalCost),
      reportedRevenue: toStringValue(company?.reportedRevenue),
      revenueRangeId: company?.revenueRangeId || "not_informed",
      budgetMethod: company?.budgetMethod || "defined",
      budgetAmount: toStringValue(company?.budgetAmount),
      budgetRangeId: company?.budgetRangeId || "undefined",
      budgetPercentage: toStringValue(company?.budgetPercentage),
      contacts,
      relationshipEvents: company?.relationshipEvents || [],
      startDate: company?.startDate || "",
    },
    configuration: {
      schemaVersion: 2,
      pillars: configuration.pillars,
      metrics: configuration.metrics,
    },
  };
}

function getPillarConfig(state: ClientSetupFormState, pillarId: BvbpPillarId) {
  return state.configuration.pillars.find((pillar) => pillar.pillar === pillarId);
}

function getPillarMetrics(state: ClientSetupFormState, pillarId: BvbpPillarId) {
  return state.configuration.metrics.filter((metric) => metric.pillar === pillarId);
}

function getMetricValue(state: ClientSetupFormState, metricIds: string[]) {
  return state.configuration.metrics.find((metric) => metricIds.includes(metric.id) && metric.currentValue !== undefined)?.currentValue;
}

function buildSaveInput(state: ClientSetupFormState): ClientSetupInput {
  const monthlyRevenue =
    getMetricValue(state, ["financial-faturamento"]) ??
    toNumber(state.company.monthlyRevenue);
  const monthlyOperationalCost =
    getMetricValue(state, ["financial-custo-operacional", "operation-custo-operacional-mensal"]) ??
    toNumber(state.company.monthlyOperationalCost);
  const primaryContact = state.company.contacts.find((contact) => contact.isPrimary);
  const reportedRevenue = toOptionalNumber(state.company.reportedRevenue);
  const budgetPercentage = toOptionalNumber(state.company.budgetPercentage);
  const budgetAmount = toOptionalNumber(state.company.budgetAmount);

  return {
    company: {
      name: state.company.name,
      segment: state.company.segment,
      description: state.company.description,
      relationshipStatus: state.company.relationshipStatus,
      bvbpOwner: state.company.bvbpOwner,
      companySize: state.company.companySize,
      employees: toNumber(state.company.employees),
      monthlyRevenue,
      recurringRevenue: toNumber(state.company.recurringRevenue),
      monthlyOperationalCost,
      reportedRevenue,
      revenueRangeId: state.company.revenueRangeId,
      budgetMethod: state.company.budgetMethod,
      budgetAmount,
      budgetRangeId: state.company.budgetRangeId,
      budgetPercentage,
      startDate: state.company.startDate,
      contactName: primaryContact?.name || "",
      contactEmail: primaryContact?.email || "",
      contacts: state.company.contacts,
      relationshipEvents: state.company.relationshipEvents,
    },
    configuration: state.configuration,
  };
}

function buildCompanySnapshot(companyId: string, state: ClientSetupFormState): Company {
  const input = buildSaveInput(state).company;

  return {
    id: companyId,
    name: input.name.trim(),
    segment: input.segment.trim(),
    employees: input.employees,
    monthlyRevenue: input.monthlyRevenue,
    recurringRevenue: input.recurringRevenue,
    monthlyOperationalCost: input.monthlyOperationalCost,
    description: input.description?.trim() || undefined,
    bvbpOwner: input.bvbpOwner?.trim() || undefined,
    companySize: input.companySize?.trim() || undefined,
    reportedRevenue: input.reportedRevenue,
    revenueRangeId: input.revenueRangeId,
    budgetMethod: input.budgetMethod,
    budgetAmount: input.budgetAmount,
    budgetRangeId: input.budgetRangeId,
    budgetPercentage: input.budgetPercentage,
    startDate: input.startDate?.trim() || undefined,
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    contacts: input.contacts,
    relationshipEvents: input.relationshipEvents,
    relationshipStatus: input.relationshipStatus,
    status: input.relationshipStatus,
  };
}

export function ClientSetupWizard({ mode, company, configuration, onCancel, onSave, onSaveDraft }: ClientSetupWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [state, setState] = useState(() => createInitialState(company, configuration));
  const [savedStateSnapshot, setSavedStateSnapshot] = useState(() => JSON.stringify(createInitialState(company, configuration)));
  const [hasSavedDraft, setHasSavedDraft] = useState(mode === "edit");
  const [savingAction, setSavingAction] = useState<"draft" | "final">();
  const [contactAccessLoadingId, setContactAccessLoadingId] = useState<string>();
  const isBasicValid = state.company.name.trim().length > 1 && state.company.segment.trim().length > 1;
  const areContactsValid =
    state.company.contacts.every((contact) => (
      contact.name.trim().length > 1 &&
      EMAIL_PATTERN.test(contact.email.trim()) &&
      Boolean(contact.title?.trim())
    )) &&
    (state.company.contacts.length === 0 || state.company.contacts.filter((contact) => contact.isPrimary).length === 1);
  const selectedMetricIds = new Set(state.configuration.pillars.flatMap((pillar) => pillar.selectedMetricIds));
  const arePointersValid = state.configuration.metrics.every((metric) => (
    !selectedMetricIds.has(metric.id) ||
    metric.currentValue === undefined ||
    Boolean(metric.source?.trim())
  ));
  const isCurrentStepValid =
    activeStep === 0
      ? isBasicValid && areContactsValid
      : activeStep === 2
        ? arePointersValid
        : true;
  const canSaveDraft = state.company.name.trim().length > 1;
  const isDirty = JSON.stringify(state) !== savedStateSnapshot;

  const updateCompanyField = <K extends keyof ClientSetupCompanyForm>(field: K, value: ClientSetupCompanyForm[K]) => {
    setState((current) => ({
      ...current,
      company: {
        ...current.company,
        [field]: value,
      },
    }));
  };

  const updatePillar = (pillarId: BvbpPillarId, patch: Partial<ClientPillarConfig>) => {
    setState((current) => ({
      ...current,
      configuration: {
        ...current.configuration,
        pillars: current.configuration.pillars.map((pillar) =>
          pillar.pillar === pillarId ? { ...pillar, ...patch } : pillar,
        ),
      },
    }));
  };

  const togglePain = (pillarId: BvbpPillarId, pain: string) => {
    const pillar = getPillarConfig(state, pillarId);
    const nextPains = pillar?.pains.includes(pain)
      ? pillar.pains.filter((item) => item !== pain)
      : [...(pillar?.pains || []), pain];

    updatePillar(pillarId, { pains: nextPains });
  };

  const toggleMetric = (pillarId: BvbpPillarId, metricId: string) => {
    const pillar = getPillarConfig(state, pillarId);
    const selectedMetricIds = pillar?.selectedMetricIds || [];
    const nextMetricIds = selectedMetricIds.includes(metricId)
      ? selectedMetricIds.filter((item) => item !== metricId)
      : [...selectedMetricIds, metricId];

    updatePillar(pillarId, { selectedMetricIds: nextMetricIds });
  };

  const updateMetric = (metricId: string, patch: Partial<ClientMetricConfig>) => {
    setState((current) => ({
      ...current,
      configuration: {
        ...current.configuration,
        metrics: current.configuration.metrics.map((metric) =>
          metric.id === metricId ? { ...metric, ...patch } : metric,
        ),
      },
    }));
  };

  const addCustomMetric = (metric: ClientMetricConfig) => {
    setState((current) => {
      const pillar = current.configuration.pillars.find((item) => item.pillar === metric.pillar);

      return {
        ...current,
        configuration: {
          ...current.configuration,
          metrics: [metric, ...current.configuration.metrics],
          pillars: current.configuration.pillars.map((item) =>
            item.pillar === metric.pillar
              ? { ...item, selectedMetricIds: [metric.id, ...(pillar?.selectedMetricIds || [])] }
              : item,
          ),
        },
      };
    });
  };

  const addCustomPain = (pillarId: BvbpPillarId, pain: string) => {
    const normalizedPain = pain.trim();
    const pillar = getPillarConfig(state, pillarId);

    if (!normalizedPain || pillar?.pains.some((item) => item.toLocaleLowerCase() === normalizedPain.toLocaleLowerCase())) {
      return;
    }

    updatePillar(pillarId, { pains: [...(pillar?.pains || []), normalizedPain] });
  };

  const addContact = () => {
    setState((current) => ({
      ...current,
      company: {
        ...current.company,
        contacts: [
          ...current.company.contacts,
          {
            id: `contact-${Date.now()}`,
            name: "",
            email: "",
            title: "",
            accessLevel: "collaborator",
            isPrimary: current.company.contacts.length === 0,
            accessStatus: "planned",
          },
        ],
      },
    }));
  };

  const updateContact = (contactId: string, patch: Partial<ClientContact>) => {
    setState((current) => ({
      ...current,
      company: {
        ...current.company,
        contacts: current.company.contacts.map((contact) =>
          contact.id === contactId ? { ...contact, ...patch } : contact,
        ),
      },
    }));
  };

  const removeContact = (contactId: string) => {
    setState((current) => {
      const removedContact = current.company.contacts.find((contact) => contact.id === contactId);
      const contacts = current.company.contacts.filter((contact) => contact.id !== contactId);

      if (removedContact?.isPrimary && contacts.length) {
        contacts[0] = { ...contacts[0], isPrimary: true };
      }

      return {
        ...current,
        company: {
          ...current.company,
          contacts,
        },
      };
    });
  };

  const setPrimaryContact = (contactId: string) => {
    setState((current) => ({
      ...current,
      company: {
        ...current.company,
        contacts: current.company.contacts.map((contact) => ({
          ...contact,
          isPrimary: contact.id === contactId,
        })),
      },
    }));
  };

  const handleContactAccessAction = async (contact: ClientContact, action: ContactAccessAction) => {
    if (!company?.id) {
      toast({
        title: "Salve o cliente antes",
        description: "O convite fica disponível depois que o cliente existe no portal.",
        variant: "destructive",
      });
      return;
    }

    if (action !== "disable" && (!contact.name.trim() || !EMAIL_PATTERN.test(contact.email.trim()))) {
      toast({
        title: "Contato incompleto",
        description: "Informe nome e email válido antes de enviar o convite.",
        variant: "destructive",
      });
      return;
    }

    const loadingId = `${contact.id}-${action}`;
    setContactAccessLoadingId(loadingId);

    try {
      const synced = await syncCompanyToSupabase(buildCompanySnapshot(company.id, state));

      if (!synced) {
        throw new Error("Sessão expirada ou sem permissão. Entre novamente com uma conta BVBP.");
      }

      const { contact: updatedContact, deliveryType } = await sendClientContactAccessAction(company.id, contact.id, action);
      updateContact(contact.id, updatedContact);
      const title = action === "disable"
        ? "Acesso desativado"
        : deliveryType === "recovery"
          ? "Link de recuperação enviado"
          : "Convite enviado";
      const description = action === "disable"
        ? `${contact.name} não acessa mais este workspace.`
        : deliveryType === "recovery"
          ? `${contact.name} já possuía uma conta e recebeu um link para redefinir a senha.`
          : `${contact.name} recebeu um primeiro convite para definir a senha.`;
      toast({
        title,
        description,
      });
    } catch (error) {
      toast({
        title: "Não foi possível atualizar o acesso",
        description: error instanceof Error
          ? error.message
          : "Sessão expirada ou sem permissão. Entre novamente com uma conta BVBP.",
        variant: "destructive",
      });
    } finally {
      setContactAccessLoadingId(undefined);
    }
  };

  const handleSave = async () => {
    setSavingAction("final");

    try {
      await onSave(buildSaveInput(state));
    } catch (error) {
      toast({
        title: "Não foi possível salvar",
        description: error instanceof Error
          ? error.message
          : "Confira sua conexão e tente novamente.",
        variant: "destructive",
      });
      setSavingAction(undefined);
    }
  };

  const handleSaveDraft = async () => {
    if (!canSaveDraft) return;
    setSavingAction("draft");

    try {
      await onSaveDraft(buildSaveInput(state));
      setSavedStateSnapshot(JSON.stringify(state));
      setHasSavedDraft(true);
      toast({
        title: "Rascunho salvo",
        description: "Você pode continuar o cadastro agora ou retomar pelo CRM depois.",
      });
    } catch (error) {
      toast({
        title: "Não foi possível salvar o rascunho",
        description: error instanceof Error ? error.message : "Confira sua conexão e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSavingAction(undefined);
    }
  };

  const stepProps: StepProps = {
    state,
    updateCompanyField,
    updatePillar,
    togglePain,
    toggleMetric,
    updateMetric,
    addCustomMetric,
    addCustomPain,
    addContact,
    updateContact,
    removeContact,
    setPrimaryContact,
    mode,
    companyId: company?.id,
    contactAccessLoadingId,
    onContactAccessAction: handleContactAccessAction,
  };

  return (
    <div className="flex h-[calc(100dvh-11rem)] min-h-[32rem] flex-col overflow-hidden rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised shadow-none lg:h-auto lg:min-h-0 lg:flex-1">
      <div className="shrink-0 border-b border-bvbp-ink/10 p-3">
        <div className="grid grid-cols-5 gap-1.5">
          {steps.map((step, index) => (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStep(index)}
              className={cn(
                "min-w-0 rounded-[8px] border px-2 py-1.5 text-left text-xs font-semibold transition sm:px-3 sm:py-2 sm:text-sm",
                activeStep === index
                  ? "border-bvbp-forest bg-bvbp-forest text-bvbp-ivory"
                  : "border-bvbp-ink/10 bg-bvbp-ivory text-bvbp-muted-ink hover:bg-bvbp-inset hover:text-bvbp-ink",
              )}
            >
              <span className="block font-label text-[9px] uppercase tracking-[0.1em] opacity-70 sm:text-[10px]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="block truncate">{step}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
        {activeStep === 0 && <ClientBasicDataStep {...stepProps} />}
        {activeStep === 1 && <ClientPainsStep {...stepProps} />}
        {activeStep === 2 && <ClientMetricsStep {...stepProps} />}
        {activeStep === 3 && <ClientMaturityStep {...stepProps} />}
        {activeStep === 4 && <ClientReviewStep {...stepProps} />}
      </div>

      <div className="shrink-0 border-t border-bvbp-ink/10 bg-bvbp-raised p-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="mb-2 flex items-center justify-between gap-3 sm:mb-0 sm:justify-start">
          <p className="text-xs font-medium text-bvbp-muted-ink" aria-live="polite">
            {savingAction ? "Salvando..." : isDirty ? "Alterações não salvas" : hasSavedDraft ? "Rascunho salvo" : "Novo rascunho"}
          </p>
          <Button type="button" variant="outline" onClick={onCancel} className="hidden sm:inline-flex">Cancelar</Button>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
          <Button
            type="button"
            variant="outline"
            className="text-xs sm:text-sm"
            disabled={!canSaveDraft || Boolean(savingAction)}
            onClick={() => void handleSaveDraft()}
          >
            <Save className="hidden h-4 w-4 sm:block" aria-hidden="true" />
            <span className="sm:hidden">{savingAction === "draft" ? "Salvando..." : "Salvar"}</span>
            <span className="hidden sm:inline">{savingAction === "draft" ? "Salvando..." : "Salvar rascunho"}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((current) => Math.max(0, current - 1))}
          >
            Voltar
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button
              type="button"
              className="rounded-[8px] bg-bvbp-forest text-xs text-bvbp-ivory hover:bg-bvbp-forest-dark sm:text-sm"
              disabled={!isCurrentStepValid}
              onClick={() => setActiveStep((current) => Math.min(steps.length - 1, current + 1))}
            >
              Avançar
            </Button>
          ) : (
            <Button
              type="button"
              className="rounded-[8px] bg-bvbp-forest text-xs text-bvbp-ivory hover:bg-bvbp-forest-dark sm:text-sm"
              disabled={Boolean(savingAction) || !isBasicValid || !areContactsValid || !arePointersValid}
              onClick={() => void handleSave()}
            >
              <Save className="hidden h-4 w-4 sm:block" aria-hidden="true" />
              <span className="sm:hidden">{savingAction === "final" ? "Salvando..." : mode === "create" ? "Concluir" : "Salvar"}</span>
              <span className="hidden sm:inline">{savingAction === "final" ? "Salvando..." : mode === "create" ? "Concluir cadastro" : "Salvar alterações"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ClientBasicDataStep({
  state,
  updateCompanyField,
  addContact,
  updateContact,
  removeContact,
  setPrimaryContact,
  mode,
  companyId,
  contactAccessLoadingId,
  onContactAccessAction,
}: StepProps) {
  const currentUser = getPerformanceSession()?.user;
  const currentUserName = currentUser?.name || "Equipe BVBP";
  const [eventDraft, setEventDraft] = useState({
    type: "meeting" as ClientRelationshipEventType,
    occurredAt: new Intl.DateTimeFormat("en-CA").format(new Date()),
    notes: "",
  });
  const relationshipEvents = [...state.company.relationshipEvents].sort((a, b) => (
    `${b.occurredAt}-${b.createdAt}`.localeCompare(`${a.occurredAt}-${a.createdAt}`)
  ));

  const addRelationshipEvent = () => {
    if (!eventDraft.occurredAt || !eventDraft.notes.trim()) return;
    const createdAt = new Date().toISOString();

    updateCompanyField("relationshipEvents", [
      {
        id: `relationship-event-${Date.now()}`,
        type: eventDraft.type,
        occurredAt: eventDraft.occurredAt,
        createdAt,
        createdBy: currentUserName,
        createdByUserId: currentUser?.id,
        createdByName: currentUserName,
        notes: eventDraft.notes.trim(),
      },
      ...state.company.relationshipEvents,
    ]);
    setEventDraft((current) => ({ ...current, notes: "" }));
  };

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="client-name">Nome do cliente</Label>
        <Input id="client-name" value={state.company.name} onChange={(event) => updateCompanyField("name", event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client-segment">Segmento</Label>
        <Select
          value={state.company.segmentPreset}
          onValueChange={(value) => {
            updateCompanyField("segmentPreset", value);
            updateCompanyField("segment", value === "other" ? "" : value);
          }}
        >
          <SelectTrigger id="client-segment" aria-label="Segmento"><SelectValue placeholder="Selecione o segmento" /></SelectTrigger>
          <SelectContent>
            {clientSegmentOptions.map((segment) => <SelectItem key={segment} value={segment}>{segment}</SelectItem>)}
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {state.company.segmentPreset === "other" ? (
        <div className="space-y-2">
          <Label htmlFor="client-segment-other">Outro segmento</Label>
          <Input id="client-segment-other" value={state.company.segment} onChange={(event) => updateCompanyField("segment", event.target.value)} placeholder="Informe o segmento" />
        </div>
      ) : null}
      <div className="space-y-2">
        <Label>Fase do relacionamento</Label>
        <Select
          value={state.company.relationshipStatus}
          onValueChange={(value) => updateCompanyField("relationshipStatus", value as ClientRelationshipStatus)}
        >
          <SelectTrigger aria-label="Fase do relacionamento">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {relationshipStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="client-description">Descrição curta</Label>
        <Textarea
          id="client-description"
          rows={2}
          value={state.company.description}
          onChange={(event) => updateCompanyField("description", event.target.value)}
          placeholder="Contexto executivo do cliente"
        />
      </div>
      <div className="space-y-4 border-t border-bvbp-ink/10 pt-5 sm:col-span-2">
        <div>
          <h2 className="font-heading text-lg font-semibold text-bvbp-ink">Faturamento e budget mensal</h2>
          <p className="mt-1 text-sm text-bvbp-muted-ink">
            Selecione faixas para qualificação e registre valores exatos somente quando forem conhecidos.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Faixa de faturamento mensal</Label>
            <Select
              value={state.company.revenueRangeId}
              onValueChange={(value) => updateCompanyField("revenueRangeId", value as ClientRevenueRangeId)}
            >
              <SelectTrigger aria-label="Faixa de faturamento mensal"><SelectValue /></SelectTrigger>
              <SelectContent>
                {clientRevenueRanges.map((range) => <SelectItem key={range.id} value={range.id}>{range.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-reported-revenue">Faturamento exato (R$, opcional)</Label>
            <Input id="client-reported-revenue" type="number" min="0" value={state.company.reportedRevenue} onChange={(event) => updateCompanyField("reportedRevenue", event.target.value)} placeholder="Ex.: 500000" />
          </div>
          <div className="space-y-2">
            <Label>Faixa de budget mensal</Label>
            <Select value={state.company.budgetRangeId} onValueChange={(value) => updateCompanyField("budgetRangeId", value as ClientBudgetRangeId)}>
              <SelectTrigger aria-label="Faixa de budget mensal"><SelectValue /></SelectTrigger>
              <SelectContent>
                {clientBudgetRanges.map((range) => <SelectItem key={range.id} value={range.id}>{range.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-budget-amount">Budget exato (R$, opcional)</Label>
            <Input id="client-budget-amount" type="number" min="0" value={state.company.budgetAmount} onChange={(event) => updateCompanyField("budgetAmount", event.target.value)} placeholder="Ex.: 15000" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="client-budget-percentage">Percentual informado ou estimado (opcional)</Label>
            <Input id="client-budget-percentage" type="number" min="0" max="100" step="0.1" value={state.company.budgetPercentage} onChange={(event) => updateCompanyField("budgetPercentage", event.target.value)} placeholder="Ex.: 3" />
            <p className="text-xs text-bvbp-muted-ink">Registro manual para a qualificação; não representa benchmark de mercado.</p>
          </div>
        </div>
      </div>
      <div className="space-y-3 border-t border-bvbp-ink/10 pt-5 sm:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-bvbp-ink">Contatos do workspace</h2>
            <p className="mt-1 text-sm text-bvbp-muted-ink">
              Colaboradores participam da execução; acessos de somente leitura apenas acompanham o workspace.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={addContact}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Adicionar contato
          </Button>
        </div>

        {state.company.contacts.length ? (
          <div className="grid gap-3">
            {state.company.contacts.map((contact) => {
              const isEmailInvalid = Boolean(contact.email) && !EMAIL_PATTERN.test(contact.email.trim());
              const isContactIncomplete = contact.name.trim().length <= 1 || !EMAIL_PATTERN.test(contact.email.trim()) || !contact.title?.trim();
              const isAccessLocked = contact.accessStatus !== "planned";
              const canManageAccess = mode === "edit" && Boolean(companyId);

              return (
                <article key={contact.id} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(180px,0.7fr)_minmax(180px,0.7fr)_auto] xl:items-end">
                    <div className="space-y-2">
                      <Label htmlFor={`${contact.id}-name`}>Nome</Label>
                      <Input
                        id={`${contact.id}-name`}
                        value={contact.name}
                        onChange={(event) => updateContact(contact.id, { name: event.target.value })}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${contact.id}-email`}>Email</Label>
                      <Input
                        id={`${contact.id}-email`}
                        type="email"
                        value={contact.email}
                        onChange={(event) => updateContact(contact.id, { email: event.target.value })}
                        placeholder="nome@empresa.com.br"
                        disabled={isAccessLocked}
                        aria-invalid={isEmailInvalid}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${contact.id}-title`}>Cargo</Label>
                      <Input
                        id={`${contact.id}-title`}
                        value={contact.title || ""}
                        onChange={(event) => updateContact(contact.id, { title: event.target.value })}
                        placeholder="Ex.: Diretora financeira"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de acesso</Label>
                      <Select
                        value={contact.accessLevel || "collaborator"}
                        onValueChange={(value) => updateContact(contact.id, { accessLevel: value as ClientContactAccessLevel })}
                      >
                        <SelectTrigger aria-label={`Tipo de acesso de ${contact.name || "contato"}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(contactAccessLevelLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {isAccessLocked ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled
                        title="Contato com acesso vinculado"
                      >
                        <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">Contato com acesso vinculado</span>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeContact(contact.id)}
                        title="Remover contato"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">Remover contato</span>
                      </Button>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-bvbp-ink/10 pt-3">
                    <Button
                      type="button"
                      size="sm"
                      variant={contact.isPrimary ? "default" : "outline"}
                      className={contact.isPrimary ? "bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark" : undefined}
                      onClick={() => setPrimaryContact(contact.id)}
                    >
                      <Star className="h-4 w-4" aria-hidden="true" />
                      {contact.isPrimary ? "Contato principal" : "Definir como principal"}
                    </Button>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-bvbp-muted-ink">
                      <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                      {contactAccessStatusLabels[contact.accessStatus || "planned"]}
                    </span>
                    {isEmailInvalid ? <span className="text-xs font-semibold text-bvbp-risk">Informe um email válido.</span> : null}
                    {!canManageAccess ? (
                      <span className="text-xs font-semibold text-bvbp-muted-ink">Salve o cliente para enviar convite.</span>
                    ) : null}
                    {canManageAccess && (contact.accessStatus === "planned" || contact.accessStatus === "disabled") ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isContactIncomplete || contactAccessLoadingId === `${contact.id}-invite`}
                        onClick={() => onContactAccessAction(contact, "invite")}
                      >
                        <Send className="h-4 w-4" aria-hidden="true" />
                        {contactAccessLoadingId === `${contact.id}-invite` ? "Enviando..." : "Enviar convite"}
                      </Button>
                    ) : null}
                    {canManageAccess && (contact.accessStatus === "invited" || contact.accessStatus === "active") ? (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={contactAccessLoadingId === `${contact.id}-resend`}
                          onClick={() => onContactAccessAction(contact, "resend")}
                        >
                          <RefreshCw className="h-4 w-4" aria-hidden="true" />
                          {contactAccessLoadingId === `${contact.id}-resend` ? "Reenviando..." : "Reenviar convite"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="border-bvbp-risk/25 text-bvbp-risk hover:bg-bvbp-risk/5 hover:text-bvbp-risk"
                          disabled={contactAccessLoadingId === `${contact.id}-disable`}
                          onClick={() => onContactAccessAction(contact, "disable")}
                        >
                          <Ban className="h-4 w-4" aria-hidden="true" />
                          {contactAccessLoadingId === `${contact.id}-disable` ? "Desativando..." : "Desativar acesso"}
                        </Button>
                      </>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[8px] border border-dashed border-bvbp-ink/15 bg-bvbp-ivory p-4 text-sm text-bvbp-muted-ink">
            Nenhum contato cadastrado.
          </div>
        )}
      </div>
      <div className="border-t border-bvbp-ink/10 pt-3 sm:col-span-2">
        <Accordion type="single" collapsible>
          <AccordionItem value="relationship-log" className="border-0">
            <AccordionTrigger className="py-3 text-left hover:no-underline">
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-bvbp-forest/8 text-bvbp-forest">
                  <History className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-heading text-lg font-semibold text-bvbp-ink">Histórico do relacionamento</span>
                  <span className="mt-1 block text-sm font-normal text-bvbp-muted-ink">
                    {relationshipEvents.length
                      ? `${relationshipEvents.length} registro(s) neste cliente`
                      : "Reuniões, propostas e marcos do relacionamento com o cliente."}
                  </span>
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-1 pt-3">
              <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Tipo de registro</Label>
                    <Select
                      value={eventDraft.type}
                      onValueChange={(value) => setEventDraft((current) => ({
                        ...current,
                        type: value as ClientRelationshipEventType,
                      }))}
                    >
                      <SelectTrigger aria-label="Tipo do registro de relacionamento"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(relationshipEventTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship-event-date">Data</Label>
                    <Input
                      id="relationship-event-date"
                      type="date"
                      value={eventDraft.occurredAt}
                      onChange={(event) => setEventDraft((current) => ({ ...current, occurredAt: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                    <Label htmlFor="relationship-event-notes">Registro</Label>
                    <Textarea
                      id="relationship-event-notes"
                      rows={2}
                      value={eventDraft.notes}
                      onChange={(event) => setEventDraft((current) => ({ ...current, notes: event.target.value }))}
                      placeholder="O que aconteceu, decisões tomadas e próximo passo"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      className="w-full rounded-[8px] bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark"
                      disabled={!eventDraft.occurredAt || !eventDraft.notes.trim()}
                      onClick={addRelationshipEvent}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Adicionar registro
                    </Button>
                  </div>
                </div>
              </div>

              {relationshipEvents.length ? (
                <ol className="mt-4 space-y-3">
                  {relationshipEvents.map((event) => (
                    <li key={event.id} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-semibold text-bvbp-ink">{relationshipEventTypeLabels[event.type]}</p>
                        <time dateTime={event.occurredAt} className="text-xs font-semibold text-bvbp-muted-ink">
                          {new Date(`${event.occurredAt}T12:00:00`).toLocaleDateString("pt-BR")}
                        </time>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-bvbp-ink">{event.notes}</p>
                      <p className="mt-2 text-xs text-bvbp-muted-ink">Registrado por {event.createdByName || event.createdBy}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 rounded-[8px] border border-dashed border-bvbp-ink/15 p-4 text-sm text-bvbp-muted-ink">
                  Nenhum evento registrado para este cliente.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

export function ClientPainsStep({ state, togglePain, addCustomPain }: StepProps) {
  const [painDrafts, setPainDrafts] = useState<Partial<Record<BvbpPillarId, string>>>({});

  const submitPain = (pillarId: BvbpPillarId) => {
    const pain = painDrafts[pillarId]?.trim();
    if (!pain) return;
    const existingPains = [...painCatalogByPillar[pillarId], ...(getPillarConfig(state, pillarId)?.pains || [])];

    if (existingPains.some((item) => item.toLocaleLowerCase() === pain.toLocaleLowerCase())) {
      return;
    }

    addCustomPain(pillarId, pain);
    setPainDrafts((current) => ({ ...current, [pillarId]: "" }));
  };

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {bvbpPillarIds.map((pillarId) => {
        const pillar = getPillarConfig(state, pillarId);

        return (
          <article key={pillarId} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4">
            <h2 className="font-heading text-lg font-semibold text-bvbp-ink">{bvbpPillarLabels[pillarId]}</h2>
            <div className="mt-4 grid gap-3">
              {painCatalogByPillar[pillarId].map((pain) => (
                <label key={pain} className="flex items-start gap-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-3 text-sm text-bvbp-ink">
                  <Checkbox checked={pillar?.pains.includes(pain)} onCheckedChange={() => togglePain(pillarId, pain)} />
                  <span>{pain}</span>
                </label>
              ))}
              {pillar?.pains
                .filter((pain) => !painCatalogByPillar[pillarId].includes(pain))
                .map((pain) => (
                  <div key={pain} className="flex items-start gap-3 rounded-[8px] border border-bvbp-forest/25 bg-bvbp-raised p-3 text-sm text-bvbp-ink">
                    <Checkbox checked onCheckedChange={() => togglePain(pillarId, pain)} />
                    <span className="min-w-0 flex-1">{pain}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="-my-2 h-8 w-8 shrink-0"
                      onClick={() => togglePain(pillarId, pain)}
                      title="Remover dor personalizada"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Remover dor personalizada</span>
                    </Button>
                  </div>
                ))}
              <div className="flex gap-2 pt-1">
                <Input
                  value={painDrafts[pillarId] || ""}
                  onChange={(event) => setPainDrafts((current) => ({ ...current, [pillarId]: event.target.value }))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      submitPain(pillarId);
                    }
                  }}
                  placeholder="Nova dor personalizada"
                  aria-label={`Nova dor de ${bvbpPillarLabels[pillarId]}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => submitPain(pillarId)}
                  disabled={!painDrafts[pillarId]?.trim()}
                  title="Adicionar dor"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Adicionar dor</span>
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export function ClientMetricsStep({ state, toggleMetric, updateMetric, addCustomMetric }: StepProps) {
  const [activePillar, setActivePillar] = useState<BvbpPillarId>("financial");
  const [activeMetricId, setActiveMetricId] = useState<string | null>(() => {
    const financialPillar = getPillarConfig(state, "financial");
    return financialPillar?.selectedMetricIds[0] || getPillarMetrics(state, "financial")[0]?.id || null;
  });
  const pillar = getPillarConfig(state, activePillar);
  const metrics = getPillarMetrics(state, activePillar);
  const selectedMetricIds = pillar?.selectedMetricIds || [];
  const activeMetric = metrics.find((metric) => metric.id === activeMetricId);

  const selectPillar = (pillarId: BvbpPillarId) => {
    const nextPillar = getPillarConfig(state, pillarId);
    const nextMetrics = getPillarMetrics(state, pillarId);
    setActivePillar(pillarId);
    setActiveMetricId(nextPillar?.selectedMetricIds[0] || nextMetrics[0]?.id || null);
  };

  const changeMetricSelection = (metric: ClientMetricConfig, isSelected: boolean) => {
    toggleMetric(metric.pillar, metric.id);

    setActiveMetricId(metric.id);
  };

  const addMetric = (metric: ClientMetricConfig) => {
    addCustomMetric(metric);
    setActivePillar(metric.pillar);
    setActiveMetricId(metric.id);
  };

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-heading text-xl font-semibold text-bvbp-ink">Ponteiros acompanhados</h2>
        <p className="mt-1 text-sm text-bvbp-muted-ink">
          Clique no card para ver os detalhes e use o check para incluir o ponteiro no acompanhamento.
        </p>
      </div>

      <Tabs value={activePillar} onValueChange={(value) => selectPillar(value as BvbpPillarId)}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-[8px] bg-bvbp-inset p-1 sm:grid-cols-4">
          {bvbpPillarIds.map((pillarId) => (
            <TabsTrigger
              key={pillarId}
              value={pillarId}
              className="rounded-[6px] data-[state=active]:bg-bvbp-raised data-[state=active]:text-bvbp-forest data-[state=active]:shadow-none"
            >
              {bvbpPillarLabels[pillarId]}
            </TabsTrigger>
          ))}
        </TabsList>

        {bvbpPillarIds.map((pillarId) => (
          <TabsContent key={pillarId} value={pillarId} className="mt-4">
            {pillarId === activePillar ? (
              <div
                className={cn(
                  "grid gap-4",
                  activeMetric
                    ? "lg:grid-cols-[minmax(260px,0.75fr)_minmax(0,1.35fr)]"
                    : "lg:grid-cols-[minmax(0,1fr)]",
                )}
              >
                <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-3">
                  <div className="flex items-center justify-between gap-3 border-b border-bvbp-ink/10 px-1 pb-3">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-bvbp-ink">{bvbpPillarLabels[pillarId]}</h3>
                      <p className="mt-1 text-xs text-bvbp-muted-ink">{selectedMetricIds.length} selecionados</p>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2">
                    {metrics.map((metric) => {
                      const isSelected = selectedMetricIds.includes(metric.id);
                      const isActive = activeMetricId === metric.id;

                      return (
                        <div
                          key={metric.id}
                          className={cn(
                            "flex min-h-[72px] items-start gap-3 rounded-[8px] border p-3 transition",
                            isActive
                              ? "border-bvbp-forest/40 bg-bvbp-raised"
                              : "border-bvbp-ink/10 bg-bvbp-raised/70 hover:border-bvbp-forest/25",
                          )}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => changeMetricSelection(metric, isSelected)}
                            aria-label={`${isSelected ? "Remover" : "Selecionar"} ${metric.name}`}
                          />
                          <button
                            type="button"
                            className="min-w-0 flex-1 text-left"
                            onClick={() => {
                              setActiveMetricId(metric.id);
                            }}
                          >
                            <span className="block text-sm font-semibold text-bvbp-ink">{metric.name}</span>
                            <span className="mt-1 block text-xs leading-5 text-bvbp-muted-ink">
                              {clientMetricUnitLabels[metric.unit]}
                              {metric.currentValue === undefined ? " · Sem baseline" : ""}
                              {metric.custom ? " · personalizado" : ""}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                    <CustomMetricDialog key={pillarId} defaultPillar={pillarId} onAdd={addMetric} />
                  </div>
                </article>

                {activeMetric ? (
                  <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4">
                    <div className="border-b border-bvbp-ink/10 pb-4">
                      <div className="min-w-0">
                        <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
                          Detalhes do ponteiro
                        </p>
                        <h3 className="mt-2 font-heading text-xl font-semibold text-bvbp-ink">{activeMetric.name}</h3>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor={`${activeMetric.id}-description`}>Descrição</Label>
                        <Textarea
                          id={`${activeMetric.id}-description`}
                          rows={2}
                          value={activeMetric.description}
                          onChange={(event) => updateMetric(activeMetric.id, { description: event.target.value })}
                          placeholder="O que este ponteiro mede"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor={`${activeMetric.id}-formula`}>Fórmula</Label>
                        <Textarea
                          id={`${activeMetric.id}-formula`}
                          rows={2}
                          value={activeMetric.formula}
                          onChange={(event) => updateMetric(activeMetric.id, { formula: event.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unidade</Label>
                        <Select
                          value={activeMetric.unit}
                          onValueChange={(value) => updateMetric(activeMetric.id, { unit: value as ClientMetricUnit })}
                        >
                          <SelectTrigger aria-label={`Unidade de ${activeMetric.name}`}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(clientMetricUnitLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Forma de avaliação</Label>
                        <Select
                          value={activeMetric.direction || "higher"}
                          onValueChange={(value) => updateMetric(activeMetric.id, { direction: value as ClientMetricDirection })}
                        >
                          <SelectTrigger aria-label={`Forma de avaliação de ${activeMetric.name}`}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(metricDirectionLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${activeMetric.id}-value`}>Valor atual</Label>
                        <Input
                          id={`${activeMetric.id}-value`}
                          type="number"
                          value={activeMetric.currentValue ?? ""}
                          onChange={(event) =>
                            updateMetric(activeMetric.id, {
                              currentValue: event.target.value.trim() ? Number(event.target.value) : undefined,
                            })
                          }
                          placeholder="Sem baseline"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${activeMetric.id}-target`}>Meta</Label>
                        <Input
                          id={`${activeMetric.id}-target`}
                          value={activeMetric.target || ""}
                          onChange={(event) => updateMetric(activeMetric.id, { target: event.target.value })}
                          placeholder="Opcional"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor={`${activeMetric.id}-benchmark`}>Benchmark</Label>
                        <Input
                          id={`${activeMetric.id}-benchmark`}
                          value={activeMetric.benchmark || ""}
                          onChange={(event) => updateMetric(activeMetric.id, { benchmark: event.target.value })}
                          placeholder="Referência de mercado, fonte ou faixa esperada"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor={`${activeMetric.id}-source`}>
                          Fonte{activeMetric.currentValue !== undefined ? " *" : ""}
                        </Label>
                        <Input
                          id={`${activeMetric.id}-source`}
                          value={activeMetric.source || ""}
                          onChange={(event) => updateMetric(activeMetric.id, { source: event.target.value })}
                          placeholder="Planilha, ERP, CRM..."
                          aria-invalid={activeMetric.currentValue !== undefined && !activeMetric.source?.trim()}
                        />
                        {activeMetric.currentValue !== undefined && !activeMetric.source?.trim() ? (
                          <p className="text-xs font-semibold text-bvbp-risk">Informe a fonte para registrar o baseline.</p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ) : (
                  <div className="rounded-[8px] border border-dashed border-bvbp-ink/15 bg-bvbp-ivory p-6 text-sm text-bvbp-muted-ink">
                    Selecione um ponteiro para preencher seus detalhes.
                  </div>
                )}
              </div>
            ) : null}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

export function ClientMaturityStep({ state, updatePillar }: StepProps) {
  const [activePillar, setActivePillar] = useState<BvbpPillarId>("financial");
  const [selectedLevelByPillar, setSelectedLevelByPillar] = useState<Partial<Record<BvbpPillarId, MaturityLevel>>>({});
  const pillar = getPillarConfig(state, activePillar);

  if (!pillar) return null;

  const definition = maturityDefinitionsByPillar[activePillar];
  const maturity = getPillarMaturityState(activePillar, pillar.completedMaturityCriterionIds);
  const selectedLevel = selectedLevelByPillar[activePillar] || maturity.level;
  const selectedLevelDefinition = definition.levels[selectedLevel - 1];
  const completedIds = new Set(pillar.completedMaturityCriterionIds);
  const selectedCompletedCount = selectedLevelDefinition.criteria.filter((criterion) => completedIds.has(criterion.id)).length;

  const selectPillar = (pillarId: BvbpPillarId) => {
    setActivePillar(pillarId);
    setSelectedLevelByPillar((current) => {
      if (current[pillarId]) return current;
      const nextPillar = getPillarConfig(state, pillarId);
      const nextMaturity = getPillarMaturityState(
        pillarId,
        nextPillar?.completedMaturityCriterionIds || [],
      );

      return { ...current, [pillarId]: nextMaturity.level };
    });
  };

  const toggleMaturityCriterion = (criterionId: string) => {
    const nextCompletedIds = completedIds.has(criterionId)
      ? pillar.completedMaturityCriterionIds.filter((id) => id !== criterionId)
      : [...pillar.completedMaturityCriterionIds, criterionId];
    const nextMaturity = getPillarMaturityState(activePillar, nextCompletedIds);

    updatePillar(activePillar, { completedMaturityCriterionIds: nextCompletedIds });

    if (nextMaturity.level !== maturity.level) {
      setSelectedLevelByPillar((current) => ({ ...current, [activePillar]: nextMaturity.level }));
      toast({
        title: nextMaturity.level > maturity.level ? "Maturidade avançou" : "Maturidade recalculada",
        description: `${bvbpPillarLabels[activePillar]} está no nível ${nextMaturity.level}: ${nextMaturity.current.name}.`,
      });
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-xl font-semibold text-bvbp-ink">Maturidade por pilar</h2>
        <p className="mt-1 text-sm text-bvbp-muted-ink">
          Valide os critérios em sequência para identificar o nível atual junto ao cliente.
        </p>
      </div>

      <Tabs value={activePillar} onValueChange={(value) => selectPillar(value as BvbpPillarId)}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-[8px] bg-bvbp-inset p-1 sm:grid-cols-4">
          {bvbpPillarIds.map((pillarId) => {
            const pillarConfig = getPillarConfig(state, pillarId);
            const pillarMaturity = getPillarMaturityState(
              pillarId,
              pillarConfig?.completedMaturityCriterionIds || [],
            );

            return (
              <TabsTrigger
                key={pillarId}
                value={pillarId}
                className="rounded-[6px] data-[state=active]:bg-bvbp-raised data-[state=active]:text-bvbp-forest data-[state=active]:shadow-none"
              >
                <span>{bvbpPillarLabels[pillarId]}</span>
                <span className="ml-2 text-xs opacity-65">N{pillarMaturity.level}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activePillar} className="mt-4">
          <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
            <nav className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-3" aria-label={`Níveis de maturidade de ${bvbpPillarLabels[activePillar]}`}>
              <div className="grid gap-2">
                {definition.levels.map((levelDefinition) => {
                  const isLocked = levelDefinition.level > maturity.level;
                  const isSelected = levelDefinition.level === selectedLevel;
                  const isComplete = levelDefinition.level < maturity.level || maturity.level === 5;

                  return (
                    <button
                      key={levelDefinition.level}
                      type="button"
                      disabled={isLocked}
                      onClick={() => setSelectedLevelByPillar((current) => ({
                        ...current,
                        [activePillar]: levelDefinition.level,
                      }))}
                      className={cn(
                        "flex min-h-[68px] items-start gap-3 rounded-[8px] border p-3 text-left transition",
                        isSelected
                          ? "border-bvbp-forest/40 bg-bvbp-raised"
                          : "border-bvbp-ink/10 bg-bvbp-raised/60",
                        isLocked && "cursor-not-allowed opacity-45",
                      )}
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-bvbp-ink/10 bg-bvbp-ivory text-xs font-bold text-bvbp-forest">
                        {isLocked ? (
                          <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : isComplete ? (
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          levelDefinition.level
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold text-bvbp-muted-ink">Nível {levelDefinition.level}</span>
                        <span className="mt-1 block text-sm font-semibold leading-5 text-bvbp-ink">{levelDefinition.name}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5">
              <div className="border-b border-bvbp-ink/10 pb-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
                      Nível {selectedLevel}
                    </p>
                    <h3 className="mt-2 font-heading text-xl font-semibold text-bvbp-ink">{selectedLevelDefinition.name}</h3>
                  </div>
                  <span className="text-sm font-semibold text-bvbp-forest">
                    {selectedLevelDefinition.criteria.length
                      ? `${selectedCompletedCount}/${selectedLevelDefinition.criteria.length} critérios`
                      : "Nível máximo"}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-bvbp-muted-ink">{selectedLevelDefinition.description}</p>
              </div>

              {selectedLevelDefinition.criteria.length ? (
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-bvbp-ink">
                      Critérios para avançar ao nível {selectedLevel + 1}
                    </p>
                    <p className="mt-1 text-xs text-bvbp-muted-ink">
                      {definition.levels[selectedLevel]?.name}
                    </p>
                  </div>
                  {selectedLevelDefinition.criteria.map((criterion) => (
                    <label
                      key={criterion.id}
                      className="flex items-start gap-3 rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-3 text-sm leading-5 text-bvbp-ink"
                    >
                      <Checkbox
                        checked={completedIds.has(criterion.id)}
                        onCheckedChange={() => toggleMaturityCriterion(criterion.id)}
                      />
                      <span>{criterion.label}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-[8px] border border-bvbp-positive/25 bg-bvbp-positive/5 p-4">
                  <p className="font-semibold text-bvbp-ink">Maturidade máxima validada</p>
                  <p className="mt-1 text-sm leading-6 text-bvbp-muted-ink">
                    O pilar demonstra previsibilidade, aprendizado e evolução contínua.
                  </p>
                </div>
              )}

              <div className="mt-5 space-y-2 border-t border-bvbp-ink/10 pt-4">
                <Label htmlFor={`${activePillar}-notes`}>Observações</Label>
                <Textarea
                  id={`${activePillar}-notes`}
                  rows={3}
                  value={pillar.notes}
                  onChange={(event) => updatePillar(activePillar, { notes: event.target.value })}
                  placeholder="Contexto observado durante a avaliação"
                />
              </div>
            </article>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

export function ClientReviewStep({ state }: StepProps) {
  const selectedMetrics = useMemo(() => {
    const selectedIds = new Set(state.configuration.pillars.flatMap((pillar) => pillar.selectedMetricIds));
    return state.configuration.metrics.filter((metric) => selectedIds.has(metric.id));
  }, [state.configuration.metrics, state.configuration.pillars]);
  const primaryContact = state.company.contacts.find((contact) => contact.isPrimary);
  const reviewBudget = buildSaveInput(state).company.budgetAmount;
  const revenueRangeLabel = clientRevenueRanges.find((range) => range.id === state.company.revenueRangeId)?.label;
  const budgetRangeLabel = clientBudgetRanges.find((range) => range.id === state.company.budgetRangeId)?.label;

  return (
    <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4">
        <p className="font-label text-xs font-medium uppercase tracking-[0.12em] text-bvbp-muted-ink">Dados</p>
        <h2 className="mt-3 font-heading text-xl font-semibold text-bvbp-ink">{state.company.name || "Cliente sem nome"}</h2>
        <div className="mt-4 grid gap-2 text-sm text-bvbp-muted-ink">
          <p>{state.company.segment || "Segmento não informado"}</p>
          <p>{state.company.relationshipStatus}</p>
          <p>Responsável: {state.company.bvbpOwner || "BVBP"}</p>
          <p>Faturamento mensal: {revenueRangeLabel || "Não informado"}</p>
          <p>
            Budget mensal: {budgetRangeLabel || "A definir"}{reviewBudget ? ` · ${currencyFormatter.format(reviewBudget)} exatos` : ""}
          </p>
          <p>Contato: {primaryContact?.name || "Não informado"}{primaryContact?.title ? ` · ${primaryContact.title}` : ""}</p>
          <p>Acesso principal: {contactAccessLevelLabels[primaryContact?.accessLevel || "collaborator"]}</p>
          <p>{state.company.contacts.length} contato(s) cadastrados</p>
        </div>
      </article>
      <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4">
        <p className="font-label text-xs font-medium uppercase tracking-[0.12em] text-bvbp-muted-ink">Resumo por pilar</p>
        <div className="mt-4 grid gap-3">
          {state.configuration.pillars.map((pillar) => {
            const metricCount = selectedMetrics.filter((metric) => metric.pillar === pillar.pillar).length;
            const maturity = getPillarMaturityState(pillar.pillar, pillar.completedMaturityCriterionIds);

            return (
              <div key={pillar.pillar} className="rounded-[8px] bg-bvbp-raised p-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-bvbp-ink">{bvbpPillarLabels[pillar.pillar]}</p>
                  <p className="font-semibold text-bvbp-muted-ink">{maturity.level}/5</p>
                </div>
                <p className="mt-1 text-bvbp-muted-ink">{maturity.current.name}</p>
                <p className="mt-2 text-xs text-bvbp-muted-ink">
                  {metricCount} ponteiros · {pillar.pains.length} dores · {maturity.completedCriteria}/{maturity.totalCriteria} critérios
                </p>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}

export function CustomMetricDialog({ defaultPillar, onAdd }: { defaultPillar: BvbpPillarId; onAdd: (metric: ClientMetricConfig) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    pillar: defaultPillar,
    unit: "count" as ClientMetricUnit,
    currentValue: "",
    target: "",
    benchmark: "",
    direction: "higher" as ClientMetricDirection,
    source: "",
    formula: "",
  });

  const addMetric = () => {
    if (!form.name.trim() || !form.formula.trim()) return;

    onAdd({
      id: `custom-${form.pillar}-${Date.now()}`,
      name: form.name.trim(),
      pillar: form.pillar,
      description: form.description.trim() || "Ponteiro personalizado para o cliente atual.",
      unit: form.unit,
      formula: form.formula.trim(),
      currentValue: toOptionalNumber(form.currentValue),
      target: form.target.trim() || undefined,
      benchmark: form.benchmark.trim() || undefined,
      direction: form.direction,
      source: form.source.trim() || undefined,
      custom: true,
    });
    setForm({
      name: "",
      description: "",
      pillar: defaultPillar,
      unit: "count",
      currentValue: "",
      target: "",
      benchmark: "",
      direction: "higher",
      source: "",
      formula: "",
    });
    setOpen(false);
  };

  const openDialog = () => {
    setForm((current) => ({ ...current, pillar: defaultPillar }));
    setOpen(true);
  };

  return (
    <>
      <Button type="button" variant="outline" className="mt-1 justify-start" onClick={openDialog}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        Adicionar ponteiro em {bvbpPillarLabels[defaultPillar]}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo ponteiro</DialogTitle>
            <DialogDescription>Ponteiro específico para acompanhar no cliente atual.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="custom-metric-name">Nome</Label>
              <Input id="custom-metric-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="custom-metric-description">Descrição</Label>
              <Textarea
                id="custom-metric-description"
                rows={2}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="O que este ponteiro mede"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="custom-metric-formula">Fórmula</Label>
              <Textarea
                id="custom-metric-formula"
                rows={2}
                value={form.formula}
                onChange={(event) => setForm({ ...form, formula: event.target.value })}
                placeholder="Como este ponteiro é calculado"
              />
            </div>
            <div className="space-y-2">
              <Label>Pilar</Label>
              <Select value={form.pillar} onValueChange={(value) => setForm({ ...form, pillar: value as BvbpPillarId })}>
                <SelectTrigger aria-label="Pilar do novo ponteiro">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bvbpPillarIds.map((pillarId) => (
                    <SelectItem key={pillarId} value={pillarId}>
                      {bvbpPillarLabels[pillarId]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Unidade</Label>
              <Select value={form.unit} onValueChange={(value) => setForm({ ...form, unit: value as ClientMetricUnit })}>
                <SelectTrigger aria-label="Unidade do novo ponteiro">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(clientMetricUnitLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Forma de avaliação</Label>
              <Select value={form.direction} onValueChange={(value) => setForm({ ...form, direction: value as ClientMetricDirection })}>
                <SelectTrigger aria-label="Forma de avaliação do novo ponteiro"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(metricDirectionLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-metric-value">Valor atual</Label>
              <Input id="custom-metric-value" type="number" value={form.currentValue} onChange={(event) => setForm({ ...form, currentValue: event.target.value })} placeholder="Opcional" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-metric-target">Meta</Label>
              <Input id="custom-metric-target" value={form.target} onChange={(event) => setForm({ ...form, target: event.target.value })} placeholder="Opcional" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="custom-metric-benchmark">Benchmark</Label>
              <Input id="custom-metric-benchmark" value={form.benchmark} onChange={(event) => setForm({ ...form, benchmark: event.target.value })} placeholder="Referência de mercado ou faixa esperada" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="custom-metric-source">Fonte</Label>
              <Input id="custom-metric-source" value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value })} placeholder="Planilha, CRM, ERP..." />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              className="rounded-[8px] bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark"
              onClick={addMetric}
              disabled={!form.name.trim() || !form.formula.trim()}
            >
              Adicionar ponteiro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
