// src/store/authStore.js - 用户认证状态管理

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 创建认证状态存储
const useAuthStore = create(
  // persist 中间件让数据可以保存到浏览器
  persist(
    (set, get) => ({
      // 📊 状态数据
      user: null, // 当前用户信息
      token: null, // 认证令牌
      isLoggedIn: false, // 是否已登录

      // 🔑 登录操作
      login: (userData) => {
        console.log('🔑 用户登录:', userData);

        // 更新状态：设置用户信息
        set({
          user: userData,
          token: userData.token || 'mock-token-' + Date.now(),
          isLoggedIn: true,
        });

        console.log('✅ 登录状态已更新');
      },

      // 🚪 退出登录操作
      logout: () => {
        console.log('🚪 用户退出登录');

        // 清空所有用户信息
        set({
          user: null,
          token: null,
          isLoggedIn: false,
        });

        console.log('✅ 已清空登录状态');
      },

      // 🔄 更新用户信息
      updateUser: (newUserData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...newUserData },
          });
          console.log('🔄 用户信息已更新:', newUserData);
        }
      },

      // 👤 获取当前用户
      getCurrentUser: () => {
        return get().user;
      },

      // 🔍 检查是否为管理员
      isAdmin: () => {
        const user = get().user;
        return user && user.role === 'admin';
      },
    }),
    {
      name: 'auth-storage', // 浏览器存储的键名
      // 只保存这些重要数据
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export { useAuthStore };
