import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyEmailForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async () => {
    try {
      const payload = {
        name: state?.name,
        email: state?.email,
        password: state?.password,
        password_confirmation: state?.password_confirmation,
        code,
      };

      const res = await axios.post("/verify-email", payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccess("Xác minh thành công!");
      setError("");
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Xác minh thất bại.");
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("/resend-code", { email: state?.email });
      setSuccess("Đã gửi lại mã xác minh.");
    } catch (err: any) {
      console.error(err);
      setError("Không thể gửi lại mã.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">🔐 Xác minh Email</h2>

          <input
            value={state?.email}
            disabled
            className="input input-bordered mb-2 bg-gray-100"
          />

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Nhập mã xác minh"
            className="input input-bordered mb-2"
          />

          {error && <p className="text-error text-sm">{error}</p>}
          {success && <p className="text-success text-sm">{success}</p>}

          <button className="btn btn-primary w-full" onClick={handleVerify}>
            Xác minh
          </button>
          <button className="btn btn-link mt-2" onClick={handleResend}>
            Gửi lại mã
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailForm;
