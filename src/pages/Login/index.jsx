// src/pages/Login/index.jsx - 登录页面组件

import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Typography,
  Space,
  Divider,
  Alert,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';

const { Title, Text } = Typography;

// 登录页面组件
const Login = () => {
  // 🎣 使用状态钩子
  const [loading, setLoading] = useState(false); // 加载状态
  const [showDemo, setShowDemo] = useState(false); // 是否显示演示账号

  // 🏪 使用认证状态管理
  const { login } = useAuthStore();

  // 📝 模拟用户数据库（实际项目中这些数据在后端）
  const demoUsers = [
    {
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: '管理员',
      email: 'admin@example.com',
    },
    {
      username: 'editor',
      password: 'editor123',
      role: 'editor',
      name: '编辑者',
      email: 'editor@example.com',
    },
    {
      username: 'viewer',
      password: 'viewer123',
      role: 'viewer',
      name: '查看者',
      email: 'viewer@example.com',
    },
  ];

  // ✅ 表单提交成功时的处理
  const onFinish = async (values) => {
    console.log('📝 用户提交的表单数据:', values);

    // 开始加载动画
    setLoading(true);

    try {
      // ⏳ 模拟网络请求延迟（实际项目中是调用后端API）
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 🔍 查找用户（模拟数据库查询）
      const foundUser = demoUsers.find(
        (user) =>
          user.username === values.username && user.password === values.password
      );

      if (foundUser) {
        // ✅ 登录成功
        message.success(`🎉 欢迎回来，${foundUser.name}！`);

        // 📊 更新登录状态
        login({
          username: foundUser.username,
          name: foundUser.name,
          role: foundUser.role,
          email: foundUser.email,
          loginTime: new Date().toISOString(),
        });

        console.log('✅ 登录成功，状态已更新');

        // 🔄 这里后面会添加页面跳转
      } else {
        // ❌ 登录失败
        message.error('❌ 用户名或密码错误！');
        console.log('❌ 登录失败：用户不存在或密码错误');
      }
    } catch (error) {
      // 🚨 处理其他错误
      console.error('🚨 登录过程中出现错误:', error);
      message.error('🚨 登录失败，请稍后重试！');
    } finally {
      // 🔄 停止加载动画
      setLoading(false);
    }
  };

  // ❌ 表单验证失败时的处理
  const onFinishFailed = (errorInfo) => {
    console.log('❌ 表单验证失败:', errorInfo);
    message.warning('⚠️ 请填写正确的登录信息');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        }}
        bodyStyle={{ padding: '40px' }}
      >
        {/* 🎨 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🚀
          </div>
          <Title level={2} style={{ margin: 0, color: '#1f1f1f' }}>
            管理系统登录
          </Title>
          <Text type="secondary">欢迎回来，请输入您的账号信息</Text>
        </div>

        {/* ℹ️ 演示账号信息 */}
        <div style={{ marginBottom: '24px' }}>
          <Button
            type="link"
            onClick={() => setShowDemo(!showDemo)}
            style={{ padding: 0, fontSize: '12px' }}
          >
            {showDemo ? '隐藏' : '显示'} 演示账号信息
          </Button>

          {showDemo && (
            <Alert
              message="演示账号"
              description={
                <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                  <div>
                    <strong>管理员:</strong> admin / admin123
                  </div>
                  <div>
                    <strong>编辑者:</strong> editor / editor123
                  </div>
                  <div>
                    <strong>查看者:</strong> viewer / viewer123
                  </div>
                </div>
              }
              type="info"
              showIcon
              style={{ marginTop: '8px', fontSize: '12px' }}
            />
          )}
        </div>

        {/* 📝 登录表单 */}
        <Form
          name="loginForm"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          size="large"
        >
          {/* 👤 用户名输入框 */}
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名！',
              },
              {
                min: 3,
                message: '用户名至少3个字符！',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
              placeholder="请输入用户名"
              allowClear
            />
          </Form.Item>

          {/* 🔑 密码输入框 */}
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
              {
                min: 6,
                message: '密码至少6个字符！',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
              placeholder="请输入密码"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {/* 🚀 登录按钮 */}
          <Form.Item style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              icon={<LoginOutlined />}
              style={{
                height: '45px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
              }}
            >
              {loading ? '登录中...' : '立即登录'}
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '24px 0 16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            React 管理系统
          </Text>
        </Divider>

        {/* 📄 页面底部信息 */}
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            使用 React + Ant Design + Zustand 构建
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
