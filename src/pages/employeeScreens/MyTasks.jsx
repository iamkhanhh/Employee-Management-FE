import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useMyTasks } from '../../hooks/useMyTasks';
import MyTaskTable from '../../components/Task/MyTaskTable';
import TaskFilter from '../../components/Task/TaskFilter';
import TaskDetailDialog from '../../components/Task/TaskDetailDialog';

const MyTasks = () => {
  const { tasks, loading, error, filters, onFilterChange, updateTaskStatus } = useMyTasks();
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleViewDetail = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    console.log("Selected task:", task.dueDate);
    setSelectedTask(task);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedTask(null);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Failed to fetch tasks.</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Tasks
        </Typography>
        <TaskFilter filters={filters} onFilterChange={onFilterChange} />
        <MyTaskTable
          tasks={tasks}
          onStatusChange={updateTaskStatus}
          onViewDetail={handleViewDetail}
        />
      </Box>
      <TaskDetailDialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        task={selectedTask}
      />
    </Container>
  );
};

export default MyTasks;
