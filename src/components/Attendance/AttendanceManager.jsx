import React, { useState, useEffect } from 'react';
import AttendanceTable from './AttendanceTable';
import AttendanceForm from './AttendanceForm';
import { mockEmployees } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function AttendanceManager() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.isAdmin;
  const currentUserId = user?.id ?? null;

  // seed employees list (map to id/name)
  const employees = (mockEmployees || []).map(e => ({ id: e.id, name: e.full_name || e.user?.full_name || e.user?.username || `User ${e.id}` }));

  // attendance records: { id, employeeId, date, timeIn, timeOut, overtimeHours, note }
  const [records, setRecords] = useState(() => {
    // sample seed
    return [
      { id: 1, employeeId: employees[0]?.id ?? 1, date: new Date().toISOString().slice(0,10), timeIn: '08:30', timeOut: '17:30', overtimeHours: 0, note: '' },
    ];
  });

  // This page is the global attendance management view for all employees in development
  const [filterEmployeeId, setFilterEmployeeId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleOpenNew = () => {
    setEditing(null);
    setOpenForm(true);
  };
  const handleCloseForm = () => setOpenForm(false);

  const handleSave = (payload) => {
    if (payload.id) {
      setRecords(prev => prev.map(r => r.id === payload.id ? payload : r));
    } else {
      payload.id = Date.now();
      setRecords(prev => [payload, ...prev]);
    }
    setOpenForm(false);
  };

  const handleEdit = (id) => {
    const r = records.find(x => x.id === id);
    if (r) {
      setEditing(r);
      setOpenForm(true);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Xóa bản ghi chấm công này?')) return;
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const filtered = records.filter(r => (filterEmployeeId ? r.employeeId === filterEmployeeId : true));

  return (
    <Box>
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Quản lý chấm công</Typography>
          <Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenNew}>New Record</Button>
          </Box>
        </Box>

        <AttendanceTable
          records={filtered}
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isAdmin={true}
          onFilterEmployee={(id) => setFilterEmployeeId(id)}
          filterEmployeeId={filterEmployeeId}
        />
      </>

      <AttendanceForm
        open={openForm}
        onClose={handleCloseForm}
        employees={employees}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
        initialData={editing}
        onSave={(data) => handleSave(data)}
      />
    </Box>
  );
}
