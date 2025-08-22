// src/pages/Dashboard/index.jsx - 仪表盘页面
import React, { useEffect, useRef } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

const Dashboard = () => {
  const chartRef = useRef();

  useEffect(() => {
    // 初始化图表
    const chart = echarts.init(chartRef.current);

    const option = {
      title: { text: '销售趋势' },
      xAxis: {
        type: 'category',
        data: ['一月', '二月', '三月', '四月', '五月', '六月'],
      },
      yAxis: { type: 'value' },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330],
          type: 'line',
        },
      ],
    };

    chart.setOption(option);

    return () => chart.dispose();
  }, []);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={1128}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={2847}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="销售趋势">
        <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
      </Card>
    </div>
  );
};

export default Dashboard;
