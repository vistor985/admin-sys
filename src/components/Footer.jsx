// src/components/Footer.jsx
import React from 'react';

// Footer 组件 - 页面底部
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '24px 0',
        backgroundColor: '#f0f2f5',
        color: '#666',
        marginTop: 'auto',
      }}
    >
      <p>© {currentYear} 我的管理系统. 版权所有</p>
      <p>使用 React + Ant Design 构建</p>
    </footer>
  );
};

export default Footer;
