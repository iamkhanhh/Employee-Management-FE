import React, { useState, useEffect, useCallback } from "react";
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from "@mui/material";
import EmployeeFilters from '../../components/EmployeeManagement/EmployeeFilters';
import EmployeeTable from '../../components/EmployeeManagement/EmployeeTable';
import { AddEmployeeDialog } from '../../components/EmployeeManagement/EmployeeDialogs';
// Import service để gọi API
import { employeeService } from "../../services/employeeService";

// columns and paginationModel unchanged
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
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${params.value === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
          }`}
      >
        {params.value}
      </span>
    ),
  },
];

export default function EmployeeList() {
  const navigate = useNavigate();

  // State cho dữ liệu và UI
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRows, setTotalRows] = useState(0);

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
      // Lấy dữ liệu từ response.data.content và định dạng lại
      const formattedData = response.data.data.content.map(emp => ({
        ...emp,
        hireDate: emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : '',
      }));
      setEmployees(formattedData);
      setTotalRows(response.data.totalElements || 0); // Lấy tổng số dòng từ API
      setError(null);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setError("Không thể tải danh sách nhân viên.");
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
      console.error("Các trường bắt buộc: Tên, Email, Phòng ban");
      return;
    }

    // Chuyển đổi state của form thành FormData để gửi đi
    const formData = new FormData();
    Object.keys(formState).forEach(key => {
      formData.append(key, formState[key]);
    });
    console.log("Submitting new employee:", formState);
    try {
      await employeeService.createEmployee(formData);
      setOpenAdd(false);
      resetForm();
      fetchEmployees(); // Tải lại danh sách sau khi thêm thành công
    } catch (err) {
      console.error("Failed to create employee:", err);
      // TODO: Hiển thị thông báo lỗi cho người dùng
    }
  };

  const handleRowClick = (params) => {
    navigate(`/admin/employees/${params.row.id}`);
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
              paginationMode="server"
            />
          </Box>
            </Paper>
          </div>
        </div>

       <AddEmployeeDialog open={openAdd} onClose={() => { setOpenAdd(false); resetForm(); }} onSubmit={handleSaveEmployee} formState={formState} setFormState={setFormState} departments={departments} />
    </div>
  );
}