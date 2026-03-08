import { describe, it, expect } from 'vitest'
import type {
  AIModelData,
  ModelMetricData,
  AlertData,
  DashboardStats,
  ApiResponse,
} from './types'

describe('Type definitions', () => {
  it('AIModelData has correct shape', () => {
    const model: AIModelData = {
      id: 'test-id',
      slug: 'test-model',
      name: 'Test Model',
      type: 'language',
      status: 'active',
      accuracy: 95,
      performance: 88,
      customization: 90,
      openSource: true,
      description: 'A test model',
      version: '1.0.0',
      capabilities: ['text-generation'],
      languages: ['en', 'ar'],
      maxTokens: 4096,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    expect(model.id).toBe('test-id')
    expect(model.type).toBe('language')
    expect(model.capabilities).toHaveLength(1)
    expect(model.languages).toContain('ar')
  })

  it('ModelMetricData has correct shape', () => {
    const metric: ModelMetricData = {
      id: 'metric-1',
      modelId: 'model-1',
      modelName: 'Test Model',
      accuracy: 92.5,
      responseTime: 150,
      throughput: 100,
      cpuUsage: 45,
      memoryUsage: 60,
      errorRate: 0.5,
      activeUsers: 25,
      createdAt: new Date().toISOString(),
    }

    expect(metric.accuracy).toBeGreaterThan(0)
    expect(metric.errorRate).toBeLessThan(1)
  })

  it('AlertData has correct shape', () => {
    const alert: AlertData = {
      id: 'alert-1',
      type: 'warning',
      message: 'High memory usage',
      modelId: 'model-1',
      modelName: 'Test Model',
      resolved: false,
      createdAt: new Date().toISOString(),
    }

    expect(alert.type).toBe('warning')
    expect(alert.resolved).toBe(false)
  })

  it('DashboardStats has correct shape', () => {
    const stats: DashboardStats = {
      activeModels: 3,
      totalModels: 5,
      avgAccuracy: 91.3,
      totalUsageLogs: 150,
      activeAlerts: 2,
    }

    expect(stats.activeModels).toBeLessThanOrEqual(stats.totalModels)
    expect(stats.avgAccuracy).toBeGreaterThan(0)
  })

  it('ApiResponse wraps data correctly', () => {
    const success: ApiResponse<string> = {
      success: true,
      data: 'hello',
      timestamp: new Date().toISOString(),
    }

    const error: ApiResponse<string> = {
      success: false,
      error: 'Something went wrong',
    }

    expect(success.success).toBe(true)
    expect(success.data).toBe('hello')
    expect(error.success).toBe(false)
    expect(error.error).toBeDefined()
  })
})
