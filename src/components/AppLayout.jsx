import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme, Avatar, Dropdown, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';
import useThemeStore from '../store/themeStore';
import useAuthStore from '../store/authStore';

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // 获取状态
  const { mode, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 获取当前激活的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return ['dashboard'];
    if (path.includes('users')) return ['users'];
    if (path.includes('products')) return ['products'];
    if (path.includes('logs')) return ['logs'];
    return ['dashboard'];
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: '用户管理',
      onClick: () => navigate('/users'),
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: '商品管理',
      onClick: () => navigate('/products'),
    },
    {
      key: 'logs',
      icon: <FileTextOutlined />,
      label: '日志管理',
      onClick: () => navigate('/logs'),
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  // 处理用户菜单点击
  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
        }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: borderRadiusLG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1890ff',
            fontWeight: 'bold',
            fontSize: collapsed ? 14 : 16,
          }}
        >
          {collapsed ? 'MS' : '管理系统'}
        </div>

        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={menuItems}
          style={{ border: 'none' }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 24,
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />

          <Space>
            <Button
              type="text"
              icon={mode === 'light' ? <BulbOutlined /> : <BulbFilled />}
              onClick={toggleTheme}
              title={mode === 'light' ? '切换到暗色主题' : '切换到亮色主题'}
            />
            <span>欢迎回来，</span>
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{user?.name || '用户'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
