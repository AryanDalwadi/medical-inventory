import api from '../api';
import type { ApiResponse } from '../types';
import type {
  MainMenu,
  SubMenu,
  CreateMainMenuPayload,
  UpdateMainMenuPayload,
  CreateSubMenuPayload,
  UpdateSubMenuPayload,
} from '../types/menu';

export async function getMenuHierarchy() {
  const { data } = await api.get<ApiResponse<MainMenu[]>>('/menus');
  return data.data || [];
}

export async function getAllMainMenus() {
  const { data } = await api.get<ApiResponse<MainMenu[]>>('/menus/main');
  return data.data || [];
}

export async function getAllSubMenus() {
  const { data } = await api.get<ApiResponse<SubMenu[]>>('/menus/sub');
  return data.data || [];
}

export async function createMainMenu(payload: CreateMainMenuPayload) {
  const { data } = await api.post<ApiResponse<MainMenu>>('/menus/main', payload);
  return data;
}

export async function updateMainMenu(id: string, payload: UpdateMainMenuPayload) {
  const { data } = await api.put<ApiResponse<MainMenu>>(`/menus/main/${id}`, payload);
  return data;
}

export async function createSubMenu(payload: CreateSubMenuPayload) {
  const { data } = await api.post<ApiResponse<SubMenu>>('/menus/sub', payload);
  return data;
}

export async function updateSubMenu(id: string, payload: UpdateSubMenuPayload) {
  const { data } = await api.put<ApiResponse<SubMenu>>(`/menus/sub/${id}`, payload);
  return data;
}
