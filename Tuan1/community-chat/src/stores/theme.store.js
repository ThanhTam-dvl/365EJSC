import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // State
      isDarkMode: false,
      
      // Actions
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),
      
      // Computed
      themeClass: () => get().isDarkMode ? 'dark' : 'light',
    }),
    {
      name: 'theme-storage', 
    }
  )
);

export const useTheme = () => {
  const { isDarkMode, toggleTheme, setDarkMode, themeClass } = useThemeStore();
  
  return {
    isDarkMode,
    toggleTheme,
    setDarkMode,
    themeClass: themeClass(),
  };
};