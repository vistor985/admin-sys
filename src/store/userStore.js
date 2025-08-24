import { create } from 'zustand';
// 在userStore.js中导入日志功能
import useLogStore, { LOG_ACTIONS, LOG_MODULES } from './logStore';
import useAuthStore from './authStore';

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    name: '超级管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    role: 'admin',
    status: 'active',
    avatar: null,
    createTime: '2024-01-15 10:30:00',
    lastLoginTime: '2024-08-22 09:15:00',
  },
  {
    id: 2,
    username: 'editor',
    name: '编辑员',
    email: 'editor@example.com',
    phone: '13800138001',
    role: 'editor',
    status: 'active',
    avatar: null,
    createTime: '2024-02-20 14:20:00',
    lastLoginTime: '2024-08-21 16:45:00',
  },
  {
    id: 3,
    username: 'viewer',
    name: '查看员',
    email: 'viewer@example.com',
    phone: '13800138002',
    role: 'viewer',
    status: 'active',
    avatar: null,
    createTime: '2024-03-10 11:10:00',
    lastLoginTime: '2024-08-20 08:30:00',
  },
  {
    id: 4,
    username: 'john_doe',
    name: '约翰·多伊',
    email: 'john.doe@example.com',
    phone: '13800138003',
    role: 'viewer',
    status: 'inactive',
    avatar: null,
    createTime: '2024-07-15 16:45:00',
    lastLoginTime: '2024-08-15 12:20:00',
  },
  {
    id: 5,
    username: 'jane_smith',
    name: '简·史密斯',
    email: 'jane.smith@example.com',
    phone: '13800138004',
    role: 'editor',
    status: 'active',
    avatar: null,
    createTime: '2024-06-01 09:30:00',
    lastLoginTime: '2024-08-19 15:10:00',
  },
];

const useUserStore = create((set, get) => ({
  // 用户列表
  users: [...mockUsers],

  // 加载状态
  loading: false,

  // 搜索关键词
  searchKeyword: '',

  // 筛选条件
  filters: {
    role: 'all',
    status: 'all',
  },

  // 分页信息
  pagination: {
    current: 1,
    pageSize: 10,
    total: mockUsers.length,
  },

  // 获取用户列表
  getUsers: async (params = {}) => {
    set({ loading: true });

    try {
      // 模拟API请求延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      const {
        page = 1,
        pageSize = 10,
        keyword = '',
        role = 'all',
        status = 'all',
      } = params;

      let filteredUsers = [...mockUsers];

      // 关键词搜索
      if (keyword) {
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(keyword.toLowerCase()) ||
            user.username.toLowerCase().includes(keyword.toLowerCase()) ||
            user.email.toLowerCase().includes(keyword.toLowerCase())
        );
      }

      // 角色筛选
      if (role !== 'all') {
        filteredUsers = filteredUsers.filter((user) => user.role === role);
      }

      // 状态筛选
      if (status !== 'all') {
        filteredUsers = filteredUsers.filter((user) => user.status === status);
      }

      // 分页
      const total = filteredUsers.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedUsers = filteredUsers.slice(start, end);

      set({
        users: paginatedUsers,
        loading: false,
        searchKeyword: keyword,
        filters: { role, status },
        pagination: {
          current: page,
          pageSize,
          total,
        },
      });

      return { success: true, data: paginatedUsers, total };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: '获取用户列表失败' };
    }
  },

  // 添加用户
  addUser: async (userData) => {
    set({ loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser = {
        id: Date.now(),
        ...userData,
        createTime: new Date().toLocaleString('zh-CN'),
        lastLoginTime: '-',
      };

      // 添加到模拟数据
      mockUsers.push(newUser);

      // 记录操作日志
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useLogStore.getState().addLog({
          userId: currentUser.id,
          username: currentUser.username,
          userRole: currentUser.role,
          action: LOG_ACTIONS.CREATE,
          module: LOG_MODULES.USER,
          target: '用户管理',
          targetId: newUser.id,
          method: 'POST',
          url: '/api/users',
          ip: '192.168.1.100',
          userAgent: navigator.userAgent,
          status: 'success',
          message: `创建用户"${newUser.name}"成功`,
          extra: { newUserId: newUser.id, newUserRole: newUser.role },
        });
      }

      // 刷新当前页面数据
      const { pagination, searchKeyword, filters } = get();
      await get().getUsers({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword,
        ...filters,
      });

      return { success: true, message: '用户添加成功' };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: '用户添加失败' };
    }
  },

  // 更新用户
  updateUser: async (id, userData) => {
    set({ loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userIndex = mockUsers.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
      }

      // 刷新当前页面数据
      const { pagination, searchKeyword, filters } = get();
      await get().getUsers({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword,
        ...filters,
      });

      return { success: true, message: '用户更新成功' };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: '用户更新失败' };
    }
  },

  // 删除用户
  deleteUser: async (id) => {
    set({ loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const userIndex = mockUsers.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1);
      }

      // 刷新当前页面数据
      const { pagination, searchKeyword, filters } = get();
      await get().getUsers({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword,
        ...filters,
      });

      return { success: true, message: '用户删除成功' };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: '用户删除失败' };
    }
  },

  // 获取单个用户信息
  getUserById: async (id) => {
    const user = mockUsers.find((user) => user.id === id);
    return user || null;
  },

  // 重置筛选条件
  resetFilters: () => {
    set({
      searchKeyword: '',
      filters: { role: 'all', status: 'all' },
    });
  },
}));

export default useUserStore;
