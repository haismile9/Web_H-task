import React, { useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useProjectDetails } from "../api/project/useProjectDetails";
import TaskBoard from "../components/TaskBoard";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Validate ID
  const projectId = id ? parseInt(id) : null;

  if (!projectId) {
    return <Navigate to="/dashboard" />;
  }

  const { project, loading, error, errorCode } = useProjectDetails(projectId);

  // Handle different error scenarios
  useEffect(() => {
    if (errorCode === 404) {
      // Project doesn't exist or user doesn't have permission
      navigate("/404", { replace: true });
    }
  }, [errorCode, navigate]);

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-64">
        <div className="loading loading-spinner loading-lg mb-4"></div>
        <p className="text-gray-600">Đang tải dự án...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="alert alert-error max-w-md mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
        
        {(errorCode === 403 || errorCode === 404) && (
          <p className="mt-4 text-sm text-gray-500">
            Đang chuyển hướng về danh sách dự án...
          </p>
        )}
        
        {errorCode !== 403 && errorCode !== 404 && (
          <button 
            onClick={() => navigate("/projects")}
            className="btn btn-primary mt-4"
          >
            Quay về danh sách dự án
          </button>
        )}
      </div>
    );
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
