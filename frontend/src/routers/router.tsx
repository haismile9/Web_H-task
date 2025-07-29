import { createBrowserRouter } from 'react-router-dom';
import BaseLayout from '../layout/BaseLayout';
import Dashboard from '../pages/Dashboard'; // Trang thống kê
import ProjectList from '../pages/ProjectList'; // Danh sách dự án
import ProjectDetails from '../pages/ProjectDetails';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MyTasks from '../pages/MyTasks';
import Account from '../pages/Account';  // 👈 Thêm import cho trang tài khoản
import VerifyEmailForm from '../components/auth/VerifyEmailForm';
import InstagramPosts from '../pages/InstagramPosts';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailForm />,
  },
  {
    path: "/",   // 👈 BaseLayout chứa sidebar + nội dung
    element: <BaseLayout />,
    children: [
      {
        path: "dashboard",        // Trang thống kê
        element: <Dashboard />,
      },
      {
        path: "projects",         // Danh sách dự án
        element: <ProjectList />,
      },
      {
        path: "projects/:id",     // Chi tiết dự án
        element: <ProjectDetails />,
      },
      {
        path: "my-task",
        element: <MyTasks />,
      },
      {
        path: "instagram-posts",
        element: <InstagramPosts />,
      },
      {
        path: "account",
        element: <Account />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
