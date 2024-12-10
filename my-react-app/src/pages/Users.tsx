import { useState } from 'react';
import { Card, Button, Space, Form, Tag, message, Modal, Popconfirm, Table, Input, Select } from 'antd';
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
  const [selectedRows, setSelectedRows] = useState<UserType[]>([]);
  
  // 示例数据
  const demoData = [
    {
      id: '1',
      name: '张三',
      age: 28,
      email: 'zhangsan@example.com',
      role: 'admin',
      status: 'active'
    },
    {
      id: '2',
      name: '李四',
      age: 32,
      email: 'lisi@example.com',
      role: 'user',
      status: 'inactive'
    },
    {
      id: '3',
      name: '王五',
      age: 25,
      email: 'wangwu@example.com',
      role: 'editor',
      status: 'active'
    }
  ];

  // 表格列配置
  const columns: ColumnsType<any> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        const isEditing = record.id === editingKey;
        return isEditing ? (
          <Input defaultValue={text} onChange={e => handleFieldChange(record.id, 'name', e.target.value)} />
        ) : (
          text
        );
      }
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      render: (text, record) => {
        const isEditing = record.id === editingKey;
        return isEditing ? (
          <Input type="number" defaultValue={text} onChange={e => handleFieldChange(record.id, 'age', e.target.value)} />
        ) : (
          text
        );
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => {
        const isEditing = record.id === editingKey;
        return isEditing ? (
          <Input defaultValue={text} onChange={e => handleFieldChange(record.id, 'email', e.target.value)} />
        ) : (
          text
        );
      }
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (text, record) => {
        const isEditing = record.id === editingKey;
        return isEditing ? (
          <Select
            defaultValue={text}
            style={{ width: 120 }}
            onChange={value => handleFieldChange(record.id, 'role', value)}
            options={[
              { value: 'admin', label: '管理员' },
              { value: 'user', label: '用户' },
              { value: 'editor', label: '编辑' },
            ]}
          />
        ) : (
          text
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        const isEditing = record.id === editingKey;
        return isEditing ? (
          <Select
            defaultValue={text}
            style={{ width: 120 }}
            onChange={value => handleFieldChange(record.id, 'status', value)}
            options={[
              { value: 'active', label: '活跃' },
              { value: 'inactive', label: '非活跃' },
            ]}
          />
        ) : (
          <Tag color={text === 'active' ? 'green' : 'red'}>
            {text === 'active' ? '活跃' : '非活跃'}
          </Tag>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        const isEditing = record.id === editingKey;
        return (
          <Space>
            {isEditing ? (
              <>
                <Button type="link" onClick={() => handleSave(record.id)}>保存</Button>
                <Button type="link" onClick={() => setEditingKey(null)}>取消</Button>
              </>
            ) : (
              <>
                <Button type="link" icon={<EditOutlined />} onClick={() => setEditingKey(record.id)}>
                  编辑
                </Button>
                <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
                  <Button type="link" danger icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>
              </>
            )}
          </Space>
        );
      }
    }
  ];

  // 处理字段变更
  const handleFieldChange = (id: string, field: string, value: any) => {
    setUserData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // 处理保存
  const handleSave = (id: string) => {
    const record = userData.find(item => item.id === id);
    if (record) {
      // 这里可以添加数据验证
      if (!record.name || !record.email) {
        message.error('姓名和邮箱不能为空');
        return;
      }
      // TODO: 调用API保存数据
      setEditingKey(null);
      message.success('保存成功');
    }
  };

  // 处理删除
  const handleDelete = (id: string) => {
    setUserData(prev => prev.filter(item => item.id !== id));
    message.success('删除成功');
  };

  // 处理选择变更
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: UserType[]) => {
      setSelectedRows(selectedRows);
    }
  };

  // 组件挂载时加载示例数据
  useState(() => {
    setUserData(demoData);
  });

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
    const newUser = {
      id: `temp-${Date.now()}`,  // 临时ID
      name: '',
      age: '',
      email: '',
      role: 'user',
      status: 'active'
    };
    setUserData([newUser, ...userData]);
    setEditingKey(newUser.id);  // 立即进入编辑状态
  };

  // 编辑用户
  const handleEdit = (record: UserType) => {
    modalForm.setFieldsValue(record);
    setEditingKey(record.id);
    setIsModalOpen(true);
  };

  // 删除用户
  const handleDeleteUser = async (id: string) => {
    try {
      await UserService.deleteUser(id);
      setUserData(userData.filter(item => item.id !== id));
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
          item.id === editingKey ? updatedUser : item
        ));
        message.success('更新成功');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  // 表格列定义
  const tableColumns: ColumnsType<UserType> = [
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
            onConfirm={() => handleDeleteUser(record.id)}
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
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleAdd}>
            新增用户
          </Button>
        </div>
        <Table<UserType>
          columns={columns}
          dataSource={userData}
          rowSelection={rowSelection}
          pagination={false}
          scroll={{ y: 'calc(100% - 55px)' }}
          rowKey="id"
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
