import React, { useState, useEffect, useCallback } from "react";
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from "@mui/material";
import PayrollFilters from '../../components/PayrollManagement/PayrollFilters';
import PayrollTable from '../../components/PayrollManagement/PayrollTable';
import { AddPayrollDialog, DeletePayrollDialog } from '../../components/PayrollManagement/PayrollDialogs';
import { payrollService } from "../../services/payrollService";
import { employeeService } from "../../services/employeeService";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';

export default function PayrollList() {
  const navigate = useNavigate();

  // State cho dữ liệu và UI
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRows, setTotalRows] = useState(0);

  // State cho việc xóa
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [payrollToDelete, setPayrollToDelete] = useState(null);

  // State cho bộ lọc và phân trang
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [month, setMonth] = useState("all");
  const [year, setYear] = useState("all");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  // State cho dialog
  const [openAdd, setOpenAdd] = useState(false);
  const [employees, setEmployees] = useState([]);

  // --- Handlers ---
  const handleEdit = (payroll) => {
    // navigate(`/admin/payrolls/${payroll.id}`);
    console.log("Edit payroll:", payroll);
  };

  const handleDelete = (payroll) => {
    setPayrollToDelete(payroll);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!payrollToDelete) return;
    try {
      await payrollService.deletePayroll(payrollToDelete.id);
      setOpenDeleteDialog(false);
      setPayrollToDelete(null);
      toast.success(`Đã xóa bảng lương thành công!`);
      fetchPayrolls(); // Tải lại danh sách
    } catch (err) {
      console.error("Failed to delete payroll:", err);
      toast.error(err.response?.data?.message || `Không thể xóa bảng lương. Vui lòng thử lại!`);
    }
  };

  // --- Columns Definition ---
  const columns = [
    { field: 'id', headerName: 'ID', width: 90, type: 'number' },
    {
      field: 'fullName',
      headerName: 'Full name',
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
            {params.row.fullName?.charAt(0)?.toUpperCase?.()}
          </span>
          <div className="text-gray-900 font-medium">{params.row.fullName}</div>
        </div>
      ),
    },
    { field: 'employeeId', headerName: 'Employee ID', width: 130 },
    { field: 'basicSalary', headerName: 'Basic Salary', width: 140, type: 'number', 
      renderCell: (params) => (
        <span>{params.value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value) : '-'}</span>
      )
    },
    { field: 'allowance', headerName: 'Allowance', width: 130, type: 'number',
      renderCell: (params) => (
        <span>{params.value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value) : '-'}</span>
      )
    },
    { field: 'bonus', headerName: 'Bonus', width: 130, type: 'number',
      renderCell: (params) => (
        <span>{params.value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value) : '-'}</span>
      )
    },
    { field: 'deduction', headerName: 'Deduction', width: 130, type: 'number',
      renderCell: (params) => (
        <span>{params.value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value) : '-'}</span>
      )
    },
    { field: 'netSalary', headerName: 'Net Salary', width: 150, type: 'number',
      renderCell: (params) => (
        <span className="font-semibold text-green-600">
          {params.value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value) : '-'}
        </span>
      )
    },
    {
      field: 'fileUrl',
      headerName: 'File',
      width: 120,
      renderCell: (params) => (
        params.value ? (
          <a 
            href={params.value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View File
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        )
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const statusColors = {
          'pending': 'bg-yellow-100 text-yellow-800',
          'approved': 'bg-blue-100 text-blue-800',
          'paid': 'bg-green-100 text-green-800',
          'cancelled': 'bg-red-100 text-red-800',
        };
        const statusColor = statusColors[params.value?.toLowerCase()] || 'bg-gray-100 text-gray-800';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
            {params.value}
          </span>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 130,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleEdit(params.row); }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="error" onClick={(e) => { e.stopPropagation(); handleDelete(params.row); }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ),
    },
  ];

  // Hàm gọi API lấy danh sách nhân viên (để dùng trong dialog)
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeService.getAllEmployees({ page: 1, limit: 1000 });
      if (response.data?.data?.content) {
        setEmployees(response.data.data.content);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  }, []);

  // Hàm gọi API lấy danh sách bảng lương
  const fetchPayrolls = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: paginationModel.page + 1, 
        limit: paginationModel.pageSize,
        search: query,
        status: status !== 'all' ? status : undefined,
        month: month !== 'all' ? month : undefined,
        year: year !== 'all' ? year : undefined,
      };
      // Xóa các param undefined
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await payrollService.getAllPayrolls(params);
      console.log("Payroll API response:", response);
      
      // Format dữ liệu từ API
      const formattedData = (response.data?.data?.content || []).map((payroll, index) => ({
        ...payroll,
        // Đảm bảo có id hợp lệ
        id: payroll.id || payroll.payrollId || index,
        // Đảm bảo các trường số được parse đúng
        basicSalary: payroll.basicSalary ? parseFloat(payroll.basicSalary) : 0,
        allowance: payroll.allowance ? parseFloat(payroll.allowance) : 0,
        bonus: payroll.bonus ? parseFloat(payroll.bonus) : 0,
        deduction: payroll.deduction ? parseFloat(payroll.deduction) : 0,
        netSalary: payroll.netSalary ? parseFloat(payroll.netSalary) : 0,
      }));
      
      setPayrolls(formattedData);
      setTotalRows(response.data?.totalElements || response.data?.data?.totalElements || 0);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch payrolls:", err);
      setError("Không thể tải danh sách bảng lương.");
      toast.error("Không thể tải danh sách bảng lương. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [paginationModel, query, status, month, year]);

  // Gọi API khi component mount hoặc khi bộ lọc/phân trang thay đổi
  useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls]);

  // Load danh sách nhân viên khi mở dialog
  useEffect(() => {
    if (openAdd) {
      fetchEmployees();
    }
  }, [openAdd, fetchEmployees]);

  const [formState, setFormState] = useState({
    employeeId: "",
    basicSalary: "",
    allowance: "",
    bonus: "",
    deduction: "",
    month: "",
    status: "pending",
  });

  const resetForm = () => {
    setFormState({
      employeeId: "",
      basicSalary: "",
      allowance: "",
      bonus: "",
      deduction: "",
      month: "",
      status: "pending",
    });
  };

  const handleSavePayroll = async (e) => {
    e.preventDefault();
    if (!formState.employeeId || !formState.basicSalary || !formState.month) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc: Nhân viên, Lương cơ bản, Tháng");
      return;
    }

    // Tính toán net salary
    const basicSalary = parseFloat(formState.basicSalary) || 0;
    const allowance = parseFloat(formState.allowance) || 0;
    const bonus = parseFloat(formState.bonus) || 0;
    const deduction = parseFloat(formState.deduction) || 0;
    const netSalary = basicSalary + allowance + bonus - deduction;

    const payrollData = {
      ...formState,
      basicSalary: basicSalary,
      allowance: allowance,
      bonus: bonus,
      deduction: deduction,
      netSalary: netSalary,
    };

    console.log("Submitting new payroll:", payrollData);
    
    const loadingToast = toast.loading("Đang thêm bảng lương...");
    try {
      const response = await payrollService.createPayroll(payrollData);
      toast.dismiss(loadingToast);
      toast.success(`Đã thêm bảng lương thành công!`);
      setOpenAdd(false);
      resetForm();
      fetchPayrolls(); // Tải lại danh sách sau khi thêm thành công
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Failed to create payroll:", err);
      toast.error(err.response?.data?.message || `Không thể thêm bảng lương. Vui lòng thử lại!`);
    }
  };

  const handleRowClick = (params) => {
    // navigate(`/admin/payrolls/${params.row.id}`);
  };

  return (
    <div className="min-h-screen flex bg-linear-to-br from-white via-gray-50 to-white">
      {/* Main content */}
      <div className="flex-1 flex items-start justify-center">
        <div className="mx-auto w-full max-w-6xl my-6">
          <Paper className="p-6 md:p-8" elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb', backgroundColor: 'white' }}>
          
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Payroll Management</h1>

            <PayrollFilters
              query={query}
              setQuery={setQuery}
              status={status}
              setStatus={setStatus}
              month={month}
              setMonth={setMonth}
              year={year}
              setYear={setYear}
              onCreate={() => setOpenAdd(true)}
              onSearch={fetchPayrolls}
            />

            {error && <Typography color="error" sx={{ my: 2 }}>{error}</Typography>}

            <Box sx={{ mt: 4 }}>
              <PayrollTable
                rows={payrolls}
                columns={columns}
                onRowClick={handleRowClick}
                loading={loading}
                rowCount={totalRows}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                paginationMode="server"
              />
            </Box>
          </Paper>
        </div>
      </div>

      <AddPayrollDialog 
        open={openAdd} 
        onClose={() => { setOpenAdd(false); resetForm(); }} 
        onSubmit={handleSavePayroll} 
        formState={formState} 
        setFormState={setFormState} 
        employees={employees} 
      />

      <DeletePayrollDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        payrollInfo={payrollToDelete}
      />
    </div>
  );
}
