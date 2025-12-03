import { useState, useEffect, useMemo } from 'react';
import { taskService } from '../services/taskService';

export const useMyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ searchTerm: '', status: '' });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getMyTasks();
      setTasks(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await taskService.updateStatus(taskId, status);
      await fetchTasks(); // Refetch tasks to get the updated list
    } catch (err) {
      console.error('Failed to update task status', err);
      // Optionally, show an error message to the user
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchTermMatch = task.title.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const statusMatch = filters.status ? task.status === filters.status : true;
      return searchTermMatch && statusMatch;
    });
  }, [tasks, filters]);

  return {
    tasks: filteredTasks,
    loading,
    error,
    filters,
    onFilterChange: handleFilterChange,
    updateTaskStatus,
    refetch: fetchTasks,
  };
};
