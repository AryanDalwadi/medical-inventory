import api from '../api';
import type { ApiResponse, LoginResponse } from '../types';

export interface LoginPayload {
  userName: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<ApiResponse<LoginResponse>>(
    '/auth/login',
    payload
  );
  return data;
}
