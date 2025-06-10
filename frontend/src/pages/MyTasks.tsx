import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  status?: 'pending' | 'in_progress' | 'done';
  assignedUsers?: User[];
  project_id: number; // ✅ thêm dòng này
}

const statusStyle = {
  pending: 'badge badge-warning text-xs',
  in_progress: 'badge badge-info text-xs',
  done: 'badge badge-success text-xs',
};

const statusLabel = {
  pending: '🕐 Chờ làm',
  in_progress: '⚙️ Đang làm',
  done: '✅ Hoàn thành',
};

const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get('/my-tasks');
        setTasks(res.data.tasks);
      } catch (err) {
        console.error('❌ Không thể tải công việc của tôi:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📌 Công việc của tôi</h2>

      {loading ? (
        <div className="text-center">Đang tải...</div>
      ) : tasks.length === 0 ? (
        <div className="text-gray-400 italic">Không có công việc nào được giao.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {tasks.map(task => (
            <Link
  key={task.id}
  to={`/projects/${task.project_id}`}
  className="bg-base-200 p-4 rounded shadow hover:bg-base-300 transition block"
>
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-lg">{task.title}</h3>
    <span className={statusStyle[task.status || 'pending']}>
      {statusLabel[task.status || 'pending']}
    </span>
  </div>
  <p className="text-sm text-gray-500 mb-2">
    {task.description || 'Không có mô tả'}
  </p>
  <p className="text-xs text-gray-400">
    🗓 Hạn: {task.deadline || 'Không rõ'}
  </p>
</Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
