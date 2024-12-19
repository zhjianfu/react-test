import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TableSelect from '../components/TableSelect';
import type { RequestParams, ResponseData } from '../components/TableSelect/types';

// 用户组接口
interface UserGroup {
  id: number;
  name: string;
  description: string;
  members: number[];
  createdAt: string;
  updatedAt: string;
}

// 用户接口
interface User {
  id: number;
  name: string;
  email: string;
  department: string;
}

const UserGroups: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 模拟获取用户组列表
  const fetchGroups = async (page: number, size: number) => {
    setLoading(true);
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 模拟分页数据
      const mockGroups = Array.from({ length: 35 }, (_, index) => ({
        id: index + 1,
        name: `用户组${index + 1}`,
        description: `这是用户组${index + 1}的描述`,
        members: [1, 2, 3].map(n => n + index),
        createdAt: '2023-12-20 10:00:00',
        updatedAt: '2023-12-20 10:00:00'
      }));

      const start = (page - 1) * size;
      const end = start + size;
      setGroups(mockGroups.slice(start, end));
      setTotal(mockGroups.length);
    } catch (error) {
      message.error('获取用户组列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑
  const handleEdit = (record: UserGroup) => {
    setEditingGroup(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      members: record.members.map(id => Number(id)),  // 确保 ID 类型一致
    });
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    const submitData = {
      ...values,
      members: values.members.map(String),  // 确保存储为字符串类型
      id: editingGroup?.id,
      createdAt: editingGroup?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingGroup) {
      // 更新
      const updatedGroups = groups.map(group =>
        group.id === editingGroup.id ? submitData : group
      );
      setGroups(updatedGroups);
    } else {
      // 新增
      submitData.id = String(groups.length + 1);
      setGroups([...groups, submitData]);
    }

    setIsModalVisible(false);
    form.resetFields();
    setEditingGroup(null);
  };

  // 模拟用户搜索接口
  const fetchUsers = async (params: RequestParams): Promise<ResponseData<User>> => {
    console.log('fetchUsers params:', params);
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    // 模拟用户数据
    const mockUsers = Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      name: `用户${index + 1}`,
      email: `user${index + 1}@example.com`,
      department: ['技术部', '产品部', '运营部', '市场部'][index % 4],
    }));

    // 处理按 ID 查询
    const idField = Object.keys(params).find(key => Array.isArray(params[key]));
    if (idField && Array.isArray(params[idField])) {
      console.log('Filtering by field:', idField, 'values:', params[idField]);
      const users = mockUsers.filter(user => {
        const userIdValue = Number(user[idField]);
        const match = params[idField].some((id: any) => Number(id) === userIdValue);
        console.log(`User ${user.name}, ${idField}=${userIdValue}, match=${match}`);
        return match;
      });
      console.log('Matched users:', users);
      return {
        list: users,
        total: users.length
      };
    }

    // 处理搜索
    let filteredUsers = mockUsers;
    if (params.search) {
      const searchText = params.search.toLowerCase();
      filteredUsers = mockUsers.filter(user => 
        user.name.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText) ||
        user.department.toLowerCase().includes(searchText)
      );
    }

    // 处理分页
    const start = (params.page - 1) * params.pageSize;
    const end = start + params.pageSize;
    const pageUsers = filteredUsers.slice(start, end);

    return {
      list: pageUsers,
      total: filteredUsers.length
    };
  };

  useEffect(() => {
    fetchGroups(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleAdd = () => {
    setEditingGroup(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      setGroups(groups.filter(group => group.id !== id));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns: ColumnsType<UserGroup> = [
    {
      title: '组名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '成员数',
      dataIndex: 'members',
      key: 'members',
      render: (members: number[]) => members.length,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
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

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          新增用户组
        </Button>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={groups}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          }
        }}
      />

      <Modal
        title={editingGroup ? '编辑用户组' : '新增用户组'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="组名"
            rules={[{ required: true, message: '请输入组名' }]}
          >
            <Input placeholder="请输入组名" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea placeholder="请输入描述" />
          </Form.Item>

          <Form.Item
            label="成员"
            name="members"
            rules={[{ required: true, message: '请选择成员' }]}
          >
            <TableSelect
              mode="multiple"
              placeholder="请选择成员"
              style={{ width: '100%' }}
              rowKey="id"
              valueKey="id"
              labelKey="name"
              idKey="id"  // 添加 idKey 配置
              request={fetchUsers}
              columns={[
                {
                  title: '姓名',
                  dataIndex: 'name',
                },
                {
                  title: '邮箱',
                  dataIndex: 'email',
                },
                {
                  title: '部门',
                  dataIndex: 'department',
                },
              ]}
              searchKeys={['name', 'email', 'department']}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserGroups;
