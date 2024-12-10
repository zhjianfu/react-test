import { UserType, UserFormData } from '../types/user';

// 模拟API调用延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 角色和状态的映射
const ROLES = ['admin', 'editor', 'user'] as const;
const STATUS = ['active', 'inactive'] as const;

export class UserService {
  private static generateMockData(length: number): UserType[] {
    return Array.from({ length }, (_, i) => ({
      id: i.toString(),
      name: `用户${i + 1}`,
      age: 20 + Math.floor(Math.random() * 40),
      email: `user${i + 1}@example.com`,
      role: ROLES[Math.floor(Math.random() * ROLES.length)],
      roleUser: `user_${Math.floor(Math.random() * 5)}`,
      status: STATUS[Math.floor(Math.random() * STATUS.length)],
    }));
  }

  static async getUsers(): Promise<UserType[]> {
    await delay(500);
    return this.generateMockData(100);
  }

  static async searchUsers(params: Partial<UserType>): Promise<UserType[]> {
    await delay(500);
    const allUsers = this.generateMockData(100);
    return allUsers.filter(user => {
      return Object.entries(params).every(([key, value]) => {
        if (!value) return true;
        if (key === 'name') return user.name.includes(value);
        if (key === 'email') return user.email.includes(value);
        return user[key as keyof UserType] === value;
      });
    });
  }

  static async addUser(userData: Partial<UserType>): Promise<UserType> {
    await delay(500);
    return {
      id: Date.now().toString(),
      name: '',
      age: 0,
      email: '',
      role: 'user',
      status: 'active',
      ...userData,
    };
  }

  static async updateUser(id: string, userData: Partial<UserType>): Promise<UserType> {
    await delay(500);
    return {
      id,
      name: '',
      age: 0,
      email: '',
      role: 'user',
      status: 'active',
      ...userData,
    };
  }

  static async deleteUser(id: string): Promise<void> {
    await delay(500);
  }
}
