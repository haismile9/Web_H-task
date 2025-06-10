import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

interface Props {
  projectId: number;
  onSuccess?: () => void;
}

interface User {
  id: number;
  name: string;
}

const AssignModal: React.FC<Props> = ({ projectId, onSuccess }) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  // 🧠 Gọi lấy danh sách user khi modal mở
  useEffect(() => {
    if (show) {
      axios
        .post("/api/users")
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Lỗi lấy users", err));
    }
  }, [show]);

  const handleSubmit = async () => {
    try {
      await axios.post(`/api/projects/${projectId}/tasks`, {
        name,
        description,
        deadline,
        assigned_user_id: assignedUser,
      });

      setShow(false);
      setName("");
      setDescription("");
      setDeadline("");
      setAssignedUser("");
      setError("");

      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError("Không thể tạo task.");
    }
  };

  return (
    <>
      <button onClick={() => setShow(true)} className="btn btn-outline btn-accent btn-sm">
        📌 Gán công việc
      </button>

      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Tạo Task mới</h2>

            <input
              type="text"
              placeholder="Tên task"
              className="input input-bordered w-full mb-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              placeholder="Mô tả"
              className="textarea textarea-bordered w-full mb-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="date"
              className="input input-bordered w-full mb-3"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <select
              className="select select-bordered w-full mb-3"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
            >
              <option value="">-- Chọn người nhận task --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>

            {error && <p className="text-error text-sm">{error}</p>}

            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-sm" onClick={() => setShow(false)}>Hủy</button>
              <button className="btn btn-sm btn-primary" onClick={handleSubmit}>Tạo</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignModal;
