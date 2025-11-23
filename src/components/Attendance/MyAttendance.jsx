// src/components/MyAttendance.jsx
import React, { useState, useEffect, useCallback } from "react";
import AttendanceCalendar from "./AttendanceCalendar";
import { Box, Button, Stack, Typography, Paper, CircularProgress } from "@mui/material";
import moment from "moment";
import { attendanceService } from "../../services/attendanceService" // đường dẫn theo dự án của bạn

// --- Shift Schedule ---
const MORNING_SHIFT_START = { hour: 8, minute: 30 };
const MORNING_SHIFT_END = { hour: 12, minute: 0 };
const AFTERNOON_SHIFT_START = { hour: 13, minute: 30 };
const AFTERNOON_SHIFT_END = { hour: 18, minute: 0 };

const getTodayWithTime = (hour, minute) =>
  moment().set({ hour, minute, second: 0, millisecond: 0 });

const formatAttendanceToEvent = (item) => {
  // item có thể có: date, checkIn, checkOut, lateMinutes, earlyMinutes, status, shiftType
  const dayMoment = item.checkIn ? moment(item.checkIn).startOf("day") : (item.date ? moment(item.date).startOf("day") : moment().startOf("day"));
  const start = dayMoment.toDate();
  const end = moment(dayMoment).add(1, "minute").toDate();

  return {
    id: item.id ?? `${dayMoment.format("YYYYMMDD")}`,
    title: getEventTitle(item),
    start,
    end,
    allDay: false,
    actualCheckIn: item.checkIn ? new Date(item.checkIn) : null,
    actualCheckOut: item.checkOut ? new Date(item.checkOut) : null,
    checkIn: item.checkIn ?? null,
    checkOut: item.checkOut ?? null,
    lateMinutes: item.lateMinutes ?? 0,
    earlyMinutes: item.earlyMinutes ?? 0,
    status: item.status ?? null,
    shiftType: item.shiftType ?? "full",
    bgColor: getEventColor(item.status, item.shiftType),
  };
};

const getEventTitle = (item) => {
  if (item.shiftType === "half") return "Đi nửa ca";
  if (item.status === "late") return `Đi muộn ${item.lateMinutes ?? 0} phút`;
  if (item.status === "absent") return "Vắng";
  return "Đúng giờ";
};

const getEventColor = (status, shiftType) => {
  if (!status) return "#F44336"; // nghỉ làm / unknown
  if (shiftType === "half") return "#9C27B0"; // nửa ca tím đậm
  if (status === "late") return "#FFC107"; // vàng đậm
  if (status === "present") return "#4CAF50"; // xanh lá đậm
  return "#4CAF50";
};


export default function MyAttendance() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load my attendance history
  const loadMyAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Lấy tháng & năm hiện tại (hoặc bạn tự truyền khi cần)
      const month = moment().month() + 1; 
      const year  = moment().year();

      // Gọi API lấy chấm công của user đang login
      const res = await attendanceService.getMyRecords({ month, year });

      const data = res?.data ?? [];

      // Dữ liệu backend có thể trả về dạng array hoặc object → normalize
      const records = Array.isArray(data)
        ? data
        : (data.records ?? []);

      // Format để render lên calendar
      const formatted = records.map(formatAttendanceToEvent);
      setEvents(formatted);

      // Lấy chấm công hôm nay
      const todayRecord =
        formatted.find((item) =>
          moment(item.start).isSame(moment(), "day")
        ) ?? null;

      setAttendanceToday(todayRecord);

    } catch (err) {
      console.error("Lỗi load attendance:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);



  useEffect(() => {
    loadMyAttendance();
  }, [loadMyAttendance]);

  // Check In API
  const handleCheckIn = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      // Nếu API của bạn cần body (ví dụ shiftType), truyền vào object. Nếu không, gọi rỗng.
      const res = await attendanceService.checkIn(); // POST /attendance/check-in
      // res.data có thể là record mới; tốt nhất là refresh dữ liệu từ server
      await loadMyAttendance();
    } catch (err) {
      console.error("Check in lỗi:", err);
      setError(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Check Out API
  const handleCheckOut = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const res = await attendanceService.checkOut(); // POST /attendance/check-out
      await loadMyAttendance();
    } catch (err) {
      console.error("Check out lỗi:", err);
      setError(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Event style for calendar
  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.bgColor || "#d8f5d1",
      borderRadius: "8px",
      padding: "6px",
      color: "#000",
      border: "1px solid #ddd",
      fontSize: 12,
    },
  });

  const EventItem = ({ event }) => {
    const actualIn = event.actualCheckIn ? moment(event.actualCheckIn).format("HH:mm:ss") : null;
    const actualOut = event.actualCheckOut ? moment(event.actualCheckOut).format("HH:mm:ss") : null;

    return (
      <Box sx={{ p: 0.5, height: "100%" }}>
        <strong style={{ display: "block", marginBottom: 4 }}>{event.title}</strong>
        {actualIn && <div style={{ fontSize: 12 }}>Check-in: {actualIn}</div>}
        {actualOut && <div style={{ fontSize: 12 }}>Check-out: {actualOut}</div>}
        {event.lateMinutes > 0 && <div style={{ color: "orange", fontSize: 11 }}>Muộn: {event.lateMinutes} phút</div>}
        {event.earlyMinutes > 0 && <div style={{ color: "red", fontSize: 11 }}>Sớm: {event.earlyMinutes} phút</div>}
      </Box>
    );
  };

  // disable/enable nút dựa vào dữ liệu từ server (attendanceToday)
  const hasCheckedInToday = attendanceToday && attendanceToday.actualCheckIn;
  const hasCheckedOutToday = attendanceToday && attendanceToday.actualCheckOut;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Chấm công của tôi
      </Typography>

      <Stack direction="row" spacing={2} mb={3} alignItems="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckIn}
          disabled={!!hasCheckedInToday || actionLoading}
        >
          {actionLoading && !hasCheckedInToday ? <CircularProgress size={20} color="inherit" /> : "Check In"}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleCheckOut}
          disabled={!hasCheckedInToday || !!hasCheckedOutToday || actionLoading}
        >
          {actionLoading && hasCheckedInToday && !hasCheckedOutToday ? <CircularProgress size={20} color="inherit" /> : "Check Out"}
        </Button>

        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Đang tải lịch sử...
            </Typography>
          </Box>
        )}
      </Stack>

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          Lỗi: {error.message ?? "Không thể tải dữ liệu chấm công."}
        </Typography>
      )}

      <AttendanceCalendar
        events={events}
        date={date}
        setDate={setDate}
        views={["month"]}
        eventStyleGetter={eventStyleGetter}
        components={{ event: EventItem }}
      />
    </Paper>
  );
}
