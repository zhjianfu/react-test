import React, { useState, useCallback, useEffect } from 'react';
import { Card, Form, Modal, Table } from 'antd';
import type { UserType } from '../types/user';

import AdvancedSearchForm from '../components/base/AdvancedSearchForm';
import ActionButtonGroup from '../components/base/ActionButtonGroup';
import UserForm from '../components/user/UserForm';
import { useUserColumns } from '../components/user/UserColumns';
import { useTableSelection } from '../hooks/useTableSelection';
import { useModal } from '../hooks/useModal';
import { useUsers } from '../hooks/useUsers';
import { useRoles } from '../hooks/useRoles';

const Users: React.FC = () => {
  const [modalForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<UserType | null>(null);

  // 使用自定义hooks
  const { 
    loading, 
    userData,
    searchUsers, 
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    batchDeleteUsers 
  } = useUsers();

  const {
    roles,
    roleUsers,
    selectedRole,
    setSelectedRole,
    fetchRoleUsers,
    fetchRoles
  } = useRoles();

  const {
    selectedRows,
    rowSelection,
    clearSelection
  } = useTableSelection<UserType>();

  const {
    isVisible: isModalOpen,
    loading: modalLoading,
    showModal: showUserModal,
    handleOk: handleModalOk,
    handleCancel: handleModalCancel,
  } = useModal({
    form: modalForm,
    onSubmit: async (values) => {
      await addUser(values);
      fetchUsers();
    },
    afterClose: () => {
      modalForm.resetFields();
    }
  });

  // 初始化加载
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // 处理字段变更
  const handleFieldChange = useCallback((id: string, field: string, value: any) => {
    if (field === 'role') {
      setSelectedRole(value);
      // 加载新角色的用户数据
      fetchRoleUsers(value);
    }
    
    setEditingRecord(prev => {
      if (prev && prev.id === id) {
        const newRecord = {
          ...prev,
          [field]: value
        };
        // 如果改变角色，清空用户选择
        if (field === 'role') {
          newRecord.roleUser = undefined;
        }
        return newRecord;
      }
      return prev;
    });
  }, [setSelectedRole, fetchRoleUsers]);

  // 处理编辑
  const handleEdit = useCallback((record: UserType) => {
    // 如果已经在编辑其他行，先取消编辑
    if (editingKey && editingKey !== record.id) {
      setEditingKey(null);
      setEditingRecord(null);
    }
    
    setEditingKey(record.id);
    setEditingRecord({ ...record });
    // 设置当前角色，加载用户数据
    setSelectedRole(record.role);
    fetchRoleUsers(record.role);
  }, [editingKey, setSelectedRole, fetchRoleUsers]);

  // 处理保存
  const handleSave = useCallback(async (id: string) => {
    try {
      if (editingRecord && id === editingRecord.id) {
        await updateUser(id, editingRecord);
        setEditingKey(null);
        setEditingRecord(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  }, [editingRecord, updateUser, fetchUsers]);

  // 处理取消编辑
  const handleCancelEdit = useCallback(() => {
    setEditingKey(null);
    setEditingRecord(null);
  }, []);

  // 处理新增
  const handleAdd = useCallback(() => {
    modalForm.resetFields();
    showUserModal();
  }, [modalForm, showUserModal]);

  // 处理批量删除
  const handleBatchDelete = async () => {
    if (selectedRows.length === 0) return;
    await batchDeleteUsers(selectedRows.map(row => row.id));
    clearSelection();
  };

  // 获取表格列配置
  const columns = useUserColumns({
    roles,
    roleUsers,
    editingKey,
    editingRecord,
    onFieldChange: handleFieldChange,
    onSave: handleSave,
    onEdit: handleEdit,
    onCancel: handleCancelEdit,
    onDelete: deleteUser
  });

  return (
    <div style={{ height: 'calc(100vh - 112px)', display: 'flex', flexDirection: 'column' }}>
      {/* 搜索区域 */}
      <Card style={{ marginBottom: 16, flex: 'none' }}>
        <AdvancedSearchForm 
          onSearch={searchUsers}
          onReset={fetchUsers}
          loading={loading}
        />
      </Card>

      {/* 操作按钮区域 */}
      <Card style={{ marginBottom: 16 }}>
        <ActionButtonGroup
          onAdd={handleAdd}
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
        onCancel={handleModalCancel}
        confirmLoading={modalLoading}
      >
        <UserForm form={modalForm} />
      </Modal>
    </div>
  );
};

export default Users;
