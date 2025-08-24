import React from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Tag,
  Space,
  Image,
  Popconfirm,
  Pagination,
  Spin,
  Typography,
  Tooltip,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import usePermissions from '../../hooks/usePermissions';

const { Meta } = Card;
const { Text } = Typography;

const ProductCard = ({
  products,
  loading,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  const { hasPermission, PERMISSIONS } = usePermissions();

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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              hoverable
              cover={
                <div style={{ height: 200, overflow: 'hidden' }}>
                  <Image
                    alt={product.name}
                    src={product.images[0]}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                  />
                </div>
              }
              actions={[
                <Tooltip title="查看详情" key="view">
                  <EyeOutlined />
                </Tooltip>,
                ...(hasPermission(PERMISSIONS.PRODUCT_EDIT)
                  ? [
                      <Tooltip title="编辑" key="edit">
                        <EditOutlined onClick={() => onEdit(product)} />
                      </Tooltip>,
                    ]
                  : []),
                ...(hasPermission(PERMISSIONS.PRODUCT_DELETE)
                  ? [
                      <Popconfirm
                        title="确定要删除这个商品吗？"
                        onConfirm={() => onDelete(product.id)}
                        okText="确定"
                        cancelText="取消"
                        key="delete"
                      >
                        <Tooltip title="删除">
                          <DeleteOutlined style={{ color: '#ff4d4f' }} />
                        </Tooltip>
                      </Popconfirm>,
                    ]
                  : []),
              ]}
            >
              <Meta
                title={
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {product.name}
                  </div>
                }
                description={
                  <div>
                    <div
                      style={{
                        marginBottom: 8,
                        height: 40,
                        overflow: 'hidden',
                        color: '#666',
                      }}
                    >
                      {product.description}
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <Space wrap>
                        {product.tags.map((tag) => (
                          <Tag key={tag} size="small">
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <Tag color="blue">{product.categoryName}</Tag>
                      <Tag
                        color={getStatusColor(product.status, product.stock)}
                      >
                        {getStatusText(product.status, product.stock)}
                      </Tag>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#f50',
                          }}
                        >
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice > product.price && (
                          <Text delete style={{ color: '#999', fontSize: 12 }}>
                            {formatPrice(product.originalPrice)}
                          </Text>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontSize: 12,
                            color: '#666',
                          }}
                        >
                          库存: {product.stock}
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 分页 */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger
          showQuickJumper
          showTotal={(total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }
          onChange={(page, pageSize) =>
            onPageChange({ current: page, pageSize })
          }
          onShowSizeChange={(current, size) =>
            onPageChange({ current: 1, pageSize: size })
          }
        />
      </div>
    </div>
  );
};

export default ProductCard;
