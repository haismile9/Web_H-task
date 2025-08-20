import { createBrowserRouter } from 'react-router-dom';
import BaseLayout from '../layout/BaseLayout';
import Dashboard from '../pages/Dashboard';
import ProjectList from '../pages/ProjectList';
import ProjectDetails from '../pages/ProjectDetails';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MyTasks from '../pages/MyTasks';
import Account from '../pages/Account';
import VerifyEmailForm from '../components/auth/VerifyEmailForm';
import ForgotPassword from '../pages/ForgotPassword';
import ProtectedRoute from '../components/ProtectedRoute';

const router = createBrowserRouter([
  // Public routes (không cần đăng nhập)
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
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/404",
    element: <NotFound />,
  },
  // Protected routes (cần đăng nhập)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <BaseLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // Redirect / to dashboard
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "projects",
        element: <ProjectList />,
      },
      {
        path: "projects/:id",
        element: <ProjectDetails />,
      },
      {
        path: "my-task",
        element: <MyTasks />,
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
