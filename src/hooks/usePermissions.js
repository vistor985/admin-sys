import { useMemo } from 'react';
import useAuthStore from '../store/authStore';

// 权限配置
const PERMISSIONS = {
  // 仪表盘权限
  DASHBOARD_VIEW: 'dashboard:view',

  // 用户管理权限
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',

  // 商品管理权限
  PRODUCT_VIEW: 'product:view',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_EDIT: 'product:edit',
  PRODUCT_DELETE: 'product:delete',

  // 日志管理权限
  LOG_VIEW: 'log:view',

  // 系统设置权限
  SYSTEM_SETTING: 'system:setting',
};

// 角色权限映射
const ROLE_PERMISSIONS = {
  admin: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_EDIT,
    PERMISSIONS.PRODUCT_DELETE,
    PERMISSIONS.LOG_VIEW,
    PERMISSIONS.SYSTEM_SETTING,
  ],
  editor: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_EDIT,
  ],
  viewer: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.PRODUCT_VIEW,
  ],
};

const usePermissions = () => {
  const { user } = useAuthStore();

  // 获取用户权限列表
  const userPermissions = useMemo(() => {
    if (!user || !user.role) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  }, [user]);

  // 检查是否有指定权限
  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

  // 检查是否有任意一个权限
  const hasAnyPermission = (permissions) => {
    return permissions.some((permission) => hasPermission(permission));
  };

  // 检查是否有所有权限
  const hasAllPermissions = (permissions) => {
    return permissions.every((permission) => hasPermission(permission));
  };

  // 权限过滤的菜单项
  const getFilteredMenuItems = (menuItems) => {
    return menuItems.filter((item) => {
      if (!item.permission) return true;
      return hasPermission(item.permission);
    });
  };

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getFilteredMenuItems,
    PERMISSIONS,
  };
};

export default usePermissions;
