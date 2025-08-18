import api from './api'

export async function register(username: string, password: string) {
  const { data } = await api.post('/auth/register', { username, password })
  localStorage.setItem('token', data.access_token)
  return data
}

export async function login(username: string, password: string) {
  const { data } = await api.post('/auth/login', { username, password })
  localStorage.setItem('token', data.access_token)
  return data
}

export function logout() {
  localStorage.removeItem('token')
}

export function isAuthed() {
  return !!localStorage.getItem('token')
}
