import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Alert,
  Box,
  Avatar,
  Divider,
  Paper,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const DeleteDepartmentDialog = ({
  open,
  onClose,
  onConfirm,
  departmentName,
  department
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const canDelete = confirmText === 'DELETE';

  const handleConfirm = async () => {
    if (!canDelete) return;

    setIsDeleting(true);
    setError('');

    try {
      const result = await onConfirm();
      
      if (result.success) {
        handleClose();
      } else {
        // Hiển thị error từ API
        setError(result.error || 'Failed to delete department');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      setError('');
      onClose();
    }
  };

  if (!department) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          backgroundColor: '#f44336',
          color: 'white',
          pb: 2
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <WarningIcon fontSize="large" />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Delete Department
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              This action cannot be undone
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={3}>
          {/* Department Info */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 2
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: '#f44336',
                  width: 56,
                  height: 56
                }}
              >
                <BusinessIcon fontSize="large" />
              </Avatar>
              <Box flex={1}>
                <Typography variant="h6" fontWeight={600}>
                  {departmentName}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    ID: {department.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarIcon fontSize="small" />
                    {department.createdAt}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              <Typography variant="body2" fontWeight={500}>
                {error}
              </Typography>
              <Typography variant="caption">
                This department may have employees or other dependencies. Please check and try again.
              </Typography>
            </Alert>
          )}

          {/* Warning Message */}
          <Alert severity="warning" icon={<WarningIcon />}>
            <Typography variant="body1" fontWeight={500} gutterBottom>
              Are you sure you want to delete this department?
            </Typography>
            <Typography variant="body2">
              This action will permanently delete the department and cannot be undone.
              All related data will be removed from the system.
            </Typography>
          </Alert>

          {/* Confirmation Instructions */}
          <Alert severity="info" icon={<InfoIcon />}>
            <Typography variant="body2">
              To confirm deletion, please type{' '}
              <Typography
                component="span"
                sx={{
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  bgcolor: 'grey.200',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1
                }}
              >
                DELETE
              </Typography>
              {' '}in the box below:
            </Typography>
          </Alert>

          {/* Confirmation Input */}
          <TextField
            fullWidth
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            placeholder="Type DELETE to confirm"
            disabled={isDeleting}
            error={confirmText !== '' && confirmText !== 'DELETE'}
            helperText={
              confirmText !== '' && confirmText !== 'DELETE'
                ? 'Please type exactly "DELETE" to confirm'
                : 'Type DELETE in capital letters'
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                fontWeight: 600,
                letterSpacing: 2,
                fontFamily: 'monospace'
              }
            }}
            autoComplete="off"
          />

          {/* Department Details */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: 'error.50',
              border: '1px solid',
              borderColor: 'error.200',
              borderRadius: 2
            }}
          >
            <Typography variant="subtitle2" color="error.dark" gutterBottom fontWeight={600}>
              ⚠️ Warning: Data that will be deleted
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                • Department name: <strong>{departmentName}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Department ID: <strong>{department.id}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Created date: <strong>{department.createdAt}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • All associated records and history
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </DialogContent>

      <Divider />

      {/* Actions */}
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          startIcon={<CancelIcon />}
          disabled={isDeleting}
        >
          Cancel
        </Button>

        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={!canDelete || isDeleting}
          startIcon={isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
          sx={{
            minWidth: 160,
            '&:disabled': {
              backgroundColor: 'grey.300'
            }
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete Department'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDepartmentDialog;