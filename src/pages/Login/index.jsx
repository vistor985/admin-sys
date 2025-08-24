import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Space,
  Typography,
  Divider,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './Login.css';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, isLoggedIn } = useAuthStore();
  const [form] = Form.useForm();

  // 如果已经登录，直接跳转到首页
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // 处理登录提交
  const handleLogin = async (values) => {
    const { username, password } = values;
    const result = await login(username, password);

    if (result.success) {
      message.success('登录成功！');
      navigate('/');
    } else {
      message.error(result.message);
    }
  };

  // 快速登录按钮
  const quickLogin = (userType) => {
    const credentials = {
      admin: { username: 'admin', password: '123456' },
      editor: { username: 'editor', password: '123456' },
      viewer: { username: 'viewer', password: '123456' },
    };

    form.setFieldsValue(credentials[userType]);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <Card className="login-card">
          {/* 头部 */}
          <div className="login-header">
            <Title level={2}>管理系统登录</Title>
            <Text type="secondary">欢迎回来，请输入您的账号密码</Text>
          </div>

          {/* 登录表单 */}
          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                autoComplete="current-password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                {loading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>
          </Form>

          <Divider>测试账号</Divider>

          {/* 快速登录按钮 */}
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button block onClick={() => quickLogin('admin')} type="dashed">
              管理员登录 (admin/123456)
            </Button>
            <Button block onClick={() => quickLogin('editor')} type="dashed">
              编辑员登录 (editor/123456)
            </Button>
            <Button block onClick={() => quickLogin('viewer')} type="dashed">
              查看员登录 (viewer/123456)
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default Login;
