import React, { useState } from 'react';
import { Card, Space, Button, message } from 'antd';
import TableSelect from '../components/TableSelect';
import type { ColumnsType } from 'antd/es/table';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  department: string;
  role: string;
}

const TableSelectPage: React.FC = () => {
  const [singleValue, setSingleValue] = useState<number>();
  const [multipleValue, setMultipleValue] = useState<number[]>([]);

  // 模拟用户数据
  const users: User[] = [
    { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', department: '技术部', role: '前端开发' },
    { id: 2, name: '李四', age: 32, email: 'lisi@example.com', department: '技术部', role: '后端开发' },
    { id: 3, name: '王五', age: 35, email: 'wangwu@example.com', department: '产品部', role: '产品经理' },
    { id: 4, name: '赵六', age: 26, email: 'zhaoliu@example.com', department: '设计部', role: 'UI设计师' },
    { id: 5, name: '钱七', age: 29, email: 'qianqi@example.com', department: '技术部', role: '测试工程师' },
    { id: 6, name: '孙八', age: 31, email: 'sunba@example.com', department: '运营部', role: '运营专员' },
  ];

  // 表格列配置
  const columns: ColumnsType<User> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 100,
    },
    {
      title: '职位',
      dataIndex: 'role',
      key: 'role',
      width: 100,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
  ];

  const handleSubmit = () => {
    message.success('提交成功！');
    console.log('单选值:', singleValue);
    console.log('多选值:', multipleValue);
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Space direction="vertical" size="large" style={{ display: 'flex' }}>
        <Card title="单选用户" bordered={false}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <TableSelect<User>
              placeholder="请选择用户"
              dataSource={users}
              columns={columns}
              rowKey="id"
              valueKey="id"
              labelKey="name"
              value={singleValue}
              onChange={setSingleValue}
              style={{ width: '100%' }}
            />
            <div>当前选择的用户ID: {singleValue}</div>
          </Space>
        </Card>

        <Card title="多选用户" bordered={false}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <TableSelect<User>
              mode="multiple"
              placeholder="请选择多个用户"
              dataSource={users}
              columns={columns}
              rowKey="id"
              valueKey="id"
              labelKey="name"
              value={multipleValue}
              onChange={setMultipleValue}
              style={{ width: '100%' }}
            />
            <div>当前选择的用户IDs: {multipleValue?.join(', ')}</div>
          </Space>
        </Card>

        <Button type="primary" onClick={handleSubmit}>
          提交
        </Button>
      </Space>
    </div>
  );
};

export default TableSelectPage;
