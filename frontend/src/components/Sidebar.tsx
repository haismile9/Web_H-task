import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlinePushpin,
  AiOutlineSetting,
  AiOutlineFolder
} from 'react-icons/ai';
import API from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await API.post('/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      logout(); // Sử dụng AuthContext logout
      navigate('/login');
    }
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  // Tạm thời dùng user giả, sau này có thể lấy từ AuthContext
  const user = { name: 'User', role: 'member' };
  const firstLetter = user.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="menu p-4 w-64 min-h-screen bg-base-200 text-base-content flex flex-col">
      {/* Logo + App Name */}
      <div className="flex items-center mb-6">
        <img src="/img/favicon.ico" alt="Logo" className="w-8 h-8 mr-2 rounded" />
        <span className="font-bold text-xl">- Task</span>
      </div>

      {/* User Avatar + Info */}
      <div className="flex items-center mb-6 gap-2">
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-10 h-10 flex items-center justify-center">
            <span className="text-lg">{firstLetter}</span>
          </div>
        </div>
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <ul className="flex-1 space-y-2">
        <li>
          <Link
            to="/dashboard"
            className={`flex items-center p-2 rounded hover:bg-base-300 transition ${
              isActive('/dashboard') ? 'bg-base-300 font-bold' : ''
            }`}
          >
            <AiOutlineDashboard className="mr-2" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/projects"
            className={`flex items-center p-2 rounded hover:bg-base-300 transition ${
              isActive('/projects') ? 'bg-base-300 font-bold' : ''
            }`}
          >
            <AiOutlineFolder className="mr-2" />
            Dự Án
          </Link>
        </li>
        <li>
          <Link
            to="/my-task"
            className={`flex items-center p-2 rounded hover:bg-base-300 transition ${
              isActive('/my-task') ? 'bg-base-300 font-bold' : ''
            }`}
          >
            <AiOutlinePushpin className="mr-2" />
            Công việc của tôi
          </Link>
        </li>
        <li>
          <Link
            to="/account"
            className={`flex items-center p-2 rounded hover:bg-base-300 transition ${
              isActive('/account') ? 'bg-base-300 font-bold' : ''
            }`}
          >
            <AiOutlineUser className="mr-2" />
            Tài Khoản
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className={`flex items-center p-2 rounded hover:bg-base-300 transition ${
              isActive('/settings') ? 'bg-base-300 font-bold' : ''
            }`}
          >
            <AiOutlineSetting className="mr-2" />
            Cài Đặt
          </Link>
        </li>
      </ul>

      {/* Divider */}
      <div className="border-t border-gray-300 my-4"></div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="btn btn-sm btn-outline flex items-center justify-start"
      >
        <AiOutlineLogout className="mr-2" />
        Đăng Xuất
      </button>
    </div>
  );
};

export default Sidebar;
