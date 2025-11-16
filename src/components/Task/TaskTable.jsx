import React from 'react';
import { Paper, IconButton, Tooltip, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = (handleEdit, handleDelete) => [
  { field: 'id', headerName: 'ID', width: 80, type: 'number', headerAlign: 'center', align: 'center' },
  { field: 'title', headerName: 'Title', width: 200 },
  {
    field: 'assignees',
    headerName: 'Assignees',
    width: 200,
    renderCell: (params) => (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {params.value?.map((assignee, index) => (
          <Chip key={index} label={assignee} size="small" />
        ))}
      </div>
    ),
  },
  { field: 'start', headerName: 'Start Date', width: 160 },
  { field: 'end', headerName: 'End Date', width: 160 },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        sx={{
          backgroundColor:
            params.value === 'completed'
              ? '#d1fae5'
              : params.value === 'in-progress'
              ? '#dbeafe'
              : '#fee2e2',
          color:
            params.value === 'completed'
              ? '#065f46'
              : params.value === 'in-progress'
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
    width: 120,
    sortable: false,
    renderCell: (params) => (
      <div className="flex items-center gap-1">
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => handleEdit(params.row)} sx={{ color: '#3b82f6', '&:hover': { backgroundColor: '#eff6ff' } }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => handleDelete(params.row)} sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fee2e2' } }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    ),
  },
];

export default function TaskTable({ rows, onEdit, onDelete }) {
  return (
    <Paper sx={{ height: 600, width: '100%', mt: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns(onEdit, onDelete)}
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
