import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import AuthHeader from "../components/auth/AuthHeader";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string[]}>({});
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleRegister = async () => {
    try {
      // Reset errors
      setErrors({});
      setGeneralError("");
      
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
      if (err.response?.status === 422) {
        // Validation errors
        const validationErrors = err.response.data.errors || {};
        setErrors(validationErrors);
      } else {
        // General error
        setGeneralError(err.response?.data?.message || "Đăng ký thất bại");
      }
    }
  };


  return (
    <div className="relative h-screen flex justify-center items-center">
      <AnimatedBackground />
      
      <div className="relative z-10 card w-96 bg-white/90 backdrop-blur-sm shadow-2xl border border-white/20 animate-fade-in-up">
        <div className="card-body">
          <AuthHeader 
            title="Đăng ký tài khoản" 
            subtitle="Tham gia cùng chúng tôi ngay hôm nay!"
          />

          <div className="form-control mb-4">
            <input 
              type="text" 
              placeholder="Họ tên" 
              className={`input input-bordered bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 ${errors.name ? 'input-error border-red-500' : 'border-gray-300 focus:border-blue-500 focus:bg-white'}`}
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            {errors.name && (
              <div className="text-red-500 text-sm mt-1">
                {errors.name.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          <div className="form-control mb-4">
            <input 
              type="email" 
              placeholder="Email" 
              className={`input input-bordered bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 ${errors.email ? 'input-error border-red-500' : 'border-gray-300 focus:border-blue-500 focus:bg-white'}`}
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
              className={`input input-bordered bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 ${errors.password ? 'input-error border-red-500' : 'border-gray-300 focus:border-blue-500 focus:bg-white'}`}
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

          <div className="form-control mb-4">
            <input 
              type="password" 
              placeholder="Xác nhận mật khẩu" 
              className="input input-bordered bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 border-gray-300 focus:border-blue-500 focus:bg-white"
              value={passwordConfirmation} 
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>

          {generalError && (
            <div className="alert alert-error mb-4 bg-red-50 border-red-200 text-red-700">
              <span>{generalError}</span>
            </div>
          )}

          <button 
            className="btn w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-none shadow-lg transform hover:scale-105 transition-all duration-200" 
            onClick={handleRegister}
          >
            Đăng ký
          </button>

          <p className="text-sm mt-4 text-center text-gray-600">
            Đã có tài khoản? <a href="/" className="link text-blue-600 hover:text-cyan-600 font-semibold">Đăng nhập</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
