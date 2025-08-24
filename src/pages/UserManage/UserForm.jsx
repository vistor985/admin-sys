import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Radio, message, Space } from 'antd';
import useUserStore from '../../store/userStore';

const { Option } = Select;
const { TextArea } = Input;

const UserForm = ({ visible, user, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { addUser, updateUser, loading } = useUserStore();

  // 当弹窗打开时，设置表单初始值
  useEffect(() => {
    if (visible) {
      if (user) {
        // 编辑模式
        form.setFieldsValue({
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
        });
      } else {
        // 新增模式
        form.resetFields();
        form.setFieldsValue({
          role: 'viewer',
          status: 'active',
        });
      }
    }
  }, [visible, user, form]);

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      let result;
      if (user) {
        // 编辑用户
        result = await updateUser(user.id, values);
      } else {
        // 添加用户
        result = await addUser(values);
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
    onCancel();
  };

  return (
    <Modal
      title={user ? '编辑用户' : '添加用户'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, message: '用户名至少3个字符' },
            { max: 20, message: '用户名最多20个字符' },
            {
              pattern: /^[a-zA-Z0-9_]+$/,
              message: '用户名只能包含字母、数字和下划线',
            },
          ]}
        >
          <Input
            placeholder="请输入用户名"
            disabled={!!user} // 编辑时禁用用户名
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="姓名"
          rules={[
            { required: true, message: '请输入姓名' },
            { min: 2, message: '姓名至少2个字符' },
            { max: 50, message: '姓名最多50个字符' },
          ]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            { required: true, message: '请输入手机号' },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入有效的手机号',
            },
          ]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item
          name="role"
          label="角色"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select placeholder="请选择角色">
            <Option value="admin">管理员</Option>
            <Option value="editor">编辑员</Option>
            <Option value="viewer">查看员</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Radio.Group>
            <Radio value="active">正常</Radio>
            <Radio value="inactive">禁用</Radio>
          </Radio.Group>
        </Form.Item>

        {!user && (
          <Form.Item
            name="password"
            label="初始密码"
            rules={[
              { required: true, message: '请输入初始密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password placeholder="请输入初始密码" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UserForm;
