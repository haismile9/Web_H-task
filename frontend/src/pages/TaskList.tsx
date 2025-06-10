import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

interface Task {
  id: number;
  title: string;
  status: string;
  assigned_to?: string | number;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
}

export default function TaskList() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/projects/${id}/tasks`);
      setTasks(res.data);
    } catch {
      setError("Không thể tải danh sách công việc");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch {
      console.warn("Không thể tải danh sách người dùng");
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await API.post(`/projects/${id}/tasks`, {
        title,
        status: "pending",
      });
      setTitle("");
      fetchTasks();
    } catch {
      alert("Không thể tạo task");
    }
  };

  const handleAssign = async (taskId: number, userId: string) => {
    try {
      await API.put(`/projects/${id}/tasks/${taskId}`, {
        assigned_to: userId,
      });
      fetchTasks();
    } catch {
      alert("Không thể giao việc");
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xoá công việc này?")) return;
    try {
      await API.delete(`/projects/${id}/tasks/${taskId}`);
      fetchTasks();
    } catch {
      alert("Không thể xoá task");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, [id]);

  if (loading) return <p className="p-6">Đang tải công việc...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📝 Công việc của dự án #{id}</h2>

      <form onSubmit={createTask} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Tên công việc..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-grow px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Thêm
        </button>
      </form>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border p-3 rounded shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">
                  {task.status} {task.due_date && `| 📅 ${task.due_date}`}
                </p>
              </div>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-red-500 text-sm hover:underline"
              >
                🗑️ Xoá
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <label className="text-sm">👤 Giao cho:</label>
              <select
                value={task.assigned_to || ""}
                onChange={(e) => handleAssign(task.id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">-- Chưa giao --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
