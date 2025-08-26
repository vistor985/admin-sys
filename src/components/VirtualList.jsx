// src/components/VirtualList.jsx
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';

const VirtualList = ({
  items,
  itemHeight = 50,
  containerHeight = 400,
  renderItem,
  overscan = 5, // 预渲染的项目数量
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // 计算可见区域
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = start + visibleCount;

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length, end + overscan),
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // 可见项目
  const visibleItems = useMemo(() => {
    return items
      .slice(visibleRange.start, visibleRange.end)
      .map((item, index) => ({
        ...item,
        index: visibleRange.start + index,
      }));
  }, [items, visibleRange]);

  // 滚动处理
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  // 总高度
  const totalHeight = items.length * itemHeight;

  // 偏移量
  const offsetY = visibleRange.start * itemHeight;

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflow: 'auto',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item) => (
            <div
              key={item.index}
              style={{
                height: itemHeight,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {renderItem(item, item.index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 使用示例
const VirtualUserList = ({ users }) => {
  const renderUserItem = useCallback(
    (user, index) => (
      <div
        style={{
          padding: '0 16px',
          borderBottom: '1px solid #f0f0f0',
          width: '100%',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>{user.name}</div>
        <div style={{ color: '#666', fontSize: '12px' }}>{user.email}</div>
      </div>
    ),
    []
  );

  return (
    <VirtualList
      items={users}
      itemHeight={50}
      containerHeight={400}
      renderItem={renderUserItem}
      overscan={10}
    />
  );
};

export { VirtualList, VirtualUserList };
