export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface User {
  userId: number;
  userName: string;
  roleId: number;
  roleName?: string;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserListFilters {
  userName?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateUserPayload {
  userName: string;
  password: string;
  roleId: number;
}

export interface RoleOption {
  roleId: number;
  roleName: string;
}
