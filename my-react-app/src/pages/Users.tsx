import { useState, useEffect } from 'react';
import { Card, Button, Space, Form, Tag, message, Modal, Popconfirm, Table, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import BaseTable from '../components/base/BaseTable';
import ActionButtonGroup from '../components/base/ActionButtonGroup';
import AdvancedSearchForm from '../components/base/AdvancedSearchForm';
import UserForm from '../components/user/UserForm';
import { UserService } from '../services/userService';
import { UserType } from '../types/user';
import { RoleService } from '../services/roleService';

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [modalForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserType[]>([]);
  const [selectedRows, setSelectedRows] = useState<UserType[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [roleUsers, setRoleUsers] = useState<Record<string, any[]>>({});
  const [selectedRole, setSelectedRole] = useState<string>('');

  // 示例数据
  const demoData = [
    {
      id: '1',
      name: '张三',
      age: 28,
      email: 'zhangsan@example.com',
      role: 'admin',
      roleUser: '1', // 对应 admin 角色下的张三
      status: 'active'
    },
    {
      id: '2',
      name: '李四',
      age: 32,
      email: 'lisi@example.com',
      role: 'editor',
      roleUser: '3', // 对应 editor 角色下的王五
      status: 'inactive'
    },
    {
      id: '3',
      name: '王五',
      age: 25,
      email: 'wangwu@example.com',
      role: 'user',
      roleUser: '5', // 对应 user 角色下的钱七
      status: 'active'
    }
  ];

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      const data = await RoleService.getRoles();
      setRoles(data);
      // 初始化时加载所有角色的用户数据
      for (const role of data) {
        fetchRoleUsers(role.code);
      }
      // 在角色数据加载完成后再加载用户数据
      setUserData(demoData);
    } catch (error) {
      message.error('获取角色列表失败');
    }
  };

  // 获取角色用户
  const fetchRoleUsers = async (roleCode: string) => {
    try {
      const users = await RoleService.getRoleUsers(roleCode);
      setRoleUsers(prev => ({
        ...prev,
        [roleCode]: users
      }));
    } catch (error) {
      message.error('获取角色用户失败');
    }
  };

  // 初始化加载角色数据
  useEffect(() => {
    fetchRoles();
  }, []);

  // 监听角色变化，加载对应用户
  useEffect(() => {
    if (selectedRole && !roleUsers[selectedRole]) {
      fetchRoleUsers(selectedRole);
    }
  }, [selectedRole]);

  // 处理字段变更
  const handleFieldChange = (id: string, field: string, value: any) => {
    setUserData(prev => 
      prev.map(item => {
        if (item.id === id) {
          // 如果改变的是角色，清空roleUser
          if (field === 'role') {
            setSelectedRole(value);
            return { ...item, [field]: value, roleUser: undefined };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
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

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRows.length === 0) {
      message.warning('请选择要删除的用户');
      return;
    }
    try {
      await Promise.all(selectedRows.map(user => UserService.deleteUser(user.id)));
      setUserData(prev => prev.filter(item => !selectedRows.find(row => row.id === item.id)));
      setSelectedRows([]);
      message.success('批量删除成功');
    } catch (error) {
      message.error('批量删除失败');
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

  // 表格列配置
  const columns: ColumnsType<any> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
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
      width: '10%',
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
      width: '25%',
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
      width: '15%',
      render: (text, record) => {
        const isEditing = record.id === editingKey;
        const currentRole = roles.find(role => role.code === text);
        return isEditing ? (
          <Select
            value={text}
            style={{ width: '100%' }}
            onChange={value => handleFieldChange(record.id, 'role', value)}
            options={roles.map(role => ({
              value: role.code,
              label: role.name
            }))}
          />
        ) : (
          <Tag color={text === 'admin' ? 'red' : text === 'editor' ? 'blue' : 'green'}>
            {currentRole?.name || text}
          </Tag>
        );
      }
    },
    {
      title: '用户',
      dataIndex: 'roleUser',
      key: 'roleUser',
      width: '15%',
      render: (text, record) => {
        const isEditing = record.id === editingKey;
        const currentRoleUsers = roleUsers[record.role] || [];
        const currentUser = currentRoleUsers.find(user => user.id === text);
        
        return isEditing ? (
          <Select
            value={text}
            style={{ width: '100%' }}
            onChange={value => handleFieldChange(record.id, 'roleUser', value)}
            options={currentRoleUsers.map(user => ({
              value: user.id,
              label: user.name
            }))}
          />
        ) : (
          currentUser?.name || text
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (text, record) => {
        const isEditing = record.id === editingKey;
        return isEditing ? (
          <Select
            defaultValue={text}
            style={{ width: '100%' }}
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
      width: '10%',
      fixed: 'right',
      render: (_, record) => {
        const isEditing = record.id === editingKey;
        return (
          <Space size="small">
            {isEditing ? (
              <Button type="link" size="small" onClick={() => handleSave(record.id)}>保存</Button>
            ) : (
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => setEditingKey(record.id)}>编辑</Button>
            )}
            <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  return (
    <div style={{ height: 'calc(100vh - 112px)', display: 'flex', flexDirection: 'column' }}>
      {/* 搜索区域 */}
      <Card style={{ marginBottom: 16, flex: 'none' }}>
        <AdvancedSearchForm 
          onSearch={handleSearch}
          onReset={fetchUsers}
          loading={loading}
        />
      </Card>

      {/* 操作按钮区域 */}
      <Card style={{ marginBottom: 16 }}>
        <ActionButtonGroup
          onAdd={() => setIsModalOpen(true)}
          onImport={() => {/* TODO */}}
          onExport={() => {/* TODO */}}
          onBatchDelete={handleBatchDelete}
          onBatchApprove={() => {/* TODO */}}
          onBatchDisable={() => {/* TODO */}}
          onBatchEnable={() => {/* TODO */}}
          onResetPassword={() => {/* TODO */}}
          selectedRows={selectedRows}
          loading={loading}
        />
      </Card>

      {/* 表格区域 */}
      <Card style={{ flex: 1, overflow: 'hidden' }}>
        <Table<UserType>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={userData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200, y: 'calc(100vh - 400px)' }}
        />
      </Card>

      {/* 用户表单弹窗 */}
      <Modal
        title={editingKey ? "编辑用户" : "新增用户"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingKey(null);
          modalForm.resetFields();
        }}
      >
        <UserForm form={modalForm} />
      </Modal>
    </div>
  );
};

export default Users;
