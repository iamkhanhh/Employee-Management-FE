import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ContractFilters from '../../components/contracts/ContractList/ContractFilters';
import ContractTable from '../../components/contracts/ContractList/ContractTable';
import AddContractDialog from '../../components/contracts/ContractDialog/AddContractDialog';
import DeleteContractDialog from '../../components/contracts/ContractDialog/DeleteContractDialog';
import ContractDetailDialog from '../../components/contracts/ContractDialog/ContractDetailDialog';
import EditContractDialog from '../../components/contracts/ContractDialog/EditContractDialog'
import { useContracts } from '../../hooks/useContracts';
import toast from 'react-hot-toast';

const ContractManagement = () => {
  const {
    contracts,
    pagination,
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
    page: 0,
    pageSize: 10
  });

  const [selectedContracts, setSelectedContracts] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openContractDetail, setOpenContractDetail] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [contractToDelete, setContractToDelete] = useState(null);

  const [openEditDialog, setOpenEditDialog] = useState(null);
  const [currentContract, setCurrentContract] = useState(null);

  // ============================================
  // LOAD INITIAL DATA
  // ============================================
  useEffect(() => {
    fetchContracts(filters);
  }, []);

  // ============================================
  // FILTER HANDLERS
  // ============================================
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    const searchFilters = { ...filters, page: 0 };
    setFilters(searchFilters);
    fetchContracts(searchFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: "",
      contractType: "all",
      status: "all",
      startDate: "",
      endDate: "",
      page: 0,
      pageSize: filters.pageSize
    };
    setFilters(clearedFilters);
    fetchContracts(clearedFilters);
  };

  // ============================================
  // SELECTION HANDLERS
  // ============================================
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
    fetchContracts(filters);
  };

  const handleCloseDetail = () => {
    setOpenContractDetail(false);
    setSelectedContractId(null);
  };

  // ============================================
  // EDIT CONTRACT
  // ============================================
  const handleEdit = (contract) => {
    setCurrentContract(contract);
    setOpenEditDialog(true);
  };

  const handleUpdateContract = async (data) => {
  const loadingToast = toast.loading("Updating contract...");
  const result = await updateContract(currentContract.id, data);
  toast.dismiss(loadingToast);
  
  if (result.success) {
    toast.success("Contract updated successfully!");
    setOpenEditDialog(false);
    setCurrentContract(null);
    fetchContracts(filters); // Refresh danh sách
  } else {
    toast.error(result.error || "Failed to update contract");
  }
  return result;
};

  // ============================================
  // DELETE CONTRACT
  // ============================================
  const handleDelete = (contract) => {
    setContractToDelete(contract);
    setOpenDeleteDialog(true);
  };

  const handleDeleteSelected = async () => {
    if (selectedContracts.length > 0) {
      const loadingToast = toast.loading(`Deleting ${selectedContracts.length} contracts...`);
      const result = await deleteMultipleContracts(selectedContracts);
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(`Successfully deleted ${selectedContracts.length} contracts!`);
        setSelectedContracts([]);
        fetchContracts(filters);
      } else {
        toast.error(result.error || "Unable to delete contracts. Please try again!");
      }
    }
  };

  const confirmDelete = async () => {
    if (contractToDelete) {
      const loadingToast = toast.loading("Deleting contract...");
      const result = await deleteContract(contractToDelete.id);
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(`Contract for "${contractToDelete.employeeName}" has been deleted successfully!`);
        setOpenDeleteDialog(false);
        setContractToDelete(null);
        fetchContracts(filters);
      } else {
        toast.error(result.error || "Unable to delete contract. Please try again!");
      }
    }
  };

  // ============================================
  // ADD CONTRACT
  // ============================================
  const handleAddContract = async (contractData) => {
    const loadingToast = toast.loading("Creating contract...");
    const result = await createContract(contractData);
    toast.dismiss(loadingToast);

    if (result.success) {
      toast.success("Contract created successfully!");
      setOpenAddDialog(false);
      fetchContracts(filters);
    } else {
      toast.error(result.error || "Cannot create contract. Please try again!");
    }
    return result;
  };

  // ============================================
  // IMPORT/EXPORT
  // ============================================
  const handleImport = () => {
    toast.info('Import feature coming soon!');
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
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    fetchContracts(newFilters);
  };

  const handleRowsPerPageChange = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    const newFilters = { ...filters, pageSize: newPageSize, page: 0 };
    setFilters(newFilters);
    fetchContracts(newFilters);
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
        page={pagination.page}
        rowsPerPage={pagination.pageSize}
        totalElements={pagination.totalElements}
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

      <EditContractDialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setCurrentContract(null);
        }}
        onSubmit={handleUpdateContract}
        contract={currentContract}
      />

      <AddContractDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddContract}
      />

      <DeleteContractDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setContractToDelete(null);
        }}
        onConfirm={confirmDelete}
        contractName={contractToDelete?.employeeName}
      />
    </Box>
  );
};

export default ContractManagement;