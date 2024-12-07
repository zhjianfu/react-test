import { UserType, UserFormData } from '../types/user';

// 模拟API调用延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class UserService {
  private static generateMockData(length: number): UserType[] {
    return Array.from({ length }, (_, i) => ({
      key: i.toString(),
      name: `用户${i + 1}`,
      age: 20 + Math.floor(Math.random() * 40),
      email: `user${i + 1}@example.com`,
      role: ['管理员', '编辑', '普通用户'][Math.floor(Math.random() * 3)],
      status: ['活跃', '禁用', '待验证'][Math.floor(Math.random() * 3)],
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

  static async addUser(userData: UserFormData): Promise<UserType> {
    await delay(500);
    return {
      key: Date.now().toString(),
      ...userData,
    };
  }

  static async updateUser(key: string, userData: UserFormData): Promise<UserType> {
    await delay(500);
    return {
      key,
      ...userData,
    };
  }

  static async deleteUser(key: string): Promise<void> {
    await delay(500);
  }
}
