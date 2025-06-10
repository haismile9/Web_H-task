import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import API from '../../api/axios'

const RequireAuth = () => {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    API.get('/user')
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Đang xác thực...</div>
  if (!authenticated) return <Navigate to="/login" />

  return <Outlet />
}

export default RequireAuth
