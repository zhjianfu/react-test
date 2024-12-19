import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TableSelect from '../components/TableSelect/index';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  department: string;
  role: string;
  supervisor?: number;
}

const initialUsers: User[] = [
  { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', department: '技术部', role: '前端开发' },
  { id: 2, name: '李四', age: 32, email: 'lisi@example.com', department: '技术部', role: '后端开发' },
  { id: 3, name: '王五', age: 35, email: 'wangwu@example.com', department: '产品部', role: '产品经理' },
  { id: 4, name: '赵六', age: 26, email: 'zhaoliu@example.com', department: '设计部', role: 'UI设计师' },
  { id: 5, name: '钱七', age: 29, email: 'qianqi@example.com', department: '技术部', role: '测试工程师' },
  { id: 6, name: '孙八', age: 31, email: 'sunba@example.com', department: '运营部', role: '运营专员' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<User> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '职位',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '直属上级',
      dataIndex: 'supervisor',
      key: 'supervisor',
      render: (supervisorId: number | undefined) => {
        const supervisor = users.find(u => u.id === supervisorId);
        return supervisor?.name || '-';
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    message.success('删除成功');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        // 更新用户
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...values, id: editingUser.id } : user
        ));
        message.success('更新成功');
      } else {
        // 添加用户
        const newUser = {
          ...values,
          id: Math.max(...users.map(u => u.id)) + 1,
        };
        setUsers([...users, newUser]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          添加用户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ age: 18 }}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: '请输入年龄' }]}
          >
            <InputNumber min={18} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="department"
            label="部门"
            rules={[{ required: true, message: '请输入部门' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="职位"
            rules={[{ required: true, message: '请输入职位' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="supervisor"
            label="直属上级"
          >
            <TableSelect<User>
              placeholder="请选择直属上级"
              dataSource={users.filter(u => editingUser ? u.id !== editingUser.id : true)}
              columns={columns.filter(col => col.key !== 'action')}
              rowKey="id"
              valueKey="id"
              labelKey="name"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
