import React, { useState, useEffect } from "react";
import { Paper, Snackbar, Alert, CircularProgress, Box } from "@mui/material";
import AccountFilters from '../../components/AccountManagement/AccountFilters';
import AccountTable from '../../components/AccountManagement/AccountTable';
import { CreateEditDialog, DeleteDialog, ResetPasswordDialog } from '../../components/AccountManagement/AccountDialogs';
import { accountService } from '../../services/accountService';

export default function AccountManager() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const [filterCreatedAt, setFilterCreatedAt] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'User',
    password: '',
    confirmPassword: '', 
    status: 'pending',
  });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountService.getAccounts();
      // Lấy mảng content từ response.data
      const users = Array.isArray(response.data.data.content) ? response.data.data.content : [];
      setAccounts(users);

      setError(null);
    } catch (error) {
      setError('Failed to fetch accounts. Please try again later.');
      setSnackbar({ open: true, message: 'Failed to fetch accounts', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
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
      role: account.role,
      password: '',
      status: account.status,
      confirmPassword: '', 
    });
    setOpenDialog(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.full_name) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error',
      });
      return;
    }

    try {
      if (editingAccount) {
        await accountService.updateAccount(editingAccount.id, formData);
        setSnackbar({
          open: true,
          message: 'Account updated successfully',
          severity: 'success',
        });
      } else {
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
        await accountService.createAccount(formData);
        setSnackbar({
          open: true,
          message: 'Account created successfully',
          severity: 'success',
        });
      }
      fetchAccounts(); // Refetch accounts after save
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to save account: ${error.message}`,
        severity: 'error',
      });
    }
  };

  const handleDelete = (account) => {
    setDeleteAccount(account);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deleteAccount) {
      try {
        await accountService.deleteAccount(deleteAccount.id);
        setSnackbar({
          open: true,
          message: 'Account deleted successfully',
          severity: 'success',
        });
        fetchAccounts(); // Refetch accounts after delete
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Failed to delete account: ${error.message}`,
          severity: 'error',
        });
      }
    }
    setOpenDeleteDialog(false);
    setDeleteAccount(null);
  };

  const handleToggleLock = async (account) => {
    try {
      await accountService.toggleAccountLock(account.id);
      setSnackbar({
        open: true,
        message: `Account ${account.status === 'active' ? 'locked' : 'unlocked'} successfully`,
        severity: 'success',
      });
      fetchAccounts(); // Refetch accounts after toggle lock
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to toggle lock status: ${error.message}`,
        severity: 'error',
      });
    }
  };

  const handleResetPassword = (account) => {
    setResetAccount(account);
    setOpenResetDialog(true);
  };

  const confirmResetPassword = () => {
    if (resetAccount) {
      // This is likely a mock implementation, as frontend can't send emails.
      // In a real app, this would call an API endpoint.
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
        (acc.email && acc.email.toLowerCase().includes(queryLower)) ||
        (acc.userName && acc.username.toLowerCase().includes(queryLower) ||
        (acc.createdAt && acc.createdAt.toLowerCase().includes(queryLower))
      );
      
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
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ my: 4 }}>{error}</Alert>
            ) : (
              <AccountTable rows={rows} onEdit={handleEdit} onDelete={handleDelete} onToggleLock={handleToggleLock} onResetPassword={handleResetPassword} />
            )}
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
