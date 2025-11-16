import { useState, useEffect, useCallback } from 'react';
import {
  mockContracts,
  mockEmployees,
  getActiveEmployeesWithInfo,
  addContractToMockData,
  updateContractInMockData,
  deleteContractFromMockData
} from '../data/mockData';
import axios from 'axios';
import { axiosInstance } from '../lib/axios';

export const useContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    expiringSoon: 0
  });

  // Calculate stats
  const calculateStats = useCallback((contractList) => {
    const activeContracts = contractList.filter(c => !c.is_deleted);

    const stats = {
      total: activeContracts.length,
      active: activeContracts.filter(c => c.status === 'ACTIVE').length,
      expired: activeContracts.filter(c => c.status === 'EXPIRED').length,
      expiringSoon: activeContracts.filter(c => {
        if (c.status !== 'ACTIVE') return false;
        const endDate = new Date(c.end_date);
        const today = new Date();
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays > 0;
      }).length
    };

    return stats;
  }, []);

  // Fetch contractDetail
  const fetchContractDetail = useCallback(async (id) => {
    if (!id) return null;

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/contracts/${id}`);
      const detail = res.data?.data;  // <-- LẤY ĐÚNG DATA

      return detail || null;
    } catch (err) {
      console.error("Error fetching contract detail:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);



  // Fetch contracts với full employee information
  const fetchContracts = useCallback(async (filters = {}) => {
    setLoading(true);

    try {
      const params = {
        page: filters.page || 0,
        pageSize: filters.pageSize || 5,
        contractType: filters.contractType || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      };

      const res = await axiosInstance.get("/contracts", { params });

      const data = res.data?.data;
      if (!data) return [];

      let content = data.content || [];

      setContracts(content);
      setPagination({
        page: data.currentPage,
        rowsPerPage: data.pageSize,
        total: data.totalElements
      });

      return content;
    } catch (err) {
      console.error("Error fetching contracts:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);






  // Create new contract
  const createContract = useCallback(async (contractData) => {
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newContract = addContractToMockData(contractData);

      // Update local state
      setContracts(prev => [...prev, newContract]);
      setStats(calculateStats([...contracts, newContract]));

      return { success: true, data: newContract };
    } catch (error) {
      console.error('Error creating contract:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [contracts, calculateStats]);

  // Update contract
  const updateContract = useCallback(async (id, updates) => {
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedContract = updateContractInMockData(id, updates);

      if (updatedContract) {
        setContracts(prev =>
          prev.map(c => c.id === id ? updatedContract : c)
        );
        return { success: true, data: updatedContract };
      }

      throw new Error('Contract not found');
    } catch (error) {
      console.error('Error updating contract:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete contract (soft delete)
  const deleteContract = useCallback(async (id) => {
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const success = deleteContractFromMockData(id);

      if (success) {
        setContracts(prev => prev.filter(c => c.id !== id));
        setStats(calculateStats(contracts.filter(c => c.id !== id)));
        return { success: true };
      }

      throw new Error('Contract not found');
    } catch (error) {
      console.error('Error deleting contract:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [contracts, calculateStats]);

  // Delete multiple contracts
  const deleteMultipleContracts = useCallback(async (ids) => {
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      ids.forEach(id => deleteContractFromMockData(id));

      setContracts(prev => prev.filter(c => !ids.includes(c.id)));
      setStats(calculateStats(contracts.filter(c => !ids.includes(c.id))));

      return { success: true };
    } catch (error) {
      console.error('Error deleting contracts:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [contracts, calculateStats]);

  // Simulate file download
  const downloadFile = useCallback(async (fileUrl) => {
    try {
      console.log('Downloading file:', fileUrl);

      // Simulate file download
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a dummy link to simulate download
      const link = document.createElement('a');
      link.href = '#';
      link.download = fileUrl.split('/').pop();
      link.click();

      return { success: true };
    } catch (error) {
      console.error('Error downloading file:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Export contracts to Excel/CSV
  const exportContracts = useCallback(async (filters) => {
    try {
      console.log('Exporting contracts with filters:', filters);

      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create CSV content
      const csvContent = "data:text/csv;charset=utf-8,"
        + "Mã NV,Họ tên,Phòng ban,Email,Điện thoại,Loại hợp đồng,Ngày bắt đầu,Ngày kết thúc,Trạng thái\n"
        + contracts.map(c => {
          const emp = c.employee;
          return `NV${String(emp?.id).padStart(4, '0')},${emp?.full_name},${emp?.department?.dept_name},${emp?.user?.email},${emp?.phone_number},${c.contract_type},${c.start_date},${c.end_date},${c.status}`;
        }).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `contracts_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { success: true };
    } catch (error) {
      console.error('Error exporting contracts:', error);
      return { success: false, error: error.message };
    }
  }, [contracts]);

  // Load initial data
  useEffect(() => {
    fetchContracts();
    setEmployees(getActiveEmployeesWithInfo());
  }, []);

  return {
    contracts,
    employees,
    stats,
    loading,
    fetchContractDetail,
    fetchContracts,
    createContract,
    updateContract,
    deleteContract,
    deleteMultipleContracts,
    downloadFile,
    exportContracts
  };
};