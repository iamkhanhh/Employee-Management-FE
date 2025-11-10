import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { mockEmployees as globalMockEmployees } from '../../data/mockData';

const localizer = momentLocalizer(moment);

export default function TaskList() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState([]);

  // Dialog control
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Chứa task đang được tạo hoặc chỉnh sửa
  const [currentTask, setCurrentTask] = useState({
    id: null,
    title: "",
    start: "",
    end: "",
    description: "",
    assignee: "",
  });

  // Danh sách nhân viên (lấy từ mockData nếu có)
  const [employees, setEmployees] = useState(() => {
    return (globalMockEmployees && globalMockEmployees.length) ? globalMockEmployees.map(e => e.full_name || e.user?.full_name || e.user?.name || e.user?.username || `User ${e.id}`) : [
      "Nguyễn Văn A",
      "Trần Thị B",
      "Lê Văn C",
      "Phạm Thị D",
    ];
  });

  useEffect(() => {
    // Listener để cập nhật khi mockEmployees thay đổi (EmployeeList sẽ dispatch event)
    const handleMockUpdate = () => {
      if (globalMockEmployees && globalMockEmployees.length) {
        setEmployees(globalMockEmployees.map(e => e.full_name || e.user?.full_name || e.user?.name || e.user?.username || `User ${e.id}`));
      }
    };

    window.addEventListener('mockEmployeesUpdated', handleMockUpdate);

    // ensure initial sync
    handleMockUpdate();

    return () => {
      window.removeEventListener('mockEmployeesUpdated', handleMockUpdate);
    };
  }, []);

  // Mở dialog thêm task
  const handleClickOpen = () => {
    setCurrentTask({
      id: null,
      title: "",
      start: "",
      end: "",
      description: "",
      assignee: "",
    });
    setEditMode(false);
    setOpen(true);
  };

  // Mở dialog khi click vào event để chỉnh sửa
  const handleSelectEvent = (event) => {
    setCurrentTask({
      id: event.id,
      title: event.originalTitle || event.title,
      start: moment(event.start).format("YYYY-MM-DDTHH:mm"),
      end: moment(event.end).format("YYYY-MM-DDTHH:mm"),
      description: event.description,
      assignee: event.assignee,
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask((prev) => ({ ...prev, [name]: value }));
  };

  // Tạo mới task
  const handleAddTask = () => {
    if (!currentTask.title || !currentTask.start || !currentTask.end) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title: `${currentTask.title}${currentTask.assignee ? ` — ${currentTask.assignee}` : ''}`,
      // keep originalTitle so we can edit title separately from assignee
      originalTitle: currentTask.title,
      start: new Date(currentTask.start),
      end: new Date(currentTask.end),
      description: currentTask.description,
      assignee: currentTask.assignee,
    };

    setEvents((prev) => [...prev, newEvent]);
    setOpen(false);
  };

  // Cập nhật task
  const handleUpdateTask = () => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === currentTask.id
          ? {
              ...e,
              title: `${currentTask.title}${currentTask.assignee ? ` — ${currentTask.assignee}` : ''}`,
              originalTitle: currentTask.title,
              start: new Date(currentTask.start),
              end: new Date(currentTask.end),
              description: currentTask.description,
              assignee: currentTask.assignee,
            }
          : e
      )
    );
    setOpen(false);
  };

  // Xóa task
  const handleDeleteTask = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhiệm vụ này?")) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Task Calendar
        </Typography>
        <Button variant="contained" onClick={handleClickOpen}>
          + Add Task
        </Button>
      </Box>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh", borderRadius: 8 }}
        toolbar={true}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        view={view}
        onView={(newView) => setView(newView)}
        views={["month", "week", "day", "agenda"]}
        onSelectEvent={handleSelectEvent}
      />

      {/* Dialog CRUD Task */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editMode ? "Edit Task" : "Add New Task"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Task Title"
            name="title"
            fullWidth
            margin="normal"
            value={currentTask.title}
            onChange={handleChange}
          />
          <TextField
            label="Start Date"
            name="start"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={currentTask.start}
            onChange={handleChange}
          />
          <TextField
            label="End Date"
            name="end"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={currentTask.end}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={currentTask.description}
            onChange={handleChange}
          />
          <TextField
            select
            label="Assignee"
            name="assignee"
            fullWidth
            margin="normal"
            value={currentTask.assignee}
            onChange={handleChange}
          >
            {employees.map((emp) => (
              <MenuItem key={emp} value={emp}>
                {emp}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          {editMode && (
            <Tooltip title="Delete Task">
              <IconButton
                color="error"
                onClick={() => handleDeleteTask(currentTask.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={editMode ? handleUpdateTask : handleAddTask}
          >
            {editMode ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
