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
    field: 'full_name',
    headerName: 'Full Name',
    width: 180,
    renderCell: (params) => (
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          {params.row.full_name?.charAt(0)?.toUpperCase?.()}
        </span>
        <div className="text-gray-900 font-medium">{params.row.full_name}</div>
      </div>
    ),
  },
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
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value === 'active' ? 'Active' : 'Locked'}
        size="small"
        sx={{
          backgroundColor: params.value === 'active' ? '#d1fae5' : '#fee2e2',
          color: params.value === 'active' ? '#065f46' : '#991b1b',
          fontWeight: 500,
        }}
      />
    ),
  },
  { field: 'created_at', headerName: 'Created At', width: 160 },
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
        <Tooltip title={params.row.status === 'active' ? 'Lock' : 'Unlock'}>
          <IconButton size="small" onClick={() => handleToggleLock(params.row)} sx={{ color: params.row.status === 'active' ? '#f59e0b' : '#10b981', '&:hover': { backgroundColor: params.row.status === 'active' ? '#fef3c7' : '#d1fae5' } }}>
            {params.row.status === 'active' ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
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
