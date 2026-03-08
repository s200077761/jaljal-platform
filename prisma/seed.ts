import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create AI Models
  const neuralChat = await prisma.aIModel.upsert({
    where: { slug: 'neuralchat-x' },
    update: {},
    create: {
      slug: 'neuralchat-x',
      name: 'NeuralChat-X',
      type: 'language',
      status: 'active',
      accuracy: 94,
      performance: 88,
      customization: 95,
      openSource: true,
      description: 'نموذج لغوي متقدم مع دعم متعدد اللغات',
      version: '1.2.0',
      capabilities: JSON.stringify([
        'text-generation',
        'translation',
        'summarization',
        'question-answering',
      ]),
      languages: JSON.stringify(['ar', 'en', 'fr', 'es', 'de', 'zh']),
      maxTokens: 4096,
    },
  })

  const visionAI = await prisma.aIModel.upsert({
    where: { slug: 'visionai-pro' },
    update: {},
    create: {
      slug: 'visionai-pro',
      name: 'VisionAI-Pro',
      type: 'vision',
      status: 'active',
      accuracy: 91,
      performance: 85,
      customization: 88,
      openSource: true,
      description: 'نموذج رؤية حاسوبية عالي الدقة',
      version: '2.1.0',
      capabilities: JSON.stringify([
        'image-classification',
        'object-detection',
        'image-segmentation',
        'face-recognition',
      ]),
      languages: JSON.stringify(['ar', 'en']),
      maxTokens: 2048,
    },
  })

  const multiMind = await prisma.aIModel.upsert({
    where: { slug: 'multimind-fusion' },
    update: {},
    create: {
      slug: 'multimind-fusion',
      name: 'MultiMind-Fusion',
      type: 'multimodal',
      status: 'training',
      accuracy: 89,
      performance: 82,
      customization: 92,
      openSource: true,
      description: 'نموذج متعدد الوسائط متكامل',
      version: '1.0.0-beta',
      capabilities: JSON.stringify([
        'text-image-generation',
        'visual-question-answering',
        'image-captioning',
        'multimodal-reasoning',
      ]),
      languages: JSON.stringify(['ar', 'en', 'fr', 'es']),
      maxTokens: 2048,
    },
  })

  console.log('Created models:', neuralChat.name, visionAI.name, multiMind.name)

  // Seed metrics for each model
  const models = [neuralChat, visionAI, multiMind]
  for (const model of models) {
    for (let i = 0; i < 10; i++) {
      await prisma.modelMetric.create({
        data: {
          modelId: model.id,
          accuracy: model.accuracy - 5 + Math.random() * 10,
          responseTime: 100 + Math.random() * 400,
          throughput: 50 + Math.random() * 200,
          cpuUsage: 30 + Math.random() * 50,
          memoryUsage: 40 + Math.random() * 40,
          errorRate: Math.random() * 3,
          activeUsers: Math.floor(10 + Math.random() * 90),
          createdAt: new Date(Date.now() - i * 60000 * 5),
        },
      })
    }
  }
  console.log('Created metrics for all models')

  // Seed alerts
  await prisma.alert.createMany({
    data: [
      {
        type: 'warning',
        message: 'ارتفاع استهلاك الذاكرة في نموذج NeuralChat-X',
        modelId: neuralChat.id,
        createdAt: new Date(Date.now() - 300000),
      },
      {
        type: 'error',
        message: 'انخفاض الدقة في VisionAI-Pro تحت 85%',
        modelId: visionAI.id,
        createdAt: new Date(Date.now() - 600000),
      },
      {
        type: 'success',
        message: 'اكتمل تحسين أداء MultiMind-Fusion بنجاح',
        modelId: multiMind.id,
        resolved: true,
        createdAt: new Date(Date.now() - 900000),
      },
    ],
  })
  console.log('Created alerts')

  // Create a default API key
  await prisma.apiKey.upsert({
    where: { key: 'sk-jaljal-dev-key-for-testing-only' },
    update: {},
    create: {
      name: 'مفتاح التطوير',
      key: 'sk-jaljal-dev-key-for-testing-only',
      active: true,
    },
  })
  console.log('Created default API key')

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
