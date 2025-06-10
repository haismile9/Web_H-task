import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineDashboard, AiOutlineUser, AiOutlineLogout, AiOutlinePushpin } from 'react-icons/ai';
import API from '../api/axios';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post('/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const isActive = (path: string) => location.pathname.startsWith(path);
  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : { name: 'Guest', role: 'guest' };

  return (
    <div className="menu p-4 w-64 min-h-full bg-base-200 text-base-content flex flex-col">
      {/* Logo + App Name */}
      <div className="flex items-center mb-4">
        <img src="/img/favicon.ico" alt="Logo" className="w-8 h-8 mr-2 rounded" />
        <span className="font-bold text-xl">- Task</span>
      </div>

      {/* Avatar user + role */}
      <div className="flex items-center mb-4 gap-2">
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
            <span className="text-lg uppercase">{user.name.charAt(0)}</span>
          </div>
        </div>
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
        </div>
      </div>

      {/* Menu */}
      <ul className="flex-1 space-y-2">
        <li>
          <Link 
            to="/dashboard" 
            className={`flex items-center ${isActive('/dashboard') ? 'active font-bold' : ''}`}
          >
            <AiOutlineDashboard className="inline-block mr-2" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/my-task"
            className={`flex items-center ${isActive('/my-task') ? 'active font-bold' : ''}`}
          >
            <AiOutlinePushpin className="inline-block mr-2" />
            Công việc của tôi
          </Link>
        </li>
        <li>
          <Link 
            to="/account"
            className={`flex items-center ${isActive('/account') ? 'active font-bold' : ''}`}
          >
            <AiOutlineUser className="inline-block mr-2" />
            Tài Khoản
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
