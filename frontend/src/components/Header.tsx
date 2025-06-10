import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <h1 className="text-lg font-bold">Quản lý công việc nhóm</h1>
      <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
        Đăng xuất
      </button>
    </header>
  )
}
