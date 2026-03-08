export interface AIModelData {
  id: string
  slug: string
  name: string
  type: 'language' | 'vision' | 'multimodal'
  status: 'active' | 'training' | 'inactive'
  accuracy: number
  performance: number
  customization: number
  openSource: boolean
  description: string
  version: string
  capabilities: string[]
  languages: string[]
  maxTokens: number
  createdAt: string
  updatedAt: string
}

export interface ModelMetricData {
  id: string
  modelId: string
  modelName?: string
  accuracy: number
  responseTime: number
  throughput: number
  cpuUsage: number
  memoryUsage: number
  errorRate: number
  activeUsers: number
  createdAt: string
}

export interface AlertData {
  id: string
  type: 'warning' | 'error' | 'success'
  message: string
  modelId: string
  modelName?: string
  resolved: boolean
  createdAt: string
}

export interface ApiKeyData {
  id: string
  name: string
  key: string
  active: boolean
  createdAt: string
}

export interface WebhookData {
  id: string
  url: string
  events: string[]
  active: boolean
  createdAt: string
}

export interface DashboardStats {
  activeModels: number
  totalModels: number
  avgAccuracy: number
  totalUsageLogs: number
  activeAlerts: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp?: string
}
