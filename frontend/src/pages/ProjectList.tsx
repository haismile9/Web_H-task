import { useState, useEffect } from "react";
import { useProjects } from "../api/project/useProjects";
import { accessControl } from "../api/utils/access";
import BoardCard from "../components/BoardCard";
import NewBoardCard from "../components/NewBoardCard";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import { Navigate } from "react-router-dom";

const ProjectList = () => {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [projectsState, setProjectsState] = useState<any[]>([]); // ← danh sách project cục bộ

  const { projects, loading, error } = useProjects();

  // ⏬ Thêm đoạn này để đồng bộ dữ liệu từ useProjects sang state
  useEffect(() => {
    if (projects) {
      setProjectsState(projects);
    }
  }, [projects]);

  if (!user) return <Navigate to="/" />;

  const permissions = accessControl(user.role);

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleDragStart = (id?: number) => {
    if (id) setDraggingId(id);
  };

  const handleDeleteProject = async (id: number) => {
    const confirmed = window.confirm("Bạn có chắc muốn xoá dự án này?");
    if (!confirmed) return;

    try {
      await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest", // ✅ Rất quan trọng để Laravel hiểu đây là request từ frontend
          Accept: "application/json",
        },
        credentials: "include", // ✅ bắt buộc với Sanctum
      });

      // ✅ Xoá khỏi projectState (không reload)
      setProjectsState((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Lỗi khi xoá dự án.");
    }
  };

  const handleDropToTrash = () => {
    if (draggingId !== null) {
      handleDeleteProject(draggingId);
      setDraggingId(null);
    }
  };

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Xin chào, {user.name}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Vai trò: <span className="badge badge-info">{user.role}</span>
          </p>
        </div>
        {permissions.canManageProjects && (
          <button
            className="btn btn-success btn-sm"
            onClick={handleShowCreateModal}
          >
            + Tạo Dự Án
          </button>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Danh sách dự án</h2>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-error">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <NewBoardCard onClick={handleShowCreateModal} />
        {projectsState.map((project) => (
          <BoardCard
            key={project.id}
            id={project.id}
            title={project.name}
            description={project.description || "Không có mô tả"}
            backgroundUrl={project.background_url}
            draggable
            onDragStart={handleDragStart}
          />
        ))}
      </div>

      {showCreateModal && (
        <CreateProjectModal onClose={handleCloseCreateModal} />
      )}

      {/* 🗑 Trash zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropToTrash}
        className="fixed bottom-6 right-6 z-50 w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition cursor-pointer"
      >
        🗑
      </div>
    </div>
  );
};

export default ProjectList;
