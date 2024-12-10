import { RoleType, RoleUserType } from '../types/role';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟角色数据
const mockRoles: RoleType[] = [
  { id: '1', name: '管理员', code: 'admin' },
  { id: '2', name: '编辑', code: 'editor' },
  { id: '3', name: '普通用户', code: 'user' }
];

// 模拟角色用户数据
const generateMockUsers = (prefix: string, count: number): RoleUserType[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}_${i + 1}`,
    name: `${prefix}用户${i + 1}`
  }));
};

const mockRoleUsers: Record<string, RoleUserType[]> = {
  'admin': generateMockUsers('admin', 5),
  'editor': generateMockUsers('editor', 5),
  'user': generateMockUsers('user', 5)
};

export class RoleService {
  // 获取所有角色
  static async getRoles(): Promise<RoleType[]> {
    await delay(500);
    return mockRoles;
  }

  // 获取角色下的用户
  static async getRoleUsers(roleCode: string): Promise<RoleUserType[]> {
    await delay(500);
    const users = mockRoleUsers[roleCode];
    if (users) {
      return users;
    }
    throw new Error('未找到该角色下的用户');
  }

  // 添加角色
  static async addRole(role: Omit<RoleType, 'id'>): Promise<RoleType> {
    await delay(500);
    const newRole = {
      ...role,
      id: `role-${Date.now()}`
    };
    mockRoles.push(newRole);
    return newRole;
  }

  // 更新角色
  static async updateRole(id: string, role: Partial<RoleType>): Promise<RoleType> {
    await delay(500);
    const index = mockRoles.findIndex(r => r.id === id);
    if (index > -1) {
      mockRoles[index] = { ...mockRoles[index], ...role };
      return mockRoles[index];
    }
    throw new Error('角色不存在');
  }

  // 删除角色
  static async deleteRole(id: string): Promise<void> {
    await delay(500);
    const index = mockRoles.findIndex(r => r.id === id);
    if (index > -1) {
      mockRoles.splice(index, 1);
      return;
    }
    throw new Error('角色不存在');
  }
}
