import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  authenticateUser, 
  createUser, 
  updateUser, 
  findUserByUsername,
  checkUsernameExists,
  checkLoginUsernameExists 
} from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Actions 
      login: async (loginUsername, password) => {
        set({ isLoading: true });
        
        try {
          const result = await authenticateUser(loginUsername, password);
          
          if (result.success) {
            set({ 
              currentUser: result.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true, user: result.user };
          } else {
            set({ isLoading: false });
            return { success: false, error: result.error };
          }
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Đăng nhập thất bại. Vui lòng thử lại.' };
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true });
        
        try {
          // Check if username already exists
          const usernameExists = await checkUsernameExists(userData.username);
          if (usernameExists) {
            set({ isLoading: false });
            return { success: false, error: 'Tên hiển thị đã được sử dụng' };
          }

          // Check if loginUsername already exists
          const loginExists = await checkLoginUsernameExists(userData.loginUsername);
          if (loginExists) {
            set({ isLoading: false });
            return { success: false, error: 'Tên đăng nhập đã được sử dụng' };
          }

          // Create user in MockAPI
          const response = await createUser(userData);
          const newUser = response.data;
          
          set({ 
            currentUser: { ...newUser, password: undefined },
            isAuthenticated: true,
            isLoading: false,
          });
          
          return { success: true, user: { ...newUser, password: undefined } };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Đăng ký thất bại. Vui lòng thử lại.' };
        }
      },
      
      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          isLoading: false,
        });
        localStorage.removeItem('username');
      },
      
      updateProfile: async (userData) => {
        const { currentUser } = get();
        if (currentUser) {
          try {
            // Update user in MockAPI
            const response = await updateUser(currentUser.id, {
              ...currentUser,
              ...userData
            });
            const updatedUser = response.data;
            
            set({ 
              currentUser: { ...updatedUser, password: undefined }
            });
            
            // Update localStorage username if changed
            if (userData.username && userData.username !== localStorage.getItem('username')) {
              localStorage.setItem('username', userData.username);
            }
            
            return { success: true, user: { ...updatedUser, password: undefined } };
          } catch (error) {
            return { success: false, error: 'Cập nhật thất bại' };
          }
        }
        return { success: false, error: 'Không tìm thấy user' };
      },
      
      changePassword: async (currentPassword, newPassword) => {
        const { currentUser } = get();
        if (!currentUser) {
          return { success: false, error: 'Không tìm thấy user' };
        }

        try {
          // Verify current password
          const user = await findUserByUsername(currentUser.username);
          if (!user || user.password !== currentPassword) {
            return { success: false, error: 'Mật khẩu hiện tại không đúng' };
          }

          // Update password in MockAPI
          await updateUser(currentUser.id, { ...user, password: newPassword });
          return { success: true };
        } catch (error) {
          return { success: false, error: 'Đổi mật khẩu thất bại' };
        }
      },
      
      // Check if user is in guest mode 
      isGuestMode: () => {
        const username = localStorage.getItem('username');
        const { currentUser, isAuthenticated } = get();
        return username && (!currentUser || !isAuthenticated);
      },
      
      // Convert guest to authenticated user
      convertToAuthenticated: async (userData) => {
        const username = localStorage.getItem('username');
        if (username) {
          try {
            // Check if loginUsername already exists
            const loginExists = await checkLoginUsernameExists(userData.loginUsername);
            if (loginExists) {
              return { success: false, error: 'Tên đăng nhập đã được sử dụng' };
            }

            // Create user 
            const newUserData = {
              username: username,
              loginUsername: userData.loginUsername,
              password: userData.password,
              avatar: userData.avatar || '',
              avatarUrl: userData.avatarUrl || '',
            };
            
            const response = await createUser(newUserData);
            const newUser = response.data;
            
            set({
              currentUser: { ...newUser, password: undefined },
              isAuthenticated: true,
            });
            
            return { success: true, user: { ...newUser, password: undefined } };
          } catch (error) {
            return { success: false, error: 'Tạo tài khoản thất bại. Vui lòng thử lại.' };
          }
        }
        return { success: false, error: 'Không tìm thấy username' };
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useAuth = () => {
  const {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isGuestMode,
    convertToAuthenticated,
  } = useAuthStore();
  
  return {
    currentUser,
    isAuthenticated: isAuthenticated && !!currentUser,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isGuestMode: isGuestMode(),
    convertToAuthenticated,
  };
};