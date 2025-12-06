'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Code, 
  Copy, 
  Check, 
  Terminal, 
  Globe, 
  Shield, 
  Zap,
  Key,
  BookOpen,
  Download,
  Upload,
  Settings,
  Play,
  FileText,
  Database,
  Cloud
} from 'lucide-react'

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  parameters: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  example: string
}

interface Integration {
  id: string
  name: string
  category: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  languages: string[]
  setupTime: string
}

const apiEndpoints: APIEndpoint[] = [
  {
    method: 'POST',
    path: '/api/v1/models/chat',
    description: 'إرسال رسالة إلى نموذج الدردشة',
    parameters: [
      {
        name: 'model_id',
        type: 'string',
        required: true,
        description: 'معرف النموذج المستخدم'
      },
      {
        name: 'message',
        type: 'string',
        required: true,
        description: 'نص الرسالة المراد إرسالها'
      },
      {
        name: 'context',
        type: 'object',
        required: false,
        description: 'سياق المحادثة السابق'
      }
    ],
    example: `curl -X POST https://api.example.com/api/v1/models/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_id": "neuralchat-x",
    "message": "مرحباً، كيف يمكنني مساعدتك؟",
    "context": {}
  }'`
  },
  {
    method: 'GET',
    path: '/api/v1/models',
    description: 'الحصول على قائمة جميع النماذج المتاحة',
    parameters: [
      {
        name: 'category',
        type: 'string',
        required: false,
        description: 'تصفية حسب فئة النموذج'
      },
      {
        name: 'status',
        type: 'string',
        required: false,
        description: 'تصفية حسب حالة النموذج'
      }
    ],
    example: `curl -X GET "https://api.example.com/api/v1/models?category=language" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
  },
  {
    method: 'POST',
    path: '/api/v1/models/train',
    description: 'بدء تدريب نموذج مخصص',
    parameters: [
      {
        name: 'base_model',
        type: 'string',
        required: true,
        description: 'النموذج الأساسي للتدريب'
      },
      {
        name: 'training_data',
        type: 'file',
        required: true,
        description: 'بيانات التدريب'
      },
      {
        name: 'config',
        type: 'object',
        required: false,
        description: 'إعدادات التدريب المخصصة'
      }
    ],
    example: `curl -X POST https://api.example.com/api/v1/models/train \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "base_model=neuralchat-x" \\
  -F "training_data=@training_data.json"`
  }
]

const integrations: Integration[] = [
  {
    id: '1',
    name: 'Python SDK',
    category: 'برمجة',
    description: 'مكتبة Python سهلة الاستخدام للتكامل مع النماذج',
    difficulty: 'easy',
    languages: ['Python'],
    setupTime: '5 دقائق'
  },
  {
    id: '2',
    name: 'JavaScript SDK',
    category: 'برمجة',
    description: 'مكتبة JavaScript للويب و Node.js',
    difficulty: 'easy',
    languages: ['JavaScript', 'TypeScript'],
    setupTime: '3 دقائق'
  },
  {
    id: '3',
    name: 'REST API',
    category: 'برمجة',
    description: 'واجهة برمجية قياسية للتكامل مع أي لغة',
    difficulty: 'medium',
    languages: ['All'],
    setupTime: '10 دقائق'
  },
  {
    id: '4',
    name: 'Webhook Integration',
    category: 'تكامل',
    description: 'تكامل مع الأنظمة الخارجية عبر Webhooks',
    difficulty: 'medium',
    languages: ['All'],
    setupTime: '15 دقائق'
  }
]

export default function APIIntegration() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python')
  const [apiKey, setApiKey] = useState<string>('sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800'
      case 'POST': return 'bg-blue-100 text-blue-800'
      case 'PUT': return 'bg-yellow-100 text-yellow-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const codeExamples = {
    python: `import requests

# إعداد العميل
client = requests.Session()
client.headers.update({
    'Authorization': f'Bearer {apiKey}',
    'Content-Type': 'application/json'
})

# إرسال رسالة
response = client.post('https://api.example.com/api/v1/models/chat', json={
    'model_id': 'neuralchat-x',
    'message': 'مرحباً، كيف يمكنني مساعدتك؟'
})

result = response.json()
print(result['response'])`,
    javascript: `const axios = require('axios');

// إعداد العميل
const client = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  }
});

// إرسال رسالة
const response = await client.post('/api/v1/models/chat', {
  model_id: 'neuralchat-x',
  message: 'مرحباً، كيف يمكنني مساعدتك؟'
});

console.log(response.data.response);`,
    curl: `curl -X POST https://api.example.com/api/v1/models/chat \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_id": "neuralchat-x",
    "message": "مرحباً، كيف يمكنني مساعدتك؟"
  }'`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-xl">
                <Code className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">مركز جلاجل للتكامل البرمجي</h1>
                <p className="text-gray-600 mt-1">واجهات برمجية وأدوات سهلة التكامل مع أنظمتك من جلاجل</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">API Key:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">{apiKey}</code>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">واجهات API</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <Terminal className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">SDKs</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <Database className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">اللغات المدعومة</p>
                  <p className="text-2xl font-bold text-gray-900">15+</p>
                </div>
                <Globe className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">معدل النجاح</p>
                  <p className="text-2xl font-bold text-gray-900">99.9%</p>
                </div>
                <Shield className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="endpoints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="endpoints">نقاط النهاية</TabsTrigger>
            <TabsTrigger value="sdks">مكتبات البرمجة</TabsTrigger>
            <TabsTrigger value="examples">أمثلة برمجية</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  نقاط النهاية البرمجية
                </CardTitle>
                <CardDescription>واجهات API متاحة للاستخدام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {endpoint.path}
                          </code>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(endpoint.example, `endpoint-${index}`)}
                        >
                          {copiedCode === `endpoint-${index}` ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{endpoint.description}</p>
                      
                      <div className="mb-3">
                        <h4 className="font-semibold mb-2">المعلمات:</h4>
                        <div className="space-y-1">
                          {endpoint.parameters.map((param, paramIndex) => (
                            <div key={paramIndex} className="flex items-center gap-2 text-sm">
                              <code className="bg-gray-100 px-2 py-1 rounded">
                                {param.name}
                              </code>
                              <Badge variant="outline" className="text-xs">
                                {param.type}
                              </Badge>
                              {param.required && (
                                <Badge variant="destructive" className="text-xs">
                                  مطلوب
                                </Badge>
                              )}
                              <span className="text-gray-600">- {param.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">مثال:</h4>
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                          <code>{endpoint.example}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sdks">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge className={getDifficultyColor(integration.difficulty)}>
                        {integration.difficulty === 'easy' ? 'سهل' : 
                         integration.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                      </Badge>
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{integration.setupTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Code className="w-4 h-4" />
                        <span>{integration.languages.join(', ')}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        تحميل
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <BookOpen className="w-4 h-4 mr-2" />
                        documentation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="examples">
            <Card>
              <CardHeader>
                <CardTitle>أمثلة برمجية</CardTitle>
                <CardDescription>أكواد جاهزة للبدء</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex gap-2">
                    {Object.keys(codeExamples).map((lang) => (
                      <Button
                        key={lang}
                        variant={selectedLanguage === lang ? 'default' : 'outline'}
                        onClick={() => setSelectedLanguage(lang)}
                      >
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 left-2 z-10"
                    onClick={() => copyToClipboard(codeExamples[selectedLanguage as keyof typeof codeExamples], 'example')}
                  >
                    {copiedCode === 'example' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{codeExamples[selectedLanguage as keyof typeof codeExamples]}</code>
                  </pre>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button>
                    <Play className="w-4 h-4 mr-2" />
                    تشغيل المثال
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    عرض المزيد من الأمثلة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="w-5 h-5" />
                  تكامل Webhooks
                </CardTitle>
                <CardDescription>استقبال الإشعارات في الوقت الفعلي</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">إعداد Webhook</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">رابط Webhook</label>
                          <input
                            type="url"
                            className="w-full p-2 border rounded-lg"
                            placeholder="https://your-app.com/webhook"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">الأحداث المطلوبة</label>
                          <div className="space-y-2">
                            {['model.training.completed', 'model.prediction.ready', 'system.maintenance'].map((event) => (
                              <label key={event} className="flex items-center gap-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">{event}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <Button>حفظ الإعدادات</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">مثال على استقبال Webhook</h3>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{`// مثال باستخدام Node.js و Express
app.post('/webhook', (req, res) => {
  const event = req.headers['x-event-type'];
  const data = req.body;
  
  console.log('Received event:', event);
  console.log('Data:', data);
  
  // معالجة الحدث هنا
  
  res.status(200).send('OK');
});`}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}