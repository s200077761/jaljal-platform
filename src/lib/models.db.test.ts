import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockDb = vi.hoisted(() => ({
  aIModel: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
  },
  modelMetric: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  alert: {
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  usageLog: {
    create: vi.fn(),
    count: vi.fn(),
  },
  apiKey: {
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    findUnique: vi.fn(),
  },
  webhook: {
    findMany: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('./db', () => ({ db: mockDb }))

import {
  createApiKey,
  createModel,
  createWebhook,
  getAlerts,
  getAllModels,
  getDashboardStats,
  getModelBySlug,
  getModelMetrics,
  getWebhooks,
  updateModel,
  validateApiKey,
} from './models'

describe('models db-backed logic', () => {
  const now = new Date('2026-01-01T00:00:00.000Z')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps models from DB shape into API shape', async () => {
    mockDb.aIModel.findMany.mockResolvedValue([
      {
        id: 'm1',
        slug: 'm1',
        name: 'Model 1',
        type: 'language',
        status: 'active',
        accuracy: 90,
        performance: 80,
        customization: 70,
        openSource: true,
        description: 'desc',
        version: '1.0.0',
        capabilities: '["chat","reasoning"]',
        languages: 'invalid-json',
        maxTokens: 4096,
        createdAt: now,
        updatedAt: now,
      },
    ])

    const result = await getAllModels()

    expect(mockDb.aIModel.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } })
    expect(result).toEqual([
      {
        id: 'm1',
        slug: 'm1',
        name: 'Model 1',
        type: 'language',
        status: 'active',
        accuracy: 90,
        performance: 80,
        customization: 70,
        openSource: true,
        description: 'desc',
        version: '1.0.0',
        capabilities: ['chat', 'reasoning'],
        languages: [],
        maxTokens: 4096,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ])
  })

  it('returns null when slug lookup misses', async () => {
    mockDb.aIModel.findUnique.mockResolvedValue(null)

    const result = await getModelBySlug('missing-model')

    expect(mockDb.aIModel.findUnique).toHaveBeenCalledWith({ where: { slug: 'missing-model' } })
    expect(result).toBeNull()
  })

  it('creates model with expected defaults and serialized arrays', async () => {
    mockDb.aIModel.create.mockResolvedValue({
      id: 'm2',
      slug: 'm2',
      name: 'Model 2',
      type: 'vision',
      status: 'training',
      accuracy: 0,
      performance: 0,
      customization: 0,
      openSource: true,
      description: 'desc',
      version: '1.0.0',
      capabilities: '[]',
      languages: '[]',
      maxTokens: 2048,
      createdAt: now,
      updatedAt: now,
    })

    await createModel({
      slug: 'm2',
      name: 'Model 2',
      type: 'vision',
      description: 'desc',
    })

    expect(mockDb.aIModel.create).toHaveBeenCalledWith({
      data: {
        slug: 'm2',
        name: 'Model 2',
        type: 'vision',
        status: 'training',
        description: 'desc',
        capabilities: '[]',
        languages: '[]',
        openSource: true,
        maxTokens: 2048,
      },
    })
  })

  it('serializes array fields when updating models', async () => {
    mockDb.aIModel.update.mockResolvedValue({
      id: 'm3',
      slug: 'm3',
      name: 'Updated',
      type: 'language',
      status: 'active',
      accuracy: 96,
      performance: 95,
      customization: 94,
      openSource: true,
      description: 'updated',
      version: '2.0.0',
      capabilities: '["tool-calling"]',
      languages: '["en","ar"]',
      maxTokens: 8192,
      createdAt: now,
      updatedAt: now,
    })

    await updateModel('m3', {
      name: 'Updated',
      capabilities: ['tool-calling'],
      languages: ['en', 'ar'],
    })

    expect(mockDb.aIModel.update).toHaveBeenCalledWith({
      where: { id: 'm3' },
      data: {
        name: 'Updated',
        capabilities: '["tool-calling"]',
        languages: '["en","ar"]',
      },
    })
  })

  it('fetches metrics with optional model filter and maps model name/date', async () => {
    mockDb.modelMetric.findMany.mockResolvedValue([
      {
        id: 'metric1',
        modelId: 'm1',
        model: { name: 'Model 1' },
        accuracy: 99,
        responseTime: 120,
        throughput: 1000,
        cpuUsage: 40,
        memoryUsage: 50,
        errorRate: 0.01,
        activeUsers: 200,
        createdAt: now,
      },
    ])

    const result = await getModelMetrics('m1', 5)

    expect(mockDb.modelMetric.findMany).toHaveBeenCalledWith({
      where: { modelId: 'm1' },
      include: { model: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    expect(result[0]).toMatchObject({
      id: 'metric1',
      modelId: 'm1',
      modelName: 'Model 1',
      createdAt: now.toISOString(),
    })
  })

  it('applies resolved filter when fetching alerts', async () => {
    mockDb.alert.findMany.mockResolvedValue([])

    await getAlerts(false)

    expect(mockDb.alert.findMany).toHaveBeenCalledWith({
      where: { resolved: false },
      include: { model: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  })

  it('uses fallback dashboard avg accuracy when aggregate value is null', async () => {
    mockDb.aIModel.count
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(4)
    mockDb.aIModel.aggregate.mockResolvedValue({ _avg: { accuracy: null } })
    mockDb.usageLog.count.mockResolvedValue(100)
    mockDb.alert.count.mockResolvedValue(7)

    const stats = await getDashboardStats()

    expect(stats).toEqual({
      totalModels: 10,
      activeModels: 4,
      avgAccuracy: 0,
      totalUsageLogs: 100,
      activeAlerts: 7,
    })
  })

  it('creates API key with expected prefix and returns persisted values', async () => {
    mockDb.apiKey.create.mockImplementation(async ({ data }: { data: { name: string; key: string } }) => ({
      id: 'key-1',
      name: data.name,
      key: data.key,
    }))

    const result = await createApiKey('Primary key')

    expect(mockDb.apiKey.create).toHaveBeenCalledTimes(1)
    expect(result.id).toBe('key-1')
    expect(result.key).toMatch(/^sk-[a-z0-9]{32}$/)
  })

  it('validates API keys by existence and active status', async () => {
    mockDb.apiKey.findUnique
      .mockResolvedValueOnce({ id: '1', active: true })
      .mockResolvedValueOnce({ id: '2', active: false })
      .mockResolvedValueOnce(null)

    await expect(validateApiKey('active')).resolves.toBe(true)
    await expect(validateApiKey('inactive')).resolves.toBe(false)
    await expect(validateApiKey('missing')).resolves.toBe(false)
  })

  it('maps webhooks and handles malformed events JSON', async () => {
    mockDb.webhook.findMany.mockResolvedValue([
      {
        id: 'w1',
        url: 'https://example.test/hook',
        events: '["alert.created"]',
        active: true,
        secret: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'w2',
        url: 'https://example.test/hook2',
        events: 'broken',
        active: true,
        secret: null,
        createdAt: now,
        updatedAt: now,
      },
    ])

    const result = await getWebhooks()

    expect(result[0].events).toEqual(['alert.created'])
    expect(result[1].events).toEqual([])
    expect(result[0].createdAt).toBe(now.toISOString())
    expect(result[0].updatedAt).toBe(now.toISOString())
  })

  it('serializes webhook events payload on create', async () => {
    mockDb.webhook.create.mockResolvedValue({})

    await createWebhook({
      url: 'https://example.test/hook',
      events: ['alert.created', 'alert.resolved'],
      secret: 'top-secret',
    })

    expect(mockDb.webhook.create).toHaveBeenCalledWith({
      data: {
        url: 'https://example.test/hook',
        events: '["alert.created","alert.resolved"]',
        secret: 'top-secret',
      },
    })
  })
})
