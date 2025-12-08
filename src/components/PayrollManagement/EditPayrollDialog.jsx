import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import toast from "react-hot-toast";
import { payrollService } from "../../services/payrollService";

export default function EditPayrollDialog({
  open,
  onClose,
  payroll,
  onSuccess, // callback để reload dữ liệu sau khi Save
}) {
  const [allowance, setAllowance] = useState('');
  const [bonus, setBonus] = useState('');
  const [deduction, setDeduction] = useState('');

  useEffect(() => {
    if (payroll) {
      setAllowance(payroll.allowance || '');
      setBonus(payroll.bonus || '');
      setDeduction(payroll.deduction || '');
    }
  }, [payroll]);

  const handleSave = async () => {
    if (!payroll?.employeeId) {
      console.error("Missing employeeId");
      return;
    }

    const payload = {
      empId: payroll.employeeId,
      allowance: Number(allowance) || 0,
      bonus: Number(bonus) || 0,
      deduction: Number(deduction) || 0,
    };

    const loadingToast = toast.loading("Saving payroll...");

    try {
      await payrollService.createSinglePayroll(payload);

      toast.dismiss(loadingToast);
      toast.success("Payroll updated!");

      onClose();   // đóng dialog
      onSuccess(); // reload payroll list
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Payroll</DialogTitle>
      <DialogContent>
        <TextField
          label="Allowance"
          type="number"
          value={allowance}
          onChange={(e) => setAllowance(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Bonus"
          type="number"
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Deduction"
          type="number"
          value={deduction}
          onChange={(e) => setDeduction(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
