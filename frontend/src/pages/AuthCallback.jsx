import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const access = searchParams.get('access')
    const refresh = searchParams.get('refresh')

    console.log('AuthCallback - Access token:', access ? 'EXISTS' : 'MISSING')
    console.log('AuthCallback - Refresh token:', refresh ? 'EXISTS' : 'MISSING')

    if (access && refresh) {
      // Save tokens
      localStorage.setItem('access', access)
      localStorage.setItem('refresh', refresh)
      
      console.log('✅ Tokens saved successfully')
      console.log('Access Token:', localStorage.getItem('access'))
      console.log('Refresh Token:', localStorage.getItem('refresh'))
      
      // Redirect to dashboard
      navigate('/dashboard')
    } else {
      console.log('❌ No tokens found in URL, redirecting to login')
      navigate('/login')
    }
  }, [searchParams, navigate])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      color: '#00ccff',
      fontSize: '20px',
      background: '#0a0a0f'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>🔐</div>
        <div>Authenticating...</div>
        <div style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>
          Processing login credentials
        </div>
      </div>
    </div>
  )
}