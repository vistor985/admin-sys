import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import UserList from './UserList';

const UserManage = () => {
  const location = useLocation();

  // 如果是 /users 路径，显示用户列表
  if (location.pathname === '/users') {
    return <UserList />;
  }

  // 其他子路由通过 Outlet 渲染
  return <Outlet />;
};

export default UserManage;
