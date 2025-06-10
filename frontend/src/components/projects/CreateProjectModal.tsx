import React, { useState } from "react";
import API from "../../api/axios";

interface Props {
  onClose: () => void;
  project?: {
    id: number;
    name: string;
    description?: string;
    background_url?: string;
  };
}

const predefinedImages = [
  { label: "Scrum Board", url: "/img/undraw_scrum-board_uqku.png" },
  { label: "Schedule", url: "/img/undraw_schedule_6t8k.png" },
  { label: "Next Tasks", url: "/img/undraw_next-tasks_y3rm.png" },
  { label: "Date Picker", url: "/img/undraw_date-picker_qe47.png" },
  { label: "Booked", url: "/img/undraw_booked_bb22.png" },
];

const CreateProjectModal: React.FC<Props> = ({ onClose, project }) => {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState(
    project?.background_url || predefinedImages[0].url
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const payload = {
      name,
      description,
      background_url: selectedImage,
    };

    try {
      if (project) {
        await API.put(`/projects/${project.id}`, payload);
      } else {
        await API.post("/projects", {
          ...payload,
          collaborator_email: collaboratorEmail,
        });
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error("❌ Lỗi khi xử lý dự án:", err);
      setError("Có lỗi xảy ra khi lưu dự án.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Alert góc phải */}
      {showSuccess && (
        <div className="fixed top-5 right-5 z-[1000]">
          <div className="alert alert-success shadow-lg w-96">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{project ? "Dự án đã được cập nhật!" : "Dự án đã được tạo!"}</span>
          </div>
        </div>
      )}

      {/* 🧱 Modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-base-100 rounded-lg p-6 w-96">
          <h2 className="text-xl font-bold mb-4">
            {project ? "✏️ Sửa Dự Án" : "➕ Tạo Dự Án Mới"}
          </h2>

          <input
            type="text"
            placeholder="Tên dự án"
            className="input input-bordered w-full mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Mô tả (tùy chọn)"
            className="textarea textarea-bordered w-full mb-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {!project && (
            <input
              type="email"
              placeholder="Email cộng tác (tùy chọn)"
              className="input input-bordered w-full mb-3"
              value={collaboratorEmail}
              onChange={(e) => setCollaboratorEmail(e.target.value)}
            />
          )}

          <div className="mb-3">
            <label className="block mb-1 font-semibold text-sm">Ảnh nền</label>
            <select
              className="select select-bordered w-full"
              value={selectedImage}
              onChange={(e) => setSelectedImage(e.target.value)}
            >
              {predefinedImages.map((img) => (
                <option key={img.url} value={img.url}>
                  {img.label}
                </option>
              ))}
            </select>
          </div>

          <img
            src={selectedImage}
            alt="Preview"
            className="rounded w-full h-40 object-cover mb-3 border"
          />

          {error && <p className="text-error text-sm mb-3">{error}</p>}

          <div className="flex justify-end gap-2">
            <button className="btn btn-outline" onClick={onClose}>
              Hủy
            </button>
            <button
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              onClick={handleSubmit}
              disabled={loading || !name}
            >
              {project ? "Lưu" : "Tạo"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProjectModal;
