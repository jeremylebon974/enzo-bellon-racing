'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }
    router.push('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#141414', border: '1px solid rgba(255,90,0,0.2)', padding: '40px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#FF3300,#FF5A00)' }} />
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px', fontFamily: 'sans-serif' }}>ADMIN</h1>
        <p style={{ color: '#FF5A00', fontSize: '12px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '32px', fontFamily: 'sans-serif' }}>Enzo Bellon Racing</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'sans-serif' }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'sans-serif' }}
          />
          {error && <p style={{ color: '#FF5A00', fontSize: '12px', margin: 0, fontFamily: 'sans-serif' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '14px', background: 'linear-gradient(135deg,#FF3300,#FF5A00)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'sans-serif' }}
          >
            {loading ? 'Connexion...' : 'Accéder au dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
