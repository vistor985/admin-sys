import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  message,
  Typography,
  Row,
  Col,
  DatePicker,
  Popconfirm,
  Modal,
  Statistic,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  DeleteOutlined,
  ExportOutlined,
  ReloadOutlined,
  EyeOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import useLogStore, {
  LOG_ACTIONS,
  LOG_MODULES,
  LOG_STATUS,
} from '../../store/logStore';
import usePermissions from '../../hooks/usePermissions';
import PermissionGuard from '../../components/PermissionGuard';
import PermissionButton from '../../components/PermissionButton';
import LogDetail from './LogDetail';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const LogManage = () => {
  const {
    logs,
    statistics,
    loading,
    pagination,
    searchKeyword,
    filters,
    getLogs,
    getStatistics,
    deleteLogs,
    exportLogs,
  } = useLogStore();

  const { PERMISSIONS } = usePermissions();

  // 状态
  const [searchValue, setSearchValue] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // 初始化数据
  useEffect(() => {
    handleSearch();
    getStatistics();
  }, []);

  // 搜索和筛选
  const handleSearch = (page = 1) => {
    getLogs({
      page,
      pageSize: pagination.pageSize,
      keyword: searchValue,
      userId: filters.userId,
      action: filters.action,
      module: filters.module,
      status: filters.status,
      dateRange: filters.dateRange,
    });
  };

  // 处理分页变化
  const handleTableChange = (paginationInfo) => {
    handleSearch(paginationInfo.current);
  };

  // 处理筛选变化
  const handleFilterChange = (type, value) => {
    getLogs({
      page: 1,
      pageSize: pagination.pageSize,
      keyword: searchValue,
      userId: type === 'userId' ? value : filters.userId,
      action: type === 'action' ? value : filters.action,
      module: type === 'module' ? value : filters.module,
      status: type === 'status' ? value : filters.status,
      dateRange: type === 'dateRange' ? value : filters.dateRange,
    });
  };

  // 查看详情
  const handleViewDetail = (log) => {
    setSelectedLog(log);
    setIsDetailModalVisible(true);
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的日志');
      return;
    }

    const result = await deleteLogs(selectedRowKeys);
    if (result.success) {
      message.success(result.message);
      setSelectedRowKeys([]);
    } else {
      message.error(result.message);
    }
  };

  // 导出日志
  const handleExport = async () => {
    const result = await exportLogs({
      keyword: searchValue,
      userId: filters.userId,
      action: filters.action,
      module: filters.module,
      status: filters.status,
      dateRange: filters.dateRange,
    });

    if (result.success) {
      message.success(`导出成功，共 ${result.count} 条记录`);
      // 在真实项目中，这里会触发文件下载
      console.log('下载链接:', result.downloadUrl);
    } else {
      message.error(result.message);
    }
  };

  // 获取操作类型标签
  const getActionTag = (action) => {
    const actionColors = {
      [LOG_ACTIONS.LOGIN]: 'blue',
      [LOG_ACTIONS.LOGOUT]: 'orange',
      [LOG_ACTIONS.CREATE]: 'green',
      [LOG_ACTIONS.UPDATE]: 'gold',
      [LOG_ACTIONS.DELETE]: 'red',
      [LOG_ACTIONS.VIEW]: 'default',
      [LOG_ACTIONS.EXPORT]: 'purple',
      [LOG_ACTIONS.SEARCH]: 'cyan',
    };

    const actionNames = {
      [LOG_ACTIONS.LOGIN]: '登录',
      [LOG_ACTIONS.LOGOUT]: '退出',
      [LOG_ACTIONS.CREATE]: '新增',
      [LOG_ACTIONS.UPDATE]: '修改',
      [LOG_ACTIONS.DELETE]: '删除',
      [LOG_ACTIONS.VIEW]: '查看',
      [LOG_ACTIONS.EXPORT]: '导出',
      [LOG_ACTIONS.SEARCH]: '搜索',
    };

    return (
      <Tag color={actionColors[action] || 'default'}>
        {actionNames[action] || action}
      </Tag>
    );
  };

  // 获取状态标签
  const getStatusTag = (status) => {
    const statusColors = {
      [LOG_STATUS.SUCCESS]: 'success',
      [LOG_STATUS.FAILED]: 'error',
      [LOG_STATUS.WARNING]: 'warning',
    };

    const statusNames = {
      [LOG_STATUS.SUCCESS]: '成功',
      [LOG_STATUS.FAILED]: '失败',
      [LOG_STATUS.WARNING]: '警告',
    };

    return <Tag color={statusColors[status]}>{statusNames[status]}</Tag>;
  };

  // 获取模块名称
  const getModuleName = (module) => {
    const moduleNames = {
      [LOG_MODULES.AUTH]: '认证',
      [LOG_MODULES.USER]: '用户',
      [LOG_MODULES.PRODUCT]: '商品',
      [LOG_MODULES.ROLE]: '角色',
      [LOG_MODULES.LOG]: '日志',
      [LOG_MODULES.SYSTEM]: '系统',
    };

    return moduleNames[module] || module;
  };

  // 表格列配置
  const columns = [
    {
      title: '时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      sorter: true,
    },
    {
      title: '用户',
      key: 'user',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.username}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.userRole}</div>
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 80,
      render: (action) => getActionTag(action),
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 80,
      render: (module) => getModuleName(module),
    },
    {
      title: '描述',
      dataIndex: 'message',
      key: 'message',
      ellipsis: {
        showTitle: false,
      },
      render: (message) => (
        <Tooltip placement="topLeft" title={message}>
          {message}
        </Tooltip>
      ),
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => getStatusTag(status),
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: (duration) => `${duration}ms`,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            size="small"
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record) => ({
      disabled: false, // 可以根据权限设置是否可选
    }),
  };

  return (
    <PermissionGuard permission={PERMISSIONS.LOG_VIEW}>
      <div>
        <Title level={2}>日志管理</Title>

        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总日志数"
                value={statistics.total}
                prefix={<InfoCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="今日日志"
                value={statistics.today}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="成功操作"
                value={statistics.success}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="失败操作"
                value={statistics.failed}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>

        <Card>
          {/* 搜索和筛选区域 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={8} md={6}>
              <Input
                placeholder="搜索用户、IP、描述等"
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
                placeholder="操作类型"
                value={filters.action}
                onChange={(value) => handleFilterChange('action', value)}
              >
                <Option value="all">全部操作</Option>
                {Object.entries(LOG_ACTIONS).map(([key, value]) => (
                  <Option key={value} value={value}>
                    {getActionTag(value).props.children}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} sm={4} md={3}>
              <Select
                style={{ width: '100%' }}
                placeholder="模块"
                value={filters.module}
                onChange={(value) => handleFilterChange('module', value)}
              >
                <Option value="all">全部模块</Option>
                {Object.entries(LOG_MODULES).map(([key, value]) => (
                  <Option key={value} value={value}>
                    {getModuleName(value)}
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
                {Object.entries(LOG_STATUS).map(([key, value]) => (
                  <Option key={value} value={value}>
                    {getStatusTag(value).props.children}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <RangePicker
                style={{ width: '100%' }}
                placeholder={['开始时间', '结束时间']}
                value={filters.dateRange}
                onChange={(value) => handleFilterChange('dateRange', value)}
              />
            </Col>
            <Col xs={24} md={3}>
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
                    useLogStore.getState().resetFilters();
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
              <Space>
                <PermissionButton
                  permission={PERMISSIONS.LOG_DELETE}
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleBatchDelete}
                  disabled={selectedRowKeys.length === 0}
                >
                  批量删除 ({selectedRowKeys.length})
                </PermissionButton>
              </Space>
            </Col>
            <Col>
              <PermissionButton
                permission={PERMISSIONS.LOG_EXPORT}
                icon={<ExportOutlined />}
                onClick={handleExport}
              >
                导出日志
              </PermissionButton>
            </Col>
          </Row>

          {/* 日志表格 */}
          <Table
            columns={columns}
            dataSource={logs}
            rowKey="id"
            loading={loading}
            rowSelection={rowSelection}
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

        {/* 日志详情弹窗 */}
        <LogDetail
          visible={isDetailModalVisible}
          log={selectedLog}
          onCancel={() => setIsDetailModalVisible(false)}
        />
      </div>
    </PermissionGuard>
  );
};

export default LogManage;
