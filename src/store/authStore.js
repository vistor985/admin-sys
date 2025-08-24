import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 模拟用户数据（实际项目中这些数据来自后端）
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    role: 'admin',
    name: '超级管理员',
    avatar: null,
    permissions: ['dashboard', 'users', 'products', 'logs'],
  },
  {
    id: 2,
    username: 'editor',
    password: '123456',
    role: 'editor',
    name: '编辑员',
    avatar: null,
    permissions: ['dashboard', 'products'],
  },
  {
    id: 3,
    username: 'viewer',
    password: '123456',
    role: 'viewer',
    name: '查看员',
    avatar: null,
    permissions: ['dashboard'],
  },
];

// 创建认证状态管理
const useAuthStore = create(
  persist(
    (set, get) => ({
      // 当前登录用户信息
      user: null,

      // 登录状态
      isLoggedIn: false,

      // 登录加载状态
      loading: false,

      // 登录方法
      login: async (username, password) => {
        set({ loading: true });

        try {
          // 模拟网络请求延迟
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // 查找用户
          const user = mockUsers.find(
            (u) => u.username === username && u.password === password
          );

          if (user) {
            // 登录成功
            const { password: _, ...userInfo } = user; // 移除密码字段
            set({
              user: userInfo,
              isLoggedIn: true,
              loading: false,
            });
            return { success: true };
          } else {
            // 登录失败
            set({ loading: false });
            return {
              success: false,
              message: '用户名或密码错误',
            };
          }
        } catch (error) {
          set({ loading: false });
          return {
            success: false,
            message: '登录失败，请重试',
          };
        }
      },

      // 登出方法
      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
        });
      },

      // 检查权限
      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        return user.permissions.includes(permission);
      },

      // 获取用户角色
      getUserRole: () => {
        const { user } = get();
        return user?.role || null;
      },
    }),
    {
      name: 'auth-storage', // 本地存储key
      // 只持久化用户信息和登录状态，不持久化loading状态
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useAuthStore;
