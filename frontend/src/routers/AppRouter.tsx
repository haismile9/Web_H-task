import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/ProjectList';
import ProjectDetails from '../pages/ProjectDetails';
import NotFound from '../pages/NotFound';
import TaskList from '../pages/TaskList';
import BaseLayout from '../layout/BaseLayout';
import VerifyEmailForm from '../components/auth/VerifyEmailForm';
import Account from '../pages/Account';
import MyTasks from '../pages/MyTasks'; // 👈

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Không có layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmailForm />} />

        {/* Có layout dùng chung */}
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="project/:id/tasks" element={<TaskList />} />
          <Route path="account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
