import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError(null)
    if (!email || !password) return setError('Please enter email and password')
    setLoading(true)
    try {
      const res = await login(email, password)
      localStorage.setItem('token', res.token)
      if (res.user) localStorage.setItem('user', JSON.stringify(res.user))
      window.dispatchEvent(new Event('authChange'))
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div style={{maxWidth:420,margin:'36px auto'}}>
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={submit} className="login-form">
          {error && <div className="toast error">{error}</div>}
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
          <div style={{display:'flex',gap:8}}>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            <Link to="/register" style={{alignSelf:'center',color:'var(--accent)'}}>Register</Link>
          </div>
        </form>
        <div style={{marginTop:10,color:'var(--muted)'}}>Don't have an account? <Link to="/register">Register</Link></div>
      </div>
    </div>
  )
}
