import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Radio,
  Checkbox,
  Space,
  message,
  Divider,
  Typography,
} from 'antd';
import useRoleStore from '../../store/roleStore';
import { PERMISSION_GROUPS } from '../../config/permissions';

const { TextArea } = Input;
const { Title } = Typography;

const RoleForm = ({ visible, role, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const {
    addRole,
    updateRole,
    loading,
    allPermissions,
    permissionDescriptions,
  } = useRoleStore();

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // 当弹窗打开时，设置表单初始值
  useEffect(() => {
    if (visible) {
      if (role) {
        // 编辑模式
        form.setFieldsValue({
          name: role.name,
          displayName: role.displayName,
          description: role.description,
          status: role.status,
        });
        setSelectedPermissions(role.permissions || []);
      } else {
        // 新增模式
        form.resetFields();
        form.setFieldsValue({
          status: 'active',
        });
        setSelectedPermissions([]);
      }
    }
  }, [visible, role, form]);

  // 处理权限选择
  const handlePermissionChange = (groupKey, checkedValues) => {
    const groupPermissions = PERMISSION_GROUPS[groupKey].permissions;
    const otherPermissions = selectedPermissions.filter(
      (permission) => !groupPermissions.includes(permission)
    );

    setSelectedPermissions([...otherPermissions, ...checkedValues]);
  };

  // 全选/取消全选某个权限组
  const handleGroupCheckAll = (groupKey, checked) => {
    const groupPermissions = PERMISSION_GROUPS[groupKey].permissions;

    if (checked) {
      // 全选：添加该组所有权限
      const newPermissions = [
        ...new Set([...selectedPermissions, ...groupPermissions]),
      ];
      setSelectedPermissions(newPermissions);
    } else {
      // 取消全选：移除该组所有权限
      const newPermissions = selectedPermissions.filter(
        (permission) => !groupPermissions.includes(permission)
      );
      setSelectedPermissions(newPermissions);
    }
  };

  // 检查权限组是否全选
  const isGroupAllSelected = (groupKey) => {
    const groupPermissions = PERMISSION_GROUPS[groupKey].permissions;
    return groupPermissions.every((permission) =>
      selectedPermissions.includes(permission)
    );
  };

  // 检查权限组是否部分选中
  const isGroupIndeterminate = (groupKey) => {
    const groupPermissions = PERMISSION_GROUPS[groupKey].permissions;
    const selectedCount = groupPermissions.filter((permission) =>
      selectedPermissions.includes(permission)
    ).length;
    return selectedCount > 0 && selectedCount < groupPermissions.length;
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const roleData = {
        ...values,
        permissions: selectedPermissions,
      };

      let result;
      if (role) {
        // 编辑角色
        result = await updateRole(role.id, roleData);
      } else {
        // 添加角色
        result = await addRole(roleData);
      }

      if (result.success) {
        message.success(result.message);
        onSuccess();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.log('表单验证失败:', error);
    }
  };

  // 取消操作
  const handleCancel = () => {
    form.resetFields();
    setSelectedPermissions([]);
    onCancel();
  };

  return (
    <Modal
      title={role ? '编辑角色' : '添加角色'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={800}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="name"
          label="角色标识"
          rules={[
            { required: true, message: '请输入角色标识' },
            { min: 2, message: '角色标识至少2个字符' },
            { max: 50, message: '角色标识最多50个字符' },
            {
              pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
              message: '角色标识只能包含字母、数字和下划线，且以字母开头',
            },
          ]}
        >
          <Input
            placeholder="请输入角色标识，如：admin, editor"
            disabled={!!role} // 编辑时禁用角色标识
          />
        </Form.Item>

        <Form.Item
          name="displayName"
          label="角色名称"
          rules={[
            { required: true, message: '请输入角色名称' },
            { min: 2, message: '角色名称至少2个字符' },
            { max: 50, message: '角色名称最多50个字符' },
          ]}
        >
          <Input placeholder="请输入角色名称，如：超级管理员" />
        </Form.Item>

        <Form.Item
          name="description"
          label="角色描述"
          rules={[{ max: 200, message: '角色描述最多200个字符' }]}
        >
          <TextArea
            rows={3}
            placeholder="请输入角色描述"
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Radio.Group>
            <Radio value="active">启用</Radio>
            <Radio value="inactive">禁用</Radio>
          </Radio.Group>
        </Form.Item>

        <Divider>权限配置</Divider>

        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => (
            <div key={groupKey} style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 12 }}>
                <Checkbox
                  checked={isGroupAllSelected(groupKey)}
                  indeterminate={isGroupIndeterminate(groupKey)}
                  onChange={(e) =>
                    handleGroupCheckAll(groupKey, e.target.checked)
                  }
                >
                  <Title level={5} style={{ margin: 0, display: 'inline' }}>
                    {group.name}
                  </Title>
                </Checkbox>
              </div>

              <Checkbox.Group
                value={selectedPermissions.filter((permission) =>
                  group.permissions.includes(permission)
                )}
                onChange={(checkedValues) =>
                  handlePermissionChange(groupKey, checkedValues)
                }
                style={{ width: '100%', paddingLeft: 24 }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {group.permissions.map((permission) => (
                    <Checkbox key={permission} value={permission}>
                      {permissionDescriptions[permission] || permission}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            </div>
          ))}
        </div>
      </Form>
    </Modal>
  );
};

export default RoleForm;
