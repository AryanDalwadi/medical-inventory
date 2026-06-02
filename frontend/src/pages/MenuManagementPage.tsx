import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
import SettingsIcon from '@mui/icons-material/Settings';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

import { appColors } from '../theme/theme';
import AppTextField from '../components/common/AppTextField';
import {
  getAllMainMenus,
  getAllSubMenus,
  createMainMenu,
  updateMainMenu,
  createSubMenu,
  updateSubMenu,
} from '../services/menuService';
import type { MainMenu, SubMenu } from '../types/menu';

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
          verticalAlign: 'middle',
        }}
      />
    );
  }

  const IconComponent = iconMap[lowercaseName];
  return <IconComponent fontSize="small" style={{ verticalAlign: 'middle' }} />;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`menu-tabpanel-${index}`}
      aria-labelledby={`menu-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MenuManagementPage() {
  const [tabValue, setTabValue] = useState(0);
  const [mainMenus, setMainMenus] = useState<MainMenu[]>([]);
  const [subMenus, setSubMenus] = useState<SubMenu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Main Menu Dialog State
  const [mainDialogOpen, setMainDialogOpen] = useState(false);
  const [mainEditMode, setMainEditMode] = useState(false);
  const [selectedMainMenu, setSelectedMainMenu] = useState<MainMenu | null>(null);
  const [mainForm, setMainForm] = useState({
    label: '',
    icon: '',
    url: '',
    priority_id: 0,
    status: 1,
    expandable: false,
    sys_admin: false,
  });
  const [mainFormError, setMainFormError] = useState('');

  // Sub Menu Dialog State
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [subEditMode, setSubEditMode] = useState(false);
  const [selectedSubMenu, setSelectedSubMenu] = useState<SubMenu | null>(null);
  const [subForm, setSubForm] = useState({
    main_menu_id: '',
    sub_menu_label: '',
    secondary_label: '', // right column "Sub Menu Label" dropdown/optional choice
    icon: '',
    url: '',
    sp1_details: '',
    sp2_details: '',
    priority_id: 0,
    status: 1,
    sys_admin: false,
  });
  const [subFormError, setSubFormError] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [mList, sList] = await Promise.all([getAllMainMenus(), getAllSubMenus()]);
      setMainMenus(mList);
      setSubMenus(sList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menus from database');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // MAIN MENU ACTIONS
  const handleOpenMainAdd = () => {
    setMainEditMode(false);
    setSelectedMainMenu(null);
    setMainForm({
      label: '',
      icon: '',
      url: '',
      priority_id: mainMenus.length + 1,
      status: 1,
      expandable: false,
      sys_admin: false,
    });
    setMainFormError('');
    setMainDialogOpen(true);
  };

  const handleOpenMainEdit = (menu: MainMenu) => {
    setMainEditMode(true);
    setSelectedMainMenu(menu);
    setMainForm({
      label: menu.label,
      icon: menu.icon,
      url: menu.url,
      priority_id: menu.priorityId,
      status: menu.status,
      expandable: menu.expandable,
      sys_admin: menu.sysAdmin,
    });
    setMainFormError('');
    setMainDialogOpen(true);
  };

  const handleSaveMainMenu = async () => {
    if (!mainForm.label.trim()) {
      setMainFormError('Label is required');
      return;
    }
    if (!mainForm.icon.trim()) {
      setMainFormError('Icon identifier is required');
      return;
    }
    if (!mainForm.url.trim()) {
      setMainFormError('Url path is required');
      return;
    }

    setSubmitting(true);
    setMainFormError('');
    try {
      if (mainEditMode && selectedMainMenu) {
        await updateMainMenu(selectedMainMenu.id, {
          label: mainForm.label.trim(),
          icon: mainForm.icon.trim(),
          url: mainForm.url.trim(),
          priority_id: Number(mainForm.priority_id),
          status: Number(mainForm.status),
          expandable: mainForm.expandable,
          sys_admin: mainForm.sys_admin,
        });
      } else {
        await createMainMenu({
          label: mainForm.label.trim(),
          icon: mainForm.icon.trim(),
          url: mainForm.url.trim(),
          priority_id: Number(mainForm.priority_id),
          status: Number(mainForm.status),
          expandable: mainForm.expandable,
          sys_admin: mainForm.sys_admin,
        });
      }
      setMainDialogOpen(false);
      await loadData();
    } catch (err) {
      setMainFormError(err instanceof Error ? err.message : 'Error saving main menu');
    } finally {
      setSubmitting(false);
    }
  };

  // SUB MENU ACTIONS
  const handleOpenSubAdd = () => {
    setSubEditMode(false);
    setSelectedSubMenu(null);
    setSubForm({
      main_menu_id: mainMenus.length > 0 ? mainMenus[0].id : '',
      sub_menu_label: '',
      secondary_label: '',
      icon: '',
      url: '',
      sp1_details: '',
      sp2_details: '',
      priority_id: subMenus.length + 1,
      status: 1,
      sys_admin: false,
    });
    setSubFormError('');
    setSubDialogOpen(true);
  };

  const handleOpenSubEdit = (sub: SubMenu) => {
    setSubEditMode(true);
    setSelectedSubMenu(sub);
    setSubForm({
      main_menu_id: sub.mainMenuId,
      sub_menu_label: sub.label,
      secondary_label: '',
      icon: sub.icon || '',
      url: sub.url,
      sp1_details: sub.sp1Details || '',
      sp2_details: sub.sp2Details || '',
      priority_id: sub.priorityId,
      status: sub.status,
      sys_admin: sub.sysAdmin,
    });
    setSubFormError('');
    setSubDialogOpen(true);
  };

  const handleSaveSubMenu = async () => {
    if (!subForm.main_menu_id) {
      setSubFormError('Parent Main Menu is required');
      return;
    }
    if (!subForm.sub_menu_label.trim()) {
      setSubFormError('Sub Menu Label is required');
      return;
    }
    if (!subForm.icon.trim()) {
      setSubFormError('Icon is required');
      return;
    }
    if (!subForm.url.trim()) {
      setSubFormError('Url is required');
      return;
    }

    setSubmitting(true);
    setSubFormError('');
    try {
      if (subEditMode && selectedSubMenu) {
        await updateSubMenu(selectedSubMenu.id, {
          main_menu_id: subForm.main_menu_id,
          sub_menu_label: subForm.sub_menu_label.trim(),
          icon: subForm.icon.trim(),
          url: subForm.url.trim(),
          sp1_details: subForm.sp1_details.trim() || undefined,
          sp2_details: subForm.sp2_details.trim() || undefined,
          priority_id: Number(subForm.priority_id),
          status: Number(subForm.status),
          sys_admin: subForm.sys_admin,
        });
      } else {
        await createSubMenu({
          main_menu_id: subForm.main_menu_id,
          sub_menu_label: subForm.sub_menu_label.trim(),
          icon: subForm.icon.trim(),
          url: subForm.url.trim(),
          sp1_details: subForm.sp1_details.trim() || undefined,
          sp2_details: subForm.sp2_details.trim() || undefined,
          priority_id: Number(subForm.priority_id),
          status: Number(subForm.status),
          sys_admin: subForm.sys_admin,
        });
      }
      setSubDialogOpen(false);
      await loadData();
    } catch (err) {
      setSubFormError(err instanceof Error ? err.message : 'Error saving sub menu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 1 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: appColors.primary }}>
            Navigation Setup
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure dynamic, nested application main menus and submenus.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={tabValue === 0 ? handleOpenMainAdd : handleOpenSubAdd}
          sx={{
            bgcolor: 'text.primary',
            borderRadius: 2,
            px: 3,
            '&:hover': { bgcolor: 'text.secondary' },
          }}
        >
          {tabValue === 0 ? 'Add Main Menu' : 'Add Sub Menu'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="primary"
            sx={{
              '& .MuiTabs-indicator': { bgcolor: 'text.primary' },
              '& .MuiTab-root': { fontWeight: 600, fontSize: '0.95rem' },
            }}
          >
            <Tab label="Main Menus" />
            <Tab label="Sub Menus" />
          </Tabs>

          <CustomTabPanel value={tabValue} index={0}>
            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${appColors.border}`, borderRadius: 3 }}>
              <Table size="medium">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 650 }}>Label</TableCell>
                    <TableCell sx={{ fontWeight: 650 }}>Icon ID</TableCell>
                    <TableCell sx={{ fontWeight: 650 }}>Resolved Icon</TableCell>
                    <TableCell sx={{ fontWeight: 650 }}>URL Path</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 650 }}>Priority</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 650 }}>Expandable</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 650 }}>Sys Admin</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 650 }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 650 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mainMenus.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{row.label}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{row.icon}</TableCell>
                      <TableCell align="center"><DualIcon name={row.icon} /></TableCell>
                      <TableCell>{row.url}</TableCell>
                      <TableCell align="center">{row.priorityId}</TableCell>
                      <TableCell align="center">
                        <span style={{ color: row.expandable ? '#2e7d32' : 'inherit', fontWeight: row.expandable ? 600 : 'normal' }}>
                          {row.expandable ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <span style={{ color: row.sysAdmin ? '#c62828' : 'inherit', fontWeight: row.sysAdmin ? 600 : 'normal' }}>
                          {row.sysAdmin ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: row.status === 1 ? '#e8f5e9' : '#ffebee',
                            color: row.status === 1 ? '#2e7d32' : '#c62828',
                          }}
                        >
                          {row.status === 1 ? 'Active' : 'In-Active'}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleOpenMainEdit(row)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {mainMenus.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                        No main menus found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomTabPanel>

          <CustomTabPanel value={tabValue} index={1}>
            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${appColors.border}`, borderRadius: 3 }}>
              <Table size="medium">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 650 }}>Parent Main Menu</TableCell>
                    <TableCell sx={{ fontWeight: 650 }}>Sub Menu Label</TableCell>
                    <TableCell sx={{ fontWeight: 650 }}>Icon ID</TableCell>
                    <TableCell sx={{ fontWeight: 650 }}>Resolved Icon</TableCell>
                    <TableCell sx={{ fontWeight: 650 }}>URL Path</TableCell>
                    <TableCell sx={{ fontWeight: 650 }}>SP 1 Details</TableCell>
                    <TableCell sx={{ fontWeight: 650 }}>SP 2 Details</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 650 }}>Priority</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 650 }}>Sys Admin</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 650 }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 650 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subMenus.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{row.mainMenuLabel || 'N/A'}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{row.label}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{row.icon || '-'}</TableCell>
                      <TableCell align="center">{row.icon ? <DualIcon name={row.icon} /> : '-'}</TableCell>
                      <TableCell>{row.url}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{row.sp1Details || '-'}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{row.sp2Details || '-'}</TableCell>
                      <TableCell align="center">{row.priorityId}</TableCell>
                      <TableCell align="center">
                        <span style={{ color: row.sysAdmin ? '#c62828' : 'inherit', fontWeight: row.sysAdmin ? 600 : 'normal' }}>
                          {row.sysAdmin ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: row.status === 1 ? '#e8f5e9' : '#ffebee',
                            color: row.status === 1 ? '#2e7d32' : '#c62828',
                          }}
                        >
                          {row.status === 1 ? 'Active' : 'In-Active'}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleOpenSubEdit(row)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {subMenus.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                        No sub menus found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomTabPanel>
        </Box>
      )}

      {/* Main Menu Add/Edit Modal Dialog */}
      <Dialog
        open={mainDialogOpen}
        onClose={() => !submitting && setMainDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              p: 1.5,
              border: `1px solid ${appColors.border}`,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {mainEditMode ? 'Edit Main Menu' : 'Add Main Menu'}
        </DialogTitle>
        <DialogContent sx={{ pt: '8px !important' }}>
          {mainFormError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {mainFormError}
            </Alert>
          )}
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <AppTextField
              label="Label *"
              placeholder="e.g. Products"
              value={mainForm.label}
              onChange={(e: any) => setMainForm({ ...mainForm, label: e.target.value })}
            />

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Icon *
                </Typography>
                <Tooltip title="Enter a standard icon name (e.g. people, settings, inventory, dashboard, shopping_cart) or a custom filename inside frontend/public/icons/ (e.g., custom_logo.svg)">
                  <IconButton size="small" sx={{ p: 0.2 }}>
                    <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <AppTextField
                placeholder="e.g. settings or custom_icon.svg"
                value={mainForm.icon}
                onChange={(e: any) => setMainForm({ ...mainForm, icon: e.target.value })}
              />
            </Box>

            <AppTextField
              label="Url *"
              placeholder="e.g. /products"
              value={mainForm.url}
              onChange={(e: any) => setMainForm({ ...mainForm, url: e.target.value })}
            />

            <AppTextField
              label="Priority Id *"
              type="number"
              placeholder="e.g. 1"
              value={mainForm.priority_id}
              onChange={(e: any) => setMainForm({ ...mainForm, priority_id: Number(e.target.value) })}
            />

            <FormControl fullWidth size="small">
              <InputLabel id="main-status-label">Status Type</InputLabel>
              <Select
                labelId="main-status-label"
                label="Status Type"
                value={mainForm.status}
                onChange={(e) => setMainForm({ ...mainForm, status: Number(e.target.value) })}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={2}>In-Active</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mainForm.expandable}
                    onChange={(e) => setMainForm({ ...mainForm, expandable: e.target.checked })}
                    sx={{ color: 'text.secondary', '&.Mui-checked': { color: 'text.primary' } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Expandable
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mainForm.sys_admin}
                    onChange={(e) => setMainForm({ ...mainForm, sys_admin: e.target.checked })}
                    sx={{ color: 'text.secondary', '&.Mui-checked': { color: 'text.primary' } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Sys Admin
                  </Typography>
                }
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setMainDialogOpen(false)}
            disabled={submitting}
            sx={{ borderRadius: 2, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveMainMenu}
            variant="contained"
            disabled={submitting}
            sx={{
              bgcolor: 'text.primary',
              borderRadius: 2,
              px: 3,
              '&:hover': { bgcolor: 'text.secondary' },
            }}
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sub Menu Add/Edit Modal Dialog */}
      <Dialog
        open={subDialogOpen}
        onClose={() => !submitting && setSubDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              p: 1.5,
              border: `1px solid ${appColors.border}`,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {subEditMode ? 'Edit Sub Menu' : 'Add Sub Menu'}
        </DialogTitle>
        <DialogContent sx={{ pt: '8px !important' }}>
          {subFormError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {subFormError}
            </Alert>
          )}
          <Box component="form" sx={{ pt: 1 }}>
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
              {/* Left Column */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="sub-main-label">Main Menu Label *</InputLabel>
                  <Select
                    labelId="sub-main-label"
                    label="Main Menu Label *"
                    value={subForm.main_menu_id}
                    onChange={(e) => setSubForm({ ...subForm, main_menu_id: e.target.value })}
                    sx={{ borderRadius: 2 }}
                  >
                    {mainMenus.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.label}
                      </MenuItem>
                    ))}
                    {mainMenus.length === 0 && (
                      <MenuItem disabled value="">
                        No main menus created yet
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>

                <AppTextField
                  label="Sub Menu Label *"
                  placeholder="e.g. Add User"
                  value={subForm.sub_menu_label}
                  onChange={(e: any) => setSubForm({ ...subForm, sub_menu_label: e.target.value })}
                />

                <AppTextField
                  label="Url *"
                  placeholder="e.g. /users/add"
                  value={subForm.url}
                  onChange={(e: any) => setSubForm({ ...subForm, url: e.target.value })}
                />

                <AppTextField
                  label="SP 2 Details *"
                  placeholder="e.g. sp_InsertUser"
                  value={subForm.sp2_details}
                  onChange={(e: any) => setSubForm({ ...subForm, sp2_details: e.target.value })}
                />

                <FormControl fullWidth size="small">
                  <InputLabel id="sub-status-label">Status Type</InputLabel>
                  <Select
                    labelId="sub-status-label"
                    label="Status Type"
                    value={subForm.status}
                    onChange={(e) => setSubForm({ ...subForm, status: Number(e.target.value) })}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value={1}>Active</MenuItem>
                    <MenuItem value={2}>In-Active</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={subForm.sys_admin}
                      onChange={(e) => setSubForm({ ...subForm, sys_admin: e.target.checked })}
                      sx={{ color: 'text.secondary', '&.Mui-checked': { color: 'text.primary' } }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Sys Admin
                    </Typography>
                  }
                />
              </Box>

              {/* Right Column */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <AppTextField
                  label="Sub Menu Label (Optional Secondary)"
                  placeholder="e.g. Alternative Description"
                  value={subForm.secondary_label}
                  onChange={(e: any) => setSubForm({ ...subForm, secondary_label: e.target.value })}
                />

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      Icon *
                    </Typography>
                    <Tooltip title="Enter a standard icon name (e.g. person, group, receipt_short) or a custom image inside public/icons/ (e.g., user_group.svg)">
                      <IconButton size="small" sx={{ p: 0.2 }}>
                        <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <AppTextField
                    placeholder="e.g. person or user_logo.png"
                    value={subForm.icon}
                    onChange={(e: any) => setSubForm({ ...subForm, icon: e.target.value })}
                  />
                </Box>

                <AppTextField
                  label="SP 1 Details *"
                  placeholder="e.g. sp_GetUserList"
                  value={subForm.sp1_details}
                  onChange={(e: any) => setSubForm({ ...subForm, sp1_details: e.target.value })}
                />

                <AppTextField
                  label="Priority Id *"
                  type="number"
                  placeholder="e.g. 1"
                  value={subForm.priority_id}
                  onChange={(e: any) => setSubForm({ ...subForm, priority_id: Number(e.target.value) })}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setSubDialogOpen(false)}
            disabled={submitting}
            sx={{ borderRadius: 2, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveSubMenu}
            variant="contained"
            disabled={submitting}
            sx={{
              bgcolor: 'text.primary',
              borderRadius: 2,
              px: 3,
              '&:hover': { bgcolor: 'text.secondary' },
            }}
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
