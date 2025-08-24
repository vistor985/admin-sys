import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const Breadcrumb = () => {
  const location = useLocation();

  // 路径映射配置
  const pathMap = {
    '/dashboard': {
      name: '仪表盘',
      icon: <HomeOutlined />,
    },
    '/users': {
      name: '用户管理',
      icon: <UserOutlined />,
    },
    '/users/list': {
      name: '用户列表',
      parent: '/users',
    },
    '/users/add': {
      name: '添加用户',
      parent: '/users',
    },
    '/products': {
      name: '商品管理',
      icon: <ShoppingOutlined />,
    },
    '/products/list': {
      name: '商品列表',
      parent: '/products',
    },
    '/products/add': {
      name: '添加商品',
      parent: '/products',
    },
    '/logs': {
      name: '日志管理',
      icon: <FileTextOutlined />,
    },
    '/profile': {
      name: '个人信息',
      icon: <UserOutlined />,
    },
    '/settings': {
      name: '系统设置',
      icon: <SettingOutlined />,
    },
  };

  // 生成面包屑项目
  const generateBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const items = [];

    // 添加首页
    items.push({
      key: 'home',
      title: (
        <Link to="/dashboard">
          <HomeOutlined />
          <span style={{ marginLeft: 4 }}>首页</span>
        </Link>
      ),
    });

    // 构建当前路径
    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const pathConfig = pathMap[currentPath];

      if (pathConfig) {
        const isLast = index === pathSegments.length - 1;

        items.push({
          key: currentPath,
          title: isLast ? (
            <span>
              {pathConfig.icon && (
                <span style={{ marginRight: 4 }}>{pathConfig.icon}</span>
              )}
              {pathConfig.name}
            </span>
          ) : (
            <Link to={currentPath}>
              {pathConfig.icon && (
                <span style={{ marginRight: 4 }}>{pathConfig.icon}</span>
              )}
              {pathConfig.name}
            </Link>
          ),
        });
      }
    });

    return items;
  };

  const breadcrumbItems = generateBreadcrumbItems();

  // 如果只有首页，不显示面包屑
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <AntBreadcrumb
      items={breadcrumbItems}
      style={{
        margin: '0 0 16px 0',
        fontSize: '14px',
      }}
    />
  );
};

export default Breadcrumb;
