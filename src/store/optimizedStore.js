// src/store/optimizedStore.js
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// 1. 使用 immer 中间件简化状态更新
const useUserStore = create(
  subscribeWithSelector(
    immer((set, get) => ({
      // 状态分片，避免大对象
      users: [],
      userMap: new Map(), // 使用 Map 提高查找效率

      // 分离加载状态
      loading: {
        list: false,
        create: false,
        update: false,
        delete: false,
      },

      // 缓存计算结果
      cache: {
        filteredUsers: [],
        statistics: null,
        lastUpdate: 0,
      },

      // 优化的获取用户方法
      getUsers: async (params) => {
        set((state) => {
          state.loading.list = true;
        });

        try {
          const response = await fetchUsers(params);
          const { data, total } = response;

          set((state) => {
            state.users = data;
            // 同时更新 Map 缓存
            state.userMap.clear();
            data.forEach((user) => {
              state.userMap.set(user.id, user);
            });
            state.loading.list = false;
            state.cache.lastUpdate = Date.now();
          });

          return { success: true, data, total };
        } catch (error) {
          set((state) => {
            state.loading.list = false;
          });
          return { success: false, error };
        }
      },

      // 优化的单个用户更新
      updateUser: async (id, userData) => {
        set((state) => {
          state.loading.update = true;
        });

        try {
          const response = await updateUserAPI(id, userData);

          set((state) => {
            // 只更新变化的用户
            const index = state.users.findIndex((u) => u.id === id);
            if (index !== -1) {
              state.users[index] = { ...state.users[index], ...userData };
              state.userMap.set(id, state.users[index]);
            }
            state.loading.update = false;
          });

          return { success: true, data: response };
        } catch (error) {
          set((state) => {
            state.loading.update = false;
          });
          return { success: false, error };
        }
      },

      // 选择器函数，避免重复计算
      selectors: {
        getUserById: (id) => get().userMap.get(id),
        getActiveUsers: () => get().users.filter((u) => u.status === 'active'),
        getUsersByRole: (role) => get().users.filter((u) => u.role === role),
      },
    }))
  )
);

// 2. 分离关注点，创建专门的统计Store
const useStatisticsStore = create((set, get) => ({
  data: null,
  lastUpdate: 0,

  updateStatistics: (newData) => {
    set({
      data: newData,
      lastUpdate: Date.now(),
    });
  },

  // 缓存策略：5分钟内不重复计算
  getStatistics: () => {
    const now = Date.now();
    const { data, lastUpdate } = get();

    if (data && now - lastUpdate < 5 * 60 * 1000) {
      return data;
    }

    // 需要重新计算统计数据
    return null;
  },
}));

export { useUserStore, useStatisticsStore };
