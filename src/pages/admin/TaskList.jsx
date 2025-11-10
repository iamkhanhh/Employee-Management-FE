import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import TaskCalendar from '../../components/Task/TaskCalendar';
import TaskDialog from '../../components/Task/TaskDialog';
import {
  Button,
  Typography,
  Box,
} from "@mui/material";
import { mockEmployees as globalMockEmployees } from '../../data/mockData';

const localizer = momentLocalizer(moment);

export default function TaskList() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState([]);

  // Inline event style getter to override default/global rbc styles
  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: '#60a5fa',
      color: '#ffffff',
      border: 'none',
      boxShadow: 'none',
      borderRadius: '6px',
      padding: '2px 6px',
    };
    return { style };
  };

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
    assignees: [],
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

  // Local function to open edit dialog for a given event object
  const openEditDialogForEvent = (eventObj) => {
    const assigneesArr = Array.isArray(eventObj.assignees) ? eventObj.assignees : (eventObj.assignees ? eventObj.assignees.toString().split(/,\s*/).filter(Boolean) : []);
    setCurrentTask({
      id: eventObj.id,
      title: eventObj.originalTitle || eventObj.title,
      start: moment(eventObj.start).format("YYYY-MM-DDTHH:mm"),
      end: moment(eventObj.end).format("YYYY-MM-DDTHH:mm"),
      description: eventObj.description,
      assignees: assigneesArr,
    });
    setEditMode(true);
    setOpen(true);
  };

  // Mở dialog thêm task
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

  // Mở dialog khi click vào event (fallback)
  const handleSelectEvent = (event) => {
    openEditDialogForEvent(event);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For multiple select, value will be array
    setCurrentTask((prev) => ({ ...prev, [name]: value }));
  };

  // Tạo mới task
  const handleAddTask = () => {
    if (!currentTask.title || !currentTask.start || !currentTask.end) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }

    const assignees = Array.isArray(currentTask.assignees) ? currentTask.assignees : (currentTask.assignees ? [currentTask.assignees] : []);

    const newEvent = {
      id: Date.now(),
      // store originalTitle and assignees separately; title used for quick display in calendar is generated from them
      originalTitle: currentTask.title,
      title: `${currentTask.title}${assignees && assignees.length ? ` — ${assignees.join(', ')}` : ''}`,
      start: new Date(currentTask.start),
      end: new Date(currentTask.end),
      description: currentTask.description,
      assignees,
    };

    setEvents((prev) => [...prev, newEvent]);
    setOpen(false);
  };

  // Cập nhật task
  const handleUpdateTask = () => {
    const assignees = Array.isArray(currentTask.assignees) ? currentTask.assignees : (currentTask.assignees ? [currentTask.assignees] : []);

    setEvents((prev) =>
      prev.map((e) =>
        e.id === currentTask.id
          ? {
              ...e,
              originalTitle: currentTask.title,
              title: `${currentTask.title}${assignees && assignees.length ? ` — ${assignees.join(', ')}` : ''}`,
              start: new Date(currentTask.start),
              end: new Date(currentTask.end),
              description: currentTask.description,
              assignees,
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
      setOpen(false);
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

      <TaskCalendar
        events={events}
        date={date}
        setDate={setDate}
        view={view}
        setView={setView}
        onSelectEvent={handleSelectEvent}
        eventStyleGetter={eventStyleGetter}
      />

      {/* Dialog CRUD Task */}
      <TaskDialog
        open={open}
        onClose={handleClose}
        currentTask={currentTask}
        onChange={handleChange}
        onSave={editMode ? handleUpdateTask : handleAddTask}
        onDelete={handleDeleteTask}
        editMode={editMode}
        employees={employees}
      />
    </Box>
  );
}
