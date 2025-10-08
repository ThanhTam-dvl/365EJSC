import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Join() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    watch 
  } = useForm();
  
  const navigate = useNavigate();
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [loginError, setLoginError] = useState('');

  const adminCredentials = {
    email: 'admin@tazi.com',
    password: 'admin123'
  };

  // User join submit
  const onUserJoin = (data) => {
    localStorage.setItem("username", data.username);
    navigate("/chat");
  };

  // Admin login submit
  const onAdminLogin = (data) => {
    try {
      setLoginError('');
      
      if (data.email === adminCredentials.email && 
          data.password === adminCredentials.password) {
        localStorage.setItem('adminToken', 'admin-authenticated');
        localStorage.setItem('adminEmail', data.email);
        navigate('/admin/analytics');
      } else {
        setLoginError('Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      setLoginError('Đăng nhập thất bại, vui lòng thử lại');
    }
  };

  const onSubmit = (data) => {
    if (isAdminLogin) {
      onAdminLogin(data);
    } else {
      onUserJoin(data);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 mt-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-blue-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-2">
            {isAdminLogin ? 'Admin Login' : 'Join TaZi Community Chat'}
          </h2>
          <p className="text-blue-600">
            {isAdminLogin 
              ? 'Đăng nhập để quản lý hệ thống' 
              : 'Nhập tên hay biệt danh của bro để bắt đầu chat với mọi người.'
            }
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={() => setIsAdminLogin(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !isAdminLogin 
                  ? 'bg-blue-500 text-white shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              User Join
            </button>
            <button
              onClick={() => setIsAdminLogin(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isAdminLogin 
                  ? 'bg-blue-500 text-white shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Admin Login
            </button>
          </div>
        </div>

        {loginError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isAdminLogin ? (
            /* User Join Form */
            <div>
              <input
                className="w-full border border-blue-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Nhập tên bro..."
                {...register("username", {
                  required: "Tên là bắt buộc",
                  minLength: {
                    value: 2,
                    message: "Tên phải có ít nhất 2 ký tự"
                  },
                  maxLength: {
                    value: 20,
                    message: "Tên không được quá 20 ký tự"
                  }
                })}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>
          ) : (
            /* Admin Login Form */
            <>
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
            </>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md disabled:opacity-50"
          >
            {isSubmitting 
              ? (isAdminLogin ? 'Đang đăng nhập...' : 'Đang tham gia...')
              : (isAdminLogin ? 'Đăng nhập Admin' : 'Tham gia Chat')
            }
          </button>
        </form>

        {/* Demo Tài khoản cho Admin */}
        {isAdminLogin && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              <strong>Tài khoản admin demo:</strong><br />
              Email: admin@tazi.com<br />
              Password: admin123
            </p>
          </div>
        )}
      </div>
    </div>
  );
}