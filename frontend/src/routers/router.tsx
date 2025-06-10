import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import BaseLayout from '../layout/BaseLayout';
import Dashboard from '../pages/Dashboard';
import ProjectDetails from '../pages/ProjectDetails';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MyTasks from '../pages/MyTasks';
import Account from '../pages/Account';  // 👈 Thêm import cho trang tài khoản
import VerifyEmailForm from '../components/auth/VerifyEmailForm';

const router = createBrowserRouter([
  {
    path: "/login",   // 👈 Thêm route login
    element: <Login />,
  },
  {
    path: "/register",  // 👈 Thêm route register
    element: <Register />,
  },
  {
    path: "/verify-email",  // 👈 Thêm route register
    element: <VerifyEmailForm />,
  },
  {
    path: "/",          // 👈 BaseLayout bọc các route chính
    element: <BaseLayout />,
    children: [
      {
        path: "dashboard",   // 👈 Chú ý: không có dấu "/" đầu
        element: <Dashboard />,
      },
      {
        path: "projects/:id",  // 👈 Dự án chi tiết
        element: <ProjectDetails />,
      },
      {
        path: "my-task",   // 👈 Chú ý: không có dấu "/" đầu
        element: <MyTasks />,
      },
      {
        path: "account",
        element: <Account />,  // 👈 Thêm route cho trang tài khoản
      },
      // 👇 có thể thêm các route khác vào đây
    ],
  },
  {
    path: "*",    // 👈 404 route
    element: <NotFound />,
  },
]);

export default router;
