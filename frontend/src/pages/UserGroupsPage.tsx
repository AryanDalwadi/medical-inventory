import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Card, CardContent, CardActions, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
  AppFormDialog,
  AppTextField,
  AppCheckbox,
  DataList,
  type DataListColumn,
} from '../components/common';
import { createUserGroup, getUserGroups, updateUserGroup } from '../services/userService';
import type { RoleOption } from '../types';
import { appColors } from '../theme/theme';

interface UserGroupRow extends RoleOption {
  status?: number;
  sysAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdByName?: string;
  updatedByName?: string;
}

const columns: DataListColumn<UserGroupRow>[] = [
  { key: 'roleName', label: 'Group Name', isTitle: true },
  {
    key: 'sysAdmin',
    label: 'Sys Admin',
    render: (row) => {
      const isSysAdmin = !!row.sysAdmin;
      return (
        <span
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: isSysAdmin ? '#ffebee' : '#f5f5f5',
            color: isSysAdmin ? '#c62828' : '#616161',
          }}
        >
          {isSysAdmin ? 'Yes' : 'No'}
        </span>
      );
    },
  },
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
  {
    key: 'createdByName',
    label: 'Created By',
    render: (row) => row.createdByName || '-',
  },
  {
    key: 'updatedAt',
    label: 'Updated At',
    render: (row) =>
      row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '-',
  },
  {
    key: 'updatedByName',
    label: 'Updated By',
    render: (row) => row.updatedByName || '-',
  },
];

const emptyForm = {
  roleName: '',
  status: 1,
  sysAdmin: false,
};

export default function UserGroupsPage() {
  const [groups, setGroups] = useState<UserGroupRow[]>([]);
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
  const [selectedGroup, setSelectedGroup] = useState<UserGroupRow | null>(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getUserGroups({
        roleName: searchTerm || undefined,
      });

      interface UserGroupWithTotal extends UserGroupRow {
        totalCount?: number;
      }
      const rows = result as UserGroupRow[];
      setGroups(rows.slice((page - 1) * pageSize, page * pageSize));
      setTotal(rows.length > 0 ? (rows[0] as UserGroupWithTotal).totalCount || rows.length : 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user groups');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleOpenDialog = () => {
    setSelectedGroup(null);
    setForm(emptyForm);
    setFormError('');
    setDialogOpen(true);
  };

  const handleEditClick = (group: UserGroupRow) => {
    setSelectedGroup(group);
    setForm({
      roleName: group.roleName,
      status: group.status || 1,
      sysAdmin: !!group.sysAdmin,
    });
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
    if (!form.roleName.trim()) {
      setFormError('Group name is required');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      if (selectedGroup) {
        // Edit Mode
        await updateUserGroup(selectedGroup.roleId, {
          roleName: form.roleName.trim(),
          status: Number(form.status),
          sysAdmin: form.sysAdmin,
        });
      } else {
        // Add Mode
        await createUserGroup({
          roleName: form.roleName.trim(),
          status: Number(form.status),
          sysAdmin: form.sysAdmin,
        });
      }
      setDialogOpen(false);
      setForm(emptyForm);
      setSelectedGroup(null);
      await fetchGroups();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save user group');
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
        title="Manage User Groups"
        columns={columns}
        rows={groups}
        total={total}
        page={page}
        pageSize={pageSize}
        loading={loading}
        searchValue={searchInput}
        searchPlaceholder="Filter by group name"
        addButtonLabel="Add Group"
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearchChange={setSearchInput}
        onSearchSubmit={() => {
          setPage(1);
          setSearchTerm(searchInput.trim());
        }}
        onAddClick={handleOpenDialog}
        renderCard={(group) => {
          const isActive = group.status === 1;
          const isSysAdmin = !!group.sysAdmin;
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
                <Typography variant="h6" sx={{ fontWeight: 700, color: appColors.primary, mb: 2 }}>
                  {group.roleName}
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
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
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
                      Sys Admin
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: isSysAdmin ? '#ffebee' : '#f5f5f5',
                          color: isSysAdmin ? '#c62828' : '#616161',
                        }}
                      >
                        {isSysAdmin ? 'Yes' : 'No'}
                      </span>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
                      Created By
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={group.createdByName || '-'}>
                      {group.createdByName || '-'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
                      Created At
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                      {group.createdAt ? new Date(group.createdAt).toLocaleDateString() : '-'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
                      Updated By
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={group.updatedByName || '-'}>
                      {group.updatedByName || '-'}
                    </Typography>
                  </Box>

                  <Box sx={{ gridColumn: 'span 2' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
                      Updated At
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
                      {group.updatedAt ? new Date(group.updatedAt).toLocaleString() : '-'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-end', px: 2.5, pb: 2.5, pt: 0 }}>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(group)}
                  sx={{ color: appColors.primary }}
                  title="Edit Group"
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
        title={selectedGroup ? 'Edit Group' : 'Add Group'}
        onClose={handleCloseDialog}
        onSave={handleSave}
        saveLabel="Save"
        closeLabel="Close"
        loading={saving}
      >
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        <AppTextField
          label="Group Name"
          value={form.roleName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setForm((prev) => ({ ...prev, roleName: event.target.value }))
          }
          required
        />
        <AppCheckbox
          label="System Admin"
          checked={form.sysAdmin}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              sysAdmin: event.target.checked,
            }))
          }
        />
        <AppCheckbox
          label="Active"
          checked={form.status === 1}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              status: event.target.checked ? 1 : 2,
            }))
          }
        />
      </AppFormDialog>
    </Box>
  );
}
