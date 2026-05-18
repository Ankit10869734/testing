import { useEffect, useState } from "react";
import "../admin.css";
import { adminAPI } from '../api/adminAPI';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_complaints: 0, pending: 0 });

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Load stats for sidebar badges
    adminAPI.getStats()
      .then(res => setStats(res.data))
      .catch(err => console.error('Error loading stats:', err));

    // Load complaints
    adminAPI.getComplaints()
      .then(res => {
        setComplaints(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading complaints:', err);
        setLoading(false);
      });
  }, []);

  const updateStatus = (id, newStatus) => {
    adminAPI.updateStatus(id, newStatus)
      .then(() => {
        alert('Status updated successfully!');
        window.location.reload();
      })
      .catch(err => {
        alert('Failed to update status');
        console.error('Error:', err);
      });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return '#ff3366';
      case 'high': return '#ff9933';
      case 'medium': return '#ffcc00';
      case 'low': return '#00cc99';
      default: return '#00ccff';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return '#00ff88';
      case 'in_progress': return '#ffcc00';
      case 'pending': return '#ff9933';
      case 'rejected': return '#ff3366';
      default: return '#00ccff';
    }
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

          <div className="nav-item" onClick={() => window.location.href = '/admin'}>
            Dashboard
          </div>

          <div className="nav-section">Complaints</div>

          <div className="nav-item active">
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
            <div className="topbar-title">Complaints Management</div>
            <div className="topbar-crumb">CGMS Admin / Complaints</div>
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

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#00ccff', fontSize: '18px' }}>
              Loading complaints...
            </div>
          ) : (
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">
                  All Complaints ({complaints.length})
                </div>
              </div>

              {complaints.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#888', fontSize: '16px' }}>
                  No complaints found
                </div>
              ) : (
                <div style={{ overflowX: 'auto', padding: '20px' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px'
                  }}>
                    <thead>
                      <tr style={{
                        borderBottom: '2px solid #1e1e28',
                        textAlign: 'left',
                        color: '#00ccff'
                      }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th style={{ padding: '12px' }}>Title</th>
                        <th style={{ padding: '12px' }}>User</th>
                        <th style={{ padding: '12px' }}>Category</th>
                        <th style={{ padding: '12px' }}>Priority</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px' }}>Created</th>
                        <th style={{ padding: '12px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map(c => (
                        <tr
                          key={c.id}
                          style={{
                            borderBottom: '1px solid #16161f',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,204,255,0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px', color: '#00ccff' }}>
                            #{c.id}
                          </td>
                          <td style={{ padding: '12px', maxWidth: '250px' }}>
                            <div style={{ fontWeight: '500', color: '#e0e0e8' }}>{c.title}</div>
                            <div style={{
                              fontSize: '12px',
                              color: '#888899',
                              marginTop: '4px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {c.description}
                            </div>
                          </td>
                          <td style={{ padding: '12px', color: '#e0e0e8' }}>
                            <div>{c.user}</div>
                            <div style={{ fontSize: '11px', color: '#888899' }}>
                              {c.user_email}
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              background: 'rgba(0,204,255,0.15)',
                              color: '#00ccff',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              {c.category}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              background: `${getPriorityColor(c.priority)}33`,
                              color: getPriorityColor(c.priority),
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600',
                              textTransform: 'uppercase'
                            }}>
                              {c.priority}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              background: `${getStatusColor(c.status)}33`,
                              color: getStatusColor(c.status),
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '500'
                            }}>
                              {c.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '12px', fontSize: '12px', color: '#888899' }}>
                            {new Date(c.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                            <br />
                            {new Date(c.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <select
                              value={c.status}
                              onChange={(e) => updateStatus(c.id, e.target.value)}
                              style={{
                                background: '#12121a',
                                color: '#e0e0e8',
                                border: '1px solid #1e1e28',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>

      </main>

    </div>
  );
}