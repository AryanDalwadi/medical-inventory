import type { ElementType } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import GroupIcon from '@mui/icons-material/Group';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BusinessIcon from '@mui/icons-material/Business';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarningIcon from '@mui/icons-material/Warning';
import SettingsIcon from '@mui/icons-material/Settings';

export interface NavItem {
  label: string;
  path: string;
  icon: ElementType;
  enabled?: boolean;
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: DashboardIcon, enabled: true },
  { label: 'Users', path: '/users', icon: PeopleIcon, enabled: true },
  { label: 'User Groups', path: '/groups', icon: GroupIcon, enabled: true },
  { label: 'Products', path: '/products', icon: InventoryIcon, enabled: false },
  { label: 'Billing', path: '/billing', icon: PointOfSaleIcon, enabled: false },
  { label: 'Purchase', path: '/purchase', icon: ShoppingCartIcon, enabled: false },
  { label: 'Manufacturers', path: '/manufacturers', icon: BusinessIcon, enabled: false },
  { label: 'Suppliers', path: '/suppliers', icon: LocalShippingIcon, enabled: false },
  { label: 'Stock Alerts', path: '/alerts', icon: WarningIcon, enabled: false },
  { label: 'Reports', path: '/reports', icon: ReceiptLongIcon, enabled: false },
  { label: 'Settings', path: '/settings', icon: SettingsIcon, enabled: false },
];

export const drawerWidth = 260;
