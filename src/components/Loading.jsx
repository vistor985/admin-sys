// src/components/Loading.jsx
import React from 'react';
import { Spin } from 'antd';

// Loading 组件 - 显示加载动画
const Loading = ({ text = '加载中...', size = 'large' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: '16px',
      }}
    >
      <Spin size={size} />
      <span style={{ color: '#666' }}>{text}</span>
    </div>
  );
};

export default Loading;
