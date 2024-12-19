import React, { useState } from 'react';
import { Card, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TableSelect from '../components/TableSelect';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  department: string;
  role: string;
}

const TableSelectDemo: React.FC = () => {
  const [singleValue, setSingleValue] = useState<number>();
  const [multipleValue, setMultipleValue] = useState<number[]>([]);

  // 示例数据
  const dataSource: User[] = [
    { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', department: '技术部', role: '前端开发' },
    { id: 2, name: '李四', age: 32, email: 'lisi@example.com', department: '技术部', role: '后端开发' },
    { id: 3, name: '王五', age: 35, email: 'wangwu@example.com', department: '产品部', role: '产品经理' },
    { id: 4, name: '赵六', age: 26, email: 'zhaoliu@example.com', department: '设计部', role: 'UI设计师' },
    { id: 5, name: '钱七', age: 29, email: 'qianqi@example.com', department: '技术部', role: '测试工程师' },
    { id: 6, name: '孙八', age: 31, email: 'sunba@example.com', department: '运营部', role: '运营专员' },
  ];

  // 表格列定义
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
  ];

  return (
    <Card title="TableSelect 组件测试">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card title="单选模式" type="inner">
          <TableSelect<User>
            placeholder="请选择用户"
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            valueKey="id"
            labelKey="name"
            value={singleValue}
            onChange={setSingleValue}
            style={{ width: '100%' }}
          />
          <div style={{ marginTop: 8 }}>
            当前选择：{singleValue ? dataSource.find(u => u.id === singleValue)?.name : '未选择'}
          </div>
        </Card>

        <Card title="多选模式" type="inner">
          <TableSelect<User>
            mode="multiple"
            placeholder="请选择多个用户"
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            valueKey="id"
            labelKey="name"
            value={multipleValue}
            onChange={setMultipleValue}
            style={{ width: '100%' }}
          />
          <div style={{ marginTop: 8 }}>
            当前选择：{multipleValue.map(id => dataSource.find(u => u.id === id)?.name).join(', ') || '未选择'}
          </div>
        </Card>
      </Space>
    </Card>
  );
};

export default TableSelectDemo;
