import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useTaskStore, type Task } from "../store/task";
import CreateProjectModal from "../components/projects/CreateProjectModal";

interface Project {
  id: number;
  name: string;
  description?: string;
  background_url?: string;
  created_at: string;
  owner_id: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const statusMap = {
  todo: "🧠 To Do",
  in_progress: "⚙️ In Progress",
  done: "✅ Done",
};

const ProjectBoard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, setTasks, updateTask } = useTaskStore();

  const [project, setProject] = useState<Project | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchData = async () => {
    try {
      const [taskRes, projectRes] = await Promise.all([
        axios.get(`/projects/${id}/tasks`),
        axios.get(`/projects/${id}`),
      ]);
      setTasks(taskRes.data.tasks);
      setProject(projectRes.data);

      const localUser = localStorage.getItem("user");
      const parsedUser = localUser ? JSON.parse(localUser) : null;
      setUser(parsedUser);
    } catch (err) {
      console.error("❌ Lỗi khi fetch dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId as Task["status"];

    try {
      await axios.patch(`/tasks/${taskId}`, { status: newStatus });
      updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error("❌ Cập nhật trạng thái thất bại", err);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    const confirmDelete = window.confirm(
      "🛑 Bạn có chắc chắn muốn xóa dự án này?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/projects/${project.id}`);
      alert("✅ Dự án đã được xóa!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Lỗi khi xóa dự án:", err);
      alert("❌ Không thể xóa dự án");
    }
  };

  const columns = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  if (loading) return <div className="p-6">Đang tải dữ liệu dự án...</div>;
  if (!project)
    return <div className="p-6 text-red-500">Không tìm thấy dự án</div>;

  const isOwner =
    user && (user.role === "admin" || user.id === project.owner_id);

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <p className="text-sm text-gray-500">
            {project.description || "Không có mô tả"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Tạo ngày: {new Date(project.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2">
          {isOwner && (
            <>
              <button
                onClick={() => setShowEditModal(true)}
                className="btn btn-sm btn-info"
              >
                ✏️ Sửa
              </button>
              <button
                onClick={handleDeleteProject}
                className="btn btn-sm btn-error"
              >
                🗑️ Xóa
              </button>
            </>
          )}

          <button
            onClick={() => navigate(`/projects/${id}/tasks/create`)}
            className="btn btn-sm btn-primary"
          >
            ➕ Thêm Nhiệm Vụ
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([status, taskList]) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-base-100 p-4 rounded shadow min-h-[300px]"
                >
                  <h2 className="text-xl font-semibold mb-3">
                    {statusMap[status as keyof typeof statusMap]}
                  </h2>

                  {taskList.map((task, index) => (
                    <Draggable
                      key={task.id.toString()}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          className="bg-white rounded shadow p-3 mb-3"
                        >
                          <h3 className="font-medium">{task.title}</h3>
                          {task.description && (
                            <p className="text-sm text-gray-500">
                              {task.description}
                            </p>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* 🧩 Modal sửa dự án */}
      {showEditModal && project && (
        <CreateProjectModal
          onClose={() => {
            setShowEditModal(false);
            fetchData(); // Reload lại sau khi sửa
          }}
          project={{
            id: project.id,
            name: project.name,
            description: project.description,
            background_url: project.background_url || "",
          }}
        />
      )}
    </div>
  );
};

export default ProjectBoard;
