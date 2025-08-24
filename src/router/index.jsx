import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Login from '../pages/Login';
import useAuthStore from '../store/authStore';

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// 登录路由组件（已登录用户不能访问登录页）
const LoginRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 临时的页面组件（后续章节会替换）
const Dashboard = () => (
  <div>
    <h1>仪表盘</h1>
    <p>欢迎来到管理系统仪表盘！</p>
  </div>
);

const UserManage = () => (
  <div>
    <h1>用户管理</h1>
    <p>用户管理功能正在开发中...</p>
  </div>
);

const ProductManage = () => (
  <div>
    <h1>商品管理</h1>
    <p>商品管理功能正在开发中...</p>
  </div>
);

const LogManage = () => (
  <div>
    <h1>日志管理</h1>
    <p>日志管理功能正在开发中...</p>
  </div>
);

// 创建路由配置
const router = createBrowserRouter([
  // 登录路由
  {
    path: '/login',
    element: (
      <LoginRoute>
        <Login />
      </LoginRoute>
    ),
  },

  // 主应用路由
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      // 默认重定向到仪表盘
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      // 仪表盘
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      // 用户管理
      {
        path: 'users',
        element: <UserManage />,
      },
      // 商品管理
      {
        path: 'products',
        element: <ProductManage />,
      },
      // 日志管理
      {
        path: 'logs',
        element: <LogManage />,
      },
    ],
  },

  // 404页面
  {
    path: '*',
    element: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <h1>404</h1>
        <p>页面未找到</p>
      </div>
    ),
  },
]);

export default router;
