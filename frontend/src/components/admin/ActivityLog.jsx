import { useEffect, useState } from 'react'
import { adminAPI } from '../../api/adminAPI'

export default function ActivityLog() {
  const [activities, setActivities] = useState([])

  useEffect(() => {
    adminAPI.getActivity()
      .then(res => setActivities(res.data))
      .catch(err => console.error('Error loading activity:', err))
  }, [])

  const getIcon = (priority) => {
    if (priority === 'critical') return '🚨'
    if (priority === 'high') return '⚠️'
    return '📋'
  }

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return `${seconds} seconds ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`
    return `${Math.floor(hours / 24)} days ago`
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Recent Activity</div>
      </div>

      <div className="activity-list">
        {activities.map(act => (
          <div key={act.id} className="activity-item">
            <div className="activity-dot">{getIcon(act.priority)}</div>
            <div className="activity-body">
              {act.title} by {act.user}
              <div className="activity-time">{getTimeAgo(act.created_at)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}