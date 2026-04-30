import { useNavigate } from 'react-router-dom'

const STATUS_BADGE = {
  pending: 'badge badge-pending',
  'in-progress': 'badge badge-progress',
  done: 'badge badge-done',
}

const PRIORITY_BADGE = {
  high: 'badge badge-high',
  med: 'badge badge-med',
  low: 'badge badge-low',
}

const STATUS_LABEL = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  done:'Done',
}

const PRIORITY_LABEL = {
  high: 'High',
  med: 'Medium',
  low: 'Low',
}

export default function ItemCard({ task, onToggle, onDelete }) {
  const navigate = useNavigate()

  function handleCardClick() {
    navigate(`/details/${task.id}`)
  }

  function handleToggle(e) {
    e.stopPropagation()
    onToggle(task.id)
  }

  function handleDelete(e) {
    e.stopPropagation()
    if (window.confirm(`Delete "${task.title}"?`)) {
      onDelete(task.id)
    }
  }

  return (
    <div
      className={`task-card${task.status === 'done' ? ' done' : ''}`}
      onClick={handleCardClick}
    >
      {/* Checkbox circle */}
      <div
        className={`task-check${task.status === 'done' ? ' checked' : ''}`}
        onClick={handleToggle}
        title="Toggle complete"
      >
        {task.status === 'done' && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <polyline
              points="1.5,5 4,7.5 8.5,2.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Text content */}
      <div className="task-content">
        <div className="task-title">{task.title}</div>
        <div className="task-desc">{task.desc}</div>
        <div className="task-meta">
          <span className={STATUS_BADGE[task.status]}>
            {STATUS_LABEL[task.status]}
          </span>
          <span className={PRIORITY_BADGE[task.priority]}>
            {PRIORITY_LABEL[task.priority]}
          </span>
          {task.due && (
            <span className="task-due">Due {task.due}</span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <div className="task-actions">
        <button
          className="btn btn-sm btn-danger"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  )
}