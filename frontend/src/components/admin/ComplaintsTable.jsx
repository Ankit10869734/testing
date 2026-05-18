import { useEffect, useState } from 'react'
import { adminAPI } from '../../api/adminAPI'

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getComplaints()
      .then(res => {
        console.log('✅ Got complaints:', res.data)
        setComplaints(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('❌ Error:', err)
        setLoading(false)
      })
  }, [])

  const updateStatus = (id, newStatus) => {
    adminAPI.updateStatus(id, newStatus)
      .then(() => {
        alert('Updated!')
        window.location.reload()
      })
      .catch(err => alert('Error: ' + err.message))
  }

  if (loading) {
    return <div style={{ color: 'white', padding: '50px', fontSize: '24px' }}>Loading...</div>
  }

  return (
    <div style={{ 
      padding: '20px', 
      color: 'white',
      background: '#1a1a1a',
      margin: '20px',
      borderRadius: '10px',
      minHeight: '500px'
    }}>
      
      <h2 style={{ color: '#00ccff', marginBottom: '20px', fontSize: '24px' }}>
        All Complaints ({complaints.length})
      </h2>

      {complaints.length === 0 ? (
        <p style={{ color: '#888', fontSize: '18px' }}>No complaints found</p>
      ) : (
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          background: '#222',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <thead>
            <tr style={{ background: '#2a2a2a' }}>
              <th style={{ padding: '15px', textAlign: 'left', color: '#00ccff', borderBottom: '2px solid #333' }}>ID</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#00ccff', borderBottom: '2px solid #333' }}>Title</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#00ccff', borderBottom: '2px solid #333' }}>User</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#00ccff', borderBottom: '2px solid #333' }}>Category</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#00ccff', borderBottom: '2px solid #333' }}>Priority</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#00ccff', borderBottom: '2px solid #333' }}>Status</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#00ccff', borderBottom: '2px solid #333' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                <td style={{ padding: '15px', color: '#00ccff' }}>#{c.id}</td>
                <td style={{ padding: '15px', color: 'white' }}>
                  <div style={{ fontWeight: 'bold' }}>{c.title}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>{c.description}</div>
                </td>
                <td style={{ padding: '15px', color: 'white' }}>{c.user}</td>
                <td style={{ padding: '15px', color: 'white' }}>{c.category}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    background: c.priority === 'critical' ? '#ff3366' : c.priority === 'high' ? '#ff9933' : '#ffcc00',
                    color: 'black',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {c.priority}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    background: c.status === 'resolved' ? '#00ff88' : c.status === 'in_progress' ? '#ffcc00' : '#ff9933',
                    color: 'black',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c.id, e.target.value)}
                    style={{
                      background: '#333',
                      color: 'white',
                      border: '1px solid #555',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px'
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
      )}
    </div>
  )
}