'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Code, 
  Globe, 
  Zap, 
  Shield, 
  TrendingUp,
  Settings,
  BarChart3,
  Users,
  Cpu,
  Check,
  X,
  Star,
  ArrowRight
} from 'lucide-react'

interface ModelComparison {
  id: string
  name: string
  category: string
  accuracy: number
  speed: number
  memory: number
  scalability: number
  easeOfUse: number
  cost: number
  openSource: boolean
  features: string[]
  limitations: string[]
}

const modelsData: ModelComparison[] = [
  {
    id: '1',
    name: 'NeuralChat-X',
    category: 'لغوي',
    accuracy: 94,
    speed: 88,
    memory: 75,
    scalability: 92,
    easeOfUse: 85,
    cost: 90,
    openSource: true,
    features: [
      'دعم 50+ لغة',
      'معالجة السياق الطويل',
      'ضبط دقيق متقدم',
      'تكامل API سهل'
    ],
    limitations: [
      'يتطلب ذاكرة عالية',
      'وقت تدريب طويل'
    ]
  },
  {
    id: '2',
    name: 'VisionAI-Pro',
    category: 'رؤية حاسوبية',
    accuracy: 91,
    speed: 85,
    memory: 80,
    scalability: 88,
    easeOfUse: 82,
    cost: 85,
    openSource: true,
    features: [
      'تحليل الصور عالي الدقة',
      'كشف الكائنات في الوقت الفعلي',
      'معالجة الفيديو',
      'تدريب على البيانات المخصصة'
    ],
    limitations: [
      'محدود في الصور منخفضة الجودة',
      'استهلاك GPU عالي'
    ]
  },
  {
    id: '3',
    name: 'MultiMind-Fusion',
    category: 'متعدد الوسائط',
    accuracy: 89,
    speed: 82,
    memory: 70,
    scalability: 90,
    easeOfUse: 78,
    cost: 75,
    openSource: true,
    features: [
      'معالجة النص والصورة معاً',
      'فهم السياق متعدد الوسائط',
      'تحويل النص إلى صورة',
      'تحليل الفيديو والنص'
    ],
    limitations: [
      'أقل دقة في المهام المتخصصة',
      'تعقيد التكوين'
    ]
  }
]

export default function ModelComparison() {
  const [selectedModels, setSelectedModels] = useState<string[]>(['1', '2'])
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

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 80) return 'bg-yellow-500'
    if (score >= 70) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const selectedModelsData = modelsData.filter(model => selectedModels.includes(model.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-xl">
                <BarChart3 className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">مقارنة نماذج جلاجل المتقدمة</h1>
                <p className="text-gray-600 mt-1">تحليل شامل ومقارنة مفصلة بين نماذج الذكاء الاصطناعي من جلاجل</p>
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
        </div>

        {/* Model Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>اختر النماذج للمقارنة</CardTitle>
            <CardDescription>حدد نموذجين أو أكثر للمقارنة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {modelsData.map((model) => (
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
                    <Badge variant="secondary">{model.category}</Badge>
                    {model.openSource && (
                      <Badge variant="outline" className="text-xs">
                        مفتوح المصدر
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {selectedModelsData.length >= 2 && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="performance">الأداء</TabsTrigger>
              <TabsTrigger value="features">المميزات</TabsTrigger>
              <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedModelsData.map((model) => (
                  <Card key={model.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{model.name}</span>
                        <Badge>{model.category}</Badge>
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
                          <div className={`text-2xl font-bold ${getScoreColor(model.speed)}`}>
                            {model.speed}%
                          </div>
                          <div className="text-sm text-gray-600">السرعة</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className={`text-2xl font-bold ${getScoreColor(model.scalability)}`}>
                            {model.scalability}%
                          </div>
                          <div className="text-sm text-gray-600">قابلية التوسع</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className={`text-2xl font-bold ${getScoreColor(model.cost)}`}>
                            {model.cost}%
                          </div>
                          <div className="text-sm text-gray-600">الكفاءة التكلفة</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>سهولة الاستخدام</span>
                          <span className={getScoreColor(model.easeOfUse)}>{model.easeOfUse}%</span>
                        </div>
                        <Progress value={model.easeOfUse} className="h-2" />
                      </div>
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
                    {['accuracy', 'speed', 'memory', 'scalability', 'easeOfUse', 'cost'].map((metric) => {
                      const metricNames: Record<string, string> = {
                        accuracy: 'الدقة',
                        speed: 'السرعة',
                        memory: 'استهلاك الذاكرة',
                        scalability: 'قابلية التوسع',
                        easeOfUse: 'سهولة الاستخدام',
                        cost: 'الكفاءة التكلفة'
                      }
                      
                      return (
                        <div key={metric} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{metricNames[metric]}</span>
                            <div className="flex gap-4">
                              {selectedModelsData.map((model) => (
                                <span key={model.id} className={`font-semibold ${getScoreColor(model[metric as keyof ModelComparison] as number)}`}>
                                  {model.name}: {model[metric as keyof ModelComparison]}%
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            {selectedModelsData.map((model) => (
                              <div key={model.id} className="flex items-center gap-2">
                                <span className="text-sm w-24">{model.name}</span>
                                <div className="flex-1">
                                  <Progress 
                                    value={model[metric as keyof ModelComparison] as number} 
                                    className="h-3"
                                  />
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

            <TabsContent value="features">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedModelsData.map((model) => (
                  <Card key={model.id}>
                    <CardHeader>
                      <CardTitle>{model.name}</CardTitle>
                      <CardDescription>المميزات والقيود</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          المميزات
                        </h4>
                        <ul className="space-y-1">
                          {model.features.map((feature, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                              <Check className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                          <X className="w-4 h-4" />
                          القيود
                        </h4>
                        <ul className="space-y-1">
                          {model.limitations.map((limitation, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                              <X className="w-3 h-3 text-red-500 mt-1 flex-shrink-0" />
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                      const avgScore = (model.accuracy + model.speed + model.scalability + model.easeOfUse + model.cost) / 5
                      const isBest = avgScore === Math.max(...selectedModelsData.map(m => 
                        (m.accuracy + m.speed + m.scalability + m.easeOfUse + m.cost) / 5
                      ))
                      
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
                              <strong>مناسب لـ:</strong> {
                                model.accuracy >= 90 ? 'التطبيقات التي تتطلب دقة عالية' :
                                model.speed >= 85 ? 'التطبيقات سريعة الاستجابة' :
                                model.scalability >= 90 ? 'المشاريع الكبيرة القابلة للتوسع' :
                                'الاستخدام العام والتطبيقات المتوسطة'
                              }
                            </p>
                            <p>
                              <strong>نصيحة:</strong> {
                                isBest ? 'هذا النموذج يقدم أفضل توازن بين الأداء والتكلفة' :
                                'يمكن اعتباره كبديل جيد حسب متطلبات مشروعك'
                              }
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
        )}

        {selectedModelsData.length < 2 && (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">يرجى اختيار نموذجين أو أكثر للمقارنة</p>
              <p className="text-sm text-gray-500">اختر من النماذج المتاحة أعلاه لبدء المقارنة</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}