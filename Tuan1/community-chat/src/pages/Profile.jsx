// pages/Profile.jsx
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from '../stores/auth.store';
import { useNotifications } from '../stores/notification.store';

export default function Profile() {
  const { currentUser, isAuthenticated, updateProfile, convertToAuthenticated, changePassword, isGuestMode } = useAuth();
  const { success, error: notifyError } = useNotifications();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || '');

  const profileForm = useForm({
    defaultValues: {
      loginUsername: currentUser?.loginUsername || '',
      displayName: currentUser?.username || localStorage.getItem('username') || '',
      avatar: currentUser?.avatar || '',
    }
  });

  const passwordForm = useForm();

  const onProfileSubmit = async (data) => {
    try {
      if (isGuestMode && !isAuthenticated) {
        const result = await convertToAuthenticated({
          loginUsername: data.loginUsername,
          password: data.password,
          avatar: data.avatar,
        });

        if (result.success) {
          success('Tài khoản đã được bảo vệ thành công!');
          setActiveTab('profile');
        } else {
          notifyError(result.error);
        }
      } else {
        const result = await updateProfile({
          loginUsername: data.loginUsername,
          username: data.displayName,
          avatar: data.avatar,
        });

        if (result.success) {
          success('Thông tin đã được cập nhật!');
          // Update localStorage username if changed
          if (data.displayName !== localStorage.getItem('username')) {
            localStorage.setItem('username', data.displayName);
          }
        } else {
          notifyError(result.error);
        }
      }
    } catch (error) {
      notifyError('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      notifyError('Mật khẩu xác nhận không khớp');
      return;
    }

    const result = await changePassword(data.currentPassword, data.newPassword);
    
    if (result.success) {
      success('Mật khẩu đã được thay đổi thành công!');
      passwordForm.reset();
    } else {
      notifyError(result.error);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        notifyError('Vui lòng chọn file ảnh');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        notifyError('Kích thước ảnh không được vượt quá 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setAvatarPreview(base64);
        profileForm.setValue('avatar', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview('');
    profileForm.setValue('avatar', '');
  };

  if (!currentUser && !isGuestMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Vui lòng đăng nhập để xem profile</p>
        </div>
      </div>
    );
  }

  const displayName = currentUser?.username || localStorage.getItem('username');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-blue-200 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              {avatarPreview ? (
                <div className="relative">
                  <img 
                    src={avatarPreview} 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-full mx-auto border-4 border-blue-200 dark:border-gray-600 object-cover"
                  />
                  <button
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto border-4 border-blue-200 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-2xl text-gray-500 dark:text-gray-400 font-bold">
                    {displayName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">
              {displayName}
            </h2>
            <p className="text-blue-600 dark:text-blue-400">
              {isGuestMode ? 'Guest Mode - Chưa được bảo vệ' : 'Tài khoản đã được bảo vệ'}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Thông tin
            </button>
            {!isGuestMode && (
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Đổi mật khẩu
              </button>
            )}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="w-16 h-16 rounded-full border-2 border-blue-200 dark:border-gray-600 object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full border-2 border-blue-200 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-lg text-gray-500 dark:text-gray-400 font-bold">
                          {displayName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block">
                      <span className="sr-only">Chọn avatar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="block w-full text-sm text-gray-500 dark:text-gray-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-300
                          hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                      />
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PNG, JPG, GIF tối đa 2MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên hiển thị *
                </label>
                <input
                  type="text"
                  className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  {...profileForm.register("displayName", {
                    required: "Tên hiển thị là bắt buộc",
                    minLength: {
                      value: 2,
                      message: "Tên hiển thị phải có ít nhất 2 ký tự"
                    }
                  })}
                />
                {profileForm.formState.errors.displayName && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {profileForm.formState.errors.displayName.message}
                  </p>
                )}
              </div>

              {/* Login Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên đăng nhập *
                </label>
                <input
                  type="text"
                  className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  {...profileForm.register("loginUsername", {
                    required: "Tên đăng nhập là bắt buộc",
                    minLength: {
                      value: 3,
                      message: "Tên đăng nhập phải có ít nhất 3 ký tự"
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Chỉ được chứa chữ cái, số và dấu gạch dưới"
                    }
                  })}
                />
                {profileForm.formState.errors.loginUsername && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {profileForm.formState.errors.loginUsername.message}
                  </p>
                )}
              </div>

              {/* Password for guest mode conversion */}
              {isGuestMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mật khẩu mới *
                  </label>
                  <input
                    type="password"
                    className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    {...profileForm.register("password", {
                      required: "Mật khẩu là bắt buộc",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự"
                      }
                    })}
                  />
                  {profileForm.formState.errors.password && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                      {profileForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
              )}

              {/* Hidden avatar field */}
              <input type="hidden" {...profileForm.register("avatar")} />

              <button
                type="submit"
                disabled={profileForm.formState.isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {profileForm.formState.isSubmitting ? 'Đang lưu...' : 
                 isGuestMode ? 'Bảo vệ tài khoản' : 'Cập nhật thông tin'}
              </button>
            </form>
          )}

          {/* Password Change Tab */}
          {activeTab === 'password' && !isGuestMode && (
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mật khẩu hiện tại *
                </label>
                <input
                  type="password"
                  className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  {...passwordForm.register("currentPassword", {
                    required: "Vui lòng nhập mật khẩu hiện tại"
                  })}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mật khẩu mới *
                </label>
                <input
                  type="password"
                  className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  {...passwordForm.register("newPassword", {
                    required: "Vui lòng nhập mật khẩu mới",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự"
                    }
                  })}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Xác nhận mật khẩu mới *
                </label>
                <input
                  type="password"
                  className="w-full border border-blue-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  {...passwordForm.register("confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu mới"
                  })}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={passwordForm.formState.isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                {passwordForm.formState.isSubmitting ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}