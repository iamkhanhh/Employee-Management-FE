import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  Avatar,
  Grid,
  Paper,
  Divider,
  LinearProgress,
  Alert,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  Tag as TagIcon
} from '@mui/icons-material';
import { formatDate } from '../../../utils/dateUtils';

const ViewDepartmentDialog = ({ open, onClose, departmentId, fetchDepartmentDetail, onEdit }) => {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state khi dialog được mở
    if (open) {
      setDepartment(null);
      setError(null);
    }

    if (!departmentId || !open) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchDepartmentDetail(departmentId);

        // Kiểm tra response từ API
        if (res && res.status === 'success' && res.code === 0) {
          setDepartment(res.data);
          setError(null);
        } else {
          setError(res?.message || "Failed to fetch department details.");
          setDepartment(null);
        }
      } catch (err) {
        console.error("Error in ViewDepartmentDialog:", err);
        setError("An unexpected error occurred.");
        setDepartment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [departmentId, open, fetchDepartmentDetail]);

  // Loading state
  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Loading...</DialogTitle>
        <DialogContent>
          <LinearProgress />
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography>Loading department details...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (error || !department) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm">
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Alert severity="error">{error || "No department data found."}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Success state - Hiển thị data
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pb: 3
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                width: 56,
                height: 56
              }}
            >
              <BusinessIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {department.deptName}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                ID: {department.id}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              onClick={() => {
                onClose();
                onEdit(department);
              }}
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Edit
            </Button>
            <IconButton
              onClick={onClose}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {/* Department Information */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid #e0e0e0',
                borderRadius: 2
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#1976d2',
                  mb: 2
                }}
              >
                <BusinessIcon sx={{ mr: 1 }} />
                Department Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {/* Department ID */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TagIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Department ID
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {department.id}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Department Name */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Department Name
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {department.deptName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Created Date */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Created Date
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {department.createdAt}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDepartmentDialog;