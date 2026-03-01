import { NextRequest, NextResponse } from 'next/server'
import { getApiKeys, createApiKey, revokeApiKey } from '@/lib/models'

export async function GET() {
  try {
    const keys = await getApiKeys()
    // Mask keys for security
    const masked = keys.map((k) => ({
      id: k.id,
      name: k.name,
      key: k.key.substring(0, 7) + '...' + k.key.substring(k.key.length - 4),
      active: k.active,
      createdAt: k.createdAt.toISOString(),
    }))
    return NextResponse.json({
      success: true,
      data: masked,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch API keys'
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, keyId, name } = body

    if (action === 'revoke') {
      if (!keyId) {
        return NextResponse.json(
          { success: false, error: 'keyId is required' },
          { status: 400 }
        )
      }
      await revokeApiKey(keyId)
      return NextResponse.json({ success: true, message: 'API key revoked' })
    }

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'name is required' },
        { status: 400 }
      )
    }

    const newKey = await createApiKey(name)
    return NextResponse.json({
      success: true,
      data: newKey,
      message: 'API key created. Save this key, it will not be shown again.',
    })
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : 'Failed to manage API key'
    console.error('Error in API keys:', error)
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    )
  }
}
