import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/authServices.js'

export default function Login({ onSuccess }) {
  const [fields, setFields] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const update = key => e => setFields({ ...fields, [key]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!fields.email || !fields.password) {
      setError('Email and password are required.')
      return
    }
    try {
      setLoading(true)
      await login(fields)
      onSuccess()
      navigate('/home')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page" style={{ maxWidth: 400, margin: '0 auto' }}>
      <h1 className="page-title">Welcome Back</h1>
      <p className="page-subtitle">Log in to access your reminders.</p>
      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 12px', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
              {error}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={fields.email} onChange={update('email')} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Enter your password" value={fields.password} onChange={update('password')} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>
      </div>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </main>
  )
}
