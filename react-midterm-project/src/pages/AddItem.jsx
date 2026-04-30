import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const validate = ({ title, desc, due }) => {
  const errors = {}

  if (!title.trim()) errors.title = 'Title is required.'
  else if (title.trim().length < 3) errors.title = 'Title must be at least 3 characters.'
  else if (title.trim().length > 100) errors.title = 'Title must be under 100 characters.'

  if (!desc.trim()) errors.desc = 'Description is required.'
  else if (desc.trim().length < 10) errors.desc = 'Description must be at least 10 characters.'

  if (!due) errors.due = 'Due date is required.'

  return errors
}

const INITIAL = {
  title: '',
  desc: '',
  status: 'pending',
  priority: 'med',
  due: '',
}

export default function AddItem({ onAdd }) {
  const [fields, setFields] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const updateField = key => e =>
    setFields({ ...fields, [key]: e.target.value })

  const handleBlur = key => () => {
    setTouched({ ...touched, [key]: true })
    setErrors({ ...errors, [key]: validate(fields)[key] })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate(fields)
    setTouched({ title: true, desc: true, due: true })
    setErrors(errs)

    if (Object.keys(errs).length) return

    try {
      setSubmitting(true)
      await onAdd({
        ...fields,
        title: fields.title.trim(),
        desc: fields.desc.trim(),
      })

      setSuccess(true)
      setTimeout(() => navigate('/list'), 1200)
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to add reminder.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <main className="page">
        <div className="success-state">
          <div className="success-icon">Done</div>
          <div className="success-text">Task added!</div>
          <div className="success-sub">Redirecting to your task list...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <h1 className="page-title">Add New Task</h1>
      <p className="page-subtitle">
        Fill in the details below. Fields marked * are required.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              className={`form-input${errors.title ? ' error' : ''}`}
              type="text"
              placeholder="e.g. Design the login page"
              value={fields.title}
              onChange={updateField('title')}
              onBlur={handleBlur('title')}
              maxLength={100}
            />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className={`form-input${errors.desc ? ' error' : ''}`}
              placeholder="Describe what needs to be done..."
              value={fields.desc}
              onChange={updateField('desc')}
              onBlur={handleBlur('desc')}
              rows={3}
            />
            {errors.desc && <div className="form-error">{errors.desc}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={fields.status} onChange={updateField('status')}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-input" value={fields.priority} onChange={updateField('priority')}>
                <option value="high">High</option>
                <option value="med">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date *</label>
            <input
              className={`form-input${errors.due ? ' error' : ''}`}
              type="date"
              value={fields.due}
              onChange={updateField('due')}
              onBlur={handleBlur('due')}
            />
            {errors.due && <div className="form-error">{errors.due}</div>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={() => navigate('/list')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Reminder'}
            </button>
          </div>
          {errors.submit && <div className="form-error">{errors.submit}</div>}
        </form>
      </div>
    </main>
  )
}
