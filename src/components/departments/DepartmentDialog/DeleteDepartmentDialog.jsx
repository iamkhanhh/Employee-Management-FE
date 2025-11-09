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
          <Typography variant="h6">Xác nhận xóa phòng ban</Typography>
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
                  Không thể xóa phòng ban này!
                </Typography>
                <Typography variant="body2">
                  Phòng ban đang có {departmentEmployees.length} nhân viên đang làm việc.
                  Vui lòng chuyển nhân viên sang phòng ban khác trước khi xóa.
                </Typography>
              </Alert>

              {/* List of employees */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <GroupIcon sx={{ mr: 1 }} />
                  Danh sách nhân viên trong phòng ban:
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
                                  <Chip label="Trưởng phòng" size="small" color="error" />
                                )}
                                {emp.role_in_dept === 'DEPUTY' && (
                                  <Chip label="Phó phòng" size="small" color="warning" />
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
                  Bạn có chắc chắn muốn xóa phòng ban này?
                </Typography>
                <Typography variant="body2">
                  Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến phòng ban sẽ bị xóa vĩnh viễn.
                </Typography>
              </Alert>

              <Alert severity="info" icon={<InfoIcon />}>
                <Typography variant="body2">
                  Để xác nhận xóa, vui lòng nhập <strong>DELETE</strong> vào ô bên dưới:
                </Typography>
              </Alert>

              <TextField
                fullWidth
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Nhập DELETE để xác nhận"
                error={confirmText !== '' && confirmText !== 'DELETE'}
                helperText={
                  confirmText !== '' && confirmText !== 'DELETE'
                    ? 'Vui lòng nhập chính xác "DELETE"'
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
                  Thông tin phòng ban:
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    • Ngày tạo: {department?.created_at ? new Date(department.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Số nhân viên: {departmentEmployees.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Trạng thái: {department?.is_deleted ? 'Đã xóa' : 'Đang hoạt động'}
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
          Hủy
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
            {isDeleting ? 'Đang xóa...' : 'Xóa phòng ban'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDepartmentDialog;