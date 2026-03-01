'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { AIModelData, ModelMetricData, AlertData } from '@/lib/types'
import {
  BarChart3,
  TrendingUp,
  Activity,
  Cpu,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Settings,
  RefreshCw,
  Download,
} from 'lucide-react'

interface PerformanceMonitoringProps {
  models: AIModelData[]
}

export default function PerformanceMonitoring({ models }: PerformanceMonitoringProps) {
  const [metrics, setMetrics] = useState<ModelMetricData[]>([])
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [isRealTime, setIsRealTime] = useState(true)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [metricsRes, alertsRes] = await Promise.all([
        fetch('/api/models?metrics=all'),
        fetch('/api/alerts?resolved=false'),
      ])

      if (metricsRes.ok) {
        const metricsJson = await metricsRes.json()
        if (metricsJson.success) setMetrics(metricsJson.data)
      }
      if (alertsRes.ok) {
        const alertsJson = await alertsRes.json()
        if (alertsJson.success) setAlerts(alertsJson.data)
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()

    if (isRealTime) {
      const interval = setInterval(fetchData, 10000)
      return () => clearInterval(interval)
    }
  }, [isRealTime, fetchData])

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
    if (type === 'accuracy') return value >= 90 ? 'text-green-600' : value >= 80 ? 'text-yellow-600' : 'text-red-600'
    if (type === 'responseTime') return value <= 200 ? 'text-green-600' : value <= 400 ? 'text-yellow-600' : 'text-red-600'
    if (type === 'errorRate') return value <= 1 ? 'text-green-600' : value <= 3 ? 'text-yellow-600' : 'text-red-600'
    return 'text-gray-600'
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const handleResolveAlert = async (alertId: string) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve', alertId }),
      })
      if (res.ok) {
        setAlerts(prev => prev.filter(a => a.id !== alertId))
      }
    } catch {
      // Silently fail
    }
  }

  const latestMetrics = metrics.slice(0, 10)
  const avgMetrics = metrics.length > 0 ? {
    accuracy: metrics.reduce((sum, m) => sum + m.accuracy, 0) / metrics.length,
    responseTime: metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length,
    throughput: metrics.reduce((sum, m) => sum + m.throughput, 0) / metrics.length,
    cpuUsage: metrics.reduce((sum, m) => sum + m.cpuUsage, 0) / metrics.length,
    memoryUsage: metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length,
    errorRate: metrics.reduce((sum, m) => sum + m.errorRate, 0) / metrics.length,
    activeUsers: Math.floor(metrics.reduce((sum, m) => sum + m.activeUsers, 0) / metrics.length),
  } : null

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-gray-400" />
          <p className="text-gray-500">جارٍ تحميل بيانات الأداء...</p>
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
            <h2 className="text-2xl font-bold text-gray-900">مراقبة الأداء</h2>
            <p className="text-gray-600 mt-1">
              {metrics.length > 0
                ? `${metrics.length} قياس من قاعدة البيانات`
                : 'لا توجد بيانات أداء بعد'}
            </p>
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
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">الفترة الزمنية:</span>
        {(['1h', '24h', '7d', '30d'] as const).map((range) => (
          <Button
            key={range}
            variant={selectedTimeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange(range)}
          >
            {range === '1h' ? 'ساعة' : range === '24h' ? '24 ساعة' : range === '7d' ? '7 أيام' : '30 يوم'}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      {avgMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="realtime" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="realtime">المراقبة الفورية</TabsTrigger>
          <TabsTrigger value="models">أداء النماذج</TabsTrigger>
          <TabsTrigger value="alerts">التنبيهات ({alerts.length})</TabsTrigger>
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
                <CardDescription>بيانات الأداء من قاعدة البيانات</CardDescription>
              </CardHeader>
              <CardContent>
                {latestMetrics.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>لا توجد قياسات بعد</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {latestMetrics.slice(0, 5).map((metric) => (
                      <div key={metric.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{metric.modelName}</span>
                          <span className="text-sm text-gray-500">
                            {formatTimestamp(metric.createdAt)}
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
                )}
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
                {avgMetrics ? (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">استخدام المعالج</span>
                        <span className="text-sm text-gray-600">{avgMetrics.cpuUsage.toFixed(0)}%</span>
                      </div>
                      <Progress value={avgMetrics.cpuUsage} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">استخدام الذاكرة</span>
                        <span className="text-sm text-gray-600">{avgMetrics.memoryUsage.toFixed(0)}%</span>
                      </div>
                      <Progress value={avgMetrics.memoryUsage} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">معدل النقل</span>
                        <span className="text-sm text-gray-600">{avgMetrics.throughput.toFixed(0)} طلب/دقيقة</span>
                      </div>
                      <Progress value={(avgMetrics.throughput) / 2.5} className="h-3" />
                    </div>

                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">{avgMetrics.activeUsers}</div>
                          <div className="text-sm text-gray-600">مستخدم نشط</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{metrics.length}</div>
                          <div className="text-sm text-gray-600">قياسات</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Cpu className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>لا توجد بيانات موارد</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>أداء النماذج التفصيلي</CardTitle>
              <CardDescription>تحليل أداء كل نموذج من قاعدة البيانات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.map((model) => {
                  const modelMetrics = metrics.filter(m => m.modelId === model.id)
                  const modelAvg = modelMetrics.length > 0 ? {
                    accuracy: modelMetrics.reduce((sum, m) => sum + m.accuracy, 0) / modelMetrics.length,
                    responseTime: modelMetrics.reduce((sum, m) => sum + m.responseTime, 0) / modelMetrics.length,
                    errorRate: modelMetrics.reduce((sum, m) => sum + m.errorRate, 0) / modelMetrics.length,
                    throughput: modelMetrics.reduce((sum, m) => sum + m.throughput, 0) / modelMetrics.length,
                  } : null

                  return (
                    <div key={model.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{model.name}</h3>
                        <Badge variant={modelAvg && modelAvg.errorRate <= 1 ? 'default' : 'destructive'}>
                          {modelAvg && modelAvg.errorRate <= 1 ? 'سليم' : 'يحتاج انتباه'}
                        </Badge>
                      </div>

                      {modelAvg ? (
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
                      ) : (
                        <p className="text-sm text-gray-500">لا توجد قياسات لهذا النموذج</p>
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
                التنبيهات النشطة
              </CardTitle>
              <CardDescription>التنبيهات من قاعدة البيانات</CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>لا توجد تنبيهات نشطة</p>
                </div>
              ) : (
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
                              <span>&middot;</span>
                              <span>{formatTimestamp(alert.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          حل
                        </Button>
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
  )
}
