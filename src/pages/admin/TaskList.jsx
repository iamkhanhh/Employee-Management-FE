import React, { useState, useEffect, useMemo } from "react";
import moment from "moment";
import TaskDialog from '../../components/Task/TaskDialog';
import TaskTable from '../../components/Task/TaskTable';
import TaskFilter from '../../components/Task/TaskFilter';
import {
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { taskService } from '../../services/taskService';
import { employeeService } from '../../services/employeeService';
import toast from 'react-hot-toast';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeNames, setEmployeeNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: '' });

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [currentTask, setCurrentTask] = useState({
    id: null,
    title: "",
    dueDate: "",
    description: "",
    assignments: [],
    status: "",
  });

  const fetchTasks = async (currentFilters) => {
    try {
      const response = await taskService.getMyTasks(currentFilters);
      setTasks(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch tasks.");
      toast.error("Failed to fetch tasks.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksResponse, employeesResponse] = await Promise.all([
          taskService.getMyTasks(filters),
          employeeService.getAllEmployees(),
        ]);

        setTasks(tasksResponse.data.data || []);
        const employeeData = employeesResponse.data.data.content;
        setEmployees(employeeData);
        setEmployeeNames(employeeData.map(e => e.fullName || `User ${e.id}`));
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        const errorMsg = "Failed to fetch initial data.";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const openEditDialogForTask = (task) => {
    setCurrentTask({
      id: task.id,
      title: task.title,
      dueDate: moment(task.dueDate, "dd/MM/yyyy").format("dd/MM/yyyy"),
      description: task.description,
      assignments: task.assignments?.map(a => a.employeeName) || [],
      status: task.status,
    });
    console.log("Editing task:", task);
    setEditMode(true);
    setOpen(true);
  };

const handleClickOpen = () => {
  setCurrentTask({
    id: null,
    title: "",
    description: "",
    dueDate: "",
    assignments : [],
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
const toDDMMYYYY = (date) => {
  if (!date) return null;
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const handleSaveTask = async () => {
  // 1️⃣ Validate
  if (!currentTask.title || !currentTask.dueDate) {
    toast.error("Vui lòng nhập Tiêu đề và Hạn chót!");
    return;
  }

  // 2️⃣ Toast loading
  const toastId = toast.loading(
    editMode ? "Đang cập nhật nhiệm vụ..." : "Đang tạo nhiệm vụ..."
  );

  try {
    // 3️⃣ Map assignments → employeeIds
    const employeeIds = currentTask.assignments
      .map(name => employees.find(e => e.fullName === name)?.id)
      .filter(Boolean);

    // 4️⃣ Gọi API
    if (editMode) {
      await taskService.updateStatus(currentTask.id, {
        status: currentTask.status,
      });
    } else {
      await taskService.createTask({
        title: currentTask.title,
        description: currentTask.description,
        dueDate: toDDMMYYYY(currentTask.dueDate),
        employeeIds,
      });
    }

    // 5️⃣ Success toast (update loading toast)
    toast.success(
      editMode
        ? "Cập nhật nhiệm vụ thành công!"
        : "Tạo nhiệm vụ thành công!",
      { id: toastId }
    );
    fetchTasks();
  } catch (error) {
    console.error(error);

    // 7️⃣ Error toast
    toast.error("Có lỗi xảy ra, vui lòng thử lại!", { id: toastId });
  }
};






  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    const taskTitle = taskToDelete.title || 'nhiệm vụ này';
    const loadingToast = toast.loading("Đang xóa nhiệm vụ...");

    try {
      await taskService.deleteTask(taskToDelete.id);
      toast.dismiss(loadingToast);
      toast.success(`Đã xóa nhiệm vụ "${taskTitle}" thành công!`);
      setOpenDeleteDialog(false);
      setTaskToDelete(null);
      await fetchTasks(filters); // Refresh list
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Không thể xóa nhiệm vụ. Vui lòng thử lại!");
    }
  };

  const processedTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.map(task => ({
      ...task,
      start: moment(task.createdAt, "DD/MM/YYYY").format("YYYY-MM-DD"),
      end: moment(task.dueDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      status: task.status,
      assignees: task.assignments?.map(a => a.employeeName) || []
    }));
  }, [tasks]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
          Task Management
        </Typography>
      </Box>

      <TaskFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        handleClickOpen={handleClickOpen}
      />
      <TaskTable
        rows={processedTasks}
        onEdit={openEditDialogForTask}
        onDelete={handleDeleteTask}
      />

      <TaskDialog
        open={open}
        onClose={handleClose}
        currentTask={currentTask}
        onChange={handleChange}
        onSave={handleSaveTask}
        onDelete={() => handleDeleteTask(currentTask)}
        editMode={editMode}
        employees={employees}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn xóa nhiệm vụ <strong>"{taskToDelete?.title || 'này'}"</strong>?
            <br />
            <span style={{ color: '#ef4444', marginTop: '8px', display: 'block' }}>
              Hành động này không thể hoàn tác.
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Hủy
          </Button>
          <Button onClick={confirmDeleteTask} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
