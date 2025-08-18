import { useState } from 'react'
import { login } from '../auth'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { showError } from '../error'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()
  const loc = useLocation()
  const next = new URLSearchParams(loc.search).get('next') || '/'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await login(username, password)
      window.dispatchEvent(new Event('auth-changed'))
      nav(next)
    } catch (e: any) {
      showError(e?.response?.data?.message || 'Error')
    }
  }

  return (
    <div>
      <div className="container py-5">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            <div className="card bg-dark border-secondary" style={{ borderRadius: 15 }}>
              <div className="card-body p-5 text-white">
                <h2 className="text-uppercase text-center mb-4">Login</h2>
                <form onSubmit={submit}>
                  <div className="mb-4">
                    <input className="form-control form-control-lg" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <input className="form-control form-control-lg" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                  <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-success btn-lg">Login</button>
                  </div>
                  <p className="text-center mt-4 mb-0">
                    No account? <Link to="/register" className="fw-bold"><u>Register</u></Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
