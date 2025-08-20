import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import AnimatedBackground from "../components/AnimatedBackground";
import AuthHeader from "../components/auth/AuthHeader";
import { useAuth } from "../hooks/useAuth";


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string[]}>({});
  const [generalError, setGeneralError] = useState("");

  const handleLogin = async () => {
    try {
      // Reset errors
      setErrors({});
      setGeneralError("");
      
      await API.get("/sanctum/csrf-cookie");
      const res = await API.post("/login", { email, password });
      console.log(res.data); // xem response có token ko?

      // Nếu có token, sử dụng AuthContext
      if (res.data.token) {
        login(res.data.token);
        
        // Redirect đến trang người dùng muốn truy cập trước khi bị redirect đến login
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error("Login failed", err);
      if (err.response?.status === 422) {
        // Validation errors
        const validationErrors = err.response.data.errors || {};
        setErrors(validationErrors);
        if (!Object.keys(validationErrors).length) {
          // If no specific field errors, show general message
          setGeneralError(err.response?.data?.message || "Email hoặc mật khẩu không chính xác");
        }
      } else {
        // General error
        setGeneralError(err.response?.data?.message || "Đăng nhập thất bại");
      }
    }
  };


  return (
    <div className="relative h-screen flex justify-center items-center">
      <AnimatedBackground />
      
      <div className="relative z-10 card w-96 bg-white/90 backdrop-blur-sm shadow-2xl border border-white/20 animate-fade-in-up">
        <div className="card-body">
          <AuthHeader 
            title="Đăng nhập" 
            subtitle="Chào mừng bạn quay trở lại!"
          />

          <div className="form-control mb-4">
            <input
              type="email"
              placeholder="Email"
              className={`input input-bordered w-full bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 ${errors.email ? 'input-error border-red-500' : 'border-gray-300 focus:border-blue-500 focus:bg-white'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {errors.email.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          <div className="form-control mb-4">
            <input
              type="password"
              placeholder="Mật khẩu"
              className={`input input-bordered w-full bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 ${errors.password ? 'input-error border-red-500' : 'border-gray-300 focus:border-blue-500 focus:bg-white'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="text-red-500 text-sm mt-1">
                {errors.password.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          {generalError && (
            <div className="alert alert-error mb-4 bg-red-50 border-red-200 text-red-700">
              <span>{generalError}</span>
            </div>
          )}

          <button 
            onClick={handleLogin} 
            className="btn w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-none shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Đăng nhập
          </button>

          <p className="text-sm mt-2 text-center">
            <a href="/forgot-password" className="link text-blue-600 hover:text-cyan-600 font-semibold">
              Quên mật khẩu?
            </a>
          </p>

          <p className="text-sm mt-2 text-center text-gray-600">
            Chưa có tài khoản?{" "}
            <a href="/register" className="link text-blue-600 hover:text-cyan-600 font-semibold">
              Đăng ký
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
