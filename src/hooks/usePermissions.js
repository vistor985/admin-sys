import { useMemo } from 'react';
import useAuthStore from '../store/authStore';
import { PERMISSIONS, ROLE_PERMISSIONS } from '../config/permissions';

const usePermissions = () => {
  const { user } = useAuthStore();

  // 获取用户权限列表
  const userPermissions = useMemo(() => {
    if (!user || !user.role) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  }, [user]);

  // 检查是否有指定权限
  const hasPermission = (permission) => {
    if (!permission) return true;
    return userPermissions.includes(permission);
  };

  // 检查是否有任意一个权限
  const hasAnyPermission = (permissions) => {
    if (!permissions || permissions.length === 0) return true;
    return permissions.some((permission) => hasPermission(permission));
  };

  // 检查是否有所有权限
  const hasAllPermissions = (permissions) => {
    if (!permissions || permissions.length === 0) return true;
    return permissions.every((permission) => hasPermission(permission));
  };

  // 权限过滤的菜单项
  const getFilteredMenuItems = (menuItems) => {
    return menuItems.filter((item) => {
      if (!item.permission) return true;
      return hasPermission(item.permission);
    });
  };

  // 获取用户角色
  const getUserRole = () => {
    return user?.role || null;
  };

  // 检查是否为管理员
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getFilteredMenuItems,
    getUserRole,
    isAdmin,
    PERMISSIONS,
  };
};

export default usePermissions;
