import { NextRequest, NextResponse } from 'next/server'
import {
  getAllModels,
  getModelBySlug,
  createModel,
  updateModel,
  getModelMetrics,
  createMetric,
  getDashboardStats,
} from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const stats = searchParams.get('stats')
    const metricsFor = searchParams.get('metrics')

    if (stats === 'true') {
      const dashboardStats = await getDashboardStats()
      return NextResponse.json({
        success: true,
        data: dashboardStats,
        timestamp: new Date().toISOString(),
      })
    }

    if (metricsFor) {
      const metrics = await getModelMetrics(
        metricsFor === 'all' ? undefined : metricsFor,
        50
      )
      return NextResponse.json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString(),
      })
    }

    if (slug) {
      const model = await getModelBySlug(slug)
      if (!model) {
        return NextResponse.json(
          { success: false, error: 'Model not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        data: model,
        timestamp: new Date().toISOString(),
      })
    }

    const models = await getAllModels()
    return NextResponse.json({
      success: true,
      data: models,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch models'
    console.error('Error fetching models:', error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, modelId, config } = body

    switch (action) {
      case 'create': {
        if (!config?.name || !config?.type || !config?.description) {
          return NextResponse.json(
            { success: false, error: 'name, type, and description are required' },
            { status: 400 }
          )
        }
        const slug = config.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        const newModel = await createModel({
          slug,
          name: config.name,
          type: config.type,
          description: config.description,
          capabilities: config.capabilities,
          languages: config.languages,
          openSource: config.openSource,
          maxTokens: config.maxTokens,
        })
        return NextResponse.json({
          success: true,
          data: newModel,
          message: 'Model created successfully',
        })
      }

      case 'update': {
        if (!modelId) {
          return NextResponse.json(
            { success: false, error: 'modelId is required' },
            { status: 400 }
          )
        }
        const updated = await updateModel(modelId, config)
        return NextResponse.json({
          success: true,
          data: updated,
          message: 'Model updated successfully',
        })
      }

      case 'record-metric': {
        if (!modelId) {
          return NextResponse.json(
            { success: false, error: 'modelId is required' },
            { status: 400 }
          )
        }
        await createMetric({
          modelId,
          accuracy: config.accuracy ?? 0,
          responseTime: config.responseTime ?? 0,
          throughput: config.throughput ?? 0,
          cpuUsage: config.cpuUsage ?? 0,
          memoryUsage: config.memoryUsage ?? 0,
          errorRate: config.errorRate ?? 0,
          activeUsers: config.activeUsers ?? 0,
        })
        return NextResponse.json({
          success: true,
          message: 'Metric recorded',
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: create, update, record-metric' },
          { status: 400 }
        )
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error'
    console.error('Error in models API:', error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
