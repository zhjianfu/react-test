import React from 'react';
import { Input, Select, Tag, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UserType } from '../../types/user';
import type { RoleType, RoleUserType } from '../../types/role';

interface UserColumnsProps {
  roles: RoleType[];
  roleUsers: Record<string, RoleUserType[]>;
  editingKey: string | null;
  editingRecord: UserType | null;
  onFieldChange: (id: string, field: string, value: any) => void;
  onSave: (id: string) => void;
  onEdit: (record: UserType) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

export const useUserColumns = ({
  roles,
  roleUsers,
  editingKey,
  editingRecord,
  onFieldChange,
  onSave,
  onEdit,
  onCancel,
  onDelete,
}: UserColumnsProps): ColumnsType<UserType> => {
  return [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      render: (text: string, record: UserType) => {
        if (record.id === editingKey) {
          return (
            <Input 
              value={editingRecord?.name ?? text} 
              onChange={e => onFieldChange(record.id, 'name', e.target.value)} 
            />
          );
        }
        return text;
      }
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: '10%',
      render: (text: number, record: UserType) => {
        if (record.id === editingKey) {
          return (
            <Input 
              type="number" 
              value={editingRecord?.age ?? text} 
              onChange={e => onFieldChange(record.id, 'age', parseInt(e.target.value, 10))} 
            />
          );
        }
        return text;
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: '25%',
      render: (text: string, record: UserType) => {
        if (record.id === editingKey) {
          return (
            <Input 
              value={editingRecord?.email ?? text} 
              onChange={e => onFieldChange(record.id, 'email', e.target.value)} 
            />
          );
        }
        return text;
      }
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: '15%',
      render: (text: string, record: UserType) => {
        if (record.id === editingKey) {
          return (
            <Select
              value={editingRecord?.role ?? text}
              style={{ width: '100%' }}
              onChange={value => onFieldChange(record.id, 'role', value)}
              options={roles.map(role => ({
                value: role.code,
                label: role.name
              }))}
            />
          );
        }
        const currentRole = roles.find(role => role.code === text);
        return (
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
      render: (text: string, record: UserType) => {
        if (record.id === editingKey) {
          const currentRole = editingRecord?.role ?? record.role;
          const currentRoleUsers = roleUsers[currentRole] || [];
          return (
            <Select
              value={editingRecord?.roleUser ?? text}
              style={{ width: '100%' }}
              onChange={value => onFieldChange(record.id, 'roleUser', value)}
              options={currentRoleUsers.map(user => ({
                value: user.id,
                label: user.name
              }))}
            />
          );
        }
        const currentUser = (roleUsers[record.role] || []).find(user => user.id === text);
        return currentUser?.name || text;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (text: string, record: UserType) => {
        if (record.id === editingKey) {
          return (
            <Select
              value={editingRecord?.status ?? text}
              style={{ width: '100%' }}
              onChange={value => onFieldChange(record.id, 'status', value)}
              options={[
                { value: 'active', label: '活跃' },
                { value: 'inactive', label: '非活跃' },
              ]}
            />
          );
        }
        return (
          <Tag color={text === 'active' ? 'green' : 'red'}>
            {text === 'active' ? '活跃' : '非活跃'}
          </Tag>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      fixed: 'right',
      render: (_: any, record: UserType) => {
        if (record.id === editingKey) {
          return (
            <Space size="small">
              <Button 
                type="link" 
                size="small" 
                icon={<SaveOutlined />}
                onClick={() => onSave(record.id)}
              >
                保存
              </Button>
              <Button 
                type="link" 
                size="small" 
                icon={<CloseOutlined />}
                onClick={onCancel}
              >
                取消
              </Button>
            </Space>
          );
        }
        return (
          <Space size="small">
            <Button 
              type="link" 
              size="small" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)}
            >
              编辑
            </Button>
            <Popconfirm 
              title="确定删除?" 
              onConfirm={() => onDelete(record.id)}
            >
              <Button 
                type="link" 
                size="small" 
                danger 
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];
};
