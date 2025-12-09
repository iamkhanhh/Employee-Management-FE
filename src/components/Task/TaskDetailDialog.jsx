import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip
} from '@mui/material';
import moment from 'moment';

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

const TaskDetailDialog = ({ open, onClose, task }) => {
  if (!task) {
    return null;
  }

  const { bg, color } = getStatusStyle(task.status);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Task Details</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {task.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {task.description}
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <div>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={task.status}
              size="small"
              sx={{ backgroundColor: bg, color, fontWeight: 500 }}
            />
          </div>
          <div>
            <Typography variant="subtitle2" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body1">
              {moment(task.createdAt).format('DD/MM/YYYY')}
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle2" color="text.secondary">
              Due Date
            </Typography>
            <Typography variant="body1">
              {moment(task.dueDate, "DD/MM/YYYY").format("DD/MM/YYYY")}
            </Typography>
          </div>
          {task.assignees && task.assignees.length > 0 && (
            <div>
              <Typography variant="subtitle2" color="text.secondary">
                Assignees
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {task.assignees.map((assignee) => (
                  <Chip key={assignee.id} label={assignee.employeeName} />
                ))}
              </Box>
            </div>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailDialog;
