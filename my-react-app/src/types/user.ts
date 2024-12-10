export interface UserType {
  id: string;
  name: string;
  age: number | string;
  email: string;
  role: string;
  status: string;
}

export interface UserFormData {
  name: string;
  age: number;
  email: string;
  role: string;
  status: string;
}
