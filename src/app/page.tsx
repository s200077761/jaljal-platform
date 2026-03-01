import { getAllModels, getDashboardStats } from '@/lib/models'
import Dashboard from '@/components/Dashboard'
import type { AIModelData, DashboardStats } from '@/lib/types'

export default async function Home() {
  let models: AIModelData[] = []
  let stats: DashboardStats = { activeModels: 0, totalModels: 0, avgAccuracy: 0, totalUsageLogs: 0, activeAlerts: 0 }

  try {
    ;[models, stats] = await Promise.all([
      getAllModels(),
      getDashboardStats(),
    ])
  } catch {
    // Database not ready yet — show empty state
  }

  return <Dashboard initialModels={models} initialStats={stats} />
}
