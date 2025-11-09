import React, { useState } from 'react';
import {
    Box,
    Typography,
    Breadcrumbs,
    Link,
    Chip
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import DepartmentStats from '../../components/departments/DepartmentList/DepartmentStats';
import DepartmentFilters from '../../components/departments/DepartmentList/DepartmentFilters';
import DepartmentTable from '../../components/departments/DepartmentList/DepartmentTable';
import AddDepartmentDialog from '../../components/departments/DepartmentDialog/AddDepartmentDialog';
import EditDepartmentDialog from '../../components/departments/DepartmentDialog/EditDepartmentDialog';
import DeleteDepartmentDialog from '../../components/departments/DepartmentDialog/DeleteDepartmentDialog';
import { useDepartments } from '../../hooks/useDepartments';
import ViewDepartmentDialog from '../../components/departments/DepartmentDialog/ViewDepartmentDialog';

const DepartmentManagement = () => {
    const {
        departments,
        stats,
        loading,
        fetchDepartments,
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
    const [currentDepartment, setCurrentDepartment] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Thêm state cho ViewDialog
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [viewDepartment, setViewDepartment] = useState(null);

    // Handler khi click xem chi tiết
    const handleView = (department) => {
        setViewDepartment(department);
        setOpenViewDialog(true);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = () => {
        fetchDepartments(filters);
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            search: "",
            status: "all",
            sortBy: "name"
        };
        setFilters(clearedFilters);
        fetchDepartments(clearedFilters);
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedDepartments(departments.map(d => d.id));
        } else {
            setSelectedDepartments([]);
        }
    };

    const handleSelectOne = (deptId) => {
        const selectedIndex = selectedDepartments.indexOf(deptId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedDepartments, deptId);
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

    // const handleView = (department) => {
    //     console.log('View department:', department);
    //     // Navigate to detail page or open detail dialog
    // };

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
            const result = await deleteMultipleDepartments(selectedDepartments);
            if (result.success) {
                setSelectedDepartments([]);
                fetchDepartments(filters);
            }
        }
    };

    const confirmDelete = async () => {
        if (currentDepartment) {
            const result = await deleteDepartment(currentDepartment.id);
            if (result.success) {
                setOpenDeleteDialog(false);
                setCurrentDepartment(null);
                fetchDepartments(filters);
            }
        }
    };

    const handleAddDepartment = async (departmentData) => {
        const result = await createDepartment(departmentData);
        if (result.success) {
            fetchDepartments(filters);
        }
        return result;
    };

    const handleUpdateDepartment = async (departmentData) => {
        const result = await updateDepartment(currentDepartment.id, departmentData);
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
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                sx={{ mb: 2 }}
            >
                <Link
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    color="inherit"
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Trang chủ
                </Link>
                <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    Quản lý phòng ban
                </Typography>
            </Breadcrumbs>

            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}>
                    Quản lý Phòng ban
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Quản lý cơ cấu tổ chức và phòng ban trong công ty
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ mb: 3 }}>
                <DepartmentStats stats={stats} />
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
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                loading={loading}
            />

            {/* Dialogs */}
            <AddDepartmentDialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                onSubmit={handleAddDepartment}
            />

            <EditDepartmentDialog
                open={openEditDialog}
                onClose={() => {
                    setOpenEditDialog(false);
                    setCurrentDepartment(null);
                }}
                onSubmit={handleUpdateDepartment}
                department={currentDepartment}
            />

            <DeleteDepartmentDialog
                open={openDeleteDialog}
                onClose={() => {
                    setOpenDeleteDialog(false);
                    setCurrentDepartment(null);
                }}
                onConfirm={confirmDelete}
                departmentName={currentDepartment?.dept_name}
            />

            <ViewDepartmentDialog
                open={openViewDialog}
                onClose={() => {
                    setOpenViewDialog(false);
                    setViewDepartment(null);
                }}
                department={viewDepartment}
                onEdit={handleEdit}
            />

        </Box>
    );
};

export default DepartmentManagement;