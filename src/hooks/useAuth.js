// src/hooks/useAuth.js - 认证 Hook
import { useCallback } from 'react';
import useAuthStore from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  const handleLogin = useCallback(
    async (credentials) => {
      try {
        // 模拟登录请求
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();
        login(data.user, data.token);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [login]
  );

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    logout,
  };
};
