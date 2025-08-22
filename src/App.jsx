import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Login from './pages/Login';
import UserStatus from './components/UserStatus';
import { useAuthStore } from './store/authStore';
import lightTheme from './config/theme';
import './App.css';

function App() {
  // 🏪 获取登录状态
  const { isLoggedIn } = useAuthStore();

  return (
    <ConfigProvider locale={zhCN} theme={lightTheme}>
      <div style={{ minHeight: '100vh' }}>
        {isLoggedIn ? (
          // ✅ 已登录：显示用户状态
          <div>
            <div
              style={{
                padding: '20px',
                backgroundColor: '#001529',
                color: 'white',
                textAlign: 'center',
              }}
            >
              <h1>🎉 欢迎来到管理系统</h1>
              <p>登录成功！下一章我们将添加页面路由。</p>
            </div>
            <UserStatus />
          </div>
        ) : (
          // ❌ 未登录：显示登录页面
          <Login />
        )}
      </div>
    </ConfigProvider>
  );
}

export default App;
