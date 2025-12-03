import React, { useState, useEffect, useCallback } from "react";
import Paper from '@mui/material/Paper';
import { Box, Typography } from "@mui/material";
import EmployeeTable from '../../components/EmployeeManagement/EmployeeTable';
import EmployeeFilters from '../../components/EmployeeManagement/EmployeeFilters';
import { AddEmployeeDialog, DeleteEmployeeDialog, EditEmployeeDialog } from '../../components/EmployeeManagement/EmployeeDialogs';
import { useDepartments } from "../../hooks/useDepartments";
import { employeeService } from "../../services/employeeService";
import moment from 'moment';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';

export default function EmployeeList() {
  // State for data and UI
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRows, setTotalRows] = useState(0);

  // State for deletion
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  // State for filtering and pagination
  const [filters, setFilters] = useState({ query: '', department: 'all', position: 'all', workStatus: 'all' });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  // State for dialogs
  const [openAdd, setOpenAdd] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const { fetchDepartments, departments: deptList } = useDepartments();

  const [departments, setDepartments] = useState([]);

    const [formState, setFormState] = useState({
    id: "",
    department: "",
    fullName: "",
    gender: "",
    dob: "",
    phoneNumber: "",
    address: "",
    hireDate: "",
    status: "",
    roleInDept: ""
  });

  const resetForm = () => {
    setFormState({
      id: "",
      department: "",
      fullName: "",
      gender: "",
      dob: "",
      phoneNumber: "",
      address: "",
      hireDate: "",
      status: "",
      roleInDept: ""
    });
  };

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await fetchDepartments();
      if (Array.isArray(data)) {
        const formatted = data.map(d => ({ id: d.id, name: d.deptName }));
        setDepartments(formatted);
      }
    };
    loadDepartments();
  }, [fetchDepartments]);

  // --- Handlers ---
  const handleEdit = (employee) => {
    employeeService.getEmployeeById(employee.id)
      .then((res) => {
        const emp = res.data.data;

        setFormState({
          id: emp.id,
          userId: emp.username,   // hoặc emp.userId nếu API trả
          fullName: emp.fullName,
          phoneNumber: emp.phoneNumber,
          address: emp.address,

          // Fix Department mapping
          deptId: departments.find(d => d.name === emp.department)?.id || "",

          // Fix Gender
          gender:
            emp.gender === "MALE"
              ? "Male"
              : emp.gender === "FEMALE"
              ? "Female"
              : "Other",

          // Fix Status
          status: emp.status.toLowerCase(),

          // Fix Role in dept
          roleInDept: emp.roleInDept === "STAFF" ? "Staff" : "Head",

          // Fix date format
          dob: moment(emp.dob, "DD/MM/YYYY").format("YYYY-MM-DD"),
          hireDate: moment(emp.hireDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
        });

        setOpenEditDialog(true);
      });
  };


  
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    if (!formState.fullName || !formState.deptId) {
        toast.error("Please fill in all required fields: Name, Department");
        return;
    }

    const formatDate = (dateString) => {
        if (!dateString) return "";
        if (moment(dateString, 'YYYY-MM-DD', true).isValid()) {
            return moment(dateString).format('DD/MM/YYYY');
        }
        return dateString;
    };
    
    const payload = {
        ...formState,
        gender: formState.gender.toUpperCase(),
        status: formState.status.toUpperCase(),
        roleInDept: formState.roleInDept.toUpperCase(),
        dob: formatDate(formState.dob),
        hireDate: formatDate(formState.hireDate),
    };
    
    const loadingToast = toast.loading("Updating employee...");
    try {
        await employeeService.updateEmployee(formState.id, payload);
        console.log("Updated employee:", payload);
        toast.dismiss(loadingToast);
        toast.success(`Successfully updated employee "${formState.fullName}"!`);
        setOpenEditDialog(false);
        fetchEmployees(); // Refresh list
    } catch (err) {
        toast.dismiss(loadingToast);
        console.error("Failed to update employee:", err);
        toast.error(err.response?.data?.message || "Could not update employee. Please try again!");
    }
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
    { field: 'id', headerName: 'ID', width: 30, type: 'number' },
    {
      field: 'fullName',
      headerName: 'Full name',
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          {/* <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
            {params.row.fullName?.charAt(0)?.toUpperCase?.()}
          </span> */}
          <div className="text-gray-900 font-medium">{params.row.fullName}</div>
        </div>
      ),
    },
    { field: 'gender', headerName: 'Gender', width: 110 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'roleInDept', headerName: 'Position', width: 150 },
    { field: 'hireDate', headerName: 'Hire date', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${params.value === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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

  // API call to get employee list
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: paginationModel.page, 
        limit: paginationModel.pageSize,
        search: filters.query,
        department: filters.department !== 'all' ? filters.department : undefined,
        position: filters.position !== 'all' ? filters.position : undefined,
        status: filters.workStatus !== 'all' ? filters.workStatus : undefined,
      };
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await employeeService.getAllEmployees(params);
      const formattedData = response.data.data.content.map(emp => ({
        ...emp,
        hireDate: emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : '',
      }));
      setEmployees(formattedData);
      setTotalRows(response.data.data.totalElements || 0);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setError("Could not load employee list.");
      toast.error("Could not load employee list. Please try again!");
    } finally {
      setLoading(false);
    }
  }, [paginationModel, filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);



  const handleSaveEmployee = async (e) => {
    e.preventDefault();

    if (!formState.fullName || !formState.userId || !formState.deptId) {
      toast.error("Please fill in all required fields: Name, User ID, Department");
      return;
    }

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const d = new Date(dateString);
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    };

    const payload = {
      ...formState,
      gender: formState.gender.toUpperCase(),
      status: formState.status.toUpperCase(),
      roleInDept: formState.roleInDept.toUpperCase(),
      dob: formatDate(formState.dob),
      hireDate: formatDate(formState.hireDate),
    };

    const loadingToast = toast.loading("Adding employee...");

    try {
      await employeeService.createEmployee(payload);
      toast.dismiss(loadingToast);
      toast.success(`Successfully added employee "${formState.fullName}"!`);
      
      setOpenAdd(false);
      resetForm();
      fetchEmployees();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Failed to create employee:", err);
      toast.error(err.response?.data?.message || "Could not add employee. Please try again!");
    }
  };

  const handleRowClick = (params) => {
    // navigate(`/admin/employees/${params.row.id}`);
  };

  return (
      <div className="min-h-screen flex bg-linear-to-br from-white via-gray-50 to-white">
        <div className="flex-1 flex items-start justify-center">
          <div className="mx-auto w-full max-w-6xl my-6">
            <Paper className="p-6 md:p-8" elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb', backgroundColor: 'white' }}>
            <Box mb={3}>
              <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
                Employye List
              </Typography>
            </Box>
          <EmployeeFilters
            filters={filters}
            setFilters={setFilters}
            departments={departments || []}
            onCreate={() => toast("Add Employee Clicked")}
            onSearch={() => setPaginationModel(prev => ({ ...prev, page: 0 }))}
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

       <EditEmployeeDialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)} 
        onSubmit={handleUpdateEmployee} 
        formState={formState} 
        setFormState={setFormState} 
        departments={departments} 
       />

       <DeleteEmployeeDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        employeeName={employeeToDelete?.fullName}
      />
    </div>
  );
}