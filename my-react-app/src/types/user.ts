export type RoleType = 'admin' | 'editor' | 'user';
export type StatusType = 'active' | 'inactive';

export interface UserType {
  id: string;
  name: string;
  age: number;
  email: string;
  role: RoleType;
  roleUser?: string;
  status: StatusType;
}

export type UserFormData = Omit<UserType, 'id' | 'roleUser'>;
