import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useMyTasks } from '../../hooks/useMyTasks';
import MyTaskTable from '../../components/Task/MyTaskTable';
import TaskFilter from '../../components/Task/TaskFilter';

const MyTasks = () => {
  const { tasks, loading, error, filters, onFilterChange, updateTaskStatus } = useMyTasks();

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
        <MyTaskTable tasks={tasks} onStatusChange={updateTaskStatus} />
      </Box>
    </Container>
  );
};

export default MyTasks;
