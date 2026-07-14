import { useMemo, useState } from "react";
import { Ban, CheckCircle2, ChevronLeft, ChevronRight, KeyRound, LockKeyhole, Plus, RefreshCw, Save, Send, Star, Trash2 } from "lucide-react";
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
  type ClientContact,
  type ClientConfiguration,
  type ClientMetricConfig,
  type ClientMetricUnit,
  type ClientPillarConfig,
  type ClientRelationshipStatus,
  type Company,
  type MaturityLevel,
  bvbpPillarIds,
  bvbpPillarLabels,
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
import { cn } from "@/lib/utils";

interface ClientSetupCompanyForm {
  name: string;
  segment: string;
  description: string;
  relationshipStatus: ClientRelationshipStatus;
  bvbpOwner: string;
  companySize: string;
  employees: string;
  monthlyRevenue: string;
  recurringRevenue: string;
  monthlyOperationalCost: string;
  reportedRevenue: string;
  contacts: ClientContact[];
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

const defaultCompanyForm: ClientSetupCompanyForm = {
  name: "",
  segment: "",
  description: "",
  relationshipStatus: "Onboarding",
  bvbpOwner: "BVBP",
  companySize: "",
  employees: "",
  monthlyRevenue: "",
  recurringRevenue: "",
  monthlyOperationalCost: "",
  reportedRevenue: "",
  contacts: [],
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
          isPrimary: true,
          accessStatus: "planned" as const,
        }]
      : [];

  return {
    company: {
      ...defaultCompanyForm,
      name: company?.name || "",
      segment: company?.segment || "",
      description: company?.description || "",
      relationshipStatus: company?.relationshipStatus || company?.status || "Onboarding",
      bvbpOwner: company?.bvbpOwner || "BVBP",
      companySize: company?.companySize || "",
      employees: toStringValue(company?.employees ?? defaultCompanyForm.employees),
      monthlyRevenue: toStringValue(company?.monthlyRevenue ?? defaultCompanyForm.monthlyRevenue),
      recurringRevenue: toStringValue(company?.recurringRevenue ?? defaultCompanyForm.recurringRevenue),
      monthlyOperationalCost: toStringValue(company?.monthlyOperationalCost ?? defaultCompanyForm.monthlyOperationalCost),
      reportedRevenue: toStringValue(company?.reportedRevenue),
      contacts,
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
      reportedRevenue: toOptionalNumber(state.company.reportedRevenue),
      startDate: state.company.startDate,
      contactName: primaryContact?.name || "",
      contactEmail: primaryContact?.email || "",
      contacts: state.company.contacts,
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
    startDate: input.startDate?.trim() || undefined,
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    contacts: input.contacts,
    relationshipStatus: input.relationshipStatus,
    status: input.relationshipStatus,
  };
}

export function ClientSetupWizard({ mode, company, configuration, onCancel, onSave }: ClientSetupWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [state, setState] = useState(() => createInitialState(company, configuration));
  const [saving, setSaving] = useState(false);
  const [contactAccessLoadingId, setContactAccessLoadingId] = useState<string>();
  const isBasicValid = state.company.name.trim().length > 1 && state.company.segment.trim().length > 1;
  const areContactsValid =
    state.company.contacts.every((contact) => contact.name.trim().length > 1 && EMAIL_PATTERN.test(contact.email.trim())) &&
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
    setSaving(true);

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
      setSaving(false);
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
    <div className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised shadow-none">
      <div className="border-b border-bvbp-ink/10 p-4">
        <div className="grid gap-2 sm:grid-cols-5">
          {steps.map((step, index) => (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStep(index)}
              className={cn(
                "rounded-[8px] border px-3 py-2 text-left text-sm font-semibold transition",
                activeStep === index
                  ? "border-bvbp-forest bg-bvbp-forest text-bvbp-ivory"
                  : "border-bvbp-ink/10 bg-bvbp-ivory text-bvbp-muted-ink hover:bg-bvbp-inset hover:text-bvbp-ink",
              )}
            >
              <span className="block font-label text-[10px] uppercase tracking-[0.12em] opacity-70">
                {String(index + 1).padStart(2, "0")}
              </span>
              {step}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {activeStep === 0 && <ClientBasicDataStep {...stepProps} />}
        {activeStep === 1 && <ClientPainsStep {...stepProps} />}
        {activeStep === 2 && <ClientMetricsStep {...stepProps} />}
        {activeStep === 3 && <ClientMaturityStep {...stepProps} />}
        {activeStep === 4 && <ClientReviewStep {...stepProps} />}
      </div>

      <div className="flex flex-col gap-3 border-t border-bvbp-ink/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <div className="flex flex-col gap-2 sm:flex-row">
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
              className="rounded-[8px] bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark"
              disabled={!isCurrentStepValid}
              onClick={() => setActiveStep((current) => Math.min(steps.length - 1, current + 1))}
            >
              Avançar
            </Button>
          ) : (
            <Button
              type="button"
              className="rounded-[8px] bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark"
              disabled={saving || !isBasicValid || !areContactsValid || !arePointersValid}
              onClick={() => void handleSave()}
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {saving ? "Salvando..." : mode === "create" ? "Salvar cliente" : "Salvar alterações"}
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
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="client-name">Nome do cliente</Label>
        <Input id="client-name" value={state.company.name} onChange={(event) => updateCompanyField("name", event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client-segment">Segmento</Label>
        <Input id="client-segment" value={state.company.segment} onChange={(event) => updateCompanyField("segment", event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Fase do relacionamento</Label>
        <Select
          value={state.company.relationshipStatus}
          onValueChange={(value) => updateCompanyField("relationshipStatus", value as ClientRelationshipStatus)}
        >
          <SelectTrigger>
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
      <div className="space-y-3 border-t border-bvbp-ink/10 pt-5 sm:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-bvbp-ink">Contatos do workspace</h2>
            <p className="mt-1 text-sm text-bvbp-muted-ink">Cadastre as pessoas que acessarão o workspace do cliente.</p>
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
              const isContactIncomplete = contact.name.trim().length <= 1 || !EMAIL_PATTERN.test(contact.email.trim());
              const isAccessLocked = contact.accessStatus !== "planned";
              const canManageAccess = mode === "edit" && Boolean(companyId);

              return (
                <article key={contact.id} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4">
                  <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
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
    return financialPillar?.selectedMetricIds[0] || null;
  });
  const [isDetailCollapsed, setIsDetailCollapsed] = useState(false);
  const pillar = getPillarConfig(state, activePillar);
  const metrics = getPillarMetrics(state, activePillar);
  const selectedMetricIds = pillar?.selectedMetricIds || [];
  const activeMetric = metrics.find((metric) => metric.id === activeMetricId && selectedMetricIds.includes(metric.id));

  const selectPillar = (pillarId: BvbpPillarId) => {
    const nextPillar = getPillarConfig(state, pillarId);
    setActivePillar(pillarId);
    setActiveMetricId(nextPillar?.selectedMetricIds[0] || null);
    setIsDetailCollapsed(false);
  };

  const changeMetricSelection = (metric: ClientMetricConfig, isSelected: boolean) => {
    toggleMetric(metric.pillar, metric.id);

    if (isSelected) {
      const nextActiveMetricId = selectedMetricIds.find((metricId) => metricId !== metric.id) || null;
      setActiveMetricId(nextActiveMetricId);
      return;
    }

    setActiveMetricId(metric.id);
    setIsDetailCollapsed(false);
  };

  const addMetric = (metric: ClientMetricConfig) => {
    addCustomMetric(metric);
    setActivePillar(metric.pillar);
    setActiveMetricId(metric.id);
    setIsDetailCollapsed(false);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-bvbp-ink">Ponteiros acompanhados</h2>
          <p className="mt-1 text-sm text-bvbp-muted-ink">
            Selecione os ponteiros essenciais e registre baseline, fórmula, meta e fonte.
          </p>
        </div>
        <CustomMetricDialog onAdd={addMetric} />
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
                  activeMetric && !isDetailCollapsed
                    ? "lg:grid-cols-[minmax(260px,0.75fr)_minmax(0,1.35fr)]"
                    : "lg:grid-cols-[minmax(0,1fr)_auto]",
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
                      const isActive = activeMetricId === metric.id && isSelected;

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
                              if (!isSelected) {
                                changeMetricSelection(metric, false);
                              } else {
                                setActiveMetricId(metric.id);
                                setIsDetailCollapsed(false);
                              }
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
                  </div>
                </article>

                {activeMetric && !isDetailCollapsed ? (
                  <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4">
                    <div className="flex items-start justify-between gap-3 border-b border-bvbp-ink/10 pb-4">
                      <div className="min-w-0">
                        <p className="font-label text-[11px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
                          Detalhes do ponteiro
                        </p>
                        <h3 className="mt-2 font-heading text-xl font-semibold text-bvbp-ink">{activeMetric.name}</h3>
                        <p className="mt-1 text-sm leading-5 text-bvbp-muted-ink">{activeMetric.description}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDetailCollapsed(true)}
                        title="Recolher detalhes"
                      >
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">Recolher detalhes</span>
                      </Button>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                ) : activeMetric ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 self-start"
                    onClick={() => setIsDetailCollapsed(false)}
                    title="Mostrar detalhes"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Mostrar detalhes</span>
                  </Button>
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

  return (
    <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4">
        <p className="font-label text-xs font-medium uppercase tracking-[0.12em] text-bvbp-muted-ink">Dados</p>
        <h2 className="mt-3 font-heading text-xl font-semibold text-bvbp-ink">{state.company.name || "Cliente sem nome"}</h2>
        <div className="mt-4 grid gap-2 text-sm text-bvbp-muted-ink">
          <p>{state.company.segment || "Segmento não informado"}</p>
          <p>{state.company.relationshipStatus}</p>
          <p>Responsável: {state.company.bvbpOwner || "BVBP"}</p>
          <p>Contato: {primaryContact?.name || "Não informado"}</p>
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

export function CustomMetricDialog({ onAdd }: { onAdd: (metric: ClientMetricConfig) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    pillar: "financial" as BvbpPillarId,
    unit: "count" as ClientMetricUnit,
    currentValue: "",
    target: "",
    source: "",
    formula: "",
  });

  const addMetric = () => {
    if (!form.name.trim() || !form.formula.trim()) return;

    onAdd({
      id: `custom-${form.pillar}-${Date.now()}`,
      name: form.name.trim(),
      pillar: form.pillar,
      description: "Ponteiro personalizado para o cliente atual.",
      unit: form.unit,
      formula: form.formula.trim(),
      currentValue: toOptionalNumber(form.currentValue),
      target: form.target.trim() || undefined,
      source: form.source.trim() || undefined,
      custom: true,
    });
    setForm({ name: "", pillar: "financial", unit: "count", currentValue: "", target: "", source: "", formula: "" });
    setOpen(false);
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        Novo ponteiro
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
                <SelectTrigger>
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
                <SelectTrigger>
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
              <Label htmlFor="custom-metric-value">Valor atual</Label>
              <Input id="custom-metric-value" type="number" value={form.currentValue} onChange={(event) => setForm({ ...form, currentValue: event.target.value })} placeholder="Opcional" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-metric-target">Meta</Label>
              <Input id="custom-metric-target" value={form.target} onChange={(event) => setForm({ ...form, target: event.target.value })} placeholder="Opcional" />
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
