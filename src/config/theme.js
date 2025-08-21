// src/config/theme.js - 主题配置

// 浅色主题
export const lightTheme = {
  token: {
    // 主色调
    colorPrimary: '#1890ff', // 蓝色
    colorSuccess: '#52c41a', // 绿色
    colorWarning: '#faad14', // 橙色
    colorError: '#ff4d4f', // 红色

    // 背景色
    colorBgBase: '#ffffff', // 白色背景
    colorBgContainer: '#ffffff', // 容器背景

    // 文字色
    colorTextBase: '#000000', // 黑色文字
    colorTextSecondary: '#666666', // 灰色文字

    // 边框
    colorBorder: '#d9d9d9', // 边框颜色
    borderRadius: 6, // 圆角大小
  },
};

// 深色主题（为将来准备）
export const darkTheme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',

    colorBgBase: '#141414',
    colorBgContainer: '#1f1f1f',

    colorTextBase: '#ffffff',
    colorTextSecondary: '#999999',

    colorBorder: '#434343',
    borderRadius: 6,
  },
};

// 默认导出浅色主题
export default lightTheme;
