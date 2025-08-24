import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import useAuthStore from '../store/authStore';
import UserManage from '../pages/UserManage';
import UserAdd from '../pages/UserManage/UserAdd';
import UserList from '../pages/UserManage/UserList';
import ProductCard from '../pages/ProductManage/ProductCard';
import ProductManage from '../pages/ProductManage';
import ProductForm from '../pages/ProductManage/ProductForm';
import ProductList from '../pages/ProductManage/ProductList';
import RoleManage from '../pages/RoleManage';
import LogManage from '../pages/Log';

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// 登录路由组件
const LoginRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 临时页面组件（后续会替换）
// const UserManage = () => (
//   <div>
//     <h1>用户管理</h1>
//     <p>用户管理功能正在开发中...</p>
//     <p>当前路径：{window.location.pathname}</p>
//   </div>
// );

// const UserList = () => (
//   <div>
//     <h1>用户列表</h1>
//     <p>显示所有用户的列表</p>
//   </div>
// );

// const UserAdd = () => (
//   <div>
//     <h1>添加用户</h1>
//     <p>添加新用户的表单</p>
//   </div>
// );

// const ProductManage = () => (
//   <div>
//     <h1>商品管理</h1>
//     <p>商品管理功能正在开发中...</p>
//     <p>当前路径：{window.location.pathname}</p>
//   </div>
// );

// const ProductList = () => (
//   <div>
//     <h1>商品列表</h1>
//     <p>显示所有商品的列表</p>
//   </div>
// );

// const ProductAdd = () => (
//   <div>
//     <h1>添加商品</h1>
//     <p>添加新商品的表单</p>
//   </div>
// );

// const LogManage = () => (
//   <div>
//     <h1>日志管理</h1>
//     <p>查看系统操作日志</p>
//   </div>
// );

const Profile = () => (
  <div>
    <h1>个人信息</h1>
    <p>编辑个人资料</p>
  </div>
);

const Settings = () => (
  <div>
    <h1>系统设置</h1>
    <p>系统配置选项</p>
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
      // 根路径重定向到仪表盘
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },

      // 仪表盘
      {
        path: 'dashboard',
        element: <Dashboard />,
      },

      // 用户管理路由组
      {
        path: 'users',
        element: <UserManage />,
        children: [
          {
            index: true,
            element: <Navigate to="/users/list" replace />,
          },
        ],
      },
      {
        path: 'users/list',
        element: <UserList />,
      },
      {
        path: 'users/add',
        element: <UserAdd />,
      },

      // 商品管理路由组
      {
        path: 'products',
        element: <ProductManage />,
        children: [
          {
            index: true,
            element: <Navigate to="/products/list" replace />,
          },
        ],
      },
      {
        path: 'products/list',
        element: <ProductList />,
      },
      // {
      //   path: 'products/add',
      //   element: <ProductAdd />,
      // },

      // 日志管理
      {
        path: 'logs',
        element: <LogManage />,
      },

      // 个人信息
      {
        path: 'profile',
        element: <Profile />,
      },

      // 系统设置
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'roles',
        element: <RoleManage />,
      },
    ],
  },

  // 404页面
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
