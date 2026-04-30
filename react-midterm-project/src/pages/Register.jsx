import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/authServices.js'

export default function Register({ onSuccess }) {
  const [fields, setFields] = useState({ username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const update = key => e => setFields({ ...fields, [key]: e.target.value })

  function validate() {
    const errs = {}
    if (!fields.username || fields.username.trim().length < 2) errs.username = 'Username must be at least 2 characters.'
    if (!fields.email || !fields.email.includes('@')) errs.email = 'A valid email is required.'
    if (!fields.password || fields.password.length < 6) errs.password = 'Password must be at least 6 characters.'
    if (fields.password !== fields.confirm) errs.confirm = 'Passwords do not match.'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return
    try {
      setLoading(true)
      await register({
        username: fields.username.trim(),
        email: fields.email.toLowerCase(),
        password: fields.password,
      })
      onSuccess()
      navigate('/home')
    } catch (err) {
      setErrors({ general: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page" style={{ maxWidth: 420, margin: '0 auto' }}>
      <h1 className="page-title">Create Account</h1>
      <p className="page-subtitle">Sign up to start managing your reminders.</p>
      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 12px', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
              {errors.general}
            </div>
          )}
          {[
            { key: 'username', label: 'Username', type: 'text', placeholder: 'e.g. mwalemwandizya' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'At least 6 characters' },
            { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
          ].map(({ key, label, type, placeholder }) => (
            <div className="form-group" key={key}>
              <label className="form-label">{label}</label>
              <input
                className={`form-input${errors[key] ? ' error' : ''}`}
                type={type}
                placeholder={placeholder}
                value={fields[key]}
                onChange={update(key)}
              />
              {errors[key] && <div className="form-error">{errors[key]}</div>}
            </div>
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14 }}>
        Already have an account? <Link to="/login">Log in here</Link>
      </p>
    </main>
  )
}
