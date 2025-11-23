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
  paginationMode = "server"
}) {
  // Đảm bảo rows là array và mỗi row có id hợp lệ
  const safeRows = Array.isArray(rows) ? rows.filter(row => row && row.id != null) : [];
  const safePaginationModel = paginationModel || { page: 0, pageSize: 10 };

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
        onRowClick={onRowClick}
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

