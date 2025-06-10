import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useProjectDetails } from "../api/project/useProjectDetails";
import TaskBoard from "../components/TaskBoard";
const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Validate ID
  const projectId = id ? parseInt(id) : null;

  if (!projectId) {
    return <Navigate to="/dashboard" />;
  }

  const { project, loading, error } = useProjectDetails(projectId);

  if (loading) {
    return <div className="p-6 text-center">Đang tải dự án...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-error">{error}</div>;
  }

  if (!project) {
    return <div className="p-6 text-center">Dự án không tồn tại.</div>;
  }

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="mb-4">{project.description}</p>
      <p className="text-sm text-gray-500">
        Tạo ngày: {new Date(project.created_at).toLocaleDateString()}
      </p>
      {/* 🔥 Optional: Thêm nút Edit hoặc Delete tùy role */}
      <TaskBoard projectId={projectId} />
    </div>
  );
};

export default ProjectDetails;
