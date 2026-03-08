'use client'

import { useState, useEffect } from 'react'
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
  Key,
  BookOpen,
  Download,
  Settings,
  Play,
  FileText,
  Cloud,
  Plus,
  Trash2,
} from 'lucide-react'

interface ApiKeyDisplay {
  id: string
  name: string
  key: string
  active: boolean
  createdAt: string
}

interface WebhookDisplay {
  id: string
  url: string
  events: string[]
  active: boolean
  createdAt: string
}

const apiEndpoints = [
  {
    method: 'GET' as const,
    path: '/api/models',
    description: 'الحصول على قائمة جميع النماذج من قاعدة البيانات',
    parameters: [
      { name: 'slug', type: 'string', required: false, description: 'تصفية حسب معرف النموذج' },
      { name: 'stats', type: 'boolean', required: false, description: 'إرجاع إحصائيات لوحة التحكم' },
      { name: 'metrics', type: 'string', required: false, description: 'إرجاع قياسات الأداء (all أو model ID)' },
    ],
  },
  {
    method: 'POST' as const,
    path: '/api/models',
    description: 'إنشاء أو تحديث نموذج أو تسجيل قياس أداء',
    parameters: [
      { name: 'action', type: 'string', required: true, description: 'create | update | record-metric' },
      { name: 'modelId', type: 'string', required: false, description: 'معرف النموذج (للتحديث والقياسات)' },
      { name: 'config', type: 'object', required: true, description: 'بيانات النموذج أو القياس' },
    ],
  },
  {
    method: 'POST' as const,
    path: '/api/chat',
    description: 'إرسال رسالة إلى نموذج الدردشة',
    parameters: [
      { name: 'modelId', type: 'string', required: true, description: 'معرف النموذج (slug)' },
      { name: 'message', type: 'string', required: true, description: 'نص الرسالة' },
      { name: 'context', type: 'object', required: false, description: 'سياق المحادثة' },
    ],
  },
  {
    method: 'GET' as const,
    path: '/api/alerts',
    description: 'الحصول على التنبيهات النشطة',
    parameters: [
      { name: 'resolved', type: 'boolean', required: false, description: 'تصفية حسب حالة الحل' },
    ],
  },
]

export default function APIIntegration() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python')
  const [apiKeys, setApiKeys] = useState<ApiKeyDisplay[]>([])
  const [webhooks, setWebhooks] = useState<WebhookDisplay[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookEvents, setWebhookEvents] = useState<string[]>([])

  useEffect(() => {
    fetchApiKeys()
    fetchWebhooks()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const res = await fetch('/api/keys')
      if (res.ok) {
        const json = await res.json()
        if (json.success) setApiKeys(json.data)
      }
    } catch { /* ignore */ }
  }

  const fetchWebhooks = async () => {
    try {
      const res = await fetch('/api/webhooks')
      if (res.ok) {
        const json = await res.json()
        if (json.success) setWebhooks(json.data)
      }
    } catch { /* ignore */ }
  }

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      })
      if (res.ok) {
        setNewKeyName('')
        fetchApiKeys()
      }
    } catch { /* ignore */ }
  }

  const handleRevokeKey = async (keyId: string) => {
    try {
      await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke', keyId }),
      })
      fetchApiKeys()
    } catch { /* ignore */ }
  }

  const handleSaveWebhook = async () => {
    if (!webhookUrl.trim() || webhookEvents.length === 0) return
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl, events: webhookEvents }),
      })
      if (res.ok) {
        setWebhookUrl('')
        setWebhookEvents([])
        fetchWebhooks()
      }
    } catch { /* ignore */ }
  }

  const handleDeleteWebhook = async (webhookId: string) => {
    try {
      await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', webhookId }),
      })
      fetchWebhooks()
    } catch { /* ignore */ }
  }

  const toggleWebhookEvent = (event: string) => {
    setWebhookEvents(prev =>
      prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]
    )
  }

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

  const codeExamples: Record<string, string> = {
    python: `import requests

# الحصول على قائمة النماذج من قاعدة البيانات
response = requests.get('http://localhost:3000/api/models')
models = response.json()
print(f"النماذج المتاحة: {len(models['data'])}")

# إرسال رسالة للدردشة
chat_response = requests.post('http://localhost:3000/api/chat', json={
    'modelId': 'neuralchat-x',
    'message': 'مرحباً، كيف يمكنني مساعدتك؟'
})
print(chat_response.json()['data']['response'])`,
    javascript: `// الحصول على قائمة النماذج من قاعدة البيانات
const modelsRes = await fetch('/api/models');
const { data: models } = await modelsRes.json();
console.log('النماذج المتاحة:', models.length);

// إرسال رسالة للدردشة
const chatRes = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    modelId: 'neuralchat-x',
    message: 'مرحباً، كيف يمكنني مساعدتك؟'
  })
});
const { data } = await chatRes.json();
console.log(data.response);`,
    curl: `# الحصول على قائمة النماذج
curl http://localhost:3000/api/models

# الحصول على إحصائيات لوحة التحكم
curl "http://localhost:3000/api/models?stats=true"

# إرسال رسالة للدردشة
curl -X POST http://localhost:3000/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{"modelId": "neuralchat-x", "message": "مرحباً"}'`,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary rounded-xl">
            <Code className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">مركز التكامل البرمجي</h2>
            <p className="text-gray-600 mt-1">واجهات برمجية حقيقية مرتبطة بقاعدة البيانات</p>
          </div>
        </div>
      </div>

      {/* Quick Stats — computed */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">نقاط API</p>
                <p className="text-2xl font-bold text-gray-900">{apiEndpoints.length}</p>
              </div>
              <Terminal className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مفاتيح API</p>
                <p className="text-2xl font-bold text-gray-900">{apiKeys.length}</p>
              </div>
              <Key className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Webhooks</p>
                <p className="text-2xl font-bold text-gray-900">{webhooks.length}</p>
              </div>
              <Globe className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الحالة</p>
                <p className="text-2xl font-bold text-green-600">متصل</p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="endpoints">نقاط النهاية</TabsTrigger>
          <TabsTrigger value="keys">مفاتيح API</TabsTrigger>
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
              <CardDescription>واجهات API حقيقية تعمل مع قاعدة البيانات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </div>

                    <p className="text-gray-700 mb-3">{endpoint.description}</p>

                    <div>
                      <h4 className="font-semibold mb-2">المعلمات:</h4>
                      <div className="space-y-1">
                        {endpoint.parameters.map((param, paramIndex) => (
                          <div key={paramIndex} className="flex items-center gap-2 text-sm">
                            <code className="bg-gray-100 px-2 py-1 rounded">{param.name}</code>
                            <Badge variant="outline" className="text-xs">{param.type}</Badge>
                            {param.required && (
                              <Badge variant="destructive" className="text-xs">مطلوب</Badge>
                            )}
                            <span className="text-gray-600">- {param.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                إدارة مفاتيح API
              </CardTitle>
              <CardDescription>مفاتيح API محفوظة في قاعدة البيانات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Create new key */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="اسم المفتاح الجديد..."
                  className="flex-1 p-2 border rounded-lg"
                />
                <Button onClick={handleCreateKey} disabled={!newKeyName.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  إنشاء مفتاح
                </Button>
              </div>

              {/* Existing keys */}
              <div className="space-y-2">
                {apiKeys.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">لا توجد مفاتيح API</p>
                ) : (
                  apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{apiKey.name}</span>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-2">{apiKey.key}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={apiKey.active ? 'default' : 'secondary'}>
                          {apiKey.active ? 'نشط' : 'ملغى'}
                        </Badge>
                        {apiKey.active && (
                          <Button variant="outline" size="sm" onClick={() => handleRevokeKey(apiKey.id)}>
                            إلغاء
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples">
          <Card>
            <CardHeader>
              <CardTitle>أمثلة برمجية</CardTitle>
              <CardDescription>أكواد جاهزة تعمل مع API الحقيقي</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
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

              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 left-2 z-10"
                  onClick={() => copyToClipboard(codeExamples[selectedLanguage], 'example')}
                >
                  {copiedCode === 'example' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>{codeExamples[selectedLanguage]}</code>
                </pre>
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
              <CardDescription>Webhooks محفوظة في قاعدة البيانات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Create new webhook */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold">إضافة Webhook جديد</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">رابط Webhook</label>
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      placeholder="https://your-app.com/webhook"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">الأحداث المطلوبة</label>
                    <div className="space-y-2">
                      {['model.training.completed', 'model.prediction.ready', 'alert.created', 'system.maintenance'].map((event) => (
                        <label key={event} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={webhookEvents.includes(event)}
                            onChange={() => toggleWebhookEvent(event)}
                          />
                          <span className="text-sm">{event}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleSaveWebhook} disabled={!webhookUrl.trim() || webhookEvents.length === 0}>
                    حفظ Webhook
                  </Button>
                </div>

                {/* Existing webhooks */}
                {webhooks.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Webhooks المسجلة</h3>
                    {webhooks.map((wh) => (
                      <div key={wh.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <code className="text-sm">{wh.url}</code>
                          <div className="flex gap-1 mt-1">
                            {wh.events.map((e) => (
                              <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteWebhook(wh.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
