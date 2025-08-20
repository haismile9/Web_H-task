import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import AnimatedBackground from "../components/AnimatedBackground";
import AuthHeader from "../components/auth/AuthHeader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập mã, 3: Đặt mật khẩu mới
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string[]}>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 phút = 600 giây
  const navigate = useNavigate();

  // Đếm ngược thời gian
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  // Format thời gian mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendCode = async () => {
    try {
      setErrors({});
      setGeneralError("");
      setLoading(true);
      
      await axios.get("/sanctum/csrf-cookie");
      await axios.post("/password/reset/send-code", { email });
      
      setStep(2);
      setTimeLeft(600); // Reset timer
      setCode(""); // Reset code
    } catch (err: any) {
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {};
        setErrors(validationErrors);
      } else {
        setGeneralError(err.response?.data?.message || "Gửi mã thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setGeneralError("");
      setLoading(true);
      
      await axios.post("/password/reset/send-code", { email });
      
      setTimeLeft(600); // Reset timer
      setCode(""); // Reset code
      setGeneralError("");
    } catch (err: any) {
      setGeneralError("Gửi lại mã thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setErrors({});
      setGeneralError("");
      setLoading(true);
      
      console.log('🔍 Verifying code:', { email, code }); // Debug log
      
      const response = await axios.post("/password/reset/verify-code", { email, code });
      
      console.log('✅ Verify success:', response.data); // Debug log
      setStep(3);
    } catch (err: any) {
      console.error('❌ Verify error:', err.response?.data); // Debug log chi tiết
      console.error('❌ Full error:', err); // Debug full error
      
      if (err.response?.status === 422) {
        const errorData = err.response.data;
        console.log('🚨 422 Error details:', errorData);
        
        if (errorData.errors) {
          setErrors(errorData.errors);
        }
        setGeneralError(errorData.message || "Mã không hợp lệ hoặc đã hết hạn");
      } else {
        setGeneralError("Xác thực mã thất bại. Vui lòng thử lại.");
      }
      // Không reset code khi lỗi để user có thể thử lại
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setErrors({});
      setGeneralError("");
      setLoading(true);
      
      console.log('Resetting password:', { email, code, password: password ? '***' : '' }); // Debug log
      
      await axios.post("/password/reset", {
        email,
        code,
        password,
        password_confirmation: passwordConfirmation,
      });
      
      console.log('Reset success'); // Debug log
      
      alert("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.");
      navigate("/");
    } catch (err: any) {
      console.error('Reset error:', err.response); // Debug log
      
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {};
        setErrors(validationErrors);
        if (!Object.keys(validationErrors).length) {
          setGeneralError(err.response?.data?.message || "Đặt lại mật khẩu thất bại");
        }
      } else {
        setGeneralError("Đặt lại mật khẩu thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <AuthHeader 
        title="Quên mật khẩu" 
        subtitle="Nhập email để nhận mã reset mật khẩu"
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

      {generalError && (
        <div className="alert alert-error mb-4 bg-red-50 border-red-200 text-red-700">
          <span>{generalError}</span>
        </div>
      )}

      <button 
        onClick={handleSendCode}
        disabled={loading}
        className="btn w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-none shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
      >
        {loading ? "Đang gửi..." : "Gửi mã reset"}
      </button>
    </>
  );

  const renderStep2 = () => (
    <>
      <AuthHeader 
        title="Xác thực mã" 
        subtitle={`Mã xác thực đã được gửi đến ${email}`}
      />

      {timeLeft > 0 && (
        <div className="text-center mb-3">
          <span className="text-sm text-gray-600">
            Mã sẽ hết hạn sau: <span className="font-bold text-blue-600">{formatTime(timeLeft)}</span>
          </span>
        </div>
      )}

      <div className="form-control mb-4">
        <input
          type="text"
          placeholder="Nhập mã 6 chữ số"
          className="input input-bordered w-full bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 border-gray-300 focus:border-blue-500 focus:bg-white text-center text-2xl tracking-widest"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
          maxLength={6}
        />
      </div>

      {generalError && (
        <div className="alert alert-error mb-4 bg-red-50 border-red-200 text-red-700">
          <span>{generalError}</span>
        </div>
      )}

      <button 
        onClick={handleVerifyCode}
        disabled={loading || code.length !== 6}
        className="btn w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-none shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 mb-3"
      >
        {loading ? "Đang xác thực..." : "Xác thực mã"}
      </button>

      <div className="flex justify-between gap-3 mb-3">
        <button 
          onClick={() => setStep(1)}
          className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg border border-white/30 transition-colors duration-200"
        >
          ← Quay lại
        </button>
        
        {timeLeft === 0 ? (
          <button 
            onClick={handleResendCode}
            disabled={loading}
            className="flex-1 bg-blue-500/80 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg border border-blue-400 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Gửi lại mã"}
          </button>
        ) : (
          <div className="flex-1 bg-gray-500/50 text-white/70 font-medium py-2 px-4 rounded-lg border border-gray-400/50 text-center">
            Gửi lại sau {timeLeft}s
          </div>
        )}
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <AuthHeader 
        title="Đặt mật khẩu mới" 
        subtitle="Nhập mật khẩu mới cho tài khoản của bạn"
      />

      <div className="form-control mb-4">
        <input
          type="password"
          placeholder="Mật khẩu mới"
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

      <div className="form-control mb-4">
        <input
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          className="input input-bordered w-full bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 border-gray-300 focus:border-blue-500 focus:bg-white"
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
        onClick={handleResetPassword}
        disabled={loading}
        className="btn w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-none shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
      >
        {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
      </button>
    </>
  );

  return (
    <div className="relative h-screen flex justify-center items-center">
      <AnimatedBackground />
      
      <div className="relative z-10 card w-96 bg-white/90 backdrop-blur-sm shadow-2xl border border-white/20 animate-fade-in-up">
        <div className="card-body">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <p className="text-sm mt-4 text-center text-gray-600">
            <a href="/" className="link text-blue-600 hover:text-cyan-600 font-semibold">
              Quay lại đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
