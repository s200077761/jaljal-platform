import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, num = 10 } = body

    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'query is required'
      }, { status: 400 })
    }

    const zai = await ZAI.create()

    // استخدام وظيفة البحث في الويب
    const searchResult = await zai.functions.invoke("web_search", {
      query,
      num
    })

    return NextResponse.json({
      success: true,
      data: {
        query,
        results: searchResult,
        count: searchResult.length,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('Error in search API:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to perform search'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      description: 'AI-powered web search API',
      capabilities: [
        'Web search with AI-powered ranking',
        'Multi-language support',
        'Real-time results',
        'Customizable result count'
      ],
      maxResults: 50,
      supportedLanguages: ['ar', 'en', 'fr', 'es', 'de', 'zh', 'ja', 'ru']
    }
  })
}