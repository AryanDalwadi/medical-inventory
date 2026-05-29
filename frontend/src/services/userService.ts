import api from '../api';
import type {
  ApiResponse,
  CreateUserPayload,
  PaginatedResult,
  User,
  UserListFilters,
} from '../types';

export async function getUsers(filters: UserListFilters = {}) {
  const { data } = await api.get<ApiResponse<PaginatedResult<User>>>('/users', {
    params: {
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 10,
      userName: filters.userName || undefined,
    },
  });

  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to fetch users');
  }

  return data.data;
}

export async function createUser(payload: CreateUserPayload) {
  const { data } = await api.post<ApiResponse<User>>('/users', payload);

  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to create user');
  }

  return data.data;
}
