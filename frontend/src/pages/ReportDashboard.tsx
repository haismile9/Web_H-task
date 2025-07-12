import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

import { useEffect, useState } from 'react'
import API from '../api/axios'

export default function ReportDashboard() {
  const [projectCount, setProjectCount] = useState(0)
  const [taskStats, setTaskStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    done: 0,
  })
  const [error, setError] = useState('')

  const fetchStats = async () => {
    try {
      const [projectRes, taskRes] = await Promise.all([
        API.get('/projects/count'),
        API.get('/tasks/count'),
      ])
      setProjectCount(projectRes.data.count)
      setTaskStats(taskRes.data)
    } catch {
      setError('Không thể tải báo cáo thống kê')
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (error) return <p className="p-6 text-red-500">{error}</p>

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">📊 Báo cáo tổng quan</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Tổng dự án</p>
          <p className="text-2xl font-bold">{projectCount}</p>
        </div>

        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Tổng công việc</p>
          <p className="text-2xl font-bold">{taskStats.total}</p>
        </div>

        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-yellow-600">🕒 Đang chờ</p>
          <p className="text-xl">{taskStats.pending}</p>
        </div>

        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-blue-600">⚙️ Đang làm</p>
          <p className="text-xl">{taskStats.in_progress}</p>
        </div>

        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-green-600">✅ Hoàn thành</p>
          <p className="text-xl">{taskStats.done}</p>
        </div>
      </div>
    </div>
          
  )
  
}
