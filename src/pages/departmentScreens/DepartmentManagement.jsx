import React, { useState } from 'react';
import {
    Box,
    Typography,
    Breadcrumbs,
    Link
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import DepartmentFilters from '../../components/departments/DepartmentList/DepartmentFilters';
import DepartmentTable from '../../components/departments/DepartmentList/DepartmentTable';
import AddDepartmentDialog from '../../components/departments/DepartmentDialog/AddDepartmentDialog';
import EditDepartmentDialog from '../../components/departments/DepartmentDialog/EditDepartmentDialog';
import DeleteDepartmentDialog from '../../components/departments/DepartmentDialog/DeleteDepartmentDialog';
import ViewDepartmentDialog from '../../components/departments/DepartmentDialog/ViewDepartmentDialog';
import toast from 'react-hot-toast';

import { useDepartments } from '../../hooks/useDepartments';

const DepartmentManagement = () => {
    const {
        departments,
        loading,
        fetchDepartments,
        fetchDepartmentDetail,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        deleteMultipleDepartments
    } = useDepartments();

    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        sortBy: "name"
    });

    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);

    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const [currentDepartment, setCurrentDepartment] = useState(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // -----------------------
    // View Department
    // -----------------------
    const handleView = (department) => {
        setSelectedDepartmentId(department.id);
        setOpenViewDialog(true);
    };

    const handleCloseDetail = () => {
        setOpenViewDialog(false);
        setSelectedDepartmentId(null);
    };

    // -----------------------
    // Filters
    // -----------------------
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        fetchDepartments(filters);
    };

    const handleClearFilters = () => {
        const cleared = {
            search: "",
            status: "all",
            sortBy: "name"
        };
        setFilters(cleared);
        fetchDepartments(cleared);
    };

    // -----------------------
    // Table Selection
    // -----------------------
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedDepartments(departments.map(d => d.id));
        } else {
            setSelectedDepartments([]);
        }
    };

    const handleSelectOne = (departmentId) => {
        const selectedIndex = selectedDepartments.indexOf(departmentId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedDepartments, departmentId);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedDepartments.slice(1));
        } else if (selectedIndex === selectedDepartments.length - 1) {
            newSelected = newSelected.concat(selectedDepartments.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedDepartments.slice(0, selectedIndex),
                selectedDepartments.slice(selectedIndex + 1)
            );
        }
        setSelectedDepartments(newSelected);
    };


    // -----------------------
    // CRUD
    // -----------------------
    const handleEdit = (department) => {
        setCurrentDepartment(department);
        setOpenEditDialog(true);
    };

    const handleDelete = (department) => {
        setCurrentDepartment(department);
        setOpenDeleteDialog(true);
    };

    const handleDeleteSelected = async () => {
        if (selectedDepartments.length > 0) {
            const loadingToast = toast.loading(`Deleting ${selectedDepartments.length} departments...`);
            const result = await deleteMultipleDepartments(selectedDepartments);
            toast.dismiss(loadingToast);
            if (result.success) {
                toast.success(`Successfully deleted ${selectedDepartments.length} departments!`);
                setSelectedDepartments([]);
                fetchDepartments(filters);
            } else {
                toast.error(result.error || "Unable to delete departments. Please try again!");
            }
        }
    };

    const confirmDelete = async () => {
        if (currentDepartment) {
            const loadingToast = toast.loading("Deleting department...");
            const result = await deleteDepartment(currentDepartment.id);
            toast.dismiss(loadingToast);
            if (result.success) {
                setOpenDeleteDialog(false);
                setCurrentDepartment(null);
                fetchDepartments(filters);
            } else {
                toast.error(result.error || "Unable to delete department. Please try again!");
            }
        }
    };


    const handleAddDepartment = async (data) => {
        const result = await createDepartment(data);
        if (result.success) fetchDepartments(filters);
        return result;
    };

    const handleUpdateDepartment = async (data) => {
        const result = await updateDepartment(currentDepartment.id, data);
        if (result.success) {
            setOpenEditDialog(false);
            setCurrentDepartment(null);
            fetchDepartments(filters);
        }
        return result;
    };

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>

            {/* Breadcrumb */}
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
                <Link underline="hover" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} color="inherit">
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Home
                </Link>
                <Typography color="text.primary">
                    Department Management
                </Typography>
            </Breadcrumbs>

            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}>
                    Department Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage company organization structure and departments
                </Typography>
            </Box>

            {/* Filters */}
            <DepartmentFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onClearFilters={handleClearFilters}
                onAdd={() => setOpenAddDialog(true)}
                onDeleteSelected={handleDeleteSelected}
                selectedCount={selectedDepartments.length}
            />

            {/* Table */}
            <DepartmentTable
                departments={departments}
                selectedDepartments={selectedDepartments}
                onSelectAll={handleSelectAll}
                onSelectOne={handleSelectOne}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />

            {/* Add */}
            <AddDepartmentDialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                onSubmit={handleAddDepartment}
            />

            {/* Edit */}
            <EditDepartmentDialog
                open={openEditDialog}
                onClose={() => {
                    setOpenEditDialog(false);
                    setCurrentDepartment(null);
                }}
                onSubmit={handleUpdateDepartment}
                department={currentDepartment}
            />

            {/* Delete */}
            <DeleteDepartmentDialog
                open={openDeleteDialog}
                onClose={() => {
                    console.log('🗑️ Closing delete dialog');
                    setOpenDeleteDialog(false);
                    setCurrentDepartment(null);
                }}
                onConfirm={confirmDelete}
                departmentName={currentDepartment?.deptName}
                department={currentDepartment}
            />

            {/* View Detail */}
            <ViewDepartmentDialog
                open={openViewDialog}
                onClose={handleCloseDetail}
                departmentId={selectedDepartmentId}
                fetchDepartmentDetail={fetchDepartmentDetail}
                onEdit={handleEdit}
            />
        </Box>
    );
};

export default DepartmentManagement;
