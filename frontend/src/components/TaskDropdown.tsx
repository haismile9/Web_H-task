import React, { useState } from 'react';
import API from '../api/axios';

interface TaskDetailProps {
  taskId: number;
}

const TaskDropdown: React.FC<TaskDetailProps> = ({ taskId }) => {
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleToggle = async () => {
    setOpen(!open);

    if (!task && !loading) {
      setLoading(true);
      try {
        const res = await API.get(`/tasks/${taskId}`);
        setTask(res.data);
      } catch (err) {
        console.error('Error fetching task detail:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="collapse collapse-arrow bg-base-100 border border-base-300 mb-2">
      {/* Header */}
      <input type="checkbox" className="peer" checked={open} onChange={handleToggle} />
      <div className="collapse-title font-semibold">
        📝 {task.title}
      </div>

      {/* Content */}
      <div className="collapse-content">
        <p className="text-sm text-gray-500 mb-2">{task.description || 'Không có mô tả'}</p>
        <p className="text-sm mb-1">⏰ Deadline: {task.deadline || 'N/A'}</p>
        <p className="text-sm mb-1">📌 Trạng thái: <span className="badge badge-info">{task.status}</span></p>
        <div className="mt-2">
          <strong>👤 Người thực hiện:</strong>
          {task.assigned_users && task.assigned_users.length > 0 ? (
            <div className="flex gap-2 flex-wrap mt-1">
              {task.assigned_users.map((user: any) => (
                <div key={user.id} className="flex items-center gap-2 p-1 bg-base-200 rounded">
                  <img
                    src={user.avatar || `https://i.pravatar.cc/150?u=${user.email}`}
                    alt={user.email}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm">{user.email}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-gray-400 mt-1">Chưa có người được gán</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDropdown;