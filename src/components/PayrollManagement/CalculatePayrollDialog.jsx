import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

export default function CalculatePayrollDialog({
  open,
  onClose,
  employees,
  onCalculate,
  bonusPenalty,
  setBonusPenalty,
  onRecalculate,
  isRecalculate = false,
}) {

  const handleBonusChange = (employeeId, value) => {
    setBonusPenalty((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        bonus: value,
      },
    }));
  };

  const handlePenaltyChange = (employeeId, value) => {
    setBonusPenalty((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        penalty: value,
      },
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Calculate Payroll</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Bonus</TableCell>
                <TableCell>Penalty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.fullName}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={bonusPenalty[employee.id]?.bonus || ''}
                      onChange={(e) => handleBonusChange(employee.id, e.target.value)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={bonusPenalty[employee.id]?.penalty || ''}
                      onChange={(e) => handlePenaltyChange(employee.id, e.target.value)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {isRecalculate ? (
          <Button onClick={onRecalculate} variant="contained">
            Recalculate
          </Button>
        ) : (
          <Button onClick={onCalculate} variant="contained">
            Calculate
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
