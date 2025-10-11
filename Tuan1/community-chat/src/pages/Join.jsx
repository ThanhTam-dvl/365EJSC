import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../stores/auth.store';
import { useNotifications } from '../stores/notification.store';
import { checkUsernameExists } from '../services/api';

export default function Join() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    watch,
    reset 
  } = useForm();
  
  const navigate = useNavigate();
  const [mode, setMode] = useState('guest'); // 'guest', 'login', 'register'
  const { login, register: registerUser, isGuestMode: isGuest, convertToAuthenticated } = useAuth();
  const { success, error: notifyError } = useNotifications();

  const adminCredentials = {
    email: 'admin@tazi.com',
    password: 'admin123'
  };

  // Trong component Join, sửa onGuestJoin:
const onGuestJoin = async (data) => {
  try {
    // Kiểm tra username đã được bảo vệ chưa
    const usernameExists = await checkUsernameExists(data.username);
    if (usernameExists) {
      notifyError('Tên này đã được bảo vệ. Vui lòng chọn tên khác hoặc đăng nhập.');
      return;
    }
    
    localStorage.setItem("username", data.username);
    success(`Chào mừng ${data.username} đến với TaZi Chat!`);
    navigate("/chat");
  } catch (error) {
    console.error('Guest join error:', error);
    // Nếu có lỗi kiểm tra, vẫn cho phép join (fallback)
    localStorage.setItem("username", data.username);
    success(`Chào mừng ${data.username} đến với TaZi Chat!`);
    navigate("/chat");
  }
};

  // User login submit
  const onUserLogin = async (data) => {
    const result = await login(data.loginUsername, data.password);
    
    if (result.success) {
      localStorage.setItem("username", result.user.username);
      success(`Chào mừng trở lại, ${result.user.username}!`);
      navigate("/chat");
    } else {
      notifyError(result.error);
    }
  };

  // User register submit
  const onUserRegister = async (data) => {
    // Kiểm tra mật khẩu xác nhận
    if (data.password !== data.confirmPassword) {
      notifyError('Mật khẩu xác nhận không khớp');
      return;
    }

    const userData = {
      loginUsername: data.loginUsername,
      password: data.password,
      username: data.displayName,
      avatar: data.avatar || '',
    };

    const result = await registerUser(userData);
    
    if (result.success) {
      localStorage.setItem("username", result.user.username);
      success(`Đăng ký thành công! Chào mừng ${result.user.username}!`);
      navigate("/chat");
    } else {
      notifyError(result.error);
    }
  };

  // Admin login submit
  const onAdminLogin = (data) => {
    try {
      if (data.email === adminCredentials.email && 
          data.password === adminCredentials.password) {
        localStorage.setItem('adminToken', 'admin-authenticated');
        localStorage.setItem('adminEmail', data.email);
        success('Đăng nhập Admin thành công!');
        navigate('/admin/analytics');
      } else {
        notifyError('Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      notifyError('Đăng nhập thất bại, vui lòng thử lại');
    }
  };

  const onSubmit = async (data) => {
    if (mode === 'admin') {
      onAdminLogin(data);
    } else if (mode === 'login') {
      onUserLogin(data);
    } else if (mode === 'register') {
      onUserRegister(data);
    } else {
      onGuestJoin(data);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    reset();
  };

  const getTitle = () => {
    switch (mode) {
      case 'admin': return 'Admin Login';
      case 'login': return 'Đăng nhập';
      case 'register': return 'Đăng ký tài khoản';
      default: return 'Join TaZi Community Chat';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'admin': return 'Đăng nhập để quản lý hệ thống';
      case 'login': return 'Đăng nhập vào tài khoản của bạn';
      case 'register': return 'Tạo tài khoản mới để bảo vệ danh tính';
      default: return 'Nhập tên hay biệt danh của bro để bắt đầu chat với mọi người.';
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 mt-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md border border-blue-200 dark:border-gray-700 transition-colors duration-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-2">
            {getTitle()}
          </h2>
          <p className="text-blue-600 dark:text-blue-400">
            {getDescription()}
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 flex flex-wrap justify-center gap-1">
            <button
              onClick={() => switchMode('guest')}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === 'guest' 
                  ? 'bg-blue-500 text-white shadow' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              Guest
            </button>
            <button
              onClick={() => switchMode('login')}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === 'login' 
                  ? 'bg-blue-500 text-white shadow' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === 'register' 
                  ? 'bg-blue-500 text-white shadow' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              Đăng ký
            </button>
            <button
              onClick={() => switchMode('admin')}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === 'admin' 
                  ? 'bg-blue-500 text-white shadow' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === 'guest' && (
            /* Guest Join Form */
            <div>
              <input
                className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
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
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>
          )}

          {mode === 'login' && (
            /* User Login Form */
            <>
              <div>
                <input
                  type="text"
                  placeholder="Tên đăng nhập"
                  className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  {...register("loginUsername", {
                    required: "Tên đăng nhập là bắt buộc",
                    minLength: {
                      value: 3,
                      message: "Tên đăng nhập phải có ít nhất 3 ký tự"
                    }
                  })}
                />
                {errors.loginUsername && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.loginUsername.message}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  {...register("password", {
                    required: "Mật khẩu là bắt buộc",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự"
                    }
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
            </>
          )}

          {mode === 'register' && (
            /* User Register Form */
            <>
              <div>
                <input
                  type="text"
                  placeholder="Tên đăng nhập (để đăng nhập)"
                  className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  {...register("loginUsername", {
                    required: "Tên đăng nhập là bắt buộc",
                    minLength: {
                      value: 3,
                      message: "Tên đăng nhập phải có ít nhất 3 ký tự"
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
                    }
                  })}
                />
                {errors.loginUsername && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.loginUsername.message}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Tên hiển thị"
                  className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  {...register("displayName", {
                    required: "Tên hiển thị là bắt buộc",
                    minLength: {
                      value: 2,
                      message: "Tên hiển thị phải có ít nhất 2 ký tự"
                    },
                    maxLength: {
                      value: 20,
                      message: "Tên hiển thị không được quá 20 ký tự"
                    }
                  })}
                />
                {errors.displayName && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.displayName.message}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  {...register("password", {
                    required: "Mật khẩu là bắt buộc",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự"
                    }
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  {...register("confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu"
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </>
          )}

          {mode === 'admin' && (
            /* Admin Login Form */
            <>
              <div>
                <input
                  type="email"
                  placeholder="Email admin"
                  className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  {...register("email", {
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Email không hợp lệ"
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  {...register("password", {
                    required: "Mật khẩu là bắt buộc",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự"
                    }
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.password.message}</p>
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
              ? (mode === 'admin' ? 'Đang đăng nhập...' : 
                 mode === 'login' ? 'Đang đăng nhập...' :
                 mode === 'register' ? 'Đang đăng ký...' : 'Đang tham gia...')
              : (mode === 'admin' ? 'Đăng nhập Admin' : 
                 mode === 'login' ? 'Đăng nhập' :
                 mode === 'register' ? 'Đăng ký' : 'Tham gia Chat')
            }
          </button>
        </form>

        {/* Demo Tài khoản cho Admin */}
        {mode === 'admin' && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-gray-600">
            <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
              <strong>Tài khoản admin demo:</strong><br />
              Email: admin@tazi.com<br />
              Password: admin123
            </p>
          </div>
        )}

        {/* Thông báo guest mode */}
        {mode === 'guest' && isGuest && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <p className="text-sm text-yellow-700 dark:text-yellow-300 text-center">
              Bạn đang sử dụng guest mode. Đăng ký tài khoản để bảo vệ danh tính!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}