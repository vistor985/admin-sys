import { create } from 'zustand';

// 操作类型枚举
export const LOG_ACTIONS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
  EXPORT: 'export',
  SEARCH: 'search',
  UPLOAD: 'upload',
  DOWNLOAD: 'download',
};

// 模块枚举
export const LOG_MODULES = {
  AUTH: 'auth',
  USER: 'user',
  PRODUCT: 'product',
  ROLE: 'role',
  LOG: 'log',
  SYSTEM: 'system',
};

// 状态枚举
export const LOG_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  WARNING: 'warning',
};

// 模拟日志数据
const mockLogs = [
  {
    id: 1,
    userId: 1,
    username: 'admin',
    userRole: 'admin',
    action: LOG_ACTIONS.LOGIN,
    module: LOG_MODULES.AUTH,
    target: '系统登录',
    targetId: null,
    method: 'POST',
    url: '/api/auth/login',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: LOG_STATUS.SUCCESS,
    message: '用户登录成功',
    duration: 234,
    createTime: '2024-08-22 09:15:30',
    extra: { loginType: 'password' },
  },
  {
    id: 2,
    userId: 1,
    username: 'admin',
    userRole: 'admin',
    action: LOG_ACTIONS.CREATE,
    module: LOG_MODULES.USER,
    target: '用户管理',
    targetId: 6,
    method: 'POST',
    url: '/api/users',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: LOG_STATUS.SUCCESS,
    message: '创建用户"张三"成功',
    duration: 567,
    createTime: '2024-08-22 10:20:15',
    extra: { newUserId: 6, newUserRole: 'viewer' },
  },
  {
    id: 3,
    userId: 2,
    username: 'editor',
    userRole: 'editor',
    action: LOG_ACTIONS.UPDATE,
    module: LOG_MODULES.PRODUCT,
    target: '商品管理',
    targetId: 3,
    method: 'PUT',
    url: '/api/products/3',
    ip: '192.168.1.105',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    status: LOG_STATUS.SUCCESS,
    message: '更新商品"运动休闲鞋"信息',
    duration: 445,
    createTime: '2024-08-22 11:35:42',
    extra: { updatedFields: ['price', 'stock'] },
  },
  {
    id: 4,
    userId: 2,
    username: 'editor',
    userRole: 'editor',
    action: LOG_ACTIONS.DELETE,
    module: LOG_MODULES.PRODUCT,
    target: '商品管理',
    targetId: 5,
    method: 'DELETE',
    url: '/api/products/5',
    ip: '192.168.1.105',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    status: LOG_STATUS.FAILED,
    message: '删除商品失败：商品仍有库存',
    duration: 123,
    createTime: '2024-08-22 14:28:19',
    extra: { errorCode: 'PRODUCT_HAS_STOCK', remainingStock: 50 },
  },
  {
    id: 5,
    userId: 3,
    username: 'viewer',
    userRole: 'viewer',
    action: LOG_ACTIONS.VIEW,
    module: LOG_MODULES.USER,
    target: '用户管理',
    targetId: null,
    method: 'GET',
    url: '/api/users',
    ip: '192.168.1.110',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: LOG_STATUS.SUCCESS,
    message: '查看用户列表',
    duration: 89,
    createTime: '2024-08-22 15:42:33',
    extra: { pageSize: 10, currentPage: 1 },
  },
];

// 生成更多模拟数据
const generateMoreLogs = () => {
  const additionalLogs = [];
  const users = [
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'editor', role: 'editor' },
    { id: 3, username: 'viewer', role: 'viewer' },
  ];

  const actions = Object.values(LOG_ACTIONS);
  const modules = Object.values(LOG_MODULES);
  const statuses = Object.values(LOG_STATUS);

  for (let i = 6; i <= 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const module = modules[Math.floor(Math.random() * modules.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));

    additionalLogs.push({
      id: i,
      userId: user.id,
      username: user.username,
      userRole: user.role,
      action,
      module,
      target: `${module}模块`,
      targetId: Math.floor(Math.random() * 100) + 1,
      method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
      url: `/api/${module}`,
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status,
      message: `${action}操作${status === 'success' ? '成功' : '失败'}`,
      duration: Math.floor(Math.random() * 1000) + 50,
      createTime: date.toLocaleString('zh-CN'),
      extra: {},
    });
  }

  return additionalLogs;
};

const allMockLogs = [...mockLogs, ...generateMoreLogs()];

const useLogStore = create((set, get) => ({
  // 日志列表
  logs: [],

  // 统计数据
  statistics: {
    total: 0,
    today: 0,
    success: 0,
    failed: 0,
    warning: 0,
  },

  // 加载状态
  loading: false,

  // 搜索和筛选条件
  searchKeyword: '',
  filters: {
    userId: 'all',
    action: 'all',
    module: 'all',
    status: 'all',
    dateRange: [],
  },

  // 分页信息
  pagination: {
    current: 1,
    pageSize: 20,
    total: allMockLogs.length,
  },

  // 获取日志列表
  getLogs: async (params = {}) => {
    set({ loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const {
        page = 1,
        pageSize = 20,
        keyword = '',
        userId = 'all',
        action = 'all',
        module = 'all',
        status = 'all',
        dateRange = [],
      } = params;

      let filteredLogs = [...allMockLogs];

      // 关键词搜索
      if (keyword) {
        filteredLogs = filteredLogs.filter(
          (log) =>
            log.message.toLowerCase().includes(keyword.toLowerCase()) ||
            log.target.toLowerCase().includes(keyword.toLowerCase()) ||
            log.username.toLowerCase().includes(keyword.toLowerCase()) ||
            log.ip.includes(keyword)
        );
      }

      // 用户筛选
      if (userId !== 'all') {
        filteredLogs = filteredLogs.filter(
          (log) => log.userId === parseInt(userId)
        );
      }

      // 操作类型筛选
      if (action !== 'all') {
        filteredLogs = filteredLogs.filter((log) => log.action === action);
      }

      // 模块筛选
      if (module !== 'all') {
        filteredLogs = filteredLogs.filter((log) => log.module === module);
      }

      // 状态筛选
      if (status !== 'all') {
        filteredLogs = filteredLogs.filter((log) => log.status === status);
      }

      // 日期范围筛选
      if (dateRange && dateRange.length === 2) {
        const [startDate, endDate] = dateRange;
        filteredLogs = filteredLogs.filter((log) => {
          const logDate = new Date(log.createTime);
          return logDate >= startDate && logDate <= endDate;
        });
      }

      // 按时间降序排序
      filteredLogs.sort(
        (a, b) => new Date(b.createTime) - new Date(a.createTime)
      );

      // 分页
      const total = filteredLogs.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedLogs = filteredLogs.slice(start, end);

      set({
        logs: paginatedLogs,
        loading: false,
        searchKeyword: keyword,
        filters: { userId, action, module, status, dateRange },
        pagination: {
          current: page,
          pageSize,
          total,
        },
      });

      return { success: true, data: paginatedLogs, total };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: '获取日志列表失败' };
    }
  },

  // 获取统计数据
  getStatistics: async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const today = new Date().toDateString();

      const statistics = {
        total: allMockLogs.length,
        today: allMockLogs.filter(
          (log) => new Date(log.createTime).toDateString() === today
        ).length,
        success: allMockLogs.filter((log) => log.status === 'success').length,
        failed: allMockLogs.filter((log) => log.status === 'failed').length,
        warning: allMockLogs.filter((log) => log.status === 'warning').length,
      };

      set({ statistics });

      return { success: true, data: statistics };
    } catch (error) {
      return { success: false, message: '获取统计数据失败' };
    }
  },

  // 删除日志
  deleteLogs: async (ids) => {
    set({ loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 从模拟数据中删除
      ids.forEach((id) => {
        const index = allMockLogs.findIndex((log) => log.id === id);
        if (index !== -1) {
          allMockLogs.splice(index, 1);
        }
      });

      // 刷新当前页面数据
      const { pagination, searchKeyword, filters } = get();
      await get().getLogs({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword,
        ...filters,
      });

      return { success: true, message: `成功删除 ${ids.length} 条日志` };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: '删除日志失败' };
    }
  },

  // 导出日志
  exportLogs: async (params = {}) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 这里应该调用真实的导出API
      // 模拟导出功能
      const {
        keyword = '',
        userId = 'all',
        action = 'all',
        module = 'all',
        status = 'all',
        dateRange = [],
      } = params;

      // 应用筛选条件获取要导出的数据
      let exportLogs = [...allMockLogs];
      // ... 应用筛选逻辑（与getLogs相同）

      // 模拟生成下载链接
      const downloadUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(
        '模拟CSV数据'
      )}`;

      return {
        success: true,
        message: '导出成功',
        downloadUrl,
        count: exportLogs.length,
      };
    } catch (error) {
      return { success: false, message: '导出失败' };
    }
  },

  // 记录日志（供其他模块调用）
  addLog: (logData) => {
    const newLog = {
      id: Date.now(),
      createTime: new Date().toLocaleString('zh-CN'),
      duration: Math.floor(Math.random() * 500) + 100,
      ...logData,
    };

    allMockLogs.unshift(newLog);
  },

  // 重置筛选条件
  resetFilters: () => {
    set({
      searchKeyword: '',
      filters: {
        userId: 'all',
        action: 'all',
        module: 'all',
        status: 'all',
        dateRange: [],
      },
    });
  },
}));

export default useLogStore;
