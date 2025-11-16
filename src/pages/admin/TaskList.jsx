import React, { useState, useEffect, useMemo } from "react";
import moment from "moment";
import TaskDialog from '../../components/Task/TaskDialog';
import TaskTable from '../../components/Task/TaskTable';
import {
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { mockEmployees as globalMockEmployees } from '../../data/mockData';
import toast from 'react-hot-toast';

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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
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
    toast.error("Vui lòng nhập đủ thông tin: Tiêu đề, Ngày bắt đầu và Ngày kết thúc!");
    return;
  }

  const startDate = new Date(currentTask.start);
  const endDate = new Date(currentTask.end);
  
  if (endDate < startDate) {
    toast.error("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!");
    return;
  }

  const loadingToast = toast.loading("Đang tạo nhiệm vụ...");
  
  try {
    const assignees = Array.isArray(currentTask.assignees)
      ? currentTask.assignees
      : (currentTask.assignees ? [currentTask.assignees] : []);

    const newTask = {
      id: taskIdCounter,     
      title: currentTask.title,
      start: startDate,
      end: endDate,
      description: currentTask.description,
      assignees,
    };

    setTasks((prev) => [...prev, newTask]);

    // Tăng ID lên 1 mỗi lần thêm
    setTaskIdCounter(prev => prev + 1);

    toast.dismiss(loadingToast);
    toast.success(`Đã tạo nhiệm vụ "${currentTask.title}" thành công!`);
    setOpen(false);
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error("Không thể tạo nhiệm vụ. Vui lòng thử lại!");
  }
};


  const handleUpdateTask = () => {
    if (!currentTask.title || !currentTask.start || !currentTask.end) {
      toast.error("Vui lòng nhập đủ thông tin: Tiêu đề, Ngày bắt đầu và Ngày kết thúc!");
      return;
    }

    const startDate = new Date(currentTask.start);
    const endDate = new Date(currentTask.end);
    
    if (endDate < startDate) {
      toast.error("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!");
      return;
    }

    const loadingToast = toast.loading("Đang cập nhật nhiệm vụ...");
    
    try {
      const assignees = Array.isArray(currentTask.assignees) ? currentTask.assignees : (currentTask.assignees ? [currentTask.assignees] : []);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === currentTask.id
            ? {
                ...task,
                title: currentTask.title,
                start: startDate,
                end: endDate,
                description: currentTask.description,
                assignees,
              }
            : task
        )
      );
      
      toast.dismiss(loadingToast);
      toast.success(`Đã cập nhật nhiệm vụ "${currentTask.title}" thành công!`);
      setOpen(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Không thể cập nhật nhiệm vụ. Vui lòng thử lại!");
    }
  };

  const handleDeleteTask = (taskToDelete) => {
    setTaskToDelete(taskToDelete);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    
    const task = tasks.find(t => t.id === taskToDelete.id);
    const taskTitle = task?.title || 'nhiệm vụ này';
    
    const loadingToast = toast.loading("Đang xóa nhiệm vụ...");
    try {
      setTasks((prev) => prev.filter((task) => task.id !== taskToDelete.id));
      toast.dismiss(loadingToast);
      toast.success(`Đã xóa nhiệm vụ "${taskTitle}" thành công!`);
      setOpenDeleteDialog(false);
      setTaskToDelete(null);
      setOpen(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Không thể xóa nhiệm vụ. Vui lòng thử lại!");
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setTaskToDelete(null);
        }}
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn xóa nhiệm vụ <strong>"{tasks.find(t => t.id === taskToDelete?.id)?.title || 'này'}"</strong>?
            <br />
            <span style={{ color: '#ef4444', marginTop: '8px', display: 'block' }}>
              Hành động này không thể hoàn tác.
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDeleteDialog(false);
            setTaskToDelete(null);
          }}>
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
