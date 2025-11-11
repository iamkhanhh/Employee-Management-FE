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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Chip,
  Paper,
  TextField
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { mockEmployees } from '../../../data/mockData';

const DeleteDepartmentDialog = ({
  open,
  onClose,
  onConfirm,
  departmentName,
  department
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Get employees in this department
  const departmentEmployees = department ?
    mockEmployees.filter(emp =>
      emp.dept_id === department?.id &&
      emp.status === 'ACTIVE' &&
      !emp.is_deleted
    ) : [];

  const hasEmployees = departmentEmployees.length > 0;
  const canDelete = !hasEmployees && confirmText === 'DELETE';

  const handleConfirm = async () => {
    if (!canDelete) return;

    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
    handleClose();
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{
        backgroundColor: '#f44336',
        color: 'white'
      }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <DeleteIcon />
          <Typography variant="h6">Confirm Department Deletion</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={3}>
          {/* Department Info */}
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{
                bgcolor: '#f44336',
                width: 48,
                height: 48
              }}>
                <BusinessIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {departmentName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: DEPT{String(department?.id).padStart(3, '0')}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Warning Message */}
          {hasEmployees ? (
            <>
              <Alert severity="error" icon={<WarningIcon />}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Cannot delete this department!
                </Typography>
                <Typography variant="body2">
                  There are {departmentEmployees.length} employees in this department.
                  Please transfer them to another department before deletion.
                </Typography>
              </Alert>

              {/* List of employees */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <GroupIcon sx={{ mr: 1 }} />
                  Employees in this department:
                </Typography>
                <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                  <List dense>
                    {departmentEmployees.map((emp, index) => (
                      <React.Fragment key={emp.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {emp.full_name.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={emp.full_name}
                            secondary={
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="caption">
                                  {emp.position?.position_name}
                                </Typography>
                                {emp.role_in_dept === 'HEAD' && (
                                  <Chip label="Head" size="small" color="error" />
                                )}
                                {emp.role_in_dept === 'DEPUTY' && (
                                  <Chip label="Deputy" size="small" color="warning" />
                                )}
                              </Stack>
                            }
                          />
                        </ListItem>
                        {index < departmentEmployees.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Box>
            </>
          ) : (
            <>
              <Alert severity="warning" icon={<WarningIcon />}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Are you sure you want to delete this department?
                </Typography>
                <Typography variant="body2">
                  This action cannot be undone. All data related to the department will be permanently deleted.
                </Typography>
              </Alert>

              <Alert severity="info" icon={<InfoIcon />}>
                <Typography variant="body2">
                  To confirm deletion, please type <strong>DELETE</strong> in the box below:
                </Typography>
              </Alert>

              <TextField
                fullWidth
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                error={confirmText !== '' && confirmText !== 'DELETE'}
                helperText={
                  confirmText !== '' && confirmText !== 'DELETE'
                    ? 'Please type exactly "DELETE"'
                    : ''
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontWeight: 600,
                    letterSpacing: 1
                  }
                }}
              />

              {/* Additional Info */}
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Department Info:
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    • Created Date: {department?.created_at ? new Date(department.created_at).toLocaleDateString('en-US') : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Number of Employees: {departmentEmployees.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Status: {department?.is_deleted ? 'Deleted' : 'Active'}
                  </Typography>
                </Stack>
              </Paper>
            </>
          )}
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          startIcon={<CancelIcon />}
        >
          Cancel
        </Button>

        {!hasEmployees && (
          <Button
            onClick={handleConfirm}
            color="error"
            variant="contained"
            disabled={!canDelete || isDeleting}
            startIcon={<DeleteIcon />}
            sx={{
              '&:disabled': {
                backgroundColor: 'grey.300'
              }
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Department'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDepartmentDialog;
