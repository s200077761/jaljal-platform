import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { modelId, message, context = {} } = body

    if (!modelId || !message) {
      return NextResponse.json({
        success: false,
        error: 'modelId and message are required'
      }, { status: 400 })
    }

    const zai = await ZAI.create()

    // الحصول على معلومات النموذج
    const modelInfo = await getModelInfo(modelId)
    
    if (!modelInfo) {
      return NextResponse.json({
        success: false,
        error: 'Model not found'
      }, { status: 404 })
    }

    // إعداد الرسالة للنموذج
    const systemPrompt = `You are ${modelInfo.name}, ${modelInfo.description}. 
    Capabilities: ${modelInfo.capabilities.join(', ')}.
    Languages: ${modelInfo.languages?.join(', ') || 'Not specified'}.
    Please respond in the language of the user's message.`

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...(context.conversationHistory || []),
      {
        role: 'user',
        content: message
      }
    ]

    // إرسال الطلب إلى نموذج الذكاء الاصطناعي
    const completion = await zai.chat.completions.create({
      messages,
      max_tokens: modelInfo.maxTokens || 2048,
      temperature: 0.7,
      model: modelInfo.type
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    // تسجيل الاستخدام
    await logUsage(modelId, message, response)

    return NextResponse.json({
      success: true,
      data: {
        modelId,
        modelName: modelInfo.name,
        response,
        timestamp: new Date().toISOString(),
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0
        }
      }
    })

  } catch (error: any) {
    console.error('Error in chat API:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to process chat request'
    }, { status: 500 })
  }
}

async function getModelInfo(modelId: string) {
  const models = {
    'neuralchat-x': {
      name: 'NeuralChat-X',
      description: 'نموذج لغوي متقدم مع دعم متعدد اللغات',
      capabilities: ['text-generation', 'translation', 'summarization', 'question-answering'],
      languages: ['ar', 'en', 'fr', 'es', 'de', 'zh'],
      maxTokens: 4096,
      type: 'language'
    },
    'visionai-pro': {
      name: 'VisionAI-Pro',
      description: 'نموذج رؤية حاسوبية عالي الدقة',
      capabilities: ['image-analysis', 'visual-question-answering'],
      maxTokens: 2048,
      type: 'vision'
    },
    'multimind-fusion': {
      name: 'MultiMind-Fusion',
      description: 'نموذج متعدد الوسائط متكامل',
      capabilities: ['text-image-generation', 'multimodal-reasoning'],
      languages: ['ar', 'en', 'fr', 'es'],
      maxTokens: 2048,
      type: 'multimodal'
    }
  }

  return models[modelId as keyof typeof models] || null
}

async function logUsage(modelId: string, message: string, response: string) {
  // تسجيل استخدام النموذج (يمكن إضافة قاعدة بيانات لاحقاً)
  console.log(`Model ${modelId} used:`, {
    messageLength: message.length,
    responseLength: response.length,
    timestamp: new Date().toISOString()
  })
}