import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import List from './pages/List.jsx'
import Details from './pages/Details.jsx'
import AddItem from './pages/AddItem.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { fetchTasks, addTask as createTask, toggleTask as toggleTaskStatus, deleteTask } from './services/taskServices.js'
import { isLoggedIn, logout, getSession } from './services/authServices.js'

const THEME_KEY = 'my_reminder_theme'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark')
  const [loggedIn, setLoggedIn] = useState(isLoggedIn)

  useEffect(() => {
    if (!loggedIn) {
      setTasks([])
      setLoading(false)
      return
    }
    loadTasks()
  }, [loggedIn])

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
    document.body.classList.toggle('light', theme === 'light')
  }, [theme])

  async function loadTasks() {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTasks()
      setTasks(data)
    } catch {
      setError('Failed to load tasks. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddTask(fields) {
    const newTask = await createTask(fields)
    setTasks(prev => [newTask, ...prev])
    return newTask
  }

  async function handleToggleTask(id) {
    const updated = await toggleTaskStatus(id)
    setTasks(prev => prev.map(t => (t.id === id ? updated : t)))
  }

  async function removeTask(id) {
    await deleteTask(id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function handleLoginSuccess() {
    setLoggedIn(true)
  }

  function handleLogout() {
    logout()
    setLoggedIn(false)
    setTasks([])
  }

  function toggleTheme() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  function Protected({ children }) {
    return loggedIn ? children : <Navigate to="/login" replace />
  }

  return (
    <>
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        loggedIn={loggedIn}
        onLogout={handleLogout}
        user={getSession().user}
      />
      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 20px', textAlign: 'center', fontSize: 14 }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: 12, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            x
          </button>
        </div>
      )}
      <Routes>
        <Route path="/login" element={loggedIn ? <Navigate to="/home" replace /> : <Login onSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={loggedIn ? <Navigate to="/home" replace /> : <Register onSuccess={handleLoginSuccess} />} />
        <Route path="/home" element={<Protected><Home tasks={tasks} loading={loading} /></Protected>} />
        <Route path="/list" element={<Protected><List tasks={tasks} onToggle={handleToggleTask} onDelete={removeTask} loading={loading} /></Protected>} />
        <Route path="/details/:id" element={<Protected><Details tasks={tasks} onToggle={handleToggleTask} onDelete={removeTask} /></Protected>} />
        <Route path="/add" element={<Protected><AddItem onAdd={handleAddTask} /></Protected>} />
        <Route path="/" element={<Navigate to={loggedIn ? '/home' : '/login'} replace />} />
        <Route path="*" element={<Navigate to={loggedIn ? '/home' : '/login'} replace />} />
      </Routes>
    </>
  )
}
