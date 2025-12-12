// src/hooks/useEmployeeDocs.js
import { useState, useCallback } from 'react';
import employeedocService from '../services/employeedocService';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useEmployeeDocs = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  });

  // =====================================================
  // FETCH DOCUMENTS
  // =====================================================
  const fetchDocuments = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = {
        page: filters.page ?? 0,
        limit: filters.pageSize ?? 10,
        empId: filters.employeeId || null,
        docType: filters.docType === 'all' ? null : filters.docType,
      };

      const res = await employeedocService.getAllDocuments(params);

      if (res.data?.code === 0 && res.data?.data) {
        const { content, currentPage, pageSize, totalElements, totalPages } = res.data.data;

        setDocuments(content || []);
        setPagination({
          page: currentPage,
          pageSize,
          totalElements,
          totalPages,
        });
      } else {
        throw new Error(res.data?.message || 'Failed to fetch documents');
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
      toast.error(err.response?.data?.message || "Cannot load documents");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // GENERATE PRESIGNED URL
  // =====================================================
  const generatePresignedUrl = useCallback(async (fileName, userId, folderType = 'DOCUMENTS') => {
    try {
      const payload = {
        fileName,
        userId,
        folderType,
      };

      console.log('📤 Generating presigned URL:', payload);

      const res = await axiosInstance.post('/generate-presigned-url', payload);

      if (res.data?.code === 200 && res.data?.data) {
        return {
          success: true,
          data: res.data.data, // { presignedUrl, objectKey, contentType }
        };
      } else {
        throw new Error(res.data?.message || 'Failed to generate presigned URL');
      }
    } catch (error) {
      console.error("❌ Error generating presigned URL:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }, []);

  // =====================================================
  // UPLOAD FILE TO S3
  // =====================================================
  const uploadFileToS3 = useCallback(async (presignedUrl, file, contentType) => {
    try {
      console.log("📤 Uploading to S3...");

      const res = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType || file.type || "application/octet-stream",
        },
      });

      if (res.ok) {
        console.log("✅ File uploaded to S3");
        return { success: true };
      } else {
        throw new Error(`Upload failed with status ${res.status}`);
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      return { success: false, error: error.message };
    }
  }, []);

  // =====================================================
  // UPLOAD DOCUMENT FILE (FULL FLOW)
  // =====================================================
  const uploadDocumentFile = useCallback(async (file, userId) => {
    setUploading(true);
    try {
      // Step 1: Gen presigned URL
      const presign = await generatePresignedUrl(file.name, userId, "DOCUMENTS");

      if (!presign.success) throw new Error(presign.error);

      const { presignedUrl, objectKey, contentType } = presign.data;

      // Step 2: Upload S3
      const upload = await uploadFileToS3(presignedUrl, file, contentType);

      if (!upload.success) throw new Error(upload.error);

      return {
        success: true,
        data: {
          objectKey,
          fileName: file.name,
        },
      };
    } catch (err) {
      console.error("❌ Upload flow error:", err);
      return { success: false, error: err.message };
    } finally {
      setUploading(false);
    }
  }, [generatePresignedUrl, uploadFileToS3]);

  // =====================================================
  // CREATE DOCUMENT
  // =====================================================
  const createDocument = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await employeedocService.createDocument(data);

      if (res.data?.code === 0) {
        toast.success("Document created successfully!");
        fetchDocuments({ page: pagination.page, pageSize: pagination.pageSize });
        return { success: true };
      } else {
        throw new Error(res.data?.message || "Failed to create document");
      }
    } catch (err) {
      console.error("Create error:", err);
      toast.error(err.response?.data?.message || err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [fetchDocuments, pagination]);

  // =====================================================
  // UPDATE DOCUMENT
  // =====================================================
  const updateDocument = useCallback(async (id, data) => {
    setLoading(true);
    try {
      const res = await employeedocService.updateDocument(id, data);

      if (res.data?.code === 0) {
        toast.success("Document updated successfully!");
        fetchDocuments({ page: pagination.page, pageSize: pagination.pageSize });
        return { success: true };
      } else {
        throw new Error(res.data?.message || "Failed to update document");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [fetchDocuments, pagination]);

  // =====================================================
  // DELETE DOCUMENT
  // =====================================================
  const deleteDocument = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await employeedocService.deleteDocument(id);

      if (res.data?.code === 0) {
        toast.success("Document deleted!");
        fetchDocuments({ page: pagination.page, pageSize: pagination.pageSize });
        return { success: true };
      } else {
        throw new Error(res.data?.message || "Failed to delete document");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [fetchDocuments, pagination]);

  // =====================================================
  // DOWNLOAD DOCUMENT
  // =====================================================
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

  return {
    documents,
    pagination,
    loading,
    uploading,

    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    downloadFile,

    uploadDocumentFile,
  };
};
