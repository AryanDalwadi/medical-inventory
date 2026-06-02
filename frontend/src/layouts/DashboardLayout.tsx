import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Material Icons list for resolution
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BarChartIcon from '@mui/icons-material/BarChart';
import BusinessIcon from '@mui/icons-material/Business';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarningIcon from '@mui/icons-material/Warning';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

import { useAuth } from '../context/AuthContext';
import { appColors } from '../theme/theme';
import { drawerWidth } from './navConfig';
import { getMenuHierarchy } from '../services/menuService';
import type { MainMenu } from '../types/menu';

const iconMap: Record<string, React.ElementType> = {
  dashboard: DashboardIcon,
  inventory: InventoryIcon,
  people: PeopleIcon,
  person: PersonIcon,
  group: GroupIcon,
  billing: PointOfSaleIcon,
  shopping_cart: ShoppingCartIcon,
  receipt: ReceiptLongIcon,
  receipt_short: ReceiptIcon,
  reports: BarChartIcon,
  business: BusinessIcon,
  shipping: LocalShippingIcon,
  warning: WarningIcon,
  settings: SettingsIcon,
  folder: FolderOpenIcon,
};

function DualIcon({ name }: { name: string }) {
  if (!name) {
    return <FolderOpenIcon fontSize="small" />;
  }

  const lowercaseName = name.toLowerCase().trim();
  const isBuiltIn = lowercaseName in iconMap;

  if (!isBuiltIn) {
    // If not a built-in vector icon, assume it's a custom asset file inside /icons/
    const hasExtension = lowercaseName.includes('.');
    const filename = hasExtension ? name : `${name}.svg`;
    return (
      <Box
        component="img"
        src={`/icons/${filename}`}
        alt={name}
        sx={{
          width: 20,
          height: 20,
          objectFit: 'contain',
        }}
      />
    );
  }

  const IconComponent = iconMap[lowercaseName];
  return <IconComponent fontSize="small" />;
}

function SidebarContent({
  onNavigate,
  dynamicMenus,
  openMenus,
  onToggleExpand,
}: {
  onNavigate?: () => void;
  dynamicMenus: MainMenu[];
  openMenus: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          background: `linear-gradient(135deg, ${appColors.secondaryLight} 0%, ${appColors.primaryLight} 100%)`,
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="Logo"
          sx={{ width: 44, height: 44, objectFit: 'contain' }}
        />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: appColors.primary }}>
            Medical Inventory
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Pharmacy System
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ px: 1.5, py: 2, flex: 1, overflowY: 'auto' }}>
        {dynamicMenus.map((item) => {
          const selected =
            location.pathname === item.url ||
            (item.url !== '/' && location.pathname.startsWith(item.url));

          const hasSubMenus = item.expandable && item.subMenus && item.subMenus.length > 0;
          const isOpen = !!openMenus[item.id];

          return (
            <Box key={item.id} sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={selected && !hasSubMenus}
                onClick={() => {
                  if (hasSubMenus) {
                    onToggleExpand(item.id);
                  } else {
                    handleNav(item.url);
                  }
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: appColors.primaryLight,
                    color: appColors.primary,
                    '& .MuiListItemIcon-root': { color: appColors.primary },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DualIcon name={item.icon} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: { sx: { fontWeight: selected ? 700 : 500 } },
                  }}
                />
                {hasSubMenus && (
                  isOpen ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />
                )}
              </ListItemButton>

              {hasSubMenus && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 2 }}>
                    {item.subMenus.map((sub) => {
                      const subSelected = location.pathname === sub.url;
                      return (
                        <ListItemButton
                          key={sub.id}
                          selected={subSelected}
                          onClick={() => handleNav(sub.url)}
                          sx={{
                            borderRadius: 1.5,
                            mb: 0.5,
                            py: 0.75,
                            pl: 3,
                            '&.Mui-selected': {
                              bgcolor: appColors.primaryLight,
                              color: appColors.primary,
                              '& .MuiListItemIcon-root': { color: appColors.primary },
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <DualIcon name={sub.icon} />
                          </ListItemIcon>
                          <ListItemText
                            primary={sub.label}
                            slotProps={{
                              primary: {
                                sx: {
                                  fontWeight: subSelected ? 700 : 500,
                                  fontSize: '0.875rem',
                                },
                              },
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>
    </Box>
  );
}

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dynamicMenus, setDynamicMenus] = useState<MainMenu[]>([]);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    async function loadMenus() {
      try {
        const menus = await getMenuHierarchy();
        if (active) {
          setDynamicMenus(menus);
        }
      } catch (error) {
        console.error('Failed to load navigation drawer menus:', error);
      }
    }
    loadMenus();
    return () => {
      active = false;
    };
  }, [location.pathname]); // Refresh on navigation/page load changes to stay aligned

  useEffect(() => {
    const path = location.pathname;
    const newOpenMenus = { ...openMenus };
    let changed = false;

    for (const m of dynamicMenus) {
      if (m.expandable) {
        const hasActiveChild = m.subMenus?.some(
          (s) => s.url === path || (s.url !== '/' && path.startsWith(s.url))
        );
        if (hasActiveChild && !openMenus[m.id]) {
          newOpenMenus[m.id] = true;
          changed = true;
        }
      }
    }

    if (changed) {
      setOpenMenus(newOpenMenus);
    }
  }, [location.pathname, dynamicMenus]);

  const handleToggleExpand = (menuId: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // Find page title from current route path
  let pageTitle = 'Dashboard';
  for (const m of dynamicMenus) {
    if (m.url === location.pathname) {
      pageTitle = m.label;
      break;
    }
    if (m.subMenus) {
      const activeSub = m.subMenus.find((s) => s.url === location.pathname);
      if (activeSub) {
        pageTitle = activeSub.label;
        break;
      }
    }
  }

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1, color: appColors.primary, fontWeight: 700 }}>
            {pageTitle}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              {user?.userName}
            </Typography>
            <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: appColors.primary,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {user?.userName?.charAt(0).toUpperCase() ?? 'U'}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  borderRadius: 2,
                  border: `1px solid ${appColors.border}`,
                },
              },
            }}
          >
            <MenuItem onClick={() => setAnchorEl(null)} sx={{ py: 1 }}>
              <AccountCircleIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings/menus'); }} sx={{ py: 1 }}>
              <SettingsIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
              Settings
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout} sx={{ py: 1 }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: 'error.main' }} />
              <Typography sx={{ color: 'error.main', fontWeight: 600, fontSize: '0.9rem' }}>
                Logout
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <SidebarContent
            onNavigate={() => setMobileOpen(false)}
            dynamicMenus={dynamicMenus}
            openMenus={openMenus}
            onToggleExpand={handleToggleExpand}
          />
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <SidebarContent
            dynamicMenus={dynamicMenus}
            openMenus={openMenus}
            onToggleExpand={handleToggleExpand}
          />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          p: { xs: 2, sm: 3 },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
