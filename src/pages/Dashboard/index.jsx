import React from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Typography,
  Space,
  Button,
} from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const Dashboard = () => {
  // 模拟统计数据
  const stats = [
    {
      title: '总用户数',
      value: 1328,
      icon: <UserOutlined style={{ color: '#1890ff' }} />,
      change: 12.5,
      positive: true,
    },
    {
      title: '商品总数',
      value: 892,
      icon: <ShoppingOutlined style={{ color: '#52c41a' }} />,
      change: 8.2,
      positive: true,
    },
    {
      title: '今日访问',
      value: 2435,
      icon: <FileTextOutlined style={{ color: '#faad14' }} />,
      change: -2.1,
      positive: false,
    },
    {
      title: '销售额',
      value: 25680,
      prefix: '¥',
      icon: <DollarOutlined style={{ color: '#f5222d' }} />,
      change: 15.3,
      positive: true,
    },
  ];

  return (
    <div>
      <Title level={2}>仪表盘</Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={
                  <Space>
                    {stat.icon}
                    <span
                      style={{
                        color: stat.positive ? '#52c41a' : '#f5222d',
                        fontSize: 12,
                      }}
                    >
                      {stat.positive ? (
                        <ArrowUpOutlined />
                      ) : (
                        <ArrowDownOutlined />
                      )}
                      {Math.abs(stat.change)}%
                    </span>
                  </Space>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="访问趋势" extra={<Button type="link">查看详情</Button>}>
            <div
              style={{
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ textAlign: 'center', color: '#999' }}>
                <FileTextOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <p>图表组件将在后续章节中添加</p>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="系统状态">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <p>CPU使用率</p>
                <Progress percent={65} size="small" />
              </div>
              <div>
                <p>内存使用率</p>
                <Progress percent={42} size="small" status="active" />
              </div>
              <div>
                <p>磁盘使用率</p>
                <Progress percent={78} size="small" />
              </div>
              <div>
                <p>网络带宽</p>
                <Progress percent={23} size="small" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
