import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import usePermissions from '../hooks/usePermissions';

/**
 * 权限守卫组件
 * @param {string|string[]} permission - 需要的权限
 * @param {string} fallback - 无权限时显示的内容类型
 * @param {React.ReactNode} children - 子组件
 * @param {React.ReactNode} noPermissionComponent - 自定义无权限组件
 */
const PermissionGuard = ({
  permission,
  fallback = 'result',
  children,
  noPermissionComponent,
}) => {
  const { hasPermission, hasAnyPermission } = usePermissions();
  const navigate = useNavigate();

  // 检查权限
  const checkPermission = () => {
    if (!permission) return true;

    if (Array.isArray(permission)) {
      // 如果是权限数组，检查是否有任意一个权限
      return hasAnyPermission(permission);
    } else {
      // 单个权限检查
      return hasPermission(permission);
    }
  };

  const hasRequiredPermission = checkPermission();

  // 如果有权限，直接渲染子组件
  if (hasRequiredPermission) {
    return <>{children}</>;
  }

  // 如果有自定义无权限组件，使用自定义组件
  if (noPermissionComponent) {
    return noPermissionComponent;
  }

  // 根据fallback类型显示不同的无权限提示
  switch (fallback) {
    case 'null':
      return null;

    case 'hidden':
      return <div style={{ display: 'none' }}>{children}</div>;

    case 'disabled':
      return (
        <div style={{ opacity: 0.5, pointerEvents: 'none' }}>{children}</div>
      );

    case 'result':
    default:
      return (
        <Result
          status="403"
          title="403"
          subTitle="抱歉，您没有权限访问此页面"
          extra={
            <Button type="primary" onClick={() => navigate('/dashboard')}>
              返回首页
            </Button>
          }
        />
      );
  }
};

export default PermissionGuard;
