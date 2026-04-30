import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ItemCard from '../components/ItemCard.jsx'

const FILTERS = {
  all: 'All Reminders',
  pending: 'Pending',
  'in-progress': 'In Progress',
  done: 'Completed',
}

export default function List({ tasks, onToggle, onDelete }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter
    const text = (task.title + task.desc).toLowerCase()
    const matchesSearch = text.includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <main className="page">
      <div className="list-header">
        <div>
          <h1 className="page-title">All Reminders</h1>
          <p className="page-subtitle">
            {tasks.length} reminder{tasks.length !== 1 ? 's' : ''} total
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/add')}>
          + Add Reminder
        </button>
      </div>

      <div className="filter-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search reminders..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {Object.entries(FILTERS).map(([key, label]) => (
          <button
            key={key}
            className={`filter-btn${filter === key ? ' active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">No results</div>
          <div>
            {search
              ? 'No tasks match your search.'
              : 'No tasks in this category.'}
          </div>
        </div>
      ) : (
        filtered.map(task => (
          <ItemCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))
      )}
    </main>
  )
}
