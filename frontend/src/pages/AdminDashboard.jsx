import { useEffect, useState } from "react";
import "../admin.css";
import { adminAPI } from '../api/adminAPI';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_complaints: 0,
    pending: 0,
    critical_pending: 0,
    in_progress: 0,
    resolved: 0
  });

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Load stats
    adminAPI.getStats()
      .then(res => setStats(res.data))
      .catch(err => console.error('Error loading stats:', err));

    // Load activity
    adminAPI.getActivity()
      .then(res => setActivities(res.data))
      .catch(err => console.error('Error loading activity:', err));
  }, []);

  const getIcon = (priority) => {
    if (priority === 'critical') return '🚨';
    if (priority === 'high') return '⚠️';
    return '📋';
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className="admin-root">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-hex">C</div>
          <div>
            <div className="logo-text">CGMS</div>
            <div className="logo-sub">ADMIN PANEL</div>
          </div>
        </div>

        <nav className="sidebar-nav">
  <div className="nav-section">Overview</div>

  <div className="nav-item active">
    Dashboard
  </div>

  <div className="nav-section">Complaints</div>

  <div className="nav-item" onClick={() => window.location.href = '/admin/complaints'}>
    All Complaints
    <span className="nav-badge">{stats.total_complaints}</span>
  </div>

  <div className="nav-item" onClick={() => window.location.href = '/admin/complaints'}>
    Pending Review
    <span className="nav-badge warn">{stats.pending}</span>
  </div>

  <div className="nav-section">System</div>

  <div
    className="nav-item"
    style={{ color: "#ff3366" }}
    onClick={() => {
      localStorage.clear();
      window.location.href = "/login";
    }}
  >
    Logout
  </div>
</nav>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="admin-avatar">SA</div>
            <div>
              <div className="admin-name">Super Admin</div>
              <div className="admin-role">SYSTEM ADMIN</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">

        {/* Topbar */}
        <header className="topbar">
          <div>
            <div className="topbar-title">Dashboard</div>
            <div className="topbar-crumb">CGMS Admin / Overview</div>
          </div>

          <div>
            <div className="status-chip">
              <div className="status-dot"></div>
              SYSTEM ONLINE
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="content">

          {stats.critical_pending > 0 && (
            <div className="notif-banner">
              ⚡ {stats.critical_pending} complaints flagged as CRITICAL require immediate attention.
            </div>
          )}

          {/* KPI Grid */}
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

          {/* Recent Activity Panel */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Recent Activity</div>
            </div>

            <div className="activity-list">
              {activities.length === 0 ? (
                <div className="activity-item">
                  <div className="activity-body" style={{ textAlign: 'center', color: '#888' }}>
                    No recent activity
                  </div>
                </div>
              ) : (
                activities.map(act => (
                  <div key={act.id} className="activity-item">
                    <div className="activity-dot">{getIcon(act.priority)}</div>
                    <div className="activity-body">
                      {act.title} by {act.user}
                      <div className="activity-time">{getTimeAgo(act.created_at)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}