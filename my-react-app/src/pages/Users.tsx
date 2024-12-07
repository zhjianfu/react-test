import { useState } from 'react';
import { Card, Button, Space, Form, Tag, message, Modal, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import BaseTable from '../components/base/BaseTable';
import ActionButtons from '../components/base/ActionButtons';
import UserSearchForm from '../components/user/UserSearchForm';
import UserForm from '../components/user/UserForm';
import { UserService } from '../services/userService';
import { UserType } from '../types/user';

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [modalForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserType[]>([]);

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getUsers();
      setUserData(data);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索用户
  const handleSearch = async (values: any) => {
    setLoading(true);
    try {
      const data = await UserService.searchUsers(values);
      setUserData(data);
      message.success('搜索完成');
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  // 新增用户
  const handleAdd = () => {
    modalForm.resetFields();
    setEditingKey(null);
    setIsModalOpen(true);
  };

  // 编辑用户
  const handleEdit = (record: UserType) => {
    modalForm.setFieldsValue(record);
    setEditingKey(record.key);
    setIsModalOpen(true);
  };

  // 删除用户
  const handleDelete = async (key: string) => {
    try {
      await UserService.deleteUser(key);
      setUserData(userData.filter(item => item.key !== key));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 提交表单
  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      if (editingKey === null) {
        // 新增用户
        const newUser = await UserService.addUser(values);
        setUserData([newUser, ...userData]);
        message.success('添加成功');
      } else {
        // 编辑用户
        const updatedUser = await UserService.updateUser(editingKey, values);
        setUserData(userData.map(item => 
          item.key === editingKey ? updatedUser : item
        ));
        message.success('更新成功');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  // 表格列定义
  const columns: ColumnsType<UserType> = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const color = role === '管理员' ? 'red' : role === '编辑' ? 'blue' : 'green';
        return <Tag color={color}>{role}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === '活跃' ? 'success' : status === '禁用' ? 'error' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此用户吗?"
            onConfirm={() => handleDelete(record.key)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ height: 'calc(100vh - 112px)', display: 'flex', flexDirection: 'column' }}>
      {/* 搜索区域 */}
      <Card style={{ marginBottom: 16, flex: 'none' }}>
        <UserSearchForm 
          onSearch={handleSearch}
          onReset={fetchUsers}
        />
      </Card>

      {/* 按钮栏 */}
      <Card style={{ marginBottom: 16, flex: 'none' }}>
        <ActionButtons
          onAdd={handleAdd}
          onRefresh={fetchUsers}
        />
      </Card>

      {/* 表格区域 */}
      <Card style={{ flex: 1, overflow: 'hidden' }}>
        <BaseTable<UserType>
          columns={columns}
          dataSource={userData}
          loading={loading}
          scroll={{ y: 'calc(100% - 55px)' }}
        />
      </Card>

      {/* 新增/编辑用户模态框 */}
      <Modal
        title={editingKey === null ? "新增用户" : "编辑用户"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <UserForm form={modalForm} />
      </Modal>
    </div>
  );
};

export default Users;
