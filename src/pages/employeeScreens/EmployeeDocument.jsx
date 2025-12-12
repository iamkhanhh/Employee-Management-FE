// src/pages/employeeScreens/EmployeeDocument.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useEmployeeDocs } from "../../hooks/useEmployeeDocs";
import EmployeeDocumentTable from "../../components/EmployeeDocument/EmployeeDocumentTable";
import EmployeeDocumentFilters from "../../components/EmployeeDocument/EmployeeDocumentFilters";
import {
  AddEditDocumentDialog,
  DeleteDocumentDialog,
  ViewDocumentDialog,
} from "../../components/EmployeeDocument/EmployeeDocumentDialogs";

const EmployeeDocument = () => {
  const {
    documents,
    pagination,
    loading,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    downloadFile,
  } = useEmployeeDocs();

  const [filters, setFilters] = useState({
    page: 0,
    pageSize: 10,
    employeeId: "",
    docType: "",
  });
  const [dialogState, setDialogState] = useState({
    addEdit: false,
    delete: false,
    view: false,
  });
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchDocuments(filters);
  }, [fetchDocuments, filters]);

  const handleOpenDialog = (dialog, doc = null) => {
    setSelectedDocument(doc);
    setDialogState((prev) => ({ ...prev, [dialog]: true }));
  };

  const handleCloseDialogs = () => {
    setDialogState({ addEdit: false, delete: false, view: false });
    setSelectedDocument(null);
  };

  // const handleConfirm = async (formData, docId) => {
  //   const result = docId
  //     ? await updateDocument(docId, formData)
  //     : await createDocument(formData);

  //   if (result.success) {
  //     handleCloseDialogs();
  //   }
  // };

  const handleDeleteConfirm = async () => {
    if (selectedDocument?.id) {
      const result = await deleteDocument(selectedDocument.id);
      if (result.success) {
        handleCloseDialogs();
      }
    }
  };
  const handleDownload = (fileUrl) => {
    downloadFile(fileUrl);
  };
  
  
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setFilters((prev) => ({ ...prev, pageSize: newPageSize, page: 0 }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ borderRadius: "16px", border: "1px solid #e5e7eb", p: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
          Employee Documents
        </Typography>
        
        <EmployeeDocumentFilters
          filters={filters}
          onFilterChange={setFilters}
          onAdd={() => handleOpenDialog("addEdit", null)}
        />

        {loading && documents.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <EmployeeDocumentTable
            documents={documents}
            onEdit={(doc) => handleOpenDialog("addEdit", doc)}
            onDelete={(doc) => handleOpenDialog("delete", doc)}
            onView={(doc) => handleOpenDialog("view", doc)}
            onDownload={handleDownload}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </Paper>

      {/* Render Dialogs */}
      <AddEditDocumentDialog
        open={dialogState.addEdit}
        onClose={handleCloseDialogs}
        document={selectedDocument}
      />
      <DeleteDocumentDialog
        open={dialogState.delete}
        onClose={handleCloseDialogs}
        onConfirm={handleDeleteConfirm}
        document={selectedDocument}
      />
      <ViewDocumentDialog
        open={dialogState.view}
        onClose={handleCloseDialogs}
        document={selectedDocument}
      />
    </Box>
  );
};

export default EmployeeDocument;

