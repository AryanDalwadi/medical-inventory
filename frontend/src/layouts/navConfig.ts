import type { ElementType } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export interface NavItem {
  label: string;
  path: string;
  icon: ElementType;
  enabled?: boolean;
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: DashboardIcon, enabled: true },
  { label: 'Users', path: '/users', icon: PeopleIcon, enabled: true },
  { label: 'Products', path: '/products', icon: InventoryIcon, enabled: false },
  { label: 'Billing', path: '/billing', icon: PointOfSaleIcon, enabled: false },
  { label: 'Purchase', path: '/purchase', icon: ShoppingCartIcon, enabled: false },
  { label: 'Reports', path: '/reports', icon: ReceiptLongIcon, enabled: false },
];

export const drawerWidth = 260;
