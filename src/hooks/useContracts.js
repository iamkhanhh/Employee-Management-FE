// src/hooks/useContracts.js
import { useState, useCallback } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
  const fetchContracts = useCallback(async ({ page = 0, pageSize = 10, status, contractType, empId, startDate, endDate, search }) => {
    setLoading(true);

    try {
      const params = {
        page,
        pageSize,
      };

      if (contractType && contractType !== 'all') {
        params.contractType = contractType;
      }

      if (status && status !== 'all') {
        params.status = status;
      }

      if (startDate) {
        params.startDate = startDate;
      }

      if (endDate) {
        params.endDate = endDate;
      }

      if (empId) {
        params.empId = empId;
      }

      if (search) {
        params.keyword = search;
      }

      const res = await axiosInstance.get("/contracts", { params });

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
  // GENERATE PRESIGNED URL
  // ============================================
  const generatePresignedUrl = useCallback(async (fileName, userId, folderType = 'CONTRACTS') => {
    try {
      const payload = {
        fileName,
        userId,
        folderType
      };

      console.log('📤 Generating presigned URL:', payload);

      const res = await axiosInstance.post('/generate-presigned-url', payload);
   
      if (res.data?.code === 200 && res.data?.data) {
        console.log('✅ Presigned URL generated:', res.data.data);
        return {
          success: true,
          data: res.data.data // { presignedUrl, objectKey, contentType }
        };
      } else {
        throw new Error(res.data?.message || 'Failed to generate presigned URL');
      }
    } catch (error) {
      console.error('❌ Error generating presigned URL:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }, []);

  // ============================================
  // UPLOAD FILE TO S3
  // ============================================
  const uploadFileToS3 = useCallback(async (presignedUrl, file, contentType) => {
    try {
      console.log('📤 Uploading file to S3...', { presignedUrl, contentType });

      // Upload trực tiếp lên S3 bằng fetch (không dùng axios để tránh interceptor)
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': contentType || file.type || 'application/pdf'
        }
      });

      if (response.ok) {
        console.log('✅ File uploaded to S3 successfully');
        return { success: true };
      } else {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error uploading to S3:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }, []);

  // ============================================
  // UPLOAD CONTRACT FILE (COMPLETE FLOW)
  // ============================================
  const uploadContractFile = useCallback(async (file, userId) => {
    setUploading(true);

    try {
      // Step 1: Generate presigned URL
      const presignedResult = await generatePresignedUrl(file.name, userId, 'CONTRACTS');

      if (!presignedResult.success) {
        throw new Error(presignedResult.error || 'Failed to generate upload URL');
      }

      const { presignedUrl, objectKey, contentType } = presignedResult.data;

      // Step 2: Upload file to S3
      const uploadResult = await uploadFileToS3(presignedUrl, file, contentType);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Failed to upload file');
      }

      console.log('✅ Contract file uploaded successfully, objectKey:', objectKey);

      return {
        success: true,
        data: {
          objectKey,
          fileName: file.name
        }
      };
    } catch (error) {
      console.error('❌ Error in upload flow:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setUploading(false);
    }
  }, [generatePresignedUrl, uploadFileToS3]);

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
        fileUrl: contractData.fileUrl ?? null,
        status: contractData.status
      };

      console.log('📤 Creating contract with payload:', payload);

      const res = await axiosInstance.post('/contracts', payload);

      if (res.data?.code === 0) {
        toast.success('Contract created successfully!');
        return { success: true, data: res.data.data };
      } else {
        throw new Error(res.data?.message || 'Failed to create contract');
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error(error.response?.data?.message || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // CREATE CONTRACT WITH FILE UPLOAD
  // ============================================
  const createContractWithFile = useCallback(async (contractData, file) => {
    setLoading(true);

    try {
      let fileUrl = null;

      // Step 1: Upload file if exists
      if (file) {
        toast.loading('Uploading contract file...');

        const uploadResult = await uploadContractFile(file, contractData.empId);

        toast.dismiss();

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload file');
        }

        fileUrl = uploadResult.data.objectKey;
        console.log('📎 File URL:', fileUrl);
      }

      // Step 2: Create contract with fileUrl
      const result = await createContract({
        ...contractData,
        fileUrl
      });

      return result;
    } catch (error) {
      console.error('Error creating contract with file:', error);
      toast.dismiss();
      toast.error(error.message);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  }, [uploadContractFile, createContract]);

  // ============================================
  // UPDATE CONTRACT
  // ============================================
  const updateContract = useCallback(async (id, updates) => {
    setLoading(true);

    try {
      const formatDateToArray = (dateStr) => {
        if (!dateStr) return null;
        if (Array.isArray(dateStr)) return dateStr;
        const [year, month, day] = dateStr.split('-').map(Number);
        return [year, month, day];
      };

      const payload = {
        empId: contractData.empId,
        contractType: contractData.contractType,
        startDate: formatDateToArray(contractData.startDate),
        endDate: formatDateToArray(contractData.endDate),

        // MUST BE OBJECT KEY
        fileUrl: contractData.fileUrl && typeof contractData.fileUrl === "string"
          ? contractData.fileUrl
          : null,

        status: contractData.status
      };


      console.log('📤 Updating contract with payload:', payload);

      const res = await axiosInstance.put(`/contracts/${id}`, payload);

      if (res.data?.code === 0) {
        toast.success('Contract updated successfully!');
        return { success: true, data: res.data.data };
      } else {
        throw new Error(res.data?.message || 'Failed to update contract');
      }
    } catch (error) {
      console.error('Error updating contract:', error);
      toast.error(error.response?.data?.message || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // UPDATE CONTRACT WITH FILE
  // ============================================
  const updateContractWithFile = useCallback(async (id, contractData, file, userId) => {
    setLoading(true);

    try {
      let fileUrl = contractData.fileUrl;

      // Upload new file if exists
      if (file) {
        toast.loading('Uploading new contract file...');

        const uploadResult = await uploadContractFile(file, userId);

        toast.dismiss();

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload file');
        }

        fileUrl = uploadResult.data.objectKey;
      }

      // Update contract
      const result = await updateContract(id, {
        ...contractData,
        fileUrl
      });

      return result;
    } catch (error) {
      console.error('Error updating contract with file:', error);
      toast.dismiss();
      toast.error(error.message);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  }, [uploadContractFile, updateContract]);

  // ============================================
  // DELETE CONTRACT
  // ============================================
  const deleteContract = useCallback(async (id) => {
    setLoading(true);

    try {
      const res = await axiosInstance.delete(`/contracts/${id}`);

      if (res.data?.code === 0) {
        toast.success('Contract deleted successfully!');
        return { success: true };
      } else {
        throw new Error(res.data?.message || 'Failed to delete contract');
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error(error.response?.data?.message || error.message);
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
      const res = await axiosInstance.delete("/contracts/batch", {
        data: { ids }
      });

      if (res.data?.code === 0) {
        toast.success(`Deleted ${ids.length} contracts successfully!`);
        return { success: true };
      } else {
        throw new Error(res.data?.message || 'Failed to delete contracts');
      }
    } catch (error) {
      console.error('Error deleting contracts:', error);
      toast.error(error.response?.data?.message || error.message);
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
  const downloadFile = useCallback(async (fileUrl) => {
    try {
      if (!fileUrl) {
        toast.error('File URL not found');
        return { success: false };
      }

      const link = document.createElement('a');
      link.href = fileUrl;
      link.download =  fileUrl.split('/').pop();
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
    uploading,
    fetchContracts,
    fetchContractDetail,
    createContract,
    createContractWithFile,
    updateContract,
    updateContractWithFile,
    deleteContract,
    deleteMultipleContracts,
    downloadFile,
    uploadContractFile,
    generatePresignedUrl,
    exportContracts
  };
};