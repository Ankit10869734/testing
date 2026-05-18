import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Scanlines from '../components/Scanlines'
import { complaintsAPI } from '../api/complaintsAPI'

const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }

export default function Complaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('grid')
  const [filter, setFilter] = useState({ status: 'all', priority: 'all', search: '', sort: 'date-desc' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [toast, setToast] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    loadComplaints()
  }, [])

  const loadComplaints = () => {
    setLoading(true)
    complaintsAPI.getMy()
      .then(res => {
        setComplaints(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading complaints:', err)
        setLoading(false)
        showToast('Failed to load complaints')
      })
  }

  const filtered = complaints
    .filter(c => {
      if (filter.status !== 'all' && c.status !== filter.status) return false
      if (filter.priority !== 'all' && c.priority !== filter.priority) return false
      if (filter.search && !`${c.title} ${c.description} ${c.category}`.toLowerCase().includes(filter.search)) return false
      return true
    })
    .sort((a, b) => {
      if (filter.sort === 'date-asc') return new Date(a.created_at) - new Date(b.created_at)
      if (filter.sort === 'priority') return priorityOrder[b.priority] - priorityOrder[a.priority]
      return new Date(b.created_at) - new Date(a.created_at)
    })

  const openModal = (complaint = null) => {
    setForm(complaint ? { 
      title: complaint.title,
      category: complaint.category,
      priority: complaint.priority,
      description: complaint.description
    } : emptyForm())
    setEditingId(complaint?.id || null)
    setModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingId) {
      complaintsAPI.update(editingId, form)
        .then(() => {
          showToast('Updated successfully')
          loadComplaints()
          setModalOpen(false)
        })
        .catch(err => {
          console.error('Error updating:', err)
          showToast('Failed to update complaint')
        })
    } else {
      complaintsAPI.submit(form)
        .then(() => {
          showToast('Complaint submitted successfully')
          loadComplaints()
          setModalOpen(false)
        })
        .catch(err => {
          console.error('Error submitting:', err)
          showToast('Failed to submit complaint')
        })
    }
  }

  const deleteC = (id) => {
    const c = complaints.find(x => x.id === id)
    if (confirm(`Delete "${c.title}"?`)) {
      complaintsAPI.delete(id)
        .then(() => {
          showToast('Deleted successfully')
          loadComplaints()
        })
        .catch(err => {
          console.error('Error deleting:', err)
          showToast(err.response?.data?.error || 'Failed to delete')
        })
    }
  }

  const exportCSV = () => {
    const headers = ['ID','Title','Category','Priority','Status','Description','Date']
    const rows = complaints.map(c => [c.id,c.title,c.category,c.priority,c.status,c.description,new Date(c.created_at).toLocaleString()])
    const csv = [headers,...rows].map(r => r.map(f => `"${String(f).replace(/"/g,'""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}))
    a.download = `CGMS_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    showToast('Exported successfully')
  }

  if (loading) {
    return (
      <>
        <Scanlines />
        <Navbar />
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '100px', color: '#00ccff', fontSize: '20px' }}>
            Loading complaints...
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Scanlines />
      <Navbar />
      <main className="main-content">
        <section id="complaintsPage" className="page active">
          <div className="page-header">
            <h1 className="page-title"><span className="title-accent">{'>'}</span> My Complaints</h1>
            <p className="page-subtitle">Track and manage your submitted complaints</p>
          </div>

          <div className="toolbar">
            <div className="toolbar-left">
              <button className="btn btn-primary" onClick={() => openModal()}>
                <span className="btn-icon">+</span> New Complaint
              </button>
              <div className="view-toggle">
                <button className={`view-btn ${view==='grid'?'active':''}`} onClick={() => setView('grid')}>⊞</button>
                <button className={`view-btn ${view==='list'?'active':''}`} onClick={() => setView('list')}>☰</button>
              </div>
            </div>
            <div className="toolbar-right">
              <div className="search-box">
                <input className="search-input" placeholder="Search complaints..." value={filter.search}
                  onChange={e => setFilter({...filter, search: e.target.value.toLowerCase()})} />
                <span className="search-icon">⌕</span>
              </div>
              <select className="filter-select" value={filter.status} onChange={e => setFilter({...filter, status: e.target.value})}>
                <option value="all">All Status</option>
                {['pending','in_progress','resolved','rejected'].map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
              </select>
              <select className="filter-select" value={filter.priority} onChange={e => setFilter({...filter, priority: e.target.value})}>
                <option value="all">All Priority</option>
                {['low','medium','high','critical'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <select className="filter-select" value={filter.sort} onChange={e => setFilter({...filter, sort: e.target.value})}>
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="priority">Priority</option>
              </select>
              <button className="btn btn-secondary" onClick={exportCSV}>↓ Export</button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state show">
              <div className="empty-icon">◈</div>
              <h3>No Complaints Found</h3>
              <p>Submit your first complaint or adjust filters.</p>
              <button className="btn btn-primary" onClick={() => openModal()}>+ New Complaint</button>
            </div>
          ) : (
            <div className={view === 'list' ? 'complaints-grid list-view' : 'complaints-grid'}>
              {filtered.map(c => (
                <div key={c.id} className="complaint-card">
                  <div className="complaint-header">
                    <div className="complaint-id">ID: #{c.id}</div>
                    <div className="complaint-badges">
                      <span className={`badge badge-priority ${c.priority}`}>{c.priority}</span>
                      <span className={`badge badge-status ${c.status}`}>{c.status.replace('_',' ')}</span>
                    </div>
                  </div>
                  <h3 className="complaint-title">{c.title}</h3>
                  <div className="complaint-category">{c.category}</div>
                  <p className="complaint-description">{c.description}</p>
                  <div className="complaint-meta">
                    <div className="complaint-meta-item">
                      <span className="meta-label">Submitted</span>
                      <span className="meta-value">{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="complaint-meta-item">
                      <span className="meta-label">Last Updated</span>
                      <span className="meta-value">{new Date(c.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="complaint-actions">
                    {c.status === 'pending' && (
                      <>
                        <button className="action-icon-btn edit" onClick={() => openModal(c)} title="Edit">✎</button>
                        <button className="action-icon-btn delete" onClick={() => deleteC(c.id)} title="Delete">×</button>
                      </>
                    )}
                    {c.status !== 'pending' && (
                      <div style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
                        {c.status === 'in_progress' && '🔄 Being processed by admin'}
                        {c.status === 'resolved' && '✓ Resolved'}
                        {c.status === 'rejected' && '⚠ Rejected'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

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
                <input required value={form.title} onChange={e => setForm({...form,title:e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select required value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
                    <option value="">Select</option>
                    {['Maintenance','IT','Discipline','Infrastructure','Safety','Other'].map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority *</label>
                  <select required value={form.priority} onChange={e => setForm({...form,priority:e.target.value})}>
                    <option value="">Select</option>
                    {['low','medium','high','critical'].map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea required rows={5} value={form.description} onChange={e => setForm({...form,description:e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <span className="btn-icon">✓</span>{editingId?'Update':'Submit'}
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
  return { title:'', category:'', priority:'medium', description:'' }
}