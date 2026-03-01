import { NextRequest, NextResponse } from 'next/server'
import { getWebhooks, createWebhook, deleteWebhook } from '@/lib/models'

export async function GET() {
  try {
    const webhooks = await getWebhooks()
    return NextResponse.json({
      success: true,
      data: webhooks,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch webhooks'
    console.error('Error fetching webhooks:', error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, webhookId, url, events, secret } = body

    if (action === 'delete') {
      if (!webhookId) {
        return NextResponse.json(
          { success: false, error: 'webhookId is required' },
          { status: 400 }
        )
      }
      await deleteWebhook(webhookId)
      return NextResponse.json({ success: true, message: 'Webhook deleted' })
    }

    if (!url || !events || !Array.isArray(events)) {
      return NextResponse.json(
        { success: false, error: 'url and events array are required' },
        { status: 400 }
      )
    }

    await createWebhook({ url, events, secret })
    return NextResponse.json({
      success: true,
      message: 'Webhook created',
    })
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : 'Failed to manage webhook'
    console.error('Error in webhooks API:', error)
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    )
  }
}
