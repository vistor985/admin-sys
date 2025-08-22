// src/api/user.js - 用户相关接口
import request from './request';

export const userApi = {
  // 获取用户列表
  getUsers: () => request.get('/users'),

  // 创建用户
  createUser: (data) => request.post('/users', data),

  // 更新用户
  updateUser: (id, data) => request.put(`/users/${id}`, data),

  // 删除用户
  deleteUser: (id) => request.delete(`/users/${id}`),
};
