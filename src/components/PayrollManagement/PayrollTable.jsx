import React from 'react';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function PayrollTable({ 
  rows = [], 
  columns, 
  onRowClick, 
  loading = false,
  rowCount = 0,
  paginationModel,
  onPaginationModelChange,
  paginationMode = "server",
  bonusPenalty,
  setBonusPenalty
}) {
  // Đảm bảo rows là array và mỗi row có id hợp lệ
  const safeRows = Array.isArray(rows) ? rows.filter(row => row && row.id != null) : [];
  const safePaginationModel = paginationModel || { page: 0, pageSize: 10 };

  const handleRowClick = (params, event) => {
    // Prevent row click when interacting with input fields
    if (event.target.closest('input')) {
      return;
    }
    if (onRowClick) {
      onRowClick(params);
    }
  };

  return (
    <Paper sx={{ height: 440, width: '100%', mt: 2 }}>
      <DataGrid
        rows={safeRows}
        columns={columns || []}
        loading={loading}
        rowCount={rowCount || 0}
        paginationModel={safePaginationModel}
        onPaginationModelChange={onPaginationModelChange}
        paginationMode={paginationMode}
        pageSizeOptions={[5, 10, 25, 50]}
        onRowClick={handleRowClick}
        getRowId={(row) => row.id}
        sx={{
          border: 0,
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          },
        }}
      />
    </Paper>
  );
}

