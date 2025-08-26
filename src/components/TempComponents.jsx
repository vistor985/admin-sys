import React from 'react';

// 临时组件 - 后续会被实际页面替换
export const Profile = () => (
  <div>
    <h1>个人信息</h1>
    <p>编辑个人资料</p>
  </div>
);

export const Settings = () => (
  <div>
    <h1>系统设置</h1>
    <p>系统配置选项</p>
  </div>
);

// 受保护的路由组件
export const ProtectedRoute = ({ children }) => {
  const useAuthStore = require('../store/authStore').default;
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    const { Navigate } = require('react-router-dom');
    return React.createElement(Navigate, { to: '/login', replace: true });
  }

  return children;
};

// 登录路由组件
export const LoginRoute = ({ children }) => {
  const useAuthStore = require('../store/authStore').default;
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    const { Navigate } = require('react-router-dom');
    return React.createElement(Navigate, { to: '/dashboard', replace: true });
  }

  return children;
};
