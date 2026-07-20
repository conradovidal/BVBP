import { useEffect, useMemo, useState } from "react";
import { Check, LockKeyhole, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerBr } from "@/components/ui/date-picker-br";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type BvbpPillarId,
  type ClientConfiguration,
  type ClientMetricBaselineRevision,
  type ClientMetricConfig,
  type ClientMetricDirection,
  type ClientMetricMeasurement,
  type ClientMetricMeasurementContext,
  type ClientMetricUnit,
  type Company,
  type PdcaCycle,
  bvbpPillarLabels,
} from "@/data/performanceSystem";
import { clientMetricUnitLabels, persistClientConfiguration } from "@/lib/clientConfigurationStore";
import { formatMetricValue } from "@/lib/initiativeProgress";
import { cn } from "@/lib/utils";

const units: ClientMetricUnit[] = ["currency", "percentage", "hours", "count", "days", "text"];
const directions: Array<{ value: ClientMetricDirection; label: string }> = [
  { value: "higher", label: "Quanto maior, melhor" },
  { value: "lower", label: "Quanto menor, melhor" },
  { value: "target", label: "Quanto mais próximo da meta, melhor" },
];
const contexts: ClientMetricMeasurementContext[] = ["Reunião", "Dado", "Decisão", "Estimativa"];

function cloneConfiguration(configuration: ClientConfiguration): ClientConfiguration {
  return JSON.parse(JSON.stringify(configuration)) as ClientConfiguration;
}

function optionalNumber(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value.trim().replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function createId(prefix: string) {
  return globalThis.crypto?.randomUUID?.() || `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface PillarPointerEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company;
  pillarId: BvbpPillarId;
  configuration: ClientConfiguration;
  initiatives: PdcaCycle[];
  createdByUserId?: string;
  createdByName?: string;
  onSaved: () => void;
}

export function PillarPointerEditorDialog({
  open,
  onOpenChange,
  company,
  pillarId,
  configuration,
  initiatives,
  createdByUserId,
  createdByName,
  onSaved,
}: PillarPointerEditorDialogProps) {
  const [draft, setDraft] = useState<ClientConfiguration>(() => cloneConfiguration(configuration));
  const [activeMetricId, setActiveMetricId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [measurement, setMeasurement] = useState({ value: "", measuredAt: today(), context: "Dado" as ClientMetricMeasurementContext, source: "", note: "" });

  useEffect(() => {
    if (!open) return;
    const next = cloneConfiguration(configuration);
    const pillar = next.pillars.find((item) => item.pillar === pillarId);
    const firstMetricId = pillar?.selectedMetricIds[0] || next.metrics.find((item) => item.pillar === pillarId)?.id || null;
    setDraft(next);
    setActiveMetricId(firstMetricId);
    setError("");
    setMeasurement({ value: "", measuredAt: today(), context: "Dado", source: "", note: "" });
  }, [configuration, open, pillarId]);

  const pillar = draft.pillars.find((item) => item.pillar === pillarId);
  const metrics = draft.metrics.filter((item) => item.pillar === pillarId);
  const activeMetric = metrics.find((item) => item.id === activeMetricId);
  const selectedIds = new Set(pillar?.selectedMetricIds || []);
  const activeHasDependencies = Boolean(activeMetric && (
    (activeMetric.measurements?.length || 0) > 0 || initiatives.some((initiative) => initiative.metricId === activeMetric.id)
  ));

  const originalMetricById = useMemo(() => new Map(configuration.metrics.map((item) => [item.id, item])), [configuration.metrics]);

  const updateMetric = (metricId: string, patch: Partial<ClientMetricConfig>) => {
    setDraft((current) => ({
      ...current,
      metrics: current.metrics.map((metric) => metric.id === metricId ? { ...metric, ...patch } : metric),
    }));
  };

  const toggleMetric = (metric: ClientMetricConfig) => {
    setDraft((current) => ({
      ...current,
      pillars: current.pillars.map((item) => {
        if (item.pillar !== pillarId) return item;
        const isSelected = item.selectedMetricIds.includes(metric.id);
        const selectedMetricIds = isSelected
          ? item.selectedMetricIds.filter((id) => id !== metric.id)
          : [...item.selectedMetricIds, metric.id];
        return {
          ...item,
          selectedMetricIds,
          criticalMetricId: isSelected && item.criticalMetricId === metric.id ? undefined : item.criticalMetricId,
        };
      }),
    }));
    setActiveMetricId(metric.id);
  };

  const setPrimary = (metricId: string) => {
    setDraft((current) => ({
      ...current,
      pillars: current.pillars.map((item) => item.pillar === pillarId ? { ...item, criticalMetricId: metricId } : item),
    }));
  };

  const addCustomMetric = () => {
    const id = `${company.id}-${pillarId}-metric-${Date.now()}`;
    const metric: ClientMetricConfig = {
      id,
      name: "Novo ponteiro",
      pillar: pillarId,
      description: "",
      unit: "count",
      formula: "",
      direction: "higher",
      owner: company.bvbpOwner,
      measurements: [],
      baselineHistory: [],
      custom: true,
    };
    setDraft((current) => ({
      ...current,
      metrics: [...current.metrics, metric],
      pillars: current.pillars.map((item) => item.pillar === pillarId
        ? { ...item, selectedMetricIds: [...item.selectedMetricIds, id] }
        : item),
    }));
    setActiveMetricId(id);
  };

  const addMeasurement = () => {
    if (!activeMetric) return;
    const value = optionalNumber(measurement.value);
    if (value === undefined || !measurement.measuredAt) {
      setError("Informe um valor e uma data válidos para a medição.");
      return;
    }
    const entry: ClientMetricMeasurement = {
      id: createId("measurement"),
      value,
      measuredAt: measurement.measuredAt,
      context: measurement.context,
      source: measurement.source.trim() || activeMetric.source,
      note: measurement.note.trim() || undefined,
      createdAt: new Date().toISOString(),
      createdByUserId,
      createdByName,
    };
    updateMetric(activeMetric.id, {
      currentValue: value,
      valueOrigin: measurement.context === "Estimativa" ? "estimated" : "informed",
      source: entry.source,
      measurements: [entry, ...(activeMetric.measurements || [])],
    });
    setMeasurement({ value: "", measuredAt: today(), context: "Dado", source: activeMetric.source || "", note: "" });
    setError("");
  };

  const save = async () => {
    if (!pillar) return;
    if (pillar.selectedMetricIds.length > 0 && !pillar.criticalMetricId) {
      setError("Escolha explicitamente um ponteiro principal antes de salvar.");
      return;
    }
    const selectedMetrics = metrics.filter((metric) => selectedIds.has(metric.id));
    const invalidMetric = selectedMetrics.find((metric) => !metric.name.trim() || !metric.formula.trim());
    if (invalidMetric) {
      setActiveMetricId(invalidMetric.id);
      setError("Todo ponteiro acompanhado precisa ter nome e fórmula.");
      return;
    }
    const baselineWithoutSource = selectedMetrics.find((metric) => metric.baselineValue !== undefined && !metric.source?.trim());
    if (baselineWithoutSource) {
      setActiveMetricId(baselineWithoutSource.id);
      setError("Informe a fonte sempre que houver baseline.");
      return;
    }

    const now = new Date().toISOString();
    const nextMetrics = draft.metrics.map((metric) => {
      if (metric.pillar !== pillarId) return metric;
      const original = originalMetricById.get(metric.id);
      const baselineChanged = metric.baselineValue !== undefined && metric.baselineValue !== original?.baselineValue;
      const baselineMeasuredAt = metric.baselineMeasuredAt || today();
      const baselineRevision: ClientMetricBaselineRevision | undefined = baselineChanged ? {
        id: createId("baseline"),
        value: metric.baselineValue!,
        measuredAt: baselineMeasuredAt,
        source: metric.source,
        createdAt: now,
        createdByUserId,
        createdByName,
      } : undefined;
      let measurements = metric.measurements || [];
      let currentValue = metric.currentValue;
      if (metric.baselineValue !== undefined && currentValue === undefined) {
        currentValue = metric.baselineValue;
        measurements = [{
          id: createId("measurement"),
          value: metric.baselineValue,
          measuredAt: baselineMeasuredAt,
          context: "Dado",
          source: metric.source,
          note: "Primeira medição criada a partir do baseline.",
          createdAt: now,
          createdByUserId,
          createdByName,
        }, ...measurements];
      } else if (currentValue !== undefined && currentValue !== original?.currentValue && measurements.length === (original?.measurements?.length || 0)) {
        measurements = [{
          id: createId("measurement"),
          value: currentValue,
          measuredAt: today(),
          context: "Dado",
          source: metric.source,
          note: "Valor atual registrado no editor do pilar.",
          createdAt: now,
          createdByUserId,
          createdByName,
        }, ...measurements];
      }
      return {
        ...metric,
        baselineMeasuredAt: metric.baselineValue === undefined ? undefined : baselineMeasuredAt,
        baselineHistory: baselineRevision ? [baselineRevision, ...(metric.baselineHistory || [])] : metric.baselineHistory || [],
        currentValue,
        measurements,
      };
    });

    setIsSaving(true);
    setError("");
    try {
      await persistClientConfiguration({ ...draft, schemaVersion: 6, metrics: nextMetrics });
      onSaved();
      onOpenChange(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível salvar os ponteiros.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        withinContentArea
        className="max-h-[92vh] !max-w-[calc(100vw-2rem)] overflow-hidden bg-bvbp-ivory p-0 lg:!max-w-[calc(100vw-292px)] 2xl:!max-w-6xl"
      >
        <DialogHeader className="border-b border-bvbp-ink/10 px-6 py-5 pr-14">
          <DialogTitle>Ponteiros de {bvbpPillarLabels[pillarId]}</DialogTitle>
          <DialogDescription>Selecione o que será acompanhado, defina o principal e mantenha baseline, medições e meta no mesmo lugar.</DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="max-h-[calc(92vh-164px)] overflow-y-auto border-r border-bvbp-ink/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Catálogo</p>
              <Button type="button" variant="outline" size="sm" onClick={addCustomMetric}><Plus className="h-4 w-4" /> Personalizado</Button>
            </div>
            <div className="mt-3 space-y-2">
              {metrics.map((metric) => {
                const selected = selectedIds.has(metric.id);
                const primary = pillar?.criticalMetricId === metric.id;
                return (
                  <article key={metric.id} className={cn("rounded-[8px] border bg-bvbp-raised p-3", activeMetricId === metric.id ? "border-bvbp-forest/55" : "border-bvbp-ink/10")}>
                    <div className="flex items-start gap-3">
                      <Checkbox checked={selected} onCheckedChange={() => toggleMetric(metric)} aria-label={`Acompanhar ${metric.name}`} />
                      <button type="button" className="min-w-0 flex-1 text-left" onClick={() => setActiveMetricId(metric.id)}>
                        <span className="block font-semibold text-bvbp-ink">{metric.name}</span>
                        <span className="mt-1 block text-xs text-bvbp-muted-ink">{metric.custom ? "Personalizado" : clientMetricUnitLabels[metric.unit]}</span>
                      </button>
                      {selected ? (
                        <button type="button" onClick={() => setPrimary(metric.id)} className={cn("rounded-full p-1.5", primary ? "bg-bvbp-gold/20 text-bvbp-gold" : "text-bvbp-muted-ink hover:bg-bvbp-inset")} aria-label={`Definir ${metric.name} como principal`} title="Ponteiro principal">
                          <Star className={cn("h-4 w-4", primary && "fill-current")} />
                        </button>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </aside>

          <main className="max-h-[calc(92vh-164px)] overflow-y-auto p-5">
            {activeMetric ? (
              <div className="space-y-5">
                <section className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2"><Label>Nome</Label><Input value={activeMetric.name} onChange={(event) => updateMetric(activeMetric.id, { name: event.target.value })} /></div>
                  <div className="space-y-2 sm:col-span-2"><Label>Descrição</Label><Textarea value={activeMetric.description} onChange={(event) => updateMetric(activeMetric.id, { description: event.target.value })} className="min-h-20" /></div>
                  <div className="space-y-2 sm:col-span-2"><Label>Fórmula</Label><Textarea value={activeMetric.formula} onChange={(event) => updateMetric(activeMetric.id, { formula: event.target.value })} className="min-h-16" /></div>
                  <div className="space-y-2"><Label>Unidade</Label><Select value={activeMetric.unit} disabled={activeHasDependencies} onValueChange={(value) => updateMetric(activeMetric.id, { unit: value as ClientMetricUnit })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{units.map((unit) => <SelectItem key={unit} value={unit}>{clientMetricUnitLabels[unit]}</SelectItem>)}</SelectContent></Select>{activeHasDependencies ? <p className="flex items-center gap-1 text-xs text-bvbp-muted-ink"><LockKeyhole className="h-3 w-3" /> Protegida por medições ou iniciativas vinculadas.</p> : null}</div>
                  <div className="space-y-2"><Label>Direção</Label><Select value={activeMetric.direction || "higher"} disabled={activeHasDependencies} onValueChange={(value) => updateMetric(activeMetric.id, { direction: value as ClientMetricDirection })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{directions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>
                </section>

                <section className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4">
                  <p className="font-heading text-lg font-semibold text-bvbp-ink">Referências e responsabilidade</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2"><Label>Baseline</Label><Input inputMode="decimal" value={activeMetric.baselineValue ?? ""} onChange={(event) => updateMetric(activeMetric.id, { baselineValue: optionalNumber(event.target.value) })} placeholder="A definir" /></div>
                    <div className="space-y-2"><Label>Data do baseline</Label><DatePickerBr value={activeMetric.baselineMeasuredAt || ""} onChange={(value) => updateMetric(activeMetric.id, { baselineMeasuredAt: value })} /></div>
                    <div className="space-y-2"><Label>Valor atual</Label><Input inputMode="decimal" value={activeMetric.currentValue ?? ""} onChange={(event) => updateMetric(activeMetric.id, { currentValue: optionalNumber(event.target.value) })} placeholder="Sem medição" /></div>
                    <div className="space-y-2"><Label>Meta</Label><Input value={activeMetric.target || ""} onChange={(event) => updateMetric(activeMetric.id, { target: event.target.value })} placeholder="A definir" /></div>
                    <div className="space-y-2 sm:col-span-2"><Label>Benchmark</Label><Input value={activeMetric.benchmark || ""} onChange={(event) => updateMetric(activeMetric.id, { benchmark: event.target.value })} placeholder="Referência interna ou externa" /></div>
                    <div className="space-y-2"><Label>Fonte</Label><Input value={activeMetric.source || ""} onChange={(event) => updateMetric(activeMetric.id, { source: event.target.value })} placeholder="DRE, CRM, relatório..." /></div>
                    <div className="space-y-2"><Label>Responsável</Label><Input value={activeMetric.owner || ""} onChange={(event) => updateMetric(activeMetric.id, { owner: event.target.value })} placeholder="Nome e sobrenome" /></div>
                  </div>
                </section>

                <section className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-heading text-lg font-semibold text-bvbp-ink">Medições</p><span className="text-xs text-bvbp-muted-ink">{activeMetric.measurements?.length || 0} registro(s)</span></div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <Input inputMode="decimal" value={measurement.value} onChange={(event) => setMeasurement((current) => ({ ...current, value: event.target.value }))} placeholder="Novo valor" />
                    <DatePickerBr value={measurement.measuredAt} onChange={(value) => setMeasurement((current) => ({ ...current, measuredAt: value }))} />
                    <Select value={measurement.context} onValueChange={(value) => setMeasurement((current) => ({ ...current, context: value as ClientMetricMeasurementContext }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{contexts.map((context) => <SelectItem key={context} value={context}>{context}</SelectItem>)}</SelectContent></Select>
                    <Input value={measurement.source} onChange={(event) => setMeasurement((current) => ({ ...current, source: event.target.value }))} placeholder="Fonte" />
                    <Button type="button" variant="outline" onClick={addMeasurement}><Plus className="h-4 w-4" /> Adicionar</Button>
                  </div>
                  <Input className="mt-3" value={measurement.note} onChange={(event) => setMeasurement((current) => ({ ...current, note: event.target.value }))} placeholder="Contexto da medição (opcional)" />
                  {activeMetric.measurements?.length ? (
                    <div className="mt-4 divide-y divide-bvbp-ink/10 border-t border-bvbp-ink/10">
                      {activeMetric.measurements.slice(0, 6).map((item) => <div key={item.id} className="grid gap-1 py-2.5 text-xs sm:grid-cols-[auto_auto_minmax(0,1fr)] sm:gap-3"><strong>{formatMetricValue(item.value, activeMetric.unit)}</strong><span className="text-bvbp-muted-ink">{item.measuredAt.split("-").reverse().join("/")}</span><span className="text-bvbp-muted-ink sm:text-right">{item.context}{item.source ? ` · ${item.source}` : ""}</span></div>)}
                    </div>
                  ) : <p className="mt-4 text-sm text-bvbp-muted-ink">Nenhuma medição registrada.</p>}
                </section>
              </div>
            ) : <div className="flex min-h-64 items-center justify-center text-sm text-bvbp-muted-ink">Selecione um ponteiro no catálogo.</div>}
          </main>
        </div>

        <DialogFooter className="border-t border-bvbp-ink/10 px-6 py-4">
          <div className="mr-auto min-h-5 text-sm text-bvbp-risk" role="alert">{error}</div>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="button" onClick={save} disabled={isSaving}><Check className="h-4 w-4" /> {isSaving ? "Salvando..." : "Salvar alterações"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
