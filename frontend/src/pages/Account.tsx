import { useEffect, useState } from "react";
import API from "../api/axios";

const Account = () => {
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/account").then((res) => {
      setUser(res.data);
      setName(res.data.name);
    });
  }, []);

  const handleUpdate = async () => {
    try {
      await API.put("/account", { name });
      setMessage("✅ Cập nhật thành công");
    } catch (err) {
      setMessage("❌ Có lỗi xảy ra");
    }
  };

  if (!user) return <div>Đang tải...</div>;

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Tài khoản của tôi</h1>

      <div className="space-y-4 bg-base-100 p-6 rounded shadow w-full max-w-lg">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="text" disabled value={user.email} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <button onClick={handleUpdate} className="btn btn-primary w-full">Cập nhật</button>
        {message && <p className="text-sm text-info">{message}</p>}
      </div>
    </div>
  );
};

export default Account;
