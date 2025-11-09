import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Tooltip,
  Alert,
  Snackbar,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AddIcon from '@mui/icons-material/Add';

const columns = (handleEdit, handleDelete, handleToggleLock, handleResetPassword) => [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 80, 
    type: 'number',
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'username',
    headerName: 'Username',
    width: 150,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 220,
  },
  {
    field: 'full_name',
    headerName: 'Full Name',
    width: 180,
    renderCell: (params) => (
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          {params.row.full_name?.charAt(0)?.toUpperCase?.()}
        </span>
        <div className="text-gray-900 font-medium">{params.row.full_name}</div>
      </div>
    ),
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        sx={{
          backgroundColor: params.value === 'Admin' ? '#fee2e2' : '#dbeafe',
          color: params.value === 'Admin' ? '#991b1b' : '#1e40af',
          fontWeight: 600,
        }}
      />
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value === 'active' ? 'Active' : 'Locked'}
        size="small"
        sx={{
          backgroundColor: params.value === 'active' ? '#d1fae5' : '#fee2e2',
          color: params.value === 'active' ? '#065f46' : '#991b1b',
          fontWeight: 500,
        }}
      />
    ),
  },
  {
    field: 'created_at',
    headerName: 'Created At',
    width: 160,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 280,
    sortable: false,
    renderCell: (params) => (
      <div className="flex items-center gap-1">
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{
              color: '#3b82f6',
              '&:hover': {
                backgroundColor: '#eff6ff',
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={params.row.status === 'active' ? 'Lock' : 'Unlock'}>
          <IconButton
            size="small"
            onClick={() => handleToggleLock(params.row)}
            sx={{
              color: params.row.status === 'active' ? '#f59e0b' : '#10b981',
              '&:hover': {
                backgroundColor: params.row.status === 'active' ? '#fef3c7' : '#d1fae5',
              },
            }}
          >
            {params.row.status === 'active' ? (
              <LockIcon fontSize="small" />
            ) : (
              <LockOpenIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset Password">
          <IconButton
            size="small"
            onClick={() => handleResetPassword(params.row)}
            sx={{
              color: '#6366f1',
              '&:hover': {
                backgroundColor: '#eef2ff',
              },
            }}
          >
            <VpnKeyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row)}
            sx={{
              color: '#ef4444',
              '&:hover': {
                backgroundColor: '#fee2e2',
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    ),
  },
];

export default function AccountManagementPage() {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      full_name: 'Admin User',
      role: 'Admin',
      status: 'active',
      created_at: '2024-01-01 09:00:00',
    },
    {
      id: 2,
      username: 'nguyenvana',
      email: 'nguyenvana@example.com',
      full_name: 'Nguyen Van A',
      role: 'User',
      status: 'active',
      created_at: '2024-02-15 10:30:00',
    },
    {
      id: 3,
      username: 'tranthib',
      email: 'tranthib@example.com',
      full_name: 'Tran Thi B',
      role: 'User',
      status: 'locked',
      created_at: '2024-03-20 14:20:00',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteAccount, setDeleteAccount] = useState(null);
  const [resetAccount, setResetAccount] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Filter state
  const [query, setQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    role: 'User',
    password: '',
    confirmPassword: '', 
    status: 'pending',
  });

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      full_name: '',
      role: 'User',
      password: '',
      confirmPassword: '', 
      status: 'pending',
    });
    setEditingAccount(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      username: account.username,
      email: account.email,
      full_name: account.full_name,
      role: account.role,
      password: '',
      status: account.status,
      confirmPassword: '', 
    });
    setOpenDialog(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.full_name) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error',
      });
      return;
    }

    if (editingAccount) {
      // Update existing account
      setAccounts(
        accounts.map((acc) =>
          acc.id === editingAccount.id
            ? {
                ...acc,
                username: formData.username,
                email: formData.email,
                full_name: formData.full_name,
                role: formData.role,
                status: formData.status, // <-- CẬP NHẬT TRƯỜNG STATUS
                updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
              }
            : acc
        )
      );
      setSnackbar({
        open: true,
        message: 'Account updated successfully',
        severity: 'success',
      });
    } else {
      // Create new account
      if (!formData.password) {
        setSnackbar({
          open: true,
          message: 'Password is required for new accounts',
          severity: 'error',
        });
        return;
      }
      
      // <-- THÊM VALIDATION MẬT KHẨU -->
      if (formData.password !== formData.confirmPassword) {
        setSnackbar({
          open: true,
          message: 'Passwords do not match',
          severity: 'error',
        });
        return;
      }
      // <-- KẾT THÚC VALIDATION -->
      
      const newAccount = {
        id: accounts.length > 0 ? Math.max(...accounts.map((a) => a.id)) + 1 : 1,
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role,
        status: formData.status, // <-- SỬ DỤNG STATUS TỪ FORM
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      setAccounts([...accounts, newAccount]);
      setSnackbar({
        open: true,
        message: 'Account created successfully',
        severity: 'success',
      });
    }
    setOpenDialog(false);
    resetForm();
  };

  const handleDelete = (account) => {
    setDeleteAccount(account);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteAccount) {
      setAccounts(accounts.filter((acc) => acc.id !== deleteAccount.id));
      setSnackbar({
        open: true,
        message: 'Account deleted successfully',
        severity: 'success',
      });
    }
    setOpenDeleteDialog(false);
    setDeleteAccount(null);
  };

  const handleToggleLock = (account) => {
    setAccounts(
      accounts.map((acc) =>
        acc.id === account.id
          ? {
              ...acc,
              status: acc.status === 'active' ? 'locked' : 'active',
              updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
            }
          : acc
      )
    );
    setSnackbar({
      open: true,
      message: `Account ${account.status === 'active' ? 'locked' : 'unlocked'} successfully`,
      severity: 'success',
    });
  };

  const handleResetPassword = (account) => {
    setResetAccount(account);
    setOpenResetDialog(true);
  };

  const confirmResetPassword = () => {
    if (resetAccount) {
      // In a real app, this would call an API to reset the password
      setSnackbar({
        open: true,
        message: `Password reset email sent to ${resetAccount.email}`,
        severity: 'success',
      });
    }
    setOpenResetDialog(false);
    setResetAccount(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filtered rows for DataGrid
  const rows = accounts
    .filter((acc) => {
      const queryLower = query.toLowerCase();
      const matchesQuery =
        acc.full_name.toLowerCase().includes(queryLower) ||
        acc.email.toLowerCase().includes(queryLower) ||
        acc.username.toLowerCase().includes(queryLower);
      
      const matchesRole = filterRole === 'all' || acc.role === filterRole;
      const matchesStatus = filterStatus === 'all' || acc.status === filterStatus;

      return matchesQuery && matchesRole && matchesStatus;
    });

  return (
    <div className="min-h-screen flex bg-linear-to-br from-white via-gray-50 to-white">
      {/* Main content */}
      <div className="flex-1 flex items-start justify-center">
        <div className="mx-auto w-full max-w-6xl my-6">
          <Paper className="p-6 md:p-8" elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}>
            
            {/* Header */}
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Account Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage user accounts, roles, and permissions.
            </p>

            {/* Filters grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
              <TextField
                label="Search"
                placeholder="Search by name, email, username"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                size="small"
                className="md:col-span-3"
              />
              <FormControl size="small">
                <InputLabel>Role</InputLabel>
                <Select label="Role" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="User">User</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="locked">Locked</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-3 pb-6">
              <Button 
                variant="contained" 
                className="normal-case" 
                onClick={handleOpenCreate}
                startIcon={<AddIcon />}
              >
                Create Account
              </Button>
            </div>

            {/* Data Grid */}
            <Paper sx={{ height: 440, width: '100%', mt: 2 }}>
              <DataGrid
                rows={rows}
                columns={columns(handleEdit, handleDelete, handleToggleLock, handleResetPassword)}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                pageSizeOptions={[5, 10, 25]}
                sx={{ 
                  border: 0,
                  '& .MuiDataGrid-row': {
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }
                }}
              />
            </Paper>
          </Paper>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingAccount ? 'Edit Account' : 'Create New Account'}
        </DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent dividers>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                disabled={!!editingAccount}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Full Name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
              
              {/* --- TRƯỜNG STATUS MỚI --- */}
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  // Khi sửa tài khoản, không cho phép đổi status về 'pending' (tùy chọn)
                  disabled={!!editingAccount && formData.status !== 'pending'}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="locked">Locked</MenuItem>
                </Select>
              </FormControl>
              {/* --- KẾT THÚC TRƯỜNG MỚI --- */}

              {!editingAccount && (
                <>
                  <TextField
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    fullWidth
                    helperText="Password is required for new accounts"
                  />
                  {/* --- TRƯỜNG CONFIRM PASSWORD MỚI --- */}
                  <TextField
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    fullWidth
                    helperText="Please confirm your password"
                  />
                  {/* --- KẾT THÚC TRƯỜNG MỚI --- */}
                </>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {editingAccount ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <div>
            Are you sure you want to delete the account for{' '}
            <strong>{deleteAccount?.full_name}</strong> ({deleteAccount?.username})?
            <br />
            <span className="text-red-600 mt-2 block">
              This action cannot be undone.
            </span>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog 
        open={openResetDialog} 
        onClose={() => setOpenResetDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Reset Password</DialogTitle>
        <DialogContent>
          <div>
            Are you sure you want to reset the password for{' '}
            <strong>{resetAccount?.full_name}</strong> ({resetAccount?.username})?
            <br />
            <span className="mt-2 block">
              A password reset email will be sent to <strong>{resetAccount?.email}</strong>.
            </span>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={confirmResetPassword} 
            color="primary" 
            variant="contained"
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: '8px',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}