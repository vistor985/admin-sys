// src/components/ErrorBoundary.jsx
import React from 'react';
import { Result, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误日志
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 可以发送错误报告到服务端
    // reportError(error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReload);
      }

      return (
        <Result
          status="500"
          title="页面出错了"
          subTitle="抱歉，页面发生了错误，请尝试刷新页面"
          extra={
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={this.handleReload}
            >
              刷新页面
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
