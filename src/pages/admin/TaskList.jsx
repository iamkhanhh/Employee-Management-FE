import React, { useState, useEffect, useMemo } from "react";
import moment from "moment";
import TaskDialog from '../../components/Task/TaskDialog';
import TaskTable from '../../components/Task/TaskTable';
import {
  Button,
  Typography,
  Box,
} from "@mui/material";
import { mockEmployees as globalMockEmployees } from '../../data/mockData';

// Function to determine task status
const getStatus = (start, end) => {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (now < startDate) return 'pending';
  if (now > endDate) return 'completed';
  return 'in-progress';
};


export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    id: null,
    title: "",
    start: "",
    end: "",
    description: "",
    assignees: [],
  });
  const [employees, setEmployees] = useState(() => {
    return (globalMockEmployees && globalMockEmployees.length) ? globalMockEmployees.map(e => e.full_name || e.user?.full_name || e.user?.name || e.user?.username || `User ${e.id}`) : [
      "Nguyễn Văn A",
      "Trần Thị B",
      "Lê Văn C",
      "Phạm Thị D",
    ];
  });
  const [taskIdCounter, setTaskIdCounter] = useState(1);

  useEffect(() => {
    const handleMockUpdate = () => {
      if (globalMockEmployees && globalMockEmployees.length) {
        setEmployees(globalMockEmployees.map(e => e.full_name || e.user?.full_name || e.user?.name || e.user?.username || `User ${e.id}`));
      }
    };

    window.addEventListener('mockEmployeesUpdated', handleMockUpdate);
    handleMockUpdate();

    return () => {
      window.removeEventListener('mockEmployeesUpdated', handleMockUpdate);
    };
  }, []);

  const openEditDialogForTask = (task) => {
    const assigneesArr = Array.isArray(task.assignees) ? task.assignees : (task.assignees ? task.assignees.toString().split(/,\s*/).filter(Boolean) : []);
    setCurrentTask({
      id: task.id,
      title: task.title,
      start: moment(task.start).format("YYYY-MM-DDTHH:mm"),
      end: moment(task.end).format("YYYY-MM-DDTHH:mm"),
      description: task.description,
      assignees: assigneesArr,
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleClickOpen = () => {
    setCurrentTask({
      id: null,
      title: "",
      start: "",
      end: "",
      description: "",
      assignees: [],
    });
    setEditMode(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask((prev) => ({ ...prev, [name]: value }));
  };

const handleAddTask = () => {
  if (!currentTask.title || !currentTask.start || !currentTask.end) {
    alert("Vui lòng nhập đủ thông tin!");
    return;
  }

  const assignees = Array.isArray(currentTask.assignees)
    ? currentTask.assignees
    : (currentTask.assignees ? [currentTask.assignees] : []);

  const newTask = {
    id: taskIdCounter,     
    title: currentTask.title,
    start: new Date(currentTask.start),
    end: new Date(currentTask.end),
    description: currentTask.description,
    assignees,
  };

  setTasks((prev) => [...prev, newTask]);

  // Tăng ID lên 1 mỗi lần thêm
  setTaskIdCounter(prev => prev + 1);

  setOpen(false);
};


  const handleUpdateTask = () => {
    const assignees = Array.isArray(currentTask.assignees) ? currentTask.assignees : (currentTask.assignees ? [currentTask.assignees] : []);

    setTasks((prev) =>
      prev.map((task) =>
        task.id === currentTask.id
          ? {
              ...task,
              title: currentTask.title,
              start: new Date(currentTask.start),
              end: new Date(currentTask.end),
              description: currentTask.description,
              assignees,
            }
          : task
      )
    );
    setOpen(false);
  };

  const handleDeleteTask = (taskToDelete) => {
    if (window.confirm("Bạn có chắc muốn xóa nhiệm vụ này?")) {
      setTasks((prev) => prev.filter((task) => task.id !== taskToDelete.id));
      setOpen(false);
    }
  };

  const tasksWithStatus = useMemo(() => tasks.map(task => ({
    ...task,
    start: moment(task.start).format('YYYY-MM-DD HH:mm'),
    end: moment(task.end).format('YYYY-MM-DD HH:mm'),
    status: getStatus(task.start, task.end)
  })), [tasks]);

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Task Management
        </Typography>
        <Button variant="contained" onClick={handleClickOpen}>
          + Add Task
        </Button>
      </Box>

      <TaskTable
        rows={tasksWithStatus}
        onEdit={openEditDialogForTask}
        onDelete={handleDeleteTask}
      />

      <TaskDialog
        open={open}
        onClose={handleClose}
        currentTask={currentTask}
        onChange={handleChange}
        onSave={editMode ? handleUpdateTask : handleAddTask}
        onDelete={() => handleDeleteTask({ id: currentTask.id })}
        editMode={editMode}
        employees={employees}
      />
    </Box>
  );
}
