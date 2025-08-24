import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 创建主题状态管理
const useThemeStore = create(
  persist(
    (set, get) => ({
      // 默认主题模式（light 或 dark）
      mode: 'light',

      // 切换主题
      toggleTheme: () => {
        const currentMode = get().mode;
        const newMode = currentMode === 'light' ? 'dark' : 'light';
        set({ mode: newMode });
      },

      // 设置指定主题
      setTheme: (mode) => {
        set({ mode });
      },
    }),
    {
      name: 'theme-storage', // 本地存储的key名
    }
  )
);

export default useThemeStore;
