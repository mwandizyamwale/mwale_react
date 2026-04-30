import { getSession } from './authServices'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function authHeaders() {
  const { token } = getSession()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}

export async function fetchTasks() {
  const res = await fetch(`${API_URL}/api/tasks`, { headers: authHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch tasks.')
  return data
}

export async function addTask(fields) {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(fields),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to add task.')
  return data
}

export async function toggleTask(id) {
  const res = await fetch(`${API_URL}/api/tasks/${id}/toggle`, {
    method: 'PATCH',
    headers: authHeaders(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to toggle task.')
  return data
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to delete task.')
  return data
}

export default { fetchTasks, addTask, toggleTask, deleteTask }