import {
  type BvbpPillarId,
  type ClientConfiguration,
  type ClientMetricConfig,
  type ClientMetricUnit,
  type ClientPillarConfig,
  type Company,
  type MaturityLevel,
  type MaturityMapItem,
  type OverviewPillarHighlight,
  bvbpPillarIds,
  bvbpPillarLabels,
  createDefaultClientConfiguration,
  getMaturityCriterionIdsForLevel,
  getPillarMaturityState,
  maturityDefinitionsByPillar,
  metricCatalogByPillar,
} from "@/data/performanceSystem";
import {
  type NewClientInput,
  buildPortalCompany,
  buildUpdatedPortalCompany,
  commitPortalCompany,
  getCompanyById,
} from "@/lib/clientPortalStore";
import {
  deleteWorkspaceFromSupabase,
  syncClientConfigurationToSupabase,
  syncClientConfigurationToSupabaseSoon,
  syncCompanyToSupabase,
} from "@/lib/clientPortalSupabase";
import { portalRuntimeConfig } from "@/lib/portalRuntimeConfig";
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
  formula: string;
}

interface StoredClientPillarConfig extends Partial<ClientPillarConfig> {
  pillar: BvbpPillarId;
  maturityLevel?: number;
  currentLevelName?: string;
  nextLevel?: number;
  advancementCriteria?: string;
}

type StoredClientMetricConfig = Omit<ClientMetricConfig, "formula"> & {
  formula?: string;
};

interface StoredClientConfiguration {
  schemaVersion?: number;
  companyId: string;
  pillars: StoredClientPillarConfig[];
  metrics: StoredClientMetricConfig[];
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
  return (data || []) as unknown as StoredClientConfiguration[];
}

function saveAllClientConfigurations(configurations: StoredClientConfiguration[]) {
  writeJsonStorage(PORTAL_STORAGE_KEYS.clientConfigurations, configurations);
}

function clampMaturityLevel(value: number): MaturityLevel {
  if (value <= 1) return 1;
  if (value >= 5) return 5;
  return value as MaturityLevel;
}

function normalizePillarConfig(
  defaultPillar: ClientPillarConfig,
  storedPillar?: StoredClientPillarConfig,
): ClientPillarConfig {
  const definition = maturityDefinitionsByPillar[defaultPillar.pillar];
  const validCriterionIds = new Set(
    definition.levels.flatMap((level) => level.criteria.map((criterion) => criterion.id)),
  );
  const completedMaturityCriterionIds = !storedPillar
    ? defaultPillar.completedMaturityCriterionIds
    : Array.isArray(storedPillar.completedMaturityCriterionIds)
      ? storedPillar.completedMaturityCriterionIds.filter((criterionId) => validCriterionIds.has(criterionId))
      : getMaturityCriterionIdsForLevel(
          defaultPillar.pillar,
          clampMaturityLevel(storedPillar.maturityLevel || 1),
        );

  return {
    pillar: defaultPillar.pillar,
    completedMaturityCriterionIds,
    selectedMetricIds: Array.isArray(storedPillar?.selectedMetricIds) ? storedPillar.selectedMetricIds : defaultPillar.selectedMetricIds,
    pains: storedPillar?.pains || [],
    notes: storedPillar?.notes || "",
  };
}

function normalizeMetric(
  fallback: ClientMetricConfig,
  storedMetric?: StoredClientMetricConfig,
  custom = fallback.custom,
): ClientMetricConfig {
  return {
    id: storedMetric?.id || fallback.id,
    name: custom ? storedMetric?.name || fallback.name : fallback.name,
    pillar: storedMetric?.pillar || fallback.pillar,
    description: storedMetric?.description || fallback.description,
    unit: storedMetric?.unit || fallback.unit,
    formula: storedMetric?.formula?.trim() || fallback.formula,
    currentValue: storedMetric?.currentValue,
    target: storedMetric?.target,
    benchmark: storedMetric?.benchmark,
    direction: storedMetric?.direction || fallback.direction || "higher",
    source: storedMetric?.source,
    owner: storedMetric?.owner,
    custom,
  };
}

function normalizeClientConfiguration(company: Company, storedConfig?: StoredClientConfiguration): ClientConfiguration {
  const defaultConfig = createDefaultClientConfiguration(company);
  const storedMetricById = new Map((storedConfig?.metrics || []).map((metric) => [metric.id, metric]));
  const currentCatalogIds = new Set(defaultConfig.metrics.map((metric) => metric.id));
  const selectedStoredIds = new Set((storedConfig?.pillars || []).flatMap((pillar) => pillar.selectedMetricIds));
  const defaultMetrics = defaultConfig.metrics.map((metric) => normalizeMetric(metric, storedMetricById.get(metric.id), false));
  const customMetrics = (storedConfig?.metrics || [])
    .filter((metric) => metric.custom || (!currentCatalogIds.has(metric.id) && selectedStoredIds.has(metric.id)))
    .map((metric) => normalizeMetric({
      ...metric,
      formula: metric.formula?.trim() || "Definir fórmula de cálculo",
      custom: true,
    }, metric, true));
  const storedPillarById = new Map((storedConfig?.pillars || []).map((pillar) => [pillar.pillar, pillar]));
  const availableMetricIds = new Set([...defaultMetrics, ...customMetrics].map((metric) => metric.id));

  return {
    schemaVersion: 2,
    companyId: company.id,
    metrics: [...defaultMetrics, ...customMetrics],
    pillars: defaultConfig.pillars.map((pillar) => {
      const normalizedPillar = normalizePillarConfig(pillar, storedPillarById.get(pillar.pillar));

      return {
        ...normalizedPillar,
        selectedMetricIds: normalizedPillar.selectedMetricIds.filter((metricId) => availableMetricIds.has(metricId)),
      };
    }),
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

function storeClientConfiguration(config: ClientConfiguration) {
  const configurations = readAllClientConfigurations();
  const exists = configurations.some((configuration) => configuration.companyId === config.companyId);
  const nextConfigurations = exists
    ? configurations.map((configuration) => (configuration.companyId === config.companyId ? config : configuration))
    : [config, ...configurations];

  saveAllClientConfigurations(nextConfigurations);
  return config;
}

export function saveClientConfiguration(config: ClientConfiguration) {
  storeClientConfiguration(config);
  syncClientConfigurationToSupabaseSoon(config);
  return config;
}

async function rollbackCompanyPersistence(company: Company, previousCompany?: Company) {
  if (previousCompany) {
    await syncCompanyToSupabase(previousCompany);
    return;
  }

  await deleteWorkspaceFromSupabase(company.id);
}

async function persistClientBundle(company: Company, configuration: ClientConfiguration, previousCompany?: Company) {
  if (!portalRuntimeConfig.enableDemoData) {
    const companySynced = await syncCompanyToSupabase(company);

    if (!companySynced) {
      await rollbackCompanyPersistence(company, previousCompany);
      throw new Error("Não foi possível salvar os dados da empresa no Supabase.");
    }

    const configurationSynced = await syncClientConfigurationToSupabase(configuration);

    if (!configurationSynced) {
      await rollbackCompanyPersistence(company, previousCompany);
      throw new Error("A empresa não foi concluída porque a configuração não pôde ser salva.");
    }
  }

  commitPortalCompany(company);
  storeClientConfiguration(configuration);
  return { company, configuration };
}

export async function createClientWithConfiguration(input: ClientSetupInput) {
  const company = buildPortalCompany(input.company);
  const configuration: ClientConfiguration = {
    schemaVersion: 2,
    companyId: company.id,
    pillars: input.configuration.pillars,
    metrics: input.configuration.metrics,
  };

  return persistClientBundle(company, configuration);
}

export async function updateClientWithConfiguration(companyId: string, input: ClientSetupInput) {
  const existingCompany = getCompanyById(companyId);

  if (!existingCompany) return undefined;

  const company = buildUpdatedPortalCompany(existingCompany, input.company);
  const configuration: ClientConfiguration = {
    schemaVersion: 2,
    companyId,
    pillars: input.configuration.pillars,
    metrics: input.configuration.metrics,
  };

  return persistClientBundle(company, configuration, existingCompany);
}

export async function upsertClientWithConfiguration(companyId: string, input: ClientSetupInput) {
  const existingCompany = getCompanyById(companyId);
  const company = existingCompany
    ? buildUpdatedPortalCompany(existingCompany, input.company)
    : buildPortalCompany({ ...input.company, id: companyId });

  const configuration: ClientConfiguration = {
    schemaVersion: 2,
    companyId,
    pillars: input.configuration.pillars,
    metrics: input.configuration.metrics,
  };

  return persistClientBundle(company, configuration, existingCompany);
}

export function addCustomClientMetric(companyId: string, input: CustomClientMetricInput) {
  const company = getCompanyById(companyId);

  if (!company) return undefined;

  const configuration = getClientConfiguration(company);
  const metric: ClientMetricConfig = {
    id: `${companyId}-${input.pillar}-metric-${Date.now()}`,
    name: input.name.trim(),
    pillar: input.pillar,
    description: "Ponteiro personalizado cadastrado localmente.",
    unit: input.unit,
    formula: input.formula.trim(),
    currentValue: input.currentValue,
    target: input.target?.trim() || undefined,
    source: input.source?.trim() || undefined,
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
      dataType: "Real",
      source: primaryMetric.source || "Configuração local",
      description: primaryMetric.description,
      metrics: selectedMetrics.map((metric) => ({
        label: metric.name,
        value: metric.currentValue,
        unit: metric.unit,
        dataType: "Real",
        source: metric.source || (metric.custom ? "Ponteiro personalizado" : "Catálogo BVBP"),
      })),
    };
  });
}

export function getConfiguredMaturityMap(company: Company, fallbackMap: MaturityMapItem[]): MaturityMapItem[] {
  const configuration = getClientConfiguration(company);
  const fallbackById = new Map(fallbackMap.map((item) => [item.id, item]));

  return configuration.pillars.map((pillar) => {
    const maturity = getPillarMaturityState(pillar.pillar, pillar.completedMaturityCriterionIds);
    const fallback = fallbackById.get(maturityMapIdByPillar[pillar.pillar]);
    const status = maturity.level <= 1 ? "Base inicial" : maturity.level === 2 ? "Atenção" : "Em evolução";

    return {
      id: maturityMapIdByPillar[pillar.pillar],
      name: maturityMapNameByPillar[pillar.pillar],
      score: maturity.level,
      status,
      description: pillar.notes || fallback?.description || `${bvbpPillarLabels[pillar.pillar]} configurado localmente.`,
      currentLevelLabel: maturity.current.name,
      nextLevel: maturity.next?.level || 5,
      nextLevelLabel: maturity.next?.name || maturity.current.name,
      currentMeaning: maturity.current.description,
      advancementCriteria: maturity.current.criteria.length
        ? maturity.current.criteria.map((criterion) => criterion.label)
        : ["Maturidade máxima validada."],
    };
  });
}

export function metricBelongsToPillar(metric: ClientMetricConfig, pillarId: BvbpPillarId) {
  return metric.pillar === pillarId || metricCatalogByPillar[pillarId].some((catalogMetric) => catalogMetric.id === metric.id);
}
