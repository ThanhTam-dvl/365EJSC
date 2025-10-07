import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AdminLogin() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();
  
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  // Admin credentials (trong thực tế sẽ call API)
  const adminCredentials = {
    email: 'admin@tazi.com',
    password: 'admin123'
  };

  const onSubmit = async (data) => {
    try {
      setLoginError('');
      
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.email === adminCredentials.email && 
          data.password === adminCredentials.password) {
        localStorage.setItem('adminToken', 'admin-authenticated');
        localStorage.setItem('adminEmail', data.email);
        navigate('/admin');
      } else {
        setLoginError('Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      setLoginError('Đăng nhập thất bại, vui lòng thử lại');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-blue-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-2">Admin Login</h2>
          <p className="text-blue-600">Đăng nhập để quản lý hệ thống</p>
        </div>

        {loginError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email admin"
              className="w-full border border-blue-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              {...register("email", {
                required: "Email là bắt buộc",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email không hợp lệ"
                }
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full border border-blue-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              {...register("password", {
                required: "Mật khẩu là bắt buộc",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự"
                }
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 disabled:from-blue-200 disabled:to-blue-300 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md disabled:shadow-none"
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập Admin'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 text-center">
            <strong>Demo Credentials:</strong><br />
            Email: admin@tazi.com<br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
}