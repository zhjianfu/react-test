import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Input, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TableSelect from '../components/TableSelect';
import type { RequestParams, ResponseData } from '../components/TableSelect/types';
import RichTextEditor from '../components/RichTextEditor';

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

  // 邮件列表相关状态
  const [isEmailListModalOpen, setIsEmailListModalOpen] = useState(false);
  // 邮件编辑相关状态
  const [isEmailEditModalOpen, setIsEmailEditModalOpen] = useState(false);
  const [emailModalType, setEmailModalType] = useState<'send' | 'forward'>('send');
  const [emailForm] = Form.useForm();
  const [emailContent, setEmailContent] = useState('');

  // 邮件列表表格的列定义
  const emailColumns = [
    {
      title: '主题',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: '发件人',
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: '收件人',
      dataIndex: 'recipients',
      key: 'recipients',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => handleEmailAction('send', record)}>
            发送邮件
          </Button>
          <Button type="link" onClick={() => handleEmailAction('forward', record)}>
            转发邮件
          </Button>
        </Space>
      ),
    },
  ];

  // 处理邮件操作
  const handleEmailAction = (type: 'send' | 'forward', record: any) => {
    setEmailModalType(type);
    setIsEmailEditModalOpen(true);
    setIsEmailListModalOpen(false);
    
    // 设置表单值
    emailForm.setFieldsValue({
      subject: type === 'forward' ? `Fw: ${record.subject}` : record.subject,
      sender: type === 'forward' ? '' : record.recipients,  // 发送时，收件人变为发件人
      recipients: type === 'forward' ? '' : record.sender,  // 发送时，发件人变为收件人
      cc: '',
      bcc: ''
    });

    // 设置编辑器内容
    if (type === 'forward') {
      setEmailContent(`<br/><br/>-------- 原始邮件 --------<br/>
         <strong>发件人:</strong> ${record.sender}<br/>
         <strong>收件人:</strong> ${record.recipients}<br/>
         <strong>日期:</strong> ${record.date}<br/>
         <strong>主题:</strong> ${record.subject}<br/>
         <br/>
         ${record.content}`);
    } else {
      // 发送邮件时，直接使用原始内容
      setEmailContent(record.content);
    }
  };

  // 处理邮件发送
  const handleEmailSubmit = async () => {
    try {
      const values = await emailForm.validateFields();
      console.log('Email values:', { ...values, content: emailContent });
      setIsEmailEditModalOpen(false);
      emailForm.resetFields();
      setEmailContent('');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

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
      console.error('获取用户组列表失败');
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
      members: record.members,  
    });
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Submit values:', values);
      
      const submitData = {
        ...values,
        members: values.members || [],  
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
        submitData.id = groups.length + 1;
        setGroups([...groups, submitData]);
      }

      console.log(editingGroup ? '更新成功' : '创建成功');
      setIsModalVisible(false);
      form.resetFields();
      setEditingGroup(null);
      // 刷新列表
      fetchGroups(currentPage, pageSize);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
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
      console.log('删除成功');
    } catch (error) {
      console.error('删除失败');
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
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button type="primary" onClick={() => {
          setEditingGroup(null);
          form.resetFields();
          setIsModalVisible(true);
        }}>
          创建用户组
        </Button>
        <Button 
          type="primary" 
          onClick={() => setIsEmailListModalOpen(true)}
          style={{ marginLeft: '8px' }}
        >
          邮件列表
        </Button>
      </div>

      <Table
        loading={loading}
        dataSource={groups}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          },
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <Modal
        title={editingGroup ? '编辑用户组' : '创建用户组'}
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
          >
            <TableSelect<User>
              mode="multiple"
              placeholder="请选择成员"
              style={{ width: '100%' }}
              request={fetchUsers}
              rowKey="id"
              valueKey="id"
              labelKey="name"
              dropdownWidth={600}
              dropdownHeight={400}
              showHeader={true}
              showPagination={true}
              searchPlaceholder="请输入姓名搜索"
              columns={[
                {
                  title: '姓名',
                  dataIndex: 'name',
                  key: 'name',
                  width: 120,
                },
                {
                  title: '邮箱',
                  dataIndex: 'email',
                  key: 'email',
                  width: 200,
                },
                {
                  title: '部门',
                  dataIndex: 'department',
                  key: 'department',
                  width: 120,
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 邮件列表 Modal */}
      <Modal
        title="邮件列表"
        open={isEmailListModalOpen}
        onCancel={() => setIsEmailListModalOpen(false)}
        width={800}
        footer={null}
      >
        <Table
          columns={emailColumns}
          dataSource={[
            {
              key: '1',
              subject: '测试邮件1',
              sender: 'sender1@example.com',
              recipients: 'recipient1@example.com',
              date: '2023-12-21',
              content: '这是测试邮件1的内容'
            },
            {
              key: '2',
              subject: '测试邮件2',
              sender: 'sender2@example.com',
              recipients: 'recipient2@example.com',
              date: '2023-12-20',
              content: '<div>这是测试邮件2的内容</div><hr/><h3>这是标题</h3><p>这是正文</p>'
            },
          ]}
        />
      </Modal>

      {/* 邮件编辑 Modal */}
      <Modal
        title={emailModalType === 'send' ? '发送邮件' : '转发邮件'}
        open={isEmailEditModalOpen}
        onOk={handleEmailSubmit}
        onCancel={() => setIsEmailEditModalOpen(false)}
        width={1000}
      >
        <Form
          form={emailForm}
          layout="vertical"
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            {/* 左列 */}
            <div style={{ flex: 1 }}>
              <Form.Item
                name="sender"
                label="发件人"
                rules={[{ required: true, message: '请输入发件人' }]}
              >
                <Input placeholder="请输入发件人邮箱" />
              </Form.Item>

              <Form.Item
                name="recipients"
                label="收件人"
                rules={[{ required: true, message: '请输入收件人' }]}
              >
                <Input placeholder="请输入收件人邮箱，多个收件人用分号分隔" />
              </Form.Item>
            </div>

            {/* 右列 */}
            <div style={{ flex: 1 }}>
              <Form.Item
                name="cc"
                label="抄送"
              >
                <Input placeholder="请输入抄送邮箱，多个抄送用分号分隔" />
              </Form.Item>

              <Form.Item
                name="bcc"
                label="密送"
              >
                <Input placeholder="请输入密送邮箱，多个密送用分号分隔" />
              </Form.Item>
            </div>
          </div>

          {/* 跨越两列的字段 */}
          <Form.Item
            name="subject"
            label="主题"
            rules={[{ required: true, message: '请输入邮件主题' }]}
          >
            <Input placeholder="请输入邮件主题" />
          </Form.Item>

          <Form.Item
            label="内容"
            required
            rules={[{ required: true, message: '请输入邮件内容' }]}
          >
            <RichTextEditor
              value={emailContent}
              onChange={setEmailContent}
              height={300}
              placeholder="请输入邮件内容"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserGroups;
