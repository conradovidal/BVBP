import {
  type BvbpPillarId,
  type ClientConfiguration,
  type ClientMetricConfig,
  type ClientMetricDataType,
  type ClientMetricUnit,
  type ClientPillarConfig,
  type Company,
  type MaturityMapItem,
  type OverviewPillarHighlight,
  bvbpPillarIds,
  bvbpPillarLabels,
  createDefaultClientConfiguration,
  maturityLevels,
  metricCatalogByPillar,
} from "@/data/performanceSystem";
import {
  type NewClientInput,
  createPortalCompany,
  getCompanyById,
  updatePortalCompany,
} from "@/lib/clientPortalStore";
import {
  PORTAL_STORAGE_KEYS,
  isClientConfigurationList,
  readJsonStorage,
  writeJsonStorage,
} from "@/lib/portalStorage";

export const clientMetricUnitLabels: Record<ClientMetricUnit, string> = {
  currency: "R$",
  percentage: "%",
  hours: "horas",
  count: "quantidade",
  days: "dias",
  text: "texto",
};

export const clientMetricDataTypeLabels: Record<ClientMetricDataType, "Real" | "Estimado" | "Mockado"> = {
  real: "Real",
  estimated: "Estimado",
  mock: "Mockado",
};

export interface ClientSetupInput {
  company: NewClientInput;
  configuration: Omit<ClientConfiguration, "companyId">;
}

export interface CustomClientMetricInput {
  name: string;
  pillar: BvbpPillarId;
  unit: ClientMetricUnit;
  currentValue?: number;
  target?: string;
  source?: string;
  dataType: ClientMetricDataType;
  frequency?: string;
}

const overviewIdByPillar: Record<BvbpPillarId, OverviewPillarHighlight["id"]> = {
  financial: "financial",
  commercial: "commercial",
  operation: "operational",
  technology: "automation",
};

const overviewTitleByPillar: Record<BvbpPillarId, OverviewPillarHighlight["pillar"]> = {
  financial: "Financeiro",
  commercial: "Comercial",
  operation: "Operacional",
  technology: "Automação",
};

const maturityMapIdByPillar: Record<BvbpPillarId, string> = {
  financial: "money",
  commercial: "funnel",
  operation: "operation",
  technology: "tech-ai",
};

const maturityMapNameByPillar: Record<BvbpPillarId, string> = {
  financial: "Finanças",
  commercial: "Comercial",
  operation: "Operação",
  technology: "Automação",
};

function readAllClientConfigurations() {
  const { data } = readJsonStorage(PORTAL_STORAGE_KEYS.clientConfigurations, isClientConfigurationList);
  return data || [];
}

function saveAllClientConfigurations(configurations: ClientConfiguration[]) {
  writeJsonStorage(PORTAL_STORAGE_KEYS.clientConfigurations, configurations);
}

function getMaturityLevel(level: number) {
  return maturityLevels.find((item) => item.level === level) || maturityLevels[0];
}

function clampMaturityLevel(value: number): 1 | 2 | 3 | 4 | 5 {
  if (value <= 1) return 1;
  if (value >= 5) return 5;
  return value as 1 | 2 | 3 | 4 | 5;
}

function normalizePillarConfig(defaultPillar: ClientPillarConfig, storedPillar?: ClientPillarConfig): ClientPillarConfig {
  const maturityLevel = clampMaturityLevel(storedPillar?.maturityLevel || defaultPillar.maturityLevel);
  const currentLevel = getMaturityLevel(maturityLevel);
  const nextLevel = clampMaturityLevel(Math.min(maturityLevel + 1, 5));

  return {
    ...defaultPillar,
    ...storedPillar,
    maturityLevel,
    currentLevelName: storedPillar?.currentLevelName || currentLevel.name,
    nextLevel,
    advancementCriteria: storedPillar?.advancementCriteria || defaultPillar.advancementCriteria,
    selectedMetricIds: storedPillar?.selectedMetricIds?.length ? storedPillar.selectedMetricIds : defaultPillar.selectedMetricIds,
    pains: storedPillar?.pains || [],
    notes: storedPillar?.notes || "",
  };
}

function normalizeClientConfiguration(company: Company, storedConfig?: ClientConfiguration): ClientConfiguration {
  const defaultConfig = createDefaultClientConfiguration(company);
  const storedMetricById = new Map((storedConfig?.metrics || []).map((metric) => [metric.id, metric]));
  const defaultMetrics = defaultConfig.metrics.map((metric) => ({
    ...metric,
    ...storedMetricById.get(metric.id),
    custom: false,
  }));
  const customMetrics = (storedConfig?.metrics || []).filter((metric) => metric.custom);
  const storedPillarById = new Map((storedConfig?.pillars || []).map((pillar) => [pillar.pillar, pillar]));

  return {
    companyId: company.id,
    metrics: [...defaultMetrics, ...customMetrics],
    pillars: defaultConfig.pillars.map((pillar) => normalizePillarConfig(pillar, storedPillarById.get(pillar.pillar))),
  };
}

export function getClientConfiguration(company: Company): ClientConfiguration {
  const configurations = readAllClientConfigurations();
  const storedConfig = configurations.find((configuration) => configuration.companyId === company.id);
  const normalizedConfig = normalizeClientConfiguration(company, storedConfig);
  const shouldPersist = !storedConfig || JSON.stringify(storedConfig) !== JSON.stringify(normalizedConfig);

  if (shouldPersist) {
    saveClientConfiguration(normalizedConfig);
  }

  return normalizedConfig;
}

export function saveClientConfiguration(config: ClientConfiguration) {
  const configurations = readAllClientConfigurations();
  const exists = configurations.some((configuration) => configuration.companyId === config.companyId);
  const nextConfigurations = exists
    ? configurations.map((configuration) => (configuration.companyId === config.companyId ? config : configuration))
    : [config, ...configurations];

  saveAllClientConfigurations(nextConfigurations);
  return config;
}

export function createClientWithConfiguration(input: ClientSetupInput) {
  const company = createPortalCompany(input.company);
  const configuration = saveClientConfiguration({
    companyId: company.id,
    pillars: input.configuration.pillars,
    metrics: input.configuration.metrics,
  });

  return { company, configuration };
}

export function updateClientWithConfiguration(companyId: string, input: ClientSetupInput) {
  const company = updatePortalCompany(companyId, input.company) || getCompanyById(companyId);

  if (!company) return undefined;

  const configuration = saveClientConfiguration({
    companyId,
    pillars: input.configuration.pillars,
    metrics: input.configuration.metrics,
  });

  return { company, configuration };
}

export function addCustomClientMetric(companyId: string, input: CustomClientMetricInput) {
  const company = getCompanyById(companyId);

  if (!company) return undefined;

  const configuration = getClientConfiguration(company);
  const metric: ClientMetricConfig = {
    id: `${companyId}-${input.pillar}-metric-${Date.now()}`,
    name: input.name.trim(),
    pillar: input.pillar,
    description: "Métrica customizada cadastrada localmente.",
    unit: input.unit,
    dataType: input.dataType,
    currentValue: input.currentValue,
    target: input.target?.trim() || undefined,
    source: input.source?.trim() || undefined,
    frequency: input.frequency?.trim() || undefined,
    owner: company.bvbpOwner || "BVBP",
    custom: true,
  };
  const nextConfiguration: ClientConfiguration = {
    ...configuration,
    metrics: [metric, ...configuration.metrics],
    pillars: configuration.pillars.map((pillar) =>
      pillar.pillar === input.pillar
        ? { ...pillar, selectedMetricIds: [metric.id, ...pillar.selectedMetricIds] }
        : pillar,
    ),
  };

  saveClientConfiguration(nextConfiguration);
  return metric;
}

export function getSelectedClientMetricsByPillar(company: Company, pillarId: BvbpPillarId) {
  const configuration = getClientConfiguration(company);
  const pillar = configuration.pillars.find((item) => item.pillar === pillarId);
  const selectedIds = pillar?.selectedMetricIds || [];
  const metricById = new Map(configuration.metrics.map((metric) => [metric.id, metric]));

  return selectedIds.map((metricId) => metricById.get(metricId)).filter((metric): metric is ClientMetricConfig => Boolean(metric));
}

export function getConfiguredOverviewPillarHighlights(
  company: Company,
  fallbackHighlights: OverviewPillarHighlight[],
): OverviewPillarHighlight[] {
  const configuration = getClientConfiguration(company);
  const fallbackById = new Map(fallbackHighlights.map((highlight) => [highlight.id, highlight]));

  return bvbpPillarIds.map((pillarId) => {
    const selectedMetrics = getSelectedClientMetricsByPillar(company, pillarId);
    const primaryMetric = selectedMetrics.find((metric) => metric.currentValue !== undefined) || selectedMetrics[0];
    const fallback = fallbackById.get(overviewIdByPillar[pillarId]) || fallbackHighlights[0];

    if (!primaryMetric) return fallback;

    return {
      ...fallback,
      id: overviewIdByPillar[pillarId],
      companyId: company.id,
      pillar: overviewTitleByPillar[pillarId],
      metricLabel: primaryMetric.name,
      value: primaryMetric.currentValue,
      unit: primaryMetric.unit,
      helper: primaryMetric.source || "Configuração local",
      dataType: clientMetricDataTypeLabels[primaryMetric.dataType],
      source: primaryMetric.source || "Configuração local",
      description: primaryMetric.description,
      metrics: selectedMetrics.map((metric) => ({
        label: metric.name,
        value: metric.currentValue,
        unit: metric.unit,
        dataType: clientMetricDataTypeLabels[metric.dataType],
        source: metric.source || (metric.custom ? "Métrica customizada" : "Catálogo BVBP"),
      })),
    };
  });
}

export function getConfiguredMaturityMap(company: Company, fallbackMap: MaturityMapItem[]): MaturityMapItem[] {
  const configuration = getClientConfiguration(company);
  const fallbackById = new Map(fallbackMap.map((item) => [item.id, item]));

  return configuration.pillars.map((pillar) => {
    const currentLevel = getMaturityLevel(pillar.maturityLevel);
    const nextLevel = getMaturityLevel(pillar.nextLevel);
    const fallback = fallbackById.get(maturityMapIdByPillar[pillar.pillar]);
    const status = pillar.maturityLevel <= 1 ? "Base inicial" : pillar.maturityLevel === 2 ? "Atenção" : "Em evolução";

    return {
      id: maturityMapIdByPillar[pillar.pillar],
      name: maturityMapNameByPillar[pillar.pillar],
      score: pillar.maturityLevel,
      status,
      description: pillar.notes || fallback?.description || `${bvbpPillarLabels[pillar.pillar]} configurado localmente.`,
      currentLevelLabel: pillar.currentLevelName || currentLevel.name,
      nextLevel: pillar.nextLevel,
      nextLevelLabel: nextLevel.name,
      currentMeaning: currentLevel.description,
      advancementCriteria: [pillar.advancementCriteria || "Definir critério de avanço."],
    };
  });
}

export function metricBelongsToPillar(metric: ClientMetricConfig, pillarId: BvbpPillarId) {
  return metric.pillar === pillarId || metricCatalogByPillar[pillarId].some((catalogMetric) => catalogMetric.id === metric.id);
}
