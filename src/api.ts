import axios from 'axios'

const base =
  process.env.REACT_APP_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:3001`

const api = axios.create({ baseURL: base })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export default api
