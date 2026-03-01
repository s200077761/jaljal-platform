import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    name: 'Jaljal AI Platform API',
    version: '1.0.0',
    endpoints: {
      models: '/api/models',
      chat: '/api/chat',
      generate: '/api/generate',
      search: '/api/search',
      alerts: '/api/alerts',
      webhooks: '/api/webhooks',
      keys: '/api/keys',
    },
    timestamp: new Date().toISOString(),
  })
}
