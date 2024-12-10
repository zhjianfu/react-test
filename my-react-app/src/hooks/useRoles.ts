import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { RoleService } from '../services/roleService';
import type { RoleType, RoleUserType } from '../types/role';

export function useRoles() {
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [roleUsers, setRoleUsers] = useState<Record<string, RoleUserType[]>>({});
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 获取角色列表
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await RoleService.getRoles();
      setRoles(data);
    } catch (error) {
      message.error('获取角色列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取角色用户
  const fetchRoleUsers = useCallback(async (roleCode: string) => {
    if (!roleCode || roleUsers[roleCode]) return;
    
    setLoading(true);
    try {
      const users = await RoleService.getRoleUsers(roleCode);
      setRoleUsers(prev => ({
        ...prev,
        [roleCode]: users
      }));
    } catch (error) {
      message.error('获取角色用户失败');
      setRoleUsers(prev => ({
        ...prev,
        [roleCode]: []
      }));
    } finally {
      setLoading(false);
    }
  }, [roleUsers]);

  // 监听角色变化，加载对应用户
  useEffect(() => {
    if (selectedRole) {
      fetchRoleUsers(selectedRole);
    }
  }, [selectedRole, fetchRoleUsers]);

  // 初始化加载角色数据
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    roleUsers,
    selectedRole,
    setSelectedRole,
    loading,
    fetchRoles,
    fetchRoleUsers,
  };
}
