import { useParams, useNavigate } from 'react-router-dom'

const STATUS = {
  pending: { label: 'Pending', badge: 'badge badge-pending' },
  'in-progress': { label: 'In Progress', badge: 'badge badge-progress' },
  done: { label: 'Done', badge: 'badge badge-done' },
}

const PRIORITY = {
  high: { label: 'High', badge: 'badge badge-high' },
  med: { label: 'Medium', badge: 'badge badge-med' },
  low: { label: 'Low', badge: 'badge badge-low' },
}

export default function Details({ tasks, onToggle, onDelete }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const task = tasks.find(t => t.id === Number(id))

  if (!task) {
    return (
      <main className="page">
        <button className="back-btn" onClick={() => navigate('/list')}>
          Back to Tasks
        </button>
        <div className="empty">
          <div className="empty-icon">Not found</div>
          <div>Task not found.</div>
        </div>
      </main>
    )
  }

  const deleteTask = () => {
    if (confirm(`Delete "${task.title}"?`)) {
      onDelete(task.id)
      navigate('/list')
    }
  }

  return (
    <main className="page">
      <button className="back-btn" onClick={() => navigate('/list')}>
        Back to Tasks
      </button>

      <div className="card">
        <div className="detail-header">
          <div>
            <h1 className="detail-title">{task.title}</h1>

            <div className="badge-row">
              <span className={STATUS[task.status].badge}>
                {STATUS[task.status].label}
              </span>

              <span className={PRIORITY[task.priority].badge}>
                {PRIORITY[task.priority].label} Priority
              </span>
            </div>
          </div>

          <div className="btn-row">
            <button className="btn btn-sm" onClick={() => onToggle(task.id)}>
              {task.status === 'done' ? 'Reopen' : 'Mark Complete'}
            </button>
            <button className="btn btn-sm btn-danger" onClick={deleteTask}>
              Delete
            </button>
          </div>
        </div>

        <Detail label="Description" value={task.desc || 'No description provided.'} />
        <Detail label="Status" value={STATUS[task.status].label} />
        <Detail label="Priority" value={PRIORITY[task.priority].label} />
        <Detail label="Due Date" value={task.due || '-'} />
        <Detail label="Date Created" value={task.created_at || '-'} />
        <Detail label="Task ID" value={`#${task.id}`} mono />
      </div>
    </main>
  )
}

function Detail({ label, value, mono }) {
  return (
    <div className="detail-field">
      <div className="detail-key">{label}</div>
      <div className="detail-val" style={mono ? {
        fontFamily: 'monospace',
        color: 'var(--color-text-muted)',
        fontSize: 13,
      } : null}>
        {value}
      </div>
    </div>
  )
}
