import { useCallback } from 'react';
import useLogStore, { LOG_ACTIONS, LOG_MODULES } from '../store/logStore';
import useAuthStore from '../store/authStore';

const useLogger = () => {
  const { addLog } = useLogStore();
  const { user } = useAuthStore();

  // 记录日志的通用方法
  const logAction = useCallback(
    (actionData) => {
      if (!user) return;

      const logData = {
        userId: user.id,
        username: user.username,
        userRole: user.role,
        ip: '192.168.1.100', // 在真实项目中应该从请求中获取
        userAgent: navigator.userAgent,
        ...actionData,
      };

      addLog(logData);
    },
    [user, addLog]
  );

  // 记录登录日志
  const logLogin = useCallback(
    (success = true, message = '') => {
      logAction({
        action: LOG_ACTIONS.LOGIN,
        module: LOG_MODULES.AUTH,
        target: '系统登录',
        method: 'POST',
        url: '/api/auth/login',
        status: success ? 'success' : 'failed',
        message: message || (success ? '用户登录成功' : '用户登录失败'),
        extra: { loginType: 'password' },
      });
    },
    [logAction]
  );

  // 记录登出日志
  const logLogout = useCallback(() => {
    logAction({
      action: LOG_ACTIONS.LOGOUT,
      module: LOG_MODULES.AUTH,
      target: '系统登出',
      method: 'POST',
      url: '/api/auth/logout',
      status: 'success',
      message: '用户退出登录',
    });
  }, [logAction]);

  // 记录用户操作
  const logUserAction = useCallback(
    (action, targetId = null, message = '', extra = {}) => {
      logAction({
        action,
        module: LOG_MODULES.USER,
        target: '用户管理',
        targetId,
        method:
          action === LOG_ACTIONS.CREATE
            ? 'POST'
            : action === LOG_ACTIONS.UPDATE
            ? 'PUT'
            : action === LOG_ACTIONS.DELETE
            ? 'DELETE'
            : 'GET',
        url: targetId ? `/api/users/${targetId}` : '/api/users',
        status: 'success',
        message,
        extra,
      });
    },
    [logAction]
  );

  // 记录商品操作
  const logProductAction = useCallback(
    (action, targetId = null, message = '', extra = {}) => {
      logAction({
        action,
        module: LOG_MODULES.PRODUCT,
        target: '商品管理',
        targetId,
        method:
          action === LOG_ACTIONS.CREATE
            ? 'POST'
            : action === LOG_ACTIONS.UPDATE
            ? 'PUT'
            : action === LOG_ACTIONS.DELETE
            ? 'DELETE'
            : 'GET',
        url: targetId ? `/api/products/${targetId}` : '/api/products',
        status: 'success',
        message,
        extra,
      });
    },
    [logAction]
  );

  // 记录角色操作
  const logRoleAction = useCallback(
    (action, targetId = null, message = '', extra = {}) => {
      logAction({
        action,
        module: LOG_MODULES.ROLE,
        target: '角色管理',
        targetId,
        method:
          action === LOG_ACTIONS.CREATE
            ? 'POST'
            : action === LOG_ACTIONS.UPDATE
            ? 'PUT'
            : action === LOG_ACTIONS.DELETE
            ? 'DELETE'
            : 'GET',
        url: targetId ? `/api/roles/${targetId}` : '/api/roles',
        status: 'success',
        message,
        extra,
      });
    },
    [logAction]
  );

  // 记录系统操作
  const logSystemAction = useCallback(
    (action, message = '', extra = {}) => {
      logAction({
        action,
        module: LOG_MODULES.SYSTEM,
        target: '系统管理',
        method: 'POST',
        url: '/api/system',
        status: 'success',
        message,
        extra,
      });
    },
    [logAction]
  );

  return {
    logAction,
    logLogin,
    logLogout,
    logUserAction,
    logProductAction,
    logRoleAction,
    logSystemAction,
  };
};

export default useLogger;
