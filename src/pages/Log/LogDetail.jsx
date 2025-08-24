import React from 'react';
import {
  Modal,
  Descriptions,
  Tag,
  Typography,
  Space,
  Card,
  Row,
  Col,
  Alert,
} from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const LogDetail = ({ visible, log, onCancel }) => {
  if (!log) return null;

  // 获取状态图标
  const getStatusIcon = (status) => {
    const icons = {
      success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      failed: <CloseCircleOutlined style={{ color: '#f5222d' }} />,
      warning: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
    };
    return icons[status] || null;
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    const colors = {
      success: 'success',
      failed: 'error',
      warning: 'warning',
    };
    return colors[status] || 'default';
  };

  // 格式化耗时
  const formatDuration = (duration) => {
    if (duration < 1000) {
      return `${duration}ms`;
    } else {
      return `${(duration / 1000).toFixed(2)}s`;
    }
  };

  // 格式化User-Agent
  const formatUserAgent = (userAgent) => {
    // 简单解析User-Agent
    if (userAgent.includes('Chrome')) {
      return 'Google Chrome';
    } else if (userAgent.includes('Firefox')) {
      return 'Mozilla Firefox';
    } else if (userAgent.includes('Safari')) {
      return 'Safari';
    } else if (userAgent.includes('Edge')) {
      return 'Microsoft Edge';
    }
    return 'Unknown Browser';
  };

  return (
    <Modal
      title={
        <Space>
          <span>日志详情</span>
          <Tag color={getStatusColor(log.status)}>
            {getStatusIcon(log.status)}
            {log.status.toUpperCase()}
          </Tag>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Row gutter={[16, 16]}>
        {/* 基本信息 */}
        <Col span={24}>
          <Card title="基本信息" size="small">
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item
                label={
                  <Space>
                    <UserOutlined />
                    用户信息
                  </Space>
                }
              >
                <Space direction="vertical" size={0}>
                  <Text strong>{log.username}</Text>
                  <Text type="secondary">{log.userRole}</Text>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <Space>
                    <ClockCircleOutlined />
                    操作时间
                  </Space>
                }
              >
                {log.createTime}
              </Descriptions.Item>

              <Descriptions.Item label="操作类型">
                <Tag color="blue">{log.action}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="所属模块">
                <Tag color="green">{log.module}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="操作目标">
                {log.target}
                {log.targetId && (
                  <Text type="secondary"> (ID: {log.targetId})</Text>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="执行状态">
                <Tag color={getStatusColor(log.status)}>
                  {getStatusIcon(log.status)}
                  {log.status === 'success'
                    ? '成功'
                    : log.status === 'failed'
                    ? '失败'
                    : '警告'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 请求信息 */}
        <Col span={24}>
          <Card title="请求信息" size="small">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item
                label={
                  <Space>
                    <ApiOutlined />
                    请求方法
                  </Space>
                }
              >
                <Tag color="orange">{log.method}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="请求URL">
                <Text code>{log.url}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <Space>
                    <GlobalOutlined />
                    客户端IP
                  </Space>
                }
              >
                <Text code>{log.ip}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="浏览器">
                {formatUserAgent(log.userAgent)}
              </Descriptions.Item>

              <Descriptions.Item label="User-Agent">
                <Paragraph
                  copyable
                  style={{ margin: 0, fontSize: 12 }}
                  ellipsis={{ rows: 2, expandable: true }}
                >
                  {log.userAgent}
                </Paragraph>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 操作详情 */}
        <Col span={24}>
          <Card title="操作详情" size="small">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="操作描述">
                {log.message}
              </Descriptions.Item>

              <Descriptions.Item label="执行耗时">
                <Tag color="purple">
                  <ClockCircleOutlined />
                  {formatDuration(log.duration)}
                </Tag>
              </Descriptions.Item>

              {log.extra && Object.keys(log.extra).length > 0 && (
                <Descriptions.Item label="额外信息">
                  <Card size="small" style={{ background: '#fafafa' }}>
                    <pre
                      style={{
                        margin: 0,
                        fontSize: 12,
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                      }}
                    >
                      {JSON.stringify(log.extra, null, 2)}
                    </pre>
                  </Card>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* 状态提示 */}
        {log.status === 'failed' && (
          <Col span={24}>
            <Alert
              message="操作失败"
              description={log.message}
              type="error"
              showIcon
            />
          </Col>
        )}

        {log.status === 'warning' && (
          <Col span={24}>
            <Alert
              message="操作警告"
              description={log.message}
              type="warning"
              showIcon
            />
          </Col>
        )}
      </Row>
    </Modal>
  );
};

export default LogDetail;
