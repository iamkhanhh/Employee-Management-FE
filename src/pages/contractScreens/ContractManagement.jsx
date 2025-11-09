import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
// Sửa lại đường dẫn import
import ContractStats from '../../components/contracts/ContractList/ContractStats';
import ContractFilters from '../../components/contracts/ContractList/ContractFilters';
import ContractTable from '../../components/contracts/ContractList/ContractTable';
import AddContractDialog from '../../components/contracts/ContractDialog/AddContractDialog';
import DeleteContractDialog from '../../components/contracts/ContractDialog/DeleteContractDialog';
import { useContracts } from '../../hooks/useContracts';
// src/pages/contractScreens/ContractManagement.jsx
import { generateEmployeeCode } from '../../data/mockData';

const ContractManagement = () => {
  const {
    contracts,
    employees,
    stats,
    loading,
    fetchContracts,
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

  const handleView = (contractId) => {
    const contract = contracts.find(c => c.id === contractId);
    console.log('View contract:', contract);
    // Implement view dialog
  };

  const handleEdit = (contractId) => {
    const contract = contracts.find(c => c.id === contractId);
    console.log('Edit contract:', contract);
    // Implement edit dialog
  };

  const handleDelete = (contract) => {
    setContractToDelete(contract);
    setOpenDeleteDialog(true);
  };

  const handleDeleteSelected = () => {
    if (selectedContracts.length > 0) {
      console.log('Delete multiple contracts:', selectedContracts);
      deleteMultipleContracts(selectedContracts).then(result => {
        if (result.success) {
          setSelectedContracts([]);
          fetchContracts(filters);
        }
      });
    }
  };

  const confirmDelete = async () => {
    if (contractToDelete) {
      const result = await deleteContract(contractToDelete.id);
      if (result.success) {
        setOpenDeleteDialog(false);
        setContractToDelete(null);
        fetchContracts(filters);
      }
    }
  };

  const handleAddContract = async (contractData) => {
    const result = await createContract(contractData);
    if (result.success) {
      fetchContracts(filters);
    }
    return result;
  };

  const handleImport = () => {
    console.log('Import Excel functionality');
    // Implement import functionality
  };

  const handleExport = () => {
    exportContracts(filters);
  };

  const handleDownloadFile = (fileUrl) => {
    downloadFile(fileUrl);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}>
          Quản lý Hợp đồng Lao động
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý toàn bộ hợp đồng của nhân viên trong công ty
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ mb: 3 }}>
        <ContractStats stats={stats} />
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
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Dialogs */}
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
        contractName={contractToDelete?.employee?.full_name}
      />
    </Box>
  );
};

export default ContractManagement;