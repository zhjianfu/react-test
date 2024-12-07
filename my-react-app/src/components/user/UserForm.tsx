import { Form, Input, InputNumber, Select } from 'antd';
import BaseForm from '../base/BaseForm';
import { UserType } from '../../types/user';

export interface UserFormProps {
  form: any;
}

const UserForm = ({ form }: UserFormProps) => {
  return (
    <BaseForm form={form}>
      <Form.Item
        name="name"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        name="age"
        label="年龄"
        rules={[{ required: true, message: '请输入年龄' }]}
      >
        <InputNumber min={1} max={120} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item
        name="role"
        label="角色"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <Select
          placeholder="请选择角色"
          options={[
            { value: '管理员', label: '管理员' },
            { value: '编辑', label: '编辑' },
            { value: '普通用户', label: '普通用户' },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="status"
        label="状态"
        rules={[{ required: true, message: '请选择状态' }]}
      >
        <Select
          placeholder="请选择状态"
          options={[
            { value: '活跃', label: '活跃' },
            { value: '禁用', label: '禁用' },
            { value: '待验证', label: '待验证' },
          ]}
        />
      </Form.Item>
    </BaseForm>
  );
};

export default UserForm;
