import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Typography,
  Tooltip,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import useRoleStore from '../../store/roleStore';
import usePermissions from '../../hooks/usePermissions';
import PermissionGuard from '../../components/PermissionGuard';
import PermissionButton from '../../components/PermissionButton';
import RoleForm from './RoleForm';
import RolePermissionView from './RolePermissionView';

const { Title } = Typography;

const RoleManage = () => {
  const { roles, loading, getRoles, deleteRole } = useRoleStore();

  const { PERMISSIONS } = usePermissions();

  // 表单状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [viewingRole, setViewingRole] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  // 初始化数据
  useEffect(() => {
    getRoles();
  }, [getRoles]);

  // 添加角色
  const handleAdd = () => {
    setEditingRole(null);
    setIsModalVisible(true);
  };

  // 编辑角色
  const handleEdit = (role) => {
    setEditingRole(role);
    setIsModalVisible(true);
  };

  // 查看权限
  const handleViewPermissions = (role) => {
    setViewingRole(role);
    setIsViewModalVisible(true);
  };

  // 删除角色
  const handleDelete = async (id, role) => {
    const result = await deleteRole(id);
    if (result.success) {
      message.success(result.message);
    } else {
      message.error(result.message);
    }
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  // 获取状态文本
  const getStatusText = (status) => {
    return status === 'active' ? '启用' : '禁用';
  };

  // 表格列配置
  const columns = [
    {
      title: '角色名称',
      key: 'name',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.displayName}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.name}</div>
        </div>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '权限数量',
      key: 'permissionCount',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewPermissions(record)}>
          {record.permissions.length} 个权限
        </Button>
      ),
    },
    {
      title: '用户数量',
      key: 'userCount',
      render: (_, record) => (
        <Space>
          <UserOutlined />
          {record.userCount}
        </Space>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>
          {getStatusText(record.status)}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看权限">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewPermissions(record)}
              size="small"
            />
          </Tooltip>

          <PermissionButton
            permission={PERMISSIONS.SYSTEM_ROLE_MANAGE}
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
            tooltip="您没有角色编辑权限"
          >
            编辑
          </PermissionButton>

          <PermissionButton
            permission={PERMISSIONS.SYSTEM_ROLE_MANAGE}
            hideWhenNoPermission
          >
            <Popconfirm
              title={`确定要删除角色"${record.displayName}"吗？`}
              description={
                record.userCount > 0
                  ? '该角色下还有用户，无法删除'
                  : '删除后不可恢复'
              }
              onConfirm={() => handleDelete(record.id, record)}
              okText="确定"
              cancelText="取消"
              disabled={record.userCount > 0}
            >
              <Button
                type="link"
                icon={<DeleteOutlined />}
                danger
                size="small"
                disabled={record.userCount > 0}
              >
                删除
              </Button>
            </Popconfirm>
          </PermissionButton>
        </Space>
      ),
    },
  ];

  return (
    <PermissionGuard permission={PERMISSIONS.SYSTEM_ROLE_MANAGE}>
      <div>
        <Title level={2}>角色管理</Title>

        <Card>
          <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Col>
              <Space>
                <span>共 {roles.length} 个角色</span>
              </Space>
            </Col>
            <Col>
              <PermissionButton
                permission={PERMISSIONS.SYSTEM_ROLE_MANAGE}
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                添加角色
              </PermissionButton>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={roles}
            rowKey="id"
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
          />
        </Card>

        {/* 角色表单弹窗 */}
        <RoleForm
          visible={isModalVisible}
          role={editingRole}
          onCancel={() => setIsModalVisible(false)}
          onSuccess={() => {
            setIsModalVisible(false);
            getRoles();
          }}
        />

        {/* 权限查看弹窗 */}
        <RolePermissionView
          visible={isViewModalVisible}
          role={viewingRole}
          onCancel={() => setIsViewModalVisible(false)}
        />
      </div>
    </PermissionGuard>
  );
};

export default RoleManage;
