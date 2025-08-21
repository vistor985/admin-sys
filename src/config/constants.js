// src/config/constants.js - 应用常量

// 用户角色
export const USER_ROLES = {
  ADMIN: 'admin', // 管理员
  EDITOR: 'editor', // 编辑者
  VIEWER: 'viewer', // 查看者
};

// 用户状态
export const USER_STATUS = {
  ACTIVE: 'active', // 活跃
  INACTIVE: 'inactive', // 非活跃
  BANNED: 'banned', // 被禁用
};

// 本地存储键名
export const STORAGE_KEYS = {
  USER_INFO: 'user-info',
  AUTH_TOKEN: 'auth-token',
  THEME_MODE: 'theme-mode',
  LANGUAGE: 'language',
};

// API 接口地址（模拟）
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  USER_LIST: '/api/users',
  USER_DETAIL: '/api/users/:id',
};

// 分页默认配置
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
};

// 文件上传限制
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  MAX_FILES: 5,
};
