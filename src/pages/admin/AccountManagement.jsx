import React, { useState, useEffect } from "react";
import { Paper, CircularProgress, Box, Alert } from "@mui/material";
import { Typography } from "@mui/material";
import AccountFilters from '../../components/AccountManagement/AccountFilters';
import AccountTable from '../../components/AccountManagement/AccountTable';
import { AddAccountDialog, EditAccountDialog, DeleteAccountDialog, ResetPasswordDialog } from '../../components/AccountManagement/AccountDialogs';
import { accountService } from '../../services/accountService';
import { useDepartments } from "../../hooks/useDepartments";

import toast from 'react-hot-toast';

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteAccount, setDeleteAccount] = useState(null);
  const [resetAccount, setResetAccount] = useState(null);
  const [departments, setDepartments] = useState([]);
  const { fetchDepartments, departments: deptList } = useDepartments();


  // Filter state
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });

  const [filters, setFilters] = useState({
    search: '',
    deptId: 'all',
    status: 'all',
    dob: '',
  });

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "USER",
    status: "ACTIVE",
    currentPassword: "",
    password: "",
  });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page, 
        limit: pagination.pageSize,
        search: filters.search || undefined,
        deptId: filters.deptId !== 'all' ? filters.deptId : undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        dob: filters.dob || undefined,
      };
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      const response = await accountService.getAccounts(params);
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
  const loadDepartments = async () => {
      const data = await fetchDepartments();
      if (Array.isArray(data)) {
        const formatted = data.map(d => ({ id: d.id, name: d.deptName }));
        setDepartments(formatted);
      }
    };

  useEffect(() => {
    fetchAccounts(filters);
  }, [filters]);

  useEffect(() => {
    loadDepartments();
  }, []);

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
      status: '',
      fullName: '',
      gender: '',
      country: '',
      dob: '',
      profilePicImage: '',
      currentPassword: '',
    });
    setEditingAccount(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenAddDialog(true);
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
      fullName: account.fullName,
      gender: account.gender,
      country: account.country,
      dob: account.dob,
      profilePicImage: account.profilePicImage,
    });
    setOpenEditDialog(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    const loadingToast = toast.loading("Đang tạo tài khoản...");
    
    try {
      await accountService.createAccount(formData);
      toast.dismiss(loadingToast);
      toast.success(`Đã tạo tài khoản "${formData.username}" thành công!`);
      
      fetchAccounts();
      setOpenAddDialog(false);
      resetForm();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || `Không thể tạo tài khoản. Vui lòng thử lại!`);
    }
  };

  const handleSave = async (e) => {
  e.preventDefault();

  if (!formData.username || !formData.email) {
    toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
    return;
  }

  // 🔹 Xử lý password theo Cách 1
  const payload = {
    ...formData,
    password: formData.password?.trim() ? formData.password : null,
  };

  // Không cần gửi confirmPassword lên backend
  delete payload.confirmPassword;

  const loadingToast = toast.loading("Đang cập nhật tài khoản...");

  try {
    console.log("Updating account with data:", payload);

    await accountService.updateAccount(editingAccount.id, payload);

    toast.dismiss(loadingToast);
    toast.success(
      `Đã cập nhật tài khoản "${formData.fullName || formData.username}" thành công!`
    );

    fetchAccounts();
    setOpenEditDialog(false);
    resetForm();
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error(
      error.response?.data?.message ||
        "Không thể cập nhật tài khoản. Vui lòng thử lại!"
    );
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




  return (
    <div className="min-h-screen flex bg-linear-to-br from-white via-gray-50 to-white">
      <div className="flex-1 flex items-start justify-center">
        <div className="mx-auto w-full max-w-6xl my-6">
          <Paper className="p-6 md:p-8" elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}>
            <Box mb={3}>
              <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
                Account Management
              </Typography>
            </Box>
            {/* Filters + Actions */}
            <AccountFilters
              filters={filters}
              setFilters={setFilters}
              departments={departments || []}
              onCreate={handleOpenCreate}
              onSearch={() => {}}
            />  

            {/* Table */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ my: 4 }}>{error}</Alert>
            ) : (
              <AccountTable rows={accounts} onEdit={handleEdit} onDelete={handleDelete} onToggleLock={handleToggleLock} onResetPassword={handleResetPassword} />
            )}
          </Paper>
        </div>
      </div>

      {/* Dialogs */}
      <AddAccountDialog open={openAddDialog} onClose={() => { setOpenAddDialog(false); resetForm(); }} onSubmit={handleAdd} formData={formData} setFormData={setFormData} />
      <EditAccountDialog open={openEditDialog} onClose={() => { setOpenEditDialog(false); resetForm(); }} onSubmit={handleSave} editingAccount={editingAccount} formData={formData} setFormData={setFormData} />
      <DeleteAccountDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} onConfirm={confirmDelete} deleteAccount={deleteAccount} />
      <ResetPasswordDialog open={openResetDialog} onClose={() => setOpenResetDialog(false)} onConfirm={confirmResetPassword} resetAccount={resetAccount} />
    </div>
  );
}
