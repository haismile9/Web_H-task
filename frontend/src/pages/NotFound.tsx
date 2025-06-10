import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-700 mb-2">404</h1>
      <p className="text-gray-500 mb-4">Không tìm thấy trang bạn yêu cầu</p>
      <Link
        to="/"
        className="text-blue-600 hover:underline font-medium"
      >
        ← Quay về trang chủ
      </Link>
    </div>
  )
}
