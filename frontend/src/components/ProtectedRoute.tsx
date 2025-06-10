import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, isLoading } = useAuth(); // 👈 thêm isLoading

  if (isLoading) {
    return <div className="p-6 text-gray-500">Đang kiểm tra đăng nhập...</div>; // hoặc spinner
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
