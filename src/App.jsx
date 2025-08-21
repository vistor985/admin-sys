// src/App.jsx
import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Loading from './components/Loading';
import Footer from './components/Footer';
import lightTheme from './config/theme';
import './App.css';
import { formatDate, generateId } from './utils';

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={lightTheme}>
      <div
        className="App"
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* 页面头部 */}
        <header
          style={{
            backgroundColor: '#001529',
            color: 'white',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <h1>🚀 我的管理系统</h1>
          <p>正在构建中...</p>
        </header>

        {/* 页面主体 */}
        <main
          style={{
            flex: 1,
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          <h2>欢迎来到项目基础结构演示</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              width: '100%',
              maxWidth: '800px',
            }}
          >
            {/* 加载组件演示 */}
            <div
              style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <h3>Loading 组件演示</h3>
              <Loading text="正在加载数据..." size="large" />
            </div>

            {/* 项目结构说明 */}
            <div
              style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <h3>项目结构</h3>
              <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
                <li>📁 components - 可复用组件</li>
                <li>📄 pages - 页面组件</li>
                <li>💾 store - 状态管理</li>
                <li>🛣️ router - 路由配置</li>
                <li>🔌 api - 接口层</li>
                <li>⚙️ config - 配置文件</li>
              </ul>
            </div>
          </div>
          <div
            style={{
              padding: '20px',
              backgroundColor: '#e6f7ff',
              borderRadius: '8px',
              border: '1px solid #91d5ff',
              maxWidth: '600px',
            }}
          >
            <h3>🎉 恭喜！</h3>
            <p>你已经成功创建了项目的基础结构。接下来我们将：</p>
            <ol style={{ textAlign: 'left', marginTop: '10px' }}>
              <li>创建登录页面</li>
              <li>添加路由系统</li>
              <li>实现状态管理</li>
              <li>构建完整的管理系统</li>
            </ol>
          </div>
          <div
            style={{
              padding: '20px',
              backgroundColor: '#fff7e6',
              borderRadius: '8px',
              border: '1px solid #ffd591',
              maxWidth: '600px',
            }}
          >
            <h3>🔧 工具函数测试</h3>
            <p>
              <strong>当前时间：</strong>
              {formatDate(new Date())}
            </p>
            <p>
              <strong>随机ID：</strong>
              {generateId()}
            </p>
          </div>
        </main>

        {/* 页面底部 */}
        <Footer />
      </div>
    </ConfigProvider>
  );
}

export default App;
