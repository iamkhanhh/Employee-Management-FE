import React, { useState, useEffect } from "react";
import { Paper, CircularProgress, Box, Alert } from "@mui/material";
import AccountFilters from '../../components/AccountManagement/AccountFilters';
import AccountTable from '../../components/AccountManagement/AccountTable';
import { CreateEditDialog, DeleteDialog, ResetPasswordDialog } from '../../components/AccountManagement/AccountDialogs';
import { accountService } from '../../services/accountService';
import toast from 'react-hot-toast';

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
      toast.error("Không thể tải danh sách tài khoản. Vui lòng thử lại!");
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
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    const loadingToast = toast.loading(editingAccount ? "Đang cập nhật tài khoản..." : "Đang tạo tài khoản...");
    
    try {
      if (editingAccount) {
        await accountService.updateAccount(editingAccount.id, formData);
        toast.dismiss(loadingToast);
        toast.success(`Đã cập nhật tài khoản "${formData.full_name || formData.username}" thành công!`);
      } else {
        if (!formData.password) {
          toast.dismiss(loadingToast);
          toast.error("Mật khẩu là bắt buộc cho tài khoản mới!");
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          toast.dismiss(loadingToast);
          toast.error("Mật khẩu xác nhận không khớp!");
          return;
        }
        await accountService.createAccount(formData);
        toast.dismiss(loadingToast);
        toast.success(`Đã tạo tài khoản "${formData.full_name || formData.username}" thành công!`);
      }
      fetchAccounts(); // Refetch accounts after save
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || `Không thể ${editingAccount ? 'cập nhật' : 'tạo'} tài khoản. Vui lòng thử lại!`);
    }
  };

  const handleDelete = (account) => {
    setDeleteAccount(account);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deleteAccount) {
      const loadingToast = toast.loading("Đang xóa tài khoản...");
      try {
        await accountService.deleteAccount(deleteAccount.id);
        toast.dismiss(loadingToast);
        toast.success(`Đã xóa tài khoản "${deleteAccount.username}" thành công!`);
        fetchAccounts(); // Refetch accounts after delete
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error(error.response?.data?.message || `Không thể xóa tài khoản. Vui lòng thử lại!`);
      }
    }
    setOpenDeleteDialog(false);
    setDeleteAccount(null);
  };

  const handleToggleLock = async (account) => {
    const loadingToast = toast.loading("Đang thay đổi trạng thái khóa...");
    try {
      await accountService.toggleAccountLock(account.id);
      toast.dismiss(loadingToast);
      const action = account.status === 'active' || account.status === 'ACTIVE' ? 'khóa' : 'mở khóa';
      toast.success(`Đã ${action} tài khoản "${account.full_name || account.username}" thành công!`);
      fetchAccounts(); // Refetch accounts after toggle lock
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "Không thể thay đổi trạng thái khóa. Vui lòng thử lại!");
    }
  };

  const handleResetPassword = (account) => {
    setResetAccount(account);
    setOpenResetDialog(true);
  };

  const confirmResetPassword = async () => {
    if (resetAccount) {
      const loadingToast = toast.loading("Đang gửi email đặt lại mật khẩu...");
      try {
        // This is likely a mock implementation, as frontend can't send emails.
        // In a real app, this would call an API endpoint.
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.dismiss(loadingToast);
        toast.success(`Đã gửi email đặt lại mật khẩu đến ${resetAccount.email}!`);
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại!");
      }
    }
    setOpenResetDialog(false);
    setResetAccount(null);
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
    </div>
  );
}
