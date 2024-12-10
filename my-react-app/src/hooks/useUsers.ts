import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { UserService } from '../services/userService';
import type { UserType } from '../types/user';

export function useUsers() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserType[]>([]);

  // 获取用户列表
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await UserService.getUsers();
      setUserData(data);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 搜索用户
  const searchUsers = useCallback(async (values: any) => {
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
  }, []);

  // 添加用户
  const addUser = useCallback(async (values: Partial<UserType>) => {
    try {
      const newUser = await UserService.addUser(values);
      setUserData(prev => [newUser, ...prev]);
      message.success('添加成功');
      return newUser;
    } catch (error) {
      message.error('添加失败');
      throw error;
    }
  }, []);

  // 更新用户
  const updateUser = useCallback(async (id: string, values: Partial<UserType>) => {
    try {
      const updatedUser = await UserService.updateUser(id, values);
      setUserData(prev => prev.map(item => 
        item.id === id ? updatedUser : item
      ));
      message.success('更新成功');
      return updatedUser;
    } catch (error) {
      message.error('更新失败');
      throw error;
    }
  }, []);

  // 删除用户
  const deleteUser = useCallback(async (id: string) => {
    try {
      await UserService.deleteUser(id);
      setUserData(prev => prev.filter(item => item.id !== id));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
      throw error;
    }
  }, []);

  // 批量删除用户
  const batchDeleteUsers = useCallback(async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => UserService.deleteUser(id)));
      setUserData(prev => prev.filter(item => !ids.includes(item.id)));
      message.success('批量删除成功');
    } catch (error) {
      message.error('批量删除失败');
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    loading,
    userData,
    setUserData,
    fetchUsers,
    searchUsers,
    addUser,
    updateUser,
    deleteUser,
    batchDeleteUsers,
  };
}
