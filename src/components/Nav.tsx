import { Link, useNavigate } from 'react-router-dom'
import { isAuthed, logout } from '../auth'
import { useEffect, useState } from 'react'

export default function Nav() {
  const nav = useNavigate()
  const [authed, setAuthed] = useState(isAuthed())
  useEffect(() => {
    function h() { setAuthed(isAuthed()) }
    window.addEventListener('auth-changed', h)
    return () => window.removeEventListener('auth-changed', h)
  }, [])
  return (
    <nav className="navbar navbar-dark bg-dark mb-3">
      <div className="container">
        <Link className="navbar-brand" to="/">Home page</Link>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-light btn-sm" to="/task/new">New Task</Link>
          {authed ? (
            <button className="btn btn-outline-light btn-sm" onClick={() => { logout(); setAuthed(false); nav('/login') }}>Logout</button>
          ) : (
            <>
              <Link className="btn btn-primary btn-sm" to="/login">Login</Link>
              <Link className="btn btn-outline-secondary btn-sm" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
