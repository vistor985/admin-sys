import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

// 获取当前文件的目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 构建分析插件
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // 缓存策略
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Admin Panel',
        short_name: 'AdminPanel',
        description: 'React管理系统',
        theme_color: '#1890ff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@api': path.resolve(__dirname, './src/api'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  // 开发服务器优化
  server: {
    port: 3000,
    open: true,
    cors: true,
    // 预构建依赖
    force: true,
  },
  // 构建优化
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',

    // 代码分割
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // 手动分包
        manualChunks: {
          // React相关
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Ant Design
          'antd-vendor': ['antd'],

          // 状态管理
          'store-vendor': ['zustand'],

          // 工具库
          'utils-vendor': ['dayjs', 'axios'],

          // 图标
          'icons-vendor': ['@ant-design/icons'],
        },

        // 文件命名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(extType)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除console
        drop_debugger: true, // 移除debugger
      },
    },

    // 生成sourcemap
    sourcemap: false,

    // 资源内联阈值
    assetsInlineLimit: 4096,

    // CSS代码分割
    cssCodeSplit: true,
  },
  // 依赖预构建优化
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'antd',
      'zustand',
      '@ant-design/icons',
      'dayjs',
      'axios',
    ],
    exclude: [],
  },
  // CSS优化
  css: {
    // CSS模块化
    modules: {
      localsConvention: 'camelCase',
    },

    // 预处理器选项
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // Ant Design主题定制
        modifyVars: {
          '@primary-color': '#1890ff',
          '@border-radius-base': '6px',
        },
      },
    },
  },
});
