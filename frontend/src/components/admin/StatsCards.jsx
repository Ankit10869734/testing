import { useEffect, useState } from 'react'
import { adminAPI } from '../../api/adminAPI'

export default function StatsCards() {
  const [stats, setStats] = useState({
    total_complaints: 0,
    critical_pending: 0,
    in_progress: 0,
    resolved: 0
  })

  useEffect(() => {
    adminAPI.getStats()
      .then(res => setStats(res.data))
      .catch(err => console.error('Error fetching stats:', err))
  }, [])

  return (
    <div className="kpi-grid">
      <div className="kpi-card cyan">
        <div className="kpi-label">Total Complaints</div>
        <div className="kpi-value">{stats.total_complaints}</div>
      </div>

      <div className="kpi-card red">
        <div className="kpi-label">Critical Pending</div>
        <div className="kpi-value">{stats.critical_pending}</div>
      </div>

      <div className="kpi-card orange">
        <div className="kpi-label">In Progress</div>
        <div className="kpi-value">{stats.in_progress}</div>
      </div>

      <div className="kpi-card green">
        <div className="kpi-label">Resolved</div>
        <div className="kpi-value">{stats.resolved}</div>
      </div>
    </div>
  )
}