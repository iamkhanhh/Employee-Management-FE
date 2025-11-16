import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

import ContractFilters from '../../components/contracts/ContractList/ContractFilters';
import ContractTable from '../../components/contracts/ContractList/ContractTable';
import AddContractDialog from '../../components/contracts/ContractDialog/AddContractDialog';
import DeleteContractDialog from '../../components/contracts/ContractDialog/DeleteContractDialog';
import ContractDetailDialog from '../../components/contracts/ContractDialog/ContractDetailDialog';
import { useContracts } from '../../hooks/useContracts';
// src/pages/contractScreens/ContractManagement.jsx
import { generateEmployeeCode } from '../../data/mockData';
import toast from 'react-hot-toast';

const ContractManagement = () => {
  const {
    contracts,
    employees,
    stats,
    loading,
    fetchContracts,
    fetchContractDetail,
    createContract,
    updateContract,
    deleteContract,
    deleteMultipleContracts,
    downloadFile,
    exportContracts
  } = useContracts();

  const [filters, setFilters] = useState({
    search: "",
    contractType: "all",
    status: "all",
    startDate: "",
    endDate: "",
    department: "all"
  });

  const [selectedContracts, setSelectedContracts] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openContractDetail, setOpenContractDetail] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [contractToDelete, setContractToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    fetchContracts(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: "",
      contractType: "all",
      status: "all",
      startDate: "",
      endDate: "",
      department: "all"
    };
    setFilters(clearedFilters);
    fetchContracts(clearedFilters);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedContracts(contracts.map(c => c.id));
    } else {
      setSelectedContracts([]);
    }
  };

  const handleSelectOne = (contractId) => {
    const selectedIndex = selectedContracts.indexOf(contractId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedContracts, contractId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedContracts.slice(1));
    } else if (selectedIndex === selectedContracts.length - 1) {
      newSelected = newSelected.concat(selectedContracts.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedContracts.slice(0, selectedIndex),
        selectedContracts.slice(selectedIndex + 1)
      );
    }

    setSelectedContracts(newSelected);
  };

  // ============================================
  // VIEW CONTRACT DETAIL
  // ============================================
  const handleView = (contractId) => {
    setSelectedContractId(contractId);
    setOpenContractDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenContractDetail(false);
    setSelectedContractId(null);
  };

  // ============================================
  // EDIT CONTRACT
  // ============================================
  const handleEdit = (contractId) => {
    const contract = contracts.find(c => c.id === contractId);
    console.log('Edit contract:', contract);
    // TODO: Implement edit dialog
    // setSelectedContract(contract);
    // setOpenEditDialog(true);
  };

  // ============================================
  // DELETE CONTRACT
  // ============================================
  const handleDelete = (contract) => {
    setContractToDelete(contract);
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
        toast.success(`Department "${currentDepartment.deptName || currentDepartment.dept_name}" has been deleted successfully!`);
        setOpenDeleteDialog(false);
        setCurrentDepartment(null);
        fetchDepartments(filters);
      } else {
        toast.error(result.error || "Unable to delete department. Please try again!");
      }
    }
  };

  // ============================================
  // ADD CONTRACT
  // ============================================
  const handleAddContract = async (contractData) => {
    const loadingToast = toast.loading("Đang tạo hợp đồng...");
    const result = await createContract(contractData);
    toast.dismiss(loadingToast);
    if (result.success) {
      toast.success(`Đã tạo hợp đồng thành công!`);
      setOpenAddDialog(false);
      fetchContracts(filters);
    } else {
      toast.error(result.error || "Không thể tạo hợp đồng. Vui lòng thử lại!");
    }
    return result;
  };

  // ============================================
  // IMPORT/EXPORT
  // ============================================
  const handleImport = () => {
    console.log('Import Excel functionality');
    // TODO: Implement import functionality
  };

  const handleExport = () => {
    exportContracts(filters);
  };

  // ============================================
  // DOWNLOAD FILE
  // ============================================
  const handleDownloadFile = (fileUrl, fileName) => {
    downloadFile(fileUrl, fileName);
  };

  // ============================================
  // PAGINATION
  // ============================================
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}>
          Contract Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all employee contracts within the company
        </Typography>
      </Box>

      {/* Filters */}
      <ContractFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onClearFilters={handleClearFilters}
        onAdd={() => setOpenAddDialog(true)}
        onImport={handleImport}
        onExport={handleExport}
        onDeleteSelected={handleDeleteSelected}
        selectedCount={selectedContracts.length}
      />

      {/* Table */}
      <ContractTable
        contracts={contracts}
        selectedContracts={selectedContracts}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDownloadFile={handleDownloadFile}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        loading={loading}
      />

      {/* Dialogs */}
      <ContractDetailDialog
        open={openContractDetail}
        onClose={handleCloseDetail}
        contractId={selectedContractId}
        fetchContractDetail={fetchContractDetail}
        onDownloadFile={handleDownloadFile}
      />



      <AddContractDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddContract}
        employees={employees}
      />

      <DeleteContractDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={confirmDelete}
        contractName={contractToDelete?.employeeName || contractToDelete?.employee?.full_name}
      />
    </Box>
  );
};

export default ContractManagement;