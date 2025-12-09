// src/pages/departments/DepartmentManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Breadcrumbs,
    Link
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import DepartmentFilters from '../../components/departments/DepartmentList/DepartmentFilters';
import DepartmentTable from '../../components/departments/DepartmentList/DepartmentTable';
import AddDepartmentDialog from '../../components/departments/DepartmentDialog/AddDepartmentDialog';
import EditDepartmentDialog from '../../components/departments/DepartmentDialog/EditDepartmentDialog';
import DeleteDepartmentDialog from '../../components/departments/DepartmentDialog/DeleteDepartmentDialog';
import ViewDepartmentDialog from '../../components/departments/DepartmentDialog/ViewDepartmentDialog';
import toast from 'react-hot-toast';
import { useDepartments } from '../../hooks/useDepartments';

const DepartmentManagement = () => {
    // ============================================
    // HOOKS
    // ============================================
    const {
        departments,
        pagination,
        loading,
        fetchDepartments,
        fetchDepartmentDetail,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        deleteMultipleDepartments
    } = useDepartments();

    // ============================================
    // STATE
    // ============================================
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        sortBy: "name"
    });

    const [selectedDepartments, setSelectedDepartments] = useState([]);
    
    // Dialog states
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);

    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const [currentDepartment, setCurrentDepartment] = useState(null);

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // ============================================
    // EFFECTS
    // ============================================
    useEffect(() => {
        fetchDepartments({
            ...filters,
            page,
            pageSize: rowsPerPage
        });
    }, [page, rowsPerPage]);

    // ============================================
    // HANDLERS - View
    // ============================================
    const handleView = useCallback((department) => {
        setSelectedDepartmentId(department.id);
        setOpenViewDialog(true);
    }, []);

    const handleCloseViewDialog = useCallback(() => {
        setOpenViewDialog(false);
        setSelectedDepartmentId(null);
    }, []);

    // ============================================
    // HANDLERS - Filters
    // ============================================
    const handleFilterChange = useCallback((name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSearch = useCallback(() => {
        setPage(0); // Reset to first page when searching
        fetchDepartments({
            ...filters,
            page: 0,
            pageSize: rowsPerPage
        });
    }, [filters, rowsPerPage, fetchDepartments]);

    const handleClearFilters = useCallback(() => {
        const clearedFilters = {
            search: "",
            status: "all",
            sortBy: "name"
        };
        setFilters(clearedFilters);
        setPage(0);
        fetchDepartments({
            ...clearedFilters,
            page: 0,
            pageSize: rowsPerPage
        });
    }, [rowsPerPage, fetchDepartments]);

    // ============================================
    // HANDLERS - Table Selection
    // ============================================
    const handleSelectAll = useCallback((event) => {
        if (event.target.checked) {
            setSelectedDepartments(departments.map(d => d.id));
        } else {
            setSelectedDepartments([]);
        }
    }, [departments]);

    const handleSelectOne = useCallback((departmentId) => {
        setSelectedDepartments(prev => {
            const isSelected = prev.includes(departmentId);
            if (isSelected) {
                return prev.filter(id => id !== departmentId);
            } else {
                return [...prev, departmentId];
            }
        });
    }, []);

    // ============================================
    // HANDLERS - Pagination
    // ============================================
    const handlePageChange = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    }, []);

    // ============================================
    // HANDLERS - CRUD Operations
    // ============================================
    const handleOpenAddDialog = useCallback(() => {
        setOpenAddDialog(true);
    }, []);

    const handleCloseAddDialog = useCallback(() => {
        setOpenAddDialog(false);
    }, []);

    const handleEdit = useCallback((department) => {
        setCurrentDepartment(department);
        setOpenEditDialog(true);
    }, []);

    const handleCloseEditDialog = useCallback(() => {
        setOpenEditDialog(false);
        setCurrentDepartment(null);
    }, []);

    const handleDelete = useCallback((department) => {
        setCurrentDepartment(department);
        setOpenDeleteDialog(true);
    }, []);

    const handleCloseDeleteDialog = useCallback(() => {
        setOpenDeleteDialog(false);
        setCurrentDepartment(null);
    }, []);

    // ============================================
    // API HANDLERS
    // ============================================
    const refreshData = useCallback(() => {
        fetchDepartments({
            ...filters,
            page,
            pageSize: rowsPerPage
        });
    }, [filters, page, rowsPerPage, fetchDepartments]);

    const handleAddDepartment = useCallback(async (data) => {
        const result = await createDepartment(data);
        if (result.success) {
            handleCloseAddDialog();
            refreshData();
            toast.success('Department created successfully!');
        }
        return result;
    }, [createDepartment, refreshData]);

    const handleUpdateDepartment = useCallback(async (data) => {
        if (!currentDepartment) return { success: false };
        
        const result = await updateDepartment(currentDepartment.id, data);
        if (result.success) {
            handleCloseEditDialog();
            refreshData();
            toast.success('Department updated successfully!');
        }
        return result;
    }, [currentDepartment, updateDepartment, refreshData]);

    const handleConfirmDelete = useCallback(async () => {
        if (!currentDepartment) return;

        const loadingToast = toast.loading("Deleting department...");
        const result = await deleteDepartment(currentDepartment.id);
        toast.dismiss(loadingToast);

        if (result.success) {
            handleCloseDeleteDialog();
            refreshData();
            toast.success('Department deleted successfully!');
        } else {
            toast.error(result.error || "Failed to delete department");
        }
    }, [currentDepartment, deleteDepartment, refreshData]);

    const handleDeleteSelected = useCallback(async () => {
        if (selectedDepartments.length === 0) return;

        const loadingToast = toast.loading(`Deleting ${selectedDepartments.length} departments...`);
        const result = await deleteMultipleDepartments(selectedDepartments);
        toast.dismiss(loadingToast);

        if (result.success) {
            setSelectedDepartments([]);
            refreshData();
            toast.success(`Successfully deleted ${selectedDepartments.length} departments!`);
        } else {
            toast.error(result.error || "Failed to delete departments");
        }
    }, [selectedDepartments, deleteMultipleDepartments, refreshData]);

    // ============================================
    // RENDER
    // ============================================
    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Breadcrumb */}
            <Breadcrumbs 
                separator={<NavigateNextIcon fontSize="small" />} 
                sx={{ mb: 2 }}
            >
                <Link 
                    underline="hover" 
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
                    color="inherit"
                    href="/"
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Home
                </Link>
                <Typography 
                    color="text.primary"
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <BusinessIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Department Management
                </Typography>
            </Breadcrumbs>

            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography 
                    variant="h4" 
                    sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}
                >
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
                onAdd={handleOpenAddDialog}
                onDeleteSelected={handleDeleteSelected}
                selectedCount={selectedDepartments.length}
                loading={loading}
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
                totalElements={pagination?.totalElements || departments.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />

            {/* Add Dialog */}
            <AddDepartmentDialog
                open={openAddDialog}
                onClose={handleCloseAddDialog}
                onSubmit={handleAddDepartment}
            />

            {/* Edit Dialog */}
            <EditDepartmentDialog
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                onSubmit={handleUpdateDepartment}
                department={currentDepartment}
            />

            {/* Delete Dialog */}
            <DeleteDepartmentDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                department={currentDepartment}
                departmentName={currentDepartment?.deptName}
            />

            {/* View Detail Dialog */}
            <ViewDepartmentDialog
                open={openViewDialog}
                onClose={handleCloseViewDialog}
                departmentId={selectedDepartmentId}
                fetchDepartmentDetail={fetchDepartmentDetail}
                onEdit={handleEdit}
            />
        </Box>
    );
};

export default DepartmentManagement;