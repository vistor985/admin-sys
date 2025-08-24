import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Image,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Typography,
  Slider,
  Radio,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  TableOutlined,
  AppstoreOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import useProductStore from '../../store/productStore';
import usePermissions from '../../hooks/usePermissions';
import ProductForm from './ProductForm';
import ProductCard from './ProductCard';

const { Title } = Typography;
const { Option } = Select;

const ProductList = () => {
  const {
    products,
    categories,
    loading,
    pagination,
    searchKeyword,
    filters,
    viewMode,
    getProducts,
    deleteProduct,
    setViewMode,
  } = useProductStore();

  const { hasPermission, PERMISSIONS } = usePermissions();

  // 表单相关状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);

  // 初始化数据
  useEffect(() => {
    handleSearch();
  }, []);

  // 搜索和筛选
  const handleSearch = (page = 1) => {
    getProducts({
      page,
      pageSize: pagination.pageSize,
      keyword: searchValue,
      categoryId: filters.categoryId,
      status: filters.status,
      priceRange: priceRange,
    });
  };

  // 处理分页变化
  const handleTableChange = (paginationInfo) => {
    handleSearch(paginationInfo.current);
  };

  // 处理筛选变化
  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters };
    if (type === 'priceRange') {
      setPriceRange(value);
      newFilters.priceRange = value;
    } else {
      newFilters[type] = value;
    }

    getProducts({
      page: 1,
      pageSize: pagination.pageSize,
      keyword: searchValue,
      ...newFilters,
    });
  };

  // 添加商品
  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalVisible(true);
  };

  // 编辑商品
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  // 删除商品
  const handleDelete = async (id) => {
    const result = await deleteProduct(id);
    if (result.success) {
      message.success(result.message);
    } else {
      message.error(result.message);
    }
  };

  // 格式化价格
  const formatPrice = (price) => {
    return `¥${price.toLocaleString()}`;
  };

  // 获取状态颜色
  const getStatusColor = (status, stock) => {
    if (stock === 0) return 'error';
    return status === 'active' ? 'success' : 'default';
  };

  // 获取状态文本
  const getStatusText = (status, stock) => {
    if (stock === 0) return '缺货';
    return status === 'active' ? '在售' : '下架';
  };

  // 表格列配置
  const columns = [
    {
      title: '商品图片',
      dataIndex: 'images',
      key: 'images',
      width: 100,
      render: (images, record) => (
        <Image
          width={60}
          height={60}
          src={images[0]}
          alt={record.name}
          style={{ objectFit: 'cover' }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
        />
      ),
    },
    {
      title: '商品信息',
      key: 'info',
      width: 300,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            {record.name}
          </div>
          <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>
            {record.description}
          </div>
          <Space wrap>
            {record.tags.map((tag) => (
              <Tag key={tag} size="small">
                {tag}
              </Tag>
            ))}
          </Space>
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 100,
    },
    {
      title: '价格',
      key: 'price',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#f50' }}>
            {formatPrice(record.price)}
          </div>
          {record.originalPrice > record.price && (
            <div
              style={{
                textDecoration: 'line-through',
                color: '#999',
                fontSize: 12,
              }}
            >
              {formatPrice(record.originalPrice)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
      render: (stock) => (
        <span style={{ color: stock === 0 ? '#f50' : '#000' }}>{stock}</span>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      render: (_, record) => (
        <Tag color={getStatusColor(record.status, record.stock)}>
          {getStatusText(record.status, record.stock)}
        </Tag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button type="link" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          {hasPermission(PERMISSIONS.PRODUCT_EDIT) && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            >
              编辑
            </Button>
          )}
          {hasPermission(PERMISSIONS.PRODUCT_DELETE) && (
            <Popconfirm
              title="确定要删除这个商品吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" icon={<DeleteOutlined />} danger size="small">
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>商品管理</Title>

      <Card>
        {/* 搜索和筛选区域 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="搜索商品名称、描述或标签"
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={() => handleSearch(1)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={4} md={3}>
            <Select
              style={{ width: '100%' }}
              placeholder="分类"
              value={filters.categoryId}
              onChange={(value) => handleFilterChange('categoryId', value)}
            >
              <Option value="all">全部分类</Option>
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={4} md={3}>
            <Select
              style={{ width: '100%' }}
              placeholder="状态"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="all">全部状态</Option>
              <Option value="active">在售</Option>
              <Option value="inactive">下架</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <div>
              <span style={{ marginRight: 8 }}>价格范围：</span>
              <Slider
                range
                min={0}
                max={50000}
                step={100}
                value={priceRange}
                onChange={setPriceRange}
                onAfterChange={(value) =>
                  handleFilterChange('priceRange', value)
                }
                tooltip={{
                  formatter: (value) => `¥${value}`,
                }}
              />
            </div>
          </Col>
          <Col xs={24} md={6}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => handleSearch(1)}
              >
                搜索
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setSearchValue('');
                  setPriceRange([0, 50000]);
                  useProductStore.getState().resetFilters();
                  handleSearch(1);
                }}
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 工具栏 */}
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Col>
            {hasPermission(PERMISSIONS.PRODUCT_CREATE) && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                添加商品
              </Button>
            )}
          </Col>
          <Col>
            <Radio.Group
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <Radio.Button value="table">
                <TableOutlined /> 表格
              </Radio.Button>
              <Radio.Button value="card">
                <AppstoreOutlined /> 卡片
              </Radio.Button>
            </Radio.Group>
          </Col>
        </Row>

        {/* 商品展示区域 */}
        {viewMode === 'table' ? (
          <Table
            columns={columns}
            dataSource={products}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
            size="middle"
          />
        ) : (
          <ProductCard
            products={products}
            loading={loading}
            pagination={pagination}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={handleTableChange}
          />
        )}
      </Card>

      {/* 商品表单弹窗 */}
      <ProductForm
        visible={isModalVisible}
        product={editingProduct}
        categories={categories}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          handleSearch(pagination.current);
        }}
      />
    </div>
  );
};

export default ProductList;
