'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { AIModelData } from '@/lib/types'
import {
  BarChart3,
  Check,
  X,
  Star,
} from 'lucide-react'

interface ModelComparisonProps {
  models: AIModelData[]
}

export default function ModelComparison({ models }: ModelComparisonProps) {
  const [selectedModels, setSelectedModels] = useState<string[]>(
    models.length >= 2 ? [models[0].id, models[1].id] : models.map(m => m.id)
  )
  const [comparisonMode, setComparisonMode] = useState<'detailed' | 'quick'>('detailed')

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    if (score >= 70) return 'text-orange-600'
    return 'text-red-600'
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'language': return 'لغوي'
      case 'vision': return 'رؤية حاسوبية'
      case 'multimodal': return 'متعدد الوسائط'
      default: return type
    }
  }

  const selectedModelsData = models.filter(model => selectedModels.includes(model.id))

  if (models.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">لا توجد نماذج للمقارنة</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary rounded-xl">
            <BarChart3 className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">مقارنة النماذج</h2>
            <p className="text-gray-600 mt-1">تحليل شامل ومقارنة مفصلة بين النماذج</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={comparisonMode === 'quick' ? 'default' : 'outline'}
            onClick={() => setComparisonMode('quick')}
          >
            نظرة سريعة
          </Button>
          <Button
            variant={comparisonMode === 'detailed' ? 'default' : 'outline'}
            onClick={() => setComparisonMode('detailed')}
          >
            تحليل مفصل
          </Button>
        </div>
      </div>

      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>اختر النماذج للمقارنة</CardTitle>
          <CardDescription>حدد نموذجين أو أكثر للمقارنة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {models.map((model) => (
              <div
                key={model.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedModels.includes(model.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleModelSelection(model.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{model.name}</h3>
                  {selectedModels.includes(model.id) && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="secondary">{getTypeLabel(model.type)}</Badge>
                  {model.openSource && (
                    <Badge variant="outline" className="text-xs">مفتوح المصدر</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {selectedModelsData.length >= 2 ? (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="performance">الأداء</TabsTrigger>
            <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedModelsData.map((model) => (
                <Card key={model.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{model.name}</span>
                      <Badge>{getTypeLabel(model.type)}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className={`text-2xl font-bold ${getScoreColor(model.accuracy)}`}>
                          {model.accuracy}%
                        </div>
                        <div className="text-sm text-gray-600">الدقة</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className={`text-2xl font-bold ${getScoreColor(model.performance)}`}>
                          {model.performance}%
                        </div>
                        <div className="text-sm text-gray-600">الأداء</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className={`text-2xl font-bold ${getScoreColor(model.customization)}`}>
                          {model.customization}%
                        </div>
                        <div className="text-sm text-gray-600">التخصيص</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">
                          {model.maxTokens}
                        </div>
                        <div className="text-sm text-gray-600">الحد الأقصى</div>
                      </div>
                    </div>

                    {model.capabilities.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          القدرات
                        </h4>
                        <ul className="space-y-1">
                          {model.capabilities.map((cap) => (
                            <li key={cap} className="text-sm text-gray-700 flex items-start gap-2">
                              <Check className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                              {cap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>مقارنة الأداء التفصيلية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(['accuracy', 'performance', 'customization'] as const).map((metric) => {
                    const metricNames = {
                      accuracy: 'الدقة',
                      performance: 'الأداء',
                      customization: 'التخصيص',
                    }
                    return (
                      <div key={metric} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{metricNames[metric]}</span>
                          <div className="flex gap-4">
                            {selectedModelsData.map((model) => (
                              <span key={model.id} className={`font-semibold ${getScoreColor(model[metric])}`}>
                                {model.name}: {model[metric]}%
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {selectedModelsData.map((model) => (
                            <div key={model.id} className="flex items-center gap-2">
                              <span className="text-sm w-32">{model.name}</span>
                              <div className="flex-1">
                                <Progress value={model[metric]} className="h-3" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  التوصيات المخصصة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {selectedModelsData.map((model) => {
                    const avgScore = (model.accuracy + model.performance + model.customization) / 3
                    const isBest = avgScore === Math.max(
                      ...selectedModelsData.map(m => (m.accuracy + m.performance + m.customization) / 3)
                    )

                    return (
                      <div key={model.id} className={`p-4 rounded-lg border ${isBest ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg">{model.name}</h3>
                          {isBest && (
                            <Badge className="bg-green-600">
                              <Star className="w-3 h-3 mr-1" />
                              الأفضل لك
                            </Badge>
                          )}
                        </div>

                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">التقييم الإجمالي</span>
                            <span className={`font-bold ${getScoreColor(avgScore)}`}>
                              {avgScore.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={avgScore} className="h-2" />
                        </div>

                        <div className="text-sm text-gray-700">
                          <p className="mb-2">
                            <strong>مناسب لـ:</strong>{' '}
                            {model.accuracy >= 90
                              ? 'التطبيقات التي تتطلب دقة عالية'
                              : model.performance >= 85
                                ? 'التطبيقات سريعة الاستجابة'
                                : 'الاستخدام العام والتطبيقات المتوسطة'}
                          </p>
                          <p>
                            <strong>نصيحة:</strong>{' '}
                            {isBest
                              ? 'هذا النموذج يقدم أفضل توازن بين الأداء والتكلفة'
                              : 'يمكن اعتباره كبديل جيد حسب متطلبات مشروعك'}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">يرجى اختيار نموذجين أو أكثر للمقارنة</p>
            <p className="text-sm text-gray-500">اختر من النماذج المتاحة أعلاه لبدء المقارنة</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
