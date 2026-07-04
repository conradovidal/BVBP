import { useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  type BvbpPillarId,
  type ClientConfiguration,
  type ClientMetricConfig,
  type ClientMetricDataType,
  type ClientMetricUnit,
  type ClientPillarConfig,
  type ClientRelationshipStatus,
  type Company,
  bvbpPillarIds,
  bvbpPillarLabels,
  maturityLevels,
  painCatalogByPillar,
  relationshipStatuses,
} from "@/data/performanceSystem";
import {
  type ClientSetupInput,
  clientMetricDataTypeLabels,
  clientMetricUnitLabels,
} from "@/lib/clientConfigurationStore";
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
  contactName: string;
  contactEmail: string;
  startDate: string;
}

interface ClientSetupFormState {
  company: ClientSetupCompanyForm;
  configuration: Omit<ClientConfiguration, "companyId">;
}

interface ClientSetupWizardProps {
  mode: "create" | "edit";
  company?: Company;
  configuration: ClientConfiguration;
  onCancel: () => void;
  onSave: (input: ClientSetupInput) => void;
}

interface StepProps {
  state: ClientSetupFormState;
  updateCompanyField: <K extends keyof ClientSetupCompanyForm>(field: K, value: ClientSetupCompanyForm[K]) => void;
  updatePillar: (pillarId: BvbpPillarId, patch: Partial<ClientPillarConfig>) => void;
  togglePain: (pillarId: BvbpPillarId, pain: string) => void;
  toggleMetric: (pillarId: BvbpPillarId, metricId: string) => void;
  updateMetric: (metricId: string, patch: Partial<ClientMetricConfig>) => void;
  addCustomMetric: (metric: ClientMetricConfig) => void;
}

const steps = ["Dados", "Dores", "Métricas", "Maturidade", "Revisão"] as const;

const defaultCompanyForm: ClientSetupCompanyForm = {
  name: "",
  segment: "",
  description: "",
  relationshipStatus: "Onboarding",
  bvbpOwner: "BVBP",
  companySize: "",
  employees: "20",
  monthlyRevenue: "180000",
  recurringRevenue: "70000",
  monthlyOperationalCost: "120000",
  reportedRevenue: "",
  contactName: "",
  contactEmail: "",
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
      contactName: company?.contactName || "",
      contactEmail: company?.contactEmail || "",
      startDate: company?.startDate || "",
    },
    configuration: {
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

function buildSaveInput(state: ClientSetupFormState): ClientSetupInput {
  return {
    company: {
      name: state.company.name,
      segment: state.company.segment,
      description: state.company.description,
      relationshipStatus: state.company.relationshipStatus,
      bvbpOwner: state.company.bvbpOwner,
      companySize: state.company.companySize,
      employees: toNumber(state.company.employees),
      monthlyRevenue: toNumber(state.company.monthlyRevenue),
      recurringRevenue: toNumber(state.company.recurringRevenue),
      monthlyOperationalCost: toNumber(state.company.monthlyOperationalCost),
      reportedRevenue: toOptionalNumber(state.company.reportedRevenue),
      startDate: state.company.startDate,
      contactName: state.company.contactName,
      contactEmail: state.company.contactEmail,
    },
    configuration: state.configuration,
  };
}

export function ClientSetupWizard({ mode, company, configuration, onCancel, onSave }: ClientSetupWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [state, setState] = useState(() => createInitialState(company, configuration));
  const isBasicValid = state.company.name.trim().length > 1 && state.company.segment.trim().length > 1;

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

  const stepProps: StepProps = {
    state,
    updateCompanyField,
    updatePillar,
    togglePain,
    toggleMetric,
    updateMetric,
    addCustomMetric,
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
              disabled={!isBasicValid && activeStep === 0}
              onClick={() => setActiveStep((current) => Math.min(steps.length - 1, current + 1))}
            >
              Avançar
            </Button>
          ) : (
            <Button
              type="button"
              className="rounded-[8px] bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark"
              disabled={!isBasicValid}
              onClick={() => onSave(buildSaveInput(state))}
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {mode === "create" ? "Salvar cliente" : "Salvar alterações"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ClientBasicDataStep({ state, updateCompanyField }: StepProps) {
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
      <div className="space-y-2">
        <Label htmlFor="client-owner">Responsável BVBP</Label>
        <Input id="client-owner" value={state.company.bvbpOwner} onChange={(event) => updateCompanyField("bvbpOwner", event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client-size">Tamanho da empresa</Label>
        <Input id="client-size" value={state.company.companySize} onChange={(event) => updateCompanyField("companySize", event.target.value)} placeholder="Ex.: 50-100 pessoas" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client-employees">Funcionários</Label>
        <Input id="client-employees" type="number" min="0" value={state.company.employees} onChange={(event) => updateCompanyField("employees", event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client-reported-revenue">Faturamento informado</Label>
        <Input id="client-reported-revenue" type="number" min="0" value={state.company.reportedRevenue} onChange={(event) => updateCompanyField("reportedRevenue", event.target.value)} placeholder="Opcional" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client-monthly-revenue">Receita mensal</Label>
        <Input id="client-monthly-revenue" type="number" min="0" value={state.company.monthlyRevenue} onChange={(event) => updateCompanyField("monthlyRevenue", event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client-recurring-revenue">Receita recorrente</Label>
        <Input id="client-recurring-revenue" type="number" min="0" value={state.company.recurringRevenue} onChange={(event) => updateCompanyField("recurringRevenue", event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client-cost">Custo operacional</Label>
        <Input id="client-cost" type="number" min="0" value={state.company.monthlyOperationalCost} onChange={(event) => updateCompanyField("monthlyOperationalCost", event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client-start">Data de início</Label>
        <Input id="client-start" value={state.company.startDate} onChange={(event) => updateCompanyField("startDate", event.target.value)} placeholder="2026-07-03" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client-contact">Contato principal</Label>
        <Input id="client-contact" value={state.company.contactName} onChange={(event) => updateCompanyField("contactName", event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client-email">Email</Label>
        <Input id="client-email" type="email" value={state.company.contactEmail} onChange={(event) => updateCompanyField("contactEmail", event.target.value)} />
      </div>
    </section>
  );
}

export function ClientPainsStep({ state, togglePain }: StepProps) {
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
            </div>
          </article>
        );
      })}
    </section>
  );
}

export function ClientMetricsStep({ state, toggleMetric, updateMetric, addCustomMetric }: StepProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-bvbp-ink">Métricas acompanhadas</h2>
          <p className="mt-1 text-sm text-bvbp-muted-ink">A métrica pode ficar selecionada mesmo sem valor atual.</p>
        </div>
        <CustomMetricDialog onAdd={addCustomMetric} />
      </div>
      <div className="grid gap-4">
        {bvbpPillarIds.map((pillarId) => {
          const pillar = getPillarConfig(state, pillarId);
          const metrics = getPillarMetrics(state, pillarId);

          return (
            <article key={pillarId} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4">
              <h3 className="font-heading text-lg font-semibold text-bvbp-ink">{bvbpPillarLabels[pillarId]}</h3>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {metrics.map((metric) => {
                  const isSelected = Boolean(pillar?.selectedMetricIds.includes(metric.id));

                  return (
                    <div key={metric.id} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-3">
                      <label className="flex items-start gap-3">
                        <Checkbox checked={isSelected} onCheckedChange={() => toggleMetric(pillarId, metric.id)} />
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-bvbp-ink">{metric.name}</span>
                          <span className="mt-1 block text-xs leading-5 text-bvbp-muted-ink">
                            {metric.description} · {clientMetricUnitLabels[metric.unit]}
                            {metric.custom ? " · customizada" : ""}
                          </span>
                        </span>
                      </label>
                      {isSelected && (
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`${metric.id}-value`}>Valor atual</Label>
                            <Input
                              id={`${metric.id}-value`}
                              type="number"
                              value={metric.currentValue ?? ""}
                              onChange={(event) =>
                                updateMetric(metric.id, {
                                  currentValue: event.target.value.trim() ? Number(event.target.value) : undefined,
                                })
                              }
                              placeholder="Sem baseline"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${metric.id}-target`}>Meta</Label>
                            <Input
                              id={`${metric.id}-target`}
                              value={metric.target || ""}
                              onChange={(event) => updateMetric(metric.id, { target: event.target.value })}
                              placeholder="Opcional"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Tipo de dado</Label>
                            <Select
                              value={metric.dataType}
                              onValueChange={(value) => updateMetric(metric.id, { dataType: value as ClientMetricDataType })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(clientMetricDataTypeLabels).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${metric.id}-source`}>Fonte</Label>
                            <Input
                              id={`${metric.id}-source`}
                              value={metric.source || ""}
                              onChange={(event) => updateMetric(metric.id, { source: event.target.value })}
                              placeholder="Opcional"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ClientMaturityStep({ state, updatePillar }: StepProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {bvbpPillarIds.map((pillarId) => {
        const pillar = getPillarConfig(state, pillarId);

        if (!pillar) return null;

        return (
          <article key={pillarId} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4">
            <h2 className="font-heading text-lg font-semibold text-bvbp-ink">{bvbpPillarLabels[pillarId]}</h2>
            <div className="mt-4 grid gap-4">
              <MaturityLevelSelector
                value={pillar.maturityLevel}
                onChange={(level) => {
                  const maturity = maturityLevels.find((item) => item.level === level) || maturityLevels[0];
                  updatePillar(pillarId, {
                    maturityLevel: level,
                    currentLevelName: maturity.name,
                    nextLevel: Math.min(level + 1, 5) as 1 | 2 | 3 | 4 | 5,
                  });
                }}
              />
              <div className="space-y-2">
                <Label htmlFor={`${pillarId}-criteria`}>Critério para avançar</Label>
                <Textarea
                  id={`${pillarId}-criteria`}
                  rows={2}
                  value={pillar.advancementCriteria}
                  onChange={(event) => updatePillar(pillarId, { advancementCriteria: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${pillarId}-notes`}>Observações</Label>
                <Textarea
                  id={`${pillarId}-notes`}
                  rows={2}
                  value={pillar.notes}
                  onChange={(event) => updatePillar(pillarId, { notes: event.target.value })}
                  placeholder="Opcional"
                />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export function ClientReviewStep({ state }: StepProps) {
  const selectedMetrics = useMemo(() => {
    const selectedIds = new Set(state.configuration.pillars.flatMap((pillar) => pillar.selectedMetricIds));
    return state.configuration.metrics.filter((metric) => selectedIds.has(metric.id));
  }, [state.configuration.metrics, state.configuration.pillars]);

  return (
    <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4">
        <p className="font-label text-xs font-medium uppercase tracking-[0.12em] text-bvbp-muted-ink">Dados</p>
        <h2 className="mt-3 font-heading text-xl font-semibold text-bvbp-ink">{state.company.name || "Cliente sem nome"}</h2>
        <div className="mt-4 grid gap-2 text-sm text-bvbp-muted-ink">
          <p>{state.company.segment || "Segmento não informado"}</p>
          <p>{state.company.relationshipStatus}</p>
          <p>Responsável: {state.company.bvbpOwner || "BVBP"}</p>
          <p>Contato: {state.company.contactName || "Não informado"}</p>
        </div>
      </article>
      <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-ivory p-4">
        <p className="font-label text-xs font-medium uppercase tracking-[0.12em] text-bvbp-muted-ink">Resumo por pilar</p>
        <div className="mt-4 grid gap-3">
          {state.configuration.pillars.map((pillar) => {
            const metricCount = selectedMetrics.filter((metric) => metric.pillar === pillar.pillar).length;

            return (
              <div key={pillar.pillar} className="rounded-[8px] bg-bvbp-raised p-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-bvbp-ink">{bvbpPillarLabels[pillar.pillar]}</p>
                  <p className="font-semibold text-bvbp-muted-ink">{pillar.maturityLevel}/5</p>
                </div>
                <p className="mt-1 text-bvbp-muted-ink">{pillar.currentLevelName}</p>
                <p className="mt-2 text-xs text-bvbp-muted-ink">
                  {metricCount} métricas · {pillar.pains.length} dores
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
    dataType: "estimated" as ClientMetricDataType,
    frequency: "",
  });

  const addMetric = () => {
    if (!form.name.trim()) return;

    onAdd({
      id: `custom-${form.pillar}-${Date.now()}`,
      name: form.name.trim(),
      pillar: form.pillar,
      description: "Métrica customizada cadastrada localmente.",
      unit: form.unit,
      dataType: form.dataType,
      currentValue: toOptionalNumber(form.currentValue),
      target: form.target.trim() || undefined,
      source: form.source.trim() || undefined,
      frequency: form.frequency.trim() || undefined,
      custom: true,
    });
    setForm({ name: "", pillar: "financial", unit: "count", currentValue: "", target: "", source: "", dataType: "estimated", frequency: "" });
    setOpen(false);
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        Nova métrica
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova métrica</DialogTitle>
            <DialogDescription>Métrica local para acompanhar no cliente atual.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="custom-metric-name">Nome</Label>
              <Input id="custom-metric-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
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
            <div className="space-y-2">
              <Label>Tipo de dado</Label>
              <Select value={form.dataType} onValueChange={(value) => setForm({ ...form, dataType: value as ClientMetricDataType })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(clientMetricDataTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-metric-frequency">Frequência</Label>
              <Input id="custom-metric-frequency" value={form.frequency} onChange={(event) => setForm({ ...form, frequency: event.target.value })} placeholder="Semanal, mensal..." />
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
            <Button type="button" className="rounded-[8px] bg-bvbp-forest text-bvbp-ivory hover:bg-bvbp-forest-dark" onClick={addMetric}>
              Adicionar métrica
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function MaturityLevelSelector({
  value,
  onChange,
}: {
  value: 1 | 2 | 3 | 4 | 5;
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void;
}) {
  const level = maturityLevels.find((item) => item.level === value) || maturityLevels[0];

  return (
    <div className="space-y-3">
      <Label>Nível de maturidade</Label>
      <div className="grid grid-cols-5 gap-2">
        {maturityLevels.map((item) => (
          <button
            key={item.level}
            type="button"
            onClick={() => onChange(item.level)}
            className={cn(
              "rounded-[8px] border px-2 py-2 text-center text-sm font-semibold transition",
              value === item.level
                ? "border-bvbp-forest bg-bvbp-forest text-bvbp-ivory"
                : "border-bvbp-ink/10 bg-bvbp-raised text-bvbp-muted-ink hover:bg-bvbp-inset hover:text-bvbp-ink",
            )}
          >
            {item.level}
          </button>
        ))}
      </div>
      <div className="rounded-[8px] bg-bvbp-raised p-3">
        <p className="font-semibold text-bvbp-ink">{level.name}</p>
        <p className="mt-1 text-sm leading-5 text-bvbp-muted-ink">{level.description}</p>
      </div>
    </div>
  );
}
