// src/components/LoadingStates.jsx
import React from 'react';
import { Spin, Skeleton, Empty, Result, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

// 全局加载组件
export const GlobalLoading = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}
  >
    <Spin size="large" tip="加载中..." />
  </div>
);

// 表格加载骨架屏
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        key={rowIndex}
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '16px',
          padding: '16px 0',
        }}
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton.Input
            key={colIndex}
            style={{
              width: `${100 / columns}%`,
              height: '20px',
            }}
            active
          />
        ))}
      </div>
    ))}
  </div>
);

// 卡片加载骨架屏
export const CardSkeleton = ({ count = 8 }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px',
    }}
  >
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} active paragraph={{ rows: 3 }} />
    ))}
  </div>
);

// 错误状态组件
export const ErrorState = ({
  error,
  onRetry,
  title = '出现错误',
  description = '请稍后重试',
}) => (
  <Result
    status="error"
    title={title}
    subTitle={description}
    extra={
      onRetry && (
        <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
          重新加载
        </Button>
      )
    }
  />
);

// 空状态组件
export const EmptyState = ({ description = '暂无数据', action = null }) => (
  <Empty description={description} image={Empty.PRESENTED_IMAGE_SIMPLE}>
    {action}
  </Empty>
);
