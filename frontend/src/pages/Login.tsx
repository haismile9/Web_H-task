import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../api/project/useProjects";
import API from "../api/axios";


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
  try {
    await API.get("/sanctum/csrf-cookie");
    const res = await API.post("/login", { email, password });
    console.log(res.data); // xem response có token ko?

    // Nếu có token (ví dụ: res.data.token)
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    // Gọi lấy user
    const userRes = await API.get("/user");
    localStorage.setItem("user", JSON.stringify(userRes.data));

    navigate("/dashboard");
  } catch (err: any) {
    console.error("Login failed", err);
    setError("Sai email hoặc mật khẩu");
  }
};


  return (
    <div className="h-screen flex justify-center items-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Đăng nhập</h2>

          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="input input-bordered w-full mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-error text-sm">{error}</p>}

          <button onClick={handleLogin} className="btn btn-primary w-full">
            Đăng nhập
          </button>

          <p className="text-sm mt-4 text-center">
            Chưa có tài khoản?{" "}
            <a href="/register" className="link link-primary">
              Đăng ký
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
