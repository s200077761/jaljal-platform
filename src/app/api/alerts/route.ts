import { NextRequest, NextResponse } from 'next/server'
import { getAlerts, createAlert, resolveAlert } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resolvedParam = searchParams.get('resolved')
    const resolved =
      resolvedParam === 'true' ? true : resolvedParam === 'false' ? false : undefined

    const alerts = await getAlerts(resolved)
    return NextResponse.json({
      success: true,
      data: alerts,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch alerts'
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, alertId, type, message, modelId } = body

    if (action === 'resolve') {
      if (!alertId) {
        return NextResponse.json(
          { success: false, error: 'alertId is required' },
          { status: 400 }
        )
      }
      await resolveAlert(alertId)
      return NextResponse.json({
        success: true,
        message: 'Alert resolved',
      })
    }

    if (!type || !message || !modelId) {
      return NextResponse.json(
        { success: false, error: 'type, message, and modelId are required' },
        { status: 400 }
      )
    }

    await createAlert({ type, message, modelId })
    return NextResponse.json({
      success: true,
      message: 'Alert created',
    })
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : 'Failed to manage alert'
    console.error('Error in alerts API:', error)
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    )
  }
}
