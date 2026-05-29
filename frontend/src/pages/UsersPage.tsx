import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, MenuItem, Card, CardContent, CardActions, Typography, IconButton, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  AppFormDialog,
  AppTextField,
  DataList,
  type DataListColumn,
} from '../components/common';
import { createUser, getUsers, updateUser } from '../services/userService';
import type { RoleOption, User } from '../types';
import { appColors } from '../theme/theme';

const roleOptions: RoleOption[] = [
  { roleId: 1, roleName: 'Admin' },
  { roleId: 2, roleName: 'Cashier' },
  { roleId: 3, roleName: 'Manager' },
];

const columns: DataListColumn<User>[] = [
  { key: 'userName', label: 'Username', isTitle: true },
  { key: 'roleName', label: 'Role', isSubtitle: true },
  { key: 'userId', label: 'User ID' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => {
      const isActive = row.status === 1;
      return (
        <span
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: isActive ? '#e8f5e9' : '#ffebee',
            color: isActive ? '#2e7d32' : '#c62828',
          }}
        >
          {isActive ? 'Active' : 'Deactive'}
        </span>
      );
    },
  },
  {
    key: 'createdAt',
    label: 'Created At',
    render: (row) =>
      row.createdAt ? new Date(row.createdAt).toLocaleString() : '-',
  },
];

const emptyForm = {
  userName: '',
  password: '',
  roleId: 1,
  status: 1,
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getUsers({
        page,
        pageSize,
        userName: searchTerm || undefined,
      });
      setUsers(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenDialog = () => {
    setSelectedUser(null);
    setForm(emptyForm);
    setShowPassword(false);
    setFormError('');
    setDialogOpen(true);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setForm({
      userName: user.userName,
      password: '••••••••', // Seed dummy disabled password representation
      roleId: user.roleId,
      status: user.status || 1,
    });
    setShowPassword(false);
    setFormError('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (!saving) {
      setDialogOpen(false);
      setFormError('');
    }
  };

  const handleSave = async () => {
    // Validations: Password is required only in Add Mode
    if (!selectedUser && (!form.userName.trim() || !form.password.trim())) {
      setFormError('Username and password are required');
      return;
    }
    if (selectedUser && !form.userName.trim()) {
      setFormError('Username is required');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      if (selectedUser) {
        // Edit Mode (password is disabled, omit from update)
        await updateUser(selectedUser.userId, {
          userName: form.userName.trim(),
          roleId: Number(form.roleId),
          status: Number(form.status),
        });
      } else {
        // Add Mode
        await createUser({
          userName: form.userName.trim(),
          password: form.password.trim(),
          roleId: Number(form.roleId),
          status: Number(form.status),
        });
      }
      setDialogOpen(false);
      setForm(emptyForm);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataList
        title="Manage Users"
        columns={columns}
        rows={users}
        total={total}
        page={page}
        pageSize={pageSize}
        loading={loading}
        searchValue={searchInput}
        searchPlaceholder="Filter by username"
        addButtonLabel="Add User"
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearchChange={setSearchInput}
        onSearchSubmit={() => {
          setPage(1);
          setSearchTerm(searchInput.trim());
        }}
        onAddClick={handleOpenDialog}
        renderCard={(user) => {
          const isActive = user.status === 1;
          return (
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 3,
                border: `1px solid ${appColors.border}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: 'text.secondary',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5, pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: appColors.primary, mb: 0.5 }}>
                  {user.userName}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    display: 'inline-block',
                    mb: 2,
                    px: 1.2,
                    py: 0.3,
                    borderRadius: 1,
                    bgcolor: appColors.secondaryLight,
                    color: appColors.secondary,
                    fontWeight: 600,
                  }}
                >
                  {user.roleName || '-'}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      User ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {user.userId}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: isActive ? '#e8f5e9' : '#ffebee',
                          color: isActive ? '#2e7d32' : '#c62828',
                        }}
                      >
                        {isActive ? 'Active' : 'Deactive'}
                      </span>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Created At
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-end', px: 2.5, pb: 2.5, pt: 0 }}>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(user)}
                  sx={{ color: appColors.primary }}
                  title="Edit User"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          );
        }}
      />

      <AppFormDialog
        open={dialogOpen}
        title={selectedUser ? 'Edit User' : 'Add User'}
        onClose={handleCloseDialog}
        onSave={handleSave}
        saveLabel="Save"
        closeLabel="Close"
        loading={saving}
      >
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        <AppTextField
          label="Username"
          value={form.userName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setForm((prev) => ({ ...prev, userName: event.target.value }))
          }
          required
        />
        <AppTextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setForm((prev) => ({ ...prev, password: event.target.value }))
          }
          required={!selectedUser}
          disabled={!!selectedUser}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          }}
        />
        <AppTextField
          select
          label="Role"
          value={form.roleId}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setForm((prev) => ({
              ...prev,
              roleId: Number(event.target.value),
            }))
          }
        >
          {roleOptions.map((role) => (
            <MenuItem key={role.roleId} value={role.roleId}>
              {role.roleName}
            </MenuItem>
          ))}
        </AppTextField>
        <AppTextField
          select
          label="Status"
          value={form.status}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setForm((prev) => ({
              ...prev,
              status: Number(event.target.value),
            }))
          }
        >
          <MenuItem value={1}>Active</MenuItem>
          <MenuItem value={2}>Deactive</MenuItem>
        </AppTextField>
      </AppFormDialog>
    </Box>
  );
}
