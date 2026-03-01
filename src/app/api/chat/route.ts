import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { getModelBySlug, logUsage } from '@/lib/models'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { modelId, message, context = {} } = body

    if (!modelId || !message) {
      return NextResponse.json(
        { success: false, error: 'modelId and message are required' },
        { status: 400 }
      )
    }

    const modelInfo = await getModelBySlug(modelId)

    if (!modelInfo) {
      return NextResponse.json(
        { success: false, error: 'Model not found' },
        { status: 404 }
      )
    }

    if (modelInfo.status !== 'active') {
      return NextResponse.json(
        { success: false, error: `Model ${modelInfo.name} is currently ${modelInfo.status}` },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const systemPrompt = `You are ${modelInfo.name}, ${modelInfo.description}.
    Capabilities: ${modelInfo.capabilities.join(', ')}.
    Languages: ${modelInfo.languages.join(', ')}.
    Please respond in the language of the user's message.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(context.conversationHistory || []),
      { role: 'user', content: message },
    ]

    const completion = await zai.chat.completions.create({
      messages,
      max_tokens: modelInfo.maxTokens,
      temperature: 0.7,
      model: modelInfo.type,
    })

    const response =
      completion.choices[0]?.message?.content ||
      'Sorry, I could not generate a response.'

    await logUsage({
      modelId: modelInfo.id,
      messageLength: message.length,
      responseLength: response.length,
      promptTokens: completion.usage?.prompt_tokens || 0,
      completionTokens: completion.usage?.completion_tokens || 0,
      totalTokens: completion.usage?.total_tokens || 0,
    })

    return NextResponse.json({
      success: true,
      data: {
        modelId: modelInfo.slug,
        modelName: modelInfo.name,
        response,
        timestamp: new Date().toISOString(),
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
      },
    })
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : 'Failed to process chat request'
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    )
  }
}
