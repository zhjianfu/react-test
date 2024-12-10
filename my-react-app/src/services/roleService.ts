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
const mockRoleUsers: Record<string, RoleUserType[]> = {
  'admin': [
    { id: '1', name: '张三' },
    { id: '2', name: '李四' }
  ],
  'editor': [
    { id: '3', name: '王五' },
    { id: '4', name: '赵六' }
  ],
  'user': [
    { id: '5', name: '钱七' },
    { id: '6', name: '孙八' }
  ]
};

export class RoleService {
  // 获取所有角色
  static async getRoles(): Promise<RoleType[]> {
    // 模拟API调用延迟
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRoles);
      }, 500);
    });
  }

  // 获取角色下的用户
  static async getRoleUsers(roleCode: string): Promise<RoleUserType[]> {
    // 模拟API调用延迟
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = mockRoleUsers[roleCode];
        if (users) {
          resolve(users);
        } else {
          reject(new Error('未找到该角色下的用户'));
        }
      }, 500);
    });
  }

  // 添加角色
  static async addRole(role: Omit<RoleType, 'id'>): Promise<RoleType> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRole = {
          ...role,
          id: `role-${Date.now()}`
        };
        mockRoles.push(newRole);
        resolve(newRole);
      }, 500);
    });
  }

  // 更新角色
  static async updateRole(id: string, role: Partial<RoleType>): Promise<RoleType> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockRoles.findIndex(r => r.id === id);
        if (index > -1) {
          mockRoles[index] = { ...mockRoles[index], ...role };
          resolve(mockRoles[index]);
        } else {
          reject(new Error('角色不存在'));
        }
      }, 500);
    });
  }

  // 删除角色
  static async deleteRole(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockRoles.findIndex(r => r.id === id);
        if (index > -1) {
          mockRoles.splice(index, 1);
          resolve();
        } else {
          reject(new Error('角色不存在'));
        }
      }, 500);
    });
  }
}
