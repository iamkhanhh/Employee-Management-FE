import React, { useState } from "react";
import { Paper, Snackbar, Alert } from "@mui/material";
import AccountFilters from '../../components/AccountManagement/AccountFilters';
import AccountTable from '../../components/AccountManagement/AccountTable';
import { CreateEditDialog, DeleteDialog, ResetPasswordDialog } from '../../components/AccountManagement/AccountDialogs';
import { mockUsers } from '../../data/mockData';

export default function AccountManager() {
  const initialFromMock = (mockUsers && mockUsers.length > 0) ? mockUsers.map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    // prefer full_name if available, otherwise try common fallbacks
    full_name: u.full_name || u.fullName || u.name || u.username,
    // map roles like 'ADMIN'/'HR'/'EMPLOYEE' to 'Admin' or 'User'
    role: (u.role && u.role.toString().toLowerCase() === 'admin') || (u.role && u.role.toString().toLowerCase().includes('admin')) ? 'Admin' : 'User',
    // map status 'ACTIVE' -> 'active', others -> 'locked' (fallback)
    status: u.status && u.status.toString().toLowerCase() === 'active' ? 'active' : 'locked',
    created_at: u.created_at ? u.created_at.replace('T', ' ').slice(0, 19) : new Date().toISOString().replace('T', ' ').slice(0, 19),
  })) : [
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
  ];

  const [accounts, setAccounts] = useState(initialFromMock);

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
                status: formData.status,
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
      
      if (formData.password !== formData.confirmPassword) {
        setSnackbar({
          open: true,
          message: 'Passwords do not match',
          severity: 'error',
        });
        return;
      }
      
      const newAccount = {
        id: accounts.length > 0 ? Math.max(...accounts.map((a) => a.id)) + 1 : 1,
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role,
        status: formData.status,
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
      <div className="flex-1 flex items-start justify-center">
        <div className="mx-auto w-full max-w-6xl my-6">
          <Paper className="p-6 md:p-8" elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Account Management</h1>
            <p className="mt-2 text-sm text-gray-600">Manage user accounts, roles, and permissions.</p>

            {/* Filters + Actions */}
            <AccountFilters
              query={query}
              setQuery={setQuery}
              filterRole={filterRole}
              setFilterRole={setFilterRole}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              onCreate={handleOpenCreate}
            />

            {/* Table */}
            <AccountTable rows={rows} onEdit={handleEdit} onDelete={handleDelete} onToggleLock={handleToggleLock} onResetPassword={handleResetPassword} />
          </Paper>
        </div>
      </div>

      {/* Dialogs */}
      <CreateEditDialog open={openDialog} onClose={() => { setOpenDialog(false); resetForm(); }} onSubmit={handleSave} editingAccount={editingAccount} formData={formData} setFormData={setFormData} />
      <DeleteDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} onConfirm={confirmDelete} deleteAccount={deleteAccount} />
      <ResetPasswordDialog open={openResetDialog} onClose={() => setOpenResetDialog(false)} onConfirm={confirmResetPassword} resetAccount={resetAccount} />

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '8px' }}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
}
