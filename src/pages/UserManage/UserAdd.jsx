import React from 'react';
import { Card, Typography } from 'antd';
import UserForm from './UserForm';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const UserAdd = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Title level={2}>添加用户</Title>
      <Card>
        <UserForm
          visible={true}
          user={null}
          onCancel={() => navigate('/users')}
          onSuccess={() => navigate('/users')}
        />
      </Card>
    </div>
  );
};

export default UserAdd;
