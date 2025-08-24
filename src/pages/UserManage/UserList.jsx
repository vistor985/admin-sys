import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Avatar,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Typography,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import useUserStore from '../../store/userStore';
import usePermissions from '../../hooks/usePermissions';
import UserForm from './UserForm';

const { Title } = Typography;
const { Option } = Select;

const UserList = () => {
  const {
    users,
    loading,
    pagination,
    searchKeyword,
    filters,
    getUsers,
    deleteUser,
  } = useUserStore();

  const { hasPermission, PERMISSIONS } = usePermissions();

  // 表单相关状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  // 初始化数据
  useEffect(() => {
    handleSearch();
  }, []);

  // 搜索和筛选
  const handleSearch = (page = 1) => {
    getUsers({
      page,
      pageSize: pagination.pageSize,
      keyword: searchValue,
      role: filters.role,
      status: filters.status,
    });
  };

  // 处理分页变化
  const handleTableChange = (paginationInfo) => {
    handleSearch(paginationInfo.current);
  };

  // 处理筛选变化
  const handleFilterChange = (type, value) => {
    getUsers({
      page: 1,
      pageSize: pagination.pageSize,
      keyword: searchValue,
      role: type === 'role' ? value : filters.role,
      status: type === 'status' ? value : filters.status,
    });
  };

  // 添加用户
  const handleAdd = () => {
    setEditingUser(null);
    setIsModalVisible(true);
  };

  // 编辑用户
  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  // 删除用户
  const handleDelete = async (id) => {
    const result = await deleteUser(id);
    if (result.success) {
      message.success(result.message);
    } else {
      message.error(result.message);
    }
  };

  // 角色标签样式
  const getRoleColor = (role) => {
    const colors = {
      admin: 'red',
      editor: 'blue',
      viewer: 'green',
    };
    return colors[role] || 'default';
  };

  // 角色名称
  const getRoleName = (role) => {
    const names = {
      admin: '管理员',
      editor: '编辑员',
      viewer: '查看员',
    };
    return names[role] || role;
  };

  // 状态标签样式
  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  // 状态名称
  const getStatusName = (status) => {
    return status === 'active' ? '正常' : '禁用';
  };

  // 表格列配置
  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar, record) => (
        <Avatar src={avatar} icon={<UserOutlined />} alt={record.name} />
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role) => (
        <Tag color={getRoleColor(role)}>{getRoleName(role)}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusName(status)}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          {hasPermission(PERMISSIONS.USER_EDIT) && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            >
              编辑
            </Button>
          )}
          {hasPermission(PERMISSIONS.USER_DELETE) && (
            <Popconfirm
              title="确定要删除这个用户吗？"
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
      <Title level={2}>用户管理</Title>

      <Card>
        {/* 搜索和筛选区域 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="搜索用户名、姓名或邮箱"
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
              placeholder="角色"
              value={filters.role}
              onChange={(value) => handleFilterChange('role', value)}
            >
              <Option value="all">全部角色</Option>
              <Option value="admin">管理员</Option>
              <Option value="editor">编辑员</Option>
              <Option value="viewer">查看员</Option>
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
              <Option value="active">正常</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={12}>
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
                  useUserStore.getState().resetFilters();
                  handleSearch(1);
                }}
              >
                重置
              </Button>
              {hasPermission(PERMISSIONS.USER_CREATE) && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                >
                  添加用户
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        {/* 用户表格 */}
        <Table
          columns={columns}
          dataSource={users}
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
      </Card>

      {/* 用户表单弹窗 */}
      <UserForm
        visible={isModalVisible}
        user={editingUser}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          handleSearch(pagination.current);
        }}
      />
    </div>
  );
};

export default UserList;
