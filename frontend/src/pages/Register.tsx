import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleRegister = async () => {
  try {
    await axios.get("/sanctum/csrf-cookie");

    await axios.post("/register", {
  name,
  email,
  password,
  password_confirmation: passwordConfirmation,
});

// ✅ Redirect sang verify, KHÔNG cần await response
navigate("/verify-email", {
  state: { name, email, password, password_confirmation: passwordConfirmation }
});

  } catch (err: any) {
    setError("Đăng ký thất bại");
  }
};


  return (
    <div className="h-screen flex justify-center items-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Đăng ký tài khoản</h2>

          <input type="text" placeholder="Họ tên" className="input input-bordered mb-3"
            value={name} onChange={(e) => setName(e.target.value)} />

          <input type="email" placeholder="Email" className="input input-bordered mb-3"
            value={email} onChange={(e) => setEmail(e.target.value)} />

          <input type="password" placeholder="Mật khẩu" className="input input-bordered mb-3"
            value={password} onChange={(e) => setPassword(e.target.value)} />

            <input type="password" placeholder="Xác nhận mật khẩu" className="input input-bordered mb-3"
            value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}
          />

          {error && <p className="text-error text-sm">{error}</p>}

          <button className="btn btn-primary w-full" onClick={handleRegister}>
            Đăng ký
          </button>

          <p className="text-sm mt-3 text-center">
            Đã có tài khoản? <a href="/" className="link link-primary">Đăng nhập</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
