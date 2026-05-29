import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, MenuItem } from '@mui/material';
import {
  AppFormDialog,
  AppTextField,
  DataList,
  type DataListColumn,
} from '../components/common';
import { createUser, getUsers } from '../services/userService';
import type { RoleOption, User } from '../types';

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
    setForm(emptyForm);
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
    if (!form.userName.trim() || !form.password.trim()) {
      setFormError('Username and password are required');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      await createUser({
        userName: form.userName.trim(),
        password: form.password,
        roleId: Number(form.roleId),
      });
      setDialogOpen(false);
      setForm(emptyForm);
      await fetchUsers();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataList
        title="Users"
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
      />

      <AppFormDialog
        open={dialogOpen}
        title="Add User"
        onClose={handleCloseDialog}
        onSave={handleSave}
        saveLabel="Save"
        closeLabel="Close"
        loading={saving}
      >
        {formError && <Alert severity="error">{formError}</Alert>}
        <AppTextField
          label="Username"
          value={form.userName}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, userName: event.target.value }))
          }
          required
        />
        <AppTextField
          label="Password"
          type="password"
          value={form.password}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, password: event.target.value }))
          }
          required
        />
        <AppTextField
          select
          label="Role"
          value={form.roleId}
          onChange={(event) =>
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
      </AppFormDialog>
    </Box>
  );
}
