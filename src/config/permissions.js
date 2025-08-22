// src/config/permissions.js - 权限配置
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

export const PERMISSIONS = {
  VIEW_USERS: 'view_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  VIEW_PRODUCTS: 'view_products',
  EDIT_PRODUCTS: 'edit_products',
  DELETE_PRODUCTS: 'delete_products',
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: Object.values(PERMISSIONS),
  [USER_ROLES.EDITOR]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.EDIT_PRODUCTS,
  ],
  [USER_ROLES.VIEWER]: [PERMISSIONS.VIEW_USERS, PERMISSIONS.VIEW_PRODUCTS],
};
