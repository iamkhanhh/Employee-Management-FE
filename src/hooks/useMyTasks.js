import { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { taskService } from '../services/taskService';

export const useMyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ year: '', month: '', status: '' });

  const fetchTasks = async (currentFilters) => {
    try {
      setLoading(true);
      const response = await taskService.getMyTasks(currentFilters);
      setTasks(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(filters);
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await taskService.updateStatus(taskId, status);
      await fetchTasks(filters);
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  return {
    tasks: tasks,
    loading,
    error,
    filters,
    onFilterChange: handleFilterChange,
    updateTaskStatus,
    refetch: () => fetchTasks(filters),
  };
};
