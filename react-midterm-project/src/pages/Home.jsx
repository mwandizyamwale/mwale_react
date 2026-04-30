import { useNavigate } from 'react-router-dom'

const STATUS = {
  pending: { label: 'Pending', badge: 'badge badge-pending' },
  'in-progress': { label: 'In Progress', badge: 'badge badge-progress' },
  done: { label: 'Done', badge: 'badge badge-done' },
}

export default function Home({ tasks }) {
  const navigate = useNavigate()

  const total = tasks.length
  const done  = tasks.filter(t => t.status === 'done').length
  const inProg  = tasks.filter(t => t.status === 'in-progress').length
  const pending = tasks.filter(t => t.status === 'pending').length
  const pct = total ? Math.round((done / total) * 100) : 0

  const recent = [...tasks].reverse().slice(0, 3)

  return (
    <main className="page">

      <div className="home-hero">
        <h1 className="hero-title">Set Your Reminders</h1>
        <p className="hero-sub">Remember, Do, Complete.</p>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate('/add')}>
            Add Reminder
          </button>
          <button className="btn" onClick={() => navigate('/list')}>
            View All Reminders
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <Stat number={total} label="Total Reminders" />
        <Stat number={pending} label="Pending" />
        <Stat number={inProg} label="Reminders In progress" />
        <Stat number={done} label="Completed" />
      </div>

      <div className="progress-wrap">
        <span className="progress-label">{pct}% complete</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: pct + '%' }} />
        </div>
      </div>

      <div className="section-label">Recent reminders</div>

      {recent.length === 0 ? (
        <div className="empty">
          <div className="empty-icon"></div>
          <div>No reminders yet. Add one to get started!</div>
        </div>
      ) : (
        recent.map(task => (
          <div
            key={task.id}
            className={`task-card${task.status === 'done' ? ' done' : ''}`}
            onClick={() => navigate(`/details/${task.id}`)}
          >
            <div className="task-content">
              <div className="task-title">{task.title}</div>

              <div className="task-meta">
                <span className={STATUS[task.status].badge}>
                  {STATUS[task.status].label}
                </span>
                {task.due && <span className="task-due">Due {task.due}</span>}
              </div>
            </div>
          </div>
        ))
      )}

    </main>
  )
}


function Stat({ number, label }) {
  return (
    <div className="stat-card">
      <div className="stat-num">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}