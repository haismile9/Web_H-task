import { Link } from 'react-router-dom';
import { AiOutlineHome, AiOutlineArrowLeft } from 'react-icons/ai';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-md mx-auto">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
            <span className="text-6xl font-bold text-white">404</span>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Không tìm thấy trang
        </h1>
        <p className="text-blue-100 mb-8 leading-relaxed">
          Trang bạn đang tìm kiếm có thể đã được di chuyển, xóa hoặc bạn không có quyền truy cập.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
          >
            <AiOutlineHome className="mr-2 group-hover:scale-110 transition-transform" />
            Về trang chủ
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full bg-white/10 text-white font-medium py-3 px-6 rounded-lg border border-white/30 hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm group"
          >
            <AiOutlineArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Quay lại trang trước
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-blue-200 text-sm">
            Cần hỗ trợ?{' '}
            <Link to="/account" className="text-white underline hover:no-underline">
              Liên hệ quản trị viên
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
