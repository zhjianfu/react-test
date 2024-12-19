import React, { useState } from 'react';
import { Card, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TableSelect from '../components/TableSelect/index';
import type { RequestParams, ResponseData } from '../components/TableSelect/index';

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

  // 模拟后端API请求
  const fetchUsers = async (params: RequestParams): Promise<ResponseData<User>> => {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 模拟数据
    const allUsers: User[] = Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      name: `用户${index + 1}`,
      age: 20 + (index % 20),
      email: `user${index + 1}@example.com`,
      department: ['技术部', '产品部', '运营部', '市场部'][index % 4],
      role: ['开发', '测试', '产品经理', '设计师'][index % 4],
    }));

    // 处理搜索
    let filteredUsers = allUsers;
    if (params.search) {
      const searchText = params.search.toLowerCase();
      filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText) ||
        user.department.toLowerCase().includes(searchText) ||
        user.role.toLowerCase().includes(searchText)
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
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="本地数据模式">
          <TableSelect<User>
            placeholder="请选择用户"
            dataSource={[
              { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', department: '技术部', role: '开发' },
              { id: 2, name: '李四', age: 32, email: 'lisi@example.com', department: '产品部', role: '产品经理' },
              { id: 3, name: '王五', age: 25, email: 'wangwu@example.com', department: '设计部', role: '设计师' },
            ]}
            columns={columns}
            rowKey="id"
            valueKey="id"
            labelKey="name"
            value={singleValue}
            onChange={setSingleValue}
            style={{ width: '100%' }}
            showSearch
            searchPlaceholder="搜索姓名、邮箱、部门或职位"
          />
        </Card>

        <Card title="后端请求模式">
          <Space direction="vertical" style={{ width: '100%' }}>
            <TableSelect<User>
              mode="multiple"
              placeholder="请选择多个用户"
              columns={columns}
              rowKey="id"
              valueKey="id"
              labelKey="name"
              value={multipleValue}
              onChange={setMultipleValue}
              style={{ width: '100%' }}
              showSearch
              searchPlaceholder="搜索姓名、邮箱、部门或职位"
              request={fetchUsers}
              pageSize={10}
              extraParams={{ type: 'staff' }} // 可以传递额外的参数给后端
            />
            <div>已选择的用户ID: {multipleValue.join(', ')}</div>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default TableSelectDemo;
