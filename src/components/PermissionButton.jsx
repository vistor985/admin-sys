import React from 'react';
import { Button, Tooltip } from 'antd';
import usePermissions from '../hooks/usePermissions';

/**
 * 权限按钮组件
 * @param {string|string[]} permission - 需要的权限
 * @param {string} tooltip - 无权限时的提示文字
 * @param {boolean} hideWhenNoPermission - 无权限时是否隐藏
 * @param {Object} props - 其他Button属性
 */
const PermissionButton = ({
  permission,
  tooltip = '您没有操作权限',
  hideWhenNoPermission = false,
  children,
  ...props
}) => {
  const { hasPermission, hasAnyPermission } = usePermissions();

  // 检查权限
  const checkPermission = () => {
    if (!permission) return true;

    if (Array.isArray(permission)) {
      return hasAnyPermission(permission);
    } else {
      return hasPermission(permission);
    }
  };

  const hasRequiredPermission = checkPermission();

  // 如果无权限且设置了隐藏，则不渲染
  if (!hasRequiredPermission && hideWhenNoPermission) {
    return null;
  }

  // 如果有权限，正常渲染按钮
  if (hasRequiredPermission) {
    return <Button {...props}>{children}</Button>;
  }

  // 无权限时，渲染禁用的按钮并添加提示
  return (
    <Tooltip title={tooltip}>
      <Button {...props} disabled>
        {children}
      </Button>
    </Tooltip>
  );
};

export default PermissionButton;
