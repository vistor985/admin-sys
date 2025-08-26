// src/components/OptimizedComponents.jsx
import React, { memo, useMemo, useCallback } from 'react';
import { Table, Button, Form, Input } from 'antd';

// 1. 使用 React.memo 避免不必要的重渲染
const OptimizedTable = memo(
  ({ dataSource, columns, loading, onChange, ...props }) => {
    // 使用 useMemo 缓存计算结果
    const memoizedColumns = useMemo(() => {
      return columns.map((col) => ({
        ...col,
        // 为每一列添加 shouldCellUpdate 优化
        shouldCellUpdate: (record, prevRecord) => {
          return record[col.dataIndex] !== prevRecord[col.dataIndex];
        },
      }));
    }, [columns]);

    return (
      <Table
        dataSource={dataSource}
        columns={memoizedColumns}
        loading={loading}
        onChange={onChange}
        {...props}
      />
    );
  },
  (prevProps, nextProps) => {
    // 自定义比较函数，只在关键属性变化时重渲染
    return (
      prevProps.dataSource === nextProps.dataSource &&
      prevProps.loading === nextProps.loading &&
      prevProps.columns.length === nextProps.columns.length
    );
  }
);

// 2. 优化的搜索组件
const OptimizedSearchForm = memo(({ onSearch, loading }) => {
  const [form] = Form.useForm();

  // 使用 useCallback 缓存事件处理函数
  const handleSubmit = useCallback(
    async (values) => {
      await onSearch(values);
    },
    [onSearch]
  );

  const handleReset = useCallback(() => {
    form.resetFields();
    onSearch({});
  }, [form, onSearch]);

  return (
    <Form form={form} layout="inline" onFinish={handleSubmit}>
      <Form.Item name="keyword">
        <Input placeholder="搜索关键词" allowClear />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          搜索
        </Button>
        <Button onClick={handleReset} style={{ marginLeft: 8 }}>
          重置
        </Button>
      </Form.Item>
    </Form>
  );
});

export { OptimizedTable, OptimizedSearchForm };
