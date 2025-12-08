import React from 'react';
import {
  Paper,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PendingIcon from '@mui/icons-material/Schedule';
import AutorenewIcon from '@mui/icons-material/Autorenew';

// 🎨 Status UI
const getStatusStyle = (status) => {
  switch (status) {
    case 'PENDING':
      return { bg: '#fef9c3', color: '#854d0e' };
    case 'IN_PROGRESS':
      return { bg: '#dbeafe', color: '#1e40af' };
    case 'COMPLETED':
      return { bg: '#d1fae5', color: '#065f46' };
    case 'CANCELLED':
      return { bg: '#fee2e2', color: '#991b1b' };
    default:
      return { bg: '#f3f4f6', color: '#374151' };
  }
};

// 🎯 Columns config
const columns = (handleStatusChange, handleViewDetail) => [
  {
    field: 'id',
    headerName: 'ID',
    width: 70,
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'title',
    headerName: 'Title',
    flex: 1,
    minWidth: 180,
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1.2,
    minWidth: 220,
  },
  {
    field: 'createdAt',
    headerName: 'Start Date',
    width: 140,
  },
  {
    field: 'dueDate',
    headerName: 'End Date',
    width: 140,
  },

  // STATUS CHIP
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => {
      const { bg, color } = getStatusStyle(params.value);
      return (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: bg,
            color,
            fontWeight: 500,
          }}
        />
      );
    },
  },

  // ACTION ICONS
  {
    field: 'actions',
    headerName: 'Actions',
    width: 220,
    sortable: false,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <div style={{ display: 'flex', gap: 6 }}>

        {/* PENDING */}
        <Tooltip title="Mark as Pending">
          <IconButton
            size="small"
            color="warning"
            onClick={() => handleStatusChange(params.row.id, 'PENDING')}
          >
            <PendingIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* IN PROGRESS */}
        <Tooltip title="Mark as In Progress">
          <IconButton
            size="small"
            color="info"
            onClick={() => handleStatusChange(params.row.id, 'IN_PROGRESS')}
          >
            <AutorenewIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* COMPLETED */}
        <Tooltip title="Mark as Completed">
          <IconButton
            size="small"
            color="success"
            onClick={() => handleStatusChange(params.row.id, 'COMPLETED')}
          >
            <CheckCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* CANCELLED */}
        <Tooltip title="Mark as Cancelled">
          <IconButton
            size="small"
            color="error"
            onClick={() => handleStatusChange(params.row.id, 'CANCELLED')}
          >
            <CancelIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* VIEW DETAIL */}
        <Tooltip title="View Detail">
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleViewDetail(params.row.id)}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    ),
  },
];

export default function MyTaskTable({ tasks, onStatusChange, onViewDetail }) {
  return (
    <Paper sx={{ height: 600, width: '100%', mt: 2 }}>
      <DataGrid
        rows={tasks}
        columns={columns(onStatusChange, onViewDetail)}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
        sx={{
          border: 0,
          '& .MuiDataGrid-cell': {
            whiteSpace: 'normal !important',
            lineHeight: '1.4 !important',
            display: 'block',
            paddingTop: '8px',
            paddingBottom: '8px',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
        }}
      />
    </Paper>
  );
}
