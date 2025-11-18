import { useState, useCallback } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  });

  // ============================================
  // FETCH CONTRACTS với FILTERS
  // ============================================
  const fetchContracts = useCallback(async (filters = {}) => {
    setLoading(true);

    try {
      const params = {
        page: filters.page ?? 0,
        pageSize: filters.pageSize ?? 10,
      };

      // Chỉ thêm filter khi có giá trị và khác "all"
      if (filters.contractType && filters.contractType !== 'all') {
        params.contractType = filters.contractType;
      }

      if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
      }

      if (filters.startDate) {
        params.startDate = filters.startDate;
      }

      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      if (filters.search) {
        params.keyword = filters.search; // hoặc "search" tùy backend
      }

      const res = await axiosInstance.get("/contracts", { params });

      // ✅ Kiểm tra response đúng structure
      if (res.data?.code === 0 && res.data?.data) {
        const data = res.data.data;

        setContracts(data.content || []);
        setPagination({
          page: data.currentPage,
          pageSize: data.pageSize,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          hasNext: data.hasNext,
          hasPrevious: data.hasPrevious
        });

        return data.content || [];
      } else {
        throw new Error(res.data?.message || 'Failed to fetch contracts');
      }
    } catch (err) {
      console.error("Error fetching contracts:", err);
      toast.error(err.response?.data?.message || "Cannot load contracts");
      setContracts([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // FETCH CONTRACT DETAIL
  // ============================================
  const fetchContractDetail = useCallback(async (id) => {
    if (!id) return null;

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/contracts/${id}`);

      if (res.data?.code === 0 && res.data?.data) {
        return res.data.data;
      } else {
        throw new Error(res.data?.message || 'Failed to fetch contract detail');
      }
    } catch (err) {
      console.error("Error fetching contract detail:", err);
      toast.error(err.response?.data?.message || "Cannot load contract detail");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // CREATE CONTRACT
  // ============================================
  const createContract = useCallback(async (contractData) => {
    setLoading(true);

    try {
      // ✅ Chuyển date sang array format [year, month, day] để tránh lỗi parse
      const formatDateToArray = (dateStr) => {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-').map(Number);
        return [year, month, day];
      };

      const payload = {
        empId: contractData.empId,
        contractType: contractData.contractType,
        startDate: formatDateToArray(contractData.startDate),
        endDate: formatDateToArray(contractData.endDate),
        fileUrl: contractData.fileUrl || null,
        status: contractData.status
      };

      console.log('📤 Creating contract with payload:', payload);

      const res = await axiosInstance.post('/contracts', payload);

      if (res.data?.code === 0) {
        return { success: true, data: res.data.data };
      } else {
        throw new Error(res.data?.message || 'Failed to create contract');
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // UPDATE CONTRACT
  // ============================================
  // hooks/useContracts.js

  const updateContract = useCallback(async (id, updates) => {
    setLoading(true);

    try {
      // ✅ Chuyển date sang array format nếu là string
      const formatDateToArray = (dateStr) => {
        if (!dateStr) return null;
        if (Array.isArray(dateStr)) return dateStr; // Đã là array thì return
        const [year, month, day] = dateStr.split('-').map(Number);
        return [year, month, day];
      };

      const payload = {
        contractType: updates.contractType,
        startDate: formatDateToArray(updates.startDate),
        endDate: formatDateToArray(updates.endDate),
        fileUrl: updates.fileUrl || null,
        status: updates.status
      };

      console.log('📤 Updating contract with payload:', payload);

      const res = await axiosInstance.put(`/contracts/${id}`, payload);

      if (res.data?.code === 0) {
        return { success: true, data: res.data.data };
      } else {
        throw new Error(res.data?.message || 'Failed to update contract');
      }
    } catch (error) {
      console.error('Error updating contract:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // DELETE CONTRACT
  // ============================================
  const deleteContract = useCallback(async (id) => {
    setLoading(true);

    try {
      const res = await axiosInstance.delete(`/contracts/${id}`);

      if (res.data?.code === 0) {
        return { success: true };
      } else {
        throw new Error(res.data?.message || 'Failed to delete contract');
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // DELETE MULTIPLE CONTRACTS
  // ============================================
  const deleteMultipleContracts = useCallback(async (ids) => {
    setLoading(true);

    try {
      // Nếu API hỗ trợ xóa nhiều
      const res = await axiosInstance.delete("/contracts/batch", {
        data: { ids }
      });

      if (res.data?.code === 0) {
        return { success: true };
      } else {
        throw new Error(res.data?.message || 'Failed to delete contracts');
      }
    } catch (error) {
      console.error('Error deleting contracts:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // DOWNLOAD FILE
  // ============================================
  const downloadFile = useCallback(async (fileUrl, fileName) => {
    try {
      if (!fileUrl) {
        toast.error('File URL not found');
        return { success: false };
      }

      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || fileUrl.split('/').pop();
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Downloading file...');
      return { success: true };
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Cannot download file');
      return { success: false };
    }
  }, []);

  // ============================================
  // EXPORT CONTRACTS
  // ============================================
  const exportContracts = useCallback(async (filters) => {
    try {
      toast.loading('Exporting contracts...');

      await new Promise(resolve => setTimeout(resolve, 1000));

      const csvContent = "data:text/csv;charset=utf-8,"
        + "Employee Name,Contract Type,Start Date,End Date,Status,Created At\n"
        + contracts.map(c =>
          `${c.employeeName},${c.contractType},${c.startDate},${c.endDate},${c.status},${c.createdAt}`
        ).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `contracts_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.dismiss();
      toast.success('Exported successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error exporting contracts:', error);
      toast.dismiss();
      toast.error('Cannot export contracts');
      return { success: false };
    }
  }, [contracts]);

  return {
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
  };
};