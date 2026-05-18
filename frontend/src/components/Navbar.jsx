import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'

export default function Navbar() {
  const { user, accessToken, logout, toggleTheme, theme } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Check if user is on dashboard/complaints pages
  const isOnDashboard = location.pathname === '/dashboard' || location.pathname === '/complaints'
  const isOnLanding = location.pathname === '/'

  // Fetch user profile if logged in
  useEffect(() => {
    if (accessToken) {
      api.get('/profile/')
        .then(res => setUserProfile(res.data))
        .catch(err => console.error('Error fetching profile:', err))
    }
  }, [accessToken])

  const handleLogout = () => {
    logout()
    localStorage.clear()
    setDropdownOpen(false)
    navigate('/')
  }

  const handleDashboard = () => {
    setDropdownOpen(false)
    navigate('/dashboard')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-icon">⬢</span>
          <span className="brand-text">CGMS</span>
          <span className="brand-subtitle">v3.0</span>
        </div>

        <ul className="nav-menu">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/complaints" className="nav-link">Complaints</Link></li>
          <li><a href="/#about" className="nav-link">About</a></li>
          <li><a href="/#contact" className="nav-link">Contact</a></li>
        </ul>

        <div className="nav-actions">
          {accessToken && userProfile ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }}>
                {userProfile.avatar ? (
                  <img 
                    src={userProfile.avatar} 
                    alt="Profile"
                    style={{ 
                      width: 45, 
                      height: 45, 
                      borderRadius: '50%', 
                      border: '2px solid #00ccff', 
                      objectFit: 'cover' 
                    }} 
                  />
                ) : (
                  <div style={{ 
                    width: 45, 
                    height: 45, 
                    borderRadius: '50%', 
                    border: '2px solid #00ccff', 
                    background: '#00ccff', 
                    color: '#0a0a0f', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 'bold', 
                    fontSize: '1.2rem' 
                  }}>
                    {userProfile.first_initial || 'U'}
                  </div>
                )}
              </div>

              {dropdownOpen && (
                <div style={{ 
                  position: 'absolute', 
                  right: 0, 
                  top: 55, 
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

                  {/* Show Dashboard button if on landing page */}
                  {isOnLanding && (
                    <button 
                      onClick={handleDashboard}
                      style={{ 
                        width: '100%', 
                        textAlign: 'left', 
                        padding: '14px 20px', 
                        background: 'none', 
                        border: 'none', 
                        color: '#00ccff', 
                        cursor: 'pointer', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        borderBottom: '1px solid #1e1e28',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(0,204,255,0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      📊 Dashboard
                    </button>
                  )}

                  {/* Always show Logout */}
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
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,51,102,0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btn-container">
              <Link to="/login" className="auth-btn login-btn" data-tooltip="LOG IN">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
                </svg>
              </Link>
            </div>
          )}

          <button className="theme-toggle" onClick={toggleTheme} style={{ width: 45, height: 45 }}>
            <span className="theme-icon">{theme === 'dark' ? '◑' : '◐'}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}