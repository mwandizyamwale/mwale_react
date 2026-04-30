import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar({ theme, onToggleTheme, loggedIn, onLogout, user }) {
  const navigate = useNavigate()

  function handleLogout() {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <NavLink to="/home" className="nav-brand">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 9l2.5 2.5L13 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        My Reminder App
      </NavLink>
      <div className="nav-links">
        <button className="btn btn-sm" onClick={onToggleTheme}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        {loggedIn ? (
          <>
            <NavLink to="/home" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Home</NavLink>
            <NavLink to="/list" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Reminders</NavLink>
            <NavLink to="/add" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Add Reminder</NavLink>
            {user && <span className="nav-link" style={{ opacity: 0.6, cursor: 'default' }}>{user.username}</span>}
            <button className="btn btn-sm" onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Login</NavLink>
            <NavLink to="/register" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  )
}
