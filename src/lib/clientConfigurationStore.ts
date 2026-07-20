import {
  type BvbpPillarId,
  type ClientConfiguration,
  type ClientMetricBaselineRevision,
  type ClientMetricConfig,
  type ClientMetricMeasurement,
  type ClientMetricMeasurementContext,
  type ClientMetricValueOrigin,
  type ClientMetricUnit,
  type ClientPillarConfig,
  type Company,
  type MaturityLevel,
  type MaturityHistoryEntry,
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
  valueOrigin?: ClientMetricValueOrigin;
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

export function withDerivedBaseMaturityCriteria<T extends Pick<ClientConfiguration, "metrics" | "pillars">>(config: T): T {
  const metricById = new Map(config.metrics.map((metric) => [metric.id, metric]));

  return {
    ...config,
    pillars: config.pillars.map((pillar) => {
      const baseCriterionIds = maturityDefinitionsByPillar[pillar.pillar].levels[0].criteria.map((item) => item.id);
      const criticalMetric = pillar.criticalMetricId ? metricById.get(pillar.criticalMetricId) : undefined;
      const completedBaseCriteria = [
        Boolean(criticalMetric),
        criticalMetric?.baselineValue !== undefined && Boolean(criticalMetric.source?.trim()),
        Boolean(criticalMetric?.target?.trim()) && Boolean(criticalMetric?.benchmark?.trim()),
      ];
      const completedMaturityCriterionIds = pillar.completedMaturityCriterionIds
        .filter((criterionId) => !baseCriterionIds.includes(criterionId))
        .concat(baseCriterionIds.filter((_, index) => completedBaseCriteria[index]));

      return { ...pillar, completedMaturityCriterionIds };
    }),
  };
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
  const maturityHistory = Array.isArray(storedPillar?.maturityHistory)
    ? storedPillar.maturityHistory.filter((entry): entry is MaturityHistoryEntry => Boolean(
        entry &&
        typeof entry.id === "string" &&
        validCriterionIds.has(entry.criterionId) &&
        typeof entry.criterionLabel === "string" &&
        entry.pillar === defaultPillar.pillar &&
        [1, 2, 3, 4, 5].includes(entry.level) &&
        ["checked", "unchecked"].includes(entry.action) &&
        typeof entry.createdAt === "string",
      ))
    : [];

  return {
    pillar: defaultPillar.pillar,
    completedMaturityCriterionIds,
    maturityHistory,
    selectedMetricIds: Array.isArray(storedPillar?.selectedMetricIds) ? storedPillar.selectedMetricIds : defaultPillar.selectedMetricIds,
    criticalMetricId: storedPillar?.criticalMetricId,
    pains: storedPillar?.pains || [],
    notes: storedPillar?.notes || "",
  };
}

function normalizeMetric(
  fallback: ClientMetricConfig,
  storedMetric?: StoredClientMetricConfig,
  custom = fallback.custom,
): ClientMetricConfig {
  const storedSource = storedMetric?.source?.trim();
  const isGeneratedSeed = storedSource === "Seed local";
  const currentValue = isGeneratedSeed ? undefined : storedMetric?.currentValue;
  const valueOrigin = currentValue === undefined
    ? undefined
    : storedMetric?.valueOrigin || (storedSource?.toLowerCase().includes("estim") ? "estimated" : "informed");
  const measurements = Array.isArray(storedMetric?.measurements)
    ? storedMetric.measurements.filter((measurement): measurement is ClientMetricMeasurement => Boolean(
        measurement &&
        typeof measurement.id === "string" &&
        typeof measurement.value === "number" &&
        typeof measurement.measuredAt === "string" &&
        ["Reunião", "Dado", "Decisão", "Estimativa"].includes(measurement.context) &&
        typeof measurement.createdAt === "string",
      ))
    : [];
  const baselineHistory = Array.isArray(storedMetric?.baselineHistory)
    ? storedMetric.baselineHistory.filter((revision): revision is ClientMetricBaselineRevision => Boolean(
        revision &&
        typeof revision.id === "string" &&
        typeof revision.value === "number" &&
        typeof revision.measuredAt === "string" &&
        typeof revision.createdAt === "string",
      ))
    : [];
  const oldestMeasurement = [...measurements].sort((left, right) => (
    left.measuredAt.localeCompare(right.measuredAt) || left.createdAt.localeCompare(right.createdAt)
  ))[0];
  const storedBaselineValue = typeof storedMetric?.baselineValue === "number" && Number.isFinite(storedMetric.baselineValue)
    ? storedMetric.baselineValue
    : undefined;
  const baselineValue = isGeneratedSeed ? undefined : storedBaselineValue ?? oldestMeasurement?.value;
  const baselineMeasuredAt = baselineValue === undefined
    ? undefined
    : storedMetric?.baselineMeasuredAt || oldestMeasurement?.measuredAt;
  const normalizedBaselineHistory = baselineHistory.length || !oldestMeasurement || storedBaselineValue !== undefined
    ? baselineHistory
    : [{
        id: `baseline-derived-${oldestMeasurement.id}`,
        value: oldestMeasurement.value,
        measuredAt: oldestMeasurement.measuredAt,
        source: oldestMeasurement.source,
        createdAt: oldestMeasurement.createdAt,
        createdByUserId: oldestMeasurement.createdByUserId,
        createdByName: oldestMeasurement.createdByName,
      }];

  return {
    id: storedMetric?.id || fallback.id,
    name: custom ? storedMetric?.name || fallback.name : fallback.name,
    pillar: storedMetric?.pillar || fallback.pillar,
    description: storedMetric?.description || fallback.description,
    unit: storedMetric?.unit || fallback.unit,
    formula: storedMetric?.formula?.trim() || fallback.formula,
    baselineValue,
    baselineMeasuredAt,
    baselineHistory: normalizedBaselineHistory,
    currentValue,
    valueOrigin,
    target: storedMetric?.target,
    benchmark: storedMetric?.benchmark,
    direction: storedMetric?.direction || fallback.direction || "higher",
    source: isGeneratedSeed ? undefined : storedSource,
    owner: storedMetric?.owner,
    measurements,
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

  return withDerivedBaseMaturityCriteria({
    schemaVersion: 6,
    companyId: company.id,
    metrics: [...defaultMetrics, ...customMetrics],
    pillars: defaultConfig.pillars.map((pillar) => {
      const normalizedPillar = normalizePillarConfig(pillar, storedPillarById.get(pillar.pillar));

      const selectedMetricIds = normalizedPillar.selectedMetricIds.filter((metricId) => availableMetricIds.has(metricId));

      return {
        ...normalizedPillar,
        selectedMetricIds,
        criticalMetricId: selectedMetricIds.includes(normalizedPillar.criticalMetricId || "")
          ? normalizedPillar.criticalMetricId
          : undefined,
      };
    }),
  });
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
  const normalizedConfig = withDerivedBaseMaturityCriteria(config);
  const configurations = readAllClientConfigurations();
  const exists = configurations.some((configuration) => configuration.companyId === normalizedConfig.companyId);
  const nextConfigurations = exists
    ? configurations.map((configuration) => (configuration.companyId === normalizedConfig.companyId ? normalizedConfig : configuration))
    : [normalizedConfig, ...configurations];

  saveAllClientConfigurations(nextConfigurations);
  return normalizedConfig;
}

export function saveClientConfiguration(config: ClientConfiguration) {
  storeClientConfiguration(config);
  syncClientConfigurationToSupabaseSoon(config);
  return config;
}

export async function persistClientConfiguration(config: ClientConfiguration) {
  const normalizedConfig: ClientConfiguration = withDerivedBaseMaturityCriteria({ ...config, schemaVersion: 6 }) as ClientConfiguration;
  if (!portalRuntimeConfig.enableDemoData) {
    const synced = await syncClientConfigurationToSupabase(normalizedConfig);
    if (!synced) throw new Error("Não foi possível salvar a configuração no Supabase.");
  }
  return storeClientConfiguration(normalizedConfig);
}

export interface ToggleMaturityCriterionInput {
  company: Company;
  pillarId: BvbpPillarId;
  criterionId: string;
  createdByUserId?: string;
  createdByName?: string;
}

export function toggleMaturityCriterion(input: ToggleMaturityCriterionInput) {
  const configuration = getClientConfiguration(input.company);
  const pillar = configuration.pillars.find((item) => item.pillar === input.pillarId);
  const definition = maturityDefinitionsByPillar[input.pillarId];
  const levelDefinition = definition.levels.find((level) => level.criteria.some((item) => item.id === input.criterionId));
  const criterion = levelDefinition?.criteria.find((item) => item.id === input.criterionId);

  if (!pillar || !levelDefinition || !criterion || levelDefinition.level === 1) return undefined;

  const maturity = getPillarMaturityState(input.pillarId, pillar.completedMaturityCriterionIds);
  if (levelDefinition.level > maturity.level) return undefined;

  const completed = new Set(pillar.completedMaturityCriterionIds);
  const wasCompleted = completed.has(input.criterionId);
  if (wasCompleted) completed.delete(input.criterionId);
  else completed.add(input.criterionId);

  const historyEntry: MaturityHistoryEntry = {
    id: globalThis.crypto?.randomUUID?.() || `${input.pillarId}-${input.criterionId}-${Date.now()}`,
    criterionId: input.criterionId,
    criterionLabel: criterion.label,
    level: levelDefinition.level,
    pillar: input.pillarId,
    action: wasCompleted ? "unchecked" : "checked",
    createdAt: new Date().toISOString(),
    createdByUserId: input.createdByUserId,
    createdByName: input.createdByName,
  };

  const nextConfiguration: ClientConfiguration = {
    ...configuration,
    schemaVersion: 6,
    pillars: configuration.pillars.map((item) => item.pillar === input.pillarId
      ? {
          ...item,
          completedMaturityCriterionIds: Array.from(completed),
          maturityHistory: [...item.maturityHistory, historyEntry],
        }
      : item),
  };

  return saveClientConfiguration(nextConfiguration);
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
    schemaVersion: 6,
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
    schemaVersion: 6,
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
    schemaVersion: 6,
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
    valueOrigin: input.currentValue === undefined ? undefined : input.valueOrigin || "informed",
    target: input.target?.trim() || undefined,
    source: input.source?.trim() || undefined,
    owner: company.bvbpOwner,
    measurements: [],
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

export interface ClientMetricMeasurementInput {
  value: number;
  measuredAt: string;
  context: ClientMetricMeasurementContext;
  source?: string;
  note?: string;
  createdByUserId?: string;
  createdByName?: string;
}

export async function updateClientMetricMeasurement(company: Company, metricId: string, input: ClientMetricMeasurementInput) {
  if (!Number.isFinite(input.value) || !input.measuredAt || !input.context) return undefined;
  const configuration = getClientConfiguration(company);
  const metric = configuration.metrics.find((item) => item.id === metricId);
  if (!metric) return undefined;

  const now = new Date().toISOString();
  const measurement: ClientMetricMeasurement = {
    id: `measurement-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    value: input.value,
    measuredAt: input.measuredAt,
    context: input.context,
    source: input.source?.trim() || undefined,
    note: input.note?.trim() || undefined,
    createdAt: now,
    createdByUserId: input.createdByUserId,
    createdByName: input.createdByName?.trim() || undefined,
  };
  const nextConfiguration: ClientConfiguration = {
    ...configuration,
    metrics: configuration.metrics.map((item) => item.id === metricId ? {
      ...item,
      currentValue: input.value,
      valueOrigin: input.context === "Estimativa" ? "estimated" : "informed",
      source: input.source?.trim() || item.source,
      measurements: [measurement, ...(item.measurements || [])],
    } : item),
  };

  const savedConfiguration = await persistClientConfiguration(nextConfiguration);
  return { configuration: savedConfiguration, measurement };
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
  _fallbackHighlights: OverviewPillarHighlight[],
): OverviewPillarHighlight[] {
  const configuration = getClientConfiguration(company);
  return bvbpPillarIds.flatMap((pillarId) => {
    const selectedMetrics = getSelectedClientMetricsByPillar(company, pillarId);
    const pillar = configuration.pillars.find((item) => item.pillar === pillarId);
    const primaryMetric = selectedMetrics.find((metric) => metric.id === pillar?.criticalMetricId);
    if (!primaryMetric || primaryMetric.currentValue === undefined || !primaryMetric.source?.trim()) return [];
    const usableMetrics = selectedMetrics.filter((metric) => metric.currentValue !== undefined && Boolean(metric.source?.trim()));

    return [{
      id: overviewIdByPillar[pillarId],
      companyId: company.id,
      pillar: overviewTitleByPillar[pillarId],
      metricLabel: primaryMetric.name,
      value: primaryMetric.currentValue,
      unit: primaryMetric.unit,
      helper: primaryMetric.source || "Configuração local",
      dataType: primaryMetric.valueOrigin === "estimated" ? "Estimado" : "Real",
      source: primaryMetric.source,
      description: primaryMetric.description,
      metrics: usableMetrics.map((metric) => ({
        label: metric.name,
        value: metric.currentValue,
        unit: metric.unit,
        dataType: metric.valueOrigin === "estimated" ? "Estimado" : "Real",
        source: metric.source!,
      })),
    }];
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
