import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

export default function EditPayrollDialog({
  open,
  onClose,
  onSave,
  payroll,
}) {
  const [bonus, setBonus] = useState('');
  const [penalty, setPenalty] = useState('');

  useEffect(() => {
    if (payroll) {
      setBonus(payroll.bonus || '');
      setPenalty(payroll.deduction || '');
    }
  }, [payroll]);

  const handleSave = () => {
    onSave(payroll.id, { bonus, penalty });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Payroll</DialogTitle>
      <DialogContent>
        <TextField
          label="Bonus"
          type="number"
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Penalty"
          type="number"
          value={penalty}
          onChange={(e) => setPenalty(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Recalculate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
