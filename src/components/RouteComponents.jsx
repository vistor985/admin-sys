import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

// 受保护的路由组件
export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// 登录路由组件
export const LoginRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};
