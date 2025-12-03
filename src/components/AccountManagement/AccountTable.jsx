import React from 'react';
import { Paper, IconButton, Tooltip, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const columns = (handleEdit, handleDelete, handleToggleLock, handleResetPassword) => [
  { field: 'id', headerName: 'ID', width: 80, type: 'number', headerAlign: 'center', align: 'center' },
  { field: 'username', headerName: 'Username', width: 150 },
  { field: 'email', headerName: 'Email', width: 220 },
  {
    field: 'role',
    headerName: 'Role',
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        sx={{
          backgroundColor: params.value === 'Admin' ? '#fee2e2' : '#dbeafe',
          color: params.value === 'Admin' ? '#991b1b' : '#1e40af',
          fontWeight: 600,
        }}
      />
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 140,
    renderCell: (params) => {
      let label = '';
      let bgColor = '';
      let color = '';

      switch (params.value) {
        case 'ACTIVE':
          label = 'Active';
          bgColor = '#d1fae5';
          color = '#065f46';
          break;
        case 'DELETED':
          label = 'Deleted';
          bgColor = '#f3f4f6';
          color = '#374151';
          break;
        case 'DISABLED':
          label = 'Disabled';
          bgColor = '#fee2e2';
          color = '#991b1b';
          break;
        case 'PENDING':
          label = 'Pending';
          bgColor = '#fef9c3';
          color = '#78350f';
          break;
        default:
          label = params.value || 'Unknown';
          bgColor = '#e5e7eb';
          color = '#111827';
      }

      return (
        <Chip
          label={label}
          size="small"
          sx={{
            backgroundColor: bgColor,
            color: color,
            fontWeight: 500,
          }}
        />
      );
    },
  },
  { field: 'createdAt', headerName: 'Created At', width: 160 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 280,
    sortable: false,
    renderCell: (params) => (
      <div className="flex items-center gap-1">
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => handleEdit(params.row)} sx={{ color: '#3b82f6', '&:hover': { backgroundColor: '#eff6ff' } }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset Password">
          <IconButton size="small" onClick={() => handleResetPassword(params.row)} sx={{ color: '#6366f1', '&:hover': { backgroundColor: '#eef2ff' } }}>
            <VpnKeyIcon fontSize="small" />
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

export default function AccountTable({ rows, onEdit, onDelete, onToggleLock, onResetPassword }) {
  return (
    <Paper sx={{ height: 440, width: '100%', mt: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns(onEdit, onDelete, onToggleLock, onResetPassword)}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[5, 10, 25]}
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
