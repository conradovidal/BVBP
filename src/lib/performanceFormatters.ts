import type { Metric } from "@/data/performanceSystem";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatMetricValue(metric: Metric) {
  if (metric.unit === "currency") return formatCurrency(metric.value);
  if (metric.unit === "percentage") return `${metric.value}%`;
  return formatNumber(metric.value);
}
