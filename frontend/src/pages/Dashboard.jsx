import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Scanlines from '../components/Scanlines'
import api from '../api/axios'

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2)
const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return Math.floor(seconds/60) + ' min ago'
  if (seconds < 86400) return Math.floor(seconds/3600) + ' hr ago'
  return Math.floor(seconds/86400) + ' day(s) ago'
}

export default function Dashboard() {
  const [complaints, setComplaints] = useState(() => {
    const stored = localStorage.getItem('cgms_complaints')
    return stored ? JSON.parse(stored) : defaultComplaints()
  })
  const [activities, setActivities] = useState(() => JSON.parse(localStorage.getItem('cgms_activities') || '[]'))
  const [userProfile, setUserProfile] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const navigate = useNavigate()

  // Fetch user profile
  useEffect(() => {
    api.get('/profile/')
      .then(res => setUserProfile(res.data))
      .catch(err => console.error('Error fetching profile:', err))
  }, [])

  const stats = {
    pending: complaints.filter(c => c.status === 'pending').length,
    progress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    total: complaints.length
  }

  const save = (updated, activity) => {
    localStorage.setItem('cgms_complaints', JSON.stringify(updated))
    setComplaints(updated)
    if (activity) {
      const acts = [{ text: activity, time: 'Just now', timestamp: new Date().toISOString() }, ...activities].slice(0, 50)
      localStorage.setItem('cgms_activities', JSON.stringify(acts))
      setActivities(acts)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const openModal = (complaint = null) => {
    setForm(complaint ? { ...complaint } : emptyForm())
    setEditingId(complaint ? complaint.id : null)
    setModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      const updated = complaints.map(c => c.id === editingId ? { ...c, ...form, lastUpdated: new Date().toISOString() } : c)
      save(updated, `Complaint updated: ${form.title}`)
      showToast('Complaint updated successfully')
    } else {
      const newC = { ...form, id: generateId(), status: 'pending', date: new Date().toISOString(), lastUpdated: new Date().toISOString() }
      save([newC, ...complaints], `New complaint: ${form.title}`)
      showToast('Complaint added successfully')
    }
    setModalOpen(false)
  }

  const deleteComplaint = (id) => {
    const c = complaints.find(x => x.id === id)
    if (confirm(`Delete: "${c.title}"?`)) {
      save(complaints.filter(x => x.id !== id), `Deleted: ${c.title}`)
      showToast('Complaint deleted')
    }
  }

  const resolveComplaint = (id) => {
    const c = complaints.find(x => x.id === id)
    if (confirm(`Mark as resolved: "${c.title}"?`)) {
      save(complaints.map(x => x.id === id ? { ...x, status: 'resolved', lastUpdated: new Date().toISOString() } : x), `Resolved: ${c.title}`)
      showToast('Marked as resolved')
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <>
      <Scanlines />
      <Navbar />
      <main className="main-content">
        <section id="homePage" className="page active">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="page-title"><span className="title-accent">{'>'}</span> System Dashboard</h1>
              <p className="page-subtitle">Real-time complaint management & analytics</p>
            </div>

            {/* Profile Avatar with Logout */}
            {userProfile && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }}>
                  {userProfile.avatar ? (
                    <img 
                      src={userProfile.avatar} 
                      alt="Profile"
                      style={{ 
                        width: 50, 
                        height: 50, 
                        borderRadius: '50%', 
                        border: '2px solid #00ccff', 
                        objectFit: 'cover' 
                      }} 
                    />
                  ) : (
                    <div style={{ 
                      width: 50, 
                      height: 50, 
                      borderRadius: '50%', 
                      border: '2px solid #00ccff', 
                      background: '#00ccff', 
                      color: '#0a0a0f', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold', 
                      fontSize: '1.4rem' 
                    }}>
                      {userProfile.first_initial || 'U'}
                    </div>
                  )}
                </div>

                {dropdownOpen && (
                  <div style={{ 
                    position: 'absolute', 
                    right: 0, 
                    top: 60, 
                    background: '#12121a', 
                    border: '1px solid #1e1e28', 
                    borderRadius: '8px', 
                    minWidth: 200, 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)', 
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}>
                    {/* User Info */}
                    <div style={{ 
                      padding: '16px 20px', 
                      borderBottom: '1px solid #1e1e28',
                      background: 'rgba(0,204,255,0.05)'
                    }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#e0e0e8',
                        marginBottom: '4px'
                      }}>
                        {userProfile.name || userProfile.username}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#888899'
                      }}>
                        {userProfile.email}
                      </div>
                    </div>

                    {/* Logout Button */}
                    <button 
                      onClick={handleLogout}
                      style={{ 
                        width: '100%', 
                        textAlign: 'left', 
                        padding: '14px 20px', 
                        background: 'none', 
                        border: 'none', 
                        color: '#ff3366', 
                        cursor: 'pointer', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        transition: 'background 0.2s',
                        fontFamily: 'inherit'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255,51,102,0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="stats-grid">
            {[
              { icon: '◉', cls: 'pending-icon', label: 'Pending', val: stats.pending, trend: '+2 today', trendCls: 'up' },
              { icon: '◐', cls: 'progress-icon', label: 'In Progress', val: stats.progress, trend: 'Active', trendCls: '' },
              { icon: '◎', cls: 'resolved-icon', label: 'Resolved', val: stats.resolved, trend: '-3 this week', trendCls: 'down' },
              { icon: '◈', cls: 'total-icon', label: 'Total', val: stats.total, trend: 'All time', trendCls: '' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                <div className="stat-content">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.val}</div>
                </div>
                <div className={`stat-trend ${s.trendCls}`}>{s.trend}</div>
              </div>
            ))}
          </div>

          <div className="section-container">
            <h2 className="section-title"><span className="title-accent">{'>'}</span> Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn primary" onClick={() => openModal()}>
                <span className="btn-icon">+</span><span>New Complaint</span>
              </button>
              <button className="action-btn secondary" onClick={() => window.location.href='/complaints'}>
                <span className="btn-icon">◈</span><span>View All</span>
              </button>
            </div>
          </div>

          <div className="section-container">
            <h2 className="section-title"><span className="title-accent">{'>'}</span> Recent Activity</h2>
            <div className="activity-feed">
              {activities.length === 0
                ? <div className="activity-item"><div className="activity-dot"></div><div className="activity-content"><div className="activity-text">System initialized</div><div className="activity-time">Just now</div></div></div>
                : activities.slice(0, 5).map((a, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-dot"></div>
                    <div className="activity-content">
                      <div className="activity-text">{a.text}</div>
                      <div className="activity-time">{a.time}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="modal active">
          <div className="modal-overlay" onClick={() => setModalOpen(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Complaint' : 'New Complaint'}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <form className="complaint-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Brief description" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option value="">Select</option>
                    {['technical','administrative','infrastructure','service','safety','other'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority *</label>
                  <select required value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    <option value="">Select</option>
                    {['low','medium','high','critical'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea required rows={5} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Reporter *</label>
                  <input required value={form.reporter} onChange={e => setForm({...form, reporter: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Contact</label>
                <input value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <span className="btn-icon">✓</span>{editingId ? 'Update' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast show success">{toast}</div>}
    </>
  )
}

function emptyForm() {
  return { title: '', category: '', priority: '', description: '', location: '', reporter: '', contact: '' }
}

function defaultComplaints() {
  return [
    { id: generateId(), title: 'Network issues in Lab A', category: 'technical', priority: 'high', status: 'pending', description: 'Internet drops every 10-15 min.', location: 'Lab A', reporter: 'John Smith', contact: 'john@example.com', date: new Date().toISOString(), lastUpdated: new Date().toISOString() },
    { id: generateId(), title: 'AC malfunction', category: 'infrastructure', priority: 'medium', status: 'in-progress', description: 'AC not cooling properly.', location: 'Main Hall', reporter: 'Sarah Johnson', contact: 'sarah@example.com', date: new Date(Date.now()-86400000).toISOString(), lastUpdated: new Date().toISOString() },
  ]
}