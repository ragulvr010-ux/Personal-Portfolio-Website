import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError(null)
    if (!name || !email || !password) return setError('Please fill all fields')
    if (password !== confirm) return setError('Passwords do not match')
    setLoading(true)
    try {
      const res = await register(name, email, password)
      localStorage.setItem('token', res.token)
      if (res.user) localStorage.setItem('user', JSON.stringify(res.user))
      window.dispatchEvent(new Event('authChange'))
      navigate('/')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{maxWidth:520,margin:'36px auto'}}>
      <div className="login-card">
        <h2>Create an account</h2>
        <form onSubmit={submit} className="login-form">
          {error && <div className="toast error">{error}</div>}
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm password" />
          <div style={{display:'flex',gap:8}}>
            <button className="btn" type="submit" disabled={loading}>{loading? 'Registering...' : 'Register'}</button>
            <Link to="/login" style={{alignSelf:'center',color:'var(--accent)'}}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
