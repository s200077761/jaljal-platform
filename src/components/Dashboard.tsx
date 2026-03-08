'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import ModelComparison from '@/components/ModelComparison'
import APIIntegration from '@/components/APIIntegration'
import PerformanceMonitoring from '@/components/PerformanceMonitoring'
import type { AIModelData, DashboardStats } from '@/lib/types'
import {
  Brain,
  Settings,
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
} from 'lucide-react'

interface DashboardProps {
  initialModels: AIModelData[]
  initialStats: DashboardStats
}

export default function Dashboard({ initialModels, initialStats }: DashboardProps) {
  const [models, setModels] = useState<AIModelData[]>(initialModels)
  const [stats, setStats] = useState<DashboardStats>(initialStats)
  const [selectedModel, setSelectedModel] = useState<AIModelData | null>(null)

  // Refresh data periodically
  useEffect(() => {
    const refreshData = async () => {
      try {
        const [modelsRes, statsRes] = await Promise.all([
          fetch('/api/models'),
          fetch('/api/models?stats=true'),
        ])
        if (modelsRes.ok) {
          const modelsJson = await modelsRes.json()
          if (modelsJson.success) setModels(modelsJson.data)
        }
        if (statsRes.ok) {
          const statsJson = await statsRes.json()
          if (statsJson.success) setStats(statsJson.data)
        }
      } catch {
        // Silently fail on refresh
      }
    }

    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [])

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

        {/* Stats Cards — from database */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">النماذج النشطة</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeModels}</p>
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
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.avgAccuracy > 0 ? `${stats.avgAccuracy.toFixed(1)}%` : '-'}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">إجمالي الاستخدام</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsageLogs}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">تنبيهات نشطة</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeAlerts}</p>
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
                    <CardDescription>نماذج الذكاء الاصطناعي من قاعدة البيانات</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {models.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>لا توجد نماذج. قم بتشغيل db:seed لإضافة بيانات أولية.</p>
                      </div>
                    ) : (
                      models.map((model) => (
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
                              <Badge variant="outline" className="text-xs">
                                v{model.version}
                              </Badge>
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
                      ))
                    )}
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

                          {selectedModel.capabilities.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">القدرات:</h4>
                              <div className="flex flex-wrap gap-1">
                                {selectedModel.capabilities.map((cap) => (
                                  <Badge key={cap} variant="outline" className="text-xs">
                                    {cap}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedModel.languages.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-2">اللغات:</h4>
                              <div className="flex flex-wrap gap-1">
                                {selectedModel.languages.map((lang) => (
                                  <Badge key={lang} variant="secondary" className="text-xs">
                                    {lang}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
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
              <ModelComparison models={models} />
            </TabsContent>

            <TabsContent value="integration">
              <APIIntegration />
            </TabsContent>

            <TabsContent value="monitoring">
              <PerformanceMonitoring models={models} />
            </TabsContent>

            <TabsContent value="models">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    إدارة النماذج ({stats.totalModels} نموذج)
                  </CardTitle>
                  <CardDescription>جميع النماذج المسجلة في قاعدة البيانات</CardDescription>
                </CardHeader>
                <CardContent>
                  {models.length === 0 ? (
                    <div className="text-center py-12">
                      <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">لا توجد نماذج مسجلة</p>
                      <p className="text-sm text-gray-500 mt-2">قم بتشغيل npm run db:seed لإضافة بيانات أولية</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {models.map((model) => (
                        <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(model.type)}
                            <div>
                              <h3 className="font-semibold">{model.name}</h3>
                              <p className="text-sm text-gray-500">{model.slug} &middot; v{model.version}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                              {model.status === 'active' ? 'نشط' : model.status === 'training' ? 'تدريب' : 'غير نشط'}
                            </Badge>
                            <span className="text-sm text-gray-500">{model.accuracy}% دقة</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
