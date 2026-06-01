export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface User {
  userId: string;
  userName: string;
  fullName?: string;
  roleId: string;
  roleName?: string;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
  createdByName?: string;
  updatedByName?: string;
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
  fullName?: string;
  password: string;
  roleId: string;
  status?: number;
}

export interface UpdateUserPayload {
  userName?: string;
  fullName?: string;
  password?: string;
  roleId?: string;
  status?: number;
}

export interface RoleOption {
  roleId: string;
  roleName: string;
}
