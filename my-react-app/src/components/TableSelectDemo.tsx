import React, { useState } from 'react';
import TableSelect from './TableSelect';
import type { ColumnsType } from 'antd/es/table';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

const TableSelectDemo: React.FC = () => {
  const [singleValue, setSingleValue] = useState<number>();
  const [multipleValue, setMultipleValue] = useState<number[]>([]);

  // 示例数据
  const dataSource: User[] = [
    { id: 1, name: 'John Brown', age: 32, email: 'john@example.com' },
    { id: 2, name: 'Jim Green', age: 42, email: 'jim@example.com' },
    { id: 3, name: 'Joe Black', age: 32, email: 'joe@example.com' },
    { id: 4, name: 'Jim Red', age: 32, email: 'jimred@example.com' },
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
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h3>单选模式</h3>
        <TableSelect<User>
          placeholder="请选择用户"
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          valueKey="id"
          labelKey="name"
          value={singleValue}
          onChange={setSingleValue}
        />
      </div>

      <div>
        <h3>多选模式</h3>
        <TableSelect<User>
          mode="multiple"
          placeholder="请选择用户"
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          valueKey="id"
          labelKey="name"
          value={multipleValue}
          onChange={setMultipleValue}
        />
      </div>
    </div>
  );
};

export default TableSelectDemo;
