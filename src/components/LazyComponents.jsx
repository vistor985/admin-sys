// src/components/LazyComponents.jsx - 懒加载组件封装
import { lazy, Suspense } from 'react';
import Loading from '../components/Loading';

// 懒加载包装器
const createLazyComponent = (importFunc, fallback = <Loading />) => {
  const LazyComponent = lazy(importFunc);

  return function WrappedComponent(props) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

// 页面组件懒加载 - 提升首页加载性能
export const LazyLogin = createLazyComponent(() => import('../pages/Login'));
export const LazyDashboard = createLazyComponent(() =>
  import('../pages/Dashboard')
);
export const LazyUserManage = createLazyComponent(() =>
  import('../pages/UserManage')
);
export const LazyProductManage = createLazyComponent(() =>
  import('../pages/ProductManage')
);
export const LazyLog = createLazyComponent(() => import('../pages/Log'));
export const LazyNotFound = createLazyComponent(() =>
  import('../pages/NotFound')
);
