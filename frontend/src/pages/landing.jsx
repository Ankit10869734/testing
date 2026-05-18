import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Landing() {
  const { logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [userProfile, setUserProfile] = useState(null)
  const navigate = useNavigate()

  // Check if user is logged in and fetch profile
  useEffect(() => {
    const token = localStorage.getItem('access')
    if (token) {
      api.get('/profile/')
        .then(res => setUserProfile(res.data))
        .catch(err => {
          console.error('Error fetching profile:', err)
          if (err.response?.status === 401) {
            localStorage.clear()
          }
        })
    }
  }, [])

  useEffect(() => {
    const sectionIds = ['home', 'complaints', 'about', 'contact']
    const handleScroll = () => {
      let current = 'home'
      sectionIds.forEach(id => {
        const sec = document.getElementById(id)
        if (sec && window.scrollY >= sec.offsetTop - 100) current = id
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLogout = () => {
    logout()
    localStorage.clear()
    setUserProfile(null)
    setDropdownOpen(false)
    navigate('/')
  }

  const handleDashboard = () => {
    setDropdownOpen(false)
    navigate('/dashboard')
  }

  return (
    <>
      <style>{landingCSS}</style>

      {/* NAV */}
      <nav>
        <div className="nav-logo">
          <div className="logo-hex">C</div>
          <span className="logo-text">CGMS<span className="logo-ver">v3.0</span></span>
        </div>

        <ul className="nav-links">
          {['home','complaints','about','contact'].map(s => (
            <li key={s}>
              <a href={`#${s}`} className={activeSection === s ? 'active' : ''}
                onClick={e => { e.preventDefault(); scrollTo(s) }}>
                {s.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          {userProfile ? (
            /* LOGGED IN - Show Profile Picture */
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }}>
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} alt="Profile"
                    style={{ width: 45, height: 45, borderRadius: '50%', border: '2px solid var(--cyan)', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 45, height: 45, borderRadius: '50%', border: '2px solid var(--cyan)', background: 'var(--cyan)', color: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {userProfile.first_initial}
                  </div>
                )}
              </div>
              {dropdownOpen && (
                <div style={{ position: 'absolute', right: 0, top: 55, background: '#1a1f2e', border: '1px solid rgba(0,200,212,0.3)', borderRadius: 8, minWidth: 200, boxShadow: '0 8px 20px rgba(0,0,0,0.4)', zIndex: 1000, overflow: 'hidden' }}>
                  {/* User Info */}
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,200,212,0.05)' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                      {userProfile.name || userProfile.username}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8899aa' }}>
                      {userProfile.email}
                    </div>
                  </div>
                  
                  {/* Dashboard Button */}
                  <button onClick={handleDashboard}
                    style={{ width: '100%', textAlign: 'left', padding: '12px 20px', background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontSize: 14, borderBottom: '1px solid rgba(255,255,255,0.1)', fontFamily: 'inherit', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(0,200,212,0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}>
                    📊 Dashboard
                  </button>
                  
                  {/* Logout Button */}
                  <button onClick={handleLogout}
                    style={{ width: '100%', textAlign: 'left', padding: '12px 20px', background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,68,68,0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}>
                    🚪 LOGOUT
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* NOT LOGGED IN - Original Design */
            <>
              <Link to="/login" className="btn-nav btn-signin">⇒ SIGN IN</Link>
              <Link to="/login" className="btn-nav btn-register">✦ REGISTER NOW</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section id="home">
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div>
            <div className="hero-tag">COMPLAINT & GRIEVANCE MANAGEMENT SYSTEM</div>
            <h1 className="hero-title">Your Voice.<span>Heard & Resolved.</span></h1>
            <p className="hero-sub">Submit, track, and resolve student complaints in real-time.<br/>Transparent. Fast. Accountable.</p>
            <div className="hero-btns">
              <Link to="/login" className="btn-primary">✦ REGISTER NOW</Link>
              <Link to="/login" className="btn-secondary">⇒ SIGN IN</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="stat-card"><div className="stat-icon orange">🟠</div><div className="stat-info"><div className="stat-label">Pending</div><div className="stat-val">24</div><div className="stat-note">+2 today</div></div></div>
            <div className="stat-card"><div className="stat-icon cyan">◑</div><div className="stat-info"><div className="stat-label">In Progress</div><div className="stat-val">11</div><div className="stat-note c">Active</div></div></div>
            <div className="stat-card"><div className="stat-icon green">✅</div><div className="stat-info"><div className="stat-label">Resolved</div><div className="stat-val">142</div><div className="stat-note g">+3 this week</div></div></div>
          </div>
        </div>
      </section>

      {/* COMPLAINTS SECTION */}
      <section id="complaints">
        <div className="grid-bg"></div>
        <div className="section-inner">
          <div className="section-tag">CATEGORIES</div>
          <h2 className="section-title">Types of Complaints</h2>
          <p className="section-sub">Select a category that best describes your grievance</p>
          <div className="complaints-grid">
            {[
              { icon: '🎓', title: 'Academic Issues', desc: 'Grading disputes, faculty conduct, exam irregularities, and curriculum-related concerns.' },
              { icon: '🏠', title: 'Hostel & Facilities', desc: 'Accommodation problems, maintenance issues, hygiene, and campus infrastructure complaints.' },
              { icon: '🏛️', title: 'Administration', desc: 'Fee-related issues, document processing delays, and administrative procedure complaints.' },
              { icon: '⚠️', title: 'Misconduct & Harassment', desc: 'Reports of bullying, discrimination, ragging, or any form of student or staff misconduct.' },
              { icon: '💻', title: 'IT & Infrastructure', desc: 'Internet access, lab equipment, software access, and technical resource complaints.' },
              { icon: '📋', title: 'Other Grievances', desc: "Any complaint that doesn't fit the above categories — we handle it all." },
            ].map((c, i) => (
              <div key={i} className="comp-card">
                <div className="comp-icon">{c.icon}</div>
                <div className="comp-title">{c.title}</div>
                <div className="comp-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="section-inner">
          <div className="about-grid">
            <div>
              <div className="section-tag">ABOUT CGMS</div>
              <h2 className="section-title">Built for Students,<br/>By Design</h2>
              <p className="about-desc">CGMS v3.0 is a digital grievance redressal platform built to empower students to raise concerns in a structured, transparent, and accountable manner.<br/><br/>Every complaint is tracked in real-time, assigned to the right authority, and resolved within defined timelines — no more unanswered emails or lost paperwork.</p>
              <div className="about-badges">
                {['Real-Time Tracking','Secure & Confidential','Fast Escalation','Multi-Category Support','Analytics Dashboard'].map(b => (
                  <span key={b} className="badge">{b}</span>
                ))}
              </div>
            </div>
            <div className="about-stats">
              {[['500+','Students Registered'],['142','Complaints Resolved'],['96%','Resolution Rate'],['48h','Avg. Response Time']].map(([val, label]) => (
                <div key={label} className="astat">
                  <div className="astat-val">{val}</div>
                  <div className="astat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="grid-bg"></div>
        <div className="section-inner">
          <div className="section-tag">GET IN TOUCH</div>
          <h2 className="section-title">Contact Us</h2>
          <p className="section-sub">Reach out to the CGMS support team for help or queries</p>
          <div className="contact-cards">
            <div className="contact-card"><div className="contact-icon">📧</div><div className="contact-type">EMAIL</div><div className="contact-val">support@cgms.system</div></div>
            <div className="contact-card"><div className="contact-icon">📞</div><div className="contact-type">PHONE</div><div className="contact-val">+91 98765 43210</div></div>
            <div className="contact-card"><div className="contact-icon">🕐</div><div className="contact-type">WORKING HOURS</div><div className="contact-val">Mon – Fri, 9 AM – 5 PM</div></div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo"><span>CGMS</span> v3.0 — Complaint & Grievance Management System</div>
        <div className="footer-note">© 2025 CGMS. All rights reserved.</div>
      </footer>
    </>
  )
}

const landingCSS = `
  :root { --cyan: #00c8d4; --cyan2: #00a8b5; --dark: #1a1f2e; --dark2: #0f1623; --orange: #f6a623; --green: #48bb78; }
  * { margin: 0; padding: 0; box-sizing: border-box; } html { scroll-behavior: smooth; }
  body { font-family: 'Exo 2', sans-serif; background: var(--dark); color: #fff; overflow-x: hidden; }
  nav { background: var(--dark); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 58px; position: fixed; top: 0; left: 0; right: 0; z-index: 100; box-shadow: 0 2px 20px rgba(0,0,0,0.4); border-bottom: 1px solid rgba(255,255,255,0.06); }
  .nav-logo { display: flex; align-items: center; gap: 10px; }
  .logo-hex { width: 32px; height: 32px; background: var(--cyan); clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%); display: flex; align-items: center; justify-content: center; font-family: 'Share Tech Mono',monospace; font-size: 11px; color: var(--dark); font-weight: bold; }
  .logo-text { font-family: 'Share Tech Mono',monospace; color: #fff; font-size: 18px; letter-spacing: 2px; }
  .logo-ver { font-size: 11px; color: var(--cyan); font-family: 'Share Tech Mono',monospace; margin-left: 4px; }
  .nav-links { display: flex; gap: 32px; list-style: none; }
  .nav-links a { color: #aab4c0; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; transition: color 0.2s; position: relative; }
  .nav-links a:hover, .nav-links a.active { color: #fff; }
  .nav-links a.active::after { content: ''; position: absolute; bottom: -8px; left: 0; right: 0; height: 2px; background: var(--cyan); }
  .nav-actions { display: flex; gap: 10px; align-items: center; }
  .btn-nav { display: flex; align-items: center; gap: 6px; padding: 7px 18px; border-radius: 50px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; cursor: pointer; transition: all 0.2s; border: none; font-family: 'Exo 2',sans-serif; text-decoration: none; }
  .btn-signin { background: transparent; border: 1.5px solid rgba(255,255,255,0.25); color: #fff; }
  .btn-signin:hover { border-color: var(--cyan); color: var(--cyan); }
  .btn-register { background: var(--cyan); color: var(--dark); }
  .btn-register:hover { background: var(--cyan2); transform: translateY(-1px); }
  #home { margin-top: 58px; min-height: calc(100vh - 58px); display: flex; align-items: center; position: relative; overflow: hidden; background: linear-gradient(135deg, var(--dark) 0%, #0f1623 60%, #1a2a3a 100%); }
  .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(0,200,212,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,212,0.07) 1px,transparent 1px); background-size: 40px 40px; }
  .hero-glow { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle,rgba(0,200,212,0.15) 0%,transparent 70%); top: 50%; left: 40%; transform: translate(-50%,-50%); pointer-events: none; }
  .hero-content { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 80px 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .hero-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(0,200,212,0.12); border: 1px solid rgba(0,200,212,0.3); color: var(--cyan); font-family: 'Share Tech Mono',monospace; font-size: 11px; letter-spacing: 2px; padding: 6px 14px; border-radius: 3px; margin-bottom: 24px; animation: fadeUp 0.5s ease both; }
  .hero-tag::before { content: '>'; font-size: 13px; }
  .hero-title { font-size: clamp(38px,5vw,60px); font-weight: 900; color: #fff; line-height: 1.05; margin-bottom: 20px; letter-spacing: -1px; animation: fadeUp 0.7s ease both; }
  .hero-title span { color: var(--cyan); display: block; }
  .hero-sub { font-family: 'Share Tech Mono',monospace; font-size: 13px; color: #8899aa; margin-bottom: 36px; line-height: 1.7; animation: fadeUp 0.9s ease both; }
  .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; animation: fadeUp 1.1s ease both; }
  .btn-primary { padding: 14px 32px; background: var(--cyan); color: var(--dark); font-family: 'Exo 2',sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 1px; border: none; border-radius: 4px; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
  .btn-primary:hover { background: var(--cyan2); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,200,212,0.3); }
  .btn-secondary { padding: 14px 32px; background: transparent; color: #fff; font-family: 'Exo 2',sans-serif; font-weight: 600; font-size: 14px; letter-spacing: 1px; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 4px; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
  .btn-secondary:hover { border-color: var(--cyan); color: var(--cyan); }
  .hero-visual { display: flex; flex-direction: column; gap: 14px; }
  .stat-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 18px 22px; display: flex; align-items: center; gap: 16px; backdrop-filter: blur(10px); transition: transform 0.2s,border-color 0.2s; animation: slideIn 0.6s ease both; }
  .stat-card:hover { transform: translateX(6px); border-color: rgba(0,200,212,0.3); }
  .stat-card:nth-child(1) { animation-delay: 0.1s; }
  .stat-card:nth-child(2) { animation-delay: 0.25s; margin-left: 20px; }
  .stat-card:nth-child(3) { animation-delay: 0.4s; margin-left: 40px; }
  .stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justifycontent: center; font-size: 20px; flex-shrink: 0; }
  .stat-icon.orange { background: rgba(246,166,35,0.15); }
  .stat-icon.cyan { background: rgba(0,200,212,0.15); }
  .stat-icon.green { background: rgba(72,187,120,0.15); }
  .stat-info { flex: 1; }
  .stat-label { font-family: 'Share Tech Mono',monospace; font-size: 10px; color: #667788; letter-spacing: 1.5px; text-transform: uppercase; }
  .stat-val { font-size: 22px; font-weight: 700; color: #fff; margin: 2px 0; }
  .stat-note { font-size: 11px; color: var(--orange); font-family: 'Share Tech Mono',monospace; }
  .stat-note.g { color: var(--green); } .stat-note.c { color: var(--cyan); }
  .section-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 2; }
  .section-tag { font-family: 'Share Tech Mono',monospace; color: var(--cyan); font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
  .section-tag::before { content: '>'; }
  .section-title { font-size: 36px; font-weight: 800; color: #fff; margin-bottom: 8px; }
  .section-sub { color: #667788; font-size: 13px; margin-bottom: 50px; font-family: 'Share Tech Mono',monospace; }
  .grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(0,200,212,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,212,0.04) 1px,transparent 1px); background-size: 40px 40px; }
  #complaints { background: var(--dark2); padding: 100px 40px; position: relative; overflow: hidden; }
  .complaints-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  .comp-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 28px 24px; transition: all 0.25s; position: relative; overflow: hidden; }
  .comp-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--cyan); transform: scaleX(0); transform-origin: left; transition: transform 0.3s; }
  .comp-card:hover { transform: translateY(-4px); border-color: rgba(0,200,212,0.25); }
  .comp-card:hover::before { transform: scaleX(1); }
  .comp-icon { font-size: 28px; margin-bottom: 16px; }
  .comp-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 8px; }
  .comp-desc { font-size: 12px; color: #667788; line-height: 1.65; font-family: 'Share Tech Mono',monospace; }
  #about { background: var(--dark); padding: 100px 40px; position: relative; overflow: hidden; }
  #about::after { content: ''; position: absolute; width: 500px; height: 500px; background: radial-gradient(circle,rgba(0,200,212,0.07) 0%,transparent 70%); top: -100px; right: -100px; pointer-events: none; }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .about-desc { font-family: 'Share Tech Mono',monospace; font-size: 13px; color: #8899aa; line-height: 1.9; margin-bottom: 28px; }
  .about-badges { display: flex; flex-wrap: wrap; gap: 10px; }
  .badge { background: rgba(0,200,212,0.1); border: 1px solid rgba(0,200,212,0.25); color: var(--cyan); font-family: 'Share Tech Mono',monospace; font-size: 11px; letter-spacing: 1px; padding: 6px 14px; border-radius: 3px; }
  .about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .astat { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 28px 20px; text-align: center; transition: border-color 0.2s; }
  .astat:hover { border-color: rgba(0,200,212,0.3); }
  .astat-val { font-size: 42px; font-weight: 900; color: var(--cyan); font-family: 'Share Tech Mono',monospace; line-height: 1; margin-bottom: 8px; }
  .astat-label { font-size: 11px; color: #667788; font-family: 'Share Tech Mono',monospace; letter-spacing: 1px; }
  #contact { background: var(--dark2); padding: 100px 40px; position: relative; overflow: hidden; }
  .contact-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  .contact-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 30px 20px; text-align: center; transition: all 0.2s; }
  .contact-card:hover { border-color: rgba(0,200,212,0.35); transform: translateY(-4px); }
  .contact-icon { font-size: 28px; margin-bottom: 12px; }
  .contact-type { font-family: 'Share Tech Mono',monospace; font-size: 11px; color: var(--cyan); letter-spacing: 2px; margin-bottom: 6px; }
  .contact-val { font-size: 13px; color: #aab4c0; }
  footer { background: #0d1117; padding: 28px 40px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); }
  .footer-logo { font-family: 'Share Tech Mono',monospace; color: #667788; font-size: 13px; }
  .footer-logo span { color: var(--cyan); }
  .footer-note { font-family: 'Share Tech Mono',monospace; font-size: 11px; color: #445566; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
  @media (max-width: 900px) { .hero-content,.about-grid { grid-template-columns: 1fr; gap: 40px; } .complaints-grid { grid-template-columns: 1fr 1fr; } .contact-cards { grid-template-columns: 1fr; } }
  @media (max-width: 600px) { nav { padding: 0 16px; } .nav-links { display: none; } .complaints-grid { grid-template-columns: 1fr; } #home,#complaints,#about,#contact { padding-left: 20px; padding-right: 20px; } }
`