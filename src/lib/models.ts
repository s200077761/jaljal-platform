import { db } from './db'
import type { AIModelData, ModelMetricData, AlertData, DashboardStats } from './types'

// Helper to parse JSON string fields from SQLite
function parseJsonField(value: string): string[] {
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

function toModelData(model: {
  id: string
  slug: string
  name: string
  type: string
  status: string
  accuracy: number
  performance: number
  customization: number
  openSource: boolean
  description: string
  version: string
  capabilities: string
  languages: string
  maxTokens: number
  createdAt: Date
  updatedAt: Date
}): AIModelData {
  return {
    ...model,
    type: model.type as AIModelData['type'],
    status: model.status as AIModelData['status'],
    capabilities: parseJsonField(model.capabilities),
    languages: parseJsonField(model.languages),
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  }
}

// --- Models ---

export async function getAllModels(): Promise<AIModelData[]> {
  const models = await db.aIModel.findMany({ orderBy: { createdAt: 'desc' } })
  return models.map(toModelData)
}

export async function getModelBySlug(slug: string): Promise<AIModelData | null> {
  const model = await db.aIModel.findUnique({ where: { slug } })
  return model ? toModelData(model) : null
}

export async function getModelById(id: string): Promise<AIModelData | null> {
  const model = await db.aIModel.findUnique({ where: { id } })
  return model ? toModelData(model) : null
}

export async function createModel(data: {
  slug: string
  name: string
  type: string
  description: string
  capabilities?: string[]
  languages?: string[]
  openSource?: boolean
  maxTokens?: number
}): Promise<AIModelData> {
  const model = await db.aIModel.create({
    data: {
      slug: data.slug,
      name: data.name,
      type: data.type,
      status: 'training',
      description: data.description,
      capabilities: JSON.stringify(data.capabilities || []),
      languages: JSON.stringify(data.languages || []),
      openSource: data.openSource ?? true,
      maxTokens: data.maxTokens || 2048,
    },
  })
  return toModelData(model)
}

export async function updateModel(
  id: string,
  data: Partial<{
    name: string
    status: string
    accuracy: number
    performance: number
    customization: number
    description: string
    version: string
    capabilities: string[]
    languages: string[]
  }>
): Promise<AIModelData> {
  const updateData: Record<string, unknown> = { ...data }
  if (data.capabilities) updateData.capabilities = JSON.stringify(data.capabilities)
  if (data.languages) updateData.languages = JSON.stringify(data.languages)
  const model = await db.aIModel.update({ where: { id }, data: updateData })
  return toModelData(model)
}

export async function deleteModel(id: string): Promise<void> {
  await db.aIModel.delete({ where: { id } })
}

// --- Metrics ---

export async function getModelMetrics(
  modelId?: string,
  limit = 20
): Promise<ModelMetricData[]> {
  const where = modelId ? { modelId } : {}
  const metrics = await db.modelMetric.findMany({
    where,
    include: { model: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
  return metrics.map((m) => ({
    id: m.id,
    modelId: m.modelId,
    modelName: m.model.name,
    accuracy: m.accuracy,
    responseTime: m.responseTime,
    throughput: m.throughput,
    cpuUsage: m.cpuUsage,
    memoryUsage: m.memoryUsage,
    errorRate: m.errorRate,
    activeUsers: m.activeUsers,
    createdAt: m.createdAt.toISOString(),
  }))
}

export async function createMetric(data: {
  modelId: string
  accuracy: number
  responseTime: number
  throughput: number
  cpuUsage: number
  memoryUsage: number
  errorRate: number
  activeUsers: number
}): Promise<void> {
  await db.modelMetric.create({ data })
}

// --- Alerts ---

export async function getAlerts(resolved?: boolean): Promise<AlertData[]> {
  const where = resolved !== undefined ? { resolved } : {}
  const alerts = await db.alert.findMany({
    where,
    include: { model: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return alerts.map((a) => ({
    id: a.id,
    type: a.type as AlertData['type'],
    message: a.message,
    modelId: a.modelId,
    modelName: a.model.name,
    resolved: a.resolved,
    createdAt: a.createdAt.toISOString(),
  }))
}

export async function createAlert(data: {
  type: string
  message: string
  modelId: string
}): Promise<void> {
  await db.alert.create({ data })
}

export async function resolveAlert(id: string): Promise<void> {
  await db.alert.update({ where: { id }, data: { resolved: true } })
}

// --- Usage Logging ---

export async function logUsage(data: {
  modelId: string
  messageLength: number
  responseLength: number
  promptTokens?: number
  completionTokens?: number
  totalTokens?: number
}): Promise<void> {
  await db.usageLog.create({ data })
}

// --- Dashboard Stats ---

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalModels, activeModels, avgResult, totalUsageLogs, activeAlerts] =
    await Promise.all([
      db.aIModel.count(),
      db.aIModel.count({ where: { status: 'active' } }),
      db.aIModel.aggregate({ _avg: { accuracy: true } }),
      db.usageLog.count(),
      db.alert.count({ where: { resolved: false } }),
    ])

  return {
    totalModels,
    activeModels,
    avgAccuracy: avgResult._avg.accuracy ?? 0,
    totalUsageLogs,
    activeAlerts,
  }
}

// --- API Keys ---

export async function getApiKeys() {
  return db.apiKey.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function createApiKey(name: string): Promise<{ id: string; key: string }> {
  const key = `sk-${generateRandomKey(32)}`
  const apiKey = await db.apiKey.create({ data: { name, key } })
  return { id: apiKey.id, key: apiKey.key }
}

export async function revokeApiKey(id: string): Promise<void> {
  await db.apiKey.update({ where: { id }, data: { active: false } })
}

export async function validateApiKey(key: string): Promise<boolean> {
  const apiKey = await db.apiKey.findUnique({ where: { key } })
  return apiKey !== null && apiKey.active
}

// --- Webhooks ---

export async function getWebhooks() {
  const webhooks = await db.webhook.findMany({ orderBy: { createdAt: 'desc' } })
  return webhooks.map((w) => ({
    ...w,
    events: parseJsonField(w.events),
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
  }))
}

export async function createWebhook(data: {
  url: string
  events: string[]
  secret?: string
}): Promise<void> {
  await db.webhook.create({
    data: { url: data.url, events: JSON.stringify(data.events), secret: data.secret },
  })
}

export async function deleteWebhook(id: string): Promise<void> {
  await db.webhook.delete({ where: { id } })
}

function generateRandomKey(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
