import React from 'react';
import {
  Modal,
  Descriptions,
  Tag,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Badge,
} from 'antd';
import { PERMISSION_GROUPS } from '../../config/permissions';

const { Title, Text } = Typography;

const RolePermissionView = ({ visible, role, onCancel }) => {
  if (!role) return null;

  // 按权限组分类显示权限
  const getPermissionsByGroup = () => {
    const result = {};

    Object.entries(PERMISSION_GROUPS).forEach(([groupKey, group]) => {
      const groupPermissions = role.permissions.filter((permission) =>
        group.permissions.includes(permission)
      );

      if (groupPermissions.length > 0) {
        result[groupKey] = {
          name: group.name,
          permissions: groupPermissions,
          total: group.permissions.length,
        };
      }
    });

    return result;
  };

  const permissionGroups = getPermissionsByGroup();

  return (
    <Modal
      title={`角色权限 - ${role.displayName}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="角色标识">{role.name}</Descriptions.Item>
        <Descriptions.Item label="角色名称">
          {role.displayName}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={role.status === 'active' ? 'success' : 'default'}>
            {role.status === 'active' ? '启用' : '禁用'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="用户数量">{role.userCount}</Descriptions.Item>
        <Descriptions.Item label="权限总数" span={2}>
          <Badge count={role.permissions.length} showZero color="#1890ff" />
        </Descriptions.Item>
        <Descriptions.Item label="描述" span={2}>
          {role.description || '暂无描述'}
        </Descriptions.Item>
      </Descriptions>

      <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>
        权限详情
      </Title>

      <Row gutter={[16, 16]}>
        {Object.entries(permissionGroups).map(([groupKey, group]) => (
          <Col span={12} key={groupKey}>
            <Card
              size="small"
              title={
                <Space>
                  <span>{group.name}</span>
                  <Badge
                    count={`${group.permissions.length}/${group.total}`}
                    color="#52c41a"
                  />
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {group.permissions.map((permission) => (
                  <Text key={permission} style={{ fontSize: 12 }}>
                    • {permission}
                  </Text>
                ))}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {Object.keys(permissionGroups).length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          该角色暂无权限
        </div>
      )}
    </Modal>
  );
};

export default RolePermissionView;
