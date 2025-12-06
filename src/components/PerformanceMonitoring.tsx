'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Cpu, 
  Memory,
  Zap,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Settings,
  RefreshCw,
  Download,
  Calendar,
  Filter
} from 'lucide-react'

interface PerformanceMetric {
  timestamp: string
  modelId: string
  modelName: string
  accuracy: number
  responseTime: number
  throughput: number
  cpuUsage: number
  memoryUsage: number
  errorRate: number
  activeUsers: number
}

interface Alert {
  id: string
  type: 'warning' | 'error' | 'success'
  message: string
  timestamp: string
  modelId: string
  modelName: string
}

export default function PerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [selectedModel, setSelectedModel] = useState<string>('all')
  const [isRealTime, setIsRealTime] = useState<boolean>(true)

  // بيانات وهمية للعرض
  useEffect(() => {
    const generateMockData = () => {
      const models = ['NeuralChat-X', 'VisionAI-Pro', 'MultiMind-Fusion']
      const newMetrics: PerformanceMetric[] = []
      
      for (let i = 0; i < 20; i++) {
        const modelIndex = Math.floor(Math.random() * models.length)
        newMetrics.push({
          timestamp: new Date(Date.now() - i * 60000).toISOString(),
          modelId: `model-${modelIndex + 1}`,
          modelName: models[modelIndex],
          accuracy: 85 + Math.random() * 15,
          responseTime: 100 + Math.random() * 500,
          throughput: 50 + Math.random() * 200,
          cpuUsage: 30 + Math.random() * 60,
          memoryUsage: 40 + Math.random() * 50,
          errorRate: Math.random() * 5,
          activeUsers: Math.floor(10 + Math.random() * 100)
        })
      }
      
      setMetrics(newMetrics)
    }

    generateMockData()
    
    if (isRealTime) {
      const interval = setInterval(generateMockData, 5000)
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'warning',
        message: 'ارتفاع استهلاك الذاكرة في نموذج NeuralChat-X',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        modelId: 'model-1',
        modelName: 'NeuralChat-X'
      },
      {
        id: '2',
        type: 'error',
        message: 'انخفاض الدقة في VisionAI-Pro تحت 85%',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        modelId: 'model-2',
        modelName: 'VisionAI-Pro'
      },
      {
        id: '3',
        type: 'success',
        message: 'اكتمل تحسين أداء MultiMind-Fusion بنجاح',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        modelId: 'model-3',
        modelName: 'MultiMind-Fusion'
      }
    ]
    
    setAlerts(mockAlerts)
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'error': return 'border-red-200 bg-red-50'
      case 'success': return 'border-green-200 bg-green-50'
      default: return 'border-gray-200'
    }
  }

  const getMetricColor = (value: number, type: string) => {
    if (type === 'accuracy') {
      return value >= 90 ? 'text-green-600' : value >= 80 ? 'text-yellow-600' : 'text-red-600'
    }
    if (type === 'responseTime') {
      return value <= 200 ? 'text-green-600' : value <= 400 ? 'text-yellow-600' : 'text-red-600'
    }
    if (type === 'errorRate') {
      return value <= 1 ? 'text-green-600' : value <= 3 ? 'text-yellow-600' : 'text-red-600'
    }
    return 'text-gray-600'
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const latestMetrics = metrics.slice(0, 10)
  const avgMetrics = metrics.length > 0 ? {
    accuracy: metrics.reduce((sum, m) => sum + m.accuracy, 0) / metrics.length,
    responseTime: metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length,
    throughput: metrics.reduce((sum, m) => sum + m.throughput, 0) / metrics.length,
    cpuUsage: metrics.reduce((sum, m) => sum + m.cpuUsage, 0) / metrics.length,
    memoryUsage: metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length,
    errorRate: metrics.reduce((sum, m) => sum + m.errorRate, 0) / metrics.length,
    activeUsers: Math.floor(metrics.reduce((sum, m) => sum + m.activeUsers, 0) / metrics.length)
  } : null

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
                <h1 className="text-3xl font-bold text-gray-900">مراقبة أداء جلاجل</h1>
                <p className="text-gray-600 mt-1">مراقبة في الوقت الفعلي لأداء نماذج الذكاء الاصطناعي من جلاجل</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isRealTime ? 'default' : 'outline'}
                onClick={() => setIsRealTime(!isRealTime)}
              >
                <Activity className="w-4 h-4 mr-2" />
                {isRealTime ? 'إيقاف التحديث' : 'بدء التحديث'}
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                تحديث
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                تصدير
              </Button>
            </div>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">الفترة الزمنية:</span>
            {['1h', '24h', '7d', '30d'].map((range) => (
              <Button
                key={range}
                variant={selectedTimeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange(range as any)}
              >
                {range === '1h' ? 'ساعة' : range === '24h' ? '24 ساعة' : range === '7d' ? '7 أيام' : '30 يوم'}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        {avgMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">متوسط الدقة</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className={`text-2xl font-bold ${getMetricColor(avgMetrics.accuracy, 'accuracy')}`}>
                  {avgMetrics.accuracy.toFixed(1)}%
                </div>
                <Progress value={avgMetrics.accuracy} className="h-2 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">متوسط وقت الاستجابة</span>
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <div className={`text-2xl font-bold ${getMetricColor(avgMetrics.responseTime, 'responseTime')}`}>
                  {avgMetrics.responseTime.toFixed(0)}ms
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {avgMetrics.responseTime <= 200 ? 'ممتاز' : avgMetrics.responseTime <= 400 ? 'جيد' : 'يحتاج تحسين'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">معدل الخطأ</span>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div className={`text-2xl font-bold ${getMetricColor(avgMetrics.errorRate, 'errorRate')}`}>
                  {avgMetrics.errorRate.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {avgMetrics.errorRate <= 1 ? 'ممتاز' : avgMetrics.errorRate <= 3 ? 'مقبول' : 'مرتفع'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">المستخدمون النشطون</span>
                  <Users className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {avgMetrics.activeUsers}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  المستخدمون الحاليون
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="realtime" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="realtime">المراقبة الفورية</TabsTrigger>
            <TabsTrigger value="models">أداء النماذج</TabsTrigger>
            <TabsTrigger value="alerts">التنبيهات</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real-time Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    المقاييس الحية
                  </CardTitle>
                  <CardDescription>بيانات الأداء في الوقت الفعلي</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {latestMetrics.slice(0, 5).map((metric, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{metric.modelName}</span>
                          <span className="text-sm text-gray-500">
                            {formatTimestamp(metric.timestamp)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">الدقة:</span>
                            <span className={getMetricColor(metric.accuracy, 'accuracy')}>
                              {metric.accuracy.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">الاستجابة:</span>
                            <span className={getMetricColor(metric.responseTime, 'responseTime')}>
                              {metric.responseTime.toFixed(0)}ms
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">المعالج:</span>
                            <span>{metric.cpuUsage.toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">الذاكرة:</span>
                            <span>{metric.memoryUsage.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    موارد النظام
                  </CardTitle>
                  <CardDescription>استهلاك الموارد الحالي</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">استخدام المعالج</span>
                        <span className="text-sm text-gray-600">
                          {avgMetrics?.cpuUsage.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={avgMetrics?.cpuUsage || 0} className="h-3" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">استخدام الذاكرة</span>
                        <span className="text-sm text-gray-600">
                          {avgMetrics?.memoryUsage.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={avgMetrics?.memoryUsage || 0} className="h-3" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">معدل النقل</span>
                        <span className="text-sm text-gray-600">
                          {avgMetrics?.throughput.toFixed(0)} طلب/دقيقة
                        </span>
                      </div>
                      <Progress value={(avgMetrics?.throughput || 0) / 2.5} className="h-3" />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {avgMetrics?.activeUsers || 0}
                          </div>
                          <div className="text-sm text-gray-600">مستخدم نشط</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {metrics.length}
                          </div>
                          <div className="text-sm text-gray-600">قياسات</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="models">
            <Card>
              <CardHeader>
                <CardTitle>أداء النماذج التفصيلي</CardTitle>
                <CardDescription>تحليل أداء كل نموذج على حدة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['NeuralChat-X', 'VisionAI-Pro', 'MultiMind-Fusion'].map((modelName) => {
                    const modelMetrics = metrics.filter(m => m.modelName === modelName)
                    const modelAvg = modelMetrics.length > 0 ? {
                      accuracy: modelMetrics.reduce((sum, m) => sum + m.accuracy, 0) / modelMetrics.length,
                      responseTime: modelMetrics.reduce((sum, m) => sum + m.responseTime, 0) / modelMetrics.length,
                      errorRate: modelMetrics.reduce((sum, m) => sum + m.errorRate, 0) / modelMetrics.length,
                      throughput: modelMetrics.reduce((sum, m) => sum + m.throughput, 0) / modelMetrics.length
                    } : null

                    return (
                      <div key={modelName} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg">{modelName}</h3>
                          <Badge variant={modelAvg?.errorRate <= 1 ? 'default' : 'destructive'}>
                            {modelAvg?.errorRate <= 1 ? 'سليم' : 'يحتاج انتباه'}
                          </Badge>
                        </div>
                        
                        {modelAvg && (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <div className={`text-xl font-bold ${getMetricColor(modelAvg.accuracy, 'accuracy')}`}>
                                {modelAvg.accuracy.toFixed(1)}%
                              </div>
                              <div className="text-sm text-gray-600">الدقة</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <div className={`text-xl font-bold ${getMetricColor(modelAvg.responseTime, 'responseTime')}`}>
                                {modelAvg.responseTime.toFixed(0)}ms
                              </div>
                              <div className="text-sm text-gray-600">وقت الاستجابة</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <div className={`text-xl font-bold ${getMetricColor(modelAvg.errorRate, 'errorRate')}`}>
                                {modelAvg.errorRate.toFixed(2)}%
                              </div>
                              <div className="text-sm text-gray-600">معدل الخطأ</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <div className="text-xl font-bold text-gray-900">
                                {modelAvg.throughput.toFixed(0)}
                              </div>
                              <div className="text-sm text-gray-600">طلب/دقيقة</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  التنبيهات والإشعارات
                </CardTitle>
                <CardDescription>آخر التنبيهات والإشعارات النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 border rounded-lg ${getAlertColor(alert.type)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.type)}
                          <div>
                            <h4 className="font-semibold">{alert.message}</h4>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                              <span>{alert.modelName}</span>
                              <span>•</span>
                              <span>{formatTimestamp(alert.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>التحليلات المتقدمة</CardTitle>
                <CardDescription>تقارير وتحليلات شاملة للأداء</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">قريباً: لوحة تحليلات متقدمة</p>
                  <p className="text-sm text-gray-500 mt-2">رسوم بيانية تفاعلية وتقارير مفصلة</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}