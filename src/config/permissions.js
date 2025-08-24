// 权限常量定义
export const PERMISSIONS = {
  // 仪表盘权限
  DASHBOARD_VIEW: 'dashboard:view',

  // 用户管理权限
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  USER_EXPORT: 'user:export',

  // 商品管理权限
  PRODUCT_VIEW: 'product:view',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_EDIT: 'product:edit',
  PRODUCT_DELETE: 'product:delete',
  PRODUCT_EXPORT: 'product:export',

  // 日志管理权限
  LOG_VIEW: 'log:view',
  LOG_DELETE: 'log:delete',
  LOG_EXPORT: 'log:export',

  // 系统设置权限
  SYSTEM_SETTING: 'system:setting',
  SYSTEM_ROLE_MANAGE: 'system:role:manage',
  SYSTEM_PERMISSION_MANAGE: 'system:permission:manage',

  // 个人权限
  PROFILE_VIEW: 'profile:view',
  PROFILE_EDIT: 'profile:edit',
};

// 权限分组
export const PERMISSION_GROUPS = {
  DASHBOARD: {
    name: '仪表盘',
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
  },
  USER: {
    name: '用户管理',
    permissions: [
      PERMISSIONS.USER_VIEW,
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_EDIT,
      PERMISSIONS.USER_DELETE,
      PERMISSIONS.USER_EXPORT,
    ],
  },
  PRODUCT: {
    name: '商品管理',
    permissions: [
      PERMISSIONS.PRODUCT_VIEW,
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_EDIT,
      PERMISSIONS.PRODUCT_DELETE,
      PERMISSIONS.PRODUCT_EXPORT,
    ],
  },
  LOG: {
    name: '日志管理',
    permissions: [
      PERMISSIONS.LOG_VIEW,
      PERMISSIONS.LOG_DELETE,
      PERMISSIONS.LOG_EXPORT,
    ],
  },
  SYSTEM: {
    name: '系统管理',
    permissions: [
      PERMISSIONS.SYSTEM_SETTING,
      PERMISSIONS.SYSTEM_ROLE_MANAGE,
      PERMISSIONS.SYSTEM_PERMISSION_MANAGE,
    ],
  },
  PROFILE: {
    name: '个人中心',
    permissions: [PERMISSIONS.PROFILE_VIEW, PERMISSIONS.PROFILE_EDIT],
  },
};

// 角色权限映射
export const ROLE_PERMISSIONS = {
  admin: [
    // 管理员拥有所有权限
    ...Object.values(PERMISSIONS),
  ],
  editor: [
    // 编辑员权限
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_EDIT,
    PERMISSIONS.LOG_VIEW,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_EDIT,
  ],
  viewer: [
    // 查看员权限
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.LOG_VIEW,
    PERMISSIONS.PROFILE_VIEW,
    PERMISSIONS.PROFILE_EDIT,
  ],
};

// 权限描述
export const PERMISSION_DESCRIPTIONS = {
  [PERMISSIONS.DASHBOARD_VIEW]: '查看仪表盘',
  [PERMISSIONS.USER_VIEW]: '查看用户列表',
  [PERMISSIONS.USER_CREATE]: '创建用户',
  [PERMISSIONS.USER_EDIT]: '编辑用户',
  [PERMISSIONS.USER_DELETE]: '删除用户',
  [PERMISSIONS.USER_EXPORT]: '导出用户数据',
  [PERMISSIONS.PRODUCT_VIEW]: '查看商品列表',
  [PERMISSIONS.PRODUCT_CREATE]: '创建商品',
  [PERMISSIONS.PRODUCT_EDIT]: '编辑商品',
  [PERMISSIONS.PRODUCT_DELETE]: '删除商品',
  [PERMISSIONS.PRODUCT_EXPORT]: '导出商品数据',
  [PERMISSIONS.LOG_VIEW]: '查看日志',
  [PERMISSIONS.LOG_DELETE]: '删除日志',
  [PERMISSIONS.LOG_EXPORT]: '导出日志',
  [PERMISSIONS.SYSTEM_SETTING]: '系统设置',
  [PERMISSIONS.SYSTEM_ROLE_MANAGE]: '角色管理',
  [PERMISSIONS.SYSTEM_PERMISSION_MANAGE]: '权限管理',
  [PERMISSIONS.PROFILE_VIEW]: '查看个人信息',
  [PERMISSIONS.PROFILE_EDIT]: '编辑个人信息',
};
