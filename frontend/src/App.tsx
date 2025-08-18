import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Main from './pages/Main'
import Register from './pages/Register'
import TaskInfo from './pages/TaskInfo'
import CreateTask from './pages/CreateTask'
import { isAuthed } from './auth'
import ErrorToast from './components/ErrorToast'
import { JSX } from 'react'
import Nav from './components/Nav'

function RequireAuth({ children }: { children: JSX.Element }) {
  const loc = useLocation()
  if (!isAuthed()) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  return children
}

export default function App() {
  return (
    <>
      <Nav/>
      <Routes>
        <Route path="/" element={<RequireAuth><Main /></RequireAuth>} />
        <Route path="/task/new" element={<RequireAuth><CreateTask /></RequireAuth>} />
        <Route path="/task/:id" element={<RequireAuth><TaskInfo /></RequireAuth>} />
        <Route path="/login" element={<LoginOrRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ErrorToast />
    </>
  )
}

function LoginOrRedirect() {
  if (isAuthed()) return <Navigate to="/" replace />
  const Login = require('./pages/Login').default
  return <Login />
}
