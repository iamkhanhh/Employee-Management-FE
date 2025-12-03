import React from 'react';
import { Paper, Chip, Select, MenuItem, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const columns = (handleStatusChange) => [
  { field: 'id', headerName: 'ID', width: 80, type: 'number', headerAlign: 'center', align: 'center' },
  { field: 'title', headerName: 'Title', width: 250 },
  { field: 'description', headerName: 'Description', width: 300 },
  { field: 'createdAt', headerName: 'Start Date', width: 160 },
  { field: 'dueDate', headerName: 'End Date', width: 160 },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        sx={{
          backgroundColor:
            params.value === 'COMPLETED'
              ? '#d1fae5'
              : params.value === 'IN_PROGRESS'
              ? '#dbeafe'
              : '#fee2e2',
          color:
            params.value === 'COMPLETED'
              ? '#065f46'
              : params.value === 'IN_PROGRESS'
              ? '#1e40af'
              : '#991b1b',
          fontWeight: 500,
        }}
      />
    ),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <FormControl size="small" fullWidth>
        <Select
          value={params.row.status}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
        </Select>
      </FormControl>
    ),
  },
];

export default function MyTaskTable({ tasks, onStatusChange }) {
  return (
    <Paper sx={{ height: 600, width: '100%', mt: 2 }}>
      <DataGrid
        rows={tasks}
        columns={columns(onStatusChange)}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[10, 25, 50]}
        sx={{
          border: 0,
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          },
        }}
      />
    </Paper>
  );
}
