import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ProductList from './ProductList';

const ProductManage = () => {
  const location = useLocation();

  // 如果是 /products 路径，显示商品列表
  if (location.pathname === '/products') {
    return <ProductList />;
  }

  // 其他子路由通过 Outlet 渲染
  return <Outlet />;
};

export default ProductManage;
