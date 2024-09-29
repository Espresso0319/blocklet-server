import { Button, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';

import api from '../libs/api';
import './home.css';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 4 },
};

function Home() {
  const [isEditing, setIsEditing] = useState(false); // 是否处于编辑模式
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone: '',
  });

  const [form] = Form.useForm(); // Ant Design 表单实例

  // 获取用户信息
  const getUser = async () => {
    try {
      const { data } = await api.get('/api/profile');
      setProfile(data); // 设置获取到的用户信息
      form.setFieldsValue(data); // 设置表单初始值
    } catch (error) {
      message.error('Failed to fetch user data.');
    }
  };

  // 在组件挂载时调用 getUser
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    getUser();
  }, []);

  // 切换到编辑模式
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 保存编辑的内容
  const handleSave = async () => {
    try {
      const values = await form.validateFields(); // 校验表单

      // 调用 PUT /profile 接口进行更新
      await api.put('api/profile', values);

      setProfile(values); // 保存更新后的数据

      setIsEditing(false); // 切换回展示模式
      message.success('Profile updated successfully!');
    } catch (errorInfo) {
      message.error('Failed to update profile, please check the fields.');
    }
  };

  return (
    <div className="profile-container">
      {!isEditing ? (
        // 展示模式
        <div className="profile-display">
          <h2>User Profile</h2>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Phone:</strong> {profile.phone}
          </p>
          <Button type="primary" onClick={handleEdit}>
            Edit Profile
          </Button>
        </div>
      ) : (
        // 编辑模式
        <div className="profile-edit">
          <h2>Edit Profile</h2>
          <Form {...layout} form={form} name="profile-form">
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: 'Please enter your username' },
                { min: 3, message: 'Username must be at least 3 characters' },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: 'Please enter your phone number' },
                {
                  pattern: /^\d{3}-\d{3}-\d{4}$/,
                  message: 'Phone number must be in the format 123-456-7890',
                },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}

export default Home;
