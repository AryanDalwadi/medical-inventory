export interface SubMenu {
  id: string;
  mainMenuId: string;
  mainMenuLabel?: string;
  label: string;
  icon: string;
  url: string;
  sp1Details?: string;
  sp2Details?: string;
  priorityId: number;
  status: number;
  sysAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MainMenu {
  id: string;
  label: string;
  icon: string;
  url: string;
  priorityId: number;
  status: number;
  expandable: boolean;
  sysAdmin: boolean;
  subMenus: SubMenu[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMainMenuPayload {
  label: string;
  icon: string;
  url: string;
  priority_id: number;
  status: number;
  expandable: boolean;
  sys_admin: boolean;
}

export interface UpdateMainMenuPayload {
  label?: string;
  icon?: string;
  url?: string;
  priority_id?: number;
  status?: number;
  expandable?: boolean;
  sys_admin?: boolean;
}

export interface CreateSubMenuPayload {
  main_menu_id: string;
  sub_menu_label: string;
  icon: string;
  url: string;
  sp1_details?: string;
  sp2_details?: string;
  priority_id: number;
  status: number;
  sys_admin: boolean;
}

export interface UpdateSubMenuPayload {
  main_menu_id?: string;
  sub_menu_label?: string;
  icon?: string;
  url?: string;
  sp1_details?: string;
  sp2_details?: string;
  priority_id?: number;
  status?: number;
  sys_admin?: boolean;
}
