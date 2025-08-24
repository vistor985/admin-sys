import { create } from 'zustand';
import {
  ROLE_PERMISSIONS,
  PERMISSIONS,
  PERMISSION_DESCRIPTIONS,
} from '../config/permissions';

// 模拟角色数据
const mockRoles = [
  {
    id: 1,
    name: 'admin',
    displayName: '超级管理员',
    description: '拥有系统所有权限',
    permissions: ROLE_PERMISSIONS.admin,
    userCount: 1,
    status: 'active',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-08-22 15:30:00',
  },
  {
    id: 2,
    name: 'editor',
    displayName: '编辑员',
    description: '负责内容编辑和管理',
    permissions: ROLE_PERMISSIONS.editor,
    userCount: 3,
    status: 'active',
    createTime: '2024-01-15 14:20:00',
    updateTime: '2024-08-20 11:45:00',
  },
  {
    id: 3,
    name: 'viewer',
    displayName: '查看员',
    description: '只能查看数据，无编辑权限',
    permissions: ROLE_PERMISSIONS.viewer,
    userCount: 5,
    status: 'active',
    createTime: '2024-02-01 09:15:00',
    updateTime: '2024-08-18 16:20:00',
  },
];

const useRoleStore = create((set, get) => ({
  // 角色列表
  roles: [...mockRoles],

  // 加载状态
  loading: false,

  // 所有权限列表
  allPermissions: Object.values(PERMISSIONS),

  // 权限描述
  permissionDescriptions: PERMISSION_DESCRIPTIONS,

  // 获取角色列表
  getRoles: async () => {
    set({ loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set({
        roles: [...mockRoles],
        loading: false,
      });

      return { success: true, data: mockRoles };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: '获取角色列表失败' };
    }
  },

  // 添加角色
  addRole: async (roleData) => {
    set({ loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newRole = {
        id: Date.now(),
        ...roleData,
        userCount: 0,
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN'),
      };

      mockRoles.push(newRole);

      set({
        roles: [...mockRoles],
        loading: false,
      });

      return { success: true, message: '角色创建成功' };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: '角色创建失败' };
    }
  },

  // 更新角色
  updateRole: async (id, roleData) => {
    set({ loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const roleIndex = mockRoles.findIndex((role) => role.id === id);
      if (roleIndex !== -1) {
        mockRoles[roleIndex] = {
          ...mockRoles[roleIndex],
          ...roleData,
          updateTime: new Date().toLocaleString('zh-CN'),
        };
      }

      set({
        roles: [...mockRoles],
        loading: false,
      });

      return { success: true, message: '角色更新成功' };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: '角色更新失败' };
    }
  },

  // 删除角色
  deleteRole: async (id) => {
    set({ loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const roleIndex = mockRoles.findIndex((role) => role.id === id);
      if (roleIndex !== -1) {
        // 检查是否有用户使用此角色
        const role = mockRoles[roleIndex];
        if (role.userCount > 0) {
          set({ loading: false });
          return { success: false, message: '该角色下还有用户，无法删除' };
        }

        mockRoles.splice(roleIndex, 1);
      }

      set({
        roles: [...mockRoles],
        loading: false,
      });

      return { success: true, message: '角色删除成功' };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: '角色删除失败' };
    }
  },

  // 获取角色详情
  getRoleById: (id) => {
    return mockRoles.find((role) => role.id === id) || null;
  },
}));

export default useRoleStore;
