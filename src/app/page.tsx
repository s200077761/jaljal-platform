'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import ModelComparison from '@/components/ModelComparison'
import APIIntegration from '@/components/APIIntegration'
import PerformanceMonitoring from '@/components/PerformanceMonitoring'
import { 
  Brain, 
  Settings, 
  BarChart3, 
  Zap, 
  Code, 
  Database, 
  Cpu, 
  Globe,
  TrendingUp,
  Users,
  Shield,
  Rocket,
  Activity,
  Terminal,
  Cloud
} from 'lucide-react'

interface AIModel {
  id: string
  name: string
  type: 'language' | 'vision' | 'multimodal'
  status: 'active' | 'training' | 'inactive'
  accuracy: number
  performance: number
  customization: number
  openSource: boolean
  description: string
}

export default function AIModelManager() {
  const [models, setModels] = useState<AIModel[]>([
    {
      id: '1',
      name: 'NeuralChat-X',
      type: 'language',
      status: 'active',
      accuracy: 94,
      performance: 88,
      customization: 95,
      openSource: true,
      description: 'نموذج لغوي متقدم مع دعم متعدد اللغات'
    },
    {
      id: '2',
      name: 'VisionAI-Pro',
      type: 'vision',
      status: 'active',
      accuracy: 91,
      performance: 85,
      customization: 88,
      openSource: true,
      description: 'نموذج رؤية حاسوبية عالي الدقة'
    },
    {
      id: '3',
      name: 'MultiMind-Fusion',
      type: 'multimodal',
      status: 'training',
      accuracy: 89,
      performance: 82,
      customization: 92,
      openSource: true,
      description: 'نموذج متعدد الوسائط متكامل'
    }
  ])

  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'training': return 'bg-yellow-500'
      case 'inactive': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'language': return <Code className="w-4 h-4" />
      case 'vision': return <Globe className="w-4 h-4" />
      case 'multimodal': return <Brain className="w-4 h-4" />
      default: return <Cpu className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="p-4 md:p-6 border-b bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-xl">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">منصة جلاجل للذكاء الاصطناعي</h1>
                <p className="text-gray-600 mt-1">نظام متقدم لإدارة وتطوير نماذج الذكاء الاصطناعي المفتوحة المصدر</p>
              </div>
            </div>
            <Button className="gap-2">
              <Rocket className="w-4 h-4" />
              بدء مشروع جديد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">النماذج النشطة</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">متوسط الدقة</p>
                    <p className="text-2xl font-bold text-gray-900">91.3%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">المستخدمون</p>
                    <p className="text-2xl font-bold text-gray-900">2.4K</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">الأمان</p>
                    <p className="text-2xl font-bold text-gray-900">A+</p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="comparison">المقارنة</TabsTrigger>
              <TabsTrigger value="integration">التكامل</TabsTrigger>
              <TabsTrigger value="monitoring">المراقبة</TabsTrigger>
              <TabsTrigger value="models">النماذج</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Models List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      النماذج المتاحة
                    </CardTitle>
                    <CardDescription>أحدث نماذج الذكاء الاصطناعي المفتوحة المصدر من جلاجل</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {models.map((model) => (
                      <div
                        key={model.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedModel?.id === model.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedModel(model)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(model.type)}
                            <h3 className="font-semibold text-gray-900">{model.name}</h3>
                            {model.openSource && (
                              <Badge variant="secondary" className="text-xs">
                                مفتوح المصدر
                              </Badge>
                            )}
                          </div>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(model.status)}`} />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">الدقة:</span>
                            <span className="font-semibold mr-1">{model.accuracy}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">الأداء:</span>
                            <span className="font-semibold mr-1">{model.performance}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">التخصيص:</span>
                            <span className="font-semibold mr-1">{model.customization}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Model Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      تفاصيل النموذج
                    </CardTitle>
                    <CardDescription>إعدادات وتكوينات متقدمة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedModel ? (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{selectedModel.name}</h3>
                          <p className="text-gray-600 mb-4">{selectedModel.description}</p>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">الدقة</span>
                                <span className="text-sm text-gray-600">{selectedModel.accuracy}%</span>
                              </div>
                              <Progress value={selectedModel.accuracy} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">الأداء</span>
                                <span className="text-sm text-gray-600">{selectedModel.performance}%</span>
                              </div>
                              <Progress value={selectedModel.performance} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">قابلية التخصيص</span>
                                <span className="text-sm text-gray-600">{selectedModel.customization}%</span>
                              </div>
                              <Progress value={selectedModel.customization} className="h-2" />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1">تكوين متقدم</Button>
                          <Button variant="outline" className="flex-1">تصدير الإعدادات</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>اختر نموذجاً لعرض التفاصيل</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>إجراءات سريعة</CardTitle>
                  <CardDescription>وصول سريع إلى أهم الوظائف</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="h-16 flex-col gap-2">
                      <Rocket className="w-6 h-6" />
                      <span>تدريب نموذج جديد</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-2">
                      <Code className="w-6 h-6" />
                      <span>استكشاف API</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-2">
                      <Activity className="w-6 h-6" />
                      <span>مراقبة الأداء</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison">
              <ModelComparison />
            </TabsContent>

            <TabsContent value="integration">
              <APIIntegration />
            </TabsContent>

            <TabsContent value="monitoring">
              <PerformanceMonitoring />
            </TabsContent>

            <TabsContent value="models">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    إدارة نماذج جلاجل المتقدمة
                  </CardTitle>
                  <CardDescription>إعدادات وتكوينات شاملة للنماذج</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">قريباً: لوحة تحكم متقدمة للنماذج</p>
                    <p className="text-sm text-gray-500 mt-2">تكوينات متقدمة، إعدادات التدريب، وتخصيص كامل</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}