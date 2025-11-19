import React, { useState, useEffect, useCallback } from "react";
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from "@mui/material";
import EmployeeFilters from '../../components/EmployeeManagement/EmployeeFilters';
import EmployeeTable from '../../components/EmployeeManagement/EmployeeTable';
import { AddEmployeeDialog, DeleteEmployeeDialog } from '../../components/EmployeeManagement/EmployeeDialogs';
import { employeeService } from "../../services/employeeService";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';

export default function EmployeeList() {
  const navigate = useNavigate();

  // State cho dữ liệu và UI
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRows, setTotalRows] = useState(0);

  // State cho việc xóa
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  // State cho bộ lọc và phân trang
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [position, setPosition] = useState("all");
  const [workStatus, setWorkStatus] = useState("all");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  // State cho dialog
  const [openAdd, setOpenAdd] = useState(false);

  const [departments, setDepartments] = useState([
    { id: 1, name: 'Phòng Kỹ thuật (IT)' },
    { id: 2, name: 'Phòng Nhân sự (HR)' },
    { id: 3, name: 'Phòng Kế toán' },
    { id: 4, name: 'Phòng Marketing' },
    { id: 5, name: 'Ban Giám đốc' },
  ]); 

  // --- Handlers ---
  const handleEdit = (employee) => {
    navigate(`/admin/employees/${employee.id}`);
  };

  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await employeeService.deleteEmployee(employeeToDelete.id);
      setOpenDeleteDialog(false);
      setEmployeeToDelete(null);
      toast.success(`Đã xóa nhân viên "${employeeToDelete.fullName}" thành công!`);
      fetchEmployees(); // Tải lại danh sách
    } catch (err) {
      console.error("Failed to delete employee:", err);
      toast.error(err.response?.data?.message || `Không thể xóa nhân viên "${employeeToDelete.fullName}". Vui lòng thử lại!`);
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
    { field: 'gender', headerName: 'Gender', width: 110 },
    { field: 'phoneNumber', headerName: 'Phone', width: 140 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'roleInDept', headerName: 'Position', width: 150 },
    { field: 'hireDate', headerName: 'Hire date', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${params.value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 130,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <IconButton color="primary" onClick={() => handleEdit(params.row)}><EditIcon fontSize="small" /></IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row)}><DeleteIcon fontSize="small" /></IconButton>
        </div>
      ),
    },
  ];

  // Hàm gọi API lấy danh sách nhân viên
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: paginationModel.page + 1, 
        limit: paginationModel.pageSize,
        search: query,
        department: department !== 'all' ? department : undefined,
        position: position !== 'all' ? position : undefined,
        status: workStatus !== 'all' ? workStatus : undefined,
      };
      // Xóa các param undefined
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await employeeService.getAllEmployees(params);
      console.log("Employee API response:", response);
      // Sửa lỗi: Lấy dữ liệu từ response.data.content
      const formattedData = response.data.data.content.map(emp => ({
        ...emp,
        hireDate: emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : '',
      }));
      setEmployees(formattedData);
      setTotalRows(response.data.totalElements || 0); // Sửa lỗi: Lấy tổng số dòng từ API
      setError(null);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setError("Không thể tải danh sách nhân viên.");
      toast.error("Không thể tải danh sách nhân viên. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [paginationModel, query, department, position, workStatus]);

  // Gọi API khi component mount hoặc khi bộ lọc/phân trang thay đổi
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const [formState, setFormState] = useState({
    userId: 0,
    deptId: 0,
    fullName: "",
    gender: "",
    dob: "",
    phoneNumber: "",
    address: "",
    hireDate: "",
    status: "ACTIVE",
    roleInDept: ""
  });

  const resetForm = () => {
    setFormState({
      userId: 0,
      deptId: 0,
      fullName: "",
      gender: "",
      dob: "",
      phoneNumber: "",
      address: "",
      hireDate: "",
      status: "ACTIVE",
      roleInDept: ""
    });
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    if (!formState.fullName || !formState.userId || !formState.deptId) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc: Tên, User ID, Phòng ban");
      return;
    }

    // Chuyển đổi state của form thành FormData để gửi đi
    const formData = new FormData();
    Object.keys(formState).forEach(key => {
      formData.append(key, formState[key]);
    });
    console.log("Submitting new employee:", formState);
    
    const loadingToast = toast.loading("Đang thêm nhân viên...");
    try {
      const response = await employeeService.createEmployee(formData);
      toast.dismiss(loadingToast);
      toast.success(`Đã thêm nhân viên "${formState.fullName}" thành công!`);
      setOpenAdd(false);
      resetForm();
      fetchEmployees(); // Tải lại danh sách sau khi thêm thành công
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Failed to create employee:", err);
      toast.error(err.response?.data?.message || `Không thể thêm nhân viên. Vui lòng thử lại!`);
    }
  };

  const handleRowClick = (params) => {
    // navigate(`/admin/employees/${params.row.id}`);
  };

  return (
      <div className="min-h-screen flex bg-linear-to-br from-white via-gray-50 to-white">
        {/* Main content */}
        <div className="flex-1 flex items-start justify-center">
          <div className="mx-auto w-full max-w-6xl my-6">
            <Paper className="p-6 md:p-8" elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb', backgroundColor: 'white' }}>
          
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Employee List</h1>

          <EmployeeFilters
            query={query}
            setQuery={setQuery}
            department={department}
            setDepartment={setDepartment}
            position={position}
            setPosition={setPosition}
            workStatus={workStatus}
            setWorkStatus={setWorkStatus}
            onCreate={() => setOpenAdd(true)}
            onSearch={fetchEmployees} // Nút search sẽ trigger việc fetch lại
          />

          {error && <Typography color="error" sx={{ my: 2 }}>{error}</Typography>}

          <Box sx={{ mt: 4 }}>
            <EmployeeTable
              rows={employees}
              columns={columns}
              onRowClick={handleRowClick}
              loading={loading}
              rowCount={totalRows}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowSelectionModel={rowSelectionModel}
              onRowSelectionModelChange={setRowSelectionModel}
              paginationMode="server"
            />
          </Box>
            </Paper>
          </div>
        </div>

       <AddEmployeeDialog open={openAdd} onClose={() => { setOpenAdd(false); resetForm(); }} onSubmit={handleSaveEmployee} formState={formState} setFormState={setFormState} departments={departments} />

       <DeleteEmployeeDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        employeeName={employeeToDelete?.fullName}
      />
    </div>
  );
}