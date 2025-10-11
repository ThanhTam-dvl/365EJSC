import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  
  // Actions
  addNotification: (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      type: 'info', // 'success', 'error', 'warning', 'info'
      title: '',
      message: '',
      duration: 5000,
      ...notification,
    };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
    
    // Tự động xóa sau duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }
    
    return id;
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notif) => notif.id !== id),
    }));
  },
  
  clearAll: () => set({ notifications: [] }),
  
  // Helper actions cho các loại notification thông dụng
  success: (message, title = 'Thành công') => 
    get().addNotification({ type: 'success', title, message }),
  
  error: (message, title = 'Lỗi') => 
    get().addNotification({ type: 'error', title, message }),
  
  warning: (message, title = 'Cảnh báo') => 
    get().addNotification({ type: 'warning', title, message }),
  
  info: (message, title = 'Thông tin') => 
    get().addNotification({ type: 'info', title, message }),
}));

export const useNotifications = () => {
  const {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  } = useNotificationStore();
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };
};