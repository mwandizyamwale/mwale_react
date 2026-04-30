const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const TOKEN_KEY = 'reminder_token'
const USER_KEY = 'reminder_user'

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getSession() {
  const token = localStorage.getItem(TOKEN_KEY)
  const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  return { token, user }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isLoggedIn() {
  return !!localStorage.getItem(TOKEN_KEY)
}

export async function register({ username, email, password }) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Registration failed.')
  saveSession(data.token, data.user)
  return data
}

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Login failed.')
  saveSession(data.token, data.user)
  return data
}

export function logout() {
  clearSession()
}
