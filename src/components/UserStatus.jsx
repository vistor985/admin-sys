// src/components/UserStatus.jsx - 用户状态显示组件

import React from 'react';
import { Card, Button, Space, Tag, Descriptions } from 'antd';
import { useAuthStore } from '../store/authStore';

const UserStatus = () => {
  // 🏪 获取认证状态
  const { user, isLoggedIn, logout, getCurrentUser, isAdmin } = useAuthStore();

  // 🎨 角色颜色映射
  const getRoleColor = (role) => {
    const colorMap = {
      admin: 'red',
      editor: 'blue',
      viewer: 'green',
    };
    return colorMap[role] || 'default';
  };

  // 🎨 角色中文名映射
  const getRoleName = (role) => {
    const nameMap = {
      admin: '管理员',
      editor: '编辑者',
      viewer: '查看者',
    };
    return nameMap[role] || role;
  };

  return (
    <Card
      title="🔍 用户状态监视器"
      style={{ margin: '20px' }}
      extra={
        isLoggedIn && (
          <Button danger onClick={logout} size="small">
            退出登录
          </Button>
        )
      }
    >
      {isLoggedIn ? (
        <div>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="👤 用户名">
              {user?.username}
            </Descriptions.Item>
            <Descriptions.Item label="📧 姓名">{user?.name}</Descriptions.Item>
            <Descriptions.Item label="📧 邮箱">{user?.email}</Descriptions.Item>
            <Descriptions.Item label="👥 角色">
              <Tag color={getRoleColor(user?.role)}>
                {getRoleName(user?.role)}
              </Tag>
              {isAdmin() && <Tag color="gold">超级权限</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="⏰ 登录时间">
              {user?.loginTime
                ? new Date(user.loginTime).toLocaleString('zh-CN')
                : '未知'}
            </Descriptions.Item>
          </Descriptions>

          <div
            style={{
              marginTop: '16px',
              padding: '10px',
              backgroundColor: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: '6px',
            }}
          >
            <strong>✅ 登录状态：</strong>已登录
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#fff7e6',
            border: '1px solid #ffd591',
            borderRadius: '6px',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔒</div>
          <div>
            <strong>❌ 登录状态：</strong>未登录
          </div>
          <div style={{ color: '#666', marginTop: '8px' }}>
            请使用登录表单登录系统
          </div>
        </div>
      )}

      {/* 🔧 调试信息 */}
      <details style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
        <summary style={{ cursor: 'pointer' }}>
          🔧 调试信息（开发时使用）
        </summary>
        <pre
          style={{
            backgroundColor: '#f5f5f5',
            padding: '10px',
            marginTop: '8px',
            borderRadius: '4px',
            fontSize: '11px',
          }}
        >
          {JSON.stringify(
            {
              isLoggedIn,
              user,
              isAdmin: isAdmin(),
              getCurrentUser: getCurrentUser(),
            },
            null,
            2
          )}
        </pre>
      </details>
    </Card>
  );
};

export default UserStatus;
