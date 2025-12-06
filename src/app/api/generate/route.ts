import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, size = '1024x1024', style = 'realistic' } = body

    if (!prompt) {
      return NextResponse.json({
        success: false,
        error: 'prompt is required'
      }, { status: 400 })
    }

    const zai = await ZAI.create()

    // تحسين الطلب بناءً على النمط المطلوب
    let enhancedPrompt = prompt
    if (style === 'realistic') {
      enhancedPrompt = `Realistic, high-quality, professional photograph: ${prompt}`
    } else if (style === 'artistic') {
      enhancedPrompt = `Artistic, creative, digital art: ${prompt}`
    } else if (style === 'technical') {
      enhancedPrompt = `Technical diagram, professional visualization: ${prompt}`
    }

    // توليد الصورة باستخدام نموذج الذكاء الاصطناعي
    const response = await zai.images.generations.create({
      prompt: enhancedPrompt,
      size: size as string,
      quality: 'high'
    })

    const imageBase64 = response.data[0]?.base64

    if (!imageBase64) {
      return NextResponse.json({
        success: false,
        error: 'Failed to generate image'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        image: imageBase64,
        prompt: enhancedPrompt,
        size,
        style,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('Error in image generation API:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to generate image'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      availableSizes: ['1024x1024', '1024x1792', '1792x1024'],
      availableStyles: ['realistic', 'artistic', 'technical'],
      maxPromptLength: 4000,
      supportedFormats: ['png', 'jpg', 'webp']
    }
  })
}