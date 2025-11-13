import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Box, Grid, Paper, Typography, Button, Divider, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { mockEmployees } from '../../data/mockData';

const STORAGE_KEY = 'my_attendance_records_v1';
const WORK_DAY_HOURS = 8;

function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
function saveRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {}
}

export default function MyAttendance() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const userName = user?.full_name || user?.name || mockEmployees.find(e => e.id === userId)?.full_name || 'You';

  const [records, setRecords] = useState(() => loadRecords());
  const [todayRecord, setTodayRecord] = useState(null);

  useEffect(() => {
    // compute today's record for current user
    if (!userId) return;
    const today = moment().format('YYYY-MM-DD');
    const rec = records.find(r => r.employeeId === userId && r.date === today);
    setTodayRecord(rec || null);
  }, [records, userId]);

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  const addOrUpdateRecord = (payload) => {
    setRecords(prev => {
      const idx = prev.findIndex(r => r.id === payload.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = payload;
        return copy;
      }
      return [payload, ...prev];
    });
  };

  const handleCheckIn = () => {
    if (!userId) return alert('Không có user');
    const now = moment();
    const date = now.format('YYYY-MM-DD');
    const time = now.format('HH:mm:ss');

    // find existing
    let rec = records.find(r => r.employeeId === userId && r.date === date);
    if (rec) {
      if (rec.timeIn) return alert('Bạn đã check-in hôm nay');
      rec = { ...rec, timeIn: time, type: rec.type || 'work' };
    } else {
      rec = {
        id: Date.now(),
        employeeId: userId,
        date,
        timeIn: time,
        timeOut: null,
        type: 'work',
        note: '',
        hours: 0,
        overtime: 0,
      };
    }
    // no hours until checkout
    addOrUpdateRecord(rec);
  };

  const handleCheckOut = () => {
    if (!userId) return alert('Không có user');
    const now = moment();
    const date = now.format('YYYY-MM-DD');
    const time = now.format('HH:mm:ss');

    const rec = records.find(r => r.employeeId === userId && r.date === date);
    if (!rec || !rec.timeIn) return alert('Bạn chưa check-in hôm nay');
    if (rec.timeOut) return alert('Bạn đã check-out rồi');

    const start = moment(`${rec.date} ${rec.timeIn}`, 'YYYY-MM-DD HH:mm:ss');
    const end = now;
    const diffHours = moment.duration(end.diff(start)).asHours();
    const roundedHours = Math.round(diffHours * 100) / 100; // two decimals
    const overtime = Math.max(0, roundedHours - WORK_DAY_HOURS);

    const updated = { ...rec, timeOut: time, hours: roundedHours, overtime };
    addOrUpdateRecord(updated);
  };

  // Summary for current user
  const userRecords = records.filter(r => r.employeeId === userId);
  const daysWorked = userRecords.filter(r => r.timeIn && r.timeOut && (r.type || 'work') === 'work').length;
  const totalHours = userRecords.reduce((s, r) => s + (r.hours || 0), 0);
  const totalOvertime = userRecords.reduce((s, r) => s + (r.overtime || 0), 0);
  const leaveCount = userRecords.filter(r => r.type === 'leave').length;
  const remoteCount = userRecords.filter(r => r.type === 'remote').length;
  const businessCount = userRecords.filter(r => r.type === 'business').length;
  const holidayCount = userRecords.filter(r => r.type === 'holiday').length;

  const lastRecords = userRecords.slice(0, 10);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5">Bảng công — {userName}</Typography>
          <Typography variant="body2" color="text.secondary">Tổng quan chấm công</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" color="primary" onClick={handleCheckIn} disabled={todayRecord && todayRecord.timeIn}>Check In</Button>
          <Button variant="contained" color="secondary" onClick={handleCheckOut} disabled={!todayRecord || !todayRecord.timeIn || todayRecord.timeOut}>Check Out</Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">{daysWorked}</Typography>
            <Typography variant="caption">Số ngày làm</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">{totalHours}</Typography>
            <Typography variant="caption">Tổng số giờ</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">{totalOvertime}</Typography>
            <Typography variant="caption">Tổng giờ tăng ca</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">{leaveCount}</Typography>
            <Typography variant="caption">Số buổi nghỉ phép</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">{remoteCount}</Typography>
            <Typography variant="caption">Số buổi làm việc tại nhà</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">{businessCount}</Typography>
            <Typography variant="caption">Số buổi công tác</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">{holidayCount}</Typography>
            <Typography variant="caption">Số buổi nghỉ lễ</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ mb: 1 }}>Lịch sử gần đây</Typography>
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Giờ vào</TableCell>
              <TableCell>Giờ ra</TableCell>
              <TableCell>Giờ công</TableCell>
              <TableCell>OT</TableCell>
              <TableCell>Loại</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lastRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Không có dữ liệu</TableCell>
              </TableRow>
            ) : (
              lastRecords.map(r => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.timeIn || '-'}</TableCell>
                  <TableCell>{r.timeOut || '-'}</TableCell>
                  <TableCell>{r.hours || '-'}</TableCell>
                  <TableCell>{r.overtime || '-'}</TableCell>
                  <TableCell>{r.type || 'work'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
