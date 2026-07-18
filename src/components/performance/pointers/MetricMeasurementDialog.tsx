import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePickerBr } from "@/components/ui/date-picker-br";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ClientMetricConfig, ClientMetricMeasurementContext, Company } from "@/data/performanceSystem";
import { updateClientMetricMeasurement } from "@/lib/clientConfigurationStore";
import { formatMetricValue } from "@/lib/initiativeProgress";
import { addPdcaHistory } from "@/lib/pdcaCycleStore";

const contexts: ClientMetricMeasurementContext[] = ["Reunião", "Dado", "Decisão", "Estimativa"];

interface MetricMeasurementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company;
  metric?: ClientMetricConfig;
  initiativeId?: string;
  createdByName?: string;
  onSaved?: () => void;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

export function MetricMeasurementDialog({ open, onOpenChange, company, metric, initiativeId, createdByName, onSaved }: MetricMeasurementDialogProps) {
  const [value, setValue] = useState("");
  const [measuredAt, setMeasuredAt] = useState("");
  const [context, setContext] = useState<ClientMetricMeasurementContext>("Dado");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setValue(metric?.currentValue === undefined ? "" : String(metric.currentValue));
    setMeasuredAt(new Date().toISOString().slice(0, 10));
    setContext("Dado");
    setSource(metric?.source || "");
    setNote("");
  }, [metric, open]);

  const numericValue = value.trim() === "" ? undefined : Number(value.replace(",", "."));
  const canSave = numericValue !== undefined && Number.isFinite(numericValue) && Boolean(measuredAt) && Boolean(context);

  const save = () => {
    if (!metric || numericValue === undefined || !canSave) return;
    const result = updateClientMetricMeasurement(company, metric.id, {
      value: numericValue,
      measuredAt,
      context,
      source,
      note,
      createdByName,
    });
    if (!result) return;
    if (initiativeId) {
      addPdcaHistory(initiativeId, {
        kind: "content",
        description: `${metric.name}: valor atual registrado como ${formatMetricValue(numericValue, metric.unit)} (${context.toLowerCase()}).`,
        createdByName,
      });
    }
    onSaved?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent withinContentArea className="w-[calc(100%-2rem)] max-w-xl bg-bvbp-ivory">
        <DialogHeader>
          <DialogTitle>Atualizar {metric?.name || "ponteiro"}</DialogTitle>
          <DialogDescription>O novo valor será refletido em todas as telas e iniciativas conectadas.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="metric-measurement-value">Valor atual</Label>
            <Input id="metric-measurement-value" inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Informe o valor" autoFocus />
          </div>
          <div className="space-y-2">
            <Label>Data da medição</Label>
            <DatePickerBr id="metric-measurement-date" value={measuredAt} onChange={setMeasuredAt} />
          </div>
          <div className="space-y-2">
            <Label>Contexto</Label>
            <Select value={context} onValueChange={(next) => setContext(next as ClientMetricMeasurementContext)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{contexts.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="metric-measurement-source">Fonte (opcional)</Label>
            <Input id="metric-measurement-source" value={source} onChange={(event) => setSource(event.target.value)} placeholder="DRE, CRM, reunião..." />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="metric-measurement-note">Contexto adicional (opcional)</Label>
            <Input id="metric-measurement-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="O que explica esta atualização?" />
          </div>
        </div>

        {metric?.measurements?.length ? (
          <section className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-inset p-3">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">Últimas atualizações</p>
            <div className="mt-2 divide-y divide-bvbp-ink/10">
              {metric.measurements.slice(0, 3).map((measurement) => (
                <div key={measurement.id} className="grid grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-3 py-2 text-xs">
                  <strong className="text-bvbp-ink">{formatMetricValue(measurement.value, metric.unit)}</strong>
                  <span className="text-bvbp-muted-ink">{formatDate(measurement.measuredAt)}</span>
                  <span className="truncate text-right text-bvbp-muted-ink">{measurement.context}{measurement.createdByName ? ` · ${measurement.createdByName}` : ""}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="button" onClick={save} disabled={!canSave}><Check className="h-4 w-4" /> Registrar atualização</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
