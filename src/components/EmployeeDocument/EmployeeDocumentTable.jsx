// src/components/EmployeeDocument/EmployeeDocumentTable.jsx
import React from "react";
import { Box, IconButton, Tooltip, Paper, Chip, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CloudDownload as CloudDownloadIcon,
} from "@mui/icons-material";
import { DOCUMENT_TYPES } from "../../constants";

const EmployeeDocumentTable = ({
  documents,
  onEdit,
  onDelete,
  onView,
  onDownload,
  loading,
  pagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const columns = [
    { 
      field: "id",
      headerName: "ID",
      width: 70 
    },
    {
      field: "employeeName",
      headerName: "Employee Name",
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: "docType",
      headerName: "Document Type",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Chip label={DOCUMENT_TYPES[params.value] || params.value} size="small" />
      ),
    },
    {
      field: "fileName",
      headerName: "Attachment",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          startIcon={<CloudDownloadIcon />}
          onClick={() => onDownload(params.row.fileUrl)}
          disabled={!params.row.fileUrl}
          size="small"
        >
          Download
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="View Details">
            <IconButton onClick={() => onView(params.row)} size="small">
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Document">
            <IconButton onClick={() => onEdit(params.row)} size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Document">
            <IconButton onClick={() => onDelete(params.row)} size="small" color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Paper sx={{ height: 600, width: "100%", mt: 2 }}>
      <DataGrid
        rows={documents}
        columns={columns}
        loading={loading}
        paginationMode="server"
        rowCount={pagination.totalElements || 0}
        pageSize={pagination.pageSize || 10}
        page={pagination.page || 0}
        onPageChange={onPageChange}
        onRowsPerPageChange={(newPageSize) => onPageSizeChange(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        getRowId={(row) => row.id}
        sx={{
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
        }}
      />
    </Paper>
  );
};

export default EmployeeDocumentTable;
